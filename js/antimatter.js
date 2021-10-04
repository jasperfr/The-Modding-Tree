const ORDINAL = ['0th','1st','2nd','3rd','4th','5th','6th','7th','8th'];

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
                decrease: new Decimal(12),
                cost: new Decimal(1e3),
                costMultiplier: 10
            },
            dimensions: [
                {
                    amount: new Decimal(0),
                    multiplier: new Decimal(1.0),
                    until10: 0,
                    baseCost: new Decimal(10),
                    cost: new Decimal(10),
                    costMultiplier: 1e3
                },
                {
                    amount: new Decimal(0),
                    multiplier: new Decimal(1.0),
                    until10: 0,
                    baseCost: new Decimal(100),
                    cost: new Decimal(100),
                    costMultiplier: 1e4
                },
                {
                    amount: new Decimal(0),
                    multiplier: new Decimal(1.0),
                    until10: 0,
                    baseCost: new Decimal(1e4),
                    cost: new Decimal(1e4),
                    costMultiplier: 1e5,
                },
                {
                    amount: new Decimal(0),
                    multiplier: new Decimal(1.0),
                    until10: 0,
                    baseCost: new Decimal(1e6),
                    cost: new Decimal(1e6),
                    costMultiplier: 1e6,
                },
                {
                    amount: new Decimal(0),
                    multiplier: new Decimal(1.0),
                    until10: 0,
                    baseCost: new Decimal(1e9),
                    cost: new Decimal(1e9),
                    costMultiplier: 1e8
                },
                {
                    amount: new Decimal(0),
                    multiplier: new Decimal(1.0),
                    until10: 0,
                    baseCost: new Decimal(1e13),
                    cost: new Decimal(1e13),
                    costMultiplier: 1e10
                },
                {
                    amount: new Decimal(0),
                    multiplier: new Decimal(1.0),
                    until10: 0,
                    baseCost: new Decimal(1e18),
                    cost: new Decimal(1e18),
                    costMultiplier: 1e12,
                },
                {
                    amount: new Decimal(0),
                    multiplier: new Decimal(1.0),
                    until10: 0,
                    baseCost: new Decimal(1e24),
                    cost: new Decimal(1e24),
                    costMultiplier: 1e15,
                },
            ],

            boosts: {
                amount: 0,
                multiplier: 2
            },

            galaxies: {
                amount: 0,
                effect: [12, 13.5, 15, 18, 20, 22.8, 25.502, 28.10943, 30.6256, 33.0537, 35.39682]
            },

            sacrifice: {
                multiplier: new Decimal(1.0),
                sacrificed: new Decimal(0)
            }
        }
    },

    update(delta) {
        const self = player.ad;
        for(let i = 0; i < self.dimensions.length - 1; i++) {
            let boostEffect = Math.pow(self.boosts.multiplier, Math.max(0, self.boosts.amount - i));
            self.dimensions[i].amount = self.dimensions[i].amount
                .add(
                    self.dimensions[i+1].amount
                    .times(delta)
                    .times(1.05 ** player.ach.achievements.length)
                    .times(self.dimensions[i+1].multiplier)
                    .times(boostEffect)
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
            let mult = player.ad.sacrifice.multiplier;
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
                let boostEffect = Math.pow(player.ad.boosts.multiplier, Math.max(0, player.ad.boosts.amount - i));
                let dimMulti = dimensions[i].multiplier.times(boostEffect);
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
        dimHotkey('1', 1, false),
        dimHotkey('!', 1, true),
        dimHotkey('2', 2, false),
        dimHotkey('@', 2, true),
        dimHotkey('3', 3, false),
        dimHotkey('#', 3, true),
        dimHotkey('4', 4, false),
        dimHotkey('$', 4, true),
        dimHotkey('5', 5, false),
        dimHotkey('%', 5, true),
        dimHotkey('6', 6, false),
        dimHotkey('^', 6, true),
        dimHotkey('7', 7, false),
        dimHotkey('&', 7, true),
        dimHotkey('8', 8, false),
        dimHotkey('*', 8, true),
        
        {
            key: 'b',
            description: 'b: Buy Dimensional Shift / Boost',
            onPress() { clickClickable('ad', 'shift'); }
        },
        {
            key: 'g',
            description: 'g: Buy Galaxy',
            onPress() { clickClickable('ad', 'galaxy'); }
        },
        {
            key: 's',
            description: 's: Sacrifice',
            onPress() { clickClickable('ad', 'sacrifice'); }
        },
        {
            key: 't',
            description: 't: Buy Tickspeed (hold shift for max)',
            onPress() { clickClickable('ad', 't'); }
        },
        {
            key: 'T',
            description: '',
            onPress() { clickClickable('ad', 't-max'); }
        },
        {
            key: "m",
            description: "m: Max All", 
            onPress() {

                // Buy dimensions first.
                for(let i = 0; i <= Math.min(player.ad.boosts.amount + 3, 7); i++) {
                    clickClickable('ad', `d${i + 1}-10`);
                }

                // Then buy tickspeed upgrades.
                clickClickable('ad', 't-max');
            },
        }
    ],

    clickables: {

        'sacrifice': {
            display() {
                let d = player.ad.dimensions[0].amount;
                let s = player.ad.sacrifice.sacrificed;
                let g = new Decimal(1), j = new Decimal(1);

                if(d.gt(0)) g = Decimal.max(Decimal.log10(d).divide(10), 1).pow(2);
                if(s.gt(0)) j = Decimal.max(Decimal.log10(s).divide(10), 1).pow(2);

                return `Dimensional Sacrifice (${format(g.divide(j))}x)`;
            },
            canClick() {
                // The button can not be clicked if the player has no 8th dimensions.
                if(player.ad.dimensions[7].amount.eq(0)) return false;

                let d = player.ad.dimensions[0].amount;
                let g = new Decimal(1);
                if(d.gt(0)) g = Decimal.max(Decimal.log10(d).divide(10), 1).pow(2);

                return g.gt(1);
            },
            onClick() {
                const s = player.ad.sacrifice;

                s.sacrificed = s.sacrificed.plus(player.ad.dimensions[0].amount);
                s.multiplier = Decimal.max(Decimal.log10(Decimal.max(s.sacrificed, 1e-99)).divide(10), 1).pow(2);

                // Reset dimensions (up until 8th)
                for(let i = 0; i < player.ad.dimensions.length - 1; i++) {
                    player.ad.dimensions[i].amount = new Decimal(0);
                }
            }
        },

        't': {
            display() { return `Cost: ${format(player.ad.tickspeed.cost)}` },
            canClick() { return player.points.gte(player.ad.tickspeed.cost); },
            onClick() { 
                const tickspeed = player.ad.tickspeed;
                player.points = player.points.minus(tickspeed.cost);
                tickspeed.cost = tickspeed.cost.times(tickspeed.costMultiplier);
                tickspeed.speed = tickspeed.speed.minus(tickspeed.speed.times(tickspeed.decrease.divide(100)));
            },
            style() { return { 'width': '100px' } }
        },
        't-max': {
            display() { return `Buy Max` },
            canClick() { return player.points.gte(player.ad.tickspeed.cost); },
            onClick() { 
                const tickspeed = player.ad.tickspeed;
                while(player.points.gte(player.ad.tickspeed.cost)) {
                    player.points = player.points.minus(tickspeed.cost);
                    tickspeed.cost = tickspeed.cost.times(tickspeed.costMultiplier);
                    tickspeed.speed = tickspeed.speed.minus(tickspeed.speed.times(tickspeed.decrease.divide(100)));
                }
            },
            style() { return { 'width': '100px' } }
        },

        'shift': {
            display() {
                const boosts = player.ad.boosts.amount;
                let boost, requirement;
                boost = boosts <= 3 ? 'Shift' : 'Boost';
                switch(boosts) {
                    case 0: requirement = '20 4th'; break;
                    case 1: requirement = '20 5th'; break;
                    case 2: requirement = '20 6th'; break;
                    case 3: requirement = '20 7th'; break;
                    default: requirement = `${20 + ((boosts - 4) * 15)} 8th`; break;
                }
                return `Dimensional ${boost}(${player.ad.boosts.amount})<br>Requires ${requirement} Dimensions`;
            },
            canClick() {
                const boosts = player.ad.boosts.amount;
                let dim, amount;
                switch(boosts) {
                    case 0: [dim, amount] = [3, 20]; break;
                    case 1: [dim, amount] = [4, 20]; break;
                    case 2: [dim, amount] = [5, 20]; break;
                    case 3: [dim, amount] = [6, 20]; break;
                    default: [dim, amount] = [7, (20 + ((boosts - 4) * 15))]; break;
                };
                return player.ad.dimensions[dim].amount.gte(amount);
            },
            onClick() { 
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
            style() {
                return {
                    'width': '300px'
                }
            }
        },

        'galaxy': {
            display() { return `Antimatter Galaxies(${format(player[this.layer].galaxies.amount, 0)})<br>Requires ${player[this.layer].galaxies.amount * 60 + 80} 8th Dimensions` },
            canClick() { return player[this.layer].dimensions[7].amount.gte(player[this.layer].galaxies.amount * 60 + 80); },
            onClick() {
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
            },
            style() { return { 'width': '300px' } }
        },

        'd1-1': dimUpgrade(0, false),
        'd1-10': dimUpgrade(0, true),
        'd2-1': dimUpgrade(1, false),
        'd2-10': dimUpgrade(1, true),
        'd3-1': dimUpgrade(2, false),
        'd3-10': dimUpgrade(2, true),
        'd4-1': dimUpgrade(3, false),
        'd4-10': dimUpgrade(3, true),
        'd5-1': dimUpgrade(4, false),
        'd5-10': dimUpgrade(4, true),
        'd6-1': dimUpgrade(5, false),
        'd6-10': dimUpgrade(5, true),
        'd7-1': dimUpgrade(6, false),
        'd7-10': dimUpgrade(6, true),
        'd8-1': dimUpgrade(7, false),
        'd8-10': dimUpgrade(7, true)
    }
});

function dimHotkey(key, dim, u10) {
    if(u10) return { key: key, onPress() {clickClickable('ad', `d${dim}-10`); }}
    else return {
        key: key,
        description: `${key}: Buy ${ORDINAL[dim]} Dimension (hold shift for 10)`,
        onPress() { clickClickable('ad', `d${dim}-1`); }
    }
}

function dimUpgrade(dimension, until10) {
    return {
        display() {
            const dim = player.ad.dimensions[dimension];
            if(until10) return `Until 10, cost: ${format(dim.cost.times(10 - dim.until10))}`;
            else return `Cost: ${format(dim.cost)}`
        },
        canClick() {
            const dim = player.ad.dimensions[dimension];
            if(until10) return player.points.gte(dim.cost.times(10 - dim.until10));
            else return player.points.gte(dim.cost);
        },
        onClick() {
            const dim = player.ad.dimensions[dimension];
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
        }
    }
}
