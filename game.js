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
      start: false, showEnergy: false, showPower: false, showGenerators: false, mainDepartureL: false, showCrystals: false, 
      showUpgrades: false, mainDepartureR: false, generatorsDepartureR: false,},
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
        fadeIn('showPower');
        $("showPower").classList.add("unlocked");
        player.clicked.showEnergy = true;
      }
      break;
    case "showPower":
      if(!player.clicked.showPower){
        fadeIn('powerArea');
        fadeIn('showGenerators');
        $("showGenerators").classList.add("unlocked");
        if($("showUpgrades").classList.contains("unlocked")) fadeIn('showUpgrades');
        if($("showCrystals").classList.contains("unlocked")) fadeIn('showCrystals');
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
      if(!player.clicked.mainDepartureL){
        moveFrom('main','l');
        player.clicked.mainDepartureL = true;
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
      if(!player.clicked.mainDepartureR){
        moveFrom('main','r');
        player.clicked.mainDepartureR = true;
      }
      break;
    case "generatorsDepartureR":
      if(!player.clicked.generatorsDepartureR){
        moveFrom('generators','r');
        player.clicked.generatorsDepartureR = true;
        player.clicked.mainDepartureR = false;
        player.clicked.mainDepartureL = false;
      }
      break;
  }
}

function moveFrom(place,dir) {
  let index = player.zones.indexOf(orig);
  var dest = "unlocked ";
  var orig = "unlocked "+place;
  if(dir=="l") dest += player.zones[index-1];
  else if(dir=="r") dest += player.zones[index+1];
  let toHide = document.getElementsByClassName(orig);
  fadeOutAll(toHide);
  let toShow = document.getElementsByClassName(dest);
  fadeInAll(toShow);
  let left = dest + "DepartureL";
  let right = dest + "DepartureR";
  player.clicked[left] = false;
  player.clicked[right] = false;
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
