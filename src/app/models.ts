export interface Jogo {
   id: number;
   ciclo: string;
   classe: string;
   data_jogo: Date | null;
   jogador1: string;
   jogador2: string;
   set1j1?: number | null;
   set1j2?: number | null;
   set2j1?: number | null;
   set2j2?: number | null;
   set3j1?: number | null;
   set3j2?: number | null;
   games_j1?: number;
   games_j2?: number;
   sets_j1?: number;
   sets_j2?: number;
   vitoria_j1?: number;
   vitoria_j2?: number;
   resultado?: string;
   pontos_j1?: number;
   pontos_j2?: number;
}


export interface PosicaoCiclo {
   ciclo: string;
   classe: string;
   posicao: number;
}