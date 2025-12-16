import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';

interface Classe {
  nome: string;
  link: string;
}

interface RankingHistory {
  ciclo: string;
  classes: Classe[];
}

@Component({
  selector: 'app-ranking-history',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './ranking-history.component.html',
  styleUrls: ['./ranking-history.component.scss']
})
export class RankingHistoryComponent implements OnInit {
  dados: RankingHistory[] = [];
  carregando = true;

  constructor(private http: HttpClient, private router: Router,) { }

  ngOnInit(): void {
    this.http.get('/ciclos.csv', { responseType: 'text' })
      .subscribe({
        next: (csvData) => {
          this.dados = this.parseCsv(csvData);
          this.carregando = false;
        },
        error: (err) => {
          console.error('Erro ao carregar CSV:', err);
          this.carregando = false;
        }
      });
  }

  // private parseCsv(csv: string): RankingHistory[] {
  //   const linhas = csv.trim().split('\n');
  //   const cabecalho = linhas.shift()?.split(',') ?? [];

  //   return linhas.map(linha => {
  //     const valores = linha.split(',');
  //     return {
  //       Ciclo: valores[cabecalho.indexOf('Ciclo')],
  //       Classe: valores[cabecalho.indexOf('Classe')],
  //       Link: valores[cabecalho.indexOf('Link')],
  //     };
  //   });
  // }

  private parseCsv(csv: string): RankingHistory[] {
    const linhas = csv.trim().split('\n');
    const cabecalho = linhas.shift()?.split(',') ?? [];

    const mapaCiclos: { [ciclo: string]: { nome: string; link: string }[] } = {};

    for (const linha of linhas) {
      const valores = linha.split(',');

      const ciclo = valores[cabecalho.indexOf('Ciclo')];
      const classe = valores[cabecalho.indexOf('Classe')];
      const link = valores[cabecalho.indexOf('Link')];

      if (!mapaCiclos[ciclo]) {
        mapaCiclos[ciclo] = [];
      }

      mapaCiclos[ciclo].push({ nome: classe, link });
    }

    // Converte o mapa em uma lista de RankingHistory
    return Object.entries(mapaCiclos).map(([ciclo, classes]) => ({
      ciclo,
      classes,
    }));
  }


  goHome() {
    this.router.navigate(['/home']);
  }

  abrirLink(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

}
