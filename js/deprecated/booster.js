/* 
    Unlike the original AD,
    Booster Dimensions unlock after performing 1 Dimensional Boost.
    The cost multiplier of a new Booster Dimension is bought * (10 * 8th dimensions).
    Booster Points, also known as BP, can be spent on either Booster Dimensions, or Booster Upgrades.

    The 1st Booster Dimensions gives a slowly incrementing multiplier on all the 8 dimensions.
    The formula for this multiplier is ((2.0 + BU0) + (log10(<number of first booster dimensions) * (2.0 + BU1)))x .

    Various upgrades can be bought to increase the booster multiplier.
    BU0: Increase the base gain by 1.0. Cost: 5x BP per upgrade (1st 2 BP, 2nd 10 BP, 3rd 50 BP, ...)
    BU1: Increase the multiplier by 0.2. Cost: 1 order of magnitude per upgrade worth of Booster Points.

    You start with 4 Booster Dimensions.
*/

addLayer('bd', {

    name: 'Booster Dimensions',
    symbol: 'BD',
    color: '#63b8ff',
    tooltip: 'Booster Dimensions',
    branches: [],

    baseResource: 'BP',

    layerShown() {
        return player.bd.BP.gt(0) || player.bd.dimensions.some(dim => dim.amount.gt(0)) || player.ad.galaxies.amount > 0;
    },

    startData() {
        return {
            BP: new Decimal(0),
            multiplier: new Decimal(1.0),
            divider: 10,
            dividerCost: 10,
            dimensions: [
                { amount: new Decimal(0), multiplier: new Decimal(1.0), cost: new Decimal(1e0) },
                { amount: new Decimal(0), multiplier: new Decimal(1.0), cost: new Decimal(1e2) },
                { amount: new Decimal(0), multiplier: new Decimal(1.0), cost: new Decimal(1e4) },
                { amount: new Decimal(0), multiplier: new Decimal(1.0), cost: new Decimal(1e6) },
            ]
        }
    },

    update(delta) {
        for(let i = 0; i < player.bd.dimensions.length - 1; i++) {
            player.bd.dimensions[i].amount = player.bd.dimensions[i].amount
                .plus(((player.bd.dimensions[i + 1].amount).times(player.bd.dimensions[i + 1].multiplier)).divide(player.bd.divider).times(delta));
        }

        player.bd.multiplier = player.bd.multiplier
            .plus((player.bd.dimensions[0].amount).divide(player.bd.divider).times(delta));
    },

    tabFormat: {
        'Booster Dimensions': {
            content: [
                ['display-text', function() { return  `There is ${format(player.points, 2)} antimatter.`; }],'blank',
                ['bar', 'percentageToInfinity'],'blank',
        
                ['display-text', '<h1 style="color:#63b8ff">Booster Dimensions</h1>'],'blank',
                ['display-text', function() { return `<h3 style="color:#63b8ff">You have ${player.bd.BP} Booster Points.</h1>` }],'blank',
                ['display-text', function() { return `Your 1st Booster Dimension boosts Antimatter Dimensions by ${format(player.bd.multiplier)}x.` }], 'blank',
                
                function() {
                    const ordinals = ['1st','2nd','3rd','4th','5th','6th','7th','8th'];
                    const html = ['column', []];
                    player.bd.dimensions.forEach((dimension, i) => {
                        let dimAmount = formatWhole(dimension.amount);
                        let dimMulti = format(dimension.multiplier);
                        html[1].push(['row', [
                            ['display-text', `<span style="display:block; width:300px !important;">${dimAmount} ${ordinals[i]} Booster Dimensions</span>`],'blank',
                            ['display-text', `<span style="display:block; width:100px !important;">x${dimMulti}</span>`],'blank',
                            ['clickable', `bd${i+1}`]
                        ]]);
                    });
                    return html;
                }
            ]
        },
        'Upgrades': {
            content: [
                ['display-text', function() { return  `There is ${format(player.points, 2)} antimatter.`; }],'blank',
                ['bar', 'percentageToInfinity'],'blank',
        
                ['display-text', '<h1 style="color:#63b8ff">Booster Upgrades</h1>'],'blank',
                ['display-text', function() { return `<h3 style="color:#63b8ff">You have ${player.bd.BP} Booster Points.</h1>` }],'blank',

                ['clickable', 'bu11']
            ]
        }
    },

    clickables: {
        'bd1': bdimUpgrade(0),
        'bd2': bdimUpgrade(1),
        'bd3': bdimUpgrade(2),
        'bd4': bdimUpgrade(3),

        'bu11': {
            display() {
                return `<h2>Boosting Boosters</h2><br><br>Reduce the multiplier divider on Booster Dimensions.<br><br>Currently: x/${player.bd.divider}${player.bd.divider == 1 ? '(maxed)' : ''}<br><br>Cost: ${formatWhole(player.bd.dividerCost)} BP`
            },
            canClick() {
                return player.bd.divider > 1 && player.bd.BP.gte(player.bd.dividerCost);
            },
            onClick() {
                player.bd.BP = player.bd.BP.minus(player.bd.dividerCost);
                player.bd.divider = player.bd.divider - 1;
                player.bd.dividerCost *= 100;
            },
            style: {
                'height': '200px'
            }
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
});

function bdimUpgrade(dimension) {
    return {
        display() {
            const dim = player.bd.dimensions[dimension];
            return `Cost: ${formatWhole(dim.cost)} BP`
        },
        canClick() {
            const dim = player.bd.dimensions[dimension];
            return player.bd.BP.gte(dim.cost);
        },
        onClick() {
            const dim = player.bd.dimensions[dimension];
            player.bd.BP = player.bd.BP.minus(dim.cost);
            dim.amount = dim.amount.plus(1);
            dim.cost = dim.cost.times(2);
            dim.multiplier = dim.multiplier.times(1.5);
        }
    }
}