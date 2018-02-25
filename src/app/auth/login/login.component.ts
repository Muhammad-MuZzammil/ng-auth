import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) { }
  email = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(10)]);
  ngOnInit() {
    this.loginForm = this.fb.group({
      email: this.email,
      password: this.password
    })
  }

  login(formdata: any): void {
    if (this.loginForm.valid && this.loginForm.dirty) {
      this.authService.login(this.loginForm.value)
        .subscribe(data => {
          if (data.json().success === false) {
            alert(data.json().message)
          }
          else {
            alert('Login Successful');
            this.router.navigate(['dashboard']);
          }
        })
    }
  }
}
