addLayer('bd', {
    name: 'Booster Dimensions',
    symbol: 'B',
    color: '#63b8ff',
    resource: 'BP',

    layerShown() {
        return player.bd.unlocked
    },

    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            bestBoost: new Decimal(0),
            multiplier: new Decimal(1.0),
            dimensions: [
                new Decimal(0),
                new Decimal(0),
                new Decimal(0),
                new Decimal(0),
            ]
        }
    },

    update(delta) {
        let multi = hasUpgrade(this.layer, 'incr-m') ? 1.5 : 1.2;
        player.bd.multiplier = player.bd.multiplier.plus(
            player.bd.dimensions[0]
            .times(Decimal.pow(multi, getBuyableAmount(this.layer, `booster-dimension-1`)))
            .times(hasUpgrade('infinity', 'boostTimePlayed') ? upgradeEffect('infinity', 'boostTimePlayed') : 1.0)
            .times(hasUpgrade('infinity', 'boostInfinities') ? upgradeEffect('infinity', 'boostInfinities') : 1.0)
            .times(0.1)
            .times(delta)
        );
        for(let i = 0; i < 3; i++) {
            player.bd.dimensions[i] = 
            player.bd.dimensions[i]
            .plus(
                player.bd.dimensions[i+1]
                .times(Decimal.pow(multi, getBuyableAmount(this.layer, `booster-dimension-${i+1}`)))
                .times(hasUpgrade('infinity', 'boostTimePlayed') ? upgradeEffect('infinity', 'boostTimePlayed') : 1.0)
                .times(hasUpgrade('infinity', 'boostInfinities') ? upgradeEffect('infinity', 'boostInfinities') : 1.0)
                .times(0.1)
                .times(delta)
            )
        };

        if(hasUpgrade(this.layer, 'unlk-a')) {
            buyBuyable(this.layer, 'booster-dimension-1');
            buyBuyable(this.layer, 'booster-dimension-2');
            buyBuyable(this.layer, 'booster-dimension-3');
            buyBuyable(this.layer, 'booster-dimension-4');
        }

        if(hasUpgrade(this.layer, 'boos-t')) {
            player.bd.points = player.bd.points.plus(player.bd.bestBoost.divide(20).times(Decimal.pow(2, getBuyableAmount('bd', 'mult-b'))).times(delta));
        }
    },

    tabFormat: {
        'Dimensions': {
            content: [
                ['display-text', function() { return  `You have <span style="color:#63b8ff;font-size:20px;font-weight:bold;">${mixedStandardFormat(player.bd.points, 2, 1)}</span> Booster Points.`; }, { 'color': 'silver' }],
                ['display-text', function() { return `Your boosters multiply ADs by <span style="color:#63b8ff;font-size:20px;font-weight:bold;">${mixedStandardFormat(player.bd.multiplier, 2)}x</span>.`; }, { 'font-size': '12px', 'color': 'silver' }],
                ['display-text', function() { return `Your best BP gain was <span style="color:#63b8ff;font-size:20px;font-weight:bold;">${mixedStandardFormat(player.bd.bestBoost, 2, 1)}</span> BP on reset.`; }, { 'font-size': '12px', 'color': 'silver' }],
                'blank','blank',
                // Dimensions
                function() {
                    const html = ['column', []];
                    let multi = hasUpgrade(this.layer, 'incr-m') ? 1.5 : 1.2;
                    for(let i = 0; i < player.bd.dimensions.length; i++) {
                        let multiplier = mixedStandardFormat(
                            Decimal.pow(multi, getBuyableAmount(this.layer, `booster-dimension-${i+1}`))
                            .times(hasUpgrade('infinity', 'boostTimePlayed') ? upgradeEffect('infinity', 'boostTimePlayed') : 1.0)
                            .times(hasUpgrade('infinity', 'boostInfinities') ? upgradeEffect('infinity', 'boostInfinities') : 1.0)
                        , 1);
                        let amount = mixedStandardFormat(player.bd.dimensions[i]);
                        html[1].push(['row', [
                            ['raw-html', `<div style="width:150px; text-align:left;"><b>${ORDINAL[i+1]} Booster Dim</b><br><span style="color:silver;">x${multiplier}</span></div>`, { margin: 'auto 0', 'font-size': '12px' }],
                            ['raw-html', `<div style="width:200px;font-weight:bold;">${amount}</div>`, { margin: 'auto 0', 'font-size': '14px' }],
                            ['buyable', `booster-dimension-${i+1}`, { margin: 'auto 0' }]
                        ], { width: '100%', margin: 0, 'justify-content': 'space-between', 'background-color' : i % 2 && '#234059' }]);
                    }
                    return html;
                },
                'blank',
                ['bar', 'percentageToInfinity']
            ]
        },
        'Upgrades': {
            content: [
                ['display-text', function() { return  `You have <span style="color:#63b8ff;font-size:20px;font-weight:bold;">${mixedStandardFormat(player.bd.points, 2, 1)}</span> Booster Points.`; }, { 'color': 'silver' }],
                ['display-text', function() { return `Your boosters multiply ADs by <span style="color:#63b8ff;font-size:20px;font-weight:bold;">${mixedStandardFormat(player.bd.multiplier, 2)}x</span>.`; }, { 'font-size': '12px', 'color': 'silver' }],
                ['display-text', function() { return `Your best gain was <span style="color:#63b8ff;font-size:20px;font-weight:bold;">${mixedStandardFormat(player.bd.bestBoost, 2, 1)}</span> BP on reset.`; }, { 'font-size': '12px', 'color': 'silver' }],
                'blank','blank',
                ['row', [['upgrade', 'keep-1'], 'blank', ['upgrade', 'keep-2'], 'blank', ['upgrade', 'keep-3']]],
                ['row', [['upgrade', 'keep-4'], 'blank', ['upgrade', 'gain-2'], 'blank', ['upgrade', 'more-b']], { 'margin-top': '6px' }],
                ['row', [['upgrade', 'incr-m'], 'blank', ['upgrade', 'boos-t'], 'blank', ['upgrade', 'unlk-a']], { 'margin-top': '6px' }],
                ['row', [['upgrade', 'keep-b'], 'blank', ['upgrade', 'adim-m'], 'blank', ['buyable', 'mult-b']], { 'margin-top': '6px' }],
                'blank',
                ['bar', 'percentageToInfinity']
            ]
        }
    },

    bars: { percentageToInfinity: elements.infinityPercentage() },

    buyables: {
        'booster-dimension-1': boosterBuyable(0, 1e0 , 3),
        'booster-dimension-2': boosterBuyable(1, 1e1 , 4),
        'booster-dimension-3': boosterBuyable(2, 1e2 , 5),
        'booster-dimension-4': boosterBuyable(3, 1e3 , 6),
        // 'booster-dimension-5': boosterBuyable(4, 1e9 , 1e8 ),
        // 'booster-dimension-6': boosterBuyable(5, 1e13, 1e10),
        // 'booster-dimension-7': boosterBuyable(6, 1e18, 1e12),
        // 'booster-dimension-8': boosterBuyable(7, 1e24, 1e15),
        'mult-b': {
            cost(x) { return Decimal.pow(10, Decimal.plus(2, x)) },
            canAfford() { return player.bd.points.gte(this.cost()); },
            buy() {
                player.bd.points = player.bd.points.minus(this.cost());
                setBuyableAmount('bd', 'mult-b', getBuyableAmount('bd', 'mult-b').plus(1));
            },
            display() { return `Multiply BP gain by 2x.<br>Currently: ${mixedStandardFormat(Decimal.pow(2, getBuyableAmount('bd', 'mult-b')),2,1)}x<br><br>Cost: ${mixedStandardFormat(this.cost())} BP` },
            style() { return { height: '100px' } }
        }
    },

    upgrades: {
        'keep-1': {
            description: 'Keep the first Dimension Shift on reset.',
            cost: new Decimal(10),
            style() { return { height: '100px' } }
        },
        'keep-2': {
            description: 'Keep the second Dimension Shift on reset.',
            cost: new Decimal(20),
            canAfford() { return hasUpgrade(this.layer, 'keep-1'); },
            style() { return { height: '100px' } }
        },
        'keep-3': {
            description: 'Keep the third Dimension Shift on reset.',
            cost: new Decimal(50),
            canAfford() { return hasUpgrade(this.layer, 'keep-2'); },
            style() { return { height: '100px' } }
        },
        'keep-4': {
            description: 'Keep all Dimension Shifts on reset.',
            cost: new Decimal(100),
            canAfford() { return hasUpgrade(this.layer, 'keep-3'); },
            style() { return { height: '100px' } }
        },
        'gain-2': {
            description: 'Achievements power is twice as powerful. (useless: no achievements)',
            cost: new Decimal(2500),
            style() { return { height: '100px' } },
        },
        'more-b': {
            description: 'Increase the amount of BP you get.<br>(8th/10 -> 8th/5)',
            cost: new Decimal(200),
            style() { return { height: '100px' } },
        },
        'incr-m': {
            description: 'Increase the Booster Dimension multiplier.<br>(1.2x -> 1.5x)',
            cost: new Decimal(150),
            style() { return { height: '100px' } },
        },
        'boos-t': {
            description() { return `Gain 5% your best BP gain per second.<br>Currently: ${mixedStandardFormat(Decimal.divide(player.bd.bestBoost, 20))}/s` },
            cost: new Decimal(500),
            style() { return { height: '100px' } },
        },
        'unlk-a': {
            description: 'Autobuy Booster Dimensions and they do not consume BP.',
            cost: new Decimal(1000),
            style() { return { height: '100px' } }
        },
        'keep-b': {
            description: 'Keep 50% of your Booster Multiplier on reset.',
            cost: new Decimal(350),
            style() { return { height: '100px' } },
        },
        'adim-m': {
            description: 'Dimensional Autobuyers will now buy max.',
            cost: new Decimal(75),
            style() { return { height: '100px' } }
        }
    },

    bars: {
        percentageToInfinity: {
            direction: RIGHT,
            width: 500,
            height: 20,
            display() { return `${format(player.points.log10().divide(1000).times(100), 1)}% to Infinity` },
            progress() {
                return player.points.log10().divide(1000)
            },
            fillStyle: { 'background-color': '#4ABB5F', }
        }
    },

    hotkeys: [
        {
            key: 'b',
            description: 'b: Gain BP',
            onPress() {
                clickClickable('ad', 'boost');
            }
        }
    ]

});

function boosterBuyable(dimension, cost, multiplier) {
    return {
        cost() { return Decimal.times(cost, Decimal.pow(multiplier, getBuyableAmount(this.layer, this.id))) },
        display() { return `Cost: ${mixedStandardFormat(this.cost(), 2, true)}` },
        canAfford() { return player.bd.points.gte(this.cost()) },
        buy() {
            player.bd.dimensions[dimension] = player.bd.dimensions[dimension].plus(1);
            if(!hasUpgrade(this.layer, 'unlk-a')) player.bd.points = player.bd.points.sub(this.cost());
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1));
        },
        buyMax() { while(this.canAfford()) { this.buy() } },
        multiplier() { return Decimal.pow(2, getBuyableAmount(this.layer, this.id)) },
        style() {
            return {
                'width': '150px',
                'background-color': this.canAfford() ? '#357541 !important' : ''
            }
        }
    }
}