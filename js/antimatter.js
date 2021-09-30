addLayer('ad', {

    name: 'Antimatter Dimensions',
    symbol: 'AD',
    color: '#914339',
    row: 0,

    baseResource: 'antimatter',

    startData() {
        return {
            points: new Decimal(0),
            tickspeed: {
                speed: new Decimal(1000.0),
                decrease: new Decimal(11), // reduce by 11% = (11 / 100) * speed
                cost: new Decimal(1e3),
                costMultiplier: 10
            },
            dimensions: [
                {
                    amount: new Decimal(0),
                    multiplier: new Decimal(1.0),
                    until10: 0,
                    unlocked: true,
                    cost: new Decimal(10),
                    costMultiplier: 1e3
                },
                {
                    amount: new Decimal(0),
                    multiplier: new Decimal(1.0),
                    until10: 0,
                    unlocked: true,
                    cost: new Decimal(100),
                    costMultiplier: 1e4
                },
                {
                    amount: new Decimal(0),
                    multiplier: new Decimal(1.0),
                    until10: 0,
                    unlocked: true,
                    cost: new Decimal(1e4),
                    costMultiplier: 1e5,
                },
                {
                    amount: new Decimal(0),
                    multiplier: new Decimal(1.0),
                    until10: 0,
                    unlocked: true,
                    cost: new Decimal(1e6),
                    costMultiplier: 1e6,
                }
            ],

            buyTickspeed(max) {
                const tickspeed = player.ad.tickspeed;
                if(max) {
                    while(player.points.gte(player.ad.tickspeed.cost)) {
                        player.points = player.points.minus(tickspeed.cost);
                        tickspeed.cost = tickspeed.cost.times(tickspeed.costMultiplier);
                        tickspeed.speed = tickspeed.speed.minus(tickspeed.speed.times(tickspeed.decrease.divide(100)));
                    }
                } else {
                    player.points = player.points.minus(tickspeed.cost);
                    tickspeed.cost = tickspeed.cost.times(tickspeed.costMultiplier);
                    tickspeed.speed = tickspeed.speed.minus(tickspeed.speed.times(tickspeed.decrease.divide(100)));
                }
            },

            buyDimension(dimension, until10) {
                const self = player.ad;
                const dim = self.dimensions[dimension];
                if(until10) {
                    while(dim.until10 < 10) {
                        dim.amount = dim.amount.plus(1);
                        player.points = player.points.minus(dim.cost);
                        dim.until10++;
                    }
                    dim.until10 = 0;
                    dim.multiplier = dim.multiplier.times(2.0);
                    dim.cost = dim.cost.times(dim.costMultiplier);
                } else {
                    dim.amount = dim.amount.plus(1);
                    player.points = player.points.minus(dim.cost);
                    dim.until10++;
                    if(dim.until10 == 10) {
                        dim.until10 = 0;
                        dim.multiplier = dim.multiplier.times(2.0);
                        dim.cost = dim.cost.times(dim.costMultiplier);
                    }
                }
            },
        }
    },

    update(delta) {
        let self = player.ad;
        for(let i = 0; i < self.dimensions.length - 1; i++) {
            self.dimensions[i].amount = self.dimensions[i].amount.add(self.dimensions[i+1].amount.times(delta).times(self.dimensions[i+1].multiplier).times(new Decimal(1000).divide(self.tickspeed.speed)));
        }
    },

    tooltip() { return '' },
    
    tabFormat: [
        ['display-text', '<h1>Dimensions</h1>'],'blank',
        ['display-text', function() { return `<h4>Reduce the tick interval by ${player.ad.tickspeed.decrease}%.</h4>` }],
        ['row', [['clickable', 't'], ['clickable', 't-max']]],
        ['display-text', function() { return `<h4>Tickspeed: ${player.ad.tickspeed.speed}</h4>` }],
        'blank','blank',


        ['row', [
            ['display-text', function() { return `${format(player[this.layer].dimensions[0].amount.round())} 1st Dimensions` }],'blank',
            ['display-text', function() { return `x${format(player[this.layer].dimensions[0].multiplier)}` }],'blank',
            ['clickable', 'd1-1'],'blank',['clickable', 'd1-10']
        ]],

        ['row', [
            ['display-text', function() { return `${(player[this.layer].dimensions[1].amount.round())} 2nd Dimensions` }],'blank',
            ['display-text', function() { return `x${format(player[this.layer].dimensions[1].multiplier)}` }],'blank',
            ['clickable', 'd2-1'],'blank',['clickable', 'd2-10']
        ]],

        ['row', [
            ['display-text', function() { return `${(player[this.layer].dimensions[2].amount.round())} 3rd Dimensions` }],'blank',
            ['display-text', function() { return `x${format(player[this.layer].dimensions[2].multiplier)}` }],'blank',
            ['clickable', 'd3-1'],'blank',['clickable', 'd3-10']
        ]],

        ['row', [
            ['display-text', function() { return `${(player[this.layer].dimensions[3].amount.round())} 4th Dimensions` }],'blank',
            ['display-text', function() { return `x${format(player[this.layer].dimensions[3].multiplier)}` }],'blank',
            ['clickable', 'd4-1'],'blank',['clickable', 'd4-10']
        ]],

        'blank',
        ['row', [
            ['clickable', 'shift'],
            'blank',
            ['clickable', 'galaxy']
        ]]
    ],

    clickables: {
        't': {
            display() { return `Cost: ${format(player.ad.tickspeed.cost)}` },
            canClick() { return player.points.gte(player.ad.tickspeed.cost); },
            onClick() { player[this.layer].buyTickspeed(false); },
            style() { return { 'width': '100px' } }
        },
        't-max': {
            display() { return `Buy Max` },
            canClick() { return player.points.gte(player.ad.tickspeed.cost); },
            onClick() { player[this.layer].buyTickspeed(true); },
            style() { return { 'width': '100px' } }
        },

        'shift': {
            display() { return `Dimensional Shift(0)<br>Requires 20 4th Dimensions` },
            canClick() { return true; },
            onClick() { },
            style() { return { 'width': '300px' } }
        },

        'galaxy': {
            display() { return `Reset your Dimensions for a Galaxy<br>Requires 20 8th Dimensions` },
            canClick() { return true; },
            onClick() { },
            style() { return { 'width': '300px' } }
        },

        'd1-1': {
            display() { return `Cost: ${format(player.ad.dimensions[0].cost)}` },
            canClick() { return player.points.gte(player.ad.dimensions[0].cost); },
            onClick() { player[this.layer].buyDimension(0, false); }
        },
        'd1-10': {
            display() { return `Until 10, cost: ${format(player.ad.dimensions[0].cost.times(10 - player.ad.dimensions[0].until10))}` },
            canClick() { return player.points.gte(player.ad.dimensions[0].cost.times(10 - player.ad.dimensions[0].until10)); },
            onClick() { player[this.layer].buyDimension(0, true); }
        },

        'd2-1': {
            display() { return `Cost: ${format(player.ad.dimensions[1].cost)}` },
            canClick() { return player.points.gte(player.ad.dimensions[1].cost); },
            onClick() { player[this.layer].buyDimension(1, false); }
        },
        'd2-10': {
            display() { return `Until 10, cost: ${format(player.ad.dimensions[1].cost.times(10 - player.ad.dimensions[1].until10))}` },
            canClick() { return player.points.gte(player.ad.dimensions[1].cost.times(10 - player.ad.dimensions[1].until10)); },
            onClick() { player[this.layer].buyDimension(1, true); }
        },

        'd3-1': {
            display() { return `Cost: ${format(player.ad.dimensions[2].cost)}` },
            canClick() { return player.points.gte(player.ad.dimensions[2].cost); },
            onClick() { player[this.layer].buyDimension(2, false); }
        },
        'd3-10': {
            display() { return `Until 10, cost: ${format(player.ad.dimensions[2].cost.times(10 - player.ad.dimensions[2].until10))}` },
            canClick() { return player.points.gte(player.ad.dimensions[2].cost.times(10 - player.ad.dimensions[2].until10)); },
            onClick() { player[this.layer].buyDimension(2, true); }
        },

        'd4-1': {
            display() { return `Cost: ${format(player.ad.dimensions[3].cost)}` },
            canClick() { return player.points.gte(player.ad.dimensions[3].cost); },
            onClick() { player[this.layer].buyDimension(3, false); }
        },
        'd4-10': {
            display() { return `Until 10, cost: ${format(player.ad.dimensions[3].cost.times(10 - player.ad.dimensions[3].until10))}` },
            canClick() { return player.points.gte(player.ad.dimensions[3].cost.times(10 - player.ad.dimensions[3].until10)); },
            onClick() { player[this.layer].buyDimension(3, true); }
        },
        
    }

});