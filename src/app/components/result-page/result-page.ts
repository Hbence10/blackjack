import { Component, inject, output } from '@angular/core';
import { Game } from '../../services/game';

@Component({
  selector: 'app-result-page',
  imports: [],
  templateUrl: './result-page.html',
  styleUrl: './result-page.scss'
})
export class ResultPage {
  gameService = inject(Game)

  close(){
    this.gameService.showResultPage = false
    this.gameService.roundOver = true
  }

  leavePage(){

  }
}
