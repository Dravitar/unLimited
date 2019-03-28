function treePress(index, subindex) {
  if(player.clicks>0) {
    if(player.producers.power.gte(player.buttons.requirements.power[index][subindex])&&
       player.buttons.unlocked.includes(player.buttons.requirements.buttons[index][subindex])) {
      player.clicks--;
      for(let i in player.buttons.unlocks[index][subindex]) {
        addElement("mainTree", "div", "treeButtonDiv"+i, 
    }
  }
}
        
