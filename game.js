function getDefaultPlayer() {
  return {
    clicks: 12,
    buttons: {
      unlocked: [""],
      requirements: {
        power: [[0], [0], [1e4, 0, 1e12]],
        buttons: [[""], ["00"], ["10", "10", "10"]]
      },
      unlocks: [["10"], ["20", "21", "22"], ["", "", ""]],
      texts: [
        ["Start"],
        ["Show Clicks"]
        ["Show Upgrades",
         "Show Producers",
         "Show Prestige"]
      ]
    },
    producers: {
      power: 0,
      amounts: [0, 0, 0, 0],
      prices: [10, 100, 1e4, 1e7],
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

function addElement(parentId, elementTag, elementId, html) {
  // Adds an element to the document
  var p = document.getElementById(parentId);
  var newElement = document.createElement(elementTag);
  newElement.setAttribute('id', elementId);
  newElement.innerHTML = html;
  p.appendChild(newElement);
}
