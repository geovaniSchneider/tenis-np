import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RankingService } from '../../services/ranking.service';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-head-to-head',
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatTableModule,
    MatCardModule,
    MatFormFieldModule
  ],
  template: `
    <div class="container mt-3">

    <!-- Botão voltar -->
      <button mat-button color="primary" class="mb-3" (click)="goBack()">
        &larr; Voltar para Lista de Jogadores
      </button>

      <h2>Head-to-Head</h2>

      <div class="row mb-3">
        <div class="col-md-5">
          <mat-form-field appearance="fill" class="w-100">
            <mat-label>Jogador A</mat-label>
            <mat-select [(value)]="jogadorA" (selectionChange)="updateStats()">
              <mat-option *ngFor="let j of jogadores" [value]="j">{{ j }}</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="col-md-5">
          <mat-form-field appearance="fill" class="w-100">
            <mat-label>Jogador B</mat-label>
            <mat-select [(value)]="jogadorB" (selectionChange)="updateStats()">
              <mat-option *ngFor="let j of jogadores" [value]="j">{{ j }}</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
      </div>

      <div class="row mb-3" *ngIf="confrontos.length > 0">
        <div class="col-md-4">
          <mat-card class="text-center p-3">
            <h5>Total de confrontos</h5>
            <h3>{{ stats.total }}</h3>
          </mat-card>
        </div>
        <div class="col-md-4">
          <mat-card class="text-center p-3">
            <h5>Vitórias de {{ jogadorA }}</h5>
            <h3>{{ stats.vitoriasA }}</h3>
            <small>{{ (stats.vitoriasA / stats.total * 100) | number:'1.0-0' }}%</small>
          </mat-card>
        </div>
        <div class="col-md-4">
          <mat-card class="text-center p-3">
            <h5>Vitórias de {{ jogadorB }}</h5>
            <h3>{{ stats.vitoriasB }}</h3>
            <small>{{ (stats.vitoriasB / stats.total * 100) | number:'1.0-0' }}%</small>
          </mat-card>
        </div>
      </div>

      <table mat-table [dataSource]="confrontos" class="table table-striped table-bordered" *ngIf="confrontos.length > 0">

        <ng-container matColumnDef="data">
          <th mat-header-cell *matHeaderCellDef> Data </th>
          <td mat-cell *matCellDef="let jogo"> {{ jogo.data_jogo ? (jogo.data_jogo | date:'dd/MM/yyyy') : '-' }} </td>
        </ng-container>

        <ng-container matColumnDef="classe">
          <th mat-header-cell *matHeaderCellDef> Classe </th>
          <td mat-cell *matCellDef="let jogo"> {{ jogo.classe }} </td>
        </ng-container>

        <ng-container matColumnDef="jogador1">
          <th mat-header-cell *matHeaderCellDef> Jogador 1 </th>
          <td mat-cell *matCellDef="let jogo">
            <span [ngClass]="{'fw-bold': jogo.vitoria_j1}">{{ jogo.jogador1 }}</span>
          </td>
        </ng-container>

        <ng-container matColumnDef="jogador2">
          <th mat-header-cell *matHeaderCellDef> Jogador 2 </th>
          <td mat-cell *matCellDef="let jogo">
            <span [ngClass]="{'fw-bold': jogo.vitoria_j2}">{{ jogo.jogador2 }}</span>
          </td>
        </ng-container>

        <ng-container matColumnDef="set1">
          <th mat-header-cell *matHeaderCellDef> Set 1 </th>
          <td mat-cell *matCellDef="let jogo">{{ jogo.set1j1 ?? '-' }} x {{ jogo.set1j2 ?? '-' }}</td>
        </ng-container>

        <ng-container matColumnDef="set2">
          <th mat-header-cell *matHeaderCellDef> Set 2 </th>
          <td mat-cell *matCellDef="let jogo">{{ jogo.set2j1 ?? '-' }} x {{ jogo.set2j2 ?? '-' }}</td>
        </ng-container>

        <ng-container matColumnDef="set3">
          <th mat-header-cell *matHeaderCellDef> Set 3 </th>
          <td mat-cell *matCellDef="let jogo">{{ jogo.set3j1 ?? '-' }} x {{ jogo.set3j2 ?? '-' }}</td>
        </ng-container>

        <ng-container matColumnDef="pontos">
          <th mat-header-cell *matHeaderCellDef> Pontos </th>
          <td mat-cell *matCellDef="let jogo">{{ jogo.pontos_j1 ?? 0 }} x {{ jogo.pontos_j2 ?? 0 }}</td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>
    </div>
  `
})
export class HeadToHeadComponent implements OnInit {
  jogadores: string[] = [];
  jogadorA: string = '';
  jogadorB: string = '';
  confrontos: any[] = [];
  stats: any = { total: 0, vitoriasA: 0, vitoriasB: 0 };
  displayedColumns: string[] = [
    'data', 'classe', 'jogador1', 'jogador2', 'set1', 'set2', 'set3', 'pontos'
  ];

  constructor(private ranking: RankingService,
              private route: ActivatedRoute,
              private router: Router,
  ) {}

  ngOnInit() {
    // Se getAllJogos é síncrono:
    const jogos = this.ranking.getAllJogos();
    if (jogos && jogos.length > 0) {
      this.preencherJogadores(jogos);
    }

    // Se for Observable, use isso:
    if ((this.ranking as any).getAllJogosObservable) {
      (this.ranking as any).getAllJogosObservable().subscribe((jogos: any[]) => {
        this.preencherJogadores(jogos);
      });
    }
  }

  preencherJogadores(jogos: any[]) {
    const nomesSet = new Set<string>();
    jogos.forEach(j => {
      if (j.jogador1) nomesSet.add(j.jogador1);
      if (j.jogador2) nomesSet.add(j.jogador2);
    });
    this.jogadores = Array.from(nomesSet).sort();
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

  goBack() {
    this.router.navigate(['/players']);
  }

}
