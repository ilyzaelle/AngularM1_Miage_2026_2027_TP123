import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpEventType } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { of } from 'rxjs';

import { TrackService } from '../../shared/services/track.service';
import { PlayerService } from '../../shared/services/player.service';
import { TracksPageComponent } from './tracks-page';

describe('TracksPageComponent', () => {
  let fixture: ComponentFixture<TracksPageComponent>;
  let component: TracksPageComponent;
  let trackService: {
    list: ReturnType<typeof vi.fn>;
    upload: ReturnType<typeof vi.fn>;
    audio: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    trackService = {
      list: vi.fn().mockReturnValue(
        of({ items: [], page: 1, limit: 5, total: 0, pages: 1 }),
      ),
      upload: vi.fn().mockReturnValue(of({ id: 't-1', title: 'Song', originalName: 'song.mp3', mimeType: 'audio/mpeg', size: 123, createdAt: '2024-01-01T00:00:00.000Z' })),
      audio: vi.fn(),
      update: vi.fn().mockReturnValue(of(undefined)),
      delete: vi.fn().mockReturnValue(of(undefined)),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TracksPageComponent],
      providers: [{ provide: TrackService, useValue: trackService }],
    }).compileComponents();

    fixture = TestBed.createComponent(TracksPageComponent);
    component = fixture.componentInstance;
  });

  it('should load paginated tracks from the service', () => {
    const items = [
      { id: '1', title: 'Song 1', originalName: 'song1.mp3', mimeType: 'audio/mpeg', size: 123, createdAt: '2024-01-01T00:00:00.000Z' },
    ];
    trackService.list.mockReturnValue(
      of({ items, page: 1, limit: 5, total: 1, pages: 1 }),
    );

    trackService.list.mockClear();
    component.load();

    expect(trackService.list).toHaveBeenCalledWith(1);
    expect(component.tracks()).toEqual(items);
  });

  it('should keep the playing track title in sync when the list refreshes', () => {
    const player = TestBed.inject(PlayerService);
    const currentTrack = {
      id: '1',
      title: 'Ancien titre',
      originalName: 'old.mp3',
      mimeType: 'audio/mpeg',
      size: 123,
      createdAt: '2024-01-01T00:00:00.000Z',
    };

    player.currentTrack.set(currentTrack);
    player.setPlaylist([
      {
        ...currentTrack,
        title: 'Nouveau titre',
      },
    ]);

    expect(player.currentTrack()?.title).toBe('Nouveau titre');
  });

  it('should restart the current track at 00:00 when more than 1% has been played', () => {
    const player = TestBed.inject(PlayerService);
    const trackA = {
      id: '1',
      title: 'Track A',
      originalName: 'track-a.mp3',
      mimeType: 'audio/mpeg',
      size: 123,
      createdAt: '2024-01-01T00:00:00.000Z',
    };
    const trackB = {
      id: '2',
      title: 'Track B',
      originalName: 'track-b.mp3',
      mimeType: 'audio/mpeg',
      size: 123,
      createdAt: '2024-01-01T00:00:00.000Z',
    };

    player.setPlaylist([trackA, trackB]);
    player.currentTrack.set(trackB);
    player.duration.set(200);

    const audio = document.createElement('audio');
    audio.setAttribute('data-player', 'app');
    Object.defineProperty(audio, 'duration', { value: 200, configurable: true });
    audio.currentTime = 4;
    document.body.appendChild(audio);

    player.previousTrack();

    expect(player.currentTrack()?.id).toBe('2');
    expect(audio.currentTime).toBe(0);
    expect(player.currentTime()).toBe(0);

    audio.remove();
  });

  it('should upload a file through the service and reset the form', () => {
    const file = new File(['audio'], 'demo.mp3', { type: 'audio/mpeg' });
    component.file = file;
    component.title.setValue('Demo');
    trackService.upload.mockReturnValue(
      of({
        type: HttpEventType.Response,
        body: {
          id: 't-1',
          title: 'Demo',
          originalName: 'demo.mp3',
          mimeType: 'audio/mpeg',
          size: 123,
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      }),
    );

    component.upload();

    expect(trackService.upload).toHaveBeenCalledWith(file, 'Demo');
    expect(component.file).toBeUndefined();
    expect(component.title.value).toBe('');
  });

  it('should expose upload progress and uploading state', () => {
    const file = new File(['audio'], 'demo.mp3', { type: 'audio/mpeg' });
    component.file = file;
    component.title.setValue('Demo');
    trackService.upload.mockReturnValue(
      of({
        type: HttpEventType.UploadProgress,
        loaded: 50,
        total: 100,
      }),
    );

    component.upload();

    expect(component.uploading()).toBe(true);
    expect(component.uploadProgress()).toBe(50);
  });

  it('should compute the range fill percentage from the real value', () => {
    expect(component.sliderPercent(30, 100)).toBe(30);
    expect(component.sliderPercent(0.6, 1)).toBe(60);
    expect(component.sliderPercent(999, 0)).toBe(0);
  });

  it('should confirm before deleting a track', () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

    component.deleteTrack('track-1');

    expect(confirmSpy).toHaveBeenCalledTimes(1);
    expect(trackService.delete).toHaveBeenCalledWith('track-1');
  });

  it('should delete a track and reload the library', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    component.deleteTrack('track-1');

    expect(trackService.delete).toHaveBeenCalledWith('track-1');
    expect(trackService.list).toHaveBeenCalled();
  });
});
