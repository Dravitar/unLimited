function beginAutomationRecording() {
	let good = true;
	if(player.automationArray[0]!=null) if(!confirm("You have a saved automation. Do you wish to overwrite it?")) good = false;
	if(good){
		player.automationArray = [];
		player.energy = new Decimal(0);
		reset();
		player.recording = true;
		$("recordingSymbol").style.opacity = 1;
		$("toggleRecording").style.zIndex = 20;
		$("toggleRecording").style.opacity = 1;
	}
}

function grabPiece(item) {	
	let automationPiece = [];
	let now = new Date().getTime();
	let difference = now - player.lastAutomationAction;
	player.lastAutomationAction = now;
	automationPiece.push(difference);
	automationPiece.push(item);
	console.log(automationPiece);
	player.automationArray.push(automationPiece);
}

function automate() {
	player.automating = true;
	fadeOut("record");
	$("record").classList.remove("unlocked");
	fadeOut("playAutomation");
	$("playAutomation").classList.remove("unlocked");
	$("stopAutomation").style.opacity = 1;
	$("stopAutomation").style.zIndex = 100;
	fadeIn("automatingSymbol");
	playAutomation(0);
}

function playAutomation(i) {
	console.log(player.automationArray[i][0]+", "+player.automationArray[i][1]);
	eval(player.automationArray[i][1]);
	//var fn = window[str];			//THERES GOTTA BE A BETTER WAY
	//if(typeof fn==="function") fn();
	//var f = new Function(player.automationArray[i][1]));
	setTimeout( function() {
		var j = i+1;
		if(player.automationArray[j]!=null&&player.automating) playAutomation(j);
	}, player.automationArray[i][0]);
}

function stopAutomation() {
	if(player.automating){
		player.automating = false;
		fadeOut("automationScreen");
		fadeOut("stopAutomation");
		fadeOut("automatingSymbol");
		fadeIn("record");
		$("record").classList.add("unlocked");
		fadeIn("playAutomation");
		$("playAutomation").classList.add("unlocked");
	}
}
	

function stopRecording() {
	if(player.recording){
		player.recording = false;
		$("recordingSymbol").style.opacity = 0;
		$("toggleAutomation").style.zIndex = 1;
		$("toggleAutomation").style.opacity = 0;
	}
}
