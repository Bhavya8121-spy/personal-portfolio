"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { cn } from "@/lib/utils";

/**
 * A swarm of tiny metal bots that fly as a flock and lock together into shapes.
 * It cycles on its own; clicking jumps to the next shape, the pointer parts the
 * swarm, and page scroll turns it.
 */

type Shape = { name: string; pos: Float32Array; dir: Float32Array };

const HOLD_MS = 3400;
const FLIGHT_MS = 2000;
const STAGGER = 0.35; // share of the flight spent staggering departures
const TILT_SIN = Math.sin(1.05);
const TILT_COS = Math.cos(1.05);

function ringShape(n: number): Shape {
  const pos = new Float32Array(n * 3);
  const dir = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const u = Math.random() * Math.PI * 2;
    const v = Math.random() * Math.PI * 2;
    const r = 0.34 * Math.sqrt(Math.random());
    const R = 1.05;
    // Built flat, then tipped ~60° toward the camera so it reads as a ring, not a disc.
    const px = (R + r * Math.cos(v)) * Math.cos(u);
    const py = r * Math.sin(v);
    const pz = (R + r * Math.cos(v)) * Math.sin(u);
    pos.set([px, py * TILT_COS - pz * TILT_SIN, py * TILT_SIN + pz * TILT_COS], i * 3);
    dir.set([-Math.sin(u), -Math.cos(u) * TILT_SIN, Math.cos(u) * TILT_COS], i * 3);
  }
  return { name: "Ring", pos, dir };
}

/** The hero's puzzle cube: a hollow 4 × 4 × 4 block with gaps between tiles. */
function cubeShape(n: number): Shape {
  const pos = new Float32Array(n * 3);
  const dir = new Float32Array(n * 3);
  const half = 0.82;
  for (let i = 0; i < n; i++) {
    const axis = Math.floor(Math.random() * 3);
    const sign = Math.random() < 0.5 ? -1 : 1;
    const tile = () => {
      const cell = Math.floor(Math.random() * 4);
      return -half + (cell + 0.08 + Math.random() * 0.84) * (half / 2);
    };
    const a = tile();
    const b = tile();
    const depth = sign * half - sign * Math.random() * 0.06;
    const p = axis === 0 ? [depth, a, b] : axis === 1 ? [a, depth, b] : [a, b, depth];
    pos.set(p, i * 3);
    const along = (axis + 1 + (i % 2)) % 3;
    dir.set([along === 0 ? 1 : 0, along === 1 ? 1 : 0, along === 2 ? 1 : 0], i * 3);
  }
  return { name: "Cube", pos, dir };
}

/** "</>" sampled from text drawn on an offscreen canvas. */
function glyphShape(n: number): Shape {
  const pos = new Float32Array(n * 3);
  const dir = new Float32Array(n * 3);
  const w = 320;
  const h = 140;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.font = "700 120px ui-monospace, Menlo, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("</>", w / 2, h / 2 + 6);
  const data = ctx.getImageData(0, 0, w, h).data;
  const filled: number[] = [];
  for (let y = 0; y < h; y += 2) for (let x = 0; x < w; x += 2) if (data[(y * w + x) * 4 + 3] > 128) filled.push(x, y);
  const count = filled.length / 2;
  for (let i = 0; i < n; i++) {
    const k = Math.floor(Math.random() * count) * 2;
    const x = ((filled[k] + Math.random() * 2) / w - 0.5) * 3.1;
    const y = -((filled[k + 1] + Math.random() * 2) / h - 0.5) * 1.36;
    pos.set([x, y, (Math.random() - 0.5) * 0.26], i * 3);
    dir.set([0, 1, 0], i * 3);
  }
  return { name: "</>", pos, dir };
}

function helixShape(n: number): Shape {
  const pos = new Float32Array(n * 3);
  const dir = new Float32Array(n * 3);
  const turns = 2.2;
  for (let i = 0; i < n; i++) {
    const t = Math.random();
    const angle = t * turns * Math.PI * 2;
    const y = (t - 0.5) * 2.6;
    const r = 0.62;
    if (Math.random() < 0.72) {
      const strand = Math.random() < 0.5 ? 0 : Math.PI;
      const jitter = () => (Math.random() - 0.5) * 0.09;
      pos.set([r * Math.cos(angle + strand) + jitter(), y + jitter(), r * Math.sin(angle + strand) + jitter()], i * 3);
      dir.set([-Math.sin(angle + strand), 0.35, Math.cos(angle + strand)], i * 3);
    } else {
      // Rungs between the strands, snapped to 22 levels.
      const level = Math.round(t * 22) / 22;
      const a = level * turns * Math.PI * 2;
      const s = Math.random() * 2 - 1;
      pos.set([r * s * Math.cos(a), (level - 0.5) * 2.6, r * s * Math.sin(a)], i * 3);
      dir.set([Math.cos(a), 0, Math.sin(a)], i * 3);
    }
  }
  return { name: "Helix", pos, dir };
}

function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

export function MicrobotSwarm({ className }: { className?: string }) {
  const container = useRef<HTMLDivElement>(null);
  const [shapeName, setShapeName] = useState("Cube");
  const [failed, setFailed] = useState(false);
  const advance = useRef<() => void>(() => {});

  useEffect(() => {
    const host = container.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      requestAnimationFrame(() => setFailed(true));
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    host.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const count = window.innerWidth < 768 ? 1800 : 3600;

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = environment;

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
    camera.position.set(0, 0.35, 5.4);
    camera.lookAt(0, 0, 0);

    // Accent lights in the site palette: cool blue key, amber rim.
    const blue = new THREE.PointLight(0x82aaff, 18, 12);
    blue.position.set(-2.5, 1.5, 2.5);
    const amber = new THREE.PointLight(0xffad72, 14, 12);
    amber.position.set(2.8, -1.2, -1.5);
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(1.5, 3, 4);
    scene.add(blue, amber, key, new THREE.AmbientLight(0xffffff, 0.25));

    // One bot: a short bar with rounded-off ends, like a link in a chain.
    const geometry = new THREE.CapsuleGeometry(0.021, 0.085, 2, 6);
    geometry.rotateZ(Math.PI / 2); // long axis along +X
    // White base: the per-bot instance colour sets the metal tint.
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.85, roughness: 0.3, envMapIntensity: 1.3 });
    const bots = new THREE.InstancedMesh(geometry, material, count);
    bots.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    const accent = new THREE.Color(0xb8693c);
    const steel = new THREE.Color(0x7d8594);
    for (let i = 0; i < count; i++) bots.setColorAt(i, Math.random() < 0.14 ? accent : steel);
    const swarm = new THREE.Group();
    swarm.add(bots);
    scene.add(swarm);

    const shapes = [cubeShape(count), ringShape(count), glyphShape(count), helixShape(count)];
    let current = 0;
    let next = 0;
    let flightStart = -Infinity;
    let holdStart = 0;

    // Per-bot state.
    const delay = new Float32Array(count).map(() => Math.random() * STAGGER);
    const bend = new Float32Array(count * 3).map(() => (Math.random() - 0.5) * 2.4);
    const offset = new Float32Array(count * 3);
    const velocity = new Float32Array(count * 3);
    const quats = Array.from({ length: count }, () => new THREE.Quaternion());

    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const heading = new THREE.Vector3();
    const target = new THREE.Quaternion();
    const scale = new THREE.Vector3(1, 1, 1);
    const xAxis = new THREE.Vector3(1, 0, 0);
    const previous = new Float32Array(count * 3);

    const pointerNdc = new THREE.Vector2();
    let pointerActive = false;
    const raycaster = new THREE.Raycaster();
    // The pointer is a ray through the swarm (in swarm space), so hollow shapes react on their surface.
    const rayOrigin = new THREE.Vector3();
    const rayDir = new THREE.Vector3();
    const inverse = new THREE.Matrix4();

    function startFlight(now: number) {
      if (now - flightStart < FLIGHT_MS) return; // already flying
      next = (current + 1) % shapes.length;
      flightStart = now;
      setShapeName(shapes[next].name);
    }
    advance.current = () => startFlight(performance.now());

    function resize() {
      const width = host!.clientWidth;
      const height = host!.clientHeight;
      renderer.setSize(width, height, false);
      renderer.domElement.style.width = `${width}px`;
      renderer.domElement.style.height = `${height}px`;
      camera.aspect = width / Math.max(1, height);
      // Pull back on narrow screens so the widest shape (</>) still fits.
      camera.position.z = camera.aspect < 1 ? 5.4 / Math.max(0.55, camera.aspect) : 5.4;
      camera.updateProjectionMatrix();
    }

    function render(now: number) {
      // Timeline: hold the current shape, then fly to the next.
      if (!reduced && flightStart === -Infinity && now - holdStart > HOLD_MS) startFlight(now);
      const flying = now - flightStart < FLIGHT_MS;
      const progress = flying ? (now - flightStart) / FLIGHT_MS : 1;
      if (!flying && flightStart !== -Infinity && current !== next) {
        current = next;
        holdStart = now;
        flightStart = -Infinity;
      }

      const from = shapes[current];
      const to = shapes[next];
      const time = now * 0.001;

      // Sway rather than spin, so flat shapes like </> never turn edge-on. Scroll adds a turn.
      swarm.rotation.y = reduced ? 0.45 : Math.sin(time * 0.35) * 0.55 + Math.sin(window.scrollY * 0.004) * 0.35;
      swarm.rotation.x = reduced ? 0.25 : Math.sin(time * 0.3) * 0.12 + 0.18;
      swarm.updateMatrixWorld();

      if (pointerActive && !reduced) {
        raycaster.setFromCamera(pointerNdc, camera);
        inverse.copy(swarm.matrixWorld).invert();
        rayOrigin.copy(raycaster.ray.origin).applyMatrix4(inverse);
        rayDir.copy(raycaster.ray.direction).transformDirection(inverse);
      }

      for (let i = 0; i < count; i++) {
        const k = i * 3;
        const local = flying ? easeInOut(Math.min(1, Math.max(0, (progress - delay[i]) / (1 - STAGGER)))) : 1;
        const a = flying ? from : shapes[current];
        const b = flying ? to : shapes[current];
        // Quadratic Bézier through a bent midpoint so each bot arcs instead of sliding.
        const m = 1 - local;
        const arc = 2 * m * local;
        let x = m * m * a.pos[k] + arc * ((a.pos[k] + b.pos[k]) / 2 + bend[k]) + local * local * b.pos[k];
        let y = m * m * a.pos[k + 1] + arc * ((a.pos[k + 1] + b.pos[k + 1]) / 2 + bend[k + 1] * 0.6) + local * local * b.pos[k + 1];
        let z = m * m * a.pos[k + 2] + arc * ((a.pos[k + 2] + b.pos[k + 2]) / 2 + bend[k + 2]) + local * local * b.pos[k + 2];

        if (!reduced) {
          // Idle shimmer: a slow wave runs through the locked shape.
          const shimmer = Math.sin(time * 2 + a.pos[k + 1] * 4 + a.pos[k] * 2) * 0.012;
          x += shimmer;
          z += shimmer;

          // Pointer repulsion with a spring back to the slot.
          velocity[k] -= offset[k] * 0.06;
          velocity[k + 1] -= offset[k + 1] * 0.06;
          velocity[k + 2] -= offset[k + 2] * 0.06;
          if (pointerActive) {
            // Vector from the pointer ray to the bot, perpendicular to the ray.
            const rx = x + offset[k] - rayOrigin.x;
            const ry = y + offset[k + 1] - rayOrigin.y;
            const rz = z + offset[k + 2] - rayOrigin.z;
            const along = rx * rayDir.x + ry * rayDir.y + rz * rayDir.z;
            const dx = rx - rayDir.x * along;
            const dy = ry - rayDir.y * along;
            const dz = rz - rayDir.z * along;
            const d2 = dx * dx + dy * dy + dz * dz;
            if (d2 < 0.12 && d2 > 1e-6) {
              const d = Math.sqrt(d2);
              const force = (1 - d / 0.35) * 0.03;
              velocity[k] += (dx / d) * force;
              velocity[k + 1] += (dy / d) * force;
              velocity[k + 2] += (dz / d) * force;
            }
          }
          velocity[k] *= 0.86;
          velocity[k + 1] *= 0.86;
          velocity[k + 2] *= 0.86;
          offset[k] += velocity[k];
          offset[k + 1] += velocity[k + 1];
          offset[k + 2] += velocity[k + 2];
          x += offset[k];
          y += offset[k + 1];
          z += offset[k + 2];
        }

        // Face the direction of travel in flight, the shape's grain once docked.
        heading.set(x - previous[k], y - previous[k + 1], z - previous[k + 2]);
        if (flying && local > 0 && local < 1 && heading.lengthSq() > 1e-7) {
          heading.normalize();
        } else {
          heading.set(b.dir[k], b.dir[k + 1], b.dir[k + 2]).normalize();
        }
        target.setFromUnitVectors(xAxis, heading);
        quats[i].slerp(target, reduced ? 1 : 0.18);
        previous[k] = x;
        previous[k + 1] = y;
        previous[k + 2] = z;

        position.set(x, y, z);
        matrix.compose(position, quats[i], scale);
        bots.setMatrixAt(i, matrix);
      }
      bots.instanceMatrix.needsUpdate = true;
      renderer.render(scene, camera);
    }

    let frame = 0;
    let visible = true;
    function loop(now: number) {
      render(now);
      frame = visible && !reduced ? requestAnimationFrame(loop) : 0;
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame && !reduced) frame = requestAnimationFrame(loop);
    });
    observer.observe(host);

    function onMove(event: PointerEvent) {
      const rect = host!.getBoundingClientRect();
      pointerNdc.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
      pointerActive = true;
    }
    function onLeave() { pointerActive = false; }
    const onResize = () => { resize(); if (reduced) render(performance.now()); };

    onResize();
    holdStart = performance.now();
    render(holdStart);
    if (!reduced) frame = requestAnimationFrame(loop);
    window.addEventListener("resize", onResize);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("pointercancel", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointercancel", onLeave);
      geometry.dispose();
      material.dispose();
      bots.dispose();
      environment.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  if (failed) return null;

  return (
    <div className={cn("relative", className)}>
      <div
        ref={container}
        aria-hidden="true"
        className="absolute inset-0 cursor-pointer touch-pan-y"
        onClick={() => advance.current()}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-6 flex flex-col items-center gap-2 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#d3d7e0]" aria-live="polite">
          Assembling <span className="text-[var(--accent)]">{shapeName}</span>
        </p>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#8a91a0]">
          Microbot swarm · Move through it, click to rebuild
        </p>
      </div>
    </div>
  );
}
