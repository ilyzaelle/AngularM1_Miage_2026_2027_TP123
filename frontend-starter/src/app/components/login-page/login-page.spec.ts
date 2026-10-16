import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { of } from 'rxjs';

import { AuthService } from '../../shared/services/auth.service';
import { LoginPageComponent } from './login-page';

describe('LoginPageComponent', () => {
  let fixture: ComponentFixture<LoginPageComponent>;
  let component: LoginPageComponent;
  let authService: { login: ReturnType<typeof vi.fn> };
  let router: Router;

  beforeEach(async () => {
    authService = {
      login: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [LoginPageComponent, RouterModule.forRoot([])],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should block submission when form is invalid', () => {
    component.form.patchValue({ email: '', password: '' });

    component.submit();

    expect(authService.login).not.toHaveBeenCalled();
    expect(component.error()).toBe('Merci de corriger les champs indiqués.');
  });

  it('should call login and navigate to /tracks when form is valid', () => {
    authService.login.mockReturnValue(of({ token: 'jwt-token', user: { id: '1', name: 'Test', email: 'test@example.com' } }));

    component.form.patchValue({
      email: 'test@example.com',
      password: 'Demo1234!',
    });

    component.submit();

    expect(authService.login).toHaveBeenCalledWith('test@example.com', 'Demo1234!');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/tracks');
  });
});
