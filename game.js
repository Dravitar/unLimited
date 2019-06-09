function getDefaultPlayer() {
	return {
		clicks: 12, //How many clicks the player has remaining
		buttons: {
			unlocked: [""], //All buttons the player has currently unlocked
			requirements: { //Power req, button unlock req, buttons that it unlocks, button id
				row0: {col0: [new Decimal(0), "", ["10"], "00"]},
				row1: {col0: [new Decimal(0), "00", ["21"], "10"]},
				row2: {
					col0: [new Decimal(1e4), "10", [""], "20"],
					col1: [new Decimal(0), "10", [""], "21"],
					col2: [new Decimal(1e12), "10", [""], "22"],
				},
			},
		},
		producers: {
			power: new Decimal(10),
			amounts: [new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0)],
			prices: [new Decimal(10), new Decimal(100), new Decimal(1e4), new Decimal(1e7)],
			empowered: [new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0)]
		},
		upgrades: [],
		upgradePrices: [],
		lastTick: new Date().getTime(),
	};
}

let player = getDefaultPlayer();
let totalButtons = [[0,0],[1,0],[2,0],[2,1],[2,2]];

function updateText(get, set) {
	document.getElementById(get).innerHTML=set;
}

function updateColor(get, color) {
	document.getElementById(get).style.backgroundColor = color;
}

function updateTextColor(get, color) {
	document.getElementById(get).style.color = color;
}

function update() {
	checkPricing();
	if(player.buttons.unlocked.includes("10")) {
		docShow("clicks");
		updateText("clicksRemaining", player.clicks);
	}
}

function checkPricing() {
	for(let i of totalButtons) {
		let id = ""+i[0]+i[1];
		let bigId = "treeButton"+id;
		if(player.buttons.unlocked.includes(id)) {
			updateColor(bigId, "green");
			updateTextColor(bigId, "darkGreen");
		}
		else if(player.producers.power.gte(player.buttons.requirements["row"+i[0]]["col"+i[1]][0])) {
			updateColor(bigId, "green");
			updateTextColor(bigId, "white");
		}
		else {
			updateColor(bigId, "white");
			updateTextColor(bigId, "darkRed");
		}
	}
}

function gameCycle() {
	getProduction();
	update();
}

function getProduction() {
	let time = new Date().getTime();
	let x = time-player.lastTick;
	player.lastTick = time;
	time = x;
	while(time>0) {
		for(let i=player.producers.amounts.length-1;i>=0;i--) {
			console.log(i);
			if(i==0) {
				player.producers.power = player.producers.power.plus(
					player.producers.amounts[0].times(
						player.producers.empowered[0])
					.times(0.05));
				time-=50;
			}
			else {
				player.producers.amounts[i-1] = player.producers.amounts[i-1].plus(
					player.producers.amounts[i].times(
						player.producers.empowered[i])
					.times(0.05));
			}
		}
	}
}

function startCycle() {
	setInterval(gameCycle(), 50);
}
