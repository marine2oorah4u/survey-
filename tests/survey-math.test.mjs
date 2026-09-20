import test from 'node:test';
import assert from 'node:assert/strict';
import {corners,wrap,reading,fromReading,area,error,perimeter,trueArea,truePerimeter,summary} from '../dist/survey-math.js';

const exactPlots = Object.fromEntries(corners.map(p => [p.id, {x: p.x, z: p.z}]));

test('wrap keeps angles in 0..360', () => {
  assert.equal(wrap(0), 0);
  assert.equal(wrap(360), 0);
  assert.equal(wrap(-90), 270);
  assert.equal(wrap(450), 90);
});

test('P2 sits on the north reference', () => {
  const r = reading(corners[1]);
  assert.equal(r.angle, 0);
  assert.equal(r.distance, 38);
});

test('bearings run clockwise from north', () => {
  assert.ok(Math.abs(reading({x: 10, z: 0}).angle - 90) < 1e-9);
  assert.ok(Math.abs(reading({x: 0, z: 10}).angle - 180) < 1e-9);
  assert.ok(Math.abs(reading({x: -10, z: 0}).angle - 270) < 1e-9);
});

test('fromReading inverts reading for every corner', () => {
  for (const p of corners.slice(1)) {
    const r = reading(p);
    const back = fromReading(r.angle, r.distance);
    assert.ok(error(p, back) < 1e-9, `${p.id} round trip`);
  }
});

test('the boundary matches the documented 2960 square metres', () => {
  assert.equal(Math.round(area(corners)), 2960);
  assert.equal(trueArea, area(corners));
  assert.ok(Math.abs(truePerimeter - perimeter(corners)) < 1e-12);
});

test('area ignores winding direction', () => {
  assert.ok(Math.abs(area([...corners].reverse()) - area(corners)) < 1e-9);
});

test('a perfect plot scores 100 and passes', () => {
  const s = summary(exactPlots);
  assert.equal(s.score, 100);
  assert.equal(s.pass, true);
  assert.equal(s.avg, 0);
  assert.equal(Math.round(s.plottedArea), 2960);
  assert.equal(s.areaPercent, 0);
});

test('the 1.5 m practice tolerance is the pass boundary', () => {
  const near = {...exactPlots, P3: {x: corners[2].x + 1.4, z: corners[2].z}};
  const far = {...exactPlots, P3: {x: corners[2].x + 1.6, z: corners[2].z}};
  assert.equal(summary(near).pass, true);
  assert.equal(summary(far).pass, false);
  assert.equal(summary(far).worst.id, 'P3');
});

test('scores fall as the plot drifts and never go negative', () => {
  const drift = d => summary(Object.fromEntries(corners.map(p => [p.id, {x: p.x + (p.id === 'P1' ? 0 : d), z: p.z}])));
  assert.ok(drift(2).score < drift(1).score);
  assert.equal(drift(400).score, 0);
});

test('readings a player types back reproduce the true corners', () => {
  const plots = {P1: {x: 0, z: 0}};
  for (const p of corners.slice(1)) {
    const r = reading(p);
    plots[p.id] = fromReading(Number(r.angle.toFixed(2)), Number(r.distance.toFixed(2)));
  }
  const s = summary(plots);
  assert.ok(s.avg < 0.02, `two-decimal notes should plot within 2 cm, got ${s.avg}`);
  assert.equal(s.pass, true);
});
