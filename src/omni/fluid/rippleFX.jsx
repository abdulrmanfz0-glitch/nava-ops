/**
 * RIPPLE FX - React Component
 * Creates interactive ripple effects on UI elements
 */

import React, { useEffect, useRef, useState } from 'react';

export const RippleFX = ({ children, className = '', disabled = false }) => {
  const containerRef = useRef(null);
  const [ripples, setRipples] = useState([]);

  useEffect(() => {
    if (disabled) return;

    const handleClick = (e) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = {
        id: Date.now(),
        x,
        y,
        size: Math.max(rect.width, rect.height) * 2,
      };

      setRipples((prev) => [...prev, ripple]);

      // Remove ripple after animation
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
      }, 600);
    };

    const container = containerRef.current;
    container?.addEventListener('click', handleClick);

    return () => {
      container?.removeEventListener('click', handleClick);
    };
  }, [disabled]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ position: 'relative' }}
    >
      {children}
      {!disabled && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            overflow: 'hidden',
          }}
        >
          {ripples.map((ripple) => (
            <span
              key={ripple.id}
              style={{
                position: 'absolute',
                left: ripple.x,
                top: ripple.y,
                width: ripple.size,
                height: ripple.size,
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'radial-gradient(circle, rgba(96, 165, 250, 0.4) 0%, rgba(96, 165, 250, 0) 70%)',
                animation: 'ripple-animation 600ms ease-out',
                pointerEvents: 'none',
              }}
            />
          ))}
        </div>
      )}
      <style jsx>{`
        @keyframes ripple-animation {
          from {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }
          to {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

/**
 * Hook for creating ripples programmatically
 */
export const useRipple = () => {
  const createRipple = (element, x, y) => {
    if (!element) return;

    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();

    const size = Math.max(rect.width, rect.height) * 2;

    ripple.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      background: radial-gradient(circle, rgba(96, 165, 250, 0.4) 0%, rgba(96, 165, 250, 0) 70%);
      animation: ripple-animation 600ms ease-out;
      pointer-events: none;
    `;

    element.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  };

  return { createRipple };
};

export default RippleFX;
