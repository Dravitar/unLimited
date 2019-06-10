function getDefaultPlayer() {
	return {
		clicks: 12, //How many clicks the player has remaining
		buttons: {
			unlocked: [""], //All buttons the player has currently unlocked
			requirements: { //Power req, button unlock req, buttons that it unlocks, button id
				row0: { col0: [new Decimal(0), "", ["10"], "00"]},
				row1: { col0: [new Decimal(0), "00", ["21"], "10"]},
				row2: {
					col0: [new Decimal(1e4), "10", [""], "20"],
					col1: [new Decimal(0), "10", ["30"], "21"],
					col2: [new Decimal(1e12), "10", [""], "22"],
				},
				row3: {
					col0: [new Decimal(10), "21", ["31"], "30"],
					col1: [new Decimal(100), "30", ["32"], "31"],
					col2: [new Decimal(1e4), "31", ["33"], "32"],
					col3: [new Decimal(1e7), "32", [""], "33"],
					col4: [new Decimal(10), "84", [""], "34"],
					col5: [new Decimal(10), "85", [""], "35"],
					col6: [new Decimal(10), "86", [""], "36"],
					col7: [new Decimal(10), "87", [""], "37"],
				},
				row4: {
					col0: [new Decimal(0), "55", [""], "40"],
					col1: [new Decimal(0), "55", [""], "41"],
					col2: [new Decimal(0), "55", [""], "42"],
					col3: [new Decimal(0), "55", [""], "43"],
					col4: [new Decimal(0), "55", [""], "44"],
					col5: [new Decimal(0), "55", [""], "45"],
					col6: [new Decimal(0), "55", [""], "46"],
					col7: [new Decimal(0), "55", [""], "47"],
				},
				row5: {
					col0: [new Decimal(0), "20", ["60"], "50"],
					col1: [new Decimal(0), "20", ["61"], "51"],
					col2: [new Decimal(0), "20", ["62"], "52"],
					col3: [new Decimal(0), "20", ["63"], "53"],
					col4: [new Decimal(0), "20", ["64"], "54"],
					col5: [new Decimal(0), "20", ["65"], "55"],
				},
				row6: {
					col0: [new Decimal(0), "50", ["70"], "60"],
					col1: [new Decimal(0), "51", ["70"], "61"],
					col2: [new Decimal(0), "52", ["70"], "62"],
					col3: [new Decimal(0), "53", ["70"], "63"],
					col4: [new Decimal(0), "54", ["70"], "64"],
					col5: [new Decimal(0), "55", ["70"], "65"],
				},
				row7: { col1: [new Decimal(0), ["61", "62", "63", "64"], [""], "70"]},
				row8: {
					col0: [new Decimal(0), "22", [""], "80"],
					col1: [new Decimal(0), "22", [""], "81"],
					col2: [new Decimal(0), "22", ["90"], "82"],
					col3: [new Decimal(0), "22", ["91"], "83"],
					col4: [new Decimal(0), "22", [""], "84"],
					col5: [new Decimal(0), "22", [""], "85"],
					col6: [new Decimal(0), "22", [""], "86"],
					col7: [new Decimal(0), "22", [""], "87"],
				},
				row9: {
					col0: [new Decimal(0), "82", [""], "90"],
					col1: [new Decimal(0), "83", [""], "91"],
				},
			},
		},
		producers: {
			power: new Decimal(10),
			amounts: [new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0)],
			purchased: [new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0)],
			empowered: [new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0)]
		},
		upgrades: [],
		upgradePrices: [],
		lastTick: new Date().getTime(),
	};
}

let player = getDefaultPlayer();
let totalButtons = [[0,0],
		    [1,0],
		    [2,0],[2,1],[2,2],
		    [3,0],[3,1],[3,2],[3,3],[3,4],[3,5],[3,6],[3,7],
		    [4,0],[4,1],[4,2],[4,3],[4,4],[4,5],[4,6],[4,7],
		    [5,0],[5,1],[5,2],[5,3],[5,4],[5,5],
		    [6,0],[6,1],[6,2],[6,3],[6,4],[6,5],
		    [7,0],
		    [8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[8,6],[8,7],
		    [9,0],[9,1]];

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
	if(player.buttons.unlocked.includes("10")) {
		docShow("clicks");
		updateText("clicksRemaining", player.clicks);
	}
	if(player.buttons.unlocked.includes("21")) {
		docShow("powerDisplay");
		updateText("powerAmount", player.producers.power);
	}
	checkPricing();
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

function getProduction() {
	let time = new Date().getTime();
	let x = time-player.lastTick;
	player.lastTick = time;
	time = x;
	console.log(time);
	while(time>0) {
		for(let i=player.producers.amounts.length-1;i>=0;i--) {
			if(i==0) {
				console.log(player.producers.amounts[0]);
				player.producers.power = player.producers.power.plus(
					player.producers.amounts[0].times(
						player.producers.empowered[0].plus(1))
					.times(0.05));
				time-=50;
			}
			else {
				player.producers.amounts[i-1] = player.producers.amounts[i-1].plus(
					player.producers.amounts[i].times(
						player.producers.empowered[i].plus(1))
					.times(0.05));
			}
		}
	}
}

function gameCycle() {
	update();
	getProduction();
}

function startCycle() {
	setInterval(gameCycle, 50);
}
