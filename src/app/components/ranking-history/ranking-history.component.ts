import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';

interface RankingHistory {
  Ciclo: string;
  Classe: string;
  Link: string;
}

@Component({
  selector: 'app-ranking-history',
  standalone: true, // importante
  imports: [CommonModule, MatTableModule], // inclui CommonModule e MatTableModule
  templateUrl: './ranking-history.component.html',
  styleUrls: ['./ranking-history.component.scss']
})
export class RankingHistoryComponent implements OnInit {
  dados: RankingHistory[] = [];
  carregando = true;

  constructor(private http: HttpClient, private router: Router,) {}

  ngOnInit(): void {
    this.http.get('ciclos.csv', { responseType: 'text' })
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

  private parseCsv(csv: string): RankingHistory[] {
    const linhas = csv.trim().split('\n');
    const cabecalho = linhas.shift()?.split(',') ?? [];

    return linhas.map(linha => {
      const valores = linha.split(',');
      return {
        Ciclo: valores[cabecalho.indexOf('Ciclo')],
        Classe: valores[cabecalho.indexOf('Classe')],
        Link: valores[cabecalho.indexOf('Link')],
      };
    });
  }

  goHome() {
    this.router.navigate(['/home']);
  }
}
