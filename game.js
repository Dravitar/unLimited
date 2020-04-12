function $(x) {return document.getElementById(x)}

function getDefaultPlayer() {
  return {
    energy: new Decimal(4),
    power: new Decimal(10),
    generators: {
      amount: [new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0)],
      purchased: [new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0)],
      boost: [new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1)],
      price: [new Decimal(10), new Decimal(100), new Decimal(1e4), new Decimal(1e8)],
      increase: [new Decimal(1.3), new Decimal(1.5), new Decimal(1.7), new Decimal(1.9),],
      scaling: [new Decimal(1.03), new Decimal(1.05), new Decimal(1.07), new Decimal(1.09),],
    },
    crystals: new Decimal(0),
    upgrades: {
      price: [new Decimal(0)],
      purchased: [new Decimal(0)],
      increase: [new Decimal(0)],
      scaling: [new Decimal(0)],
    },
    clicked: {
      start: false, showEnergy: false, showQuests: false, showPower: false, showGenerators: false, mainDeparture: false, showCrystals: false, 
      showUpgrades: false, generatorsDeparture: false, questDeparture: false,},
    quests: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
    columns: [false, false, false, false, false],
    storySeen: 0,
    curentZone: "main",
    lastTick: new Date().getTime(),
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

function display(x) {
	return x.toPrecision(4)
}

function updateAll() {
	$("currentEnergy").textContent = display(player.energy);
	$("currentPower").textContent = display(player.power);
	$("currentCrystals").textContent = display(player.crystals);
	for(i=1;i<5;i++){
		$("gen"+i+"Purchased").textContent = display(player.generators.purchased[i-1]);
		$("gen"+i+"Price").textContent = display(player.generators.price[i-1]);
		$("genAmount"+i).textContent = display(player.generators.amount[i-1]);
		$("generation"+i).textContent = display(player.generators.amount[i-1].times(player.generators.boost[i-1]));
	}
  if(!player.quests[3]&&player.power.gte(1000)){    
    if($("quest4").classList.contains("unsolved")){
      $("quest4").classList.add("solved");
      $("quest4").classList.remove("unsolved");
    }
  }
}

function checkZero() {  
  if(player.energy.equals(0)&&$("reset").style.zIndex<10){
    fadeOut("energyArea");
    fadeIn("reset");
    if($("quest2").classList.contains("unsolved")){
      $("quest2").classList.add("solved");
      $("quest2").classList.remove("unsolved");
    }
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
	if(player.energy.gt(0)){
		switch(id) {
    case "start":
      if(!player.clicked.start&&){
        fadeIn('showEnergy');
        $("showEnergy").classList.add("unlocked");
        player.clicked.start = true;
        player.energy = player.energy.minus(1);
        if($("quest1").classList.contains("unsolved")){
          $("quest1").classList.add("solved");
          $("quest1").classList.remove("unsolved");
        }
      }
      break;
    case "showEnergy":
      if(!player.clicked.showEnergy&&player.clicked.start){
        fadeIn('energyArea');
        $("energyArea").classList.add("unlocked");
        fadeIn('showQuests');
        $("showQuests").classList.add("unlocked");
        fadeIn("dumpEnergy");
        $("dumpEnergy").classList.add("unlocked");
        player.clicked.showEnergy = true;
        player.energy = player.energy.minus(1);
      }
      break;
    case "showQuests":
      if(!player.clicked.showQuests&&player.clicked.showEnergy){
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
      if(!player.clicked.showPower&&player.clicked.showQuests){
        fadeIn('powerArea');
        $("powerArea").classList.add("unlocked");
        fadeIn('showGenerators');
        $("showGenerators").classList.add("unlocked");        
        player.clicked.showPower = true;
        player.energy = player.energy.minus(1);
      }
      break;
    case "showGenerators":
      if(!player.clicked.showGenerators&&player.clicked.showPower){
        fadeIn('mainDepartureL');
        $("mainDepartureL").classList.add("unlocked");
        player.clicked.showGenerators = true;
        player.energy = player.energy.minus(1);
        if($("quest3").classList.contains("unsolved")){
          $("quest3").classList.add("solved");
          $("quest3").classList.remove("unsolved");
        }
      }
      break;
    case "mainDepartureL":
      if(!player.clicked.mainDeparture&&player.clicked.showGenerators){
        moveFrom('main','generators');
        player.clicked.mainDeparture = true;
        player.clicked.generatorsDepartureR = false;
      }
      break;
    case "showCrystals":
      if(!player.clicked.showCrystals&&player.clicked.showQuests){
        fadeIn('crystalArea');
        player.clicked.showCrystals = true;
        player.energy = player.energy.minus(1);
      }
      break;
    case "showUpgrades":
      if(!player.clicked.showUpgrades&&player.clicked.showCrystals){
        fadeIn('mainDepartureR');
        $("mainDepartureR").classList.add("unlocked");
        player.clicked.showUpgrades = true;
        player.energy = player.energy.minus(1);
      }
      break;
    case "mainDepartureR":
      if(!player.clicked.mainDeparture&&player.clicked.showUpgrades){
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
  checkZero();
}

function claimQuest(num) {
	if($("quest"+num).classList.contains("solved")) {
    $("quest"+num).classList.add("claimed");
    $("quest"+num).classList.remove("solved");
    player.quests[num-1] = true;
  }
  var set = Math.floor((num-1)/4);
  check = true;
  for(i=set;i<set+4;i++){
    if(!player.quests[i]) check = false;
  }
  if(check) {
    var nuum = set+1;
    $("columnReward"+nuum).classList.add("solved");
    $("columnReward"+nuum).classList.remove("unsolved");
  }
}

function claimColumn(num) {
  if($("columnReward"+num).classList.contains("solved")){
    $("columnReward"+num).classList.remove("solved");
    $("columnReward"+num).classList.add("claimed");
    player.columns[num-1] = true;
  }
}

function moveFrom(place,des) {
  player.currentZone = des;
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
	//setInterval(save, 30000);
}

function checkKey(event) {
}

function purchaseGen(item) {
	if(player.power.gte(player.generators.price[item-1])&&player.energy.gt(0)){
    if(player.columns[0]) player.generators.boost[item-1] = player.generators.boost[item-1].times(1.1);
		player.generators.purchased[item-1] = player.generators.purchased[item-1].plus(1);
		player.generators.amount[item-1] = player.generators.amount[item-1].plus(1);
		player.power = player.power.minus(player.generators.price[item-1]);
		if(player.generators.purchased[item-1].gte(Decimal.div(40,item).floor())){
			player.generators.price[item-1] = player.generators[item-1].times(player.generators.scaling[item-1]);
		}
		player.generators.price[item-1] = player.generators.price[item-1].times(player.generators.increase[item-1]);
		player.energy = player.energy.minus(1);
	}
  checkZero();
}

function reset() {
  let good = true;
  if(!player.energy.equals(0)){
    if(!confirm("You still have energy remaining. Do you want to reset?")) good = false;
  }
  if(good){
    player.power = new Decimal(10);
    let energy = new Decimal(3);
    for(i=0;i<player.quests.length;i++){
      switch(i) {
        case 0:
        case 1:
          if(player.quests[i]) energy = energy.plus(2);
          break;
        case 2:
        case 3:
        case 4:
          if(player.quests[i]) energy = energy.plus(3);
          break;
        case 5:
        case 6:
        case 7:
          if(player.quests[i]) energy = energy.plus(4);
          break;
        default:
          break;
      }
    }
    player.energy = energy;
    player.generators = getDefaultPlayer().generators;
    player.clicked = getDefaultPlayer().clicked;
    var orig = "unlocked "+player.currentZone;
    let toHide = document.getElementsByClassName(orig);
    fadeOutAll(toHide);
    fadeOut("reset");
    fadeOut("energyArea");
    if($("powerArea").classList.contains("unlocked")) fadeOut("powerArea");
    if($("crystalArea").classList.contains("unlocked")) fadeOut("crystalArea");
    fadeIn("start");
    updateAll();
  }
}

function genBoost() {
}

function bank(amount, index) {
}

function bankBoost() {
}
