function getDefaultPlayer() {
  return {
    clicks: 12, //How many clicks the player has remaining
    buttons: {
      unlocked: [""], //All buttons the player has currently unlocked
      requirements: { //Power req, button unlock req, buttons that it unlocks
	row0: {col0: [0, "", ["11"]]},
	row1: {col0: [0, "00", ["21"]]},
	row2: {
		col0: ["1e4", "11", [""]],
		col1: [0, "11", [""]],
		col2: ["1e12", "11", [""]],
	},
      },
    },
    producers: {
      power: new Decimal(10),
      amounts: [0, 0, 0, 0],
      prices: [new Decimal(10), new Decimal(100), new Decimal(1e4), new Decimal(1e7)],
      empowered: [0, 0, 0, 0]
    },
    upgrades: [],
    upgradePrices: [],
  };
}

let player = getDefaultPlayer();

function update(get, set) {
	document.getElementById(get).innerHTML=set;
}

function gameCycle(time) {
  getProduction(time);
  update();
}

function getProduction(time) {
  while(time>0) {
    for(let i=player.producers.length-1;i>=0;i--) {
      if(i==0) {
        player.producers.power = player.producers.power.plus(
          player.producers.amounts[0].times(
            player.producers.empowered[0])
          .times(0.1));
        time-=100;
      }
      else {
        player.producers.amounts[i-1] = player.producers.amount.plus(
          player.producers.amounts[i].times(
            player.producers.empowered[i])
          .times(0.1));
      }
    }
  }
}
