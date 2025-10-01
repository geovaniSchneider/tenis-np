import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Jogo } from '../models';
import * as Papa from 'papaparse';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CsvService {
  private jogosSubject = new BehaviorSubject<Jogo[]>([]);
  jogos$ = this.jogosSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCsv();
  }

  private loadCsv() {
    this.http.get('jogos.csv', { responseType: 'text' })
      .subscribe(text => {
        const parsed = this.parseCsv(text);
        this.jogosSubject.next(parsed);
      });
  }

  private parseCsv(csvText: string): Jogo[] {
    const jogos: Jogo[] = [];

    // Usando PapaParse para ler o CSV
    const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });

    for (const row of parsed.data as any[]) {
      
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
        classe: Number(row.CLASSE),
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
