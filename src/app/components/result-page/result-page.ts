import { Component, inject, OnInit, output } from '@angular/core';
import { Game } from '../../services/game';

@Component({
  selector: 'app-result-page',
  imports: [],
  templateUrl: './result-page.html',
  styleUrl: './result-page.scss'
})
export class ResultPage implements OnInit{
  gameService = inject(Game)

  ngOnInit(): void {
    this.gameService.resultList.forEach(element=> {
      if(element.prizeAmount > 0){
        this.gameService.user.balance = (this.gameService.user.balance + element.prizeAmount)
      }
    })
  }

  close(){
    this.gameService.checkGameOver()
    this.gameService.showResultPage = false
    this.gameService.roundOver = true
  }

  leavePage(){

  }
}
