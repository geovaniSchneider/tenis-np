import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Jogo } from '../models';
import * as Papa from 'papaparse';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CsvService {
  private jogosSubject = new BehaviorSubject<Jogo[]>([]);
  jogos$ = this.jogosSubject.asObservable();

  tabelasAtuais: { ciclo: string; classe: string; link: string }[] = [
    { ciclo: '2025.3', classe: '1', link: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTNZN4hPXDBqEGb1_T9CUYZAD1w5-OGSOrrH-RT13suVGY1cJEnM97486nxhmeyuyOqi7ckXDQyzzCo/pub?gid=517895131&single=true&output=csv' },
    { ciclo: '2025.3', classe: '2', link: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRSX4m1ilJ0sHhwsoGZi7jTaycOlcANmtI2qYY_5_cEmzjgOcLUvjOCFOytoIgEOsSRODazvVy6M5xn/pub?gid=782127195&single=true&output=csv' },
    { ciclo: '2025.3', classe: '3', link: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSRFgRoY2gZbW0zJZ28kFKBIaOMw1u7saT9Dxm7bYLPVe6_7f8K3J7KE98nuim0IUW1mIek8yAQXXyZ/pub?gid=238023827&single=true&output=csv' },
    { ciclo: '2025.3', classe: '4', link: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRRc20H9PweLghnImIIABATVMDPdQi6hpA1-C_SwOHFdQWPs7D6rjCNTrncrYyXdIRZlRqfnA2zpLZR/pub?gid=255516752&single=true&output=csv' },
    { ciclo: '2025.3', classe: '5', link: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS2NBbDFEr9yyveTcrKUXtpVeaayAiYIkeGbX2BoapbRAMd8n-F6uttALXKzdVObNSdzy9a2_u1PqAQ/pub?gid=562202993&single=true&output=csv' },
  ];

  private loadingSubject = new BehaviorSubject<boolean>(true);
  loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCsv();
  }

  private loadCsv() {
    const requests = [
      this.http.get('/jogos.csv', { responseType: 'text' }),
      ...this.tabelasAtuais.map(t => this.http.get(t.link, { responseType: 'text' }))
    ];

    import('rxjs').then(({ forkJoin }) => {
      forkJoin(requests).subscribe({
        next: (responses) => {
          let allJogos: Jogo[] = [];

          // Process local jogos.csv (first response)
          const localCsv = responses[0];
          if (localCsv) {
            allJogos = [...allJogos, ...this.parseCsv(localCsv)];
          }

          // Process external sheets (rest of responses)
          for (let i = 0; i < this.tabelasAtuais.length; i++) {
            const csvText = responses[i + 1];
            const config = this.tabelasAtuais[i];
            if (csvText) {
              allJogos = [...allJogos, ...this.parseCsv(csvText, config.ciclo, config.classe)];
            }
          }

          this.jogosSubject.next(allJogos);
          this.loadingSubject.next(false);
        },
        error: (err) => {
          console.error('Erro ao carregar CSVs', err);
          this.loadingSubject.next(false);
        }
      });
    });
  }


  private parseCsv(csvText: string, ciclo: string = '', classe: string = ''): Jogo[] {
    const jogos: Jogo[] = [];

    // Usando PapaParse para ler o CSV
    const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });

    for (const row of parsed.data as any[]) {

      if (!row['Jogador 1']) {
        continue;
      }

      if (ciclo) {
        row.CICLO = ciclo;
      }

      if (classe) {
        row.CLASSE = classe;
      }

      const datePart = row['Data do jogo'];
      const timePart = '00:00:00'

      let data_jogo: Date | null = null;
      if (datePart) {
        // Se vier no formato dd/MM/yyyy
        if (datePart.includes('/')) {
          const [dia, mes, ano] = datePart.split('/');
          data_jogo = new Date(`${ano}-${mes}-${dia}T${timePart}`);
        }
        // Se vier no formato yyyy-MM-dd
        else if (datePart.includes('-')) {
          const [ano, mes, dia] = datePart.split('-');
          data_jogo = new Date(`${ano}-${mes}-${dia}T${timePart}`);
        }
      }

      // Criando o objeto Jogo baseado no CSV conhecido
      jogos.push({
        id: Number(row.ID),
        ciclo: row.CICLO,
        classe: row.CLASSE,
        data_jogo,
        jogador1: row['Jogador 1'],
        jogador2: row['Jogador 2'],
        set1j1: row['SET 1 [Jogador 1]'] ? Number(row['SET 1 [Jogador 1]']) : 0,
        set1j2: row['SET 1 [Jogador 2]'] ? Number(row['SET 1 [Jogador 2]']) : 0,
        set2j1: row['SET 2 [Jogador 1]'] ? Number(row['SET 2 [Jogador 1]']) : 0,
        set2j2: row['SET 2 [Jogador 2]'] ? Number(row['SET 2 [Jogador 2]']) : 0,
        set3j1: row['SET 3 [Jogador 1]'] ? Number(row['SET 3 [Jogador 1]']) : null,
        set3j2: row['SET 3 [Jogador 2]'] ? Number(row['SET 3 [Jogador 2]']) : null,
        games_j1: row['Games Jogador 1'] ? Number(row['Games Jogador 1']) : 0,
        games_j2: row['Games Jogador 2'] ? Number(row['Games Jogador 2']) : 0,
        sets_j1: row['Sets Jogador 1'] ? Number(row['Sets Jogador 1']) : 0,
        sets_j2: row['Sets Jogador 2'] ? Number(row['Sets Jogador 2']) : 0,
        vitoria_j1: row['Vitoria Jogador 1'] ? Number(row['Vitoria Jogador 1']) : 0,
        vitoria_j2: row['Vitoria Jogador 2'] ? Number(row['Vitoria Jogador 2']) : 0,
        pontos_j1: row['Pontos jogador 1'] ? Number(row['Pontos jogador 1']) : 0,
        pontos_j2: row['Pontos jogador 2'] ? Number(row['Pontos jogador 2']) : 0,
      });
    }

    return jogos;
  }

  getAllJogos(): Jogo[] {
    return this.jogosSubject.value;
  }

  /** Observable para componentes */
  getJogosObservable() {
    return this.jogos$;
  }

}
