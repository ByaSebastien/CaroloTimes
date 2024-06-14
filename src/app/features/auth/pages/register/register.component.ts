import { Component } from '@angular/core';
import { DestroyedComponent } from '../../../../components/destroyed.component';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { registerForm } from '../../forms/register.form';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent extends DestroyedComponent {

  registerFormGroup: FormGroup; 

  constructor(
    private readonly _authService: AuthService,
    private readonly _fb: FormBuilder,
    private readonly _router: Router
  ){
    super()
    this.registerFormGroup = this._fb.group({...registerForm});
  }

  onSubmit(){
    this.registerFormGroup.markAllAsTouched();
    if(!this.registerFormGroup.valid){
      return;
    }
    this._authService.register(this.registerFormGroup.value).pipe(
      takeUntil(this.destroyed$)
    ).subscribe({
      next: (datas) => {
        console.log('Registered');
        console.log(datas);
        this._router.navigate(['/login'])
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
