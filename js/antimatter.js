const ORDINAL = ['0th','1st','2nd','3rd','4th','5th','6th','7th','8th'];

addLayer('ad', {

    /* === Base information === */
    name: 'Antimatter Dimensions',
    symbol: 'A',
    color: '#992c2c',
    tooltip: 'Antimatter Dimensions',
    branches: ['bd'],

    baseResource: 'antimatter',

    /* === Data information === */
    startData() {
        return {
            dimensions: [ // A list of all dimensions
                new Decimal(0),
                new Decimal(0),
                new Decimal(0),
                new Decimal(0),
                new Decimal(0),
                new Decimal(0),
                new Decimal(0),
                new Decimal(0),
            ],
            shifts: 0, // 0 - 4 shifts, afterwards gain Booster Points
            style: [0, 0, 0, 0, 0, 0, 0, 0] // style state
        }
    },

    tickspeed: {
        increase() { return Decimal.plus(1.125, 0) },
        multiplier() { return Decimal.pow(tmp.ad.tickspeed.increase, getBuyableAmount('ad', 'tickspeed')); },
    },

    // 00:19

    /* === Update information === */
    update(delta) {
        // Update dimensions
        for(let i = 0; i < (3 + player.ad.shifts); i++) {
            let multiplier = tmp.ad.buyables[`dimension-${i+2}`].multiplier
            player.ad.dimensions[i] = player.ad.dimensions[i].plus(
                player.ad.dimensions[i+1]
                .times(multiplier)
                .times(tmp.ad.tickspeed.multiplier)
                .times(Decimal.pow(1.5, player.ad.shifts))
                .times(delta)
            );
        };

        // Let the autobuyers buy upgrades.
        for(let i = 0; i <= (3 + player.ad.shifts); i++) {
            if(hasUpgrade(this.layer, `ab-${i+1}`)) buyBuyable(this.layer, `dimension-${i+1}`);
        }
        if(hasUpgrade(this.layer, 'ab-t')) buyBuyable(this.layer, 'tickspeed');
    },
    
    /* === Renderer information === */
    tabFormat: {
        'Dimensions': {
            content: [
                ['display-text', function() { return  `You have <span style="color:#b04545;font-size:20px;font-weight:bold;">${mixedStandardFormat(player.points, 2)}</span> antimatter.`; }, { 'color': 'silver' }], 'blank',
                ['display-text', function() { return `Increase tickspeed by ${tmp.ad.tickspeed.increase}x.` }, { 'font-size': '12px', 'color': 'silver' }],
                ['row', [['buyable', 'tickspeed'], ['buyable', 'tickspeed-max']]],
                ['display-text', function() { return `Tickspeed: ${mixedStandardFormat(tmp.ad.tickspeed.multiplier, 3)} / sec` }, { 'font-size': '12px', 'color': 'silver' }],
                'blank',
                // Dimensions
                function() {
                    const html = ['column', []];
                    for(let i = 0; i <= (3 + player.ad.shifts); i++) {
                        let multiplier = mixedStandardFormat(tmp.ad.buyables[`dimension-${i+1}`].multiplier.times(Decimal.pow(1.5, player.ad.shifts)), 1);
                        let amount = mixedStandardFormat(player.ad.dimensions[i], 2, true);
                        html[1].push(['row', [
                            ['raw-html', `<div style="width:150px; text-align:left;"><b>${ORDINAL[i+1]} Dimension</b><br><span style="color:silver;">x${multiplier}</span></div>`, { margin: 'auto 0', 'font-size': '12px' }],
                            ['raw-html', `<div style="width:200px;font-weight:bold;">${amount}</div>`, { margin: 'auto 0', 'font-size': '14px' }],
                            ['buyable', `dimension-${i+1}`, { margin: 'auto 0' }]
                        ], { width: '100%', margin: 0, 'justify-content': 'space-between', 'background-color' : i % 2 && '#331616' }]);
                    }
                    return html;
                },
                'blank',
                ['row', [['clickable', 'shift'], ['clickable', 'boost'], 'blank','blank','blank', ['clickable', 'galaxy']]],
                'blank',
                ['bar', 'percentageToInfinity']
            ],
        },
        'Autobuyers': {
            content: [
                ['display-text', function() { return  `You have ${mixedStandardFormat(player.points, 2)} antimatter.`; }], 'blank',
                ['display-text', '<h5>In this version, autobuyers will always buy max.<br>This might change in a future update.</h5>'],'blank',
                ['row', [['upgrade', 'ab-1'], ['upgrade', 'ab-2'], ['upgrade', 'ab-3']]],
                ['row', [['upgrade', 'ab-4'], ['upgrade', 'ab-5'], ['upgrade', 'ab-6']]],
                ['row', [['upgrade', 'ab-7'], ['upgrade', 'ab-8'], ['upgrade', 'ab-t']]],
                ['row', [['upgrade', 'ab-s'], ['upgrade', 'ab-g'], ['upgrade', 'ab-c']]]
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

    /* === Upgrade information === */
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

    upgrades: {
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
        'ab-g': autoBuyable(10, 1e200),
        'ab-c': autoBuyable(11, 1e250),
    },

    clickables: {

        // Dimensional Shifts appear until the 8th Dimension and give a multiplier to each dimension.
        'shift': {
            display() {
                let requirement;
                switch(player.ad.shifts) {
                    case 0: requirement = 'Requires 20 4th Dimensions'; break;
                    case 1: requirement = 'Requires 20 5th Dimensions'; break;
                    case 2: requirement = 'Requires 20 6th Dimensions'; break;
                    case 3: requirement = 'Requires 20 7th Dimensions'; break;
                    default: requirement = '<span style="color:red;">This shouldn\'t happen.</span>'; break;
                }
                return `Dimensional Shift (${player.ad.shifts})<br>${requirement}.`;
            },
            canClick() { return player.ad.dimensions[player.ad.shifts + 3].gte(20); },
            onClick() { 
                player.ad.shifts++;
                layerDataReset('ad', ['shifts', 'upgrades']); // keep shifts and autobuyer upgrades on reset
                player.points = new Decimal(10);
            },
            tooltip() { return 'Dimensional Shifts unlock a new dimension and they give a 1.5x multiplier to all dimensions each.' },
            unlocked() { return player.ad.shifts < 4; },
            style() { return { 'font-size': '10px' } }
        },

        // Dimensional Boosts appear after the 8th Dimension has been unlocked and give Booster Points.
        'boost': {
            gain() { return Decimal.divide(player.ad.dimensions[7], 10).floor() },
            display() {
                return `Reset for ${formatWhole(this.gain())} BP.`
            },
            canClick() { return this.gain().gte(1); },
            onClick() {
                layerDataReset('ad', ['shifts', 'upgrades']); // keep shifts and autobuyer upgrades on reset
                player.points = new Decimal(10);
            },
            tooltip() { return 'Reset all your dimensions, but gain Booster Points based on your antimatter.<br>You need at least 1e100 antimatter to perform a Boost.<br><br>You will keep your Dimension Shifts.' },
            unlocked() { return player.ad.shifts >= 4; },
            style() { return { 'font-size': '10px' } }
        },

        // Galaxies give a galaxy based on the amount of 8th Dimensions.
        'galaxy': {
            display() {
                return `Reset for a galaxy.`
            },
            tooltip() { return 'Currently removed in this version.<br><br>The next update will have a Galaxy Layer.' },
            canClick() { return false; },
            style() { return { 'font-size': '10px' } }
        }

    },

    /* === Hotkey information === */
    hotkeys: [
        {
            key: 'm',
            description: 'Max All',
            onPress() {
                for(let i = 0; i <= (3 + player.ad.shifts); i++) {
                    buyMaxBuyable(this.layer, `dimension-${i+1}`);
                }
                buyMaxBuyable(this.layer, 'tickspeed');
            }
        }
    ]

});

/**
 * Create an upgrade for the autobuyer.
 * @param {Number} dimension Dimension ID (0-7), Tickspeed (8), Shift (9), Galaxy (10), Crunch (11)
 * @param {Number} cost Cost of the upgrade
 * @returns A TMT Buyable component.
 */
function autoBuyable(dimension, cost) {
    return {
        price: new Decimal(cost), // idk cost doesn't work
        fullDisplay() {
            let label = '';
            switch(dimension) {
                case 11: label = 'Crunch'; break;
                case 10: label = 'Galaxy'; break;
                case 9: label = 'Dimensional Shift'; break;
                case 8: label = 'Tickspeed'; break;
                default: label = ORDINAL[dimension + 1] + ' Dimension'; break;
            }
            let bought = !hasUpgrade(this.layer, this.id) ? `Cost: ${mixedStandardFormat(this.price)}` : 'Purchased';
            return `<h3>${label} Autobuyer</h3><br><br>${bought}`;
        },
        canAfford() { return player.points.gte(this.price) },
        pay() { player.points = player.points.sub(this.price) },
        style() { return { 'height': '100px', 'margin': '2px' } }
    }
}

/**
 * Create an upgrade for buying a dimension.
 * @param {Number} dimension Dimension ID
 * @param {Number} cost Cost of the upgrade 
 * @param {Number} multiplier Cost multiplier
 * @returns A TMT Buyable component.
 */
function dimBuyable(dimension, cost, multiplier) {
    return {
        cost() { return Decimal.times(cost, Decimal.pow(multiplier, this.amount10())) },
        display() { return `${mixedStandardFormat(this.cost(), 2, true)} AM` },
        canAfford() { return player.points.gte(this.cost()) },
        buy() {
            player.points = player.points.sub(this.cost());
            player.ad.dimensions[dimension] = player.ad.dimensions[dimension].plus(1);
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1));
            player.ad.style[dimension] = (player.ad.style[dimension] + 1) % 10;
        },
        buyMax() { while(this.canAfford()) { this.buy() } },
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