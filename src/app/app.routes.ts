import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PlayerListComponent } from './components/player-list/player-list.component';
import { PlayerHistoryComponent } from './components/player-history/player-history.component';
import { HeadToHeadComponent } from './components/head-to-head/head-to-head.component';
import { RankingHistoryComponent } from './components/ranking-history/ranking-history.component';
import { EmBreveComponent } from './components/em-breve/em-breve.component';

export const routes: Routes = [
  { path: '', component: EmBreveComponent, title: 'Tênis NP - Novidades em Breve' },
  { path: 'home', component: HomeComponent, title: 'Tênis NP - Home' },
  { path: 'jogadores', component: PlayerListComponent, title: 'Tênis NP - Lista de Jogadores' },
  { path: 'jogador/:nome', component: PlayerHistoryComponent, title: 'Tênis NP - Análise do Jogador' },
  { path: 'head-to-head', component: HeadToHeadComponent, title: 'Tênis NP - Comparativo entre Jogadores' },
  { path: 'ranking-history', component: RankingHistoryComponent, title: 'Tênis NP - Histórico do Ranking' },
  { path: 'prototype', loadComponent: () => import('./components/home-prototype/home-prototype.component').then(m => m.HomePrototypeComponent), title: 'Tênis NP - Protótipo' },
  { path: '**', redirectTo: '' }
];
