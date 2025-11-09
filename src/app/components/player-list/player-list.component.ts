import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { RankingService } from '../../services/ranking.service';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule, MatSort } from '@angular/material/sort';

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
    MatSortModule
  ],
  template: `
    <div class="container mt-3">
      
      <!-- Botão voltar -->
      <button mat-button color="primary" class="mb-3" (click)="goHome()">
        &larr; Voltar para Home
      </button>
      
      <h2>Jogadores</h2>

      <table mat-table [dataSource]="dataSource" matSort class="table table-striped">

      <ng-container matColumnDef="rank">
         <th mat-header-cell *matHeaderCellDef>#</th>
         <td mat-cell *matCellDef="let jogador; let i = index">
            {{ i + 1 }}
         </td>
      </ng-container>

        <!-- Nome do jogador -->
        <ng-container matColumnDef="nome">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Jogador </th>
          <td mat-cell *matCellDef="let jogador">
            <button mat-button color="primary" (click)="goHistory(jogador.nome)">
              {{ jogador.nome }}
            </button>
          </td>
        </ng-container>

        <!-- Total de jogos -->
        <ng-container matColumnDef="totalJogos">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Total Jogos </th>
          <td mat-cell *matCellDef="let jogador">{{ jogador.totalJogos }}</td>
        </ng-container>

        <!-- Total de vitórias -->
        <ng-container matColumnDef="totalVitorias">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Vitórias </th>
          <td mat-cell *matCellDef="let jogador">{{ jogador.totalVitorias }}</td>
        </ng-container>

        <!-- Percentual de vitórias -->
        <ng-container matColumnDef="percVitorias">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> % Vitórias </th>
          <td mat-cell *matCellDef="let jogador">
            {{ jogador.percVitorias | number:'1.0-1' }}%
          </td>
        </ng-container>

        <!-- Total de derrotas -->
        <ng-container matColumnDef="totalDerrotas">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Derrotas </th>
          <td mat-cell *matCellDef="let jogador">{{ jogador.totalDerrotas }}</td>
        </ng-container>

        <!-- Percentual de derrotas -->
        <ng-container matColumnDef="percDerrotas">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> % Derrotas </th>
          <td mat-cell *matCellDef="let jogador">
            {{ jogador.percDerrotas | number:'1.0-1' }}%
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>
    </div>
  `
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

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private ranking: RankingService, private router: Router) {}

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
