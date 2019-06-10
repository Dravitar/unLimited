
function treePress(index1, index2) {
  if(player.clicks>0&&!player.buttons.unlocked.includes(""+index1+index2)){
    let r = "row"+index1;
    let c = "col"+index2;
    if(player.producers.power.gte(player.buttons.requirements[r][c][0])&&
       player.buttons.unlocked.includes(player.buttons.requirements[r][c][1])){
      if(index1==3) buyProducer(index2);
      for(let i=0;i<player.buttons.requirements[r][c][2].length;i++) {
        let id=player.buttons.requirements[r][c][2][i];
        docShow("treeButton"+id);
        player.buttons.unlocked.push(player.buttons.requirements[r][c][3]);
      }
      player.clicks--;
      player.producers.power = player.producers.power.minus(player.buttons.requirements[r][c][0]);
    }
  }
}

function buyProducer(num) {
  player.buttons.requirements["row"+3]["col"+num][0] = player.buttons.requirements["row"+3]["col"+num][0].times(new Decimal(1.3))
  player.producers.purchased[num] = player.producers.purchased[num]+1;
}

function docShow(id) {
  document.getElementById(id).style.display = "";
}

function docHide(id) {
  document.getElementById(id).style.display = "none";
}
