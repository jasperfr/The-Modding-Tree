/*
    Dimension cost multiplier:
    1: 10, 1e3
    2: 100, 1e4,
    3: 1e4, 1e5,
    4: 1e6, 1e6,
    5: 1e9, 1e8,
    6: 1e13, 1e10,
    7: 1e18 1e12
    8: 1e24, 1e15
*/
const ORDINAL = ['0th','1st','2nd','3rd','4th','5th','6th','7th','8th'];

addLayer('ad', {

    name: 'Antimatter Dimensions',
    symbol: 'A',
    color: '#e84848',
    tooltip: 'Antimatter Dimensions',

    baseResource: 'antimatter',

    startData() {
        return {
            dimensions: [
                new Decimal(0),
                new Decimal(0),
                new Decimal(0),
                new Decimal(0),
                new Decimal(0),
                new Decimal(0),
                new Decimal(0),
                new Decimal(0),
            ],

            boosts: new Decimal(0),
            galaxies: new Decimal(0),
            style: [0, 0, 0, 0, 0, 0, 0, 0]
        }
    },

    tickspeed: {
        increase() { return Decimal.plus(1.125, player.ad.galaxies.times(2)) },
        multiplier() { return Decimal.pow(tmp.ad.tickspeed.increase, getBuyableAmount('ad', 'tickspeed')); },
    },

    update(delta) {
        for(let i = 0; i < 6; i++) {
            let multiplier = tmp.ad.buyables[`dimension-${i+2}`].multiplier
            player.ad.dimensions[i] = player.ad.dimensions[i].plus(
                player.ad.dimensions[i+1]
                .times(multiplier)
                .times(tmp.ad.tickspeed.multiplier)
                .times(delta)
            );
        }
    },
    
    tabFormat: [
        ['display-text', function() { return  `There is ${mixedStandardFormat(player.points, 2)} antimatter.`; }], 'blank',
        ['bar', 'percentageToInfinity'], 'blank',
        ['display-text', '<h1>Antimatter Dimensions</h1>'],'blank',
        ['display-text', function() { return `<h4>Increase tickspeed by ${tmp.ad.tickspeed.increase}x.</h4>` }],
        ['row', [['buyable', 'tickspeed'], 'blank', ['buyable', 'tickspeed-max']]],
        ['display-text', function() { return `<h4>Tickspeed: ${mixedStandardFormat(tmp.ad.tickspeed.multiplier, 3)}/s</h4>` }],
        
        'blank',

        function() {
            const html = ['column', []];
            for(let i = 0; i < 8; i++) {
                let multiplier = mixedStandardFormat(tmp.ad.buyables[`dimension-${i+1}`].multiplier, 1);
                let amount = mixedStandardFormat(player.ad.dimensions[i], 3, true);
                html[1].push(['row', [
                    ['raw-html', `<div style="width:150px; text-align:left;"><h3>${ORDINAL[i+1]} Dimension</h3><br><span style="color:silver;">x${multiplier}</span></div>`],
                    ['raw-html', `<div style="width:150px;"><h4>${amount}</h4></div>`],
                    ['buyable', `dimension-${i+1}`]
                ], { 'background-color' : i % 2 && '#4d3c3c', 'padding': '2px 16px' }]);
            }
            return html;
        }
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

    buyables: {
        'tickspeed': {
            cost(x) { return Decimal.pow(10, Decimal.plus(3, x)) },
            display() { return `Cost: ${mixedStandardFormat(this.cost(), 2, true)}` },
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                player.points = player.points.sub(this.cost())
                setBuyableAmount('ad', 'tickspeed', getBuyableAmount('ad', 'tickspeed').add(1))
            },
            buyMax() { while(this.canAfford()) { this.buy(); } },
            style() { return { 'width': '150px', 'background-color': this.canAfford() ? '#357541 !important' : '' } }
        },
        'tickspeed-max': {
            cost() { return Decimal.pow(10, Decimal.plus(3, getBuyableAmount('ad', 'tickspeed'))) },
            display() { return `Buy Max` },
            canAfford() { return player.points.gte(this.cost()) },
            buy() { buyMaxBuyable('ad', 'tickspeed') },
            style() { return { 'width': '150px', 'background-color': this.canAfford() ? '#357541 !important' : '' } }
        },

        'dimension-1': dimBuyable(0, 1e1 , 1e3 ),
        'dimension-2': dimBuyable(1, 1e2 , 1e4 ),
        'dimension-3': dimBuyable(2, 1e4 , 1e5 ),
        'dimension-4': dimBuyable(3, 1e6 , 1e6 ),
        'dimension-5': dimBuyable(4, 1e9 , 1e8 ),
        'dimension-6': dimBuyable(5, 1e13, 1e10),
        'dimension-7': dimBuyable(6, 1e18, 1e12),
        'dimension-8': dimBuyable(7, 1e24, 1e15),
    },

    clickables: {

        // 'shift': {
        //     display() {
        //         const boosts = player.ad.boosts.amount;
        //         let boost, requirement;
        //         boost = boosts <= 3 ? 'Shift' : 'Boost';
        //         switch(boosts) {
        //             case 0: requirement = '20 4th'; break;
        //             case 1: requirement = '20 5th'; break;
        //             case 2: requirement = '20 6th'; break;
        //             case 3: requirement = '20 7th'; break;
        //             default: return `Reset for ${Decimal.floor(player.ad.dimensions[7].amount.divide(10))} BP`;
        //             // default: requirement = `${20 + ((boosts - 4) * 15)} 8th`; break;
        //         }
        //         return `Dimensional ${boost}(${player.ad.boosts.amount})<br>Requires ${requirement} Dimensions`;
        //     },
        //     canClick() {
        //         const boosts = player.ad.boosts.amount;
        //         let dim, amount;
        //         switch(boosts) {
        //             case 0: [dim, amount] = [3, 20]; break;
        //             case 1: [dim, amount] = [4, 20]; break;
        //             case 2: [dim, amount] = [5, 20]; break;
        //             case 3: [dim, amount] = [6, 20]; break;
        //             default: [dim, amount] = [7, 10]; break;
        //         };
        //         return player.ad.dimensions[dim].amount.gte(amount);
        //     },
        //     onClick() { 
        //         const self = player.ad;
        //         const boosts = player.ad.boosts;
        //         if(boosts.amount < 4) {
        //             boosts.amount++;
        //         } else {
        //             player.bd.BP = player.bd.BP.plus(Decimal.floor(player.ad.dimensions[7].amount.divide(10)));
        //         }


        //         // reset the game up to this point.
        //         for(let i = 0; i < self.dimensions.length; i++) {
        //             self.dimensions[i].amount = new Decimal(0);
        //             self.dimensions[i].multiplier = new Decimal(1.0);
        //             self.dimensions[i].until10 = new Decimal(0);
        //             self.dimensions[i].cost = new Decimal(self.dimensions[i].baseCost);
        //         }

        //         self.tickspeed.speed = new Decimal(1000.0);
        //         self.tickspeed.cost = new Decimal(1e3);

        //         self.sacrifice.multiplier = new Decimal(1);
        //         self.sacrifice.sacrificed = new Decimal(0);

        //         player.points = new Decimal(10);
        //     },
        //     style() {
        //         return {
        //             'width': '300px'
        //         }
        //     }
        // },

        // 'galaxy': {
        //     display() { return `Antimatter Galaxies(${format(player[this.layer].galaxies.amount, 0)})<br>Requires ${player[this.layer].galaxies.amount * 60 + 80} 8th Dimensions` },
        //     canClick() { return player[this.layer].dimensions[7].amount.gte(player[this.layer].galaxies.amount * 60 + 80); },
        //     onClick() {
        //         const self = player.ad;
        //         self.galaxies.amount++;
        //         // reset the game up to this layer.
        //         self.boosts.amount = 0;
        //         for(let i = 0; i < self.dimensions.length; i++) {
        //             self.dimensions[i].amount = new Decimal(0);
        //             self.dimensions[i].multiplier = new Decimal(1.0);
        //             self.dimensions[i].until10 = new Decimal(0);
        //             self.dimensions[i].cost = new Decimal(self.dimensions[i].baseCost);
        //         }

        //         self.tickspeed.speed = new Decimal(1000.0);
        //         self.tickspeed.cost = new Decimal(1e3);

        //         player.points = new Decimal(10);
        //         self.tickspeed.decrease = new Decimal(self.galaxies.effect[self.galaxies.amount]);

        //         // Reset Booster Dimensions.
        //         layerDataReset('bd');
        //     },
        //     style() { return { 'width': '300px' } }
        // },

    }
});

function dimBuyable(dimension, cost, multiplier) {
    return {
        cost() { return Decimal.times(cost, Decimal.pow(multiplier, this.amount10())) },
        display() { return `${mixedStandardFormat(this.cost(), 2, true)} AM` },
        canAfford() { return player.points.gte(this.cost()) },
        buy() {
            while(this.canAfford()) {
                player.points = player.points.sub(this.cost());
                player.ad.dimensions[dimension] = player.ad.dimensions[dimension].plus(1);
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1));
                player.ad.style[dimension] = (player.ad.style[dimension] + 1) % 10;
            }
        },
        multiplier() { return Decimal.pow(2, this.amount10()) },
        amount10() { return getBuyableAmount(this.layer, this.id).div(10).floor() },
        style() {
            let s = player.ad.style[dimension] * 10;
            let u = Decimal.max(0, Decimal.min(10, Decimal.floor(player.points.divide(this.cost())))).times(10);
            return {
                'width': '150px',
                'background-image': `linear-gradient(to right, #4ABB5F ${s}%, #357541 ${s}%, #357541 ${u.plus(s)}%, transparent ${u.plus(s)}%)`
            }
        }
    }
}