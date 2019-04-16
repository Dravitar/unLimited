function treePress(index1, index2) {
  if(player.clicks>0){
    if(player.producers.power.gte(player.buttons.requirements.power[index1][index2])&&
       player.buttons.unlocked.includes(player.buttons.requirements.buttons[index1][index2])){
      for(let i in player.buttons.unlocks[index1][index2]) {
        let id="treeButton"+i;
        docShow(id);
        player.buttons.unlocked.push(id);
      }
    }
  }
}

function docShow(id) {
  document.getElementById(id).style.display = "";
}

function docHide(id) {
  document.getElementById(id).style.display = "none";
}
