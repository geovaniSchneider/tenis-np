import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Services
import { RankingService } from '../../services/ranking.service';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  apoiadores = [
    {
      nome: 'Rádio Imperial',
      link: 'http://www.imperial.fm.br?utm_source=tenisnp&utm_medium=banner&utm_campaign=2026_1',
      imgDesktop: '/assets/radio_imperial_desktop.png',
      imgMobile: '/assets/radio_imperial_mobile.png'
    },
    {
      nome: 'Hotel Petrópolis',
      link: 'https://www.hotelpetropolis.com.br?utm_source=tenisnp&utm_medium=banner&utm_campaign=2026_1',
      imgDesktop: '/assets/hotel_petropolis_desktop.jpg',
      imgMobile: '/assets/hotel_petropolis_mobile.jpg'
    },
    {
      nome: 'Brasa e Alma',
      link: 'https://wa.me/5554996347041?text=Quero%20fazer%20evento%20especial',
      imgDesktop: '/assets/brasa_e_alma_desktop.png',
      imgMobile: '/assets/brasa_e_alma_mobile.png'
    },
    {
      nome: 'Círculo Energia Solar',
      link: 'https://www.instagram.com/circuloenergiasolar/',
      imgDesktop: '/assets/circulo_desktop.jpg',
      imgMobile: '/assets/circulo_mobile.jpg'
    }
  ];

  cicloAtual = '2026.1';

  grupos = [
    {
      id: 1,
      nome: 'Classe 1',
      linkTabela: 'https://docs.google.com/spreadsheets/d/16sVqGlaUWUisO4yDFlHo_2W9r1VeFbLGeuBE4lTfxJM/edit?usp=sharing',
      linkFormulario: 'https://docs.google.com/forms/d/e/1FAIpQLSdzmVWzGTFhMqdm4wFWOPWil5Rwxf3sDaR2QeKv3iOIY_DnPA/viewform?usp=sharing&ouid=118078082500890152692'
    },
    {
      id: 2,
      nome: 'Classe 2',
      linkTabela: 'https://docs.google.com/spreadsheets/d/14_WhwtRMLVs3zdH0w26ZKzlxn2JkikhOVxWmRG0udCk/edit?usp=sharing',
      linkFormulario: 'https://docs.google.com/forms/d/e/1FAIpQLSc-B2TnJu5_tO4X22dJxvjxDjVefplvIh9OMMS7w7VhapQg-g/viewform?usp=sharing&ouid=118078082500890152692'
    },
    {
      id: 3,
      nome: 'Classe 3',
      linkTabela: 'https://docs.google.com/spreadsheets/d/1Oj8ytIhXBKX1ppDiPv2bF67y_PtaaqpfDfjgVun9eLw/edit?usp=sharing',
      linkFormulario: 'https://docs.google.com/forms/d/e/1FAIpQLScrxuVvJf2lAK86Ak9aLvcRcoGAfTtQIEkioqCPs5SA8blKeg/viewform?usp=sharing&ouid=118078082500890152692'
    },
    {
      id: 4,
      nome: 'Classe 4',
      linkTabela: 'https://docs.google.com/spreadsheets/d/1KphDrlv1_IOfquUJhO1SuE3UXYhFPMMLrBd5KXlsz-E/edit?usp=sharing',
      linkFormulario: 'https://docs.google.com/forms/d/e/1FAIpQLSeB2iN9d-C_l4oEUWiTLs7EO3TPnuje2RU3-3Pgqtrnm8qhWg/viewform?usp=sharing&ouid=118078082500890152692'
    },
    {
      id: 5,
      nome: 'Classe 5',
      linkTabela: 'https://docs.google.com/spreadsheets/d/1XdQqCh3qrlr16DFkivdJtBnbZ9IaqLRoCMLsdFJ8F2w/edit?usp=sharing',
      linkFormulario: 'https://docs.google.com/forms/d/e/1FAIpQLSf4VHFsszcYkfYUNuVnyIyjtVhdS83RVU32wGeETTeLf65Upw/viewform?usp=sharing&ouid=118078082500890152692'
    }
  ];

  // Índice inicial aleatório para o carrossel
  indiceInicialCarrossel = 0;

  // Estatísticas do ranking
  totalJogos = 0;
  jogosCicloAtual = 0;
  loading$;

  constructor(
    private router: Router,
    private rankingService: RankingService
  ) {
    this.loading$ = this.rankingService.loading$;
  }

  ngOnInit(): void {
    // Gera um índice aleatório entre 0 e o número de apoiadores - 1
    if (this.apoiadores.length > 0) {
      this.indiceInicialCarrossel = Math.floor(Math.random() * this.apoiadores.length);
    }

    // Calcula estatísticas do ranking usando Observable
    this.calcularEstatisticasRanking();
  }

  calcularEstatisticasRanking(): void {
    // Subscribe ao Observable para obter os dados quando estiverem disponíveis
    this.rankingService.getJogosObservable().subscribe(todosJogos => {
      // Total de jogos do ranking
      this.totalJogos = todosJogos.length;

      // Jogos do ciclo atual
      const jogosCiclo = todosJogos.filter(j => j.ciclo === this.cicloAtual);
      this.jogosCicloAtual = jogosCiclo.length;
    });
  }

  abrirPagina(link: string) {
    if (link) {
      window.open(link, '_blank');
    }
  }
}
