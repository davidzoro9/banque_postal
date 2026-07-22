import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  hidePassword = true;
  error = '';

  features = [
    { icon: 'people', title: 'Gestion des collaborateurs', desc: 'Fiches employés, contrats, organigramme' },
    { icon: 'payments', title: 'Paie automatisée', desc: 'Bulletins, déclarations DSN, URSSAF' },
    { icon: 'trending_up', title: 'Carrières & Compétences', desc: 'Formations, évaluations, mobilité' },
    { icon: 'storage', title: 'Données centralisées', desc: 'Structure, paramètres, calendriers' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['davidzorom9@gmail.com', [Validators.required]],
      password: ['5621', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.error = '';

    const { email, password } = this.loginForm.value;
    this.authService.login(email, password).subscribe({
      next: (user) => {
        this.loading = false;
        if (user.role === 'EMPLOYE') {
          this.router.navigate(['/mon-espace']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: () => {
        this.loading = false;
        this.error = 'Email ou mot de passe incorrect.';
      }
    });
  }
}
