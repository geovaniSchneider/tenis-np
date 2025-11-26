import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { RankingService } from '../../services/ranking.service';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface PlayerStats {
  nome: string;
  totalJogos: number;
  totalVitorias: number;
  percVitorias: number;
  totalDerrotas: number;
  percDerrotas: number;
}

@Component({
  standalone: true,
  selector: 'app-player-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    RouterLink,
    MatSortModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss']
})
export class PlayerListComponent implements OnInit {
  displayedColumns: string[] = [
    'rank',
    'nome',
    'totalJogos',
    'totalVitorias',
    'percVitorias',
    'totalDerrotas',
    'percDerrotas'
  ];
  dataSource = new MatTableDataSource<PlayerStats>([]);
  loading$;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private ranking: RankingService, private router: Router) {
    this.loading$ = this.ranking.loading$;
  }

  ngOnInit() {
    this.ranking.getJogosObservable().subscribe(todosJogos => {
      const nomes: Set<string> = new Set();

      todosJogos.forEach(j => {
        if (j.jogador1) nomes.add(j.jogador1);
        if (j.jogador2) nomes.add(j.jogador2);
      });

      const playersStats: PlayerStats[] = Array.from(nomes).map(nome => {
        const jogos = todosJogos.filter(
          j => j.jogador1 === nome || j.jogador2 === nome
        );
        const totalJogos = jogos.length;
        const totalVitorias = jogos.filter(
          j =>
            (j.jogador1 === nome && j.vitoria_j1) ||
            (j.jogador2 === nome && j.vitoria_j2)
        ).length;
        const totalDerrotas = totalJogos - totalVitorias;

        return {
          nome,
          totalJogos,
          totalVitorias,
          percVitorias: totalJogos ? (totalVitorias / totalJogos) * 100 : 0,
          totalDerrotas,
          percDerrotas: totalJogos ? (totalDerrotas / totalJogos) * 100 : 0
        };
      });

      // ordenação inicial por nome
      playersStats.sort((a, b) => a.nome.localeCompare(b.nome));
      this.dataSource.data = playersStats;
      this.dataSource.sort = this.sort;
    });
  }

  goHistory(nome: string) {
    this.router.navigate(['/jogador', nome]);
  }

  goHome() {
    this.router.navigate(['/home']);
  }

}
