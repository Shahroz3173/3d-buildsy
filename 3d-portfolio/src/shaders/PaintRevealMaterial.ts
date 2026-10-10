import * as THREE from 'three'
import { shaderMaterial } from '@react-three/drei'

// ── Sketch / hatching line material ──────────────────────────────────────────
export const SketchLineMaterial = shaderMaterial(
  { uTime: 0, uColor: new THREE.Color('#2B2520'), uOpacity: 1.0 },
  `varying vec2 vUv;
   void main() {
     vUv = uv;
     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
   }`,
  `uniform float uTime;
   uniform vec3 uColor;
   uniform float uOpacity;
   varying vec2 vUv;

   float hash(vec2 p){ return fract(1e4*sin(17.0*p.x+p.y*.1)*(0.1+abs(sin(p.y*13.+p.x)))); }
   float noise(vec2 x){
     vec2 i=floor(x), f=fract(x);
     float a=hash(i),b=hash(i+vec2(1,0)),c=hash(i+vec2(0,1)),d=hash(i+vec2(1,1));
     vec2 u=f*f*(3.0-2.0*f);
     return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y;
   }

   void main() {
     // Animated pencil line boil
     float t = floor(uTime * 8.0);
     float n = noise(vUv * 30.0 + t * 0.3);

     // Edge border
     float ex = min(vUv.x, 1.0-vUv.x);
     float ey = min(vUv.y, 1.0-vUv.y);
     float edge = min(ex, ey);
     float line = smoothstep(0.0, 0.015 + n*0.01, edge);

     // Interior hatching — faint diagonal lines
     float hatch = sin((vUv.x + vUv.y)*80.0 + t*0.5)*0.5+0.5;
     float hatchMask = step(0.92, hatch) * 0.12;

     vec3 paper = vec3(0.94, 0.91, 0.87);
     vec3 col = mix(uColor, paper, line);
     col += hatchMask * (1.0 - line);

     gl_FragColor = vec4(col, uOpacity * (line*0.15 + (1.0-line)));
   }`
)

// ── Paint-reveal material (hover to color) ───────────────────────────────────
export const PaintRevealMaterial = shaderMaterial(
  {
    uTime: 0,
    uReveal: 0,
    uColorSketch: new THREE.Color('#2B2520'),
    uColorPainted: new THREE.Color('#eab308'),
  },
  `varying vec2 vUv;
   void main(){
     vUv = uv;
     gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
   }`,
  `uniform float uTime;
   uniform float uReveal;
   uniform vec3 uColorSketch;
   uniform vec3 uColorPainted;
   varying vec2 vUv;

   float hash(vec2 p){ return fract(1e4*sin(17.0*p.x+p.y*.1)*(0.1+abs(sin(p.y*13.+p.x)))); }
   float noise(vec2 x){
     vec2 i=floor(x),f=fract(x);
     float a=hash(i),b=hash(i+vec2(1,0)),c=hash(i+vec2(0,1)),d=hash(i+vec2(1,1));
     vec2 u=f*f*(3.0-2.0*f);
     return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y;
   }

   void main(){
     float t = floor(uTime*8.0);
     float n = noise(vUv*20.0+t*0.5);
     float ex=min(vUv.x,1.-vUv.x), ey=min(vUv.y,1.-vUv.y);
     float edge=min(ex,ey);
     float line=smoothstep(0.02, 0.03+n*0.04, edge);

     float maskN=noise(vUv*8.0);
     float reveal=smoothstep(uReveal-0.3,uReveal+0.3,maskN+uReveal);
     vec3 inner=mix(vec3(0.94,0.91,0.87),uColorPainted,clamp(uReveal*1.5,0.,1.));
     vec3 col=line<0.5?uColorSketch:inner;
     float alpha=line<0.5?1.:mix(0.15,1.,reveal);
     gl_FragColor=vec4(col,alpha);
   }`
)
