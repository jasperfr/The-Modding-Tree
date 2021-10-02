addLayer('ach', {

    row: 'side',
    symbol: 'A',
    tooltip() { return 'Achievements' },

    tabFormat: [
        ['display-text', '<h1>Achievements</h1>'],
        'blank',
        ['display-text', function() { return `Your achievements boost Antimatter Dimensions by x${1.05 ** player.ach.achievements.length}`} ],
        'blank',
        'achievements'
    ],
    achievementPopups: false,

    achievements: {
        11: {
            tooltip: '<h4>You gotta start somewhere</h4><br><h5>Buy a 1st Antimatter Dimension.</h5>',
            done() { return player.ad.dimensions[0].amount > 0; },
            style: { 'background-position' : '0px 0px' }
        },
        12: {
            tooltip: '<h4>100 Antimatter is a lot</h4><br><h5>Buy a 2nd Antimatter Dimension.</h5>',
            done() { return player.ad.dimensions[1].amount > 0; },
            style: { 'background-position' : '-64px 0px' }
        },
        13: {
            tooltip: '<h4>Half Life 3 CONFIRMED!</h4><br><h5>Buy a 3rd Antimatter Dimension.</h5>',
            done() { return player.ad.dimensions[2].amount > 0; },
            style: { 'background-position' : '-128px 0px' }
        },
        14: {
            tooltip: '<h4>L4D: Left 4 Dimensions</h4><br><h5>Buy a 4th Antimatter Dimension.</h5>',
            done() { return player.ad.dimensions[3].amount > 0; },
            style: { 'background-position' : '-192px 0px' }
        },
        15: {
            tooltip: '<h4>5 Dimension Antimatter Punch</h4><br><h5>Buy a 5th Antimatter Dimension.</h5>',
            done() { return player.ad.dimensions[4].amount > 0; },
            style: { 'background-position' : '-256px 0px' }
        },
        16: {
            tooltip: '<h4>We couldn\'t afford 9</h4><br><h5>Buy a 6th Antimatter Dimension.</h5>',
            done() { return player.ad.dimensions[5].amount > 0; },
            style: { 'background-position' : '-320px 0px' }
        },
        17: {
            tooltip: '<h4>Not a luck related achievement</h4><br><h5>Buy a 7th Antimatter Dimension.</h5>',
            done() { return player.ad.dimensions[6].amount > 0; },
            style: { 'background-position' : '-384px 0px' }
        },
        18: {
            tooltip: '<h4>90 degrees to infinity</h4><br><h5>Buy an 8th Antimatter Dimension.</h5>',
            done() { return player.ad.dimensions[7].amount > 0; },
            style: { 'background-position' : '-448px 0px' }
        },
        19: {
            tooltip: '<h4>Half Time-Out</h4><br><h5>Get your tickspeed under 500ms.</h5>',
            done() { return player.ad.tickspeed.speed.lt(500); },
            style: { 'background-position' : '-512px 0px' }
        },
        
        21: {
            tooltip: '<h4>To Infinity!</h4><br><h5>Go Infinite. Reward: Start with 100 antimatter.</h5>',
            done() { return false; },
            style: { 'background-position' : '0px -64px' }
        },
        22: {
            tooltip: '<h4>Fake News</h4><br><h5>Encounter 50 different news messages.</h5>',
            done() { return false; },
            style: { 'background-position' : '-64px -64px' }
        },
        23: {
            tooltip: '<h4>The 9th Dimension is a lie</h4><br><h5>Have exactly 99 8th Animatter Dimensions. Reward: 8th Dimensions are 10% stronger.</h5>',
            done() { return player.ad.dimensions[7].amount.eq(99); },
            style: { 'background-position' : '-128px -64px' }
        },
        24: {
            tooltip: '<h4>Antimatter Apocalypse</h4><br><h5>Get over 1e80 antimatter.</h5>',
            done() { return player.points.gt(1e80); },
            style: { 'background-position' : '-192px -64px' }
        },
        29: {
            tooltip: '<h4>...to the max!</h4><br><h5>Buy 10 Dimension Boosts.</h5>',
            done() { return player.ad.boosts.amount >= 10; },
            style: { 'background-position' : '-256px -64px' }
        },
        26: {
            tooltip: '<h4>You got past the Big Wall</h4><br><h5>Buy an Antimatter Galaxy.</h5>',
            done() { return player.ad.galaxies.amount > 0; },
            style: { 'background-position' : '-320px -64px' }
        },
        27: {
            tooltip: '<h4>Double Galaxy</h4><br><h5>Buy 2 Antimatter Galaxies.</h5>',
            done() { return player.ad.galaxies.amount > 1; },
            style: { 'background-position' : '-384px -64px' }
        },
        28: {
            tooltip: '<h4>There\'s no point in doing that</h4><br><h5>Buy a single 1st Dimension when you have over 1e150 of them.</h5>',
            done() { return false; },
            style: { 'background-position' : '-448px -64px' }
        },
        25: {
            tooltip: '<h4>Boosting...</h4><br><h5>Boost 1 time.</h5>',
            done() { return player.ad.boosts.amount >= 1; },
            style: { 'background-position' : '-512px -64px' }
        },
    }

});
