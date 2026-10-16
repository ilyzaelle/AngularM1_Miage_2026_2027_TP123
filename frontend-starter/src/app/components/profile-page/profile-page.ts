import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  imports: [ReactiveFormsModule],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css',
})
export class ProfilePageComponent implements OnInit {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly error = signal('');
  readonly success = signal('');

  readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.error.set('');
    this.success.set('');

    this.auth.profile().subscribe({
      next: (user) => {
        console.debug('[ProfilePage] Profil chargé', user.id);
        this.form.setValue({ name: user.name });
      },
      error: (error) => {
        console.error('[ProfilePage] Chargement impossible', error);
        this.error.set('Impossible de charger votre profil. Veuillez vous reconnecter.');
        this.auth.clearSession();
        void this.router.navigateByUrl('/login');
      },
    });
  }

  save(): void {
    const name = this.form.getRawValue().name.trim();
    if (!name) {
      this.form.controls.name.markAsTouched();
      this.error.set('Le nom ne peut pas être vide.');
      return;
    }

    this.error.set('');
    this.success.set('');

    this.auth.update(name).subscribe({
      next: (user) => {
        console.debug('[ProfilePage] Profil enregistré', user.id);
        this.form.setValue({ name: user.name });
        this.success.set('Votre profil a bien été mis à jour.');
      },
      error: (error) => {
        console.error('[ProfilePage] Enregistrement impossible', error);
        this.error.set('Impossible de mettre à jour votre profil.');
      },
    });
  }
}
