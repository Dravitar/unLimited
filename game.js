function $(x) {return document.getElementById(x);}

function display(x) {return x.toPrecision(4);}

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

var visibilityArrayForLoading = [];

var player = getDefaultPlayer();

function gameCycle() {
	let now = new Date().getTime();
	let diff = (now - player.lastTick)/10;
	player.generators.amount[2] = player.generators.amount[2].plus(player.generators.amount[3].times(player.generators.boost[3].times(0.01).times(diff)));
	player.generators.amount[1] = player.generators.amount[1].plus(player.generators.amount[2].times(player.generators.boost[2].times(0.01).times(diff)));
	player.generators.amount[0] = player.generators.amount[0].plus(player.generators.amount[1].times(player.generators.boost[1].times(0.01).times(diff)));
	player.power = player.power.plus(player.generators.amount[0].times(player.generators.boost[0].times(0.01).times(diff)));
	player.lastTick = now;
	updateAll();
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

function grow(item) {
	let id = item+"Section";
	if($(id).style.zIndex == 23) $(id).style.zIndex = 3;
	else $(id).style.zIndex = 23;
	$(id).classList.toggle("expandButton");
	$(id).classList.toggle(item+"ExpandButton");
	$(id).classList.toggle("expandButtonActive");
	$(id).classList.toggle(item+"ExpandButtonActive");
	let list = document.getElementsByClassName(item);
	var big;
	list[0].style.display=="none" ? big=false : big=true;
	if(!big){
		setTimeout(function() {
			for(i=0;i<list.length;i++) list[i].style.display = "block";
		}, 1750);
	}
	else if(big) for(i=0;i<list.length;i++) list[i].style.display = "none";
}

function updateAll() {
	$("currentEnergy").textContent = display(player.energy);
	$("currentPower").textContent = display(player.power);
	$("currentCrystals").textContent = display(player.crystals);
	for(i=1;i<5;i++){
		if(player.power.lt(player.generators.price[i-1])) $("genPurchase"+i).color = "darkGrey";
		else $("genPurchase"+i).color = "grey";
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
	if(!player.quests[4]&&player.power.gte(1e8)){
		if($("quest5").classList.contains("unsolved")){
			$("quest5").classList.add("solved");
			$("quest5").classList.remove("unsolved");
		}
	}
}

function beginination() {
	initializeGrid();
	load();
	setInterval(gameCycle, 10);
	setInterval(save(), 30000);
}

function save() {
	document.querySelectorAll('body *').forEach(function(node) {
		let individualArray = [];
		if(node.classList.contains("main")||
		   node.classList.contains("display")||
		   node.classList.contains("upgrades")||
		   node.classList.contains("generators")||
		   node.classList.contains("quest")){
			individualArray.push(node.id);
			if(node.classList.contains("unlocked")) individualArray.push(true);
			else individualArray.push(false);
			if(node.style.opacity>0.5) individualArray.push(true);
			else individualArray.push(false);
			visibilityArrayForLoading.push(individualArray);
		}
	});
	localStorage.setItem("unLimitedButtonVis", btoa(JSON.stringify(visibilityArrayForLoading)));
	saveGame();
	event.stopPropagation();
	console.log("Game saved");
}
						    
function load() {
	if(localStorage.getItem("unLimitedSave") !== null) loadGame(localStorage.getItem("unLimitedSave"));
	if(localStorage.getItem("unLimitedButtonVis") !== null) visibilityArrayForLoading = JSON.parse(atob(localStorage.getItem("unLimitedButtonVis")));
	if(visibilityArrayForLoading[0]!=null){
		for(i=0;i<visibilityArrayForLoading.length;i++){
			let individualArray = visibilityArrayForLoading[i];
			console.log(individualArray);
			let id = individualArray[0];
			if(individualArray[1]) $(id).classList.add("unlocked");
			else if($(id).classList.contains("unlocked")) $(id).classList.remove("unlocked");
			if(individualArray[2]) fadeIn(id);
			else if($(id).style.opacity>0.5) fadeOut(id);
		}
		visibilityArrayForLoading = [];
	}
	//event.stopPropagation();
	return player;
}

function clearSave(){
	if(confirm("Do you really want to delete your save?\nThis cannot be undone.")){
		player = getDefaultPlayer();
		updateAll();
		localStorage.removeItem("unLimitedSave");
	}
	event.stopPropagation();
}

function checkKey(event) {
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
