addLayer('bd', {
    name: 'Booster Dimensions',
    symbol: 'B',
    color: '#63b8ff',
    tooltip: 'Booster Dimensions',
    baseResource: 'BP',

    layerShown() {
        return (
            player.bd.BP.gt(0) ||
            player.bd.dimensions.some(d => d.gt(0)) ||
            isDevBuild()
        );
    },

    startData() {
        return {
            BP: new Decimal(0),
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
        player.bd.multiplier = player.bd.multiplier.plus(
            player.bd.dimensions[0]
            .times(Decimal.pow(1.2, getBuyableAmount(this.layer, `booster-dimension-1`)))
            .times(delta)
        );
        for(let i = 0; i < 3; i++) {
            player.bd.dimensions[i] = 
            player.bd.dimensions[i]
            .plus(
                player.bd.dimensions[i+1]
                .times(Decimal.pow(1.2, getBuyableAmount(this.layer, `booster-dimension-${i+1}`)))
                .times(delta)
            )
        };
    },

    tabFormat: {
        'Dimensions': {
            content: [
                ['display-text', function() { return  `You have <span style="color:#63b8ff;font-size:20px;font-weight:bold;">${mixedStandardFormat(player.bd.BP, 2, 1)}</span> Booster Points.`; }, { 'color': 'silver' }], 'blank',
                ['display-text', function() { return `Your Booster Dimensions increase the 8th dimension multiplier by x${mixedStandardFormat(player.bd.multiplier, 2)}.`; }, { 'font-size': '12px', 'color': 'silver' }], 'blank',
                'blank',
                // Dimensions
                function() {
                    const html = ['column', []];
                    for(let i = 0; i < player.bd.dimensions.length; i++) {
                        let multiplier = mixedStandardFormat(Decimal.pow(1.2, getBuyableAmount(this.layer, `booster-dimension-${i+1}`)), 1);
                        let amount = mixedStandardFormat(player.bd.dimensions[i]);
                        html[1].push(['row', [
                            ['raw-html', `<div style="width:200px; text-align:left;"><b>${ORDINAL[i+1]} Booster Dimension</b><br><span style="color:silver;">x${multiplier}</span></div>`, { margin: 'auto 0', 'font-size': '12px' }],
                            ['raw-html', `<div style="width:200px;font-weight:bold;">${amount}</div>`, { margin: 'auto 0', 'font-size': '14px' }],
                            ['buyable', `booster-dimension-${i+1}`, { margin: 'auto 0' }]
                        ], { width: '100%', margin: 0, 'justify-content': 'space-between', 'background-color' : i % 2 && '#234059' }]);
                    }
                    return html;
                },
            ]
        },
        'Upgrades': {
            content: [
                ['display-text', function() { return  `You have <span style="color:#63b8ff;font-size:20px;font-weight:bold;">${mixedStandardFormat(player.bd.BP, 2, 1)}</span> Booster Points.`; }, { 'color': 'silver' }], 'blank',
                ['display-text', 'Your Booster Dimensions increase the 8th dimension multiplier by x1.0.', { 'font-size': '12px', 'color': 'silver' }], 'blank',
            ]
        }
    },

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

    buyables: {
        'booster-dimension-1': boosterBuyable(0, 1e1 , 3),
        'booster-dimension-2': boosterBuyable(1, 1e2 , 4),
        'booster-dimension-3': boosterBuyable(2, 1e4 , 5),
        'booster-dimension-4': boosterBuyable(3, 1e6 , 6),
        // 'booster-dimension-5': boosterBuyable(4, 1e9 , 1e8 ),
        // 'booster-dimension-6': boosterBuyable(5, 1e13, 1e10),
        // 'booster-dimension-7': boosterBuyable(6, 1e18, 1e12),
        // 'booster-dimension-8': boosterBuyable(7, 1e24, 1e15),
    }

});

function boosterBuyable(dimension, cost, multiplier) {
    return {
        cost() { return Decimal.times(cost, Decimal.pow(multiplier, getBuyableAmount(this.layer, this.id))) },
        display() { return `Cost: ${mixedStandardFormat(this.cost(), 2, true)}` },
        canAfford() { return player.bd.BP.gte(this.cost()) || isDevBuild() },
        buy() {
            player.bd.dimensions[dimension] = player.bd.dimensions[dimension].plus(1);
            player.bd.BP = player.bd.BP.sub(this.cost());
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1));
        },
        buyMax() { while(this.canAfford()) { this.buy() } },
        multiplier() { return Decimal.pow(2, getBuyableAmount(this.layer, this.id)) },
    }
}