// src/app/services/ranking.service.ts
import { Injectable } from '@angular/core';
import { CsvService } from './csv.service';
import { Jogo, PosicaoCiclo } from '../models';

interface PlayerStats {
  nome: string;
  classe: number;
  pts: number;
  setsWon: number;
  setsLost: number;
  gamesWon: number;
  gamesLost: number;
  wins: number;
  losses: number;
  pos?: number;
}

/**
 * RankingService
 *
 * Responsabilidades:
 * - calcular posições por ciclo/por classe
 * - oferecer histórico de posições de um jogador
 * - calcular promoções/rebaixamentos com regras configuráveis
 *
 * Observações/assunções padrão:
 * - Vitória = 3 pontos (pontuação simples; ajuste conforme sua regra)
 * - Desempate ordenado por: pontos -> saldo de sets -> saldo de games -> número de vitórias -> nome
 * - Classes são ordenadas numericamente; o array de classes é ordenado ascendentemente (ex: [1,2,3...]).
 *   Assumimos que classe menor representa nível superior (ex.: 1 = divisão superior).
 */
@Injectable({ providedIn: 'root' })
export class RankingService {
  // Pontos por vitória (configurável aqui)
  winPoints = 3;

  constructor(private csv: CsvService) {}

  /** Retorna lista de ciclos existentes (ordenada) */
  getCycles(): string[] {
    const jogos = this.csv.getAllJogos();
    const ciclos = Array.from(new Set(jogos.map(j => j.ciclo)));
    return ciclos.sort();
  }

   getAllJogos(): Jogo[] {
    return this.csv.getAllJogos();
  }

   /** Retorna todos os jogos de um jogador */
  getJogosDoJogador(nome: string): Jogo[] {
    return this.csv.getAllJogos().filter(
      j => j.jogador1 === nome || j.jogador2 === nome
    );
  }

   /** Retorna todos os confrontos diretos entre dois jogadores */
  getHeadToHead(jogadorA: string, jogadorB: string): Jogo[] {
    return this.csv.getAllJogos().filter(j =>
      (j.jogador1 === jogadorA && j.jogador2 === jogadorB) ||
      (j.jogador1 === jogadorB && j.jogador2 === jogadorA)
    );
  }

  /** Estatísticas de head-to-head entre dois jogadores */
  getHeadToHeadStats(jogadorA: string, jogadorB: string) {
    const confrontos = this.getHeadToHead(jogadorA, jogadorB);
    let vitoriasA = 0;
    let vitoriasB = 0;

    for (const jogo of confrontos) {
      if (jogo.jogador1 === jogadorA && jogo.vitoria_j1) vitoriasA++;
      else if (jogo.jogador2 === jogadorA && jogo.vitoria_j2) vitoriasA++;
      else if (jogo.jogador1 === jogadorB && jogo.vitoria_j1) vitoriasB++;
      else if (jogo.jogador2 === jogadorB && jogo.vitoria_j2) vitoriasB++;
    }

    return {
      total: confrontos.length,
      vitoriasA,
      vitoriasB
    };
  }


  /** Retorna lista de classes existentes no ciclo (ordenadas numericamente) */
  getClassesInCycle(ciclo: string): number[] {
    const jogos = this.csv.getAllJogos().filter(j => j.ciclo === ciclo);
    const classes = Array.from(new Set(jogos.map(j => j.classe))).map(Number);
    return classes.sort((a, b) => a - b);
  }

  getJogosObservable() {
   return this.csv.getJogosObservable();
   }

  /** Retorna estatísticas (pts, sets, games, vitórias, derrotas) por jogador para uma dada classe dentro de um ciclo */
  computeStatsForCycleClass(ciclo: string, classe: number): PlayerStats[] {
    const jogos = this.csv.getAllJogos().filter(j => j.ciclo === ciclo && j.classe === classe);
    const stats = new Map<string, PlayerStats>();

    const ensurePlayer = (nome: string) => {
      if (!stats.has(nome)) {
        stats.set(nome, {
          nome,
          classe,
          pts: 0,
          setsWon: 0,
          setsLost: 0,
          gamesWon: 0,
          gamesLost: 0,
          wins: 0,
          losses: 0
        });
      }
    };

    const safeNum = (v: any) => {
      if (v === null || v === undefined || v === '') return 0;
      const n = Number(v);
      return isNaN(n) ? 0 : n;
    };

    const computeSetsFromFields = (j: Jogo) => {
      let s1 = 0, s2 = 0;
      const pairs: Array<[any, any]> = [
        [j.set1j1, j.set1j2],
        [j.set2j1, j.set2j2],
        [j.set3j1, j.set3j2]
      ];
      for (const [a, b] of pairs) {
        if (a != null && b != null && a !== '' && b !== '') {
          const na = safeNum(a), nb = safeNum(b);
          if (na > nb) s1++;
          else if (nb > na) s2++;
        }
      }
      return { s1, s2 };
    };

    const computeGamesFromFields = (j: Jogo) => {
      // prefer explicit totals if available
      if (j.games_j1 !== undefined && j.games_j2 !== undefined) {
        return { g1: safeNum(j.games_j1), g2: safeNum(j.games_j2) };
      }
      // fallback: sum of set game values (may be imperfect)
      let g1 = 0, g2 = 0;
      const pairGames: Array<[any, any]> = [
        [j.set1j1, j.set1j2],
        [j.set2j1, j.set2j2],
        [j.set3j1, j.set3j2]
      ];
      for (const [a, b] of pairGames) {
        if (a != null && b != null && a !== '' && b !== '') {
          g1 += safeNum(a);
          g2 += safeNum(b);
        }
      }
      return { g1, g2 };
    };

    for (const j of jogos) {
      const p1 = j.jogador1 || '';
      const p2 = j.jogador2 || '';
      ensurePlayer(p1);
      ensurePlayer(p2);

      // sets
      const sets = (j.sets_j1 !== undefined && j.sets_j2 !== undefined)
        ? { s1: safeNum(j.sets_j1), s2: safeNum(j.sets_j2) }
        : computeSetsFromFields(j);

      // games
      const games = computeGamesFromFields(j);

      // vencedor (priorizar campo explícito)
      let vencedor: string | null = null;
      if (j.vitoria_j1 === 1) vencedor = p1;
      else if (j.vitoria_j2 === 1) vencedor = p2;
      else {
        // fallback para comparar sets
        if (sets.s1 > sets.s2) vencedor = p1;
        else if (sets.s2 > sets.s1) vencedor = p2;
        else if (games.g1 > games.g2) vencedor = p1;
        else if (games.g2 > games.g1) vencedor = p2;
      }

      // atualizar stats de p1
      const s1 = stats.get(p1)!;
      s1.setsWon += sets.s1;
      s1.setsLost += sets.s2;
      s1.gamesWon += games.g1;
      s1.gamesLost += games.g2;
      if (vencedor === p1) {
        s1.wins += 1;
        s1.pts += this.winPoints;
      } else if (vencedor === p2) {
        s1.losses += 1;
      }

      // atualizar stats de p2
      const s2 = stats.get(p2)!;
      s2.setsWon += sets.s2;
      s2.setsLost += sets.s1;
      s2.gamesWon += games.g2;
      s2.gamesLost += games.g1;
      if (vencedor === p2) {
        s2.wins += 1;
        s2.pts += this.winPoints;
      } else if (vencedor === p1) {
        s2.losses += 1;
      }
    }

    // converter para array e ordenar por critérios de desempate
    const arr = Array.from(stats.values());
    arr.sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      const saldoSetsA = a.setsWon - a.setsLost;
      const saldoSetsB = b.setsWon - b.setsLost;
      if (saldoSetsB !== saldoSetsA) return saldoSetsB - saldoSetsA;
      const saldoGamesA = a.gamesWon - a.gamesLost;
      const saldoGamesB = b.gamesWon - b.gamesLost;
      if (saldoGamesB !== saldoGamesA) return saldoGamesB - saldoGamesA;
      if (b.wins !== a.wins) return b.wins - a.wins;
      return a.nome.localeCompare(b.nome);
    });

    // atribuir posições
    arr.forEach((p, idx) => p.pos = idx + 1);
    return arr;
  }

  /**
   * Retorna posições para todas as classes do ciclo.
   * Saída: array de PlayerStats com propriedade pos preenchida.
   */
  computePositionsForCycle(ciclo: string): PlayerStats[] {
    const classes = this.getClassesInCycle(ciclo);
    let result: PlayerStats[] = [];
    for (const c of classes) {
      const stats = this.computeStatsForCycleClass(ciclo, c);
      result = result.concat(stats);
    }
    return result;
  }

  /** Retorna a posição (PosicaoCiclo) de um jogador em todos os ciclos */
  getPosicoesDoJogador(nome: string): PosicaoCiclo[] {
    const ciclos = this.getCycles();
    const resultado: PosicaoCiclo[] = [];
    for (const c of ciclos) {
      const classes = this.getClassesInCycle(c);
      for (const cl of classes) {
        const stats = this.computeStatsForCycleClass(c, cl);
        const found = stats.find(s => s.nome === nome);
        if (found) {
          resultado.push({ ciclo: c, classe: cl, posicao: found.pos ?? -1 });
          break; // assume um jogador joga apenas em uma classe por ciclo; se não, será necessário ajustar
        }
      }
    }
    return resultado;
  }

  /** Retorna a posição específica de um jogador em um ciclo (ou null) */
  getPlayerPositionInCycle(nome: string, ciclo: string): PosicaoCiclo | null {
    const classes = this.getClassesInCycle(ciclo);
    for (const cl of classes) {
      const stats = this.computeStatsForCycleClass(ciclo, cl);
      const found = stats.find(s => s.nome === nome);
      if (found) return { ciclo, classe: cl, posicao: found.pos ?? -1 };
    }
    return null;
  }

  /**
   * Calcula promoções e rebaixamentos para um ciclo.
   * Regras:
   * - promoteCount: quantos jogadores do topo de cada classe sobem para a classe imediatamente superior (classe anterior na ordenação)
   * - relegateCount: quantos jogadores do fundo de cada classe descem para a classe imediatamente inferior (classe seguinte na ordenação)
   *
   * Retorna:
   * { promotions: Movement[], relegations: Movement[] }
   */
  computePromotionsAndRelegations(ciclo: string, promoteCount = 2, relegateCount = 2) {
    const classes = this.getClassesInCycle(ciclo); // ex: [1,2,3]
    const promotions: Array<{ nome: string; fromClasse: number; toClasse: number; pos: number; pts: number }> = [];
    const relegations: Array<{ nome: string; fromClasse: number; toClasse: number; pos: number; pts: number }> = [];

    for (let i = 0; i < classes.length; i++) {
      const cl = classes[i];
      const stats = this.computeStatsForCycleClass(ciclo, cl);

      // promoção: para a classe anterior na lista (i-1)
      const upClass = classes[i - 1];
      if (upClass !== undefined && promoteCount > 0) {
        const top = stats.slice(0, promoteCount);
        for (const p of top) {
          promotions.push({ nome: p.nome, fromClasse: cl, toClasse: upClass, pos: p.pos ?? -1, pts: p.pts });
        }
      }

      // rebaixamento: para a próxima classe (i+1)
      const downClass = classes[i + 1];
      if (downClass !== undefined && relegateCount > 0) {
        const bottom = stats.slice(Math.max(0, stats.length - relegateCount));
        for (const p of bottom) {
          relegations.push({ nome: p.nome, fromClasse: cl, toClasse: downClass, pos: p.pos ?? -1, pts: p.pts });
        }
      }
    }

    return { promotions, relegations };
  }

  /** (Opcional) calcula um ranking agregado por ciclo, com agrupamento por classe e posição */
  computeFlattenedRanking(ciclo: string) {
    const positions = this.computePositionsForCycle(ciclo);
    // positions já retorna PlayerStats com pos, classe, pts...
    return positions.map(p => ({
      nome: p.nome,
      ciclo,
      classe: p.classe,
      posicao: p.pos,
      pts: p.pts,
      setsWon: p.setsWon,
      setsLost: p.setsLost,
      gamesWon: p.gamesWon,
      gamesLost: p.gamesLost,
      wins: p.wins,
      losses: p.losses
    }));
  }
}
