// End-to-end playthrough in headless Chromium (SwiftShader). Plays the whole survey:
// set up at P1, sight and record P2-P5, plot them, check the map, then reload to prove the save.
import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdir, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';
import {serve} from './serve.mjs';
import {corners, reading} from '../dist/survey-math.js';
import {terrain, prismHeight, eyeHeight} from '../dist/terrain.js';

const SHOTS = new URL('../screenshots/', import.meta.url);
const shot = name => fileURLToPath(new URL(name, SHOTS));
const LOOK = 0.0025;            // radians per pixel of drag while the instrument is set up
const CENTER = {x: 640, y: 400};
const EYE = terrain(0, 0) + eyeHeight;

const text = (page, sel) => page.$eval(sel, el => el.textContent.trim());

// Mirrors the aim the game gives the instrument the moment it is set up at P1.
const aimAt = p => ({
  yaw: reading(p).angle * Math.PI / 180,
  pitch: Math.atan2(terrain(p.x, p.z) + prismHeight - EYE, Math.hypot(p.x, p.z)),
});
const startPitch = Math.atan2(terrain(corners[1].x, corners[1].z) + prismHeight - EYE, 38);

async function dragBy(page, dx, dy) {
  const chunks = Math.max(1, Math.ceil(Math.abs(dx) / 420));
  for (let i = 0; i < chunks; i++) {
    await page.mouse.move(CENTER.x, CENTER.y);
    await page.mouse.down();
    await page.mouse.move(CENTER.x + dx / chunks, CENTER.y + (i ? 0 : dy));
    await page.mouse.up();
  }
}

test('a Scout can complete and reload the whole survey', async t => {
  const {server, port} = await serve();
  const browser = await chromium.launch({args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist']});
  const page = await browser.newPage({viewport: {width: 1280, height: 800}});
  const problems = [];
  page.on('pageerror', e => problems.push(`pageerror: ${e.message}`));
  page.on('console', m => m.type() === 'error' && problems.push(`console: ${m.text()}`));
  await mkdir(SHOTS, {recursive: true});
  t.after(async () => { await browser.close(); server.close(); });

  await page.goto(`http://127.0.0.1:${port}/`, {waitUntil: 'networkidle'});
  await page.waitForTimeout(2500);

  await t.test('the scene renders through WebGL', async () => {
    const renders = await page.evaluate(() => {
      const canvas = document.querySelector('#world canvas');
      const gl = canvas?.getContext('webgl2') || canvas?.getContext('webgl');
      return Boolean(gl) && canvas.width > 0 && !document.getElementById('loading');
    });
    assert.ok(renders, 'WebGL canvas is live and the loading notice is gone');
  });

  await page.click('#startBtn');
  await page.screenshot({path: shot('01-field.png')});

  await t.test('the instrument sets up at P1', async () => {
    await page.click('#mainAction');
    await page.waitForTimeout(400);
    assert.equal(await text(page, '#stationLabel'), 'STATION P1 · NORTH REFERENCE');
    assert.ok(await page.isVisible('#exitInstrument'));
  });

  const expected = Object.fromEntries(corners.slice(1).map(p => [p.id, reading(p)]));

  await t.test('every corner can be sighted and recorded', async () => {
    let yaw = 0, pitch = startPitch;                 // the view the game starts the instrument with
    for (const p of corners.slice(1)) {
      const want = aimAt(p);
      await dragBy(page, (want.yaw - yaw) / LOOK, -(want.pitch - pitch) / LOOK);
      yaw = want.yaw; pitch = want.pitch;
      assert.equal(await text(page, '#targetName'), p.id, `sighting ${p.id}`);
      const shown = Number((await text(page, '#distance')).replace(' m', ''));
      assert.ok(Math.abs(shown - expected[p.id].distance) < 0.02, `${p.id} distance readout`);
      assert.ok(Math.abs(Number((await text(page, '#angle')).replace('°', '')) - expected[p.id].angle) < 0.02, `${p.id} angle readout`);
      await page.click('#mainAction');
    }
    assert.equal(await text(page, '#count'), '4 of 4 corners measured');
    assert.equal(await text(page, '#noteBadge'), '4');
  });
  await page.screenshot({path: shot('02-instrument.png')});

  await t.test('field notes plot onto the map', async () => {
    await page.click('#notebookBtn');
    for (const p of corners.slice(1)) {
      await page.click(`#noteList button:nth-of-type(${corners.findIndex(c => c.id === p.id)})`);
      const [angle, distance] = await page.$$eval('#noteList button.active span', els => els.map(e => e.textContent));
      await page.fill('#plotAngle', angle.replace('°', ''));
      await page.fill('#plotDistance', distance.replace(' m', ''));
      await page.click('#placeBtn');
    }
    assert.match(await text(page, '#plotStatus'), /placed/);
  });
  await page.screenshot({path: shot('03-notebook.png')});

  await t.test('checking the survey closes the job out', async () => {
    await page.click('#checkBtn');
    await page.waitForSelector('#doneDialog[open]');
    assert.equal(await text(page, '#finalScore'), '100');
    assert.equal(await text(page, '#finalAvg'), '0.00 m');
    assert.equal(await text(page, '#finalArea'), '2960 m²');
    assert.match(await text(page, '#finalNote'), /2960 m²/);
    assert.match(await text(page, '#result'), /Survey complete!/);
  });
  await page.screenshot({path: shot('04-summary.png')});

  await t.test('the field book survives a reload', async () => {
    await page.reload({waitUntil: 'networkidle'});
    await page.waitForTimeout(1500);
    await page.click('#startBtn');
    assert.equal(await text(page, '#noteBadge'), '4');
    assert.match(await text(page, '#objective'), /Survey filed/);
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('field-survey/willow-creek/v1')));
    assert.equal(saved.completed, true);
    assert.equal(saved.best, 100);
    assert.equal(Object.keys(saved.records).length, 4);
  });

  await t.test('resetting clears the field book', async () => {
    page.on('dialog', d => d.accept());
    await page.click('#notebookBtn');
    await page.click('#resetBtn');
    await page.waitForTimeout(200);
    assert.equal(await text(page, '#noteBadge'), '0');
    assert.match(await text(page, '#objective'), /Set up your instrument/);
  });

  await writeFile(shot('console.log'), problems.join('\n'));
  assert.deepEqual(problems, [], 'no console or page errors during the playthrough');
});
