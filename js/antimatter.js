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
                decrease: new Decimal(12), // reduce by 11% = (11 / 100) * speed
                cost: new Decimal(1e3),
                costMultiplier: 10
            },
            dimensions: [
                {
                    amount: new Decimal(0),
                    multiplier: new Decimal(1.0),
                    until10: 0,
                    unlocked: true,
                    baseCost: new Decimal(10),
                    cost: new Decimal(10),
                    costMultiplier: 1e3
                },
                {
                    amount: new Decimal(0),
                    multiplier: new Decimal(1.0),
                    until10: 0,
                    unlocked: true,
                    baseCost: new Decimal(100),
                    cost: new Decimal(100),
                    costMultiplier: 1e4
                },
                {
                    amount: new Decimal(0),
                    multiplier: new Decimal(1.0),
                    until10: 0,
                    unlocked: true,
                    baseCost: new Decimal(1e4),
                    cost: new Decimal(1e4),
                    costMultiplier: 1e5,
                },
                {
                    amount: new Decimal(0),
                    multiplier: new Decimal(1.0),
                    until10: 0,
                    unlocked: true,
                    baseCost: new Decimal(1e6),
                    cost: new Decimal(1e6),
                    costMultiplier: 1e6,
                },
                {
                    amount: new Decimal(0),
                    multiplier: new Decimal(1.0),
                    until10: 0,
                    unlocked: true,
                    baseCost: new Decimal(1e9),
                    cost: new Decimal(1e9),
                    costMultiplier: 1e8
                },
                {
                    amount: new Decimal(0),
                    multiplier: new Decimal(1.0),
                    until10: 0,
                    unlocked: true,
                    baseCost: new Decimal(1e13),
                    cost: new Decimal(1e13),
                    costMultiplier: 1e10
                },
                {
                    amount: new Decimal(0),
                    multiplier: new Decimal(1.0),
                    until10: 0,
                    unlocked: true,
                    baseCost: new Decimal(1e18),
                    cost: new Decimal(1e18),
                    costMultiplier: 1e12,
                },
                {
                    amount: new Decimal(0),
                    multiplier: new Decimal(1.0),
                    until10: 0,
                    unlocked: true,
                    baseCost: new Decimal(1e24),
                    cost: new Decimal(1e24),
                    costMultiplier: 1e15,
                },
            ],

            boosts: {
                amount: 0,
                multiplier: 2,
                effect: function(dimension) {
                    return Math.pow(this.multiplier, Math.max(0, this.amount - (dimension - 1)));
                },
                shiftOrBoost: function() { return this.amount <= 3 ? 'Shift' : 'Boost' },
                requiresText: function() {
                    switch(this.amount) {
                        case 0: return '20 4th';
                        case 1: return '20 5th';
                        case 2: return '20 6th';
                        case 3: return '20 7th';
                        default: return `${20 + ((this.amount - 4) * 15)} 8th`;
                    }
                },
                // returns [dimNeeded, count].
                requires: function() {
                    switch(this.amount) {
                        case 0: return [3, 20];
                        case 1: return [4, 20];
                        case 2: return [5, 20];
                        case 3: return [6, 20];
                        default: return [7, (20 + ((this.amount - 4) * 15))];
                    }
                }
            },

            /* WARNING:
               These are PRE-BREAK stats.
               Fix later. */
            galaxies: {
                amount: 0,
                effect: [12, 13.5, 15, 18, 20, 22.8, 25.502, 28.10943, 30.6256, 33.0537, 35.39682] // pre break
            },

            sacrifice: {
                multiplier: new Decimal(1.0),
                sacrificed: new Decimal(0),

                calculateGain: function() {
                    let sacrificed = player.ad.dimensions[0].amount;
                    let g = new Decimal(1);
                    if(sacrificed.gt(0)) g = Decimal.max(Decimal.log10(sacrificed).divide(10), 1).pow(2);
                    return g.divide(player.ad.sacrifice.calculateMultiplier());
                },

                calculateMultiplier: function() {
                    let sacrificed = player.ad.sacrifice.sacrificed;
                    if(sacrificed.eq(0)) return new Decimal(1);
                    return (Decimal.max(Decimal.log10(sacrificed).divide(10), 1).pow(2))
                }
            },

            buySacrifice() {
                const self = player.ad;

                self.sacrifice.sacrificed = self.sacrifice.sacrificed.plus(self.dimensions[0].amount);
                self.sacrifice.multiplier = self.sacrifice.calculateMultiplier();

                for(let i = 0; i < self.dimensions.length - 1; i++) {
                    self.dimensions[i].amount = new Decimal(0);
                }
            },

            buyDimBoost() {
                const self = player.ad;
                const boosts = player.ad.boosts;
                boosts.amount++;

                // reset the game up to this point.
                for(let i = 0; i < self.dimensions.length; i++) {
                    self.dimensions[i].amount = new Decimal(0);
                    self.dimensions[i].multiplier = new Decimal(1.0);
                    self.dimensions[i].until10 = new Decimal(0);
                    self.dimensions[i].cost = new Decimal(self.dimensions[i].baseCost);
                }

                self.tickspeed.speed = new Decimal(1000.0);
                self.tickspeed.cost = new Decimal(1e3);

                self.sacrifice.multiplier = new Decimal(1);
                self.sacrifice.sacrificed = new Decimal(0);

                player.points = new Decimal(10);
            },

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

            buyGalaxy() {
                const self = player.ad;
                self.galaxies.amount++;
                // reset the game up to this layer.
                self.boosts.amount = 0;
                for(let i = 0; i < self.dimensions.length; i++) {
                    self.dimensions[i].amount = new Decimal(0);
                    self.dimensions[i].multiplier = new Decimal(1.0);
                    self.dimensions[i].until10 = new Decimal(0);
                    self.dimensions[i].cost = new Decimal(self.dimensions[i].baseCost);
                }

                self.tickspeed.speed = new Decimal(1000.0);
                self.tickspeed.cost = new Decimal(1e3);

                player.points = new Decimal(10);
                self.tickspeed.decrease = new Decimal(self.galaxies.effect[self.galaxies.amount]);
            }
        }
    },

    update(delta) {
        let self = player.ad;
        for(let i = 0; i < self.dimensions.length - 1; i++) {
            self.dimensions[i].amount = self.dimensions[i].amount
                .add(
                    self.dimensions[i+1].amount
                    .times(delta)
                    .times(1.05 ** player.ach.achievements.length)
                    .times(self.dimensions[i+1].multiplier)
                    .times(self.boosts.effect(i+1))
                    .times(new Decimal(1000)
                        .divide(self.tickspeed.speed)
                    )
                );
        }
    },

    tooltip() { return 'Antimatter Dimensions' },
    
    tabFormat: [
        ['display-text', function() { return  `There is ${format(player.points, 2)} antimatter.`; }],
        'blank',
        ['bar', 'percentageToInfinity'],
        'blank',

        ['display-text', '<h1>Dimensions</h1>'],'blank',
        ['display-text', function() { return `<h4>Reduce the tick interval by ${player.ad.tickspeed.decrease}%.</h4>` }],
        ['row', [['clickable', 't'], ['clickable', 't-max']]],
        ['display-text', function() { return `<h4>Tickspeed: ${player.ad.tickspeed.speed}</h4>` }],
        'blank','blank',

        function() {
            let mult = player.ad.sacrifice.calculateMultiplier();
            if(player.ad.boosts.amount >= 5) {
                return ['column', [['clickable', 'sacrifice'],['display-text', `Scarifice multiplier: ${format(mult)}x` ],'blank','blank']];
            }
        },

        function() {
            const ordinals = ['1st','2nd','3rd','4th','5th','6th','7th','8th'];
            const html = ['column', []];
            const dimensions = player.ad.dimensions;
            for(let i = 0; i < dimensions.length; i++) {
                let dimAmount = format(dimensions[i].amount.round());
                let dimMulti = dimensions[i].multiplier.times(player.ad.boosts.effect(i));
                if(i == 7) dimMulti = dimMulti.times(player.ad.sacrifice.multiplier);
                if(player.ad.boosts.amount > (i - 4)) {
                    html[1].push(['row', [
                        ['display-text', `<span style="display:block; width:200px !important;">${dimAmount} ${ordinals[i]} Dimensions</span>`],'blank',
                        ['display-text', `<span style="display:block; width:200px !important;">x${format(dimMulti)}</span>`],'blank',
                        ['clickable', `d${i+1}-1`],'blank',['clickable', `d${i+1}-10`]
                    ]]);
                }
            }
            return html;
        },

        'blank',
        ['row', [['clickable', 'shift'],'blank',['clickable', 'galaxy']]]
    ],

    bars: {
        percentageToInfinity: {
            direction: RIGHT,
            width: 500,
            height: 20,
            display() { return `${format(player.points.log10().divide(308.252853031).times(100), 1)}% to Infinity` },
            progress() {
                return player.points.log10().divide(308.252853031)
            },
            fillStyle: { 'background-color': '#4ABB5F', }
        }
    },

    hotkeys: [
        {
            key: "m", // What the hotkey button is. Use uppercase if it's combined with shift, or "ctrl+x" for holding down ctrl.
            description: "m: Max All", // The description of the hotkey that is displayed in the game's How To Play tab
            onPress() {

                // Buy dimensions first.
                for(let i = 0; i <= Math.min(player.ad.boosts.amount + 3, 7); i++) {
                    if(player.points.gte(player.ad.dimensions[i].cost.times(10 - player.ad.dimensions[i].until10))) {
                        player.ad.buyDimension(i, true);
                    }
                }

                // Then buy tickspeed upgrades.
                if(player.points.gte(player.ad.tickspeed.cost)) {
                    player.ad.buyTickspeed(true);
                }
            },
        }
    ],

    clickables: {

        'sacrifice': {
            display() { return `Dimensional Sacrifice (${format(player.ad.sacrifice.calculateGain())}x)`; },
            canClick() { return player.ad.sacrifice.calculateGain().gt(1); },
            onClick() { player.ad.buySacrifice(); }
        },

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
            display() { return `Dimensional ${player[this.layer].boosts.shiftOrBoost()}(${player[this.layer].boosts.amount})<br>Requires ${player[this.layer].boosts.requiresText()} Dimensions` },
            canClick() { return player[this.layer].dimensions[player[this.layer].boosts.requires()[0]].amount.gte(player[this.layer].boosts.requires()[1]); },
            onClick() { player[this.layer].buyDimBoost() },
            style() { return { 'width': '300px' } }
        },

        'galaxy': {
            display() { return `Antimatter Galaxies(${format(player[this.layer].galaxies.amount, 0)})<br>Requires ${player[this.layer].galaxies.amount * 60 + 80} 8th Dimensions` },
            canClick() { return player[this.layer].dimensions[7].amount.gte(player[this.layer].galaxies.amount * 60 + 80); },
            onClick() { player[this.layer].buyGalaxy(); },
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

        'd5-1': {
            display() { return `Cost: ${format(player.ad.dimensions[4].cost)}` },
            canClick() { return player.points.gte(player.ad.dimensions[4].cost); },
            onClick() { player[this.layer].buyDimension(4, false); }
        },
        'd5-10': {
            display() { return `Until 10, cost: ${format(player.ad.dimensions[4].cost.times(10 - player.ad.dimensions[4].until10))}` },
            canClick() { return player.points.gte(player.ad.dimensions[4].cost.times(10 - player.ad.dimensions[4].until10)); },
            onClick() { player[this.layer].buyDimension(4, true); }
        },

        'd6-1': {
            display() { return `Cost: ${format(player.ad.dimensions[5].cost)}` },
            canClick() { return player.points.gte(player.ad.dimensions[5].cost); },
            onClick() { player[this.layer].buyDimension(5, false); }
        },
        'd6-10': {
            display() { return `Until 10, cost: ${format(player.ad.dimensions[5].cost.times(10 - player.ad.dimensions[5].until10))}` },
            canClick() { return player.points.gte(player.ad.dimensions[5].cost.times(10 - player.ad.dimensions[5].until10)); },
            onClick() { player[this.layer].buyDimension(5, true); }
        },

        'd7-1': {
            display() { return `Cost: ${format(player.ad.dimensions[6].cost)}` },
            canClick() { return player.points.gte(player.ad.dimensions[6].cost); },
            onClick() { player[this.layer].buyDimension(6, false); }
        },
        'd7-10': {
            display() { return `Until 10, cost: ${format(player.ad.dimensions[6].cost.times(10 - player.ad.dimensions[6].until10))}` },
            canClick() { return player.points.gte(player.ad.dimensions[6].cost.times(10 - player.ad.dimensions[6].until10)); },
            onClick() { player[this.layer].buyDimension(6, true); }
        },

        'd8-1': {
            display() { return `Cost: ${format(player.ad.dimensions[7].cost)}` },
            canClick() { return player.points.gte(player.ad.dimensions[7].cost); },
            onClick() { player[this.layer].buyDimension(7, false); }
        },
        'd8-10': {
            display() { return `Until 10, cost: ${format(player.ad.dimensions[7].cost.times(10 - player.ad.dimensions[7].until10))}` },
            canClick() { return player.points.gte(player.ad.dimensions[7].cost.times(10 - player.ad.dimensions[7].until10)); },
            onClick() { player[this.layer].buyDimension(7, true); }
        },
        
    }

});