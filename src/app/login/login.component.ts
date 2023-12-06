import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

interface LoginResponse {
  message: string;
  token: string; // Add the 'token' property to the response type
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  hide_password: boolean = true;

  loginSuccessful: boolean = false;
  loginAttempted: boolean = false;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private router: Router, private http: HttpClient) {}

  onSubmit(form: NgForm) {
    console.log(form.value);
    this.http.post<LoginResponse>('http://localhost:3000/login', form.value, this.httpOptions).subscribe(
      (response) => {
        // Login successful
        console.log(response.message);
        this.loginSuccessful = true;
        this.loginAttempted = true;
        this.router.navigate(['']);

        // Store the authentication token in local storage
        localStorage.setItem('token', response.token);
      },
      (error) => {
        // Login failed
        console.log(error.error.error);
        this.loginSuccessful = false;
        this.loginAttempted = true;
      }
    );
  }
}
