function $(x) {return document.getElementById(x);} //Shortening function. Easier to type $ than all that.

function display(x) {return x.toPrecision(4);} //Will be replaced with more in-depth display if possible.

function removeClass(item, itemClass){
	if($(item).classList.contains(itemClass)) $(item).classList.remove(itemClass);
}

function addClass(item, itemClass){
	if(!$(item).classList.contains(itemClass)) $(item).classList.add(itemClass);
}

function hideStory(){
	if($("storyScreen").style.opacity == 1) fadeOut("storyScreen");
	if(player.storySeen==3){
		setTimeout(function() {
			$("storyScreen").textContent = story3_2;
			if($("storyScreen").style.opacity != 1) fadeIn("storyScreen");
			player.storySeen++;
			return;
		}, 1000);
	}
	if(player.storySeen==4){
		setTimeout(function() {
			$("storyScreen").textContent = story3_3;
			if($("storyScreen").style.opacity != 1) fadeIn("storyScreen");
			player.storySeen++;
			return;
		}, 1000);
	}
}

function getDefaultPlayer() { //Initial Player State
	return {
		energy: new Decimal(4), //Enough energy to trigger the first two quests
		energySpent: new Decimal(0),
		power: new Decimal(10), //Enough power to buy one generator
		generators: { //Generator statistics and pricing
			amount: [new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0)],
			purchased: [new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0)],
			boost: [new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1)],
			price: [new Decimal(10), new Decimal(100), new Decimal(1e4), new Decimal(1e8)],
			increase: [new Decimal(1.3), new Decimal(1.5), new Decimal(1.7), new Decimal(1.9),],
			scaling: [new Decimal(1.03), new Decimal(1.05), new Decimal(1.07), new Decimal(1.09),],
		},	//V Energy banked.V
		banks: [new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0)],
		generatorBoost: new Decimal(1),
		generatorPurchasers: {
			amount: [new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0)],
			purchased: [new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0)],
			boost: [new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1)],
			energyPrice: [new Decimal(5), new Decimal(10), new Decimal(15), new Decimal(20)],
			price: [new Decimal(1e10), new Decimal(1e20), new Decimal(1e30), new Decimal(1e50)],
			increase: [new Decimal(100), new Decimal(1e4), new Decimal(1e8), new Decimal(1e16)],
		},
		isGenRunning: false,
		crystals: new Decimal(0), // Used to purchase upgrades
		upgrades: { //All upgrades so far
			bankUnlock: {id: "bankUnlockUpgrade", price: new Decimal(1), purchased: new Decimal(0), increase: new Decimal(1), scaling: new Decimal(1), max: new Decimal(4)},
			crystalPowerup: {id: "crystalPowerupUpgrade", price: new Decimal(5), purchased: new Decimal(0), increase: new Decimal(1), scaling: new Decimal(1), max: new Decimal(1)},
			generatorBoost: {id: "generatorBoostUpgrade", price: new Decimal(10), purchased: new Decimal(0), increase: new Decimal(1), scaling: new Decimal(1), max: new Decimal(1)},
			bankPowerup: {id: "bankPowerupUpgrade", price: new Decimal(20), purchased: new Decimal(0), increase: new Decimal(3.75), scaling: new Decimal(1.05), max: new Decimal(1000)},
			freeGenerators: {id: "freeGeneratorsUpgrade", price: new Decimal(25), purchased: new Decimal(0), increase: new Decimal(4.25), scaling: new Decimal(1.1), max: new Decimal(4)},
			keepGenBoost: {id: "keepGenBoostUpgrade", price: new Decimal(100), purchased: new Decimal(0), increase: new Decimal(1), scaling: new Decimal(1), max: new Decimal(1)},
			bankResetBoost: {id: "bankResetBoostUpgrade", price: new Decimal(200), purchased: new Decimal(0), increase: new Decimal(1), scaling: new Decimal(1), max: new Decimal(1)},
			generatorSpreadBoost: {id: "generatorSpreadBoostUpgrade", price: new Decimal(250), purchased: new Decimal(0), increase: new Decimal(1), scaling: new Decimal(1), max: new Decimal(1)},
			purchaserUnlock: {id: "purchaserUnlockUpgrade", price: new Decimal(500), purchased: new Decimal(0), increase: new Decimal(1), scaling: new Decimal(1), max: new Decimal(4)},
		},
		validResets: new Decimal(0),
		clicked: { //Used to determine order of stuff appearing
			start: false, showEnergy: false, showQuests: false, showPower: false, showGenerators: false, mainDeparture: false, showCrystals: false, 
			showUpgrades: false, generatorsDeparture: false, questDeparture: false,},
			//Quests quests quests.
		quests: [false, false, false, false, false, false, false, false, false, false, false, false,],
		columns: [false, false, false,], //Also technically quests
		storySeen: 0, //How much of the story you have seen so far
		currentZone: "main", //Used to return the right screen on reload
		recording: false,
		automating: false,
		automationArray: [],
		automationLength: new Decimal(0),
		automationCrystals: new Decimal(0),
		automationRatio: new Decimal(0),
		lastAutomationAction: new Date().getTime(),
		lastTick: new Date().getTime(), //Timing is everything
		stats: {maxEnergy:4, maxPower:10, maxCrystals:0, resetTime:new Date().getTime(), totalTime:new Date().getTime(), storyPercentage:0,},
	};
}

var visibilityArrayForLoading = []; //Used to make sure we reload the correct DOM status when save games are loaded

var player = getDefaultPlayer(); //Make the baseline player

var defaultVisibilitySetup = []; //Used to make the baseline DOM for game resets

function getBaselineVisibility() { //Check all elements in the body
	document.querySelectorAll('body *').forEach(function(node) {
		let individualArray = []; //Create array element for each node
		if(node.classList.contains("main")|| //Classes divide elements by game section. If it is on the main page,
		   node.classList.contains("display")||//resource display, 
		   node.classList.contains("upgrades")||//upgrade page,
		   node.classList.contains("generators")||//generator page,
		   node.classList.contains("quest")){//or quest page, we want it.
			individualArray.push(node.id);//First get the element id so we know what we're talking about
			if(node.classList.contains("unlocked")) individualArray.push(true);//If it is unlocked, we annotate that
			else individualArray.push(false);//Otherwise we don't.
			if(node.style.opacity>0.5) individualArray.push(true);//If it is visible, we annotate that
			else individualArray.push(false);//Otherwise we don't.
			defaultVisibilitySetup.push(individualArray);//Then send the completed item info array to the main array.
		}//Technically things like React will allow you to save the DOM state and recover it easily, but I'm too lazy to learn a new whole set of skills.
	});
}

function gameCycle() { //Each cycle lasts 10ms, or 0.01 seconds
	timeHack(0.01);
}

function timeHack(num) { //timeHack takes input by the second
	let now = new Date().getTime(); //Get the current time
	let diff = num*(now - player.lastTick)/10; //Get the number of seconds that have passed since the last time we checked (which helpfully also gives us offline progress)
	let getMore = false;
	for(i=0;i<4;i++) if(player.generatorPurchasers.purchased[i].gt(0)) getMore = true;
	if(getMore) getGenProduction(diff);
	player.generators.amount[2] = player.generators.amount[2].plus(player.generators.amount[3].times(getTotalBoost(3)).times(diff));
	player.generators.amount[1] = player.generators.amount[1].plus(player.generators.amount[2].times(getTotalBoost(2)).times(diff));
	player.generators.amount[0] = player.generators.amount[0].plus(player.generators.amount[1].times(getTotalBoost(1)).times(diff));
	player.power = player.power.plus(player.generators.amount[0].times(getTotalBoost(0)).times(diff));
	//Each generator makes the one below it, with the first generator making power.
	//Generator boosts are not calculated here, for cleanliness.
	player.lastTick = now; //Signal that we just checked progress.
	updateAll(); //Tell all numbers to update!
}

function getTotalBoost(num) {
	let boost = player.generators.boost[num];
	if(player.columns[0]) boost = boost.times(Decimal.pow(1.1,player.generators.purchased[num])); //Give the right boost if the quest reward is present	
	if(player.upgrades.generatorSpreadBoost.purchased.gt(0)){
		let otherTotal = new Decimal(0);
		for(i=0;i<4;i++){
			if(num!=i+1) otherTotal = otherTotal.plus(player.generators.purchased[i]);
		}
		boost = boost.times(Decimal.pow(1.05,otherTotal));
	}
	if(player.upgrades.bankUnlock.purchased.gt(0))	boost = boost.times(Decimal.pow(player.banks[num].plus(1),Decimal.plus(0.5,player.upgrades.bankPowerup.purchased.times(0.1))));
	if(player.upgrades.bankResetBoost.purchased.gt(0)) boost = boost.times(player.validResets);
	if(player.upgrades.crystalPowerup.purchased.gt(0)) boost = boost.times(player.crystals.div(10).plus(1));
	if(player.upgrades.generatorBoost.purchased.gt(0)) boost = boost.times(player.generatorBoost);
	if(boost.gte(10)) checkQuest(9);
	return boost;
}

function getGenProduction() {
	if(!player.isGenRunning) player.isGenRunning = true;
	for(i=0;i<4;i++){
		if(player.power.gte(player.generators.price[i])&&player.generatorPurchasers.purchased[i].gt(0)){
			player.generators.purchased[i] = player.generators.purchased[i].plus(player.generatorPurchasers.amount[i]); //Your purchased count rises,
			player.generators.amount[i] = player.generators.amount[i].plus(player.generatorPurchasers.amount[i]); //And your actual amount.
			player.power = player.power.minus(player.generators.price[i]); //Your power drops by the price
			if(player.generators.purchased[i].gte(Decimal.div(40,i).floor())){ //And if you have enough, then scaling scaling comes into play
				player.generators.price[i] = player.generators.price[i].times(player.generators.increase[i]).times(player.generators.scaling[i]);
			} //Otherwise, it's just one layer of scaling.
			player.generators.price[i] = player.generators.price[i].times(player.generators.increase[i]);
		}
	}
}

function doGenBoost() {
	if($("generatorBoost").classList.contains("unlocked")){
		if(player.power.gt(1000)&&player.energy.gt(0)){
			player.generatorBoost = player.power.log(10);
			player.generators = getDefaultPlayer().generators;
			player.energy = player.energy.minus(1);
			player.energySpent = player.energySpent.plus(1);
			player.power = new Decimal(10);
			$("genBoostAmount").textContent = display(player.generatorBoost);
		}
		if(player.recording) grabPiece("doGenBoost()");
	}
}

function getCrystalsOnReset() { //Function for getting number of crystals, prestige currency, on reset
	if(player.power.gte(1e8)){ //We start showing the player they are 1% of the way, so there is a clear continuity from a quest to the next step.
		if(player.power.gte(1e10)){ //If we are over 1e10, get the crystal amount.
			return player.power.log10().log10().pow(10).floor(); //This will need to be changed and balanced
		}
		else return display(player.power.div(1e8))+"%"; //Otherwise, let them know they are X% of the way there.
	}
}

function crystalConversion() { //Function for actually getting Crystals. Prestige.
	if(player.power.gte(1e10)){ //If you have enough power,
		player.crystals = player.crystals.plus(getCrystalsOnReset()); //Increase crystals by how many you can get
		if(player.recording) player.automatedCrystals = getCrystalsOnReset();
		player.power = new Decimal(10); //Reset your power
		player.generators = getDefaultPlayer().generators; //and your generators
		if(player.upgrades.keepGenBoost.purchased.equals(0)) player.generatorBoost = getDefaultPlayer().generatorBoost;
		checkQuest(6);
		if(player.crystals.gte(50)) checkQuest(10);
	}
}

function purchaseGen(item) { //Function to buy generators
	if(player.power.gte(player.generators.price[item-1])&&player.energy.gt(0)){ //If you have energy to push buttons, and enough power
		player.generators.purchased[item-1] = player.generators.purchased[item-1].plus(1); //Your purchased count rises,
		player.generators.amount[item-1] = player.generators.amount[item-1].plus(1); //And your actual amount.
		player.power = player.power.minus(player.generators.price[item-1]); //Your power drops by the price
		if(player.generators.purchased[item-1].gte(Decimal.div(40,item).floor())){ //And if you have enough, then scaling scaling comes into play
			player.generators.price[item-1] = player.generators[item-1].times(player.generators.scaling[item-1]);
		} //Otherwise, it's just one layer of scaling.
		player.generators.price[item-1] = player.generators.price[item-1].times(player.generators.increase[item-1]);
		if(player.upgrades.freeGenerators.purchased.gt(0)){
			if(player.generators.purchased[item-1].minus(1).toNumber()%(6-player.upgrades.freeGenerators.purchased.toNumber())!=0){
				player.energy = player.energy.minus(1);
			}
		}
		else player.energy = player.energy.minus(1); //And finally, take your energy.
		player.energySpent = player.energySpent.plus(1);
	}
	checkZero(); //Helper function used to determine if we need to show the reset button instead of energy. Having it here means less calls than putting it into updateAll()
	if(player.recording) grabPiece('purchaseGen('+item+')');
}

function upgrade(item) { //Purchase an upgrade for Crystals
	if(player.crystals.gte(player.upgrades[item].price)&&player.energy.gt(0)&&player.upgrades[item].purchased.lt(player.upgrades[item].max)){ //If you have enough Crystals for the upgrade and energy
		player.energy = player.energy.minus(1); //Pay the energy price
		player.energySpent = player.energySpent.plus(1);
		player.crystals = player.crystals.minus(player.upgrades[item].price); //and the Crystal price.
		player.upgrades[item].purchased = player.upgrades[item].purchased.plus(1); //Annotate that you've made a purchase,
		player.upgrades[item].price = player.upgrades[item].price.times(player.upgrades[item].increase); //Increase the upgrade price
		if($(item+"cost")!=null) $(item+"cost").textContent = player.upgrades[item].price;
		player.upgrades[item].increase = player.upgrades[item].increase.times(player.upgrades[item].scaling); //And scaling if necessary.
	}
	if(item == "bankUnlock") {
		for(i=1;i<5;i++){
			if(player.upgrades.bankUnlock.purchased.gt(i-1)) $("energyBanked"+i).style.display = "inline-block";
			else $("energyBanked"+i).style.display = "none";
		}
		if(player.upgrades.bankUnlock.purchased.gt(0)) addClass("energyBanked","unlocked");
		if(player.upgrades.bankUnlock.purchased.equals(4)&&!$("bankPowerupUpgrade").classList.contains("unlocked")){
			$("crystalPowerupUpgrade").classList.add("unlocked");
			fadeIn("crystalPowerupUpgrade");
			$("generatorBoostUpgrade").classList.add("unlocked");
			fadeIn("generatorBoostUpgrade");
			$("bankPowerupUpgrade").classList.add("unlocked");
			fadeIn("bankPowerupUpgrade");
			$("freeGeneratorsUpgrade").classList.add("unlocked");
			fadeIn("freeGeneratorsUpgrade");
		}
	}
	if(item == "freeGenerators"&&$("freeGeneratorsUpgrade").classList.contains("unlocked")&&!$("keepGenBoostUpgrade").classList.contains("unlocked")) {
		$("keepGenBoostUpgrade").classList.add("unlocked");
		fadeIn("keepGenBoostUpgrade");
		$("bankResetBoostUpgrade").classList.add("unlocked");
		fadeIn("bankResetBoostUpgrade");
		$("generatorSpreadBoostUpgrade").classList.add("unlocked");
		fadeIn("generatorSpreadBoostUpgrade");
		$("purchaserUnlockUpgrade").classList.add("unlocked");
		fadeIn("purchaserUnlockUpgrade");
	}
	if(item == "generatorBoost") {
		$("generatorBoost").classList.add("unlocked");
	}
	if(item == "purchaserUnlock") {
		for(i=1;i<5;i++){
			if(player.upgrades.purchaserUnlock.purchased.gt(i-1)) $("purchaser"+i).style.display = "inline-block";
			else $("purchaser"+i).style.display = "none";
		}
	}
	if(player.recording) grabPiece('upgrade('+item+')');
}

function bankEnergy(amount, index){ //Bank some of your energy to power generators
	if(player.upgrades.bankUnlock.purchased.gte(index)&&player.energy.gt(0)){
		player.energy = player.energy.minus(amount); //Lower energy by 1
		player.energySpent = player.energySpent.plus(1);
		player.banks[index-1] = player.banks[index-1].plus(amount); //Increase the banked amount by 1 based on which bank you are clicking
		$("bankedClicks"+index).textContent = player.banks[index-1]; //We also update the DOM text here since it only changes on click.
		let bp = Decimal.pow(player.banks[index-1].plus(1),Decimal.plus(0.5,player.upgrades.bankPowerup.purchased.times(0.1))); //Upgrade power is subject to change, of course.
		$("bankPower"+index).textContent = display(bp);
	}
	if(player.recording) grabPiece('bankEnergy('+amount+','+index+')');
}

function returnEnergy() {
	for(i=0;i<4;i++){
		let j = i+1;
		player.energy = player.energy.plus(player.banks[i]);
		player.banks[i] = new Decimal(0);
		$("bankedClicks"+j).textContent = 0;
		$("bankPower"+j).textContent = 0;
	}
	if(player.recording) grabPiece('returnEnergy()');
}

function genPurchasePurchase(num) {
	let energyReq = new Decimal(1);
	if(player.generatorPurchasers.purchased[num-1].equals(0)) energyReq = player.generatorPurchasers.energyPrice[num-1];
	if(player.energy.gte(energyReq)&&player.power.gte(player.generatorPurchasers.price[num-1])){
		player.energy = player.energy.minus(energyReq);
		player.power = player.power.minus(player.generatorPurchasers.price[num-1]);
		player.generatorPurchasers.purchased[num-1] = player.generatorPurchasers.purchased[num-1].plus(1);
		player.generatorPurchasers.amount[num-1] = player.generatorPurchasers.amount[num-1].plus(1);
		player.generatorPurchasers.price[num-1] = player.generatorPurchasers.price[num-1].times(player.generatorPurchasers.increase[num-1]);
	}
	if(player.recording) grabPiece('genPurchasePurchase('+num+')');
	if(!player.isGenRunning) var genLoop = setInterval(getGenProduction(), 1000);
}

function grow(item) { //Used to make the menu buttons all fancy
	let id = item+"Section"; //Make the item id
	if($(id).style.zIndex == 43) $(id).style.zIndex = 3; //Toggle the zIndex of the item
	else $(id).style.zIndex = 43; //Toggle
	$(id).classList.toggle("expandButton"); //Switch between the expanded and not expanded classes
	$(id).classList.toggle(item+"ExpandButton");//		 | |
	$(id).classList.toggle("expandButtonActive");//		\| |/
	$(id).classList.toggle(item+"ExpandButtonActive");//	 \ /
	let list = document.getElementsByClassName(item);// Now we get all the items that are a part of the menu screen we are moving
	if($(id).classList.contains("expandButtonActive")){ //If the menu element is small, then we set the inner elements to display as soon as the animation is complete
		var growing = setTimeout(function() {
			for(i=0;i<list.length;i++) list[i].style.display = "block";
		}, 1750); //And the animation lasts 1.75s, which will eventually be a changeable amount in the menu
	}
	else if(!$(id).classList.contains("expandButtonActive")){
		clearInterval(growing);
		for(i=0;i<list.length;i++) list[i].style.display = "none"; //If the menu element is big, that means it's going away so vanish the inner elements
	}
}

function formatTime(ms) {
	let days = 0;
	let hours = 0;
	let minutes = 0;
	let seconds = 0;
	let str = "";
	if(ms>24*60*60*1000){ 
		days = (ms-(ms%(24*60*60*1000)))/(24*60*60*1000);
		str += days+" days, ";
	}
	ms = ms-days*(24*60*60*1000);
	if(ms>60*60*1000){
		hours = (ms-(ms%(60*60*1000)))/(60*60*1000);
		str += hours+" hours, ";
	}
	ms = ms-hours*(60*60*1000);
	if(ms>60*1000){
		minutes = (ms-(ms%(60*1000)))/(60*1000);
		str += minutes+" minutes, ";
	}
	ms = ms-minutes*(60*1000);
	if(ms>1000){
		seconds = (ms-(ms%1000))/1000;
		str += seconds+" seconds";
	}
	return str;
}

function updateAll() { //Big papa update function. Gotta check and update everything constantly
	if(player.energy.gte(player.stats.maxEnergy)){
		player.stats.maxEnergy = player.energy;
		$("maxEnergy").textContent = display(player.stats.maxEnergy);
	}
	if(player.power.gte(player.stats.maxPower)){
		player.stats.maxPower = player.power;
		$("maxPower").textContent = display(player.stats.maxPower);
	}
	if(player.crystals.gte(player.stats.maxCrystals)){
		player.stats.maxCrystals = player.crystals;
		$("maxCrystals").textContent = display(player.stats.maxCrystals);
	}
	$("resetTime").textContent = formatTime(new Date().getTime() - player.stats.resetTime);
	$("totalTime").textContent = formatTime(new Date().getTime() - player.stats.totalTime);
	if(player.energy.gt(0)){
		if($("reset").style.opacity==1)	fadeOut("reset");
		if($("energyArea").style.opacity==0) setTimeout(function(){fadeIn("energyArea")},1000);
	}
	if(player.energy.equals(0)){
		if($("energyArea").style.opacity==1) fadeOut("energyArea");
		if($("reset").style.opacity==0) setTimeout(function(){fadeIn("reset")},1000);
	}
	$("currentEnergy").textContent = display(player.energy); //Update current energy
	$("currentPower").textContent = display(player.power); //Update current power
	$("currentCrystals").textContent = display(player.crystals); //Update current Crystals
	if(player.power.log10().gte(player.generatorBoost)&&player.power.gte(1000)) $("genBoostToBecome").textContent = display(player.power.log10());
	else $("genBoostToBecome").textContent = display(player.generatorBoost);
	$("genBoostAmount").textContent = display(player.generatorBoost);
	for(i=1;i<5;i++){
		$("bankedClicks"+i).textContent = player.banks[i-1];
		let bp = Decimal.pow(player.banks[i-1].plus(1),Decimal.plus(0.5,player.upgrades.bankPowerup.purchased.times(0.1)));
		if(player.upgrades.bankResetBoost.purchased.gt(0)) bp = bp.times(player.validResets);
		$("bankPower"+i).textContent = display(bp);
		
		$("genPurchaseAmount"+i).textContent = display(player.generatorPurchasers.amount[i-1]);
		$("genPurchaseEnergyCost"+i).textContent = display(player.generatorPurchasers.energyPrice[i-1]);
		$("genPurchaseCost"+i).textContent = display(player.generatorPurchasers.price[i-1]);
		$("genPurchasePower"+i).textContent = display(player.generatorPurchasers.boost[i-1]);
	}
	if(player.power.gte(1e8)){ //Check if we can start listing the amount of Crystals on reset
		if(typeof getCrystalsOnReset() === "string"){ //If we have a percentage of a Crystal, it will return a string
			$("crystalConversion").textContent = "You have "+getCrystalsOnReset()+" of a Crystal"; //And we show this message
		}
		else { //If we have at least 1 Crystal on the way, it will return a Decimal
			$("crystalConversion").textContent = "Convert your Power into "+display(getCrystalsOnReset())+" Crystals"; //And we show this message
		}
	}
	else $("crystalConversion").textContent = "You need more Power to make a Crystal"; //But if the user doesn't have enough to even show a percentage, let them know
	for(i=1;i<5;i++){ //Update values for each generator screen
		if(player.power.lt(player.generators.price[i-1])) $("genPurchase"+i).style.color = "darkGrey"; //If you don't have enough power, make the text faded
		else $("genPurchase"+i).style.color = "black"; //But if they have enough, make it regular
		$("gen"+i+"Purchased").textContent = display(player.generators.purchased[i-1]); //Update purchased numbers
		$("gen"+i+"Price").textContent = display(player.generators.price[i-1]); //Price for the next generator
		$("genAmount"+i).textContent = display(player.generators.amount[i-1]); //How many you have
		$("generation"+i).textContent = display(player.generators.amount[i-1].times(getTotalBoost(i-1))); //And how much this generator is making
	}
	if(!player.quests[3]&&player.power.gte(1000)){ //No easy way to check for quest completion based on power outside the update area, 
		checkQuest(4);
	}
	if(!player.quests[4]&&player.power.gte(1e8)){ //Same here, and for all subsequest power-based quests
		checkQuest(5);
	}
	if(!player.quests[7]&&player.power.gte(1e15)){
		checkQuest(8);
	}
	if(!player.quests[10]&&player.energySpent.gte(200)) checkQuest(11);
	if(player.upgrades.bankUnlock.purchased.gt(0)){ //If the power banks are unlocked, we need to show them
		let num = player.upgrades.bankUnlock.purchased; //Upper limit on how many we have purchased
		for(i=1;i<5;i++){ //4 generators need 4 banks
			if(i<=num){
				if(!$("clickBank"+i).classList.contains("unlocked")){ //If you have purchased the bank upgrade for that generator
					$("clickBank"+i).classList.add("unlocked"); 	     //and you have not already unlocked the bank, make it visible.
				}
				$("energyBanked"+i).style.display = "";
			}
			else{
				if($("clickBank"+i).classList.contains("unlocked")){ //Else, make sure nothing else is visible
					$("clickBank"+i).classList.remove("unlocked");
				}
				$("energyBanked"+i).style.display = "none";
			}
		}
	}
	if(player.upgrades.purchaserUnlock.purchased.gt(0)){
		let num = player.upgrades.purchaserUnlock.purchased;
		for(i=1;i<5;i++){
			if(i<=num){
				if(!$("generatorPurchaser"+i).classList.contains("unlocked")){
					$("generatorPurchaser"+i).classList.add("unlocked");
				}
				$("purchaser"+i).style.display = "";
			}
			else{
				if($("generatorPurchaser"+i).classList.contains("unlocked")){
					$("generatorPurchaser"+i).classList.remove("unlocked");
				}
				$("purchaser"+i).style.display = "none";
			}
		}
	}
	if(player.upgrades.crystalPowerup.purchased.gt(0)) $("crystalPowerArea").textContent = display(player.crystals.div(10).plus(1));
	if(player.upgrades.bankPowerup.purchased.gt(0)) $("bankPowerArea").textContent = display(player.upgrades.bankPowerup.purchased.div(10).plus(0.5));
	if(player.upgrades.bankResetBoost.purchased.gt(0)) $("bankResetBoostArea").textContent = display(player.validResets.plus(1));
	for(const upgrade of Object.keys(player.upgrades)){
		if(player.upgrades[upgrade].purchased.equals(player.upgrades[upgrade].max)) $(player.upgrades[upgrade].id).style.background = "green";
		else $(player.upgrades[upgrade].id).style.background = "grey";
		if(player.crystals.gte(player.upgrades[upgrade].price)) $(player.upgrades[upgrade].id).style.color = "black";
		else $(player.upgrades[upgrade].id).style.color = "darkGrey";
	}
	$("bankPowerupCost").textContent = display(player.upgrades.bankPowerup.price);
	$("freeGeneratorsCost").textContent = display(player.upgrades.freeGenerators.price);
	
	for(i=1;i<player.quests.length+1;i++){ //Checker to make sure that no quests are sticking around that shouldn't.
		if(player.quests[i-1]){ //If you have claimed a quest, make sure its correctly listed.
			if($("quest"+i).classList.contains("unsolved"))	$("quest"+i).classList.remove("unsolved");
			if($("quest"+i).classList.contains("solved")) $("quest"+i).classList.remove("solved");
			if(!$("quest"+i).classList.contains("claimed")) $("quest"+i).classList.add("claimed");
		} else { //If you haven't claimed a quest, default to unsolved.
			if($("quest"+i).classList.contains("claimed")) $("quest"+i).classList.remove("claimed");
			if(!$("quest"+i).classList.contains("unsolved")) $("quest"+i).classList.add("unsolved");
		}
	}
	for(i=1;i<player.columns.length+1;i++){
		if(player.columns[i-1]){
			if($("column"+i).classList.contains("unsolved")) $("column"+i).classList.remove("unsolved");
			if($("column"+i).classList.contains("solved")) $("column"+i).classList.remove("solved");
			if(!$("column"+i).classList.contains("claimed")) $("column"+i).classList.add("claimed");
		} else { //If you haven't claimed a quest, default to unsolved.
			if($("column"+i).classList.contains("claimed")) $("column"+i).classList.remove("claimed");
			if(!$("column"+i).classList.contains("unsolved")) $("column"+i).classList.add("unsolved");
		}
	}
}

function beginination() { //On webpage load, 
	initializeGrid(); //we initialize the grid of empty elements to make sure all the spacing is good.
	load(); //We load any saved games from local storage.
	setInterval(gameCycle, 10); //Set the game to run every 10 ms,
	setInterval(save, 30000); //And save every 30 sec.
	if(player.upgrades.purchaserUnlock.purchased.lt(1)) player.isGenRunning = false;
	if(player.isGenRunning) var genLoop = setInterval(getGenProduction(), 1000);
}

function save() { //Utilizes the usual Decimal save function, with an additional bit about the current DOM state
	if(player.automating){
		if(player.automationArray[0][0]!=null){
			for(i=0;i<player.automationArray.length;i++){
				player.automationLength = player.automationLength.plus(player.automationArray[i][0]);
			}
			player.automationRatio = player.automationCrystals.div(player.automationLength);
		}
	}
	visibilityArrayForLoading = []; //This was all explained above with the initial visibility state.
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
	localStorage.setItem("unLimitedButtonVis", btoa(JSON.stringify(visibilityArrayForLoading))); //Save the visibility state
	localStorage.setItem("automatorArray", btoa(JSON.stringify(player.automationArray))); //Save the automation array
	saveGame(); //And the player state
	$("savedInfo").style.display = ""; //And then display the "saved game" message for a few seconds
	setTimeout( function() {
		$("savedInfo").style.display = "none";
	}, 2000);
}

function exportSave() {
	var tempInput = document.createElement("input"); //You have to create a new document element
	tempInput.style = "position: absolute; left: -1000px; top: -1000px"; //Say it's out of the window view
	tempInput.value = btoa(JSON.stringify(player)); //Fill it with the player save file
	tempInput.value += btoa(JSON.stringify(visibilityArrayForLoading));
	tempInput.value += btoa(JSON.stringify(player.automationArray));
	document.body.appendChild(tempInput); //Stick the window on the main document
	tempInput.select(); //Select the window
	document.execCommand("copy"); //Stick the contents of said window into the clipboard
	document.body.removeChild(tempInput); //Delete the go-between window
	alert("Save copied to clipboard"); //Tell the player it all worked
}

function importSave() {
	let input = prompt("Paste your save below please")
	if (!(input === null || input === "")) {
		loadSave(input,true)
	}
}

function load() { //When we load the game, we load the player state, the DOM state, and the automator list
	getBaselineVisibility();
	if(localStorage.getItem("unLimitedSave") !== null) loadGame(localStorage.getItem("unLimitedSave"));
	if(localStorage.getItem("unLimitedButtonVis") !== null) visibilityArrayForLoading = JSON.parse(atob(localStorage.getItem("unLimitedButtonVis")));
	if(localStorage.getItem("automatorArray") !== null) player.automationArray = JSON.parse(atob(localStorage.getItem("automatorArray")));
	if(visibilityArrayForLoading[0]!=null){
		for(i=0;i<visibilityArrayForLoading.length;i++){
			let individualArray = visibilityArrayForLoading[i];
			let id = individualArray[0];
			if(individualArray[1]) $(id).classList.add("unlocked");
			else if($(id).classList.contains("unlocked")) $(id).classList.remove("unlocked");
			if(individualArray[2]) setTimeout(function(){fadeIn(id)},1000);
			else if($(id).style.opacity>0.5) fadeOut(id);
		}
	}
	addClass("upgradesDepartureL","unlocked");
	addClass("bankUnlockUpgrade","unlocked");
	if(player.currentZone != "main") fadeOut("start");
	if(player.automating){
		let timeOffline = new Date().getTime() - player.lastTick;
		if(player.automationRatio.times(timeOffline).gt(1)){
			let offlineCrystals = player.automationRatio.times(timeOffline).floor();
			alert("While offline, your automator produced "+offlineCrystals+" Crystals.");
			player.crystals = player.crystals.plus(offlineCrystals);
		}
		fadeOut("record");
		fadeOut("playAutomation");
		setTimeout(function(){fadeIn("stopAutomation")},1000);
	}
	//event.stopPropagation();
	return player;
}

function clearSave(){
	if(confirm("Do you really want to delete your save?\nThis cannot be undone.")){
		resetView();
		localStorage.removeItem("unLimitedSave");
		localStorage.removeItem("unLimitedButtonVis");
		localStorage.removeItem("automatorArray");
		player = getDefaultPlayer();
		updateAll();
	
	/*for(i=0;i<defaultVisibilitySetup.length;i++){
		let individualArray = defaultVisibilitySetup[i];
		let id = individualArray[0];
		if(individualArray[1]) $(id).classList.add("unlocked");
		else if($(id).classList.contains("unlocked")) $(id).classList.remove("unlocked");
		if(individualArray[2]) fadeIn(id);
		else if($(id).style.opacity>0.5) fadeOut(id);
	}*/
		for(i=1;i<5;i++){
			if($("generatorPurchaser"+i).classList.contains("unlocked")) $("generatorPurchaser"+i).classList.remove("unlocked");
		}
		let allUps = document.getElementsByClassName("upgrades");
		for(i=0;i<allUps.length;i++){
			if(allUps[i].id!="bankUnlockUpgrade"||allUps[i].id!="upgradesDepartureL"){
				if(allUps[i].classList.contains("unlocked")) allUps[i].classList.remove("unlocked");
			}
		}
		for(i=1;i<player.quests.length;i++){
			if($("quest"+i).classList.contains("solved")) $("quest"+i).classList.remove("solved");
			if($("quest"+i).classList.contains("claimed")) $("quest"+i).classList.remove("claimed");
			if($("quest"+i).classList.contains("unlocked")&&i>4) $("quest"+i).classList.remove("unlocked");
		}
		for(i=1;i<player.columns.length;i++){
			if($("column"+i).classList.contains("solved")) $("column"+i).classList.remove("solved");
			if($("column"+i).classList.contains("claimed")) $("column"+i).classList.remove("claimed");
			if(i>1&&("column"+i).classList.contains("unlocked")) $("column"+i).classList.remove("unlocked");
		}
		player.genLoop = false;/*
	beginination();
	fadeIn("start");*/
	}
}

function checkKey(event) {
}

function reset() {
	let good = true;
	if(!player.energy.equals(0)){
		if(!player.automating){
			if(!confirm("You still have energy remaining. Do you want to reset?")) good = false;
		}
	}
	if(good){
		if(player.recording){
			grabPiece('reset()');
			stopRecording();
		}
		if(player.automating) playAutomation(0);
		if(player.power.gte(1e10)) player.validResets = player.validResets.plus(1);
		player.power = new Decimal(10);
		let energy = new Decimal(4);
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
				case 8:
				case 9:
				case 10:
				case 11:
					if(player.quests[i]) energy = energy.plus(5);
					break;
				default:
					break;
			}
		}
		let mainScreen = document.getElementsByClassName("main");
		for(i=0;i<mainScreen.length;i++){
			if(mainScreen[i].id!="start"){
				if(mainScreen[i].classList.contains("unlocked")) mainScreen[i].classList.remove("unlocked");
				if(mainScreen[i].style.opacity == 1) fadeOut(mainScreen[i].id);
			}
		}
		for(i=0;i<4;i++){
			let j = i+1;
			if(player.upgrades.bankUnlock.purchased.lt(i+1)&&$("clickBank"+j).classList.contains("unlocked")) {
				$("clickBank"+j).classList.remove("unlocked");
			}
			if(player.upgrades.purchaserUnlock.purchased.lt(i+1)&&$("generatorPurchaser"+j).classList.contains("unlocked")) {
				$("generatorPurchaser"+j).classList.remove("unlocked");
			}
			player.banks[i] = new Decimal(0);
			$("bankedClicks"+j).textContent = 0;
			$("bankPower"+j).textContent = 0;
		}
		for(i=0;i<player.upgrades.length;i++) energy = energy - player.upgrades[i].purchased;
		if(player.upgrades.bankUnlock.purchased.lt(4)){
			removeClass("crystalPowerupUpgrade","unlocked");
			removeClass("generatorBoostUpgrade","unlocked");
			removeClass("bankPowerupUpgrade","unlocked");
			removeClass("freeGeneratorsUpgrade","unlocked");
		}
		if(player.upgrades.freeGenerators.purchased.lt(1)){
			removeClass("keepGenBoostUpgrade","unlocked");
			removeClass("bankResetBoostUpgrade","unlocked");
			removeClass("generatorSpreadBoostUpgrade","unlocked");
			removeClass("purchaserUnlockUpgrade","unlocked");
		}
		player.energy = energy;
		player.energySpent = getDefaultPlayer().energySpent;
		player.generators = getDefaultPlayer().generators;
		player.generatorProducers = getDefaultPlayer().generatorProducers;
		if(player.isGenRunning) clearInterval(genLoop);
		player.isGenRunning = false;
		if(player.upgrades.generatorBoost.purchased.lt(1)&&$("generatorBoost").classList.contains("unlocked")){
			$("generatorBoost").classList.remove("unlocked");
		}
		player.generatorBoost = getDefaultPlayer().generatorBoost;
		$("genBoostAmount").textContent = "1";
		player.clicked = getDefaultPlayer().clicked;
		player.stats.resetTime = new Date().getTime();
		resetView();
		if(player.storySeen == 2){
			$("storyScreen").textContent = story3;
			if($("storyScreen").style.opacity != 1) fadeIn("storyScreen");
			player.storySeen++;
		}			
	}
}

function resetView() {
	var orig = "unlocked "+player.currentZone;
	let toHide = document.getElementsByClassName(orig);
	fadeOutAll(toHide);
	fadeOut("reset");
	if($("energyArea").classList.contains("unlocked")) fadeOut("energyArea");
	if($("powerArea").classList.contains("unlocked")) fadeOut("powerArea");
	if($("crystalArea").classList.contains("unlocked")) fadeOut("crystalArea");		
	for(i=0;i<visibilityArrayForLoading.length;i++){
		let individualArray = visibilityArrayForLoading[i];
		let id = individualArray[0];
		if($(id).style.zIndex<0) $(id).style.zIndex = 1;
		if($(id).style.zIndex>1) $(id).style.zIndex = 1;
	}
	
	setTimeout(function(){fadeIn("start")},1000);
	if(player.quests[7]){
		press("start");
		press("showEnergy");
		press("showQuests");
		press("showCrystals");
		press("showUpgrades");
		press("showPower");
		press("showGenerators");
	}
	updateAll();
}
function genBoost() {
}

function bank(amount, index) {
}

function bankBoost() {
}

function devReset(){
	player.energy = new Decimal(0);
	reset();
}
