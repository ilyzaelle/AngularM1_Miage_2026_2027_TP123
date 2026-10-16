import { inject, Injectable, signal } from '@angular/core';

import { Track } from '../models/track.model';
import { TrackService } from './track.service';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  private readonly trackService = inject(TrackService);

  readonly tracks = signal<Track[]>([]);
  readonly currentTrack = signal<Track | null>(null);
  readonly audioUrl = signal('');
  readonly isPlaying = signal(false);
  readonly isShuffle = signal(false);
  readonly isLoop = signal(false);
  readonly isFullscreen = signal(false);
  readonly currentTime = signal(0);
  readonly duration = signal(0);
  readonly volume = signal(0.8);
  readonly isTransitioning = signal(false);

  setPlaylist(tracks: Track[]): void {
    this.tracks.set(tracks);

    const current = this.currentTrack();
    if (!current) return;

    const refreshedTrack = tracks.find((track) => track.id === current.id);
    if (refreshedTrack) {
      this.currentTrack.set(refreshedTrack);
    }
  }

  setVolume(value: number): void {
    this.volume.set(value);
    const audio = this.getAudioElement();
    if (audio) {
      audio.volume = value;
    }
  }

  play(track: Track): void {
    const currentTrack = this.currentTrack();
    const sameTrack = currentTrack?.id === track.id && !!this.audioUrl();

    if (sameTrack) {
      this.togglePlayback();
      return;
    }

    this.isTransitioning.set(true);
    this.currentTrack.set(track);
    this.currentTime.set(0);
    this.duration.set(0);

    this.trackService.audio(track.id).subscribe({
      next: (blob) => {
        const previousUrl = this.audioUrl();
        if (previousUrl) URL.revokeObjectURL(previousUrl);

        const nextUrl = URL.createObjectURL(blob);
        this.audioUrl.set(nextUrl);

        queueMicrotask(() => {
          const audio = this.getAudioElement();
          if (!audio) return;
          audio.volume = this.volume();
          audio.currentTime = 0;
          void audio.play();
          this.isTransitioning.set(false);
        });
      },
      error: (error) => {
        console.error('[PlayerService] Lecture impossible', error);
        this.isTransitioning.set(false);
      },
    });
  }

  togglePlayback(): void {
    const audio = this.getAudioElement();
    if (!audio || !this.currentTrack()) return;

    if (audio.paused) {
      void audio.play();
      return;
    }

    audio.pause();
  }

  previousTrack(): void {
    const current = this.currentTrack();
    if (!current) return;

    const audio = this.getAudioElement();
    const elapsed = Number.isFinite(audio?.currentTime ?? this.currentTime()) ? (audio?.currentTime ?? this.currentTime()) : 0;
    const total = Number.isFinite(audio?.duration ?? this.duration()) ? (audio?.duration ?? this.duration()) : 0;

    if (total > 0 && elapsed > total * 0.01) {
      if (audio) {
        audio.currentTime = 0;
      }
      this.currentTime.set(0);
      return;
    }

    const index = this.tracks().findIndex((track) => track.id === current.id);
    if (index <= 0) return;

    this.play(this.tracks()[index - 1]);
  }

  nextTrack(): void {
    const current = this.currentTrack();
    if (!current) return;

    const index = this.tracks().findIndex((track) => track.id === current.id);
    const total = this.tracks().length;

    if (total === 0) return;

    let nextIndex = index + 1;
    if (this.isShuffle()) {
      let randomIndex = Math.floor(Math.random() * total);
      while (randomIndex === index && total > 1) {
        randomIndex = Math.floor(Math.random() * total);
      }
      nextIndex = randomIndex;
    } else if (nextIndex >= total) {
      nextIndex = 0;
    }

    const nextTrack = this.tracks()[nextIndex];
    if (nextTrack) {
      this.play(nextTrack);
    }
  }

  toggleShuffle(): void {
    this.isShuffle.set(!this.isShuffle());
  }

  toggleLoop(): void {
    this.isLoop.set(!this.isLoop());
  }

  toggleFullscreen(): void {
    this.isFullscreen.set(!this.isFullscreen());
  }

  closeFullscreen(): void {
    this.isFullscreen.set(false);
  }

  updateTime(): void {
    const audio = this.getAudioElement();
    if (!audio) return;
    this.currentTime.set(audio.currentTime);
  }

  updateMetadata(): void {
    const audio = this.getAudioElement();
    if (!audio) return;
    this.duration.set(audio.duration || 0);
  }

  seek(value: number): void {
    const audio = this.getAudioElement();
    if (!audio) return;
    audio.currentTime = value;
    this.currentTime.set(value);
  }

  onEnded(): void {
    if (this.isLoop()) {
      const audio = this.getAudioElement();
      if (audio) {
        audio.currentTime = 0;
        void audio.play();
      }
      return;
    }

    this.nextTrack();
  }

  sliderPercent(value: number, max: number): number {
    if (!Number.isFinite(value) || !Number.isFinite(max) || max <= 0) {
      return 0;
    }

    return Math.min(100, Math.max(0, (value / max) * 100));
  }

  formatTime(value: number): string {
    if (!Number.isFinite(value) || value <= 0) return '0:00';
    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60)
      .toString()
      .padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  resetPlayback(): void {
    const previousUrl = this.audioUrl();
    if (previousUrl) URL.revokeObjectURL(previousUrl);
    this.audioUrl.set('');
    this.currentTrack.set(null);
    this.isPlaying.set(false);
    this.currentTime.set(0);
    this.duration.set(0);
    this.isTransitioning.set(false);
  }

  private getAudioElement(): HTMLAudioElement | null {
    return document.querySelector('audio[data-player="app"]') as HTMLAudioElement | null;
  }
}
