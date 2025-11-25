/**
 * OMNI-REALITY ENGINE CONTEXT
 * Central context provider for the NavaOS OMNI-REALITY ENGINE
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

// Import all OMNI systems
import { quantumFabric } from '../omni/fabric/quantumFabric';
import { selfMutateEngine } from '../omni/fabric/selfMutate';
import { adaptiveWeaving } from '../omni/fabric/adaptiveWeaving';

import { hyperspaceEngine } from '../omni/space/hyperspaceEngine';
import { tesseract } from '../omni/space/tesseract';
import { chronoLayout } from '../omni/space/chronoLayout';

import { particleCore } from '../omni/particles/particleCore';
import { dustSimulation } from '../omni/particles/dustSimulation';
import { morphingFX } from '../omni/particles/morphingFX';

import { governor } from '../ai/governor/governor';
import { predictionMatrix } from '../ai/governor/predictionMatrix';
import { userIntentModel } from '../ai/governor/userIntentModel';

import { fluidEngine } from '../omni/fluid/fluidEngine';
import { pressureField } from '../omni/fluid/pressureField';

import { volumetricRenderer } from '../omni/hologram/volumetricRenderer';
import { prismFX } from '../omni/hologram/prismFX';

import { audioSense } from '../omni/sensors/audioSense';
import { motionSense } from '../omni/sensors/motionSense';
import { cognitiveSense } from '../omni/sensors/cognitiveSense';

import { foldSpace } from '../omni/transitions/foldSpace';
import { warpGate } from '../omni/transitions/warpGate';
import { neuralFade } from '../omni/transitions/neuralFade';

const OmniRealityContext = createContext(null);

export const useOmniReality = () => {
  const context = useContext(OmniRealityContext);
  if (!context) {
    throw new Error('useOmniReality must be used within OmniRealityProvider');
  }
  return context;
};

export const OmniRealityProvider = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [engineStatus, setEngineStatus] = useState({
    quantumFabric: false,
    hyperspace: false,
    particles: false,
    aiGovernor: false,
    fluid: false,
    hologram: false,
    sensors: false,
    transitions: false,
  });

  /**
   * Initialize all OMNI systems
   */
  useEffect(() => {
    console.log('🚀 NavaOS OMNI-REALITY ENGINE: Activation sequence initiated...');

    const initializeEngine = async () => {
      try {
        // Initialize Quantum UI Fabric
        console.log('🧬 Activating Quantum UI Fabric...');
        quantumFabric.initialize();
        morphingFX.initialize();
        setEngineStatus((prev) => ({ ...prev, quantumFabric: true }));

        // Initialize Multi-Dimensional Space UI
        console.log('🌌 Activating Hyperspace Engine...');
        hyperspaceEngine.initialize();
        chronoLayout.initialize();
        setEngineStatus((prev) => ({ ...prev, hyperspace: true }));

        // Initialize Particle System
        console.log('⚛️ Activating Particle Core...');
        particleCore.initialize();
        dustSimulation.initialize();
        setEngineStatus((prev) => ({ ...prev, particles: true }));

        // Initialize Meta-AI Governor
        console.log('🧠 Activating Meta-AI Governor...');
        governor.initialize();
        predictionMatrix.initialize();
        userIntentModel.initialize();
        setEngineStatus((prev) => ({ ...prev, aiGovernor: true }));

        // Initialize Fluid Simulation
        console.log('💠 Activating Fluid Engine...');
        fluidEngine.initialize();
        pressureField.initialize();
        setEngineStatus((prev) => ({ ...prev, fluid: true }));

        // Initialize Holographic System
        console.log('🔮 Activating Volumetric Renderer...');
        volumetricRenderer.initialize();
        prismFX.initialize();
        setEngineStatus((prev) => ({ ...prev, hologram: true }));

        // Initialize Sensor Reactivity
        console.log('🎧 Activating Sensor Array...');
        await audioSense.initialize();
        motionSense.initialize();
        cognitiveSense.initialize();
        setEngineStatus((prev) => ({ ...prev, sensors: true }));

        // Initialize Transitions
        console.log('🔥 Activating Omni-Layer Transitions...');
        foldSpace.initialize();
        warpGate.initialize();
        neuralFade.initialize();
        setEngineStatus((prev) => ({ ...prev, transitions: true }));

        // Setup interconnections
        setupEngineInterconnections();

        setIsInitialized(true);
        console.log('✨ NavaOS OMNI-REALITY ENGINE: FULLY OPERATIONAL');
      } catch (error) {
        console.error('❌ OMNI-REALITY ENGINE: Initialization error:', error);
      }
    };

    initializeEngine();

    // Cleanup on unmount
    return () => {
      console.log('🛑 NavaOS OMNI-REALITY ENGINE: Shutting down...');
      quantumFabric.stop();
      hyperspaceEngine.stop();
      particleCore.stop();
      governor.stop();
      fluidEngine.stop();
      volumetricRenderer.stop();
      audioSense.stop();
      motionSense.stop();
      dustSimulation.stop();
    };
  }, []);

  /**
   * Setup interconnections between systems
   */
  const setupEngineInterconnections = () => {
    // Connect Quantum Fabric to Self-Mutate Engine
    window.addEventListener('quantum-mutation', (e) => {
      selfMutateEngine.applyMutation(e.detail);
    });

    // Connect Governor predictions to Adaptive Weaving
    window.addEventListener('governor-intent', (e) => {
      adaptiveWeaving.analyzePreferences([e.detail]);
    });

    // Connect Motion Sense to Particle Effects
    window.addEventListener('motion-detected', (e) => {
      if (e.detail.pattern === 'rapid') {
        // Create particle trail for rapid movement
        const event = new CustomEvent('create-particle-trail', {
          detail: { intensity: e.detail.velocity },
        });
        window.dispatchEvent(event);
      }
    });

    // Connect Cognitive State to UI Adaptation
    window.addEventListener('cognitive-state', (e) => {
      if (e.detail.confusion > 0.7) {
        // Simplify UI when user is confused
        const event = new CustomEvent('quantum-mutation', {
          detail: { type: 'SIMPLIFY_LAYOUT', target: 'global' },
        });
        window.dispatchEvent(event);
      }
    });

    // Connect Particle morphing events to core
    window.addEventListener('morph-particles', (e) => {
      const { morph } = e.detail;
      morph.particles.forEach((particle) => {
        particleCore.emit(particle.startX, particle.startY, 1, {
          vx: (particle.endX - particle.startX) / 50,
          vy: (particle.endY - particle.startY) / 50,
        });
      });
    });
  };

  /**
   * Get comprehensive system statistics
   */
  const getSystemStats = useCallback(() => {
    return {
      quantumFabric: quantumFabric.getStats(),
      particles: particleCore.getStats(),
      aiGovernor: governor.getStats(),
      fluid: fluidEngine.getStats(),
      hologram: volumetricRenderer.getStats(),
      sensors: {
        motion: motionSense.getStats(),
        cognitive: cognitiveSense.getStats(),
        audio: audioSense.getStats(),
      },
      hyperspace: hyperspaceEngine.getPosition(),
      transitions: {
        foldSpace: foldSpace.getStats(),
        warpGate: warpGate.getStats(),
      },
    };
  }, []);

  /**
   * Trigger quantum mutation manually
   */
  const triggerMutation = useCallback((type, target) => {
    selfMutateEngine.applyMutation({ type, target });
  }, []);

  /**
   * Create particle effect
   */
  const createParticleEffect = useCallback((x, y, type = 'burst') => {
    if (type === 'burst') {
      particleCore.burst(x, y, 50);
    } else if (type === 'emit') {
      particleCore.emit(x, y, 20);
    }
  }, []);

  /**
   * Trigger page transition
   */
  const triggerTransition = useCallback(async (from, to, type = 'warp') => {
    if (type === 'warp') {
      return await warpGate.warp(from, to);
    } else if (type === 'fold') {
      return await foldSpace.fold(from, to);
    } else if (type === 'fade') {
      return await neuralFade.fade(from, to);
    }
  }, []);

  /**
   * Create holographic panel
   */
  const createHologram = useCallback((x, y, size, options = {}) => {
    return volumetricRenderer.createVolume(x, y, size, options);
  }, []);

  /**
   * Navigate in hyperspace
   */
  const hyperspaceNavigate = useCallback((x, y, z) => {
    return hyperspaceEngine.navigateTo(x, y, z);
  }, []);

  const value = {
    isInitialized,
    engineStatus,
    getSystemStats,
    triggerMutation,
    createParticleEffect,
    triggerTransition,
    createHologram,
    hyperspaceNavigate,
    // Direct access to engines
    engines: {
      quantumFabric,
      hyperspace: hyperspaceEngine,
      particles: particleCore,
      governor,
      fluid: fluidEngine,
      hologram: volumetricRenderer,
      transitions: { foldSpace, warpGate, neuralFade },
    },
  };

  return (
    <OmniRealityContext.Provider value={value}>
      {children}
      {isInitialized && (
        <div className="omni-reality-status" style={{ display: 'none' }}>
          ✨ OMNI-REALITY ENGINE ACTIVE
        </div>
      )}
    </OmniRealityContext.Provider>
  );
};

export default OmniRealityProvider;
