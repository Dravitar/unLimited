function checkZero() {  
	if(player.energy.equals(0)&&$("reset").style.zIndex<10){
		fadeOut("energyArea");
		fadeIn("reset");
		if($("quest2").classList.contains("unsolved")){
			$("quest2").classList.add("solved");
			$("quest2").classList.remove("unsolved");
		}
		if(player.storySeen==1){
			$("storyScreen").textContent = story2;
			if($("storyScreen").style.opacity != 1) fadeIn("storyScreen");
			player.storySeen++;
		}
	}
}

function press(id) {
	if(player.energy.gt(0) || $(id).classList.contains("travel")){
		switch(id) {
			case "start":
				if(!player.clicked.start){
					if(player.storySeen==0){
						$("storyScreen").textContent = story1;
						fadeIn("storyScreen");
						player.storySeen++;
					}
					$("showEnergy").classList.add("unlocked");
					fadeIn('showEnergy');
					player.clicked.start = true;
					player.energy = player.energy.minus(1);
					player.energySpent = player.energySpent.plus(1);
					if($("quest1").classList.contains("unsolved")){
						$("quest1").classList.add("solved");
						$("quest1").classList.remove("unsolved");
					}
					if(player.recording) grabPiece("press('start')");
				}
				break;
			case "showEnergy":
				if(!player.clicked.showEnergy&&player.clicked.start){
					$("energyArea").classList.add("unlocked");
					fadeIn('energyArea');
					$("showQuests").classList.add("unlocked");
					fadeIn('showQuests');
					$("dumpEnergy").classList.add("unlocked");
					fadeIn("dumpEnergy");
					if(player.columns[1]){
						$("record").classList.add("unlocked");
						$("playAutomation").classList.add("unlocked");
						fadeIn("record");
						fadeIn("playAutomation");
					}
					player.clicked.showEnergy = true;
					player.energy = player.energy.minus(1);
					player.energySpent = player.energySpent.plus(1);
					if(player.recording) grabPiece("press('showEnergy')");
				}
				break;
			case "showQuests":
				if(!player.clicked.showQuests&&player.clicked.showEnergy){
					$("showPower").classList.add("unlocked");
					$("mainDepartureD").classList.add("unlocked");
					fadeIn('showPower');
					fadeIn('mainDepartureD');
					if(player.quests[4]) $("showCrystals").classList.add("unlocked");
					if($("showCrystals").classList.contains("unlocked")) fadeIn('showCrystals');
					player.clicked.showQuests = true;
					player.energy = player.energy.minus(1);
					player.energySpent = player.energySpent.plus(1);
					if(player.recording) grabPiece("press('showQuests')");
				}
				break;
			case "showPower":
				if(!player.clicked.showPower&&player.clicked.showQuests){
					$("powerArea").classList.add("unlocked");
					fadeIn('powerArea');
					$("showGenerators").classList.add("unlocked");
					fadeIn('showGenerators');
					player.clicked.showPower = true;
					player.energy = player.energy.minus(1);
					player.energySpent = player.energySpent.plus(1);
					if(player.recording) grabPiece("press('showPower')");
				}
				break;
			case "showGenerators":
				if(!player.clicked.showGenerators&&player.clicked.showPower){
					$("mainDepartureL").classList.add("unlocked");
					fadeIn('mainDepartureL');
					player.clicked.showGenerators = true;
					player.energy = player.energy.minus(1);
					player.energySpent = player.energySpent.plus(1);
					if($("quest3").classList.contains("unsolved")){
						$("quest3").classList.add("solved");
						$("quest3").classList.remove("unsolved");
					}
					if(player.recording) grabPiece("press('showGenerators')");
				}
				break;
			case "mainDepartureL":
				if(!player.clicked.mainDeparture&&player.clicked.showGenerators){
					moveFrom('main','generators');
					player.clicked.mainDeparture = true;
					player.clicked.generatorsDeparture = false;
				}
				break;
			case "showCrystals":
				if(!player.clicked.showCrystals&&player.clicked.showQuests){
					$('crystalArea').classList.add("unlocked");
					fadeIn('crystalArea');
					$('crystalConversion').classList.add("unlocked");
					fadeIn('crystalConversion');
					if(player.quests[5]) $("showUpgrades").classList.add("unlocked");
					if($("showUpgrades").classList.contains("unlocked")) fadeIn('showUpgrades');
					player.clicked.showCrystals = true;
					player.energy = player.energy.minus(1);
					player.energySpent = player.energySpent.plus(1);
					if(player.recording) grabPiece("press('showCrystals')");
				}
				break;
			case "crystalConversion":
				if(player.clicked.showCrystals&&player.power.gte(1e10)){
					crystalConversion();
					player.energy = player.energy.minus(1);
					player.energySpent = player.energySpent.plus(1);
					if(player.recording) grabPiece("press('crystalConversion')");
				}
				break;
			case "showUpgrades":
				if(!player.clicked.showUpgrades&&player.clicked.showCrystals){
					$("mainDepartureR").classList.add("unlocked");
					fadeIn('mainDepartureR');
					player.clicked.showUpgrades = true;
					player.energy = player.energy.minus(1);
					player.energySpent = player.energySpent.plus(1);
					if(player.recording) grabPiece("press('showUpgrades')");
				}
				break;
			case "mainDepartureR":
				if(!player.clicked.mainDeparture&&player.clicked.showUpgrades){
					moveFrom('main','upgrades');
					player.clicked.mainDeparture = true;
					player.clicked.upgradesDeparture = false;
					if($("quest7").classList.contains("unsolved")){
						$("quest7").classList.add("solved");
						$("quest7").classList.remove("unsolved");
					}
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
				if(!player.clicked.mainDeparture&&player.clicked.showQuests){
					moveFrom('main','quest');
					player.clicked.mainDeparture = true;
					player.clicked.questDeparture = false;
				}
				break;
			case "questDepartureU":
				if(!player.clicked.questDeparture){
					moveFrom('quest','main');
					player.clicked.questDeparture = true;
					player.clicked.mainDeparture = false;
				}
				break;
			case "upgradesDepartureL":
				if(!player.clicked.upgradesDeparture){
					moveFrom('upgrades','main');
					player.clicked.upgradeDeparture = true;
					player.clicked.mainDeparture = false;
				}
				break;
			case "record":
				if(player.recording) stopAutomation();
				else{
					player.lastAutomationAction = new Date().getTime();
					beginAutomationRecording();
				}
				break;
		}
		checkZero();
	}
}

function checkQuest(num) {
	if(!player.quests[num-1]){ //Check if you need to complete the quest
		if($("quest"+num).classList.contains("unsolved")){ //If you haven't solved it,
			$("quest"+num).classList.add("solved"); //Now you have!
			$("quest"+num).classList.remove("unsolved"); //Take away the unneccesary class.
		}
	}
}

function claimQuest(num) {
	if($("quest"+num).classList.contains("solved")) {
		$("quest"+num).classList.add("claimed");
		$("quest"+num).classList.remove("solved");
		player.quests[num-1] = true;
		if(num==5){
			$("showCrystals").classList.add("unlocked");
			$("showUpgrades").classList.add("unlocked");
		}
	}
	var set = Math.floor((num-1)/4);
	check = true;
	for(i=set*4;i<(set*4)+4;i++){
		if(!player.quests[i]) check = false;
	}
	if(check) {
		var nuum = set+1;
		$("column"+nuum).classList.add("solved");
		$("column"+nuum).classList.remove("unsolved");
	}
}

function claimColumn(num) {
	if($("column"+num).classList.contains("solved")){
		$("column"+num).classList.remove("solved");
		$("column"+num).classList.add("claimed");
		if(num==2){
			$("record").classList.add("unlocked");
			$("playAutomation").classList.add("unlocked");
		}
		player.columns[num-1] = true;
		var nuum = num+1;
		fadeIn("column"+nuum);
		$("column"+nuum).classList.add("unlocked");
		for(i=4*num;i<4*num+5;i++){
			fadeIn("quest"+i);
			$("quest"+i).classList.add("unlocked");
		}
	}
}
