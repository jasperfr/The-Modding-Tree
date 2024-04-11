addLayer('ach', {

    row: 'side',
    symbol: '<h1 style="margin:0;line-height:32px;font-size:26pt">★</h1>',
    tooltip: 'Achievements',

    multiplier() {
        let gain = 1.05 ** player.ach.achievements.length;
        return gain;
    },

    tabFormat: [
        ['display-text', '<h1>Achievements</h1>'],
        'blank',
        ['display-text', function() { return `Your achievements boost Antimatter Dimensions by x${__(tmp.ach.multiplier, 2, 0)}.`} ],
        ['display-text', '(Some achievements are a work in progress.)', { 'font-size': '10px' } ],
        'blank',
        'achievements'
    ],
    achievementPopups: true,

    achievements: {
        11: {
            name: 'You gotta start somewhere',
            tooltip: '<h4>You gotta start somewhere</h4><br><h5>Buy a 1st Antimatter Dimension.</h5>',
            done() { return player.a.dimensions[0].gt(0); },
            style: { 'background-position' : '0px 0px' }
        },
        12: {
            name: '100 Antimatter is a lot',
            tooltip: '<h4>100 Antimatter is a lot</h4><br><h5>Buy a 2nd Antimatter Dimension.</h5>',
            done() { return player.a.dimensions[1].gt(0); },
            style: { 'background-position' : '-64px 0px' }
        },
        13: {
            name: 'Half Life 3 CONFIRMED!',
            tooltip: '<h4>Half Life 3 CONFIRMED!</h4><br><h5>Buy a 3rd Antimatter Dimension.</h5>',
            done() { return player.a.dimensions[2].gt(0); },
            style: { 'background-position' : '-128px 0px' }
        },
        14: {
            name: 'L4D: Left 4 Dimensions',
            tooltip: '<h4>L4D: Left 4 Dimensions</h4><br><h5>Buy a 4th Antimatter Dimension.</h5>',
            done() { return player.a.dimensions[3].gt(0); },
            style: { 'background-position' : '-192px 0px' }
        },
        15: {
            name: '5 Dimension Antimatter Punch',
            tooltip: '<h4>5 Dimension Antimatter Punch</h4><br><h5>Buy a 5th Antimatter Dimension.</h5>',
            done() { return player.a.dimensions[4].gt(0); },
            style: { 'background-position' : '-256px 0px' }
        },
        16: {
            name: 'We couldn\'t afford 9',
            tooltip: '<h4>We couldn\'t afford 9</h4><br><h5>Buy a 6th Antimatter Dimension.</h5>',
            done() { return player.a.dimensions[5].gt(0); },
            style: { 'background-position' : '-320px 0px' }
        },
        17: {
            name: 'Not a luck related achievement',
            tooltip: '<h4>Not a luck related achievement</h4><br><h5>Buy a 7th Antimatter Dimension.</h5>',
            done() { return player.a.dimensions[6].gt(0); },
            style: { 'background-position' : '-384px 0px' }
        },
        18: {
            name: '90 degrees to infinity',
            tooltip: '<h4>90 degrees to infinity</h4><br><h5>Buy an 8th Antimatter Dimension.</h5>',
            done() { return player.a.dimensions[7].gt(0); },
            style: { 'background-position' : '-448px 0px' }
        },
        19: {
            name: 'This is not a reference',
            tooltip: '<h4>This is not a reference</h4><br><h5>Unlock Kinetic Machines.</h5>',
            done() { return false; },
            style: { 'background-position' : '-512px 0px' }
        },
        
        21: {
            name: 'Don\'t name it that',
            tooltip: '<h4>Don\'t name it that</h4><br><h5>Name your cult "Impmouse". Reward: My sincere apologies for this awful reference.</h5>',
            done() { return false; },
            style: { 'background-position' : '0px -64px' }
        },
        22: {
            name: 'Age of Shifting',
            tooltip: '<h4>Age of Shifting</h4><br><h5>Have all the Shift upgrades from Booster Dimensions.</h5>',
            done() { return false; },
            style: { 'background-position' : '-64px -64px' }
        },
        23: {
            name: 'The 9th Dimension is a lie',
            tooltip: '<h4>The 9th Dimension is a lie</h4><br><h5>Have exactly 99 8th Animatter Dimensions. Reward: 8th Dimensions are 10% stronger.</h5>',
            done() { return false; },
            style: { 'background-position' : '-128px -64px' }
        },
        24: {
            name: 'Antimatter Apocalypse',
            tooltip: '<h4>Antimatter Apocalypse</h4><br><h5>Get over 1e200 antimatter.</h5>',
            done() { return false; },
            style: { 'background-position' : '-192px -64px' }
        },
        25: {
            name: 'Boosting to the max',
            tooltip: '<h4>Boosting to the max</h4><br><h5>Get at least 1 Booster Power/second. Reward: Booster Power/second is 10% more effective.</h5>',
            done() { return false; },
            style: { 'background-position' : '-256px -64px' }
        },
        26: {
            name: 'You got past the Big Wall',
            tooltip: '<h4>You got past the Big Wall</h4><br><h5>Gain your first Galactic Points.</h5>',
            done() { return false; },
            style: { 'background-position' : '-320px -64px' }
        },
        27: {
            name: 'To Infinity?',
            tooltip: '<h4>To Infinity?</h4><br><h5>Have 1.79e308 Antimatter.</h5>',
            done() { return false; },
            style: { 'background-position' : '-384px -64px' }
        },
        28: {
            name: 'A long time later',
            tooltip: '<h4>A long time later</h4><br><h5>Get your booster gain per second to 0.000 BP/s. Reward: Booster gain minimum is always 0.001 BPS.<br><br>NOTE: You can\'t get this after the last milestone.</h5>',
            done() { return false; },
            style: { 'background-position' : '-448px -64px' }
        },
        29: {
            name: 'That\'s a lot',
            tooltip: '<h4>That\'s a lot</h4><br><h5>Have 1 billion Booster Points. Reward: All Antimatter Dimensions are 10% more effective.</h5>',
            done() { return false; },
            style: { 'background-position' : '-512px -64px' }
        },
        31: {
            name: 'Professional Speedrunner',
            tooltip: '<h4>Professional Speedrunner</h4><br><h5>Get your best booster run time under 400ms.</h5>',
            done() { return false; },
            style: { 'background-position' : '-384px -128px' }
        },
        32: {
            name: 'That\'s not how it works',
            tooltip: '<h4>That\'s not how it works</h4><br><h5>Let your booster run time exceed 1 hour.</h5>',
            done() { return false; },
            style: { 'background-position' : '-256px -256px' }
        },
        33: {
            name: 'Lazy Bastard',
            tooltip: '<h4>Lazy Bastard</h4><br><h5>Let your merge/sec exceed your spawn rate/sec.</h5>',
            done() { return false; },
            style: { 'background-position' : '-512px -320px' }
        },
        34: {
            name: 'Ironic',
            tooltip: '<h4>Ironic</h4><br><h5>Get your first iron (Fe) atom.</h5>',
            done() { return false; },
            style: { 'background-position' : '-512px -384px' }
        },
        35: {
            name: 'Super explosion',
            tooltip: '<h4>Super explosion</h4><br><h5>Trigger a supernova.</h5>',
            done() { return false; },
            style: { 'background-position' : '-512px -448px' }
        },
        36: {
            name: 'Exponential Solar Power',
            tooltip: '<h4>Exponential Solar Power</h4><br><h5>Get your Star Power to >= ^2 (outside of the Boostless challenge). Reward: Additional +1 to Star Power.</h5>',
            done() { return false; },
            style: { 'background-position' : '-512px -512px' }
        },
        37: {
            name: 'Iron Age',
            tooltip: '<h4>Iron Age</h4><br><h5>Get 6 iron atoms. Reward: Additional +1 to Star Power.</h5>',
            done() { return false; },
            style: { 'background-position' : '-512px -576px' }
        },
        38: {
            name: 'We COULD afford 9!',
            tooltip: '<h4>We COULD afford 9!</h4><br><h5>Get above 9e999 antimatter.</h5>',
            done() { return player.points.gte('9e999') },
            style: { 'background-position' : '-512px -640px' }
        },
        39: {
            name: 'Crunched',
            tooltip: '<h4>Crunched</h4><br><h5>Get 1e1024 antimatter. Reward: A sense of accomplishment, and 1 Infinity Point.</h5>',
            done() { return player.points.gte('1e1024') },
            style: { 'background-position' : '-512px -704px' }
        },
        41: {
            name: 'Deja Vu',
            tooltip: '<h4>Deja Vu</h4><br><h5>Complete challenge 1.</h5>',
            done() { return false; },
            style: { 'background-position' : '-576px 0px' }
        },
        42: {
            name: 'I hate this mechanic',
            tooltip: '<h4>I hate this mechanic</h4><br><h5>Complete challenge 2.</h5>',
            done() { return false; },
            style: { 'background-position' : '-640px 0px' }
        },
        43: {
            name: 'Didn\'t need it',
            tooltip: '<h4>Didn\'t need it</h4><br><h5>Complete challenge 3.</h5>',
            done() { return false; },
            style: { 'background-position' : '-576px -64px' }
        },
        44: {
            name: 'Didn\'t need it either',
            tooltip: '<h4>Didn\'t need it either</h4><br><h5>Complete challenge 4.</h5>',
            done() { return false; },
            style: { 'background-position' : '-640px -64px' }
        },
        45: {
            name: 'This is just AD but worse',
            tooltip: '<h4>This is just AD but worse</h4><br><h5>Complete challenge 5.</h5>',
            done() { return false; },
            style: { 'background-position' : '-576px -128px' }
        },
        46: {
            name: 'Like watching a video on garbage wifi',
            tooltip: '<h4>Like watching a video on garbage wifi</h4><br><h5>Complete challenge 6.</h5>',
            done() { return false; },
            style: { 'background-position' : '-640px -128px' }
        },
        47: {
            name: 'Click spamming',
            tooltip: '<h4>Click spamming</h4><br><h5>Complete challenge 7.</h5>',
            done() { return false; },
            style: { 'background-position' : '-576px -192px' }
        },
        48: {
            name: 'Compact Claustrophobia',
            tooltip: '<h4>Compact Claustrophobia</h4><br><h5>Complete challenge 8.</h5>',
            done() { return false; },
            style: { 'background-position' : '-640px -192px' }
        },
        49: {
            name: 'Can\'t Touch This',
            tooltip: '<h4>Can\'t Touch This</h4><br><h5>Enter the Ultimate Challenge after completing all challenges.</h5>',
            done() { return false; },
            style: { 'background-position' : '-640px -256px' }
        },
        51: {
            name: 'You\'ve really nerfed this challenge',
            tooltip: '<h4>You\'ve really nerfed this challenge</h4><br><h5>Enter challenge 3 after completing Challenge 4.</h5>',
            done() { return false; },
            style: { 'background-position' : '-704px -64px' }
        },
        52: {
            name: 'Decrementy Hell',
            tooltip: '<h4>Decrementy Hell</h4><br><h5>Let your Decrementy exceed 1e308.</h5>',
            done() { return false; },
            style: { 'background-position' : '-576px -256px' }
        },
        53: {
            name: 'HAHA FUNNY AD REFERENCE LAUGH',
            tooltip: '<h4>HAHA FUNNY AD REFERENCE LAUGH</h4><br><h5>Have 1.79e308 matter.</h5>',
            done() { return false; },
            style: { 'background-position' : '-704px -128px' }
        },
        54: {
            name: 'Antichallenged',
            tooltip: '<h4>Antichallenged</h4><br><h5>Complete all challenges.</h5>',
            done() { return false; },
            style: { 'background-position' : '-704px -196px' }
        },
        55: {
            name: 'Antibroken',
            tooltip: '<h4>Antibroken</h4><br><h5>Break Infinity.</h5>',
            done() { return false; },
            style: { 'background-position' : '-576px -320px' }
        },
        56: {
            name: 'Speedy Crunch',
            tooltip: '<h4>Speedy Crunch</h4><br><h5>Big Crunch in under a minute. Reward: x2 to IP gain.</h5>',
            done() { return false; },
            style: { 'background-position' : '-576px -512px' }
        },
        57: {
            name: 'I still hate this mechanic',
            tooltip: '<h4>I still hate this mechanic</h4><br><h5>Enter Challenge 2 after completing all other challenges (except the ultimate challenge).</h5>',
            done() { return false; },
            style: { 'background-position' : '-768px 0px' }
        },
        58: {
            name: 'Didn\'t need it',
            tooltip: '<h4>Didn\'t need it</h4><br><h5>Infinity without getting GP.</h5>',
            done() { return false; },
            style: { 'background-position' : '-640px -512px' }
        },
        59: {
            name: 'Incremental!',
            tooltip: '<h4>Incremental!</h4><br><h5>Unlock Incrementy.</h5>',
            done() { return false; },
            style: { 'background-position' : '-768px -384px' }
        },
        61: {
            name: 'How ordinal!',
            tooltip: '<h4>How ordinal!</h4><br><h5>Unlock your first Ordinal.</h5>',
            done() { return false; },
            style: { 'background-position' : '-768px -448px' }
        },
        62: {
            name: 'Part of the game',
            tooltip: '<h4>Part of the game</h4><br><h5>Get your Incrementy amount to Omega. Reward: x2 to Incrementy gain.</h5>',
            done() { return false; },
            style: { 'background-position' : '-768px -512px' }
        },
        63: {
            name: 'That\'s a lot of omegas',
            tooltip: '<h4>That\'s a lot of omegas</h4><br><h5>Have 10 Omegas in your current Eternity.</h5>',
            done() { return false; },
            style: { 'background-position' : '-768px -576px' }
        },
        64: {
            name: 'You have no idea...',
            tooltip: '<h4>You have no idea...</h4><br><h5>Purchase all Omega Perks. Reward: Omega Power boosts Infinity Dimensions by x1.1 more.</h5>',
            done() { return false; },
            style: { 'background-position' : '-768px -640px' }
        },
        65: {
            name: 'Omegas are the new Replicanti',
            tooltip: '<h4>Omegas are the new Replicanti</h4><br><h5>Get 1.79e308 Omega Power.</h5>',
            done() { return false; },
            style: { 'background-position' : '-768px -704px' }
        },
        66: {
            name: 'New Beginnings',
            tooltip: '<h4>New Beginnings</h4><br><h5>Begin generation of Infinity Power.</h5>',
            done() { return false; },
            style: { 'background-position' : '-128px -320px' }
        },
        67: {
            name: 'Are we there yet',
            tooltip: '<h4>Are we there yet</h4><br><h5>Get 2^1024 (1.79e308) IP.</h5>',
            done() { return false; },
            style: { 'background-position' : '-832px -512px' }
        },
        68: {
            name: 'No Merges?',
            tooltip: '<h4>No Merges?</h4><br><h5>Extend your Galaxies.</h5>',
            done() { return false; },
            style: { 'background-position' : '-832px -576px' }
        },
        69: {
            name: 'Achievement #69',
            tooltip: '<h4>Achievement #69</h4><br><h5>Let your Star Power exceed 6.9e69x.</h5>',
            done() { return false; },
            style: { 'background-position' : '-832px -640px' }
        },
        71: {
            name: '5 hours until the update',
            tooltip: '<h4>5 hours until the update</h4><br><h5>Go Eternal.</h5>',
            done() { return false; },
            style: { 'background-position' : '-320px -512px' }
        },
        72: {
            name: 'Time for...',
            tooltip: '<h4>Time for...</h4><br><h5>Purchase your first 4th Time Dimension.</h5>',
            done() { return false; },
            style: { 'background-position' : '-576px -576px' }
        },
        73: {
            name: 'The Gods are Satisfied',
            tooltip: '<h4>The Gods are Satisfied</h4><br><h5>Infinity without purchasing Tickspeed Upgrades. Reward: Tickspeed upgrades bought manually are 6.66% more effective.</h5>',
            done() { return false; },
            style: { 'background-position' : '-640px -576px' }
        },
        74: {
            name: 'Not Again!',
            tooltip: '<h4>Not Again!</h4><br><h5>Complete your first Eternity Challenge. Don\'t worry, you don\'t need to check Time Studies...</h5>',
            done() { return false; },
            style: { 'background-position' : '-704px -576px' }
        },
        75: {
            name: 'Original Achievement #5123',
            tooltip: '<h4>Original Achievement #5123</h4><br><h5>Start a Challenge inside an Eternity Challenge.</h5>',
            done() { return false; },
            style: { 'background-position' : '-704px -640px' }
        },
        76: {
            name: 'Slooooow doooown',
            tooltip: '<h4>Slooooow doooown</h4><br><h5>Decelerate Time.</h5>',
            done() { return false; },
            style: { 'background-position' : '-640px -640px' }
        },
        77: {
            name: 'My Mechanic Is Better',
            tooltip: '<h4>My Mechanic Is Better</h4><br><h5>Get your first Temporal Dimension.</h5>',
            done() { return false; },
            style: { 'background-position' : '-640px -704px' }
        },
        78: {
            name: 'Hardly a Nerf',
            tooltip: '<h4>Hardly a Nerf</h4><br><h5>Get your total Deceleration amount hardcapped to x0.0000001.</h5>',
            done() { return false; },
            style: { 'background-position' : '-640px -768px' }
        },
        79: {
            name: '5 Hours Until the Next Update',
            tooltip: '<h4>5 Hours Until the Next Update</h4><br><h5>Gain 2e1024 Eternity Points.</h5>',
            done() { return false; },
            style: { 'background-position' : '-704px -704px' }
        },
    }

});
