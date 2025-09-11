import { Component, inject, OnInit, output, signal } from '@angular/core';
import { Chips } from '../../models/chips.model';
import { Game } from '../../services/game';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-money',
  imports: [CommonModule],
  templateUrl: './user-money.html',
  styleUrl: './user-money.scss'
})
export class UserMoney{
  gameService = inject(Game)

  allIn(){
    let lastIndex: number = this.gameService.chipsList().length -1;
    let highestChip: Chips = this.gameService.chipsList()[lastIndex]

    while(this.gameService.user.balance != 0){
      if(this.gameService.user.balance - highestChip.value >= highestChip.value){
        this.gameService.user.balance -= this.gameService.chipsList()[lastIndex].value
        this.gameService.boxList.update(old => [...old, this.gameService.chipsList()[lastIndex]])
      } else {
        this.gameService.user.balance -= this.gameService.chipsList()[lastIndex].value
        this.gameService.boxList.update(old => [...old, this.gameService.chipsList()[lastIndex]])

        lastIndex -= 1
        highestChip = this.gameService.chipsList()[lastIndex]
      }
    }
  }

  addChipToBox(selectedChip: Chips){
    if(selectedChip.value > this.gameService.user.balance){
      alert("You don't have enough money for this chip!")
      return;
    }

    this.gameService.boxList.update(old => [...old, selectedChip])
    this.gameService.user.balance = (this.gameService.user.balance - selectedChip.value)
  }
}
