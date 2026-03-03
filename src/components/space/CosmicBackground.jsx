import React, { useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const CosmicBackground = () => {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -500]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 0.6, 0.6, 1]);

  const stars = useMemo(() => 
    Array.from({ length: 200 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.7 + 0.3,
      duration: Math.random() * 3 + 2,
    })), []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-black pointer-events-none">
      {/* Deep Nebula Layer */}
      <motion.div 
        style={{ opacity }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(82,39,255,0.08)_0%,_transparent_70%)]" 
      />
      
      {/* Stars Layer 1 (Slow) */}
      <motion.div style={{ y: y1 }} className="absolute inset-0">
        {stars.slice(0, 100).map(star => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-white"
            initial={{ opacity: star.opacity }}
            animate={{ opacity: [star.opacity, 0.2, star.opacity] }}
            transition={{ duration: star.duration, repeat: Infinity, ease: "easeInOut" }}
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
            }}
          />
        ))}
      </motion.div>

      {/* Stars Layer 2 (Fast) */}
      <motion.div style={{ y: y2 }} className="absolute inset-0">
        {stars.slice(100).map(star => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size * 0.8,
              height: star.size * 0.8,
              opacity: star.opacity * 0.5,
            }}
          />
        ))}
      </motion.div>

      {/* Cinematic Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_100%)] opacity-60" />
    </div>
  );
};

export default CosmicBackground;
