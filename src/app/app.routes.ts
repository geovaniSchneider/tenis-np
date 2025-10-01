import { Routes } from '@angular/router';
import { PlayerListComponent } from './components/player-list/player-list.component';
import { PlayerHistoryComponent } from './components/player-history/player-history.component';
import { HeadToHeadComponent } from './components/head-to-head/head-to-head.component';

export const routes: Routes = [
  { path: '', component: PlayerListComponent },
  { path: 'jogador/:nome', component: PlayerHistoryComponent },
  { path: 'head-to-head', component: HeadToHeadComponent },
  { path: '**', redirectTo: '' }
];
