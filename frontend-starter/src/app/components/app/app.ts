import {
  AfterViewChecked,
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { PlayerService } from '../../shared/services/player.service';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class AppComponent implements OnInit, AfterViewChecked {
  readonly auth = inject(AuthService);
  readonly player = inject(PlayerService);
  private readonly router = inject(Router);

  @ViewChild('metaTitle') private metaTitleEl?: ElementRef<HTMLSpanElement>;
  @ViewChild('metaSubtitle') private metaSubtitleEl?: ElementRef<HTMLSpanElement>;
  @ViewChild('fullscreenTitle') private fullscreenTitleEl?: ElementRef<HTMLSpanElement>;
  @ViewChild('fullscreenSubtitle') private fullscreenSubtitleEl?: ElementRef<HTMLSpanElement>;

  readonly profileLabel = computed(() => this.auth.currentUser()?.name ?? 'Profil');
  readonly playerVisible = computed(() => !!this.player.currentTrack());
  readonly titleOverflow = signal(false);
  readonly subtitleOverflow = signal(false);
  readonly fullscreenTitleOverflow = signal(false);
  readonly fullscreenSubtitleOverflow = signal(false);

  ngOnInit(): void {
    if (this.auth.token() && !this.auth.currentUser()) {
      this.auth.profile().subscribe();
    }
  }

  ngAfterViewChecked(): void {
    this.updateOverflowState();
  }

  private updateOverflowState(): void {
    this.titleOverflow.set(this.isOverflowing(this.metaTitleEl?.nativeElement));
    this.subtitleOverflow.set(this.isOverflowing(this.metaSubtitleEl?.nativeElement));
    this.fullscreenTitleOverflow.set(this.isOverflowing(this.fullscreenTitleEl?.nativeElement));
    this.fullscreenSubtitleOverflow.set(this.isOverflowing(this.fullscreenSubtitleEl?.nativeElement));
  }

  private isOverflowing(element?: HTMLElement): boolean {
    if (!element) {
      return false;
    }

    const overflow = element.scrollWidth - element.clientWidth;
    return overflow > 2;
  }

  logout(): void {
    this.auth.clearSession();
    this.player.resetPlayback();
    void this.router.navigateByUrl('/login');
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

  onSeek(value: number): void {
    this.player.seek(value);
  }

  onVolumeChange(value: number): void {
    this.player.setVolume(value);
  }

  onTimeUpdate(): void {
    this.player.updateTime();
  }

  onLoadedMetadata(): void {
    this.player.updateMetadata();
  }

  onEnded(): void {
    this.player.onEnded();
  }

  sliderPercent(value: number, max: number): number {
    return this.player.sliderPercent(value, max);
  }

  formatTime(value: number): string {
    return this.player.formatTime(value);
  }
}
