const ELEMENTS = ['', 'H', 'He', 'C', 'O', 'Ne', 'Mg', 'Si', 'Fe'];
const ELCOLORS = ['#222222', '#eeeeee', '#98b9ed', '#88878a', '#6acca8', '#85b1cc', '#82ed8d', '#e06153', '#999999'];

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

            elementMultiplier: 2.5,
            starPower: 1.0,

            selectedObjectId: 0,
        }
    },

    spawnRate() {
        return Decimal.pow(10, Decimal.pow(0.9, getBuyableAmount('g', 11)));
    },

    mergeRate() {
        return Decimal.mul(100, Decimal.pow(0.8, getBuyableAmount('g', 12)));
    },

    multiplier() {
        let sum = new Decimal(1);
        for(let y = 1; y <= tmp.g.grid.cols; y++) {
            for(let x = 1; x <= tmp.g.grid.rows; x++) {
                let id = 100 * y + x;
                let data = getGridData('g', id);
                if(data == 0) continue;
                let multiplier = Decimal.pow(player.g.elementMultiplier, data - 1).divide(10);
                sum = sum.plus(multiplier);
            }
        }
        return sum.pow(player.g.starPower);
    },

    getGrid() {
        let output = {};
        for(let y = 1; y <= tmp.g.grid.cols; y++) {
            for(let x = 1; x <= tmp.g.grid.rows; x++) {
                let id = 100 * y + x;
                let data = getGridData('g', id);
                if(data != 0 && data != 8) {
                    if(output[data] == undefined) {
                        output[data] = [];
                    }
                    output[data].push(id);
                }
            }
        }
        return output;
    },

    tabFormat: {
        'Star Power': {
            content: [
                ['display-text', function() {
                    const self = player[this.layer];
                    const temp = tmp[this.layer];
                    return `
                        <tt>You have <gp>${__(self.points,2,1)}</gp> Galaxy Points (GP).</tt> <br>
                        Your current star's power is <gp>${__(self.starPower,2,0)}</gp>x. <br>
                        Your current star boosts ADs by <gp>${__(tmp.g.multiplier, player.g.starPower)}</gp>x!<br>
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
                'buyables',
                'blank',
                'blank'
            ],
        },
        'Black Holes': { content: [['display-text', 'Coming soon...']] },
        'White Dwarves': { content: [['display-text', 'Coming soon...']] },
    },

    update(tick) {

        if(!player.g.unlocked) return;

        // Spawn a new atom when the interval has been reached.
        player.g.interval += tick;
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
                            if(self == other && self != 8) {
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
                            if(self == other && self != 8) {
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
                            if(self == other && self != 8) {
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
                            if(self == other && self != 8) {
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
            return data > 0 && data != 8
        },
        onClick(data, id) {
            if(data == 8) return;
            if(player.g.selectedObjectId == 0) {
                player.g.selectedObjectId = id;
            } else if(player.g.selectedObjectId == id) {
                player.g.selectedObjectId = 0;
            } else {
                if(getGridData('g', player.g.selectedObjectId) == data && data != 8) {
                    setGridData('g', player.g.selectedObjectId, 0);
                    setGridData('g', id, data + 1);
                }
                player.g.selectedObjectId = 0;
            }
        },
        getDisplay(data, id) {
            let multiplier = Decimal.pow(player.g.elementMultiplier, data - 1).divide(10);
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
                return `Boost generation by 10%.<br><br>Cost: ${__(this.cost())} GP`
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
                return `Boost merge rate by 20%.<br><br>Cost: ${__(this.cost())} GP`
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
        }
    }

});