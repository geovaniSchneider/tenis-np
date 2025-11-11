import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbarModule],
  template: `
    <!-- <mat-toolbar color="primary">Ranking de Tênis</mat-toolbar> -->
     <mat-toolbar style="background-color: blanchedalmond;">Ranking de Tênis</mat-toolbar>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {}
