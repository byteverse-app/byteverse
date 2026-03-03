import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { CelestialType } from '../../constants';

const CelestialPreview = ({ type, color }) => {
  const mountRef = useRef(null);

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

    // Dynamic Geometry based on Type
    switch (type) {
      case CelestialType.BLACK_HOLE:
        const bhGeo = new THREE.TorusGeometry(1.5, 0.4, 16, 100);
        const bhMat = new THREE.MeshStandardMaterial({ color: threeColor, emissive: threeColor, emissiveIntensity: 2, wireframe: true });
        group.add(new THREE.Mesh(bhGeo, bhMat));
        break;
      case CelestialType.GALAXY:
        const starGeo = new THREE.BufferGeometry();
        const starPos = new Float32Array(500 * 3);
        for(let i=0; i<500*3; i++) starPos[i] = (Math.random()-0.5)*4;
        starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
        const starMat = new THREE.PointsMaterial({ size: 0.02, color: threeColor });
        group.add(new THREE.Points(starGeo, starMat));
        break;
      case CelestialType.BINARY_STAR:
        const s1 = new THREE.Mesh(new THREE.SphereGeometry(0.6), new THREE.MeshStandardMaterial({ color: threeColor }));
        const s2 = new THREE.Mesh(new THREE.SphereGeometry(0.4), new THREE.MeshStandardMaterial({ color: 0xffffff }));
        s1.position.x = -1;
        s2.position.x = 1;
        group.add(s1, s2);
        break;
      default:
        const fallbackGeo = new THREE.OctahedronGeometry(1.5, 1);
        const fallbackMat = new THREE.MeshStandardMaterial({ color: threeColor, wireframe: true });
        group.add(new THREE.Mesh(fallbackGeo, fallbackMat));
    }

    const light = new THREE.PointLight(0xffffff, 10);
    light.position.set(5, 5, 5);
    scene.add(light, new THREE.AmbientLight(0xffffff, 0.5));

    camera.position.z = 5;

    let frame = 0;
    const animate = () => {
      frame += 0.01;
      group.rotation.y += 0.01;
      group.rotation.x += 0.005;
      
      if (type === CelestialType.BINARY_STAR && group.children.length >= 2) {
        group.children[0].position.x = Math.sin(frame) * 1.5;
        group.children[0].position.z = Math.cos(frame) * 1.5;
        group.children[1].position.x = -Math.sin(frame) * 1.5;
        group.children[1].position.z = -Math.cos(frame) * 1.5;
      }

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      renderer.dispose();
      if (mountRef.current && renderer.domElement.parentNode) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [type, color]);

  return <div ref={mountRef} className="w-full h-full flex items-center justify-center pointer-events-none" />;
};

export default CelestialPreview;
