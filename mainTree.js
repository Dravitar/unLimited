
function treePress(index1, index2) {
  if(player.clicks>0&&!player.buttons.unlocked.includes(""+index1+index2)){
    if(player.producers.power.gte(player.buttons.requirements["row"+index1]["col"+index2][0])&&
       player.buttons.unlocked.includes(player.buttons.requirements["row"+index1]["col"+index2][1])){
      for(let i=0;i<player.buttons.requirements["row"+index1]["col"+index2][2].length;i++) {
        let id=player.buttons.requirements["row"+index1]["col"+index2][2][i];
        docShow("treeButton"+id);
        player.buttons.unlocked.push(id);
      }
      player.clicks--;
    }
  }
}

function docShow(id) {
  console.log(id);
  document.getElementById(id).style.display = "";
}

function docHide(id) {
  document.getElementById(id).style.display = "none";
}
