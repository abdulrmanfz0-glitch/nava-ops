/**
 * AUDIO SENSE
 * Audio input reactivity for UI adaptation
 */

export class AudioSense {
  constructor() {
    this.audioContext = null;
    this.analyser = null;
    this.microphone = null;
    this.isListening = false;
    this.audioLevels = {
      volume: 0,
      frequency: 0,
      energy: 0,
    };
  }

  /**
   * Initialize audio sensing
   */
  async initialize() {
    console.log('🎧 AUDIO SENSE: Initializing audio reactivity...');

    try {
      // Request microphone permission (optional - only if user allows)
      this.setupAudioContext();
      return this;
    } catch (error) {
      console.log('Audio sensing disabled - no microphone access');
      return this;
    }
  }

  /**
   * Setup audio context
   */
  setupAudioContext() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256;
  }

  /**
   * Request microphone access
   */
  async requestMicrophoneAccess() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.log('getUserMedia not supported');
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.microphone = this.audioContext.createMediaStreamSource(stream);
      this.microphone.connect(this.analyser);
      this.isListening = true;
      this.startMonitoring();
      return true;
    } catch (error) {
      console.log('Microphone access denied:', error);
      return false;
    }
  }

  /**
   * Start audio monitoring
   */
  startMonitoring() {
    if (!this.isListening) return;

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const analyze = () => {
      if (!this.isListening) return;

      this.analyser.getByteFrequencyData(dataArray);

      // Calculate audio metrics
      this.audioLevels.volume = this.calculateVolume(dataArray);
      this.audioLevels.frequency = this.calculateDominantFrequency(dataArray);
      this.audioLevels.energy = this.calculateEnergy(dataArray);

      // Emit audio state event
      this.emitAudioState();

      // Adapt UI based on audio
      this.adaptUIToAudio();

      requestAnimationFrame(analyze);
    };

    analyze();
  }

  /**
   * Calculate volume level
   */
  calculateVolume(dataArray) {
    const sum = dataArray.reduce((acc, val) => acc + val, 0);
    return sum / dataArray.length / 255;
  }

  /**
   * Calculate dominant frequency
   */
  calculateDominantFrequency(dataArray) {
    let maxValue = 0;
    let maxIndex = 0;

    for (let i = 0; i < dataArray.length; i++) {
      if (dataArray[i] > maxValue) {
        maxValue = dataArray[i];
        maxIndex = i;
      }
    }

    // Convert bin index to frequency
    const nyquist = this.audioContext.sampleRate / 2;
    return (maxIndex * nyquist) / dataArray.length;
  }

  /**
   * Calculate audio energy
   */
  calculateEnergy(dataArray) {
    const sumSquares = dataArray.reduce((acc, val) => acc + val * val, 0);
    return Math.sqrt(sumSquares / dataArray.length) / 255;
  }

  /**
   * Adapt UI based on audio input
   */
  adaptUIToAudio() {
    const { volume, energy } = this.audioLevels;

    if (volume > 0.5) {
      // High volume - make UI more prominent
      this.emitUIAdaptation('high-audio', {
        suggestion: 'increase-contrast',
        intensity: volume,
      });
    } else if (volume < 0.1) {
      // Quiet environment - subtle UI
      this.emitUIAdaptation('low-audio', {
        suggestion: 'soft-colors',
        intensity: 1 - volume,
      });
    }

    if (energy > 0.7) {
      // High energy - fast animations
      this.emitUIAdaptation('high-energy', {
        suggestion: 'fast-animations',
        intensity: energy,
      });
    }
  }

  /**
   * Emit audio state event
   */
  emitAudioState() {
    const event = new CustomEvent('audio-state', {
      detail: this.audioLevels,
    });
    window.dispatchEvent(event);
  }

  /**
   * Emit UI adaptation suggestion
   */
  emitUIAdaptation(type, data) {
    const event = new CustomEvent('audio-ui-adaptation', {
      detail: { type, ...data },
    });
    window.dispatchEvent(event);
  }

  /**
   * Stop audio monitoring
   */
  stop() {
    this.isListening = false;

    if (this.microphone) {
      this.microphone.disconnect();
    }

    if (this.audioContext) {
      this.audioContext.close();
    }
  }

  /**
   * Get audio statistics
   */
  getStats() {
    return {
      isListening: this.isListening,
      ...this.audioLevels,
    };
  }
}

export const audioSense = new AudioSense();
