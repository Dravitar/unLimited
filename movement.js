function moveFrom(place,des) {
  player.currentZone = des;
  var dest = "unlocked "+des;
  var orig = "unlocked "+place;
  let toHide = document.getElementsByClassName(orig);
  fadeOutAll(toHide);
  let toShow = document.getElementsByClassName(dest);
  setTimeout(fadeInAll(toShow), 1000);
  let allTravel = document.getElementsByClassName("travel");
  for(i=0;i<allTravel.length;i++){
    let id = des+"Departure";
    if(allTravel[i].classList.contains(des)) player.clicked[id] = false;
    else player.clicked[id] = true;
  }      
}

function fadeIn(x) {
  let elem = $(x);
  if(elem.classList.contains("unlocked")){
    if(player.automating){
     if(x=="automationScreen"||elem.classList.contains("travel")){
       elem.style.setProperty("z-index",parseInt(elem.style.zIndex)+50);
     }
     else elem.style.setProperty("z-index",parseInt(elem.style.zIndex)+10)
    }
    else elem.style.setProperty("z-index",parseInt(elem.style.zIndex)+10);
    let op = 0;
    let max = 1;
    if(x=="automationScreen") max = 0.2;
    var fade = setInterval(function() {
      op += 0.02;
      elem.style.setProperty("opacity", op);
      if(op>= max){
        elem.style.setProperty("opacity", max);
        clearInterval(fade);
      }
    }, 10);
  }
}
function fadeInAll(set) {
  let op = 0;
  for(i=0;i<set.length;i++){
    let elem = set.item(i);
    if(player.automating){
      if(elem.classList.contains("travel")) elem.style.setProperty("z-index",parseInt(elem.style.zIndex)+50);
      else elem.style.setProperty("z-index",parseInt(elem.style.zIndex)+10);
    }
    else elem.style.setProperty("z-index",parseInt(elem.style.zIndex)+10);
  }
  var fade = setInterval(function() {
    op += 0.02;
    for(i=0;i<set.length;i++){
      let elem = set.item(i);
      if(op>=1) elem.style.setProperty("opacity", 1);
      else elem.style.setProperty("opacity", op);
    }
    if(set.item(set.length-1).style.opacity >= 1) clearInterval(fade);
  }, 10);
}

function fadeOut(x) {
  let op = 1;
  let elem = $(x);
  if(player.automating){
    if(x=="automationScreen"||elem.classList.contains("travel")){
      elem.style.setProperty("z-index",parseInt(elem.style.zIndex)-50);
    }
    else elem.style.setProperty("z-index",parseInt(elem.style.zIndex)-10);
  } else elem.style.setProperty("z-index",parseInt(elem.style.zIndex)-10);
  var fade = setInterval(function() {
    op -= 0.02;
    elem.style.setProperty("opacity", op);
    if(op<= 0){
      elem.style.setProperty("opacity", 0);
      clearInterval(fade);
    }
  }, 10);
}

function fadeOutAll(set) {
  let op = 1;
  for(i=0;i<set.length;i++){
    let elem = set.item(i);
    if(player.automating){
      if(elem.classList.contains("travel")) elem.style.setProperty("z-index",parseInt(elem.style.zIndex)-50);
      else elem.style.setProperty("z-index",parseInt(elem.style.zIndex)-10);
    }
    else elem.style.setProperty("z-index",parseInt(elem.style.zIndex)-10);
  }
  var fade = setInterval(function() {
    op -= 0.02;
    for(i=0;i<set.length;i++){
      let elem = set.item(i);
      if(op<=0) elem.style.setProperty("opacity", 0);
      else elem.style.setProperty("opacity", op);
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
