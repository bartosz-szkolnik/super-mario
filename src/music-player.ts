export class MusicPlayer {
  private readonly tracks = new Map<string, HTMLAudioElement>();

  addTrack(name: string, url: string) {
    const audio = new Audio();
    audio.loop = true;
    audio.volume = 0.3;
    audio.src = url;

    this.tracks.set(name, audio);
  }

  playTrack(name: string) {
    const audio = this.tracks.get(name);
    if (!audio) {
      console.warn(`No music file named ${name} found.`);
      return;
    }

    audio.play();
  }
}
