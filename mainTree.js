let texts = {
  10: '<div id="treeButtonDiv'+10+'"><button id="treeButton'+10+
  '" class="treeButton" onclick="treePress('+1+',0)">'+'Show Clicks'+'</button></div>',
  20: '<div id="treeButtonDiv'+20+'"><button id="treeButton'+20+
  '" class="treeButton" onclick="treePress('+2+',0)">'+'Show Upgrades'+'</button></div>',
  21: '<div id="treeButtonDiv'+21+'"><button id="treeButton'+21+
  '" class="treeButton" onclick="treePress('+'2,1'+')">'+'Show Clicks'+'</button></div>',
  22: '<div id="treeButtonDiv'+22+'"><button id="treeButton'+22+
  '" class="treeButton" onclick="treePress('+'2,2'+')">'+'Show Prestige'+'</button></div>',
}

function addElement(parentId, elementTag, elementId, html) {
  // Adds an element to the document
  var p = document.getElementById(parentId);
  var newElement = document.createElement(elementTag);
  newElement.setAttribute('id', elementId);
  newElement.innerHTML = html;
  p.appendChild(newElement);
}

function treePress(index, subindex) {
  if(player.clicks>0) {
    if(player.producers.power.gte(player.buttons.requirements.power[index][subindex])&&
       player.buttons.unlocked.includes(player.buttons.requirements.buttons[index][subindex])) {
      player.clicks--;
      for(let i in player.buttons.unlocks[index][subindex]) {
        addElement("mainTree", "div", "treeButtonDiv"+i, texts[i]);
      }
    }
  }
}
        
