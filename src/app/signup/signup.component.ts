import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  company: string = '';
  street: string = '';
  city: string = '';
  postalCode: string = '';


  hide_password = true;
  hide_confirm_password = true;

  signupSuccessful: boolean = false;
  signupAttempted: boolean = false;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  onSubmit(form: NgForm) {
    console.log(form.value);
    this.http.post<any>('http://localhost:3000/users', form.value, this.httpOptions).subscribe(
      (response) => {
        // Sign-up successful
        console.log(response.message);
        this.signupSuccessful = true;
        this.signupAttempted = true;
      },
      (error) => {
        // Sign-up failed
        console.log(error.error.error);
        this.signupSuccessful = false;
        this.signupAttempted = true;
      }
    );
  }
  
}
