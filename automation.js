function beginAutomationRecording() {
	let good = true;
	if(player.automationArray[0]!=null) if(!confirm("You have a saved automation. Do you wish to overwrite it?")) good = false;
	if(good){
		player.automationArray = [];
		player.energy = new Decimal(0);
		reset();
		player.recording = true;
		$("recordingSymbol").style.opacity = 1;
		$("toggleAutomation").style.zIndex = 20;
		$("toggleAutomation").style.opacity = 1;
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

function playAutomation(i) {
	console.log(player.automationArray[i][0]+", "+player.automationArray[i][1]);
	setTimeout( function() {
		eval(player.automationArray[i][1]);
		//var fn = window[str];			//THERES GOTTA BE A BETTER WAY
		//if(typeof fn==="function") fn();
		//var f = new Function(player.automationArray[i][1]));
		var j = i+1;
		if(player.automationArray[j]!=null) playAutomation(j);
	}, player.automationArray[i][0]);
}

function stopAutomation() {
	player.recording = false;
	$("recordingSymbol").style.opacity = 0;
	$("toggleAutomation").style.zIndex = 1;
	$("toggleAutomation").style.opacity = 0;
}
