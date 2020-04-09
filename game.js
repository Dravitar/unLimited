function $(x) {return document.getElementById(x)}

function getDefaultPlayer() {
  return {
    energy: new Decimal(4),
    power: new Decimal(0),
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
  };
}

var player = getDefaultPlayer();

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
      if(!player.clicked.start){
        fadeIn('showEnergy');
        $("showEnergy").classList.add("unlocked");
        player.clicked.start = true;
      }
      break;
    case "showEnergy":
      if(!player.clicked.showEnergy){
        fadeIn('energyArea');
        fadeIn('showQuests');
        $("showQuests").classList.add("unlocked");
        player.clicked.showEnergy = true;
      }
      break;
    case "showQuests":
      if(!player.clicked.showQuests){
        fadeIn('showPower');
        fadeIn('mainDepartureD');
        $("showPower").classList.add("unlocked");
        $("mainDepartureD").classList.add("unlocked");
        if($("showUpgrades").classList.contains("unlocked")) fadeIn('showUpgrades');
        if($("showCrystals").classList.contains("unlocked")) fadeIn('showCrystals');
        player.clicked.showQuests = true;
      }
      break;
    case "showPower":
      if(!player.clicked.showPower){
        fadeIn('powerArea');
        fadeIn('showGenerators');
        $("showGenerators").classList.add("unlocked");        
        player.clicked.showPower = true;
      }
      break;
    case "showGenerators":
      if(!player.clicked.showGenerators){
        fadeIn('mainDepartureL');
        $("mainDepartureL").classList.add("unlocked");
        player.clicked.showGenerators = true;
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
      if(!player.clicked.showCrystals){
        fadeIn('crystalArea');
        player.clicked.showCrystals = true;
      }
      break;
    case "showUpgrades":
      if(!player.clicked.showUpgrades){
        fadeIn('mainDepartureR');
        $("mainDepartureR").classList.add("unlocked");
        player.clicked.showUpgrades = true;
      }
      break;
    case "mainDepartureR":
      if(!player.clicked.mainDeparture){
        moveFrom('main','upgrades');
        player.clicked.mainDeparture = true;
      }
      break;
    case "generatorsDepartureR":
      if(!player.clicked.generatorsDepartureR){
        moveFrom('generators','main');
        player.clicked.generatorsDepartureR = true;
      }
      break;
    case "mainDepartureD":
      if(!player.clicked.mainDepartureD){
        moveFrom('main','quest');
        player.clicked.mainDepartureD = true;
      }
      break;
    case "questDepartureU":
      if(!player.clicked.questDeparture){
        moveFrom('quest','main')
        player.clicked.generators
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
      newSpan.textContent = newSpan.zIndex;
      $('gameSpace').appendChild(newSpan);
    }
  }
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
