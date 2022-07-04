const LOG_10_INFINITY = 308.25471555991674389886862819788085941062643861719914630187772019;

addLayer('ta', {
    name: 'True Antimatter Dimensions',
    symbol: 'C1',
    color: '#992c2c',
    tooltip: 'True Antimatter Dimensions',

    nodeStyle: {
        'color': 'white',
        'background-color': '#222',
        'border': '1px solid white'
    },

    layerShown() { return inChallenge('infinity', 11) },
    baseResource: 'True Antimatter',

    startData() {
        return {
            dimensions: Array(8).fill(0).map(() => new Decimal(0)),
            sacrifice: new Decimal(0),
            style: [0, 0, 0, 0, 0, 0, 0, 0]
        }
    },

    tickspeed: {
        increase() { return new Decimal(1.125).plus(getBuyableAmount('ta', 'galaxy').times(0.015)) },
        multiplier() { return Decimal.pow(tmp.ta.tickspeed.increase, Decimal.plus(0, getBuyableAmount('ta', 'tickspeed'))); }
    },

    sacrifice: {
        increase() {
            return Decimal.max(1, Decimal.divide(Decimal.floor(Decimal.log10(player.ta.dimensions[0].minus(player.ta.sacrifice))), 10))
        },
        multiplier() {
            return Decimal.max(1, Decimal.divide(Decimal.floor(Decimal.log10(player.ta.sacrifice)), 10))
        }
    },

    update(delta) {
        let shiftCount = getBuyableAmount('ta', 'shiftboost').toNumber();
        for (let i = 0; i < Math.min(3 + shiftCount, 7); i++) {
            let shiftMultiplier = 2 ** Math.max(0, shiftCount - i);
            let multiplier = tmp.ta.buyables[`dimension-${i + 2}`].multiplier;
            player.ta.dimensions[i] = player.ta.dimensions[i].plus(
                player.ta.dimensions[i + 1]
                    .times(multiplier)
                    .times(shiftMultiplier)
                    .times(tmp.ta.tickspeed.multiplier)
                    .times(i === 7 ? tmp.ta.sacrifice.multiplier : 1)
                    .times(1.05 ** player.ach.achievements.length)
                    .times(10)
                    .times(delta)
            );
        }
    
        // Dimension autobuyer
        for(let i = 0; i <= Math.min(3 + shiftCount, 7); i++) {
            if(getClickableState(this.layer, `ab-${i+1}`) === 'Enabled') {
                buyMaxBuyable(this.layer, `dimension-${i+1}`);
            }
        }
        // Tickspeed autobuyer
        if (getClickableState(this.layer, `ab-t`) === 'Enabled') {
            buyMaxBuyable(this.layer, `tickspeed`);
        }
        // Dimension shift autobuyer
        if (getClickableState(this.layer, `ab-s`) === 'Enabled') {
            buyBuyable(this.layer, 'shiftboost');
        }
        // Galaxy autobuyer
        if (getClickableState(this.layer, `ab-g`) === 'Enabled') {
            buyBuyable(this.layer, 'galaxy');
        }
    },

    tabFormat: {
        'Dimensions': {
            content: [
                ['display-text', function () { return `You have <span style="color:#b04545;font-size:20px;font-weight:bold;">${mixedStandardFormat(player.points, 2)} True</span> Antimatter.`; }, { 'color': 'silver' }],
                ['display-text', function () { return `You are getting <span style="font-size:12px;">${__(getPointGen(), 2, 1)} true</span> antimatter per second.`; }, { 'color': 'silver', 'font-size': '10px' }], 'blank',
                ['display-text', function () { return `Increase tickspeed by ${tmp.ta.tickspeed.increase}x.` }, { 'font-size': '12px', 'color': 'silver' }],
                ['row', [['buyable', 'tickspeed'], ['buyable', 'tickspeed-max']]],
                ['display-text', function () { return `Tickspeed: ${__(tmp.ta.tickspeed.multiplier, 3)} / sec` }, { 'font-size': '12px', 'color': 'silver' }],
                'blank',
                ['row', [['clickable', 'sacrifice']]],
                'blank',
                function () {
                    const html = ['column', []];
                    let shiftCount = getBuyableAmount('ta', 'shiftboost').toNumber();
                    for (let i = 0; i <= Math.min(3 + shiftCount, 7); i++) {
                        let shiftMultiplier = 2 ** Math.max(0, shiftCount - i);
                        let multiplier = tmp.ta.buyables[`dimension-${i + 1}`].multiplier
                            .times(shiftMultiplier)
                            .times(1.05 ** player.ach.achievements.length)
                            .times(i === 7 ? tmp.ta.sacrifice.multiplier : 1);
                        let amount = mixedStandardFormat(player.ta.dimensions[i], 2, 1);
                        html[1].push(['row', [
                            ['raw-html', `<div style="width:150px; text-align:left;"><span style="font-weight:bold;">${ORDINAL[i + 1]} Dimension</span><br><span style="color:silver;">x${__(multiplier, 1, 0)}</span></div>`, { margin: 'auto 0', 'font-size': '12px' }],
                            ['raw-html', `<div style="width:200px;font-weight:bold;">${amount}</div>`, { margin: 'auto 0', 'font-size': '14px' }],
                            ['buyable', `dimension-${i + 1}`, { margin: 'auto 0' }]
                        ], { width: '100%', margin: 0, 'justify-content': 'space-between', 'background-color': i % 2 && '#331616' }]);
                    }
                    return html;
                },
                'blank',
                ['row', [['buyable', 'shiftboost'], 'blank', 'blank', 'blank', ['buyable', 'galaxy']]],
                'blank',
                ['bar', 'percentageToInfinity']
            ]
        },
        'Autobuyers': {
            content: [
                ['display-text', function() { return  `You have <span style="color:#b04545;font-size:20px;font-weight:bold;">${mixedStandardFormat(player.points, 2)} true</span> antimatter.`; }, { 'color': 'silver' }], 'blank',
                ['row', [['clickable', 'ab-1'], ['clickable', 'ab-2'], ['clickable', 'ab-3']]],
                ['row', [['clickable', 'ab-4'], ['clickable', 'ab-5'], ['clickable', 'ab-6']]],
                ['row', [['clickable', 'ab-7'], ['clickable', 'ab-8'], ['clickable', 'ab-t']]],
                ['row', [['clickable', 'ab-s'], ['clickable', 'ab-g']]],
                'blank',
                ['bar', 'percentageToInfinity']
            ]
        }
    },

    buyables: {
        'shiftboost': {
            display() {
                let amount = getBuyableAmount(this.layer, this.id).toNumber();
                let shiftOrBoost = amount <= 3 ? 'Shift' : 'Boost';
                let dimReq = amount <= 3 ? 20 : 20 + (amount - 4) * 15;
                let dim = amount <= 3 ? amount + 4 : 8
                return `Dimensional ${shiftOrBoost} (${amount})<br>Requires ${dimReq} ${ORDINAL[dim]} Dimensions`;
            },
            canAfford() {
                let amount = getBuyableAmount(this.layer, this.id).toNumber();
                if (amount <= 3) {
                    return player.ta.dimensions[amount + 3].gte(20)
                } else {
                    return player.ta.dimensions[7].gte(20 + (amount - 4) * 15)
                }
            },
            buy() {
                const autobuyerStates = AUTOBUYERS.reduce((acc, val) => ({...acc, [val]: getClickableState(this.layer, val)}), {});
                const shiftCount = getBuyableAmount(this.layer, this.id).plus(1);
                const galaxyCount = getBuyableAmount(this.layer, 'galaxy');

                layerDataReset('ta');
                player.points = new Decimal(10);

                setBuyableAmount(this.layer, this.id, shiftCount);
                setBuyableAmount(this.layer, 'galaxy', galaxyCount);
                Object.entries(autobuyerStates).forEach(([k, v]) => { setClickableState(this.layer, k, v) });
            },
            style() {
                return { 'font-size': '10px', 'height': '60px' }
            }
        },
        'galaxy': {
            display() {
                let amount = getBuyableAmount(this.layer, this.id).toNumber();
                let dimReq = 80 + amount * 60;
                return `Antimatter Galaxies (${amount})<br>Requires ${dimReq} ${ORDINAL[8]} Dimensions`;
            },
            canAfford() {
                let amount = getBuyableAmount(this.layer, this.id).toNumber();
                return player.ta.dimensions[7].gte(80 + amount * 60);
            },
            buy() {
                const autobuyerStates = AUTOBUYERS.reduce((acc, val) => ({...acc, [val]: getClickableState(this.layer, val)}), {});
                const galaxyCount = getBuyableAmount(this.layer, this.id).plus(1);

                layerDataReset('ta');
                player.points = new Decimal(10);

                setBuyableAmount(this.layer, this.id, galaxyCount);
                Object.entries(autobuyerStates).forEach(([k, v]) => { setClickableState(this.layer, k, v) });
            },
            style() {
                return { 'font-size': '10px', 'height': '60px' }
            }
        },
        'tickspeed': {
            cost(x) {
                if(Decimal.pow(10, Decimal.plus(3, x)).lte('1.79e308')) {
                    return Decimal.pow(10, Decimal.plus(3, x))
                }
                else {
                    return 'True Infinity';    
                }
            },
            display() { return `Cost: ${this.cost() === 'True Infinity' ? 'True Infinity' : mixedStandardFormat(this.cost(), 2, true)}` },
            canAfford() { return this.cost() === 'True Infinity' ? false : player.points.gte(this.cost()) },
            buy() {
                player.points = player.points.sub(this.cost());
                setBuyableAmount('ta', 'tickspeed', getBuyableAmount('ta', 'tickspeed').add(1))
            },
            buyMax() { while (this.canAfford()) { this.buy(); } },
            style() { return { 'width': '150px', 'background-color': this.canAfford() ? '#357541 !important' : '' } }
        },
        'tickspeed-max': {
            cost() { return Decimal.pow(10, Decimal.plus(3, getBuyableAmount('ta', 'tickspeed'))) },
            display() { return `Buy Max` },
            canAfford() { return this.cost().gte('1.79e308') ? false : player.points.gte(this.cost()) },
            buy() { buyMaxBuyable('ta', 'tickspeed') },
            style() { return { 'width': '150px', 'background-color': this.canAfford() ? '#357541 !important' : '' } }
        },
        'dimension-1': trueDimBuyable(0, 1e1, 1e3),
        'dimension-2': trueDimBuyable(1, 1e2, 1e4),
        'dimension-3': trueDimBuyable(2, 1e4, 1e5),
        'dimension-4': trueDimBuyable(3, 1e6, 1e6),
        'dimension-5': trueDimBuyable(4, 1e9, 1e8),
        'dimension-6': trueDimBuyable(5, 1e13, 1e10),
        'dimension-7': trueDimBuyable(6, 1e18, 1e12),
        'dimension-8': trueDimBuyable(7, 1e24, 1e15),
    },
    
    clickables: {
        'ab-1': autoBuyable(0, 1e10),
        'ab-2': autoBuyable(1, 1e20),
        'ab-3': autoBuyable(2, 1e30),
        'ab-4': autoBuyable(3, 1e40),
        'ab-5': autoBuyable(4, 1e50),
        'ab-6': autoBuyable(5, 1e60),
        'ab-7': autoBuyable(6, 1e70),
        'ab-8': autoBuyable(7, 1e80),
        'ab-t': autoBuyable(8, 1e90),
        'ab-s': autoBuyable(9, 1e100),
        'ab-g': autoBuyable(10, 1e110),

        'sacrifice': {
            display() {
                if(getBuyableAmount('ta', 'shiftboost').lte(4)) {
                    return `Dimensional Sacrifice (locked)`;
                } else {
                    return `Dimensional Sacrifice<br>x${__(tmp.ta.sacrifice.multiplier, 1, 0)} -> x${__(tmp.ta.sacrifice.increase, 1, 0)}`;
                }
            },
            canClick() {
                return player.ta.dimensions[7].gt(0) && getBuyableAmount('ta', 'shiftboost').gte(5) && tmp.ta.sacrifice.increase.gte(tmp.ta.sacrifice.multiplier);
            },
            onClick() {
                player.ta.sacrifice = player.ta.sacrifice.plus(player.ta.dimensions[0]);
                for(let i = 0; i < 7; i++) {
                    player.ta.dimensions[i] = new Decimal(0);
                }
            }
        }
    },

    bars: {
        percentageToInfinity: {
            direction: RIGHT,
            width: 500,
            height: 20,
            instant: true,
            display() {
                const percentage = Math.max(0, player.points.log10().divide(LOG_10_INFINITY).times(100));
                return `${format(percentage)}% to True Infinity`
            },
            progress() {
                return Math.max(0, player.points.log10().divide(LOG_10_INFINITY))
            },
            fillStyle: { 'background-color': '#4ABB5F', }
        }
    },
});

function trueDimBuyable(dimension, cost, multiplier) {
    return {
        cost() {
            if(Decimal.times(cost, Decimal.pow(multiplier, this.amount10())).lte('1.79e308')) {
                return Decimal.times(cost, Decimal.pow(multiplier, this.amount10()))
            } else {
                return 'True Infinity';
            }
         },
        display() { return `Cost: ${this.cost() === 'True Infinity' ? 'True Infinity' : mixedStandardFormat(this.cost(), 2, true)}` },
        canAfford() { return this.cost() === 'True Infinity' ? false : player.points.gte(this.cost()) },
        buy() {
            player.points = player.points.sub(this.cost());
            player.ta.dimensions[dimension] = player.ta.dimensions[dimension].plus(1);
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1));
            player.ta.style[dimension] = (player.ta.style[dimension] + 1) % 10;
        },
        buyMax() { while (this.canAfford()) { this.buy() } },
        multiplier() { return Decimal.pow(2, this.amount10()) },
        amount10() { return getBuyableAmount(this.layer, this.id).div(10).floor() },
        style() {
            let s = player.ta.style[dimension] * 10;
            let u = Decimal.max(0, Decimal.min(10, Decimal.floor(player.points.divide(this.cost())))).times(10);
            return {
                'width': '150px',
                'background-image': `linear-gradient(to right, #4ABB5F ${s}%, #357541 ${s}%, #357541 ${u.plus(s)}%, transparent ${u.plus(s)}%)`
            }
        }
    }
}
