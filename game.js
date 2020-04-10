function $(x) {return document.getElementById(x)}

function getDefaultPlayer() {
  return {
    energy: new Decimal(4),
    power: new Decimal(0),
    generators: {amount: [new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0)],
		 purchased: [new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0)],
                 boost: [new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1)],
		 price: [new Decimal(10), new Decimal(100), new Decimal(1e4), new Decimal(1e8)],
                },
    crystals: new Decimal(0),
    upgrades: {
      prices: [new Decimal(0)],
      purchased: [new Decimal(0)],
      increase: [new Decimal(0)],
      scaling: [new Decimal(0)],
    },
    clicked: {
      start: false, showEnergy: false, showQuests: false, showPower: false, showGenerators: false, mainDeparture: false, showCrystals: false, 
      showUpgrades: false, generatorsDeparture: false, questDeparture: false,},
    storySeen: 0,
    zones: ["upgrades","generators","main","prestige"],
    lastTick = new Date().getTime();
  };
}

var player = getDefaultPlayer();

function gameCycle() {
	let now = new Date().getTime();
	let diff = now - player.lastTick;
	player.generators.amount[2] = player.generators.amount[2].plus(player.generators.amount[3].times(player.generators.boost[3].times(0.01)));
	player.generators.amount[1] = player.generators.amount[1].plus(player.generators.amount[2].times(player.generators.boost[2].times(0.01)));
	player.generators.amount[0] = player.generators.amount[0].plus(player.generators.amount[1].times(player.generators.boost[1].times(0.01)));
	player.power = player.power.plus(player.generators.amount[0].times(player.generators.boost[0].times(0.01)));
  player.lastTick = now;
  updateAll();
}

function updateAll() {
	$("currentEnergy").textContent = display(player.energy);
	$("currentPower").textContent = display(player.power);
	$("currentCrystals").textContent = display(player.crystals);
	for(i=1;i<5;i++){
		$("gen"+i+"Purchased").textContent = display(player.generators.purchased[i-1]);
		$("gen"+i+"Price").textContent = display(player.generators.price[i-1]);
		$("gen"+i+"Amount").textContent = display(player.generators.amount[i-1]);
		$("generation"+i).textContent = display(player.generators.amount[i-1].times(player.generators.bonus[i-1]));
	}
}

function checkButton(x) {
  if(player.clicked[x]){
    return false;
  } else{
    player.clicked[x] = true;
    return true;
  }
}

function press(id) {
  switch(id) {
    case "start":
      if(!player.clicked.start&&player.energy.gt(0)){
        fadeIn('showEnergy');
        $("showEnergy").classList.add("unlocked");
        player.clicked.start = true;
        player.energy = player.energy.minus(1);
      }
      break;
    case "showEnergy":
      if(!player.clicked.showEnergy&&player.energy.gt(0)){
        fadeIn('energyArea');
        fadeIn('showQuests');
        $("showQuests").classList.add("unlocked");
        player.clicked.showEnergy = true;
        player.energy = player.energy.minus(1);
      }
      break;
    case "showQuests":
      if(!player.clicked.showQuests&&player.energy.gt(0)){
        fadeIn('showPower');
        fadeIn('mainDepartureD');
        $("showPower").classList.add("unlocked");
        $("mainDepartureD").classList.add("unlocked");
        if($("showUpgrades").classList.contains("unlocked")) fadeIn('showUpgrades');
        if($("showCrystals").classList.contains("unlocked")) fadeIn('showCrystals');
        player.clicked.showQuests = true;
        player.energy = player.energy.minus(1);
      }
      break;
    case "showPower":
      if(!player.clicked.showPower&&player.energy.gt(0)){
        fadeIn('powerArea');
        fadeIn('showGenerators');
        $("showGenerators").classList.add("unlocked");        
        player.clicked.showPower = true;
        player.energy = player.energy.minus(1);
      }
      break;
    case "showGenerators":
      if(!player.clicked.showGenerators&&player.energy.gt(0)){
        fadeIn('mainDepartureL');
        $("mainDepartureL").classList.add("unlocked");
        player.clicked.showGenerators = true;
        player.energy = player.energy.minus(1);
      }
      break;
    case "mainDepartureL":
      if(!player.clicked.mainDeparture){
        moveFrom('main','generators');
        player.clicked.mainDeparture = true;
        player.clicked.generatorsDepartureR = false;
      }
      break;
    case "showCrystals":
      if(!player.clicked.showCrystals&&player.energy.gt(0)){
        fadeIn('crystalArea');
        player.clicked.showCrystals = true;
        player.energy = player.energy.minus(1);
      }
      break;
    case "showUpgrades":
      if(!player.clicked.showUpgrades&&player.energy.gt(0)){
        fadeIn('mainDepartureR');
        $("mainDepartureR").classList.add("unlocked");
        player.clicked.showUpgrades = true;
        player.energy = player.energy.minus(1);
      }
      break;
    case "mainDepartureR":
      if(!player.clicked.mainDeparture){
        moveFrom('main','upgrades');
        player.clicked.mainDeparture = true;
        player.clicked.upgradesDeparture = false;
      }
      break;
    case "generatorsDepartureR":
      if(!player.clicked.generatorsDeparture){
        moveFrom('generators','main');
        player.clicked.generatorsDeparture = true;
        player.clicked.mainDeparture = false;
      }
      break;
    case "mainDepartureD":
      if(!player.clicked.mainDeparture){
        moveFrom('main','quest');
        player.clicked.mainDeparture = true;
        player.clicked.questDeparture = false;
      }
      break;
    case "questDepartureU":
      if(!player.clicked.questDeparture){
        moveFrom('quest','main')
        player.clicked.questDeparture = true;
        player.clicked.mainDeparture = false;
      }
      break;
  }
}

function moveFrom(place,des) {
  let index = player.zones.indexOf(place);
  var dest = "unlocked "+des;
  var orig = "unlocked "+place;
  let toHide = document.getElementsByClassName(orig);
  fadeOutAll(toHide);
  let toShow = document.getElementsByClassName(dest);
  fadeInAll(toShow);
  let allTravel = document.getElementsByClassName("travel");
  for(i=0;i<allTravel.length;i++){
    let id = des+"Departure";
    if(allTravel[i].classList.contains(des)) player.clicked[id] = false;
    else player.clicked[id] = true;
  }      
}

function fadeIn(x) {
  let elem = $(x);
  elem.style.setProperty("z-index",parseInt(elem.style.zIndex)+10);
  let op = 0;
  var fade = setInterval(function() {
    op += 0.02;
    elem.style.setProperty("opacity", op);
    if(op>= 1) clearInterval(fade);
  }, 10);
}

function fadeInAll(set) {
  let op = 0;
  for(i=0;i<set.length;i++){
    let elem = set.item(i);
    elem.style.setProperty("z-index",parseInt(elem.style.zIndex)+10);
  }
  var fade = setInterval(function() {
    op += 0.02;
    for(i=0;i<set.length;i++){
      let elem = set.item(i);
      elem.style.setProperty("opacity", op);
    }
    if(set.item(set.length-1).style.opacity >= 1) clearInterval(fade);
  }, 10);
}

function fadeOut(x) {
  let op = 1;
  let elem = $(x);
  elem.style.setProperty("z-index",parseInt(elem.style.zIndex)-10);
  var fade = setInterval(function() {
    op -= 0.02;
    elem.style.setProperty("opacity", op);
    if(op<= 0) clearInterval(fade);
  }, 10);
}

function fadeOutAll(set) {
  let op = 1;
  for(i=0;i<set.length;i++){
    let elem = set.item(i);
    elem.style.setProperty("z-index",parseInt(elem.style.zIndex)-10);
  }
  var fade = setInterval(function() {
    op -= 0.02;
    for(i=0;i<set.length;i++){
      let elem = set.item(i);
      elem.style.setProperty("opacity", op);
    }
    if(set.item(set.length-1).style.opacity <= 0) clearInterval(fade);
  }, 10);
}

function initializeGrid() {
  for(i=1;i<8;i++){
    for(j=1;j<8;j++){
      let ii=i+1;
      let jj=j+1;
      var newSpan = document.createElement('span');
      newSpan.style="display:grid;grid-column:"+i+"/"+ii+";grid-row:"+j+"/"+jj;
      newSpan.class="blank";
      newSpan.id="blank"+i+j;
      $('gameSpace').appendChild(newSpan);
    }
  }
}

function beginination() {
  initializeGrid();
	setInterval(gameCycle, 10);
	setInterval(save, 30000);
}

function checkKey(event) {
}

function purchase(item) {
}

function genBoost() {
}

function bank(amount, index) {
}

function bankBoost() {
}
