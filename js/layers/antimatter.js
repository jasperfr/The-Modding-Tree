const ORDINAL = ['0th','1st','2nd','3rd','4th','5th','6th','7th','8th'];
const AUTOBUYERS = ['ab-1', 'ab-2', 'ab-3', 'ab-4', 'ab-5', 'ab-6', 'ab-7', 'ab-8', 'ab-t', 'ab-s', 'ab-g'];

function resetAD() {
    let autobuyerStates = {};
    if(hasUpgrade('infinity', 'keepBuyMax')) {
        autobuyerStates = AUTOBUYERS.reduce((acc, val) => ({...acc, [val]: getClickableState('ad', val)}), {})
    }

    layerDataReset('ad');

    player.ad.shifts = 0 + hasUpgrade('bd', 'keep-1') + hasUpgrade('bd', 'keep-2') + hasUpgrade('bd', 'keep-3') + hasUpgrade('bd', 'keep-4');
    Object.entries(autobuyerStates).forEach(([k, v]) => { setClickableState('ad', k, v) });
}

addLayer('ad', {

    /* === Base information === */
    name: 'Antimatter Dimensions',
    symbol: '',
    color: '#992c2c',
    tooltip: 'Antimatter Dimensions',
    branches: ['bd', 'g'],

    baseResource: 'antimatter',

    nodeStyle: {
        'color': 'white',
        'background-image': 'url("resources/antimatter.gif")',
        'background-position': 'center center',
        'background-size': '200%',
        'border': '1px solid white'
    },

    layerShown() {
        return !inChallenge('infinity', 11) && !inChallenge('infinity', 12);
    },

    /* === Data information === */
    startData() {
        return {
            dimensions: Array(8).fill(0).map(() => new Decimal(0)),
            tickspeed: new Decimal(0),
            shifts: 0, // 0 - 4 shifts, afterwards gain Booster Points
            style: [0, 0, 0, 0, 0, 0, 0, 0], // style state,
            matter: new Decimal(1),
        }
    },

    matter: {
        divider() { return inChallenge('infinity', 32) ? Decimal.log10(Decimal.sqrt(player.ad.matter.plus(1))) : 1 }
    },

    tickspeed: {
        increase() { return new Decimal(1.125) },
        multiplier() { return Decimal.pow(tmp.ad.tickspeed.increase, Decimal.plus(0, player.ad.tickspeed)); },
    },

    /* === Update information === */
    update(delta) {
        if(inChallenge('infinity', 32)) {
            player.ad.matter = Decimal.plus(player.ad.matter, 1).times(1.525);
        }

        // Update dimensions
        for(let i = 0; i < (3 + player.ad.shifts); i++) {
            let multiplier = tmp.ad.buyables[`dimension-${i+2}`].multiplier;
            let shiftMultiplier = 1;
            switch(i) {
                case 0: case 1: shiftMultiplier = 2 ** player.ad.shifts; break;
                case 2: case 3: shiftMultiplier = 2 ** Math.max(0, (player.ad.shifts - 1)); break;
                case 4: case 5: shiftMultiplier = 2 ** Math.max(0, (player.ad.shifts - 2)); break;
                case 6: case 7: shiftMultiplier = 2 ** Math.max(0, (player.ad.shifts - 3)); break;
            }

            player.ad.dimensions[i] = player.ad.dimensions[i].plus(
                player.ad.dimensions[i+1]
                .times(multiplier)
                .times(tmp.ad.tickspeed.multiplier)
                .times(shiftMultiplier)
                .times(hasUpgrade('infinity', 'boostTimePlayed') ? upgradeEffect('infinity', 'boostTimePlayed') : 1.0)
                .times(hasUpgrade('infinity', 'boostInfinities') ? upgradeEffect('infinity', 'boostInfinities') : 1.0)
                .times(hasAchievement('ach', 29) ? 1.1 : 1.0)
                .times(tmp.g.multiplier)
                .times(inChallenge('infinity', 21) ? 1.0 : tmp.bd.power.multiplier)
                .times(1.05 ** player.ach.achievements.length)
                .div(tmp.ad.matter.divider)
                .times(tmp.d.decrementy.effectAD)
                .times(delta)
            );
        };

        // Dimension autobuyer
        for(let i = 0; i <= (3 + player.ad.shifts); i++) {
            if(getClickableState(this.layer, `ab-${i+1}`) === 'Enabled') {
                if(hasUpgrade('bd', 'adim-m') || hasUpgrade('infinity', 'keepBuyMax')) buyMaxBuyable(this.layer, `dimension-${i+1}`);
                else buyBuyable(this.layer, `dimension-${i+1}`);
            }
        }
        // Tickspeed autobuyer
        if (getClickableState(this.layer, `ab-t`) === 'Enabled') {
            if(hasUpgrade('bd', 'adim-m') || hasUpgrade('infinity', 'keepBuyMax')) buyMaxBuyable(this.layer, `tickspeed`);
            else buyBuyable(this.layer, `tickspeed`);
        }
        // Dimension shift autobuyer
        if (getClickableState(this.layer, `ab-s`) === 'Enabled') {
            clickClickable(this.layer, 'shift');
        }
    },
    
    /* === Renderer information === */
    tabFormat: {
        'Dimensions': {
            content: [
                ['display-text', function() { if(inChallenge('infinity', 32)) return `There is <span style="color:#45b0b0;font-size:20px;font-weight:bold;">${mixedStandardFormat(player.ad.matter, 2)}</span> matter.`; }, { 'color': 'silver' }],
                ['display-text', function() { if(inChallenge('infinity', 32)) return `<span style="font-size:16px;">It's dividing <b>all</b> Antimatter Dimensions by <span style="color:#db5d23">/${mixedStandardFormat(tmp.ad.matter.divider, 2)}</span>.</span></blank>`; }, { 'color': 'silver' }],
                ['display-text', function() { return  `You have <span style="color:#b04545;font-size:20px;font-weight:bold;">${mixedStandardFormat(player.points, 2)}</span> antimatter.`; }, { 'color': 'silver' }],
                ['display-text', function() { return  `You are getting <span style="font-size:12px;">${__(getPointGen(), 2, 1)}</span> antimatter per second.`; }, { 'color': 'silver', 'font-size': '10px' }], 'blank',
                ['display-text', function() { return `Increase tickspeed by ${tmp.ad.tickspeed.increase}x.` }, { 'font-size': '12px', 'color': 'silver' }],
                ['row', [['buyable', 'tickspeed'], ['buyable', 'tickspeed-max']]],
                ['display-text', function() { return `Tickspeed: ${mixedStandardFormat(tmp.ad.tickspeed.multiplier, 3)} / sec` }, { 'font-size': '12px', 'color': 'silver' }],
                'blank',
                ['display-text', function() { return `Cost starts scaling at 1e308 antimatter.<br>(b⋅m<sup>a</sup> -> (b⋅m<sup>2a</sup>)/1e308)` }, { 'font-size': '12px', 'color': 'silver' }],
                'blank',
                // Dimensions
                function() {
                    const html = ['column', []];
                    for(let i = 0; i <= (3 + player.ad.shifts); i++) {
                        let shiftMultiplier = 1;
                        switch(i) {
                            case 0: case 1: shiftMultiplier = 2 ** player.ad.shifts; break;
                            case 2: case 3: shiftMultiplier = 2 ** Math.max(0, (player.ad.shifts - 1)); break;
                            case 4: case 5: shiftMultiplier = 2 ** Math.max(0, (player.ad.shifts - 2)); break;
                            case 6: case 7: shiftMultiplier = 2 ** Math.max(0, (player.ad.shifts - 3)); break;
                        }
                        let multiplier = mixedStandardFormat(tmp.ad.buyables[`dimension-${i+1}`].multiplier
                            .times(shiftMultiplier)
                            .times(hasUpgrade('infinity', 'boostTimePlayed') ? upgradeEffect('infinity', 'boostTimePlayed') : 1.0)
                            .times(hasUpgrade('infinity', 'boostInfinities') ? upgradeEffect('infinity', 'boostInfinities') : 1.0)
                            .times(hasAchievement('ach', 29) ? 1.1 : 1.0)
                            .times(tmp.g.multiplier)
                            .times(1.05 ** player.ach.achievements.length)
                            .times(inChallenge('infinity', 21) ? 1.0 : tmp.bd.power.multiplier)
                            .div(tmp.ad.matter.divider)
                            .times(tmp.d.decrementy.effectAD)
                            , 1);
                        let amount = mixedStandardFormat(player.ad.dimensions[i], 2, true);
                        html[1].push(['row', [
                            ['raw-html', `<div style="width:150px; text-align:left;"><span style="font-weight:bold;">${ORDINAL[i+1]} Dimension</span><br><span style="color:silver;">x${multiplier}</span></div>`, { margin: 'auto 0', 'font-size': '12px' }],
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
                ['display-text', function() { return  `You have <span style="color:#b04545;font-size:20px;font-weight:bold;">${mixedStandardFormat(player.points, 2)}</span> antimatter.`; }, { 'color': 'silver' }], 'blank',
                ['row', [['clickable', 'ab-1'], ['clickable', 'ab-2'], ['clickable', 'ab-3']]],
                ['row', [['clickable', 'ab-4'], ['clickable', 'ab-5'], ['clickable', 'ab-6']]],
                ['row', [['clickable', 'ab-7'], ['clickable', 'ab-8'], ['clickable', 'ab-t']]],
                ['row', [['clickable', 'ab-s']]],
                'blank',
                ['bar', 'percentageToInfinity']
            ]
        }
    },

    bars: { percentageToInfinity: elements.infinityPercentage() },

    /* === Upgrade information === */
    buyables: {
        'tickspeed': {
            cost(x) { return Decimal.pow(10, Decimal.plus(3, x)) },
            display() { return `Cost: ${mixedStandardFormat(this.cost(), 2, true)}` },
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                player.points = player.points.sub(this.cost());
                player.ad.tickspeed = player.ad.tickspeed.plus(1);
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

        // Dimensional Shifts appear until the 8th Dimension and give a multiplier to each dimension.
        'shift': {
            display() {
                switch(player.ad.shifts) {
                    case 0: return 'Dimensional Shift (0)<br>Reset to gain a x2.0 boost on 1st -> 2nd Dimensions.';
                    case 1: return 'Dimensional Shift (1)<br>Reset to gain a x2.0 boost on 1st -> 4th Dimensions.';
                    case 2: return 'Dimensional Shift (2)<br>Reset to gain a x2.0 boost on 1st -> 6th Dimensions.';
                    case 3: return 'Dimensional Shift (3)<br>Reset to gain a x2.0 boost on 1st -> 8th Dimensions.';
                    default: return 'ERROR?'
                }
            },
            canClick() {
                return player.ad.dimensions[player.ad.shifts + 3].gte(20);
            },
            onClick() {
                if(hasChallenge('infinity', 21)) {
                    player.ad.shifts = player.ad.shifts + 1;
                    return;
                }

                // Save data
                const shifts = player.ad.shifts + 1;

                resetAD();
                resetPoints();

                // Load data
                player.ad.shifts = shifts;
            },
            unlocked() {
                return player.ad.shifts < 4;
            },
            tooltip() {
                return `Requires 20 ${['4th', '5th', '6th', '7th'][player.ad.shifts]} Dimensions.`
            },
            style() {
                return { 'font-size': '10px', 'height': '60px' }
            }
        },

        // Dimensional Boosts appear after the 8th Dimension has been unlocked and give Booster Points.
        'boost': {
            display() {
                if(hasChallenge('infinity', 42)) return `You gain ${__(tmp.bd.points.gain, 2, 1)} BP per second.`
                if(inChallenge('infinity', 21)) return `Dimensional Boost<br>Locked ("Boostless" Challenge)`;
                if(inChallenge('infinity', 31)) return `Dimensional Boost<br>Locked ("Drought" Challenge)`;
                return `Dimensional Boost<br>Reset all dimensions,<br>and gain ${__(tmp.bd.points.gain,2,0)} BP.`
            },
            canClick() {
                return !hasChallenge('infinity', 42)
                    && !inChallenge('infinity', 21)
                    && !inChallenge('infinity', 31)
                    && tmp.bd.points.gain.gte(1);
            },
            onClick() {
                if(hasChallenge('infinity', 21)) {
                    player.ad.shifts = 0 + hasUpgrade('bd', 'keep-1') + hasUpgrade('bd', 'keep-2') + hasUpgrade('bd', 'keep-3') + hasUpgrade('bd', 'keep-4');
                    player.bd.unlocked = true;
                    player.bd.points = player.bd.points.plus(tmp.bd.points.gain);
                    player.bd.lowestTime = Math.min(player.bd.lowestTime, player.bd.timeInCurrentAD);
                    player.bd.timeInCurrentAD = 0;
                    return;
                }

                saveBPStatistics();

                resetAD();

                // Load data
                player.points = new Decimal(10);
                player.ad.shifts = 0 + hasUpgrade('bd', 'keep-1') + hasUpgrade('bd', 'keep-2') + hasUpgrade('bd', 'keep-3') + hasUpgrade('bd', 'keep-4');
                player.bd.unlocked = true;
                player.bd.points = player.bd.points.plus(tmp.bd.points.gain);
                player.bd.lowestTime = Math.min(player.bd.lowestTime, player.bd.timeInCurrentAD);
                player.bd.timeInCurrentAD = 0;
                player.bd.power = hasUpgrade('bd', 'keep50OnReset') ? player.bd.power.times(0.5) : new Decimal(0);
            },
            tooltip() { return 'Booster Point gain is based on your 8th dimensions.' },
            unlocked() { return player.ad.shifts >= 4; },
            style() { return { 'font-size': '10px', 'height': '60px' } }
        },

        // Galaxies give a galaxy based on the amount of 8th Dimensions.
        'galaxy': {
            gain() {
                if(inChallenge('infinity', 22)) return new Decimal(0);
                if(inChallenge('infinity', 21)) {
                    if(player.points.lt('1e100')) return new Decimal(0);
                    return Decimal.ceil(Decimal.log(Decimal.divide(player.points, '1e100'), 10));
                }
                if(inChallenge('infinity', 51)) {
                    return Decimal.ceil(Decimal.log10(Decimal.plus(10, player.points)))
                }
                if(player.points.lt('1e512')) return new Decimal(0);
                return Decimal.ceil(Decimal.log(Decimal.divide(player.points, '1e512'), 10));
            },
            display() {
                if(hasChallenge('infinity', 42)) return `You gain ${__(this.gain(), 2, 1)} GP per second.`
                if(inChallenge('infinity', 22)) return `GP Gain<br>Locked ("Starless" Challenge)`;
                if(inChallenge('infinity', 31)) return `GP Gain<br>Locked ("Drought" Challenge)`;
                if(this.canClick()) {
                    return `Gain ${this.gain()} GP.`;
                }
                else {
                    if(inChallenge('infinity', 21)) return 'Reach 1e100 to unlock Galaxy Points.'
                    return 'Reach 1e512 to unlock Galaxy Points.'
                }
            },
            tooltip() { return 'Reset Booster Dimensions and Antimatter Dimensions for GP.<br><br>GP is based on your antimatter amount. log10(AM/1e512)<br><br>You need 1e512 antimatter to unlock this.' },
            canClick() { return this.gain().gt(0); },
            onClick() {
                if(hasChallenge('infinity', 22)) {
                    player.g.unlocked = true;
                    player.g.points = player.g.points.plus(this.gain());
                    return;
                }

                // Save data
                const gain = this.gain();

                resetAD();
                resetBD();
                resetPoints();

                player.bd.power = new Decimal(0);
                player.bd.restart = true;

                player.g.unlocked = true;
                player.g.points = player.g.points.plus(gain);
            },
            style() { return { 'font-size': '10px', 'height': '60px' } }
        }

    },

    /* === Hotkey information === */
    hotkeys: [
        {
            key: 'm',
            description: 'm: Max All',
            onPress() {
                if(inChallenge('infinity', 11)) {
                    let shiftCount = getBuyableAmount('ta', 'shiftboost').toNumber();
                    for(let i = 0; i <= Math.min(3 + shiftCount, 7); i++) {
                        buyMaxBuyable('ta', `dimension-${i+1}`);
                    }
                    buyMaxBuyable('ta', 'tickspeed');
                } else {
                    for(let i = 0; i <= (3 + player.ad.shifts); i++) {
                        buyMaxBuyable(this.layer, `dimension-${i+1}`);
                    }
                    buyMaxBuyable(this.layer, 'tickspeed');
                }
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
        price: new Decimal(cost),
        display() {
            let label = '';
            switch(dimension) {
                case 11: label = 'Crunch'; break;
                case 10: label = 'Galaxy'; break;
                case 9: label = 'Dimensional Shift'; break;
                case 8: label = 'Tickspeed'; break;
                default: label = ORDINAL[dimension + 1] + ' Dimension'; break;
            }

            if(!getClickableState(this.layer, this.id)) setClickableState(this.layer, this.id, 'Locked');
            const state = getClickableState(this.layer, this.id);

            switch(state) {
                case 'Locked': return `<h3>${label} Autobuyer</h3><br><br><h3>Cost: ${mixedStandardFormat(this.price)}</h3>`;
                case 'Enabled': return `<h3>${label} Autobuyer</h3><br><br><h3>Enabled</h3><h6>Click to disable.</h6>`;
                case 'Disabled': return `<h3>${label} Autobuyer</h3><br><br><h3>Disabled</h3><h6>Click to enable.</h6>`;
            }
        },

        canClick() {
            const state = getClickableState(this.layer, this.id);
            switch(state) {
                case 'Locked': return player.points.gte(this.price);
                default: return true;
            }
        },

        onClick() {
            const state = getClickableState(this.layer, this.id);
            switch(state) {
                case 'Locked':
                    player.points = player.points.sub(this.price);
                    setClickableState(this.layer, this.id, 'Enabled');
                    break;
                case 'Enabled': setClickableState(this.layer, this.id, 'Disabled'); break;
                case 'Disabled': setClickableState(this.layer, this.id, 'Enabled'); break;
            }
        },

        style() {
            let borderColor = '';
            let backgroundImage = '';
            let animation = '';
            const state = getClickableState(this.layer, this.id);

            switch(state) {
                case 'Locked':
                    borderColor = '';
                    backgroundImage = this.canClick() ? 'linear-gradient(#30472e, #30472e)' : 'linear-gradient(#381f1f, #381f1f)';
                    break;
                case 'Enabled':
                    borderColor = '#c733cc !important';
                    backgroundImage = 'repeating-linear-gradient(-45deg, #332833, 10%, #222 10%, #222 20%)';
                    animation = 'ani-autobuyer-enabled 2000ms linear infinite';
                    break;
                case 'Disabled':
                    borderColor = 'orange !important';
                    backgroundImage = 'repeating-linear-gradient(-45deg, #423726, 10%, #222 10%, #222 20%)';
                    break;
            }
            
            return {
                'background-size': '200% 200%',
                'background-image': backgroundImage,
                'border-color': borderColor,
                'animation': animation,
                'height': '100px',
                'margin': '2px',
            }
        }
    }
}

/**
 * Create an upgrade for buying a dimension.
 * Important notice: Cost scaling starts after the cost hit 1.79e308.
 * The cost scaling is 2x, which means the next upgrade will cost 2x as much with the multiplier.
 * 100, multiplier 10, with cost scaling -> 1000, 20000, 400000, 8000000, ...
 * @param {Number} dimension Dimension ID
 * @param {Number} cost Cost of the upgrade 
 * @param {Number} multiplier Cost multiplier
 * @returns A TMT Buyable component.
 */
function dimBuyable(dimension, cost, multiplier) {
    return {
        cost() {
            if(Decimal.times(cost, Decimal.pow(multiplier, this.amount10())).lte('1e308')) {
                return Decimal.times(cost, Decimal.pow(multiplier, this.amount10()))
            } else {
                return Decimal.times(cost, Decimal.pow(multiplier, this.amount10().times(1))).div('1e308')
            }
        },
        display() { return `Cost: ${mixedStandardFormat(this.cost(), 2, true)}` },
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
