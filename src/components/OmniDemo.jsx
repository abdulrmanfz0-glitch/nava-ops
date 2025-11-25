/**
 * OMNI-REALITY ENGINE DEMO
 * Demonstrates all OMNI systems in action
 */

import React, { useState } from 'react';
import { useOmniReality } from '../contexts/OmniRealityContext';
import { HoloPanel, HoloCard } from '../omni/hologram/holoPanel';
import RippleFX from '../omni/fluid/rippleFX';

export const OmniDemo = () => {
  const {
    isInitialized,
    engineStatus,
    getSystemStats,
    createParticleEffect,
    triggerMutation,
    createHologram,
  } = useOmniReality();

  const [stats, setStats] = useState(null);

  const handleParticleBurst = (e) => {
    createParticleEffect(e.clientX, e.clientY, 'burst');
  };

  const handleShowStats = () => {
    const systemStats = getSystemStats();
    setStats(systemStats);
    console.log('📊 OMNI System Stats:', systemStats);
  };

  const handleCompactMode = () => {
    triggerMutation('COMPACT_MODE', 'global');
  };

  const handleExpandMode = () => {
    triggerMutation('EXPAND_MODE', 'global');
  };

  const handleHologram = (e) => {
    createHologram(e.clientX, e.clientY, 200, {
      intensity: 0.9,
      duration: 2000,
    });
  };

  if (!isInitialized) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-600">Initializing OMNI-REALITY ENGINE...</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 neural-bg">
      <div className="holo-glass rounded-2xl p-6 quantum-glow">
        <h1 className="text-4xl font-bold holo-text mb-2">
          NavaOS OMNI-REALITY ENGINE
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Multi-dimensional adaptive interface with quantum-grade interactivity
        </p>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(engineStatus).map(([system, status]) => (
            <div
              key={system}
              className={`p-3 rounded-lg border ${
                status
                  ? 'border-green-500 bg-green-500/10'
                  : 'border-red-500 bg-red-500/10'
              }`}
            >
              <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
                {system}
              </div>
              <div className={status ? 'text-green-600' : 'text-red-600'}>
                {status ? '✓ Active' : '✗ Inactive'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <HoloCard intensity={0.8} className="p-6">
          <h3 className="text-xl font-bold mb-3">🧬 Quantum Fabric</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Self-mutating interface that adapts to your behavior
          </p>
          <div className="space-y-2">
            <RippleFX>
              <button
                onClick={handleCompactMode}
                className="w-full quantum-button text-white py-2 px-4 rounded-lg"
              >
                Compact Mode
              </button>
            </RippleFX>
            <RippleFX>
              <button
                onClick={handleExpandMode}
                className="w-full quantum-button text-white py-2 px-4 rounded-lg"
              >
                Expand Mode
              </button>
            </RippleFX>
          </div>
        </HoloCard>

        <HoloCard intensity={0.8} className="p-6 particle-trail">
          <h3 className="text-xl font-bold mb-3">⚛️ Particle Engine</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Nanotech UI with micro-particle behaviors
          </p>
          <RippleFX>
            <button
              onClick={handleParticleBurst}
              className="w-full quantum-button text-white py-2 px-4 rounded-lg energy-field"
            >
              Create Particle Burst
            </button>
          </RippleFX>
        </HoloCard>

        <HoloCard intensity={0.8} className="p-6 volumetric-projection">
          <h3 className="text-xl font-bold mb-3">🔮 Holographic System</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Volumetric projections and holographic displays
          </p>
          <RippleFX>
            <button
              onClick={handleHologram}
              className="w-full quantum-button text-white py-2 px-4 rounded-lg prism-effect"
            >
              Create Hologram
            </button>
          </RippleFX>
        </HoloCard>
      </div>

      <div className="holo-glass rounded-2xl p-6">
        <h3 className="text-xl font-bold mb-4">🎯 Interactive Features</h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">Try These Interactions:</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Click anywhere on the page for particle bursts</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Hover over cards for holographic glow effects</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Move cursor rapidly to create fluid ripples</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Buttons have ripple and particle effects</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>UI adapts to your interaction patterns</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">AI Governor Active:</h4>
            <div className="space-y-2 text-sm">
              <div className="holo-glass p-3 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Monitoring</div>
                <div className="text-blue-600">
                  ✓ Tracking cursor patterns
                </div>
              </div>
              <div className="holo-glass p-3 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Analyzing</div>
                <div className="text-green-600">
                  ✓ Learning user behavior
                </div>
              </div>
              <div className="holo-glass p-3 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Predicting</div>
                <div className="text-purple-600">
                  ✓ Anticipating next action
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <RippleFX>
            <button
              onClick={handleShowStats}
              className="quantum-button text-white py-2 px-6 rounded-lg"
            >
              Show System Statistics
            </button>
          </RippleFX>

          {stats && (
            <div className="mt-4 holo-glass p-4 rounded-lg">
              <h4 className="font-semibold mb-2">System Statistics:</h4>
              <pre className="text-xs overflow-auto bg-black/20 p-3 rounded">
                {JSON.stringify(stats, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>

      <div className="text-center text-sm text-gray-500">
        <p>✨ All systems operational | Zero backend changes | Pure visual enhancement</p>
      </div>
    </div>
  );
};

export default OmniDemo;
