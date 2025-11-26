import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PlayerListComponent } from './components/player-list/player-list.component';
import { PlayerHistoryComponent } from './components/player-history/player-history.component';
import { HeadToHeadComponent } from './components/head-to-head/head-to-head.component';
import { RankingHistoryComponent } from './components/ranking-history/ranking-history.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Tênis NP - Home' }, // agora a home é a inicial
  { path: 'jogadores', component: PlayerListComponent, title: 'Tênis NP - Lista de Jogadores' },
  { path: 'jogador/:nome', component: PlayerHistoryComponent, title: 'Tênis NP - Análise do Jogador' },
  { path: 'head-to-head', component: HeadToHeadComponent, title: 'Tênis NP - Comparativo entre Jogadores' },
  { path: 'ranking-history', component: RankingHistoryComponent, title: 'Tênis NP - Histórico do Ranking' },
  { path: 'prototype', loadComponent: () => import('./components/home-prototype/home-prototype.component').then(m => m.HomePrototypeComponent), title: 'Tênis NP - Protótipo' },
  { path: '**', redirectTo: '' }
];
