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
  var fade = setInterval(function() {
    $(x).style.opacity = window.getComputedStyle(x).opacity += 0.02;
    if(x.style.opacity == 1) clearInterval(fade);
  }, 10);
}

function fadeInAll(set) {
  var fade = setInterval(function() {
    for(i=0;i<set.length;i++){
      set.item[i].style.opacity = window.getComputedStyle(set.item[i]).opacity += 0.02;
    }
    if(set.item[set.length-1].style.opacity == 1) clearInterval(fade);
  }, 10);
}

function fadeOut(x) {
  var fade = setInterval(function() {
    $(x).style.opacity = window.getComputedStyle(x).opacity -= 0.02;
    if(x.style.opacity == 1) clearInterval(fade);
  }, 10);
}

function fadeOutAll(set) {
  var fade = setInterval(function() {
    for(i=0;i<set.length;i++){
      set.item[i].style.opacity = window.getComputedStyle(set.item[i]).opacity -= 0.02;
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
