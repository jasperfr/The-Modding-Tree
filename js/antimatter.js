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
    symbol: 'AD',
    color: '#914339',
    tooltip: 'Antimatter Dimensions',

    baseResource: 'antimatter',

    startData() {
        return {
            points: new Decimal(0),
            dimensions: [
                { amount: new Decimal(0), purchased: new Decimal(0) },
                // { amount: new Decimal(0), purchased: new Decimal(0) },
                // { amount: new Decimal(0), purchased: new Decimal(0) },
                // { amount: new Decimal(0), purchased: new Decimal(0) },
                // { amount: new Decimal(0), purchased: new Decimal(0) },
                // { amount: new Decimal(0), purchased: new Decimal(0) },
                // { amount: new Decimal(0), purchased: new Decimal(0) }
            ],

            tickspeed: { amount: new Decimal(1), purchased: new Decimal(2) },
            boosts: new Decimal(0),
            galaxies: new Decimal(0)
        }
    },

    update(delta) {
        player.ad.tickspeed.purchased = player.ad.tickspeed.purchased.plus(1)
    },
    
    tabFormat: [
        ['display-text', function() { return  `There is ${format(player.points, 2)} antimatter.`; }], 'blank',
        ['bar', 'percentageToInfinity'], 'blank',
        ['display-text', '<h1>Antimatter Dimensions</h1>'],'blank',
        ['display-text', function() { return `<h4>Increase the tick speed by ${new Decimal(15).plus(player.ad.galaxies.times(2))}%.</h4>` }],
        ['row', [['clickable', 't'], ['clickable', 't-max']]],
        ['display-text', function() { return `<h4>Tickspeed: ${format((new Decimal(1).divide(new Decimal(1).minus(new Decimal(99.9999999999).plus(player.ad.galaxies.times(2)).divide(100)))).pow(player.ad.tickspeed.purchased))}x</h4>` }],
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

    dimensions: [
        dimension(0, 10, 1e3)
    ],

    clickables: {

        // 't': {
        //     display() { return `Cost: ${format(player.ad.tickspeed.cost)}` },
        //     canClick() { return player.points.gte(player.ad.tickspeed.cost); },
        //     onClick() { 
        //         const tickspeed = player.ad.tickspeed;
        //         player.points = player.points.minus(tickspeed.cost);
        //         tickspeed.cost = tickspeed.cost.times(tickspeed.costMultiplier);
        //         tickspeed.speed = tickspeed.speed.minus(tickspeed.speed.times(tickspeed.decrease.divide(100)));
        //     },
        //     style() { return { 'width': '100px' } }
        // },
        // 't-max': {
        //     display() { return `Buy Max` },
        //     canClick() { return player.points.gte(player.ad.tickspeed.cost); },
        //     onClick() { 
        //         const tickspeed = player.ad.tickspeed;
        //         while(player.points.gte(player.ad.tickspeed.cost)) {
        //             player.points = player.points.minus(tickspeed.cost);
        //             tickspeed.cost = tickspeed.cost.times(tickspeed.costMultiplier);
        //             tickspeed.speed = tickspeed.speed.minus(tickspeed.speed.times(tickspeed.decrease.divide(100)));
        //         }
        //     },
        //     style() { return { 'width': '100px' } }
        // },

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

function dimension(dimension, cost, multiplier) {
    return {
        cost() { return new Decimal(cost).times(Decimal.pow(multiplier, tmp.ad.dimensions[dimension].amount10)) },
        multiplier() { return Decimal.pow(2, tmp.ad.dimensions[0].amount10) },
        amount10() { return player.ad.dimensions[dimension].amount.div(10).floor() }
    }
}

// function dimUpgrade(dimension, cost, multiplier, until10) {
//     return {
//         cost() {
//             return new Decimal(cost).times(Decimal.pow(multiplier, player.ad.dimensions[dimension].amount.div(10).floor()))
//         },
//         display() {
//             const dim = player.ad.dimensions[dimension];
//             if(until10) return `Until 10, cost: ${format(dim.cost.times(10 - dim.until10))}`;
//             else return `Cost: ${format(this.cost())}`
//         },
//         canClick() {
//             const dim = player.ad.dimensions[dimension];
//             if(until10) return player.points.gte(dim.cost.times(10 - dim.until10));
//             else return player.points.gte(dim.cost);
//         },
//         onClick() {
//             // console.log(format(this.cost()))

//             const dim = player.ad.dimensions[dimension];
//             if(until10) {
//                 while(dim.until10 < 10) {
//                     dim.amount = dim.amount.plus(1);
//                     player.points = player.points.minus(dim.cost);
//                     dim.until10++;
//                 }
//                 dim.until10 = 0;
//                 dim.multiplier = dim.multiplier.times(2.0);
//                 dim.cost = dim.cost.times(dim.costMultiplier);
//             } else {
//                 dim.amount = dim.amount.plus(1);
//                 player.points = player.points.minus(dim.cost);
//                 dim.until10++;
//                 if(dim.until10 == 10) {
//                     dim.until10 = 0;
//                     dim.multiplier = dim.multiplier.times(2.0);
//                     dim.cost = dim.cost.times(dim.costMultiplier);
//                 }
//             }
//         }
//     }
// }
