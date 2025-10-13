import React, { useEffect, useRef } from 'react';
import GradientBlinds from './GradientBlinds';

export default function ByteVerseUniverse() {
  const animationRefs = useRef({});

  useEffect(() => {
    // Initialize all animations when component mounts
    const initializeAnimations = () => {
      setupRadialPulse();
      setupOrbitalPulse();
      setupPendulumWave();
      setupPulseWave();
      setupConcentricRings();
      setupSequentialPulse();
      setupOscillatingDots();
      setupPulsingGrid();
      setupSpiralGalaxy();
    };

    // Add corner decorations
    const addCornerDecorations = () => {
      document.querySelectorAll(".product-card").forEach((container) => {
        const corners = ["top-left", "top-right", "bottom-left", "bottom-right"];
        corners.forEach((position) => {
          const corner = document.createElement("div");
          corner.className = `corner ${position}`;
          corner.innerHTML = '+';
          corner.style.fontSize = '20px';
          corner.style.fontWeight = 'bold';
          corner.style.color = 'white';
          corner.style.textAlign = 'center';
          corner.style.lineHeight = '16px';
          container.appendChild(corner);
        });
      });
    };

    // Animation functions (converted from the HTML)
    const setupRadialPulse = () => {
      const container = document.getElementById("radial-pulse");
      if (!container) return;
      container.innerHTML = "";
      const canvas = document.createElement("canvas");
      canvas.width = 180;
      canvas.height = 180;
      canvas.style.position = "absolute";
      canvas.style.left = "0";
      canvas.style.top = "0";
      container.appendChild(canvas);
      const ctx = canvas.getContext("2d");
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxRadius = 75;
      let time = 0;
      let lastTime = 0;
      const ringCount = 8;
      const dotsPerRing = 12;
      const pulseSpeed = 0.35;

      function animate(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        time += deltaTime * 0.001;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fill();
        
        for (let i = 0; i < ringCount; i++) {
          const pulsePhase = (time * pulseSpeed + i / ringCount) % 1;
          const ringRadius = pulsePhase * maxRadius;
          if (ringRadius < 5) continue;
          const opacity = 1 - pulsePhase;
          
          for (let j = 0; j < dotsPerRing; j++) {
            const angle = (j / dotsPerRing) * Math.PI * 2;
            const x = centerX + Math.cos(angle) * ringRadius;
            const y = centerY + Math.sin(angle) * ringRadius;
            const dotSize = 2.5 * (1 - pulsePhase * 0.5);
            ctx.beginPath();
            ctx.arc(x, y, dotSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.fill();
          }
        }
        requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);
    };

    const setupOrbitalPulse = () => {
      const container = document.getElementById("orbital-pulse");
      if (!container) return;
      container.innerHTML = "";
      const canvas = document.createElement("canvas");
      canvas.width = 180;
      canvas.height = 180;
      canvas.style.position = "absolute";
      canvas.style.left = "0";
      canvas.style.top = "0";
      container.appendChild(canvas);
      const ctx = canvas.getContext("2d");
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxRadius = 75;
      let time = 0;
      let lastTime = 0;
      
      const orbits = [
        { radius: 15, dotCount: 6 },
        { radius: 25, dotCount: 10 },
        { radius: 35, dotCount: 14 },
        { radius: 45, dotCount: 18 },
        { radius: 55, dotCount: 22 },
        { radius: 65, dotCount: 26 }
      ];
      
      const pulseFrequency = 0.5;
      const pulseAmplitude = 2;

      function animate(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        time += deltaTime * 0.001;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fill();
        
        orbits.forEach((orbit, orbitIndex) => {
          ctx.beginPath();
          ctx.arc(centerX, centerY, orbit.radius, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
          ctx.lineWidth = 1;
          ctx.stroke();
          
          const normalizedRadius = orbit.radius / maxRadius;
          const pulseDelay = normalizedRadius * 1.5;
          const pulsePhase = (time * pulseFrequency - pulseDelay) % 1;
          const pulseEffect = Math.sin(pulsePhase * Math.PI) * pulseAmplitude;
          const finalPulseEffect = pulseEffect > 0 ? pulseEffect : 0;
          
          for (let i = 0; i < orbit.dotCount; i++) {
            const angle = (i / orbit.dotCount) * Math.PI * 2;
            const pulsedRadius = orbit.radius + finalPulseEffect;
            const x = centerX + Math.cos(angle) * pulsedRadius;
            const y = centerY + Math.sin(angle) * pulsedRadius;
            const dotSize = 2 + (finalPulseEffect / pulseAmplitude) * 1.5;
            const opacity = 0.7 + (finalPulseEffect / pulseAmplitude) * 0.3;
            ctx.beginPath();
            ctx.arc(x, y, dotSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.fill();
          }
        });
        requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);
    };

    const setupPendulumWave = () => {
      const container = document.getElementById("pendulum-wave");
      if (!container) return;
      container.innerHTML = "";
      const canvas = document.createElement("canvas");
      canvas.width = 180;
      canvas.height = 180;
      canvas.style.position = "absolute";
      canvas.style.left = "0";
      canvas.style.top = "0";
      container.appendChild(canvas);
      const ctx = canvas.getContext("2d");
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      let time = 0;
      let lastTime = 0;
      
      const pendulumCount = 15;
      const baseFrequency = 0.5;
      const pendulumLength = 90;
      const maxAngle = Math.PI / 12;

      function animate(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        time += deltaTime * 0.001;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const angle = Math.sin(time * baseFrequency * Math.PI) * maxAngle;
        
        for (let i = 0; i < pendulumCount; i++) {
          const pendulumX = centerX - pendulumCount * 4 + i * 8;
          const pendulumY = centerY - pendulumLength;
          const bobX = pendulumX + Math.sin(angle) * pendulumLength;
          const bobY = pendulumY + Math.cos(angle) * pendulumLength;
          
          ctx.beginPath();
          ctx.moveTo(pendulumX, pendulumY);
          ctx.lineTo(bobX, bobY);
          ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
          ctx.lineWidth = 1;
          ctx.stroke();
          
          ctx.beginPath();
          ctx.arc(bobX, bobY, 3, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
          ctx.fill();
          
          ctx.beginPath();
          ctx.arc(pendulumX, pendulumY, 1, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
          ctx.fill();
        }
        requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);
    };

    const setupPulseWave = () => {
      const container = document.getElementById("pulse-wave");
      if (!container) return;
      container.innerHTML = "";
      const canvas = document.createElement("canvas");
      canvas.width = 180;
      canvas.height = 180;
      canvas.style.position = "absolute";
      canvas.style.left = "0";
      canvas.style.top = "0";
      container.appendChild(canvas);
      const ctx = canvas.getContext("2d");
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      let time = 0;
      let lastTime = 0;
      
      const dotRings = [
        { radius: 15, count: 6 },
        { radius: 30, count: 12 },
        { radius: 45, count: 18 },
        { radius: 60, count: 24 },
        { radius: 75, count: 30 }
      ];

      function animate(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        time += deltaTime * 0.001;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fill();
        
        dotRings.forEach((ring, ringIndex) => {
          for (let i = 0; i < ring.count; i++) {
            const angle = (i / ring.count) * Math.PI * 2;
            const radiusPulse = Math.sin(time * 2 - ringIndex * 0.4) * 3;
            const x = centerX + Math.cos(angle) * (ring.radius + radiusPulse);
            const y = centerY + Math.sin(angle) * (ring.radius + radiusPulse);
            const opacityWave = 0.4 + Math.sin(time * 2 - ringIndex * 0.4 + i * 0.2) * 0.6;
            
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${opacityWave})`;
            ctx.fill();
          }
        });
        requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);
    };

    const setupConcentricRings = () => {
      const container = document.getElementById("concentric-rings");
      if (!container) return;
      container.innerHTML = "";
      const canvas = document.createElement("canvas");
      canvas.width = 180;
      canvas.height = 180;
      canvas.style.position = "absolute";
      canvas.style.left = "0";
      canvas.style.top = "0";
      container.appendChild(canvas);
      const ctx = canvas.getContext("2d");
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      let time = 0;
      let lastTime = 0;
      
      const ringCount = 5;
      const maxRadius = 75;

      function animate(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        time += deltaTime * 0.001;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fill();
        
        for (let r = 0; r < ringCount; r++) {
          const radius = ((r + 1) / ringCount) * maxRadius;
          const dotCount = 6 + r * 6;
          const phaseOffset = r % 2 === 0 ? time * 0.2 : -time * 0.2;
          const ringPhase = time + r * 0.7;
          
          for (let i = 0; i < dotCount; i++) {
            const angle = (i / dotCount) * Math.PI * 2 + phaseOffset;
            const radiusPulse = Math.sin(ringPhase) * 3;
            const finalRadius = radius + radiusPulse;
            const x = centerX + Math.cos(angle) * finalRadius;
            const y = centerY + Math.sin(angle) * finalRadius;
            const baseSize = 2 + r / (ringCount - 1);
            const sizePulse = Math.sin(ringPhase) * baseSize * 0.7 + baseSize;
            const opacityPulse = 0.6 + Math.sin(ringPhase) * 0.4;
            
            ctx.beginPath();
            ctx.arc(x, y, sizePulse, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${opacityPulse})`;
            ctx.fill();
          }
        }
        requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);
    };

    const setupSequentialPulse = () => {
      const container = document.getElementById("sequential-pulse");
      if (!container) return;
      container.innerHTML = "";
      const canvas = document.createElement("canvas");
      canvas.width = 180;
      canvas.height = 180;
      canvas.style.position = "absolute";
      canvas.style.left = "0";
      canvas.style.top = "0";
      container.appendChild(canvas);
      const ctx = canvas.getContext("2d");
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      let time = 0;
      let lastTime = 0;
      
      const radius = 70;
      const dotCount = 16;

      function animate(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        time += deltaTime * 0.001;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
        ctx.lineWidth = 1;
        ctx.stroke();
        
        for (let i = 0; i < dotCount; i++) {
          const angle = (i / dotCount) * Math.PI * 2;
          const pulsePhase = (time * 0.5 + i / dotCount) % 1;
          const pulseFactor = Math.sin(pulsePhase * Math.PI * 2);
          const size = 2 + pulseFactor * 2;
          const finalRadius = radius + pulseFactor * 5;
          const x = centerX + Math.cos(angle) * finalRadius;
          const y = centerY + Math.sin(angle) * finalRadius;
          
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(x, y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 + pulseFactor * 0.2})`;
          ctx.lineWidth = 1;
          ctx.stroke();
          
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
          ctx.fill();
        }
        requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);
    };

    const setupOscillatingDots = () => {
      const container = document.getElementById("oscillating-dots");
      if (!container) return;
      container.innerHTML = "";
      const canvas = document.createElement("canvas");
      canvas.width = 180;
      canvas.height = 180;
      canvas.style.position = "absolute";
      canvas.style.left = "0";
      canvas.style.top = "0";
      container.appendChild(canvas);
      const ctx = canvas.getContext("2d");
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      let time = 0;
      let lastTime = 0;
      
      const dotCount = 20;
      const rowCount = 5;
      const spacing = 15;

      function animate(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        time += deltaTime * 0.001;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let row = 0; row < rowCount; row++) {
          const y = centerY - ((rowCount - 1) / 2) * spacing + row * spacing;
          for (let i = 0; i < dotCount; i++) {
            const baseX = centerX - ((dotCount - 1) / 2) * 8 + i * 8;
            const amplitude = 4 + row * 2;
            const frequency = 1 + row * 0.2;
            const phaseOffset = row * 0.5;
            const offset = Math.sin(time * frequency + i * 0.2 + phaseOffset) * amplitude;
            const x = baseX;
            const finalY = y + offset;
            
            ctx.beginPath();
            ctx.arc(x, finalY, 2, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
            ctx.fill();
          }
        }
        requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);
    };

    const setupPulsingGrid = () => {
      const container = document.getElementById("pulsing-grid");
      if (!container) return;
      container.innerHTML = "";
      const canvas = document.createElement("canvas");
      canvas.width = 180;
      canvas.height = 180;
      canvas.style.position = "absolute";
      canvas.style.left = "0";
      canvas.style.top = "0";
      container.appendChild(canvas);
      const ctx = canvas.getContext("2d");
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      let time = 0;
      let lastTime = 0;
      
      const gridSize = 5;
      const spacing = 15;
      const breathingSpeed = 0.5;
      const waveSpeed = 1.2;
      const colorPulseSpeed = 1.0;

      function animate(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        time += deltaTime * 0.001;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const breathingFactor = Math.sin(time * breathingSpeed) * 0.2 + 1.0;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fill();
        
        for (let row = 0; row < gridSize; row++) {
          for (let col = 0; col < gridSize; col++) {
            if (row === Math.floor(gridSize / 2) && col === Math.floor(gridSize / 2)) continue;
            
            const baseX = (col - (gridSize - 1) / 2) * spacing;
            const baseY = (row - (gridSize - 1) / 2) * spacing;
            const distance = Math.sqrt(baseX * baseX + baseY * baseY);
            const maxDistance = (spacing * Math.sqrt(2) * (gridSize - 1)) / 2;
            const normalizedDistance = distance / maxDistance;
            const angle = Math.atan2(baseY, baseX);
            
            const radialPhase = (time - normalizedDistance) % 1;
            const radialWave = Math.sin(radialPhase * Math.PI * 2) * 4;
            const spiralPhase = (angle / (Math.PI * 2) + time * 0.3) % 1;
            const spiralWave = Math.sin(spiralPhase * Math.PI * 2) * 3;
            const breathingX = baseX * breathingFactor;
            const breathingY = baseY * breathingFactor;
            const waveX = centerX + breathingX + Math.cos(angle) * radialWave;
            const waveY = centerY + breathingY + Math.sin(angle) * radialWave;
            
            const baseSize = 1.5 + (1 - normalizedDistance) * 1.5;
            const pulseFactor = Math.sin(time * 2 + normalizedDistance * 5) * 0.6 + 1;
            const size = baseSize * pulseFactor;
            
            const blueAmount = Math.sin(time * colorPulseSpeed + normalizedDistance * 3) * 0.3 + 0.3;
            const whiteness = 1 - blueAmount;
            const r = Math.floor(255 * whiteness + 200 * blueAmount);
            const g = Math.floor(255 * whiteness + 220 * blueAmount);
            const b = 255;
            const opacity = 0.5 + Math.sin(time * 1.5 + angle * 3) * 0.2 + normalizedDistance * 0.3;
            
            ctx.beginPath();
            ctx.arc(waveX, waveY, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
            ctx.fill();
          }
        }
        requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);
    };

    const setupSpiralGalaxy = () => {
      const container = document.getElementById("spiral-galaxy");
      if (!container) return;
      container.innerHTML = "";
      const canvas = document.createElement("canvas");
      canvas.width = 180;
      canvas.height = 180;
      canvas.style.position = "absolute";
      canvas.style.left = "0";
      canvas.style.top = "0";
      container.appendChild(canvas);
      const ctx = canvas.getContext("2d");
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      let time = 0;
      let lastTime = 0;
      
      const particleCount = 200;
      const maxRadius = 75;
      const spiralArms = 3;
      const rotationSpeed = 0.1;
      
      const particles = [];
      for (let i = 0; i < particleCount; i++) {
        const distanceFactor = Math.pow(Math.random(), 0.5);
        const distance = distanceFactor * maxRadius;
        const armIndex = Math.floor(Math.random() * spiralArms);
        const armOffset = (armIndex / spiralArms) * Math.PI * 2;
        const spiralTightness = 0.2;
        const spiralAngle = Math.log(distance / 5) / spiralTightness;
        
        particles.push({
          distance: distance,
          angle: spiralAngle + armOffset,
          armIndex: armIndex,
          size: 1 + Math.random() * 1.5,
          opacity: 0.3 + Math.random() * 0.7,
          speedFactor: 0.8 + Math.random() * 0.4,
          color: {
            r: 220 + Math.floor(Math.random() * 35),
            g: 220 + Math.floor(Math.random() * 35),
            b: 255
          }
        });
      }

      function animate(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        time += deltaTime * 0.001;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fill();
        
        for (const particle of particles) {
          const rotationFactor = 1 / Math.sqrt(particle.distance / 10);
          particle.angle += rotationSpeed * rotationFactor * particle.speedFactor * deltaTime * 0.05;
          
          const x = centerX + Math.cos(particle.angle) * particle.distance;
          const y = centerY + Math.sin(particle.angle) * particle.distance;
          const armPhase = (time * 0.5 + particle.armIndex / spiralArms) % 1;
          const pulseFactor = Math.sin(armPhase * Math.PI * 2) * 0.3 + 0.7;
          
          ctx.beginPath();
          ctx.arc(x, y, particle.size * pulseFactor, 0, Math.PI * 2);
          const finalOpacity = particle.opacity * pulseFactor;
          ctx.fillStyle = `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${finalOpacity})`;
          ctx.fill();
          
          if (particle.size > 1.8) {
            const trailLength = particle.distance * 0.15;
            const trailAngle = particle.angle - 0.1 * rotationFactor;
            const trailX = centerX + Math.cos(trailAngle) * (particle.distance - trailLength);
            const trailY = centerY + Math.sin(trailAngle) * (particle.distance - trailLength);
            
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(trailX, trailY);
            ctx.strokeStyle = `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${finalOpacity * 0.3})`;
            ctx.lineWidth = particle.size * 0.5;
            ctx.stroke();
          }
        }
        requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);
    };

    // Initialize animations
    initializeAnimations();
    addCornerDecorations();
  }, []);

  // Product to animation mapping
  const productAnimations = [
    {
      id: "radial-pulse",
      product: "ByteAI",
      title: "The Core Nucleus",
      description: "At the center of the ByteVerse is a calm, bright nucleus. Eight short rays radiate outward—eight bits forming a single byte—while a protective ring suggests a focused mind.",
      symbolism: "Octagon core + 8 rays inside a ring = the byte that powers everything.",
      logo: "/images/ByteVerse-Brand-Pack/ByteAI/transparent/ByteAI_transparent_512.png"
    },
    {
      id: "orbital-pulse",
      product: "ByteVerse",
      title: "The Connected Universe",
      description: "Zoom out and you'll see routes, not walls. Lines converge into a strong \"V\", showing how tools, data, and people connect across the ecosystem.",
      symbolism: "A V-shaped constellation lattice; everything orbits purpose.",
      logo: "/images/ByteVerse-Brand-Pack/ByteVerse/transparent/ByteVerse_transparent_512.png"
    },
    {
      id: "pendulum-wave",
      product: "ByteNimbus",
      title: "Design-Heavy Content Generator",
      description: "Nimbus is the studio in the sky. It blends visual craft with AI speed—beautiful, on-brand learning collateral at the push of a button.",
      symbolism: "Creative cloud + pen-nib diamond + export arrow.",
      logo: "/images/ByteVerse-Brand-Pack/ByteNimbus/transparent/ByteNimbus_transparent_512.png"
    },
    {
      id: "pulse-wave",
      product: "ByteTok",
      title: "Social, Snackable Learning",
      description: "Learning is social. ByteTok turns insights into shareable, scroll-friendly posts and short videos. The bubbles overlap to show conversation.",
      symbolism: "Overlapping chat bubbles with a play triangle.",
      logo: "/images/ByteVerse-Brand-Pack/ByteTok/transparent/ByteTok_transparent_512.png"
    },
    {
      id: "concentric-rings",
      product: "ByteLab",
      title: "Experimentation & Rapid Prototyping",
      description: "ByteLab is where ideas get their first oxygen. Spin up prototypes, compare versions, and measure impact. The simple math around the flask is the loop.",
      symbolism: "Flask with ± and =. Try, tweak, learn.",
      logo: "/images/ByteVerse-Brand-Pack/ByteLab/transparent/ByteLab_transparent_512.png"
    },
    {
      id: "sequential-pulse",
      product: "ByteAnalytics",
      title: "Dashboards & Insight",
      description: "Data deserves clarity. ByteAnalytics translates activity into understanding—where learners struggle, which content works, what to fix next.",
      symbolism: "Three bars and a rising line to a focus dot.",
      logo: "/images/ByteVerse-Brand-Pack/ByteAnalytics/transparent/ByteAnalytics_transparent_512.png"
    },
    {
      id: "oscillating-dots",
      product: "ByteSim",
      title: "Scenario Practice with Feedback Loops",
      description: "Confidence comes from reps. ByteSim lets learners make choices, see consequences, and loop again—without real-world risk.",
      symbolism: "Decision diamond, branching path, and a loop-back arrow.",
      logo: "/images/ByteVerse-Brand-Pack/ByteSim/transparent/ByteSim_transparent_512.png"
    },
    {
      id: "pulsing-grid",
      product: "ByteHub",
      title: "Library of Prebuilt & Curated Content",
      description: "Not everything needs to be built from scratch. ByteHub is the shelf where ready-to-use modules live—curated, tagged, remixable.",
      symbolism: "Shelves with a bookmark tab.",
      logo: "/images/ByteVerse-Brand-Pack/ByteHub/transparent/ByteHub_transparent_512.png"
    },
    {
      id: "spiral-galaxy",
      product: "ByteGenie",
      title: "Contextual Assistant & Automation",
      description: "Genie is the co-pilot that reduces friction: it fetches what you need, suggests the next step, and automates the boring bits.",
      symbolism: "Minimal wand, guiding star, and a dotted path.",
      logo: "/images/ByteVerse-Brand-Pack/ByteGenie/transparent/ByteGenie_transparent_512.png"
    }
  ];

  return (
    <section id="byteverse-universe" className="container-narrow py-20">
      <div className="nimbus-card p-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
            The ByteVerse Universe
          </h2>
          <p className="text-lg text-white/80 max-w-3xl mx-auto">
            Small, elegant pieces—connected with purpose. Every symbol is intentionally simple, 
            like a good API: predictable, reusable, and easy to combine.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {productAnimations.map((item) => (
            <div key={item.id} className="product-card nimbus-card p-6" style={{
              position: 'relative',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}>
              {/* GradientBlinds Background - Hidden by default, shown on hover */}
              <div className="gradient-background" style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0,
                transition: 'opacity 0.3s ease',
                zIndex: 1,
                width: '100%',
                height: '100%'
              }}>
                <GradientBlinds
                  gradientColors={['#F5F5F7', '#7D7DFF', '#5227FF']}
                  angle={12}
                  noise={0.20}
                  blindCount={0}
                  spotlightRadius={0.6}
                  spotlightSoftness={1.4}
                  spotlightOpacity={0.9}
                  mouseDampening={0.2}
                  distortAmount={0.5}
                  shineDirection="left"
                  mixBlendMode="screen"
                />
              </div>

              {/* Header with Logo and Title */}
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <img 
                  src={item.logo} 
                  alt={`${item.product} Logo`} 
                  className="w-12 h-12"
                />
                <div>
                  <h3 className="text-xl font-semibold">{item.product}</h3>
                  <p className="text-sm text-white/60">{item.title}</p>
                </div>
              </div>
              
              {/* Animation Container - Centered */}
              <div 
                id={item.id} 
                className="animation-container mb-6 relative z-10"
                style={{
                  position: 'relative',
                  width: '180px',
                  height: '180px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  opacity: 1,
                  transition: 'all 0.3s ease',
                  pointerEvents: 'none'
                }}
              ></div>

              {/* Text Content Below Animation */}
              <div className="w-full relative z-10">
                <p className="text-white/70 text-sm mb-3">
                  {item.description}
                </p>
                <div className="text-xs text-white/50">
                  <strong>Symbolism:</strong> {item.symbolism}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* The ByteVerse Promise */}
        <div className="mt-12 nimbus-card p-8">
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-4">The ByteVerse Promise</h3>
            <p className="text-white/80 text-lg leading-relaxed max-w-4xl mx-auto">
              Together they form a constellation—your learning universe—where content is beautiful, 
              data is legible, practice is safe, and help is always one prompt away.
            </p>
            <div className="mt-6 text-sm text-white/60">
              <p>Every symbol is intentionally simple, like a good API: predictable, reusable, and easy to combine.</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .product-card {
          position: relative;
          transition: all 0.3s ease;
          overflow: hidden;
        }
        
        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
          border-color: rgba(255, 255, 255, 0.3);
        }
        
        .product-card:hover .gradient-background {
          opacity: 1 !important;
        }
        
        .product-card:hover .animation-container {
          transform: scale(1.1);
          filter: brightness(1.2);
        }
        
        .corner {
          position: absolute;
          width: 16px;
          height: 16px;
          color: white;
          opacity: 0;
          z-index: 10;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        
        .product-card:hover .corner {
          opacity: 1;
          animation: cornerGlow 1s ease-in-out infinite alternate;
        }
        
        @keyframes cornerGlow {
          0% {
            filter: brightness(1);
          }
          100% {
            filter: brightness(1.5);
          }
        }
        
        .top-left {
          top: -8px;
          left: -8px;
          transition-delay: 0s;
        }
        
        .top-right {
          top: -8px;
          right: -8px;
          transform: rotate(90deg);
          transition-delay: 0.1s;
        }
        
        .bottom-left {
          bottom: -8px;
          left: -8px;
          transform: rotate(-90deg);
          transition-delay: 0.2s;
        }
        
        .bottom-right {
          bottom: -8px;
          right: -8px;
          transform: rotate(180deg);
          transition-delay: 0.3s;
        }
      `}</style>
    </section>
  );
}
