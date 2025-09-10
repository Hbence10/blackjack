import { Component, computed, inject } from '@angular/core';
import { Game } from '../../services/game';
import { Chips } from '../../models/chips.model';

@Component({
  selector: 'app-box',
  imports: [],
  templateUrl: './box.html',
  styleUrl: './box.scss'
})
export class Box {
  gameService = inject(Game)
  splittedChipsRow = computed(() => {
    const rows: Chips[][] = []
    for (let i: number = 0; i < this.gameService.boxList().length; i+=5){
      const row: Chips[] = []
      for (let j: number = i; j < i+5; j++){
        row.push(this.gameService.boxList()[j])
      }
      rows.push(row)
    }
    return rows
  })

  removeChipFromBox(selectedChip: Chips) {
    this.gameService.boxList().splice(this.gameService.boxList().indexOf(selectedChip), 1)
    this.gameService.user().balance = this.gameService.user().balance + selectedChip.value
  }
}
