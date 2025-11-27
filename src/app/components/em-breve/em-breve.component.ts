import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-em-breve',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterLink],
  templateUrl: './em-breve.component.html',
  styleUrls: ['./em-breve.component.scss']
})
export class EmBreveComponent {}
