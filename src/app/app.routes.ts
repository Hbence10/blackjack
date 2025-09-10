import { Routes } from '@angular/router';
import { GamePage } from './components/game-page/game-page';

export const routes: Routes = [
  {
    path: "gamePage",
    component: GamePage
  },
  {
    path: "",
    pathMatch: "full",
    redirectTo: "gamePage"
  },
];
