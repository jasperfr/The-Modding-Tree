const ELEMENTS = ['', 'H', 'He', 'C', 'N', 'O', 'Ne', 'Mg', 'Si', 'S', 'Ar', 'Fe'];
const IRON = 11;
const ELCOLORS = ['#222222', '#eeeeee', '#98b9ed', '#88878a', '#eb9234', '#6acca8', '#85b1cc', '#82ed8d', '#e06153', '#e6c019', '#e65529', '#999999'];

addLayer('g', {

    /* === Base information === */
    name: 'Galaxies',
    symbol: 'G',
    color: '#dd3ffc',
    resource: 'GP',

    layerShown() {
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
        }
    },

    starPower() {
        if(!player.g.unlocked) return new Decimal(1.0);
        return Decimal
            .plus(1.0, Decimal.times(0.45, getBuyableAmount('g', 13)))
            .plus(hasAchievement('ach', 36) ? 1 : 0)
            .plus(hasAchievement('ach', 37) ? 1 : 0)
            .toNumber();
    },

    spawnRate() {
        return Decimal.mul(10, Decimal.pow(0.65, getBuyableAmount('g', 11))).toNumber();
    },

    mergeRate() {
        return Decimal.mul(20, Decimal.pow(0.65, getBuyableAmount('g', 12))).toNumber();
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
                if(data != 0 && data != IRON) {
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
                Your current star boosts ADs by <gp>${__(tmp.g.multiplier, tmp.g.starPower)}</gp>x!<br>
                ([total fusion power]<sup>[star power]</sup>)
            `
        }, { 'color': 'silver', 'font-size': '12px' }],
        'blank',
        ["bar", "interval"],
        ['display-text', function() { return `Spawn rate: <b>${(1 / tmp.g.spawnRate).toFixed(2)}</b>/sec`; }, { 'color': 'silver', 'font-size': '12px' }],
        'blank',
        ["bar", "merge"],
        ['display-text', function() { return `Merge rate: <b>${(1 / tmp.g.mergeRate).toFixed(2)}</b>/sec`; }, { 'color': 'silver', 'font-size': '12px' }],
        'blank',
        "grid",
        ['display-text', function() { return `Use the arrow keys or the mouse to move / merge the atoms around.<br>The multiplier increases with each higher atom,<br>but will <u tooltip="Stars can't fuse iron!">stop</u> at Iron (Fe).`; }, { 'color': 'silver', 'font-size': '12px' }],
        'blank',
        ['row', [
            ['buyable', 11],
            ['buyable', 12],
        ]],
        'blank',
        ['display-text', function() { return `Supernovas (${getBuyableAmount('g', 13)})` }, { 'color': 'white', 'font-size': '14px' }],
        'blank',
        ['row', [
            ['buyable', 13],
        ]],
        'blank'
    ],

    update(tick) {

        if(!player.g.unlocked) return;

        // Spawn a new atom when the interval has been reached.
        player.g.interval += tick;
        // for some reason this kind of happens
        if(typeof player.g.interval !== 'number') player.g.interval = 0;

        if(player.g.interval > tmp.g.spawnRate) {
            let set = false;
            for(let y = 1; y <= tmp.g.grid.cols; y++) {
                for(let x = 1; x <= tmp.g.grid.rows; x++) {
                    let id = 100 * y + x;
                    if(!set && player.g.grid[id] == 0) {
                        player.g.grid[id] = 1;
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
        // up
        {
            key: 'ArrowUp',
            onPress() {
                let anyMoved = false;
                do {
                    anyMoved = false;
                    for(let y = 2; y <= tmp.g.grid.cols; y++) {
                        for(let x = 1; x <= tmp.g.grid.rows; x++) {
                            let self = getGridData('g', (100 * y + x));
                            if(self == 0) continue;
                            let other = getGridData('g', (100 * (y - 1) + x));
                            if(self == other && self != IRON) {
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
                let anyMoved = false;
                do {
                    anyMoved = false;
                    for(let y = 1; y <= tmp.g.grid.cols - 1; y++) {
                        for(let x = 1; x <= tmp.g.grid.rows; x++) {
                            let self = getGridData('g', (100 * y + x));
                            if(self == 0) continue;
                            let other = getGridData('g', (100 * (y + 1) + x));
                            if(self == other && self != IRON) {
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
                let anyMoved = false;
                do {
                    anyMoved = false;
                    for(let y = 1; y <= tmp.g.grid.cols; y++) {
                        for(let x = 2; x <= tmp.g.grid.rows; x++) {
                            let self = getGridData('g', (100 * y + x));
                            if(self == 0) continue;
                            let other = getGridData('g', (100 * y + (x - 1)));
                            if(self == other && self != IRON) {
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
                let anyMoved = false;
                do {
                    anyMoved = false;
                    for(let y = 1; y <= tmp.g.grid.cols; y++) {
                        for(let x = 1; x <= tmp.g.grid.rows - 1; x++) {
                            let self = getGridData('g', (100 * y + x));
                            if(self == 0) continue;
                            let other = getGridData('g', (100 * y + (x + 1)));
                            if(self == other && self != IRON) {
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
            return data > 0 && data != IRON
        },
        onClick(data, id) {
            if(data == IRON) return;
            if(player.g.selectedObjectId == 0) {
                player.g.selectedObjectId = id;
            } else if(player.g.selectedObjectId == id) {
                player.g.selectedObjectId = 0;
            } else {
                if(getGridData('g', player.g.selectedObjectId) == data && data != IRON) {
                    setGridData('g', player.g.selectedObjectId, 0);
                    setGridData('g', id, data + 1);
                }
                player.g.selectedObjectId = 0;
            }
        },
        getDisplay(data, id) {
            let multiplier = Decimal.pow(player.g.elementMultiplier, data - 1).divide(5);
            return `<h2>${ELEMENTS[data]}</h2><p>+${multiplier.toFixed(2)}</p>`;
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

    buyables: {
        11: {
            cost(x) {
                return new Decimal(3).mul(x).plus(1)
            },
            display() {
                return `Boost generation by 35%.<br><br>Cost: ${__(this.cost())} GP`
            },
            canAfford() {
                return player.g.points.gte(this.cost())
            },
            buy() {
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
            },
            display() {
                return `Boost merge rate by 35%.<br><br>Cost: ${__(this.cost())} GP`
            },
            canAfford() {
                return player.g.points.gte(this.cost())
            },
            buy() {
                player.g.points = player.g.points.sub(this.cost())
                setBuyableAmount('g', 12, getBuyableAmount('g', 12).plus(1));
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
                return `Explode your current star, giving a +0.45 boost on Star Power. You will lose your current star.<br><br>Cost: ${__(this.cost())} Fe`
            },
            canAfford() {
                let sumOfFe = new Decimal(0);
                for(let y = 1; y <= tmp.g.grid.cols; y++) {
                    for(let x = 1; x <= tmp.g.grid.rows; x++) {
                        let id = 100 * y + x;
                        if(getGridData('g', id) == IRON) {
                            sumOfFe = sumOfFe.plus(1);
                        }
                    }
                }
                return sumOfFe.gte(this.cost())
            },
            buy() {
                // Reset the grid.
                for(let y = 1; y <= tmp.g.grid.cols; y++) {
                    for(let x = 1; x <= tmp.g.grid.rows; x++) {
                        let id = 100 * y + x;
                        setGridData('g', id, 0);
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