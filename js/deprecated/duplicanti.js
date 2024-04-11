addLayer('dp', {

    name: 'Duplicanti',
    symbol: 'DP',
    color: '#52db37',
    resource: 'Duplicanti',
    branches: ['g'],

    nodeStyle() {
        return {
            'background-image': 'radial-gradient(circle at center, white, #52db37)'
        }
    },

    startData() { return {                  
        unlocked: true,                     
        points: new Decimal(1),           
        duplicateInterval: new Decimal(10),  
        duplicateTime: new Decimal(10),
    }},

    duplicateNerf() {
        if(player[this.layer].points.lte('1.79e308')) return new Decimal(1);
        return Decimal.divide(1, Decimal.log(player[this.layer].points.div('1.79e308'), 10));
    },

    update(delta) {
        player[this.layer].duplicateTime = player[this.layer].duplicateTime.minus(delta * 1000);
        if(player[this.layer].duplicateTime.lte(0)) {
            player[this.layer].duplicateTime = player[this.layer].duplicateInterval.div(tmp[this.layer].duplicateNerf);
            player[this.layer].points = player[this.layer].points.times(2);
        }
    },

    tabFormat: [
        ['raw-html', function() { return `<h>You have <dp>${__(player[this.layer].points, 3, 1)}</dp> Duplicanti.</h>`; }],
        'blank',
        ['raw-html', function() { return `Your Duplicanti amount multiplies Star Power by <dp>x1.000</dp><br>(log<sub>10</sub>(duplicanti)).`; }],
        // ['raw-html', function() { return `<h>You have <ch>${__(player[this.layer].points, 3, 1)}</ch> Duplicanti Galaxies, multiplying your Galaxy Power by x1.000.</h>`; }],
        'blank',
        "prestige-button",
        'blank',
        ['raw-html', function() { let c = player[this.layer].producing; let n = player[this.layer].next; return  `
            Duplicanti duplicates itself 1 time per ${__(player[this.layer].duplicateInterval.div(1000).div(tmp[this.layer].duplicateNerf), 3, 0)} second(s). <br>
            Time until next duplication: ${__(player[this.layer].duplicateTime.div(1000), 3, 0)}s <br>`
        }],
    ]

});
