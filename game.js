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
    storySeen: 0,
    zones: ["upgrades","generators","main","prestige"],
  };
}

var player = getDefaultPlayer();

function moveFrom(orig,dir) {
  let index = player.zones.indexOf(orig);
  var dest;
  if(dir=="l") dest = player.zones[index-1];
  else if(dir=="r") dest = player.zones[index+1];
  let toHide = document.getElementsByClassName(orig);
  fadeOutAll(toHide);
  let toShow = document.getElementsByClassName(dest);
  fadeInAll(toShow);
}

function fadeIn(x) {
  let elem = $(x);
  elem.style.setProperty("z-index",parseInt(elem.style.zindex())+10);
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
    let elem = set.item[i];
    elem.style.setProperty("z-index",parseInt(elem.style.zindex())+10);
  }
  var fade = setInterval(function() {
    op += 0.02;
    for(i=0;i<set.length;i++){
      let elem = set.item[i];
      elem.style.setProperty("opacity", op);
    }
    if(set.item[set.length-1].style.opacity == 1) clearInterval(fade);
  }, 10);
}

function fadeOut(x) {
  let op = 1;
  let elem = $(x);
  elem.style.setProperty("z-index",parseInt(elem.style.zindex())-10);
  var fade = setInterval(function() {
    op -= 0.02;
    elem.style.setProperty("opacity", op);
    if(op>= 1) clearInterval(fade);
  }, 10);
}

function fadeOutAll(set) {
  let op = 1;
  for(i=0;i<set.length;i++){
    let elem = set.item[i];
    elem.style.setProperty("z-index",parseInt(elem.style.zindex())-10);
  }
  var fade = setInterval(function() {
    op -= 0.02;
    for(i=0;i<set.length;i++){
      let elem = set.item[i];
      elem.style.setProperty("opacity", op);
    }
    if(set.item[set.length-1].style.opacity == 1) clearInterval(fade);
  }, 10);
}

function initializeGrid() {
  for(i=1;i<8;i++){
    for(j=1;j<8;j++){
      if(i==4&&j==6){
        continue;
      } else {
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
