const ELEMENTS = ['', 'H', 'He', 'C', 'N', 'O', 'Ne', 'Mg', 'Si', 'S', 'Ar', 'Fe', 'Co', 'Zn', 'Rb', 'Cu', 'Ag', 'Au', 'U', 'Ub'];
const IRON = 11;
const ELCOLORS = ['#222222', '#eeeeee', '#98b9ed', '#88878a', '#eb9234', '#6acca8', '#a5e1ee', '#82ed8d', '#e06153', '#e6c019', '#e65529', '#999999',
'#00CCFF', '#888888', '#cc3322', '#ccaa22', '#8888aa', '#88aa88', '#22ff22', '#cc22bb'];
const BINFTEXT = ['Iron (Fe)', 'Cobalt (Co)', 'Zinc (Zn)', 'Rubidium (Rb)', 'Copper (Cu)', 'Silver (Ag)', 'Gold (Au)', 'Uranium (U)', 'Unobtainium (Ub)']

function resetG() {
    let autoGalaxyUpgrades = 'Locked';
    let autoGalaxySupernovas = 'Locked';
    let keep = ['clickables'];

    if(hasChallenge('infinity', 12)) autoGalaxyUpgrades = getClickableState('g', 'auto');
    if(hasChallenge('infinity', 32)) autoGalaxySupernovas = getClickableState('g', 'autoSupernova');

    layerDataReset('g', keep);
    setClickableState('bd', 'auto', autoGalaxyUpgrades);
    setClickableState('bd', 'autoSupernova', autoGalaxySupernovas);
}

addLayer('g', {

    /* === Base information === */
    name: 'Galaxies',
    symbol() { return options.toggleButtonAnimations ? '' : 'G' },
    color: '#dd3ffc',
    tooltip: 'Galaxies',
    resource: 'GP',

    nodeStyle() {
        return options.toggleButtonAnimations ? {
            'color': 'white',
            'background-image': 'url("resources/galaxy.gif")',
            'background-position': 'center center',
            'background-size': '100%',
            'border': '1px solid white'
        } : {
            'background-image': 'radial-gradient(circle at center, #e85a74, #dd3ffc)'
        }
    },

    layerShown() {
        if(inChallenge('infinity', 11)) return false;   // true AD
        if(inChallenge('infinity', 12)) return false;   // 2048
        if(inChallenge('infinity', 21)) return player.g.unlocked;    // boostless
        if(inChallenge('infinity', 22)) return false;   // starless
        if(inChallenge('infinity', 31)) return false;   // drought
        return player.g.unlocked;
    },

    /* === Data information === */
    startData() {
        return {
            unlocked: false,

            points: new Decimal(0),
            interval: 0,

            mergeInterval: 0,

            elementMultiplier: 3,

            selectedObjectId: 0,

            timeInCurrentAD: 0,
        }
    },

    starPower() {
        if(!player.g.unlocked) return new Decimal(1.0);
        return Decimal
            .plus(1.0, Decimal.times(0.45, getBuyableAmount('g', 13)))
            .plus(hasAchievement('ach', 36) ? 1 : 0)
            .plus(hasAchievement('ach', 37) ? 1 : 0)
            .times(tmp.d.decrementy.effectG)
            .toNumber();
    },

    points: {
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
        perSecond() {
            return tmp.g.points.gain.div(player.g.timeInCurrentAD);
        }
    },

    spawnRate() {
        return Decimal.max(1 / 60, Decimal.div(Decimal.mul(10, Decimal.pow(0.65, getBuyableAmount('g', 11))), hasUpgrade('infinity', 'ultraFastSpawnRate') ? tmp.infinity.upgrades['ultraFastSpawnRate'].effect : 1)).toNumber();
    },

    mergeRate() {
        return Decimal.max(1 / 60, Decimal.mul(20, Decimal.pow(0.65, getBuyableAmount('g', 12)))).toNumber();
    },

    multiplier() {
        if(!player.g.unlocked) return new Decimal(1.0);
        let sum = new Decimal(1);
        for(let y = 1; y <= tmp.g.grid.cols; y++) {
            for(let x = 1; x <= tmp.g.grid.rows; x++) {
                let id = 100 * y + x;
                let data = getGridData('g', id);
                if(data == 0) continue;
                let multiplier = Decimal.pow(player.g.elementMultiplier, data - 1).divide(5);
                sum = sum.plus(multiplier);
            }
        }
        return sum.pow(tmp.g.starPower);
    },

    getGrid() {
        let output = {};
        for(let y = 1; y <= tmp.g.grid.cols; y++) {
            for(let x = 1; x <= tmp.g.grid.rows; x++) {
                let id = 100 * y + x;
                let data = getGridData('g', id);
                if(data != 0 && data != IRON + getBuyableAmount('infinity', 5).toNumber()) {
                    if(output[data] == undefined) {
                        output[data] = [];
                    }
                    output[data].push(id);
                }
            }
        }
        return output;
    },

    tabFormat: [
        ['display-text', function() {
            const self = player[this.layer];
            const temp = tmp[this.layer];
            return `
                <tt>You have <gp>${__(self.points,2,1)}</gp> Galaxy Points (GP).</tt> <br>
                Your current star's power is <gp>${__(tmp.g.starPower,2,0)}</gp>x. <br>
                Your current star boosts ADs by <gp>${__(Decimal.pow(tmp.g.multiplier, tmp.g.starPower), 3, 1)}</gp>x!<br>
                ([total fusion power]<sup>[star power]</sup>)
            `
        }, { 'color': 'silver', 'font-size': '12px' }],
        'blank',
        ["bar", "interval"],
        ['display-text', function() { return `Spawn rate: <b>${__(1 / tmp.g.spawnRate, 2)}</b>/sec ${tmp.g.spawnRate === (1 / 60) ? '(MAX)' : ''}`; }, { 'color': 'silver', 'font-size': '12px' }],
        'blank',
        ["bar", "merge"],
        ['display-text', function() { return `Merge rate: <b>${__(1 / tmp.g.mergeRate, 2)}</b>/sec ${tmp.g.mergeRate === (1 / 60) ? '(MAX)' : ''}`; }, { 'color': 'silver', 'font-size': '12px' }],
        'blank',
        "grid",
        ['display-text', function() { return `Use the arrow keys or the mouse to move / merge the atoms around.<br>The multiplier increases with each higher atom,<br>but will <u tooltip="Stars can't fuse iron!">stop</u> at ${BINFTEXT[getBuyableAmount('infinity', 5).toNumber()]}.`; }, { 'color': 'silver', 'font-size': '12px' }],
        'blank',
        ['clickable', 'gain'],
        ['row', [
            ['buyable', 11],
            ['buyable', 12],
        ]],
        ['row', [
            ['buyable', 21],
            ['buyable', 22],
        ]],
        ['clickable', 'auto'],
        'blank',
        ['display-text', function() { return `Supernovas (${getBuyableAmount('g', 13)})` }, { 'color': 'white', 'font-size': '14px' }],
        'blank',
        ['row', [
            ['buyable', 13],
        ]],
        ['clickable', 'autoSupernova'],
        'blank'
    ],

    update(tick) {

        player.g.timeInCurrentAD += tick;

        // not sure if this is a good idea tbh
        if(inChallenge('infinity', 42)) {
            tmp[this.layer].grid.rows = 2;
            tmp[this.layer].grid.cols = 2;
        }

        if(hasChallenge('infinity', 42) && (player.points.gte('1e512') || inChallenge('infinity', 51))) {
            if(inChallenge('infinity', 51)) {
                player.g.points = player.g.points.plus(Decimal.ceil(Decimal.log10(Decimal.plus(10, player.points))));
            } else {
                player.g.points = player.g.points.plus(Decimal.ceil(Decimal.log(Decimal.divide(player.points, '1e512'), 10)).times(tick));
            }
        }

        if(!player.g.unlocked) return;

        let minimalAtom = getBuyableAmount('g', 21).plus(1).toNumber();

        // Spawn a new atom when the interval has been reached.
        player.g.interval += tick;
        // for some reason this kind of happens
        if(typeof player.g.interval !== 'number') player.g.interval = 0;

        for(let y = 1; y <= tmp.g.grid.cols; y++) {
            for(let x = 1; x <= tmp.g.grid.rows; x++) {
                let id = 100 * y + x;
                if(player.g.grid[id] !== 0)
                player.g.grid[id] = Math.max(player.g.grid[id], minimalAtom);
            }
        }

        if(player.g.interval > tmp.g.spawnRate) {
            let set = false;
            for(let y = 1; y <= tmp.g.grid.cols; y++) {
                for(let x = 1; x <= tmp.g.grid.rows; x++) {
                    let id = 100 * y + x;
                    if(!set && player.g.grid[id] == 0) {
                        player.g.grid[id] = minimalAtom;
                        set = true;
                    }
                }
            }
            // Reset the timer if there is no more room.
            // Otherwise, wait.
            if(set) {
                player.g.interval = 0;
            } else {
                player.g.interval = tmp.g.spawnRate;
            }
        }

        // Try to merge 1.
        player.g.mergeInterval += tick;
        // for some reason this kind of happens
        if(typeof player.g.mergeInterval !== 'number') player.g.mergeInterval = 0;

        if(player.g.mergeInterval > tmp.g.mergeRate) {
            let merged = false;
            const grid = tmp.g.getGrid;
            for(const val of Object.keys(grid).sort((a, b) => b - a)) {
                if(!merged && grid[val].length >= 2) {
                    player.g.grid[grid[val][0]]++;
                    player.g.grid[grid[val][1]] = 0;
                    merged = true;
                }
            }
            if(merged) {
                player.g.mergeInterval = 0;
            } else {
                player.g.mergeInterval = tmp.g.mergeRate;
            }
        }

        if(getClickableState(this.layer, 'autoSupernova') === 'ON') {
            if(hasChallenge('infinity', 32)) {
                buyBuyable(this.layer, 13);
            }
        }
        if(getClickableState(this.layer, 'auto') === 'ON') {
            if(hasChallenge('infinity', 22)) {
                buyBuyable(this.layer, 21);
                buyBuyable(this.layer, 22);
            }
            buyBuyable(this.layer, 11);
            buyBuyable(this.layer, 12);
        }
    },

    bars: {
        interval: {
            direction: RIGHT,
            width: 350,
            height: 16,
            progress() {
                return (player.g.interval / tmp.g.spawnRate)
            },
            fillStyle: {
                background: '#dd3ffc'
            },
            borderStyle: {
                borderRadius: 0
            }
        },
        merge: {
            direction: RIGHT,
            width: 350,
            height: 16,
            progress() {
                return (player.g.mergeInterval / tmp.g.mergeRate)
            },
            fillStyle: {
                background: '#5a39ad'
            },
            borderStyle: {
                borderRadius: 0
            }
        }
    },

    hotkeys: [
        // gain
        {
            key: 'g',
            description: 'g: Gain GP',
            onPress() {
                clickClickable('g', 'gain');
            }
        },

        // up
        {
            key: 'ArrowUp',
            description: 'Arrow keys: Move the grid',
            onPress() {
                if(inChallenge('infinity', 12)) { _c_2048_moveTo(Direction.UP); return; }
                let anyMoved = false;
                do {
                    anyMoved = false;
                    for(let y = 2; y <= tmp.g.grid.cols; y++) {
                        for(let x = 1; x <= tmp.g.grid.rows; x++) {
                            let self = getGridData('g', (100 * y + x));
                            if(self == 0) continue;
                            let other = getGridData('g', (100 * (y - 1) + x));
                            if(self == other && self != IRON + getBuyableAmount('infinity', 5).toNumber()) {
                                setGridData('g', (100 * (y - 1) + x), other + 1);
                                setGridData('g', (100 * y + x), 0);
                                anyMoved = true;
                            } else if(other == 0) {
                                setGridData('g', (100 * (y - 1) + x), self);
                                setGridData('g', (100 * y + x), 0);
                                anyMoved = true;
                            }
                        }
                    }
                } while(anyMoved);
            }
        },
        // down
        {
            key: 'ArrowDown',
            onPress() {
                if(inChallenge('infinity', 12)) { _c_2048_moveTo(Direction.DOWN); return; }
                let anyMoved = false;
                do {
                    anyMoved = false;
                    for(let y = 1; y <= tmp.g.grid.cols - 1; y++) {
                        for(let x = 1; x <= tmp.g.grid.rows; x++) {
                            let self = getGridData('g', (100 * y + x));
                            if(self == 0) continue;
                            let other = getGridData('g', (100 * (y + 1) + x));
                            if(self == other && self != IRON + getBuyableAmount('infinity', 5).toNumber()) {
                                setGridData('g', (100 * (y + 1) + x), other + 1);
                                setGridData('g', (100 * y + x), 0);
                                anyMoved = true;
                            } else if(other == 0) {
                                setGridData('g', (100 * (y + 1) + x), self);
                                setGridData('g', (100 * y + x), 0);
                                anyMoved = true;
                            }
                        }
                    }
                } while(anyMoved);
            }
        },
        // left
        {
            key: 'ArrowLeft',
            onPress() {
                if(inChallenge('infinity', 12)) { _c_2048_moveTo(Direction.LEFT); return; }
                let anyMoved = false;
                do {
                    anyMoved = false;
                    for(let y = 1; y <= tmp.g.grid.cols; y++) {
                        for(let x = 2; x <= tmp.g.grid.rows; x++) {
                            let self = getGridData('g', (100 * y + x));
                            if(self == 0) continue;
                            let other = getGridData('g', (100 * y + (x - 1)));
                            if(self == other && self != IRON + getBuyableAmount('infinity', 5).toNumber()) {
                                setGridData('g', (100 * y + (x - 1)), other + 1);
                                setGridData('g', (100 * y + x), 0);
                                anyMoved = true;
                            } else if(other == 0) {
                                setGridData('g', (100 * y + (x - 1)), self);
                                setGridData('g', (100 * y + x), 0);
                                anyMoved = true;
                            }
                        }
                    }
                } while(anyMoved);
            }
        },
        // right
        {
            key: 'ArrowRight',
            onPress() {
                if(inChallenge('infinity', 12)) { _c_2048_moveTo(Direction.RIGHT); return; }
                let anyMoved = false;
                do {
                    anyMoved = false;
                    for(let y = 1; y <= tmp.g.grid.cols; y++) {
                        for(let x = 1; x <= tmp.g.grid.rows - 1; x++) {
                            let self = getGridData('g', (100 * y + x));
                            if(self == 0) continue;
                            let other = getGridData('g', (100 * y + (x + 1)));
                            if(self == other && self != IRON + getBuyableAmount('infinity', 5).toNumber()) {
                                setGridData('g', (100 * y + (x + 1)), other + 1);
                                setGridData('g', (100 * y + x), 0);
                                anyMoved = true;
                            } else if(other == 0) {
                                setGridData('g', (100 * y + (x + 1)), self);
                                setGridData('g', (100 * y + x), 0);
                                anyMoved = true;
                            }
                        }
                    }
                } while(anyMoved);
            }
        }
    ],

    grid: {
        rows: 4,
        cols: 4,

        getStartData(id) {
            return 0;
        },
        getUnlocked(id) { // Default
            return true
        },
        getCanClick(data, id) {
            return data > 0 && data != IRON + getBuyableAmount('infinity', 5).toNumber()
        },
        onClick(data, id) {
            if(data == IRON + getBuyableAmount('infinity', 5).toNumber()) return;
            if(player.g.selectedObjectId == 0) {
                player.g.selectedObjectId = id;
            } else if(player.g.selectedObjectId == id) {
                player.g.selectedObjectId = 0;
            } else {
                if(getGridData('g', player.g.selectedObjectId) == data && data != IRON + getBuyableAmount('infinity', 5).toNumber()) {
                    setGridData('g', player.g.selectedObjectId, 0);
                    setGridData('g', id, data + 1);
                }
                player.g.selectedObjectId = 0;
            }
        },
        getDisplay(data, id) {
            let multiplier = Decimal.pow(player.g.elementMultiplier, data - 1).divide(5);
            return `<h2>${options.toggleGalaxyGridElements ? ELEMENTS[data] : 2 ** data}</h2><p>+${multiplier.toFixed(2)}</p>`;
        },
        getStyle(data, id) {
            const jss = {
                margin: '1px',
                borderRadius: 0,
                color: ELCOLORS[data],
                borderColor: ELCOLORS[data],
                backgroundColor: `${ELCOLORS[data]}40`,
                borderWidth: '2px'
            };
            if(player.g.selectedObjectId == id) {
                jss.transform = 'scale(120%)';
                jss.zIndex = 100;
            }
            return jss;
        }
    },

    clickables: {

        gain: {
            display() { 
                if(hasChallenge('infinity', 42)) {
                    return `You are getting ${__(tmp.g.points.gain, 2, 1)} points per second.`
                }
                let gps = __(tmp.g.points.perSecond, 2, 0);
                if(gps === 'NaN') return `Reset for ${__(tmp.g.points.gain,2,0)} GP.<br>(You gain GP too fast to be calculated.)`;
                return `Reset for ${__(tmp.g.points.gain,2,0)} GP.<br>(${gps} GP/sec)` },
            canClick() { return !hasChallenge('infinity', 42) && tmp.g.points.gain.gte(1); },
            onClick() {
                if(hasChallenge('infinity', 42)) {
                    return;
                }

                if(hasChallenge('infinity', 22)) {
                    player.g.unlocked = true;
                    player.g.timeInCurrentAD = 0;
                    player.g.points = player.g.points.plus(tmp.g.points.gain);
                    return;
                }

                // Save data
                const gain = tmp.g.points.gain;

                resetAD();
                resetBD();
                resetPoints();

                player.bd.power = new Decimal(0);
                player.bd.restart = true;

                player.g.unlocked = true;
                player.g.timeInCurrentAD = 0;
                player.g.points = player.g.points.plus(gain);
            },
            style() {
                let gColor = {};
                if(hasChallenge('infinity', 42)) gColor = { 'border-color': '#63b8ff' };
                return { ...{ 'font-size': '10px', width: '316px', 'margin-bottom': '8px' }, ...gColor };
            }
        },

        auto: {
            display() {
                if(!getClickableState(this.layer, this.id)) setClickableState(this.layer, this.id, 'Locked');
                const state = getClickableState(this.layer, this.id);
                if(state === 'Locked' && hasChallenge('infinity', 12)) setClickableState(this.layer, this.id, 'ON');

                return `Auto: ${state}`;
            },

            canClick() {
                const state = getClickableState(this.layer, this.id);
                return state !== 'Locked'
            },

            onClick() {
                const state = getClickableState(this.layer, this.id);
                switch(state) {
                    case 'Locked': break;
                    case 'ON': setClickableState(this.layer, this.id, 'OFF'); break;
                    case 'OFF': setClickableState(this.layer, this.id, 'ON'); break;
                }
            },

            style() {
                let borderColor = '';
                let backgroundImage = '';
                let animation = '';
                const state = getClickableState(this.layer, this.id);

                if(state === 'Locked') return { 'display': 'none !important' }
    
                switch(state) {
                    case 'ON':
                        borderColor = '#c733cc !important';
                        backgroundImage = 'repeating-linear-gradient(-45deg, #332833, 10%, #222 10%, #222 20%)';
                        animation = 'ani-autobuyer-enabled 2000ms linear infinite';
                        break;
                    case 'OFF':
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
        },

        autoSupernova: {
            display() {
                if(!getClickableState(this.layer, this.id)) setClickableState(this.layer, this.id, 'Locked');
                const state = getClickableState(this.layer, this.id);
                if(state === 'Locked' && hasChallenge('infinity', 32)) setClickableState(this.layer, this.id, 'ON');

                return `Auto: ${state}`;
            },

            canClick() {
                const state = getClickableState(this.layer, this.id);
                return state !== 'Locked'
            },

            onClick() {
                const state = getClickableState(this.layer, this.id);
                switch(state) {
                    case 'Locked': break;
                    case 'ON': setClickableState(this.layer, this.id, 'OFF'); break;
                    case 'OFF': setClickableState(this.layer, this.id, 'ON'); break;
                }
            },

            style() {
                let borderColor = '';
                let backgroundImage = '';
                let animation = '';
                const state = getClickableState(this.layer, this.id);

                if(state === 'Locked') return { 'display': 'none !important' }
    
                switch(state) {
                    case 'ON':
                        borderColor = '#c733cc !important';
                        backgroundImage = 'repeating-linear-gradient(-45deg, #332833, 10%, #222 10%, #222 20%)';
                        animation = 'ani-autobuyer-enabled 2000ms linear infinite';
                        break;
                    case 'OFF':
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
    },

    buyables: {
        11: {
            cost(x) {
                return new Decimal(3).mul(x).plus(1)
                    .times(tmp.infinity.buyables[4].effect)
            },
            display() {
                return `Boost generation by 35%.<br><br>${tmp.g.spawnRate === (1 / 60) ? 'Maxed Out' : `Cost: ${__(this.cost(), 2)} GP`}`
            },
            canAfford() {
                return tmp.g.spawnRate !== (1 / 60) && player.g.points.gte(this.cost())
            },
            buy() {
                if(!this.canAfford()) return;
                player.g.points = player.g.points.sub(this.cost())
                setBuyableAmount('g', 11, getBuyableAmount('g', 11).plus(1));
            },
            style: {
                height: '75px'
            }
        },
        12: {
            cost(x) {
                return new Decimal(2).mul(x).plus(1)
                .times(tmp.infinity.buyables[4].effect)
            },
            display() {
                return `Boost merge rate by 35%.<br><br>${tmp.g.mergeRate === (1 / 60) ? 'Maxed Out' : `Cost: ${__(this.cost(), 2)} GP`}`
            },
            canAfford() {
                return tmp.g.mergeRate !== (1 / 60) && player.g.points.gte(this.cost())
            },
            buy() {
                if(!this.canAfford()) return;
                player.g.points = player.g.points.sub(this.cost())
                setBuyableAmount('g', 12, getBuyableAmount('g', 12).plus(1));
            },
            style: {
                height: '75px'
            }
        },
        21: {
            cost(x) {
                return Decimal.pow(10, x.plus(1))
                .times(tmp.infinity.buyables[4].effect)
            },
            effect() {
                return ELEMENTS[getBuyableAmount('g', 21).plus(1).toNumber()];
            },
            display() {
                return `Atoms start 1 tier later.<br>Currently ${this.effect()}.<br>Cost: ${__(this.cost(), 2)} GP`
            },
            unlocked() {
                return hasChallenge('infinity', 22);
            },
            canAfford() {
                return player.g.points.gte(this.cost())
            },
            buy() {
                if(!this.canAfford()) return;
                player.g.points = player.g.points.sub(this.cost())
                setBuyableAmount('g', 21, getBuyableAmount('g', 21).plus(1));
            },
            style: {
                height: '75px'
            }
        },
        22: {
            cost(x) {
                return Decimal.pow(10, x)
                .times(tmp.infinity.buyables[4].effect)
            },
            effect() {
                return Decimal.times(getBuyableAmount('g', 22), 10);
            },
            display() {
                return `+10% chance to spawn another atom.<br>Currently +${this.effect()}%.<br>Cost: ${__(this.cost(), 2)} GP`
            },
            unlocked() {
                return hasChallenge('infinity', 22);
            },
            canAfford() {
                return player.g.points.gte(this.cost())
            },
            buy() {
                if(!this.canAfford()) return;
                player.g.points = player.g.points.sub(this.cost())
                setBuyableAmount('g', 22, getBuyableAmount('g', 22).plus(1));
            },
            style: {
                height: '75px'
            }
        },
        13: {
            cost(x) {
                return new Decimal(1).plus(x);
            },
            display() {
                return `Explode your current star, giving a +0.45 boost on Star Power. ${hasChallenge('infinity', 32) ? '' : 'You will lose your current star.'}<br><br>Cost: ${__(this.cost())} ${ELEMENTS[IRON + getBuyableAmount('infinity', 5).toNumber()]}`
            },
            canAfford() {
                let sumOfFe = new Decimal(0);
                for(let y = 1; y <= tmp.g.grid.cols; y++) {
                    for(let x = 1; x <= tmp.g.grid.rows; x++) {
                        let id = 100 * y + x;
                        if(getGridData('g', id) == IRON + getBuyableAmount('infinity', 5).toNumber()) {
                            sumOfFe = sumOfFe.plus(1);
                        }
                    }
                }
                return sumOfFe.gte(this.cost())
            },
            buy() {
                // Reset the grid.
                if(!hasChallenge('infinity', 32)) {
                    for(let y = 1; y <= tmp.g.grid.cols; y++) {
                        for(let x = 1; x <= tmp.g.grid.rows; x++) {
                            let id = 100 * y + x;
                            setGridData('g', id, 0);
                        }
                    }
                }
                setBuyableAmount('g', 13, getBuyableAmount('g', 13).plus(1));
            },
            style: {
                width: '400px',
                height: '75px'
            }
        }
    }

});