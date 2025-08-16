import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const AnimatedWrapper = ({ 
  children, 
  className = '', 
  animationType = 'fadeIn',
  delay = 0,
  duration = 0.6,
  once = true
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(ref.current);
          }
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [once]);

  const animations = {
    fadeIn: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 }
    },
    slideUp: {
      initial: { opacity: 0, y: 50 },
      animate: { opacity: 1, y: 0 }
    },
    slideLeft: {
      initial: { opacity: 0, x: -50 },
      animate: { opacity: 1, x: 0 }
    },
    slideRight: {
      initial: { opacity: 0, x: 50 },
      animate: { opacity: 1, x: 0 }
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 }
    },
    bounceIn: {
      initial: { opacity: 0, scale: 0.3, y: -30 },
      animate: { 
        opacity: 1, 
        scale: [1.05, 0.95, 1], 
        y: 0,
        transition: { 
          scale: { times: [0, 0.7, 1] },
          duration: duration * 1.2
        }
      }
    },
    rotateIn: {
      initial: { opacity: 0, rotate: -180, scale: 0.8 },
      animate: { opacity: 1, rotate: 0, scale: 1 }
    }
  };

  const selectedAnimation = animations[animationType] || animations.fadeIn;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={selectedAnimation.initial}
      animate={isVisible ? selectedAnimation.animate : selectedAnimation.initial}
      transition={{
        duration,
        delay,
        ease: "easeOut",
        ...selectedAnimation.animate?.transition
      }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedWrapper;