function isDevBuild() { return VERSION.num.endsWith('dev') }

let modInfo = {
	name: "Antreematter Dimensions",
	id: "antreematter",
	author: "jasperfr",
	pointsName: "antimatter",
	modFiles: ['antimatter.js', 'booster.js', 'galaxy.js', "tree.js"],
	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal(10), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.99a",
	name: "Antreematter Dimensions",
}

let changelog = `<h1>Changelog:</h1><br>
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

let winText = `Congratulations! You have reached Infinity, and thus the end of the alpha version. More to come eventually.`

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

	let gain = player.ad.dimensions[0]
		.times(tmp.ad.buyables['dimension-1'].multiplier)
		.times(Decimal.pow(1.5, player.ad.shifts))
		.times(player.bd.multiplier)
		.times(tmp.ad.tickspeed.multiplier)
	
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	isDevBuild() && 'DEVELOPMENT MODE'
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gt(new Decimal('1e1000'));
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