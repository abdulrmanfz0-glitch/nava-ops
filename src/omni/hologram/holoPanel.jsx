/**
 * HOLO PANEL - React Component
 * Holographic floating panels with volumetric projection effects
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const HoloPanel = ({
  children,
  trigger = 'hover',
  position = 'top',
  offset = 20,
  delay = 200,
  className = '',
  hologramIntensity = 0.8,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const triggerElement = triggerRef.current;
    if (!triggerElement) return;

    const handleMouseEnter = () => {
      timeoutRef.current = setTimeout(() => {
        const rect = triggerElement.getBoundingClientRect();
        calculatePosition(rect);
        setIsVisible(true);
      }, delay);
    };

    const handleMouseLeave = () => {
      clearTimeout(timeoutRef.current);
      setIsVisible(false);
    };

    const handleClick = () => {
      const rect = triggerElement.getBoundingClientRect();
      calculatePosition(rect);
      setIsVisible(!isVisible);
    };

    const calculatePosition = (rect) => {
      let x = rect.left + rect.width / 2;
      let y = rect.top;

      switch (position) {
        case 'top':
          y = rect.top - offset;
          break;
        case 'bottom':
          y = rect.bottom + offset;
          break;
        case 'left':
          x = rect.left - offset;
          y = rect.top + rect.height / 2;
          break;
        case 'right':
          x = rect.right + offset;
          y = rect.top + rect.height / 2;
          break;
        default:
          break;
      }

      setCoords({ x, y });
    };

    if (trigger === 'hover') {
      triggerElement.addEventListener('mouseenter', handleMouseEnter);
      triggerElement.addEventListener('mouseleave', handleMouseLeave);
    } else if (trigger === 'click') {
      triggerElement.addEventListener('click', handleClick);
    }

    return () => {
      clearTimeout(timeoutRef.current);
      triggerElement.removeEventListener('mouseenter', handleMouseEnter);
      triggerElement.removeEventListener('mouseleave', handleMouseLeave);
      triggerElement.removeEventListener('click', handleClick);
    };
  }, [trigger, position, offset, delay, isVisible]);

  return (
    <>
      <div ref={triggerRef} className={className}>
        {children}
      </div>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateX: -15 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotateX: 15 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              left: coords.x,
              top: coords.y,
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              zIndex: 999999,
              perspective: '1000px',
            }}
          >
            <div
              className="hologram-panel"
              style={{
                background: `linear-gradient(135deg,
                  rgba(96, 165, 250, ${hologramIntensity * 0.2}),
                  rgba(129, 140, 248, ${hologramIntensity * 0.3}),
                  rgba(167, 139, 250, ${hologramIntensity * 0.2}))`,
                backdropFilter: 'blur(20px)',
                border: `1px solid rgba(96, 165, 250, ${hologramIntensity * 0.5})`,
                borderRadius: '12px',
                padding: '16px 20px',
                boxShadow: `
                  0 0 20px rgba(96, 165, 250, ${hologramIntensity * 0.4}),
                  0 0 40px rgba(96, 165, 250, ${hologramIntensity * 0.2}),
                  inset 0 0 20px rgba(255, 255, 255, ${hologramIntensity * 0.1})
                `,
                transformStyle: 'preserve-3d',
                animation: 'holo-float 3s ease-in-out infinite',
              }}
            >
              <div className="holo-scanlines" />
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .hologram-panel {
          position: relative;
        }

        .holo-scanlines {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(96, 165, 250, 0.05) 50%,
            transparent 100%
          );
          background-size: 100% 4px;
          animation: holo-scan 2s linear infinite;
          pointer-events: none;
          border-radius: 12px;
        }

        @keyframes holo-float {
          0%,
          100% {
            transform: translateZ(0px) rotateX(0deg);
          }
          50% {
            transform: translateZ(10px) rotateX(2deg);
          }
        }

        @keyframes holo-scan {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 0 100%;
          }
        }
      `}</style>
    </>
  );
};

/**
 * Holographic Card Component
 */
export const HoloCard = ({ children, className = '', intensity = 0.8 }) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`holo-card ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        transition: 'transform 0.3s ease-out',
        background: `linear-gradient(135deg,
          rgba(96, 165, 250, ${intensity * 0.1}),
          rgba(129, 140, 248, ${intensity * 0.15}),
          rgba(167, 139, 250, ${intensity * 0.1}))`,
        backdropFilter: 'blur(10px)',
        border: `1px solid rgba(96, 165, 250, ${intensity * 0.3})`,
        borderRadius: '16px',
        padding: '24px',
        boxShadow: `
          0 8px 32px rgba(96, 165, 250, ${intensity * 0.2}),
          inset 0 0 20px rgba(255, 255, 255, ${intensity * 0.05})
        `,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        className="holo-reflection"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at ${
            50 + rotation.y * 2
          }% ${50 + rotation.x * 2}%, rgba(255, 255, 255, ${intensity * 0.2}), transparent 60%)`,
          pointerEvents: 'none',
        }}
      />
      {children}
    </div>
  );
};

export default HoloPanel;
