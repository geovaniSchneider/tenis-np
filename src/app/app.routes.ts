import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PlayerListComponent } from './components/player-list/player-list.component';
import { PlayerHistoryComponent } from './components/player-history/player-history.component';
import { HeadToHeadComponent } from './components/head-to-head/head-to-head.component';
import { RankingHistoryComponent } from './components/ranking-history/ranking-history.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // agora a home é a inicial
  { path: 'jogadores', component: PlayerListComponent },
  { path: 'jogador/:nome', component: PlayerHistoryComponent },
  { path: 'head-to-head', component: HeadToHeadComponent },
  { path: 'ranking-history', component: RankingHistoryComponent },
  { path: 'prototype', loadComponent: () => import('./components/home-prototype/home-prototype.component').then(m => m.HomePrototypeComponent) },
  { path: '**', redirectTo: '' }
];
