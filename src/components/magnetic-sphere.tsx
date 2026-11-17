"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";

type Shape = "sphere" | "crown";

interface MagneticSphereProps {
  className?: string;
  size?: number;
  particleCount?: number;
  color?: string;
  backgroundColor?: string;
  interactive?: boolean;
  shape?: Shape;
}

const TAU = Math.PI * 2;

export function MagneticSphere({
  className,
  size = 400,
  particleCount = 8000,
  color = "#F8FAFC",
  backgroundColor = "transparent",
  interactive = true,
  shape = "sphere",
}: MagneticSphereProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "WebGL is unavailable.");
      return;
    }
    setError(null);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, size * 10);
    camera.position.set(0, size * 0.055, size * 1.25);
    camera.lookAt(0, size * 0.035, 0);

    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(pixelRatio);
    if (backgroundColor === "transparent") {
      renderer.setClearColor(0x000000, 0);
    } else {
      renderer.setClearColor(new THREE.Color(backgroundColor), 1);
    }

    const count = Math.max(2, Math.floor(particleCount));
    const positions = new Float32Array(count * 3);
    const originals = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const opacities = new Float32Array(count);
    const accentMix = new Float32Array(count);
    const random = Math.random;

    function put(i: number, x: number, y: number, z: number, highlight = 0.1) {
      const k = i * 3;
      positions[k] = originals[k] = x;
      positions[k + 1] = originals[k + 1] = y;
      positions[k + 2] = originals[k + 2] = z;
      sizes[i] = 1.0 + random() * 0.9;
      opacities[i] = 0.68 + random() * 0.32;
      accentMix[i] = Math.min(1, highlight + random() * 0.14);
    }

    if (shape === "sphere") {
      const goldenAngle = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < count; i++) {
        const y = 1 - (i / (count - 1)) * 2;
        const r = Math.sqrt(Math.max(0, 1 - y * y));
        const angle = goldenAngle * i;
        const radius = size * 0.39 * (0.96 + random() * 0.08);
        put(i, Math.cos(angle) * r * radius, y * radius, Math.sin(angle) * r * radius);
      }
    } else {
      // Five-point crown: continuous lower band, tapered triangular panels,
      // bright rim, and small floating jewel clusters at the tips.
      const bandCount = Math.floor(count * 0.30);
      const panelCount = Math.floor(count * 0.53);
      const rimCount = Math.floor(count * 0.12);
      const baseRadius = size * 0.34;
      const bandBottom = -size * 0.23;
      const bandTop = -size * 0.095;
      const peakTop = size * 0.285;
      const peakCount = 5;
      const phase = Math.PI / 2; // front-facing point is visible

      for (let i = 0; i < bandCount; i++) {
        const angle = random() * TAU;
        const y = bandBottom + random() * (bandTop - bandBottom);
        const radius = baseRadius + (random() - 0.5) * size * 0.027;
        put(i, Math.cos(angle) * radius, y, Math.sin(angle) * radius, 0.10);
      }

      for (let j = 0; j < panelCount; j++) {
        const i = bandCount + j;
        const peak = j % peakCount;
        const center = phase + (peak / peakCount) * TAU;
        // The point is wide at its base and narrows continuously to its tip.
        const t = Math.pow(random(), 0.86);
        const halfWidth = (Math.PI / peakCount) * (1 - t) * 0.94;
        const angle = center + (random() * 2 - 1) * halfWidth;
        const y = bandTop + t * (peakTop - bandTop);
        const radius = baseRadius * (1 - t * 0.09) + (random() - 0.5) * size * 0.014;
        put(i, Math.cos(angle) * radius, y, Math.sin(angle) * radius, 0.08 + 0.24 * t);
      }

      for (let j = 0; j < rimCount; j++) {
        const i = bandCount + panelCount + j;
        const peak = j % peakCount;
        const center = phase + (peak / peakCount) * TAU;
        const t = random();
        const side = j % 2 === 0 ? -1 : 1;
        const angle = center + side * (Math.PI / peakCount) * (1 - t) * 0.94;
        const y = bandTop + t * (peakTop - bandTop);
        const radius = baseRadius * (1 - t * 0.09);
        put(i, Math.cos(angle) * radius, y, Math.sin(angle) * radius, 0.38);
      }

      for (let i = bandCount + panelCount + rimCount; i < count; i++) {
        const peak = i % peakCount;
        const angle = phase + (peak / peakCount) * TAU;
        const radius = baseRadius * 0.91;
        const scatter = size * 0.014;
        put(
          i,
          Math.cos(angle) * radius + (random() - 0.5) * scatter,
          peakTop + (random() - 0.5) * scatter,
          Math.sin(angle) * radius + (random() - 0.5) * scatter,
          0.6,
        );
      }
    }

    const geometry = new THREE.BufferGeometry();
    const positionAttribute = new THREE.BufferAttribute(positions, 3);
    positionAttribute.setUsage(THREE.DynamicDrawUsage);
    geometry.setAttribute("position", positionAttribute);
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("aOpacity", new THREE.BufferAttribute(opacities, 1));
    geometry.setAttribute("aAccent", new THREE.BufferAttribute(accentMix, 1));
    geometry.computeBoundingSphere();

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(color) },
        uAccent: { value: new THREE.Color("#A5D8FF") },
        uPixelRatio: { value: pixelRatio },
      },
      vertexShader: `
        attribute float aSize;
        attribute float aOpacity;
        attribute float aAccent;
        uniform float uPixelRatio;
        varying float vOpacity;
        varying float vAccent;
        void main() {
          vOpacity = aOpacity;
          vAccent = aAccent;
          vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = clamp(aSize * 1250.0 / max(1.0, -viewPosition.z), 2.0, 7.0) * uPixelRatio;
          gl_Position = projectionMatrix * viewPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform vec3 uAccent;
        varying float vOpacity;
        varying float vAccent;
        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;
          float alpha = (1.0 - smoothstep(0.25, 0.5, d)) * vOpacity;
          gl_FragColor = vec4(mix(uColor, uAccent, vAccent), alpha);
        }
      `,
      transparent: true,
      depthTest: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    const particles = new THREE.Points(geometry, material);
    particles.frustumCulled = false;
    scene.add(particles);

    let width = 0;
    let height = 0;
    const resize = () => {
      const rect = container.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width));
      const h = Math.max(1, Math.round(rect.height));
      if (w === width && h === height) return;
      width = w;
      height = h;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = mediaQuery.matches;
    const onMotionChange = (event: MediaQueryListEvent) => { reducedMotion = event.matches; };
    mediaQuery.addEventListener("change", onMotionChange);

    const pointer = new THREE.Vector2();
    const smoothPointer = new THREE.Vector2();
    const mouseWorld = new THREE.Vector3();
    const direction = new THREE.Vector3();
    const localMouse = new THREE.Vector3();
    let pointerActive = false;
    let pointerEnergy = 0;
    let pointerInitialized = false;

    const onPointerMove = (event: PointerEvent) => {
      if (!interactive || reducedMotion) return;
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      pointer.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
      );
      if (!pointerInitialized) {
        smoothPointer.copy(pointer);
        pointerInitialized = true;
      }
      pointerActive = true;
      pointerEnergy = 1;
    };
    const onPointerLeave = () => { pointerActive = false; };
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerleave", onPointerLeave);
    container.addEventListener("pointercancel", onPointerLeave);

    const clock = new THREE.Clock();
    let animationId = 0;
    let elapsed = 0;
    let disposed = false;
    const animate = () => {
      if (disposed) return;
      animationId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.05);
      elapsed += delta;

      if (!reducedMotion) {
        // Crowns rotate more slowly so their silhouette stays readable.
        particles.rotation.y += delta * (shape === "crown" ? 0.035 : 0.065);
        particles.rotation.x = shape === "crown" ? -0.10 : Math.sin(elapsed * 0.22) * 0.06;
        particles.scale.setScalar(1 + Math.sin(elapsed * 0.6) * 0.004);
      }
      particles.updateMatrixWorld(true);

      if (!pointerActive) pointerEnergy *= Math.exp(-delta * 0.65);
      if (pointerEnergy > 0.002 && interactive && !reducedMotion) {
        smoothPointer.lerp(pointer, 1 - Math.exp(-delta * 6));
        mouseWorld.set(smoothPointer.x, smoothPointer.y, 0.5).unproject(camera);
        direction.copy(mouseWorld).sub(camera.position).normalize();
        const distance = -camera.position.z / direction.z;
        mouseWorld.copy(camera.position).addScaledVector(direction, distance);
        localMouse.copy(mouseWorld);
        particles.worldToLocal(localMouse);
      }

      if (!reducedMotion) {
        const frameScale = Math.min(delta * 60, 2);
        const spring = 0.010 * frameScale;
        const damping = Math.pow(0.947, frameScale);
        const radius = size * 0.54;
        const attraction = 0.72 * frameScale * pointerEnergy;

        for (let i = 0; i < count; i++) {
          const k = i * 3;
          if (pointerEnergy > 0.002 && interactive) {
            // Use X/Y distance so particles at the center respond regardless of depth.
            const dx = localMouse.x - positions[k];
            const dy = localMouse.y - positions[k + 1];
            const dist = Math.hypot(dx, dy);
            if (dist < radius) {
              const falloff = Math.pow(1 - dist / radius, 2);
              velocities[k] += dx * attraction * falloff * 0.018;
              velocities[k + 1] += dy * attraction * falloff * 0.018;
              // Small depth movement adds life without collapsing the crown.
              velocities[k + 2] += (localMouse.z - positions[k + 2]) * attraction * falloff * 0.002;
            }
          }
          for (let axis = 0; axis < 3; axis++) {
            const j = k + axis;
            velocities[j] = (velocities[j] + (originals[j] - positions[j]) * spring) * damping;
            positions[j] += velocities[j];
          }
        }
        positionAttribute.needsUpdate = true;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      mediaQuery.removeEventListener("change", onMotionChange);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerleave", onPointerLeave);
      container.removeEventListener("pointercancel", onPointerLeave);
      scene.remove(particles);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [size, particleCount, color, backgroundColor, interactive, shape]);

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      style={{ width: "100%", height: "100%", minHeight: size, backgroundColor }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" style={{ display: "block" }} />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center p-4 text-center text-sm text-red-500">
          {error}
        </div>
      )}
    </div>
  );
}
