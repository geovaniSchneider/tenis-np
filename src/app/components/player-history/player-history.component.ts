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
  templateUrl: './player-history.component.html',
  styleUrls: ['./player-history.component.scss']
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
  resumoPorClasse: any[] = [];

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
  ) { }

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

    let width = window.innerWidth;
    console.log('Largura do gráfico:', width);
    this.chartView = [width, 300]; // largura x altura do gráfico

    this.carregarTodasClasses();

    this.resumoPorClasse = this.getResumoPorClasse();

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

  getResumoPorClasse(): any[] {
    const resumoMap = new Map<string, { total: number; vitorias: number; derrotas: number; percentual: number }>();

    for (const jogo of this.jogos) {
      const classe = jogo.classe?.toString() ?? 'Desconhecida';
      if (!resumoMap.has(classe)) {
        resumoMap.set(classe, { total: 0, vitorias: 0, derrotas: 0, percentual: 0 });
      }

      const stats = resumoMap.get(classe)!;
      stats.total++;

      const venceu =
        (jogo.jogador1 === this.jogador && jogo.vitoria_j1) ||
        (jogo.jogador2 === this.jogador && jogo.vitoria_j2);

      if (venceu) {
        stats.vitorias++;
      } else {
        stats.derrotas++;
      }
    }

    // Calcular percentuais
    for (const [classe, stats] of resumoMap) {
      stats.percentual = stats.total > 0 ? (stats.vitorias / stats.total) * 100 : 0;
    }

    // Converter para array ordenado
    return Array.from(resumoMap.entries())
      .map(([classe, stats]) => ({ classe, ...stats }))
      .sort((a, b) => Number(a.classe) - Number(b.classe));
  }


  goBack() {
    this.router.navigate(['/jogadores']);
  }
}
