import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RankingService } from '../../services/ranking.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  standalone: true,
  selector: 'app-player-history',
  imports: [CommonModule, MatTableModule, MatButtonModule, MatCardModule, NgxChartsModule],
  template: `
    <div class="container mt-3">

      <!-- Botão voltar -->
      <button mat-button color="primary" class="mb-3" (click)="goBack()">
        &larr; Voltar para Lista de Jogadores
      </button>

      <h2>Histórico de {{ jogador }}</h2>

      <!-- Cards com estatísticas -->
      <div class="row mb-3">
        <div class="col-md-4 mb-2">
          <mat-card>
            <mat-card-title>Total de Jogos</mat-card-title>
            <mat-card-content>
              <h3>{{ totalJogos }}</h3>
            </mat-card-content>
          </mat-card>
        </div>
        <div class="col-md-4 mb-2">
          <mat-card>
            <mat-card-title>Total de Vitórias</mat-card-title>
            <mat-card-content>
              <h3>{{ totalVitorias }}</h3>
              <small *ngIf="totalJogos > 0">
                ({{ (totalVitorias / totalJogos * 100) | number:'1.0-1' }}%)
              </small>
            </mat-card-content>
          </mat-card>
        </div>
        <div class="col-md-4 mb-2">
          <mat-card>
            <mat-card-title>Total de Derrotas</mat-card-title>
            <mat-card-content>
              <h3>{{ totalDerrotas }}</h3>
              <small *ngIf="totalJogos > 0">
                ({{ (totalDerrotas / totalJogos * 100) | number:'1.0-1' }}%)
              </small>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <!-- Resumo de ciclos -->
      <div class="mb-4">
         <h3>Participação por Ciclo</h3>
         <div *ngFor="let item of ciclosDoJogador" class="mb-2">
            <strong>{{ item.ciclo }}:</strong>
            <ng-container *ngIf="item.classes.length > 0; else semJogos">
               <span *ngFor="let classe of item.classes" class="badge bg-primary me-1">
               {{ classe }}
               </span>
            </ng-container>
            <ng-template #semJogos>
               <span class="text-muted">— Não jogou —</span>
            </ng-template>
         </div>
      </div>


      <!-- Gráfico de evolução -->
      <div class="mb-4">
         <h3>Evolução por Ciclo</h3>

         <ngx-charts-line-chart
            [view]="chartView"
            [scheme]="'vivid'"
            [results]="chartData"
            [gradient]="false"
            [xAxis]="showXAxis"
            [yAxis]="showYAxis"
            [legend]="showLegend"
            [showXAxisLabel]="showXAxisLabel"
            [showYAxisLabel]="showYAxisLabel"
            [xAxisLabel]="xAxisLabel"
            [yAxisLabel]="yAxisLabel"
            [yScaleMin]="yScaleMin"
            [yScaleMax]="yScaleMax"
            [yAxisTicks]="this.todasClasses"
            [autoScale]="false"
            [timeline]="false"
            [yAxisTickFormatting]="yAxisTickFormatting"
            [roundDomains]="true">

           
         </ngx-charts-line-chart>
      </div>




      <!-- Tabela -->
      <table mat-table [dataSource]="jogos" class="table table-striped table-bordered">

        <!-- Ciclo -->
        <ng-container matColumnDef="ciclo">
          <th mat-header-cell *matHeaderCellDef> Ciclo </th>
          <td mat-cell *matCellDef="let jogo"> {{ jogo.ciclo }} </td>
        </ng-container>

        <!-- Classe -->
        <ng-container matColumnDef="classe">
          <th mat-header-cell *matHeaderCellDef> Classe </th>
          <td mat-cell *matCellDef="let jogo"> {{ jogo.classe }} </td>
        </ng-container>

        <!-- Data -->
        <ng-container matColumnDef="data">
          <th mat-header-cell *matHeaderCellDef> Data </th>
          <td mat-cell *matCellDef="let jogo"> {{ jogo.data_jogo ? (jogo.data_jogo | date:'dd/MM/yyyy') : '' }} </td>
        </ng-container>

        <!-- Jogador 1 -->
        <ng-container matColumnDef="jogador1">
          <th mat-header-cell *matHeaderCellDef> Jogador 1 </th>
          <td mat-cell *matCellDef="let jogo">
            <span [ngClass]="{'fw-bold': jogo.vitoria_j1}">{{ jogo.jogador1 }}</span>
          </td>
        </ng-container>

        <!-- Jogador 2 -->
        <ng-container matColumnDef="jogador2">
          <th mat-header-cell *matHeaderCellDef> Jogador 2 </th>
          <td mat-cell *matCellDef="let jogo">
            <span [ngClass]="{'fw-bold': jogo.vitoria_j2}">{{ jogo.jogador2 }}</span>
          </td>
        </ng-container>

        <!-- Set 1 -->
        <ng-container matColumnDef="set1">
          <th mat-header-cell *matHeaderCellDef> Set 1 </th>
          <td mat-cell *matCellDef="let jogo">
            {{ jogo.set1j1 ?? '-' }} x {{ jogo.set1j2 ?? '-' }}
          </td>
        </ng-container>

        <!-- Set 2 -->
        <ng-container matColumnDef="set2">
          <th mat-header-cell *matHeaderCellDef> Set 2 </th>
          <td mat-cell *matCellDef="let jogo">
            {{ jogo.set2j1 ?? '-' }} x {{ jogo.set2j2 ?? '-' }}
          </td>
        </ng-container>

        <!-- Set 3 -->
        <ng-container matColumnDef="set3">
          <th mat-header-cell *matHeaderCellDef> Set 3 </th>
          <td mat-cell *matCellDef="let jogo">
            {{ jogo.set3j1 ?? '-' }} x {{ jogo.set3j2 ?? '-' }}
          </td>
        </ng-container>

        <!-- Pontos -->
        <ng-container matColumnDef="pontos">
          <th mat-header-cell *matHeaderCellDef> Pontos </th>
          <td mat-cell *matCellDef="let jogo">
            {{ jogo.pontos_j1 ?? 0 }} x {{ jogo.pontos_j2 ?? 0 }}
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>

      </table>
    </div>
  `
})
export class PlayerHistoryComponent implements OnInit {
  jogador: string = '';
  jogos: any[] = [];
  displayedColumns: string[] = [
    'ciclo',
    'classe',
    'data',
    'jogador1',
    'jogador2',
    'set1',
    'set2',
    'set3',
    'pontos'
  ];

  ciclosDoJogador: { ciclo: string, classes: string[] }[] = [];

  todasClasses: string[] = [];

  totalJogos = 0;
  totalVitorias = 0;
  totalDerrotas = 0;


   // Dados do gráfico
   chartData: any[] = [];
   chartView: [number, number] = [700, 300]; // largura x altura do gráfico

   // Opções de estilo
   showXAxis = true;
   showYAxis = true;
   showLegend = false;
   showXAxisLabel = true;
   showYAxisLabel = true;
   xAxisLabel = 'Ciclo';
   yAxisLabel = 'Classe';
   yScaleMin = 0;
   yScaleMax = 0;
   classValues: Record<string, number> = {};



  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ranking: RankingService
  ) {}

  ngOnInit() {
      this.jogador = this.route.snapshot.paramMap.get('nome') || '';

      // Pegar todos os jogos do jogador e ordenar por data
      this.jogos = this.ranking.getJogosDoJogador(this.jogador).sort((a, b) => {
      const dateA = a.data_jogo ? new Date(a.data_jogo).getTime() : null;
      const dateB = b.data_jogo ? new Date(b.data_jogo).getTime() : null;

      if (dateA === null && dateB !== null) return -1;
      if (dateB === null && dateA !== null) return 1;
      if (dateA === null && dateB === null) return 0;

      return dateA! - dateB!;
      });

      this.totalJogos = this.jogos.length;
      this.totalVitorias = this.jogos.filter(
      j =>
         (j.jogador1 === this.jogador && j.vitoria_j1) ||
         (j.jogador2 === this.jogador && j.vitoria_j2)
      ).length;
      this.totalDerrotas = this.totalJogos - this.totalVitorias;




      // --- Montar lista de ciclos e classes ---
      const todosJogos = this.ranking.getAllJogos(); // todos os jogos do CSV
      const todosCiclos = Array.from(new Set(todosJogos.map(j => j.ciclo))).sort();

      const ciclosMap = new Map<string, Set<string>>();

      for (const jogo of this.jogos) {
         if (!ciclosMap.has(jogo.ciclo)) {
            ciclosMap.set(jogo.ciclo, new Set());
         }
         ciclosMap.get(jogo.ciclo)!.add(jogo.classe);
      }

      this.ciclosDoJogador = todosCiclos.map(ciclo => ({
         ciclo,
         classes: ciclosMap.has(ciclo)
            ? Array.from(ciclosMap.get(ciclo)!)
            : [] // ciclo sem jogos
      }));

      this.carregarTodasClasses();
   
  }

   yAxisTickFormatting = (val: number) => {
      return this.classValues[val.toString()] ?? '';
   };

carregarTodasClasses() {
   const todosJogos = this.ranking.getAllJogos();
   const classesSet = new Set<string>();

   for (const jogo of todosJogos) {

      if (isNaN(Number(jogo.classe))) {
         continue;
      }

      if (jogo.classe) {
         classesSet.add(jogo.classe.toString());

         if (Number(jogo.classe) > this.yScaleMax) {
            this.yScaleMax = Number(jogo.classe)
         }
      }
   }

   this.todasClasses = Array.from(classesSet).sort((a, b) => {
      // Ordena numericamente, se forem números
      const numA = Number(a);
      const numB = Number(b);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.localeCompare(b);
   });

      // Ajuste para manter a CLASSE 1 no topo
      for (let i = this.yScaleMin; i <= this.yScaleMax; i++) {
         this.classValues[i] = this.yScaleMax - i + 1;
      }

      this.chartData = [
      {
         name: 'Classe por Ciclo',
         series: this.ciclosDoJogador.map(ciclo => {
            if (ciclo.classes.length === 0) {
            return { name: ciclo.ciclo, value: 0 }; // não jogou
            }

            // Se jogou em mais de uma classe no mesmo ciclo, pega o valor máximo
            const valores = ciclo.classes.map(cl => this.classValues[cl] ?? 0);
            const melhorClasse = Math.max(...valores);

            return { name: ciclo.ciclo, value: melhorClasse };
         })
      }
      ];
      
   }

  goBack() {
    this.router.navigate(['/jogadores']);
  }
}
