function isDevBuild() { return VERSION.num.endsWith('dev') }

function resetPoints() {
	if(player.infinity.unlocked) {
		player.points = new Decimal(100);
	} else {
		player.points = new Decimal(10);
	}
}

let modInfo = {
	name: "Antreematter Dimensions",
	id: "antreematter",
	author: "jasperfr",
	pointsName: "antimatter",
	modFiles: [
		'tree.js',
		'layers/misc/elements.js',
		'layers/antimatter.js',
		'layers/booster.js',
		'layers/galaxy.js',
		'layers/galaxy-extended.js',
		'layers/infinity.js',
		'layers/chroma.js',
		'layers/duplicanti.js',

		'layers/challenges/true-antimatter.js',
		'layers/challenges/2048.js',
		'layers/challenges/decrementy.js',

		'layers/misc/crunch.js',

		'layers/side/achievements.js',
		'layers/side/saves.js',
		'layers/side/debugger.js'
		
	],
	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal(10), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "1.6.0",
	name: "The Maximum Update",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v1.6.0</h3><br>
		- Buy Max is finally fixed!<br>
	<h3>v1.5.0</h3><br>
		- New styling across the entire game<br>
		- Revamped the Infinity Study tree to actually be useful<br>
		- Fixed the bug where the galaxy speed upgrade study doesn't work<br>
		- Hardcapped cost scaling break infinity button to 1.50x<br>
		- Balanced out challenges for the infinity studies<br>
		- Galaxy atoms above are hopefully fixed<br>
	<h3>v1.4.0</h3><br>
		- Added Break Infinity upgrades<br>
		- Fixed most bugs concering unlocking layers when exiting challenges (I hope)<br>
		- Added option to toggle elements or numbers on galaxy grid<br>
		- Added layer saves subtab to quickly jump between layers (for debugging purposes)<br>
		- Endgame is now 4096 IP<br>
	<h3>v1.3.0</h3><br>
		- Fixed challenges<br>
		- Rebalanced challenges based on cost scaling<br>
		- New achievements<br>
		- Added hotkeys for booster and galaxy layer<br>
		- Various bugfixes to challenges<br>
		- Various bugfixes to loading times<br>
		- QOL improvements to displays<br>
		- Made Challenge 1 and 7 more forgiving<br>
	<h3>v1.2.0</h3><br>
		- Added challenges<br>
		- Added new icons<br>
		- Various fixes to autobuyers<br>
		- Hidden unused Infinity Studies for the time being<br>
		- Endgame is now Break Infinity<br>
	<h3>v1.1.0</h3><br>
		- Fixed autobuyers<br>
		- De-nerfed Booster Layer<br>
		- Galaxy layer is easier to obtain<br>
		- Added statistics page for Booster Layer<br>
	<h3>v1.0</h3><br>
		- Achievements!<br>
		- Fixed galaxy layer.<br>
		- Added supernova for galaxy layer.<br>
		- Added a beautiful discord embedded image.<br><br>
	<h3>v0.99.999</h3><br>
		- Achievements!<br>
		- Fixed booster upgrades.<br>
		- Added booster milestones.<br>
		- Fixed booster upgrades.<br>
		- You can now toggle autobuyers.<br>
		- Removed the galaxy layer again because it's a trash mechanic<br>
		- Added a beautiful discord embedded image.<br><br>
	<h3>v0.99a</h3><br>
		- Added Booster Dimensions.<br>
		- Added the first Booster Upgrades.<br><br>
	<h3>v0.89a</h3><br>
		- Added Autobuyers.<br>
		- Completely revamped the game and fixed most if not all functions.<br>
		- Changed styling to something more fancy.<br>
		- Antimatter Dimensions formatted to work on displays down to 768p devices.<br>
		- Dimensional Shifts now give a 2.0x multiplier to <b>all dimensions</b><br>
		! Removed galaxies in this version, next update will bring them back (and better)<br><br>
	<h3>v0.7a</h3><br>
		- Added Booster Dimensions.<br>
		- Added first Booster Dimension upgrade.<br><br>
	<h3>v0.6a</h3><br>
		- Fixed startData() and moved functions out of it.<br>
		- Added more hotkeys<br>
		- General performance fixes<br>
		- Fixed end game screen<br><br>
	<h3>v0.5a</h3><br>
		- Added Antimatter Dimentions.<br>
		- Added first 2 rows of achievements.<br>
`

let winText = `Congratulations! You have gained 4096 IP, and thus moved to the end of the alpha version. More to come eventually.`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	if(inChallenge('infinity', 11)) {
        let shiftCount = getBuyableAmount('ta', 'shiftboost').toNumber();
		let gain = player.ta.dimensions[0]
		.times(tmp.ta.tickspeed.multiplier)
		.times(tmp.ta.buyables['dimension-1'].multiplier)
		.times(2 ** shiftCount)
		.times(1.05 ** player.ach.achievements.length)
		.times(10);
		return gain;
	}

	let gain = player.ad.dimensions[0]
		.times(tmp.ad.buyables['dimension-1'].multiplier)
		.times(tmp.ad.tickspeed.multiplier)
		.times(2 ** player.ad.shifts)
		.times(hasUpgrade('infinity', 'boostTimePlayed') ? upgradeEffect('infinity', 'boostTimePlayed') : 1.0)
		.times(hasAchievement('ach', 29) ? 1.1 : 1.0)
		.times(tmp.g.multiplier)
		.times(inChallenge('infinity', 21) ? 1.0 : tmp.bd.power.multiplier)
		.div(tmp.ad.matter.divider)
		.times(tmp.d.decrementy.effectAD)
		.times(1.05 ** player.ach.achievements.length)
		.times(hasUpgrade('infinity', 'x1e10Boost') ? 1e10 : 1)
		.times(tmp.infinity.buyables[6].effect)
		.times(tmp.infinity.power.multiplier)
	
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
	godMode: false,
}}

// Display extra things at the top of the page
var displayThings = [
	isDevBuild() && 'DEVELOPMENT MODE'
]

// Determines when the game "ends"
function isEndgame() {
	return player.infinity.points.gte(4096);
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}