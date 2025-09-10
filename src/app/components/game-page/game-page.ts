import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Chips } from '../../models/chips.model';
import { Game } from '../../services/game';
import { Box } from '../box/box';
import { UserMoney } from '../user-money/user-money';
import { UserPlace } from '../user-place/user-place';
import { ResultPage } from '../result-page/result-page';

@Component({
  selector: 'app-game-page',
  imports: [CommonModule, UserMoney, UserPlace, Box, ResultPage],
  templateUrl: './game-page.html',
  styleUrl: './game-page.scss'
})
export class GamePage {
  gameService = inject(Game)

  isSplitable = signal<boolean>(false)
  cantDraw = false

  setStartPage() {
    this.gameService.gameStarted = true
    this.gameService.setStartPage()
  }

}
