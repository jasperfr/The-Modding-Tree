const ORDINAL = ['0th', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];
const AUTOBUYERS = ['ab-1', 'ab-2', 'ab-3', 'ab-4', 'ab-5', 'ab-6', 'ab-7', 'ab-8', 'ab-t', 'ab-s', 'ab-g'];

const __ad = {
    header: ['column', [
        ['display-text', '<ta>Antimatter Dimensions</ta>'],
        'blank',
        ['display-text', function () { return `You have <span style="color:#b04545;font-size:20px;font-weight:bold;">${mixedStandardFormat(player.points, 2)}</span> antimatter.`; }, { 'color': 'silver' }],
        ['display-text', function () { return `You are getting <span style="font-size:12px;">${__(getPointGen(), 2, 1)}</span> antimatter per second.`; }, { 'color': 'silver', 'font-size': '10px' }], 'blank',
    ]]
}

function resetAD() {
    let autobuyerStates = {};
    autobuyerStates = AUTOBUYERS.reduce((acc, val) => ({ ...acc, [val]: getClickableState('ad', val) }), {});

    layerDataReset('ad');

    player.a.shifts = 0 + hasUpgrade('bd', 'keep-1') + hasUpgrade('bd', 'keep-2') + hasUpgrade('bd', 'keep-3') + hasUpgrade('bd', 'keep-4');
    Object.entries(autobuyerStates).forEach(([k, v]) => { setClickableState('ad', k, v) });
}

function increaseAntimatterDimensions(delta, dimensionCount = 3,) {
    for (let i = 0; i < dimensionCount; i++) {
        let multiplier = tmp.a.buyables[`dimension-${i + 2}`].multiplier;
        let shiftMultiplier = 1;
        switch (i) {
            case 0: case 1: shiftMultiplier = 2 ** player.a.shifts; break;
            case 2: case 3: shiftMultiplier = 2 ** Math.max(0, (player.a.shifts - 1)); break;
            case 4: case 5: shiftMultiplier = 2 ** Math.max(0, (player.a.shifts - 2)); break;
            case 6: case 7: shiftMultiplier = 2 ** Math.max(0, (player.a.shifts - 3)); break;
        }

        player.a.dimensions[i] = player.a.dimensions[i].plus(
            player.a.dimensions[i + 1]
                .times(multiplier)
                .times(tmp.ad.tickspeed.multiplier)
                .times(shiftMultiplier)
                // .times(inChallenge('infinity', 21) ? 1.0 : tmp.bd.power.multiplier)
                .times(1.05 ** player.ach.achievements.length)
                .times(delta)
        );
    };
}

function autobuyAntimatterDimensions(dimensionCount = 3) {
    // Dimension autobuyer
    for (let i = 0; i <= dimensionCount; i++) {
        if (getClickableState(this.layer, `ab-${i + 1}`) === 'Enabled') {
            if (hasUpgrade('bd', 'adim-m') || hasUpgrade('infinity', 'keepBuyMax')) buyMaxBuyable(this.layer, `dimension-${i + 1}`);
            else buyBuyable(this.layer, `dimension-${i + 1}`);
        }

        // INF-STUDY-41
        if (hasUpgrade('infinity', 'keep10ADonReset')) {
            player.a.dimensions[i] = Decimal.max(player.a.dimensions[i], 10);
        }
    }
    // Tickspeed autobuyer
    if (getClickableState(this.layer, `ab-t`) === 'Enabled') {
        if (hasUpgrade('bd', 'adim-m') || hasUpgrade('infinity', 'keepBuyMax')) buyMaxBuyable(this.layer, `tickspeed`);
        else buyBuyable(this.layer, `tickspeed`);
    }
    // Dimension shift autobuyer
    if (getClickableState(this.layer, `ab-s`) === 'Enabled') {
        clickClickable(this.layer, 'shift');
    }
}

/**
 * Generate a dimension buyable.
 */
function genDimensionBuyable(id, cost, costMulti) {
    return {
        cost() {
            if (Decimal.times(cost, Decimal.pow(costMulti, this.amount10())).lte('1e308')) {
                return Decimal.times(cost, Decimal.pow(costMulti, this.amount10()));
            } else {
                return Decimal.times(cost, Decimal.pow(costMulti, this.amount10().times(1.0))).div('1e308');
            }
        },

        display() {
            return `Cost: ${mixedStandardFormat(this.cost(), 2, true)} [${getBuyableAmount(this.layer, this.id)}]`;
        },

        canAfford() {
            return player.points.gte(this.cost());
        },

        buy() {
            if (this.canAfford()) {
                console.log(this.layer);
                player.points = player.points.sub(this.cost());
                player[this.layer].dimensions[id] = player[this.layer].dimensions[id].plus(1);
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1));
                player[this.layer].style[id] = (player[this.layer].style[id] + 1) % 10;
            }
        },

        buyMax() {
            while(this.canAfford()) this.buy();
        },

        multiplier() {
            return Decimal.pow(2, this.amount10());
        },

        amount10() {
            return getBuyableAmount(this.layer, this.id).div(10).floor();
        },

        style() {
            let s = player[this.layer].style[id] * 10;
            let u = Decimal.max(0, Decimal.min(10, Decimal.floor(player.points.divide(this.cost())))).times(10);
            return {
                'width': '150px',
                'background-image': `linear-gradient(to right, #4ABB5F ${s}%, #357541 ${s}%, #357541 ${u.plus(s)}%, transparent ${u.plus(s)}%)`
            };
        }
    }
}

function getAntimatterDimensionMultiplier(dimension) {
    const dim = dimension - 1;
    const shiftMultiplier = 2 ** Math.max(0, player.a.shifts - Math.floor(dim / 2));

    return new Decimal(1)
        .times(tmp.a.buyables[`dimension-${dimension}`].multiplier)
        .times(1.05 ** player.ach.achievements.length)
        .times(shiftMultiplier);
}

addLayer('a', {

    /**
     * Base layer information.
     */
    name: 'Antimatter Dimensions',
    symbol: 'A',
    color: '#992c2c',
    tooltip: 'Antimatter Dimensions',
    branches: ['b'],

    resource: 'antimatter',

    /**
     * Start data information.
     */
    startData() {
        return {
            unlocked: true,
            dimensions: Array(8).fill(0).map(() => new Decimal(0)),
            tickspeed: new Decimal(0),
            shifts: 0,
            style: [0, 0, 0, 0, 0, 0, 0, 0]
        }
    },

    /**
     * Tickspeed information.
     * Starts at 1.125x per tickspeed, increases at the galaxy layer.
     */
    tickspeed: {
        increase() {
            return new Decimal(1.125)
        },
        multiplier() {
            return Decimal.pow(
                tmp.a.tickspeed.increase,
                player.a.tickspeed
            );
        },
    },

    /**
     * Update information.
     */
    update(delta) {
        const dimensionCount = 3 + player.a.shifts;

        for (let i = 0; i < dimensionCount; i++) {
            const multiplier = getAntimatterDimensionMultiplier(i + 2);
            player.a.dimensions[i] = player.a.dimensions[i].plus(
                player.a.dimensions[i + 1]
                    .times(multiplier)
                    .times(delta)
            );
        }
    },

    /**
     * Render information.
     */
    tabFormat: [
        __ad.header,
        ['clickable', 'max-all'],
        'blank',
        ['display-small', _ => `Increase tickspeed by ${tmp.a.tickspeed.increase}x.`],
        ['row', [['buyable', 'tickspeed'], ['buyable', 'tickspeed-max']]],
        ['display-small', _ => `Tickspeed: ${mixedStandardFormat(tmp.a.tickspeed.multiplier, 3)} / sec`],
        'blank',
        function() {
            const html = ['column', []];
            for(let i = 0; i <= (3 + player.a.shifts); i++) {
                html[1].push(['row', [
                    ['dimension', [i + 1, player.a.dimensions[i], getAntimatterDimensionMultiplier(i + 1)]],
                ]]);
            }
            return html;
        },
        'blank',
        ['row', [['clickable', 'shift'], ['clickable', 'boost'], 'blank','blank','blank', ['clickable', 'galaxy']]],
        'blank',
        ['bar', 'percentageToInfinity']
    ],

    buyables: {
        'dimension-1': genDimensionBuyable(0, 1e1, 1e3),
        'dimension-2': genDimensionBuyable(1, 1e2, 1e4),
        'dimension-3': genDimensionBuyable(2, 1e4, 1e5),
        'dimension-4': genDimensionBuyable(3, 1e6, 1e6),
        'dimension-5': genDimensionBuyable(4, 1e9, 1e8),
        'dimension-6': genDimensionBuyable(5, 1e13, 1e10),
        'dimension-7': genDimensionBuyable(6, 1e18, 1e12),
        'dimension-8': genDimensionBuyable(7, 1e24, 1e15),

        'tickspeed': {
            cost(x) {
                return Decimal.pow(10, Decimal.plus(3, x));
            },
            display() { 
                return `Cost: ${mixedStandardFormat(this.cost(), 2, true)}`;
            },
            canAfford() {
                return player.points.gte(this.cost());
            },
            buy() {
                player.points = player.points.sub(this.cost());
                player.a.tickspeed = player.a.tickspeed.plus(1);
                setBuyableAmount('a', 'tickspeed', getBuyableAmount('a', 'tickspeed').add(1))
            },
            buyMax() {
                // TODO - Fix this shit.
                while (this.canAfford()) { this.buy(); }
            },
            style() {
                return { 'width': '150px', 'background-color': this.canAfford() ? '#357541 !important' : '' };
            }
        },
        
        'tickspeed-max': {
            cost() {
                return Decimal.pow(10, Decimal.plus(3, getBuyableAmount('a', 'tickspeed')));
            },
            display() {
                return `Buy Max`;
            },
            canAfford() {
                return player.points.gte(this.cost());
            },
            buy() {
                buyMaxBuyable('a', 'tickspeed');
            },
            style() {
                return { 'width': '150px', 'background-color': this.canAfford() ? '#357541 !important' : '' };
            }
        },
    },

    clickables: {
        'max-all': {
            display() {
                return 'Max All (M)'
            },
            canClick() {
                return true;
            },
            onClick() {
                for(let i = 0; i <= (3 + player[this.layer].shifts); i++) {
                    buyMaxBuyable(this.layer, `dimension-${i+1}`);
                }
                buyMaxBuyable(this.layer, 'tickspeed');
            }
        },

        'shift': {
            display() {
                switch(player.a.shifts) {
                    case 0: return 'Dimensional Shift (0)<br>Reset to gain a x2.0 boost on 1st -> 2nd Dimensions.<br>Needs 20 4th Dimensions.';
                    case 1: return 'Dimensional Shift (1)<br>Reset to gain a x2.0 boost on 1st -> 4th Dimensions.<br>Needs 20 5th Dimensions.';
                    case 2: return 'Dimensional Shift (2)<br>Reset to gain a x2.0 boost on 1st -> 6th Dimensions.<br>Needs 20 6th Dimensions.';
                    case 3: return 'Dimensional Shift (3)<br>Reset to gain a x2.0 boost on 1st -> 8th Dimensions.<br>Needs 20 7th Dimensions.';
                    default: return 'ERROR?'
                }
            },
            canClick() {
                return player.a.dimensions[player.a.shifts + 3].gte(20);
            },
            onClick() {
                // Save data
                const shifts = player.a.shifts + 1;
                layerDataReset('a');
                resetPoints();
                player.a.shifts = shifts;
            },
            unlocked() {
                return player.a.shifts < 4;
            },
            style() {
                return { 'font-size': '10px', 'height': '60px' }
            }
        }
    },

    hotkeys: [

    ],

    bars: {
        percentageToInfinity: {
            direction: RIGHT,
            width: 500,
            height: 20,
            instant: true,
            display() {
                const percentage = Math.max(0, player.points.log10().divide(1024).times(100));
                return `${format(percentage)}% to Infinity`
            },
            progress() {
                return Math.max(0, player.points.log10().divide(1024))
            },
            style() {
                return {
                    'font-size': '10pt'
                }
            },
            fillStyle: { 'background-color': '#4ABB5F', }
        }
    }
});