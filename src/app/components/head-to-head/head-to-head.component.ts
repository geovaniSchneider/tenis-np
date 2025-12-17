import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RankingService } from '../../services/ranking.service';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-head-to-head',
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatTableModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './head-to-head.component.html',
  styleUrls: ['./head-to-head.component.scss']
})
export class HeadToHeadComponent implements OnInit {
  todosJogos: any[] = [];
  jogadores: string[] = [];
  jogadoresBDisponiveis: string[] = [];

  jogadorA: string = '';
  jogadorB: string = '';
  confrontos: any[] = [];
  stats: any = { total: 0, vitoriasA: 0, vitoriasB: 0 };
  loading$;

  displayedColumns: string[] = [
    'data', 'ciclo', 'classe', 'jogador1', 'jogador2', 'set1', 'set2', 'set3', 'pontos'
  ];

  constructor(
    private ranking: RankingService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.loading$ = this.ranking.loading$;
  }

  ngOnInit() {
    this.ranking.getJogosObservable().subscribe(jogos => {
      if (!jogos || jogos.length === 0) return;

      this.todosJogos = jogos;
      this.preencherJogadores(jogos);
    });
  }

  preencherJogadores(jogos: any[]) {
    const nomesSet = new Set<string>();
    jogos.forEach(j => {
      if (j.jogador1) nomesSet.add(j.jogador1);
      if (j.jogador2) nomesSet.add(j.jogador2);
    });
    this.jogadores = Array.from(nomesSet).sort();
    this.jogadoresBDisponiveis = this.jogadores.slice(); // inicia igual
  }

  onJogadorAChange() {
    // Filtrar os jogadores possíveis para B
    if (!this.jogadorA) {
      this.jogadoresBDisponiveis = this.jogadores.slice();
      this.jogadorB = '';
      this.confrontos = [];
      return;
    }

    const nomesSet = new Set<string>();
    this.todosJogos.forEach(j => {
      // se jogadorA participou como jogador1
      if (j.jogador1 === this.jogadorA && j.jogador2) nomesSet.add(j.jogador2);
      // se jogadorA participou como jogador2
      if (j.jogador2 === this.jogadorA && j.jogador1) nomesSet.add(j.jogador1);
    });

    this.jogadoresBDisponiveis = Array.from(nomesSet).sort();

    // se jogadorB não está mais disponível, resetar
    if (!this.jogadoresBDisponiveis.includes(this.jogadorB)) {
      this.jogadorB = '';
      this.confrontos = [];
    }

    this.updateStats();
  }

  updateStats() {
    if (!this.jogadorA || !this.jogadorB || this.jogadorA === this.jogadorB) {
      this.confrontos = [];
      this.stats = { total: 0, vitoriasA: 0, vitoriasB: 0 };
      return;
    }

    this.confrontos = this.ranking.getHeadToHead(this.jogadorA, this.jogadorB).sort((a, b) => {
      const dateA = a.data_jogo ? new Date(a.data_jogo).getTime() : null;
      const dateB = b.data_jogo ? new Date(b.data_jogo).getTime() : null;

      if (dateA === null && dateB !== null) return -1;
      if (dateB === null && dateA !== null) return 1;
      if (dateA === null && dateB === null) return 0;

      return dateA! - dateB!;
    });

    this.stats = this.ranking.getHeadToHeadStats(this.jogadorA, this.jogadorB);
  }

  goHome() {
    this.router.navigate(['/home']);
  }
}
