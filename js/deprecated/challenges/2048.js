const Direction = { UP: 0, LEFT: 1, DOWN: 2, RIGHT: 3 };
const GRIDLIST = [101, 102, 103, 104, 105, 201, 202, 203, 204, 205, 301, 302, 303, 304, 305, 401, 402, 403, 404, 405, 501, 502, 503, 504, 505];

function shuffle(array) {
    let output = array.slice();
    for (var i = output.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = output[i];
        output[i] = output[j];
        output[j] = temp;
    }
    return output;
}

function _c_2048_createNew() {
    let data = shuffle(GRIDLIST);
    let set = false;
    for(let i = 0; i < data.length; i++) {
        if(!set && player.c_2048.grid[data[i]] === 0) {
            player.c_2048.grid[data[i]] = sumValues(player.infinity.challenges).toNumber() + Math.floor(1 + Math.random() * 2);
            set = true;
        }
    }
}

function _c_2048_moveTo(direction) {
    let anyMoved = false;
    let didMove = false;
    let lx = 1, ly = 1;
    let cx = 0, cy = 0;
    let dx = 0, dy = 0;

    switch(direction) {
        case Direction.UP:
            ly = 1;
            dy = -1;
            break;
        case Direction.DOWN:
            dy = 1;
            cy = -1;
            break;
        case Direction.LEFT:
            lx = 2;
            dx = -1;
            break;
        case Direction.RIGHT:
            dx = 1;
            cx = -1;
            break;
    }
    
    do {
        anyMoved = false;
        for(let y = ly; y <= tmp.c_2048.grid.cols + cy; y++) {
            for(let x = lx; x <= tmp.c_2048.grid.rows + cx; x++) {
                let self = getGridData('c_2048', (100 * y + x));
                if(self == 0) continue;
                let other = getGridData('c_2048', (100 * (y + dy) + (x + dx)));
                if(self == other && self != IRON) {
                    setGridData('c_2048', (100 * (y + dy) + (x + dx)), other + 1);
                    setGridData('c_2048', (100 * y + x), 0);
                    anyMoved = true;
                    didMove = true;
                } else if(other == 0) {
                    setGridData('c_2048', (100 * (y + dy) + (x + dx)), self);
                    setGridData('c_2048', (100 * y + x), 0);
                    anyMoved = true;
                    didMove = true;
                }
            }
        }
    } while(anyMoved);
    
    if(didMove) _c_2048_createNew();
}

addLayer('c_2048', {

    /* === Base information === */
    name: '2048',
    symbol: '!',
    color: '#dd3ffc',
    resource: 'GP',

    nodeStyle: {
        'color': 'white',
        'background-color': '#222',
        'border': '1px solid white'
    },

    tooltip() {
        return 'Challenge 2'
    },

    layerShown() {
        return inChallenge('infinity', 12);
    },

    /* === Data information === */
    startData() {
        return {
            selectedObjectId: 0,
        }
    },

    nerf: {
        effect() {
            return ELEMENTS[sumValues(player.infinity.challenges).toNumber() + 1];
        }
    },

    getGrid() {
        let output = {};
        for(let y = 1; y <= tmp.c_2048.grid.cols; y++) {
            for(let x = 1; x <= tmp.c_2048.grid.rows; x++) {
                let id = 100 * y + x;
                let data = getGridData('c_2048', id);
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
            return `
                <tt>You are stuck in <gp>Challenge 2</gp>.</tt> <br>
                You need to reach 1 Iron Atom to complete this challenge.
            `
        }, { 'color': 'silver', 'font-size': '12px' }],
        'blank',
        "grid",
        ['display-text', function() { return `Use the arrow keys to move the atoms around.`; }, { 'color': 'silver', 'font-size': '12px' }],
        'blank',
        'clickables',
        'blank'
    ],

    update() {
        let empty = true;
        for(let item of GRIDLIST) {
            if(player.c_2048.grid[item] !== 0) empty = false;
        }
        if(empty) _c_2048_createNew();
    },

    bars: {
        interval: {
            direction: RIGHT,
            width: 350,
            height: 16,
            progress() {
                return (player.g.interval / tmp.c_2048.spawnRate)
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
                return (player.g.mergeInterval / tmp.c_2048.mergeRate)
            },
            fillStyle: {
                background: '#5a39ad'
            },
            borderStyle: {
                borderRadius: 0
            }
        }
    },

    grid: {
        rows: 5,
        cols: 5,

        getStartData() {
            return 0;
        },
        getUnlocked() { // Default
            return true;
        },
        getCanClick() {
            return false;
        },
        getDisplay(data) {
            return `<h2>${options.toggleGalaxyGridElements ? ELEMENTS[data] : 2 ** data}</h2>`;
        },
        getStyle(data, id) {
            return {
                margin: '1px',
                borderRadius: 0,
                color: ELCOLORS[data],
                borderColor: ELCOLORS[data],
                backgroundColor: `${ELCOLORS[data]}40`,
                borderWidth: '2px'
            };
        }
    },

    clickables: {
        12: {
            display() { return '▲' },
            canClick() { return true },
            onClick() { _c_2048_moveTo(Direction.UP) },
            style() { return { width: '100px', height: '100px', 'font-size': '32pt' } }
        },
        21: {
            display() { return '◀' },
            canClick() { return true },
            onClick() { _c_2048_moveTo(Direction.LEFT) },
            style() { return { width: '100px', height: '100px', 'font-size': '24pt' } }
        },
        22: {
            display() { return '' },
            canClick() { return false },
            onClick() { },
            style() { return { width: '100px', height: '100px', 'background-color': 'transparent !important', 'border': 'none' } }
        },
        23: {
            display() { return '▶' },
            canClick() { return true },
            onClick() { _c_2048_moveTo(Direction.RIGHT) },
            style() { return { width: '100px', height: '100px', 'font-size': '24pt' } }
        },
        32: {
            display() { return '▼' },
            canClick() { return true },
            onClick() { _c_2048_moveTo(Direction.DOWN) },
            style() { return { width: '100px', height: '100px', 'font-size': '32pt' } }
        },

        51: {
            display() {
                return 'Reset the grid.'
            },
            canClick() {
                for(let item of GRIDLIST) {
                    if(player.c_2048.grid[item] === IRON) return false;
                }
                return true;
            },
            onClick() {
                if(confirm('Are you sure you want to restart the challenge?')) {
                    layerDataReset('c_2048');
                }
            }
        },
        52: {
            display() {
                return 'Complete the challenge.<br>Requires 1 Iron Atom.'
            },
            canClick() {
                for(let item of GRIDLIST) {
                    if(player.c_2048.grid[item] === IRON) return true;
                }
                return false;
            },
            onClick() {
                completeChallenge('infinity', 12);
                showTab('infinity');
            }
        }
    }

});