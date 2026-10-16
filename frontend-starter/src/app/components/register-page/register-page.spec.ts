import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { of } from 'rxjs';

import { AuthService } from '../../shared/services/auth.service';
import { RegisterPageComponent } from './register-page';

describe('RegisterPageComponent', () => {
  let fixture: ComponentFixture<RegisterPageComponent>;
  let component: RegisterPageComponent;
  let authService: { register: ReturnType<typeof vi.fn> };
  let router: Router;

  beforeEach(async () => {
    authService = {
      register: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [RegisterPageComponent, RouterModule.forRoot([])],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPageComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should block submission when form is invalid', () => {
    component.form.patchValue({ name: '', email: '', password: '' });

    component.submit();

    expect(authService.register).not.toHaveBeenCalled();
    expect(component.error()).toBe('Merci de corriger les champs indiqués.');
  });

  it('should trim values before registration and navigate to /profile when valid', () => {
    authService.register.mockReturnValue(of({ token: 'jwt-token', user: { id: '1', name: 'Alice', email: 'alice@example.com' } }));

    component.form.patchValue({
      name: '  Alice  ',
      email: '  alice@example.com  ',
      password: 'Demo1234!',
    });

    component.submit();

    expect(authService.register).toHaveBeenCalledWith('Alice', 'alice@example.com', 'Demo1234!');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/profile');
  });
});
