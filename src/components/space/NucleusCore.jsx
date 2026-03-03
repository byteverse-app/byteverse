import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useScroll, useTransform } from 'framer-motion';

const NucleusCore = () => {
  const mountRef = useRef(null);
  const { scrollYProgress } = useScroll();

  const rotationZ = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 2]);
  const scaleValue = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.1, 0.6]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    let width = container.clientWidth || 400;
    let height = container.clientHeight || 400;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // 1. Primary glass sphere (Apple-like finish)
    const glassGeo = new THREE.SphereGeometry(1.2, 64, 64);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xf5f5f7,
      transmission: 0.92,
      thickness: 0.6,
      roughness: 0.08,
      metalness: 0,
      ior: 1.45,
      transparent: true,
      opacity: 0.98,
      envMapIntensity: 0.5,
    });
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    group.add(glassMesh);

    // 2. Subtle inner glow (replaces bright emissive core)
    const glowGeo = new THREE.SphereGeometry(0.5, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x7d7dff,
      transparent: true,
      opacity: 0.12,
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    group.add(glowMesh);

    // 3. Sparse sparkle particles (reduced count, subtle)
    const particleCount = 20;
    const particleGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.4 + Math.random() * 0.4;
      posArray[i] = r * Math.sin(phi) * Math.cos(theta);
      posArray[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      posArray[i + 2] = r * Math.cos(phi);
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.03,
      color: 0xffffff,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    group.add(particles);

    // Lighting: soft key + fill (no cyan rim)
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0x7d7dff, 8);
    fillLight.position.set(-2, -1, 2);
    scene.add(fillLight);

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    camera.position.z = 4;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;

    const resize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w > 0 && h > 0) {
        width = w;
        height = h;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    let frame = 0;
    const animate = () => {
      frame += 0.01;

      const rotationValue = rotationZ.get();
      const scaleVal = scaleValue.get();
      group.rotation.z = rotationValue;
      group.scale.set(scaleVal, scaleVal, scaleVal);

      glassMesh.rotation.y += 0.002;
      particles.rotation.y += 0.0015;

      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      resizeObserver.disconnect();
      renderer.dispose();
      if (container && renderer.domElement.parentNode) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [rotationZ, scaleValue]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full min-w-[200px] min-h-[200px] cursor-grab active:cursor-grabbing opacity-90 transition-opacity duration-1000"
      title="Interact with the Nucleus"
    />
  );
};

export default NucleusCore;
