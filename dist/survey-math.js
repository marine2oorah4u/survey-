export const corners = [{id:'P1',x:0,z:0},{id:'P2',x:0,z:-38},{id:'P3',x:42,z:-54},{id:'P4',x:65,z:-16},{id:'P5',x:36,z:14}];
export const wrap = d => ((d % 360) + 360) % 360;
export function reading(p){return {angle:wrap(Math.atan2(p.x,-p.z)*180/Math.PI),distance:Math.hypot(p.x,p.z)};}
export function fromReading(angle,distance){const r=angle*Math.PI/180;return {x:Math.sin(r)*distance,z:-Math.cos(r)*distance};}
export function area(points){return Math.abs(points.reduce((a,p,i)=>{const q=points[(i+1)%points.length];return a+p.x*q.z-q.x*p.z;},0)/2);}
export function error(a,b){return Math.hypot(a.x-b.x,a.z-b.z);}
export function perimeter(points){return points.reduce((total,p,i)=>{const q=points[(i+1)%points.length];return total+Math.hypot(p.x-q.x,p.z-q.z);},0);}
export const trueArea=area(corners);
export const truePerimeter=perimeter(corners);
// Scores a finished plot: per-corner error against the real boundary, plus area and perimeter closure.
export function summary(plots){const errors=corners.slice(1).map(p=>({id:p.id,error:error(p,plots[p.id])}));const avg=errors.reduce((t,e)=>t+e.error,0)/errors.length;const worst=errors.reduce((m,e)=>e.error>m.error?e:m);const plotted=corners.map(p=>plots[p.id]);const plottedArea=area(plotted);return {errors,avg,worst,pass:errors.every(e=>e.error<=1.5),score:Math.max(0,Math.round(100-avg*8)),plottedArea,plottedPerimeter:perimeter(plotted),trueArea,truePerimeter,areaPercent:Math.abs(plottedArea-trueArea)/trueArea*100};}
