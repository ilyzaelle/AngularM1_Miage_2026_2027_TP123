import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { of, throwError } from 'rxjs';

import { AuthService } from '../../shared/services/auth.service';
import { ProfilePageComponent } from './profile-page';

describe('ProfilePageComponent', () => {
  let fixture: ComponentFixture<ProfilePageComponent>;
  let component: ProfilePageComponent;
  let authService: {
    currentUser: any;
    profile: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    clearSession: ReturnType<typeof vi.fn>;
  };
  let router: Router;

  beforeEach(async () => {
    authService = {
      currentUser: { value: null },
      profile: vi.fn(),
      update: vi.fn(),
      clearSession: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ProfilePageComponent, RouterModule.forRoot([])],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePageComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the profile on init', () => {
    authService.profile.mockReturnValue(
      of({ id: '1', name: 'Alice', email: 'alice@example.com', createdAt: '2024-01-01T00:00:00.000Z' }),
    );

    component.ngOnInit();

    expect(authService.profile).toHaveBeenCalled();
    expect(component.form.value.name).toBe('Alice');
  });

  it('should update the name and show a success message', () => {
    authService.update.mockReturnValue(
      of({ id: '1', name: 'Alicia', email: 'alice@example.com', createdAt: '2024-01-01T00:00:00.000Z' }),
    );

    component.form.patchValue({ name: 'Alicia' });
    component.save();

    expect(authService.update).toHaveBeenCalledWith('Alicia');
    expect(component.success()).toBe('Votre profil a bien été mis à jour.');
  });

  it('should clear session and redirect on profile load error', () => {
    authService.profile.mockReturnValue(throwError(() => new Error('boom')));

    component.load();

    expect(authService.clearSession).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  });
});
