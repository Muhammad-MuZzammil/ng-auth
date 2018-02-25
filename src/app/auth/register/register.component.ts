import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';



function comparePassword(c: AbstractControl): { [key: string]: boolean } | null {
  let passwordControl = c.get('password');
  let confirmControl = c.get('confirmPassword');

  if (passwordControl.pristine || confirmControl.pristine) {
    return null;
  }

  if (passwordControl.value === confirmControl.value) {
    return null;
  }
  return { 'mismatchedPassword': true };
}



@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})


export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  constructor(private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
  ) {
  }

  fullname = new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]);
  email = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]);
  confirmPassword = new FormControl('', [Validators.required]);


  ngOnInit(): void {
    this.registerForm = this.fb.group({
      fullname: this.fullname,
      email: this.email,
      passwordGroup: this.fb.group({
        password: this.password,
        confirmPassword: this.confirmPassword,
      }, { validator: comparePassword })
    });
  }

  register(formdata: any): void {
    if (this.registerForm.dirty && this.registerForm.valid) {
      let theForm = this.registerForm.value;
      const thePass = this.registerForm.value.passwordGroup.password;
      const theConfirmPass = this.registerForm.value.passwordGroup.confirmPassword;
      theForm.password = thePass;
      theForm.confirmPassword = theConfirmPass;
      delete theForm.passwordGroup;

      this.authService.register(theForm)
        .subscribe(data => {
          console.log("data ======>", data)
          if (data.success === false) {
            alert(data.message)
          } else {
            alert(data.message)
            this.router.navigate(['dashboard']);
          }
          this.registerForm.reset();
        });
    }
  }
}
