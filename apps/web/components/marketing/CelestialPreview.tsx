'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { CelestialType, type CelestialTypeValue } from './constants';

const BRAND_BLUE = '#5227FF';
const BRAND_DEEP = '#7D7DFF';

function buildGenerateScene(group: THREE.Group, color: string) {
  const primary = new THREE.Color(color);
  const accent = new THREE.Color(BRAND_DEEP);

  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 16, 16),
    new THREE.MeshBasicMaterial({ color: primary, transparent: true, opacity: 0.95 })
  );
  group.add(core);

  const blocks: THREE.Mesh[] = [];
  const blockHeights = [0.18, 0.22, 0.28, 0.2, 0.16];
  blockHeights.forEach((h, i) => {
    const block = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, h, 0.28),
      new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? primary : accent,
        transparent: true,
        opacity: 0.85,
      })
    );
    block.position.y = -1.1 + i * 0.42;
    block.scale.set(0.01, 0.01, 0.01);
    blocks.push(block);
    group.add(block);
  });

  const particleCount = 60;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * Math.PI * 2;
    const radius = 1.8 + Math.random() * 0.6;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 2.5;
    positions[i * 3 + 2] = Math.sin(angle) * radius;
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particles = new THREE.Points(
    particleGeo,
    new THREE.PointsMaterial({
      size: 0.05,
      color: primary,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  group.add(particles);

  return { core, blocks, particles };
}

function buildPreviewScene(group: THREE.Group, color: string) {
  const primary = new THREE.Color(color);
  const accent = new THREE.Color(BRAND_BLUE);

  const frame = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(2.5, 1.7, 0.08)),
    new THREE.LineBasicMaterial({ color: primary, transparent: true, opacity: 0.9 })
  );
  group.add(frame);

  const inner = new THREE.Mesh(
    new THREE.PlaneGeometry(2.3, 1.5),
    new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.12 })
  );
  group.add(inner);

  const scanLine = new THREE.Mesh(
    new THREE.PlaneGeometry(2.3, 0.06),
    new THREE.MeshBasicMaterial({
      color: accent,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  group.add(scanLine);

  const corners: THREE.Mesh[] = [];
  const cornerPositions: [number, number][] = [
    [-1.2, 0.8],
    [1.2, 0.8],
    [-1.2, -0.8],
    [1.2, -0.8],
  ];
  cornerPositions.forEach(([x, y]) => {
    const dot = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 12, 12),
      new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.9 })
    );
    dot.position.set(x, y, 0.06);
    corners.push(dot);
    group.add(dot);
  });

  const checkmark = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-0.35, -0.1, 0.05),
      new THREE.Vector3(-0.1, -0.35, 0.05),
      new THREE.Vector3(0.45, 0.35, 0.05),
    ]),
    new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0 })
  );
  group.add(checkmark);

  return { frame, inner, scanLine, corners, checkmark };
}

export default function CelestialPreview({
  type,
  color,
}: {
  type: CelestialTypeValue;
  color: string;
}) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(400, 400);
    mountRef.current.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);
    const threeColor = new THREE.Color(color);

    let generateRefs: ReturnType<typeof buildGenerateScene> | null = null;
    let previewRefs: ReturnType<typeof buildPreviewScene> | null = null;

    switch (type) {
      case CelestialType.BLACK_HOLE: {
        const geo = new THREE.TorusGeometry(1.5, 0.4, 16, 100);
        const mat = new THREE.MeshStandardMaterial({
          color: threeColor,
          emissive: threeColor,
          emissiveIntensity: 2,
          wireframe: true,
        });
        group.add(new THREE.Mesh(geo, mat));
        break;
      }
      case CelestialType.GALAXY: {
        const starGeo = new THREE.BufferGeometry();
        const starPos = new Float32Array(500 * 3);
        for (let i = 0; i < 500 * 3; i++) starPos[i] = (Math.random() - 0.5) * 4;
        starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
        group.add(
          new THREE.Points(starGeo, new THREE.PointsMaterial({ size: 0.02, color: threeColor }))
        );
        break;
      }
      case CelestialType.BINARY_STAR: {
        const s1 = new THREE.Mesh(
          new THREE.SphereGeometry(0.6),
          new THREE.MeshStandardMaterial({ color: threeColor })
        );
        const s2 = new THREE.Mesh(
          new THREE.SphereGeometry(0.4),
          new THREE.MeshStandardMaterial({ color: 0xffffff })
        );
        s1.position.x = -1;
        s2.position.x = 1;
        group.add(s1, s2);
        break;
      }
      case CelestialType.NEBULA: {
        generateRefs = buildGenerateScene(group, color);
        break;
      }
      case CelestialType.PULSAR: {
        previewRefs = buildPreviewScene(group, color);
        break;
      }
      default: {
        const geo = new THREE.OctahedronGeometry(1.5, 1);
        group.add(
          new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: threeColor, wireframe: true }))
        );
      }
    }

    scene.add(new THREE.PointLight(0xffffff, 10));
    camera.position.z = 5;

    let t = 0;
    let rafId = 0;
    const animate = () => {
      t += 0.016;
      group.rotation.y += 0.008;

      if (generateRefs) {
        const { core, blocks, particles } = generateRefs;
        core.scale.setScalar(1 + Math.sin(t * 4) * 0.15);

        blocks.forEach((block, i) => {
          const delay = i * 0.6;
          const progress = Math.min(1, Math.max(0, (t - delay) * 1.2));
          const eased = 1 - Math.pow(1 - progress, 3);
          block.scale.set(eased, eased, eased);
        });

        particles.rotation.y += 0.012;
        const pos = particles.geometry.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const ix = i * 3;
          const px = pos.array[ix];
          const py = pos.array[ix + 1];
          const pz = pos.array[ix + 2];
          const dist = Math.sqrt(px * px + pz * pz) || 1;
          const pull = 0.003;
          pos.array[ix] -= (px / dist) * pull;
          pos.array[ix + 2] -= (pz / dist) * pull;
          pos.array[ix + 1] += Math.sin(t * 2 + i) * 0.002;
        }
        pos.needsUpdate = true;
      }

      if (previewRefs) {
        const { frame, inner, scanLine, corners, checkmark } = previewRefs;
        const scanY = Math.sin(t * 1.5) * 0.72;
        scanLine.position.y = scanY;

        const frameMat = frame.material as THREE.LineBasicMaterial;
        frameMat.opacity = 0.7 + Math.sin(t * 2) * 0.2;

        const innerMat = inner.material as THREE.MeshBasicMaterial;
        innerMat.opacity = 0.1 + Math.sin(t * 1.2) * 0.05;

        corners.forEach((dot, i) => {
          const mat = dot.material as THREE.MeshBasicMaterial;
          const pulse = Math.sin(t * 3 + i * 1.2);
          mat.opacity = 0.5 + pulse * 0.4;
          dot.scale.setScalar(0.8 + pulse * 0.2);
        });

        const checkMat = checkmark.material as THREE.LineBasicMaterial;
        const checkProgress = (Math.sin(t * 0.8) + 1) / 2;
        checkMat.opacity = checkProgress * 0.9;
      }

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      renderer.dispose();
      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [type, color]);

  return <div ref={mountRef} className="w-full h-full flex items-center justify-center" />;
}
