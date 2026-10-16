import { Component, HostListener, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Track } from '../../shared/models/track.model';
import { PlayerService } from '../../shared/services/player.service';
import { TrackService } from '../../shared/services/track.service';

@Component({
  imports: [ReactiveFormsModule],
  templateUrl: './tracks-page.html',
  styleUrl: './tracks-page.css',
})
export class TracksPageComponent {
  private readonly service = inject(TrackService);
  private readonly player = inject(PlayerService);

  readonly tracks = signal<Track[]>([]);
  readonly page = signal(1);
  readonly pages = signal(1);
  readonly loading = signal(false);
  readonly uploading = signal(false);
  readonly error = signal('');
  readonly success = signal('');
  readonly title = new FormControl('', { nonNullable: true });
  file?: File;

  constructor() {
    this.load();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.player.isFullscreen()) {
      this.player.closeFullscreen();
    }
  }

  choose(event: Event): void {
    this.file = (event.target as HTMLInputElement).files?.[0];
    console.debug('[TracksPage] Fichier sélectionné', this.file?.name);
    this.error.set('');
  }

  load(): void {
    this.loading.set(true);
    this.error.set('');
    this.success.set('');

    this.service.list(this.page()).subscribe({
      next: (response) => {
        console.debug('[TracksPage] Pistes chargées', response.items.length);
        this.tracks.set(response.items);
        this.player.setPlaylist(response.items);
        this.pages.set(response.pages);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('[TracksPage] Chargement impossible', error);
        this.error.set('Impossible de charger la bibliothèque audio.');
        this.loading.set(false);
      },
    });
  }

  go(page: number): void {
    if (page < 1 || page > this.pages()) return;
    this.page.set(page);
    this.load();
  }

  upload(): void {
    if (!this.file) {
      this.error.set('Choisissez d’abord un fichier audio.');
      return;
    }

    if (this.uploading()) return;

    const cleanTitle = (this.title.value || this.file.name).trim();
    this.error.set('');
    this.success.set('');
    this.uploading.set(true);

    this.service.upload(this.file, cleanTitle).subscribe({
      next: (track) => {
        console.debug('[TracksPage] Piste envoyée', track.id);
        this.title.setValue('');
        this.file = undefined;
        this.uploading.set(false);
        this.page.set(1);
        this.load();
        this.success.set('Piste envoyée avec succès.');
      },
      error: (error) => {
        console.error('[TracksPage] Envoi impossible', error);
        this.error.set(error.error?.message ?? 'L’envoi du fichier a échoué. Vérifiez le fichier et réessayez.');
        this.uploading.set(false);
      },
    });
  }

  play(track: Track): void {
    this.player.setPlaylist(this.tracks());
    this.player.play(track);
  }

  togglePlayback(): void {
    this.player.togglePlayback();
  }

  previousTrack(): void {
    this.player.previousTrack();
  }

  nextTrack(): void {
    this.player.nextTrack();
  }

  toggleShuffle(): void {
    this.player.toggleShuffle();
  }

  toggleLoop(): void {
    this.player.toggleLoop();
  }

  toggleFullscreen(): void {
    this.player.toggleFullscreen();
  }

  closeFullscreen(): void {
    this.player.closeFullscreen();
  }

  onTimeUpdate(): void {}

  onLoadedMetadata(): void {}

  onVolumeChange(value: number): void {
    this.player.setVolume(value);
  }

  onSeek(value: number): void {
    this.player.seek(value);
  }

  sliderPercent(value: number, max: number): number {
    return this.player.sliderPercent(value, max);
  }

  formatTime(value: number): string {
    return this.player.formatTime(value);
  }

  onEnded(): void {
    this.player.onEnded();
  }

}
