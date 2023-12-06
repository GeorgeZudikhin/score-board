import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface Highscore {
  username: string;
  score: number;
}

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  authenticated: boolean = false;

  username: string = '';
  score: string = '';
  highscores: Highscore[] = [];
  message: string = '';

  successMessage: string = '';
  errorMessage: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  submitHighscores() {
    if (this.username && this.score !== null) {
      const highscoreData = {
        username: this.username,
        score: this.score
      };

      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({ Authorization: token || '', 'Content-Type': 'application/json' });

      this.http.post('http://localhost:3000/highscores', highscoreData, { headers }).subscribe(
        () => {
          console.log('Highscores submitted successfully');
          //this.message = 'Highscores submitted successfully!';
          this.username = '';
          this.score = '';

          this.successMessage = 'Highscores submitted successfully';
          this.errorMessage = '';
        },
        (error) => {
          console.log('Failed to submit highscores', error);
          this.message = 'Failed to submit highscores.';
        }
      );
    } else {
      //this.message = 'Please enter a username and highscore.';

      this.errorMessage = 'Please enter a username and highscore.';
      this.successMessage = '';
    }
  }

  retrieveHighscores() {
    // Get the authentication token from local storage
    const token = localStorage.getItem('token');

    // Prepare the request headers
    const headers = new HttpHeaders({ Authorization: token || ''});

    // Send the GET request to retrieve highscores
    this.http.get<{ highscores: Highscore[] }>('http://localhost:3000/highscores', { headers }).subscribe(
      (response) => {
        console.log('Highscores retrieved successfully', response.highscores);
        this.highscores = response.highscores;
      },
      (error) => {
        console.log('Failed to retrieve highscores', error);
      }
    );
  }

  logout() {
    // Get the authentication token from local storage
    const token = localStorage.getItem('token');

    // Prepare the request headers
    const headers = new HttpHeaders({ Authorization: token || ''});

    // Send the DELETE request to logout
    this.http.delete('http://localhost:3000/sessions', { headers }).subscribe(
      () => {
        console.log('Logout successful');
        // Clear the highscores
        this.highscores = [];
        // Send the user back to the login page
        this.router.navigate(['/login']);
      },
      (error) => {
        console.log('Failed to logout', error);
      }
    );
  }

  ngOnInit() {
    const token = localStorage.getItem('token');
    this.authenticated = !!token;

    if (!this.authenticated) {
      this.router.navigate(['/login']);
    } else {
      // Check access to the main page
      this.http
        .get('http://localhost:3000', {
          headers: new HttpHeaders({ Authorization: token as string }), // Type assertion here
        })
        .subscribe(
          () => {
            // Access granted
            console.log('Access granted to the main page');
          },
          (error) => {
            // Access denied, redirect to login page
            console.log(error.error.error);
            this.authenticated = false;
            this.router.navigate(['/login']);
          }
        );
    }
  }
}
