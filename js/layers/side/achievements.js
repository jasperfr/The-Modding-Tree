addLayer('ach', {

    row: 'side',
    symbol: '<h1 style="margin:0;line-height:32px;font-size:26pt">★</h1>',
    tooltip() { return 'Achievements' },

    multiplier() {
        let gain = 1.05 ** player.ach.achievements.length;
        if(hasUpgrade('infinity', 'achievementBonus')) gain **= 1.5;
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
                getClickableState('ad', 'ab-1') === 'Enabled' && 
                getClickableState('ad', 'ab-2') === 'Enabled' && 
                getClickableState('ad', 'ab-3') === 'Enabled' && 
                getClickableState('ad', 'ab-4') === 'Enabled' && 
                getClickableState('ad', 'ab-5') === 'Enabled' && 
                getClickableState('ad', 'ab-6') === 'Enabled' && 
                getClickableState('ad', 'ab-7') === 'Enabled' && 
                getClickableState('ad', 'ab-8') === 'Enabled' && 
                getClickableState('ad', 'ab-t') === 'Enabled' && 
                getClickableState('ad', 'ab-s') === 'Enabled'
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
            done() { return player.bd.unlocked && tmp.bd.power.perSecond.lte(0.001); },
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
            tooltip: '<h4>Exponential Solar Power</h4><br><h5>Get your Star Power to >= ^2 (outside of the Boostless challenge). Reward: Additional +1 to Star Power.</h5>',
            done() { return !inChallenge('infinity', 21) && tmp.g.starPower > 2 },
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
            name: 'Crunched',
            tooltip: '<h4>Crunched</h4><br><h5>Get 1e1024 antimatter. Reward: A sense of accomplishment, and 1 Infinity Point.</h5>',
            done() { return player.points.gte('1e1024') },
            style: { 'background-position' : '-512px -704px' }
        },
        41: {
            name: 'Deja Vu',
            tooltip: '<h4>Deja Vu</h4><br><h5>Complete challenge 1.</h5>',
            done() { return hasChallenge('infinity', 11) },
            style: { 'background-position' : '-576px 0px' }
        },
        42: {
            name: 'I hate this mechanic',
            tooltip: '<h4>I hate this mechanic</h4><br><h5>Complete challenge 2.</h5>',
            done() { return hasChallenge('infinity', 12) },
            style: { 'background-position' : '-640px 0px' }
        },
        43: {
            name: 'Didn\'t need it',
            tooltip: '<h4>Didn\'t need it</h4><br><h5>Complete challenge 3.</h5>',
            done() { return hasChallenge('infinity', 21) },
            style: { 'background-position' : '-576px -64px' }
        },
        44: {
            name: 'Didn\'t need it either',
            tooltip: '<h4>Didn\'t need it either</h4><br><h5>Complete challenge 4.</h5>',
            done() { return hasChallenge('infinity', 22) },
            style: { 'background-position' : '-640px -64px' }
        },
        45: {
            name: 'This is just AD but worse',
            tooltip: '<h4>This is just AD but worse</h4><br><h5>Complete challenge 5.</h5>',
            done() { return hasChallenge('infinity', 31) },
            style: { 'background-position' : '-576px -128px' }
        },
        46: {
            name: 'Like watching a video on garbage wifi',
            tooltip: '<h4>Like watching a video on garbage wifi</h4><br><h5>Complete challenge 6.</h5>',
            done() { return hasChallenge('infinity', 32) },
            style: { 'background-position' : '-640px -128px' }
        },
        47: {
            name: 'Click spamming',
            tooltip: '<h4>Click spamming</h4><br><h5>Complete challenge 7.</h5>',
            done() { return hasChallenge('infinity', 41) },
            style: { 'background-position' : '-576px -192px' }
        },
        48: {
            name: 'Compact Claustrophobia',
            tooltip: '<h4>Compact Claustrophobia</h4><br><h5>Complete challenge 8.</h5>',
            done() { return hasChallenge('infinity', 42) },
            style: { 'background-position' : '-640px -192px' }
        },
        49: {
            name: 'Can\'t Touch This',
            tooltip: '<h4>Can\'t Touch This</h4><br><h5>Enter the Ultimate Challenge after completing all challenges.</h5>',
            done() { return hasChallenge('infinity', 11)
                        && hasChallenge('infinity', 12)
                        && hasChallenge('infinity', 21)
                        && hasChallenge('infinity', 22)
                        && hasChallenge('infinity', 31)
                        && hasChallenge('infinity', 32)
                        && hasChallenge('infinity', 41)
                        && hasChallenge('infinity', 42)
                        && inChallenge('infinity', 51)
                },
            style: { 'background-position' : '-640px -256px' }
        },
        51: {
            name: 'You\'ve really nerfed this challenge',
            tooltip: '<h4>You\'ve really nerfed this challenge</h4><br><h5>Enter challenge 3 after completing Challenge 4.</h5>',
            done() { return hasChallenge('infinity', 22) && inChallenge('infinity', 21) },
            style: { 'background-position' : '-704px -64px' }
        },
        52: {
            name: 'Decrementy Hell',
            tooltip: '<h4>Decrementy Hell</h4><br><h5>Let your Decrementy exceed e1e12. [UNIMPLEMENTED]</h5>',
            done() { return false; },
            style: { 'background-position' : '-576px -256px' }
        },
        53: {
            name: 'HAHA FUNNY AD REFERENCE LAUGH',
            tooltip: '<h4>HAHA FUNNY AD REFERENCE LAUGH</h4><br><h5>Have 1.79e308 matter.</h5>',
            done() { return player.ad.matter.gte('1.79e308'); },
            style: { 'background-position' : '-704px -128px' }
        },
        54: {
            name: 'Antichallenged',
            tooltip: '<h4>Antichallenged</h4><br><h5>Complete all challenges.</h5>',
            done() { return hasChallenge('infinity', 11)
                    && hasChallenge('infinity', 12)
                    && hasChallenge('infinity', 21)
                    && hasChallenge('infinity', 22)
                    && hasChallenge('infinity', 31)
                    && hasChallenge('infinity', 32)
                    && hasChallenge('infinity', 41)
                    && hasChallenge('infinity', 42)
                    && hasChallenge('infinity', 51); },
            style: { 'background-position' : '-704px -196px' }
        },
        55: {
            name: 'Antibroken',
            tooltip: '<h4>Antibroken</h4><br><h5>Break Infinity.</h5>',
            done() { return player.infinity.broken == true; },
            style: { 'background-position' : '-576px -320px' }
        },
        56: {
            name: 'On second thought',
            tooltip: '<h4>On second thought</h4><br><h5>Fix Infinity. [UNIMPLEMENTED]</h5>',
            done() { return false; },
            style: { 'background-position' : '-640px -320px' }
        },
        57: {
            name: 'AAAAHHHH',
            tooltip: '<h4>AAAAHHHH</h4><br><h5>Fix infinity after nerfing the cost scaling to 1.0x. [UNIMPLEMENTED]</h5>',
            done() { return false; },
            style: { 'background-position' : '-704px -256px' }
        }
    }

});
