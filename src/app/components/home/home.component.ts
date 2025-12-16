import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
  ],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  apoiadores = [
    {
      nome: 'Apoiador 1 - Google',
      link: 'https://www.google.com',
      imgDesktop: '/assets/ap1_desktop.png',
      imgMobile: '/assets/ap1_mobile.png'
    },
    {
      nome: 'Apoiador 2 - Bing',
      link: 'https://www.bing.com',
      imgDesktop: '/assets/ap2_desktop.png',
      imgMobile: '/assets/ap2_mobile.png'
    }
  ];

  cicloAtual = '2025.3';

  grupos = [
    { id: 1, nome: 'Classe 1', linkTabela: 'https://docs.google.com/spreadsheets/d/16b_qrElHNtM6zmaXuypyvh_s7ALStE56NDmLPV8JSNY/edit?usp=sharing', linkFormulario: 'https://forms.gle/T6XApYiUCTeyuS6T8' },
    { id: 2, nome: 'Classe 2', linkTabela: 'https://docs.google.com/spreadsheets/d/1HFE6-eEeO0AuztuJUeeU3tpuaod22XT2htfohr0vduc/edit?usp=sharing', linkFormulario: 'https://forms.gle/R5fcizpCAZ3auaQ57' },
    { id: 3, nome: 'Classe 3', linkTabela: 'https://docs.google.com/spreadsheets/d/1Qfn0NBKNYMMGEnrJtOSbg-UTX5lkcOYu_1YOa8sjUTs/edit?usp=sharing', linkFormulario: 'https://forms.gle/mMcpeXrYUKPV1G2d6' },
    { id: 4, nome: 'Classe 4', linkTabela: 'https://docs.google.com/spreadsheets/d/1R1YsraZDGyirQk3271UkMI1R1YNjmkaCno7LXuUuoTI/edit?usp=sharing', linkFormulario: 'https://forms.gle/F1BEdxQsY8gsmrQj7' },
    { id: 5, nome: 'Classe 5', linkTabela: 'https://docs.google.com/spreadsheets/d/1f5ykhp0odW9XXZ4oYFYnhocEpaF-G6gvRx-2Cb0XWU4/edit?usp=sharing', linkFormulario: 'https://forms.gle/M6FB2N14fqeHTz817' }
  ];

  // Índice inicial aleatório para o carrossel
  indiceInicialCarrossel = 0;

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Gera um índice aleatório entre 0 e o número de apoiadores - 1
    if (this.apoiadores.length > 0) {
      this.indiceInicialCarrossel = Math.floor(Math.random() * this.apoiadores.length);
    }
  }

  abrirPagina(link: string) {
    if (link) {
      window.open(link, '_blank');
    }
  }
}
