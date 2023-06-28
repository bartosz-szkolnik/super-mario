export class AudioBoard {
  private readonly buffers = new Map<string, AudioBuffer>();

  addAudio(name: string, buffer: AudioBuffer) {
    this.buffers.set(name, buffer);
  }

  play(name: string, context: AudioContext) {
    const audio = this.buffers.get(name);
    if (!audio) {
      throw new Error(`No audio found for the name ${name}.`);
    }

    const gainNode = context.createGain();
    gainNode.gain.value = 0.8;
    gainNode.connect(context.destination);

    const source = context.createBufferSource();
    source.connect(gainNode);
    source.buffer = audio;
    source.start(0);
  }
}
