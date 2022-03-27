addLayer('ach', {

    row: 'side',
    symbol: '<h1 style="margin:0;line-height:32px;font-size:26pt">★</h1>',
    tooltip() { return 'Achievements' },

    tabFormat: [
        ['display-text', '<h1>Achievements</h1>'],
        'blank',
        ['display-text', function() { return `Your achievements boost Antimatter Dimensions by x${__(1.05 ** player.ach.achievements.length, 2, 0)}.`} ],
        ['display-text', '(Some achievements are a work in progress.)', { 'font-size': '10px' } ],
        'blank',
        'achievements'
    ],
    achievementPopups: true,

    achievements: {
        11: {
            name: 'You gotta start somewhere',
            tooltip: '<h4>You gotta start somewhere</h4><br><h5>Buy a 1st Antimatter Dimension.</h5>',
            done() { return player.ad.dimensions[0].gt(0); },
            style: { 'background-position' : '0px 0px' }
        },
        12: {
            name: '100 Antimatter is a lot',
            tooltip: '<h4>100 Antimatter is a lot</h4><br><h5>Buy a 2nd Antimatter Dimension.</h5>',
            done() { return player.ad.dimensions[1].gt(0); },
            style: { 'background-position' : '-64px 0px' }
        },
        13: {
            name: 'Half Life 3 CONFIRMED!',
            tooltip: '<h4>Half Life 3 CONFIRMED!</h4><br><h5>Buy a 3rd Antimatter Dimension.</h5>',
            done() { return player.ad.dimensions[2].gt(0); },
            style: { 'background-position' : '-128px 0px' }
        },
        14: {
            name: 'L4D: Left 4 Dimensions',
            tooltip: '<h4>L4D: Left 4 Dimensions</h4><br><h5>Buy a 4th Antimatter Dimension.</h5>',
            done() { return player.ad.dimensions[3].gt(0); },
            style: { 'background-position' : '-192px 0px' }
        },
        15: {
            name: '5 Dimension Antimatter Punch',
            tooltip: '<h4>5 Dimension Antimatter Punch</h4><br><h5>Buy a 5th Antimatter Dimension.</h5>',
            done() { return player.ad.dimensions[4].gt(0); },
            style: { 'background-position' : '-256px 0px' }
        },
        16: {
            name: 'We couldn\'t afford 9',
            tooltip: '<h4>We couldn\'t afford 9</h4><br><h5>Buy a 6th Antimatter Dimension.</h5>',
            done() { return player.ad.dimensions[5].gt(0); },
            style: { 'background-position' : '-320px 0px' }
        },
        17: {
            name: 'Not a luck related achievement',
            tooltip: '<h4>Not a luck related achievement</h4><br><h5>Buy a 7th Antimatter Dimension.</h5>',
            done() { return player.ad.dimensions[6].gt(0); },
            style: { 'background-position' : '-384px 0px' }
        },
        18: {
            name: '90 degrees to infinity',
            tooltip: '<h4>90 degrees to infinity</h4><br><h5>Buy an 8th Antimatter Dimension.</h5>',
            done() { return player.ad.dimensions[7].gt(0); },
            style: { 'background-position' : '-448px 0px' }
        },
        19: {
            name: 'The Boosting Era',
            tooltip: '<h4>The Boosting Era</h4><br><h5>Perform a Booster Reset.</h5>',
            done() { return player.bd.unlocked; },
            style: { 'background-position' : '-512px 0px' }
        },
        
        21: {
            name: 'Age of Automation',
            tooltip: '<h4>Age of Automation</h4><br><h5>Have all the Autobuyer upgrades.</h5>',
            done() { return (
                hasUpgrade('ad', 'ab-1') &&
                hasUpgrade('ad', 'ab-2') &&
                hasUpgrade('ad', 'ab-3') &&
                hasUpgrade('ad', 'ab-4') &&
                hasUpgrade('ad', 'ab-5') &&
                hasUpgrade('ad', 'ab-6') &&
                hasUpgrade('ad', 'ab-7') &&
                hasUpgrade('ad', 'ab-8') &&
                hasUpgrade('ad', 'ab-t') &&
                hasUpgrade('ad', 'ab-s')
            ); },
            style: { 'background-position' : '0px -64px' }
        },
        22: {
            name: 'Age of Shifting',
            tooltip: '<h4>Age of Shifting</h4><br><h5>Have all the Shift upgrades from Booster Dimensions.</h5>',
            done() { return (
                hasUpgrade('bd', 'keep-1') &&
                hasUpgrade('bd', 'keep-2') &&
                hasUpgrade('bd', 'keep-3') &&
                hasUpgrade('bd', 'keep-4')
            ); },
            style: { 'background-position' : '-64px -64px' }
        },
        23: {
            name: 'The 9th Dimension is a lie',
            tooltip: '<h4>The 9th Dimension is a lie</h4><br><h5>Have exactly 99 8th Animatter Dimensions. Reward: 8th Dimensions are 10% stronger.</h5>',
            done() { return player.ad.dimensions[7].eq(99); },
            style: { 'background-position' : '-128px -64px' }
        },
        24: {
            name: 'Antimatter Apocalypse',
            tooltip: '<h4>Antimatter Apocalypse</h4><br><h5>Get over 1e200 antimatter.</h5>',
            done() { return player.points.gt(1e200); },
            style: { 'background-position' : '-192px -64px' }
        },
        25: {
            name: 'Boosting to the max',
            tooltip: '<h4>Boosting to the max</h4><br><h5>Get at least 1 Booster Power/second. Reward: Booster Power/second is 10% more effective.</h5>',
            done() { return tmp.bd.power.perSecond.gt(1); },
            style: { 'background-position' : '-256px -64px' }
        },
        26: {
            name: 'You got past the Big Wall',
            tooltip: '<h4>You got past the Big Wall</h4><br><h5>Gain your first Galactic Points.</h5>',
            done() { return player.g.points.gte(1); },
            style: { 'background-position' : '-320px -64px' }
        },
        27: {
            name: 'To Infinity?',
            tooltip: '<h4>To Infinity?</h4><br><h5>Have 1.79e308 Antimatter.</h5>',
            done() { return player.points.gte('1.79e308'); },
            style: { 'background-position' : '-384px -64px' }
        },
        28: {
            name: 'A long time later',
            tooltip: '<h4>A long time later</h4><br><h5>Get your booster gain per second to 0.000 BP/s. Reward: Booster gain minimum is always 0.001 BPS.<br><br>NOTE: You can\'t get this after the last milestone.</h5>',
            done() { return tmp.bd.power.perSecond.lte(0.001); },
            style: { 'background-position' : '-448px -64px' }
        },
        29: {
            name: 'That\'s a lot',
            tooltip: '<h4>That\'s a lot</h4><br><h5>Have 1 billion Booster Points. Reward: All Antimatter Dimensions are 10% more effective.</h5>',
            done() { return player.bd.points.gte(1e9); },
            style: { 'background-position' : '-512px -64px' }
        },
        31: {
            name: 'Professional Speedrunner',
            tooltip: '<h4>Professional Speedrunner</h4><br><h5>Get your best booster run time under 400ms.</h5>',
            done() { return player.bd.lowestTime < 0.4; },
            style: { 'background-position' : '-384px -128px' }
        },
        32: {
            name: 'That\'s not how it works',
            tooltip: '<h4>That\'s not how it works</h4><br><h5>Let your booster run time exceed 1 hour.</h5>',
            done() { return player.bd.timeInCurrentAD >= 3600; },
            style: { 'background-position' : '-256px -256px' }
        },
        33: {
            name: 'Lazy Bastard',
            tooltip: '<h4>Lazy Bastard</h4><br><h5>Let your merge/sec exceed your spawn rate/sec.</h5>',
            done() { return tmp.g.spawnRate > tmp.g.mergeRate },
            style: { 'background-position' : '-512px -320px' }
        },
        34: {
            name: 'Ironic',
            tooltip: '<h4>Ironic</h4><br><h5>Get your first iron (Fe) atom.</h5>',
            done() { 
                let sumOfFe = new Decimal(0);
                for(let y = 1; y <= tmp.g.grid.cols; y++) {
                    for(let x = 1; x <= tmp.g.grid.rows; x++) {
                        let id = 100 * y + x;
                        if(getGridData('g', id) == IRON) {
                            sumOfFe = sumOfFe.plus(1);
                        }
                    }
                }
                return sumOfFe.gte(1) },
            style: { 'background-position' : '-512px -384px' }
        },
        35: {
            name: 'Super explosion',
            tooltip: '<h4>Super explosion</h4><br><h5>Trigger a supernova.</h5>',
            done() { return tmp.g.starPower > 1 },
            style: { 'background-position' : '-512px -448px' }
        },
        36: {
            name: 'Exponential Solar Power',
            tooltip: '<h4>Exponential Solar Power</h4><br><h5>Get your Star Power to >= ^2. Reward: Additional +1 to Star Power.</h5>',
            done() { return tmp.g.starPower > 2 },
            style: { 'background-position' : '-512px -512px' }
        },
        37: {
            name: 'Iron Age',
            tooltip: '<h4>Iron Age</h4><br><h5>Get 6 iron atoms. Reward: Additional +1 to Star Power.</h5>',
            done() { 
                let sumOfFe = new Decimal(0);
                for(let y = 1; y <= tmp.g.grid.cols; y++) {
                    for(let x = 1; x <= tmp.g.grid.rows; x++) {
                        let id = 100 * y + x;
                        if(getGridData('g', id) == IRON) {
                            sumOfFe = sumOfFe.plus(1);
                        }
                    }
                }
                return sumOfFe.gte(6)
            },
            style: { 'background-position' : '-512px -576px' }
        },
        38: {
            name: 'We COULD afford 9!',
            tooltip: '<h4>We COULD afford 9!</h4><br><h5>Get above 9e999 antimatter.</h5>',
            done() { return player.points.gte('9e999') },
            style: { 'background-position' : '-512px -640px' }
        },
        39: {
            name: 'You win!',
            tooltip: '<h4>You win!</h4><br><h5>Get 1e1024 antimatter. Reward: A sense of accomplishment.</h5>',
            done() { return player.points.gte('1e1024') },
            style: { 'background-position' : '-512px -704px' }
        },
    }

});
