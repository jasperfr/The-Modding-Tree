addLayer('h', {

    name: 'Heat',
    symbol: 'H',
    position: 0,
    row: 0,
    color: 'red',

    resource: 'heat',
    baseResource: 'cash',

    startData() {
        return {
            heat: new Decimal(0),
            maxHeat: new Decimal(100),
            heatGeneration: new Decimal(0.01)
        }
    },

    tooltip() { return `${format(player[this.layer].heat)}/${player[this.layer].maxHeat} heat` },

    update(diff) {
        const self = player[this.layer];
        const gain = self.heatGeneration.times(diff);
        self.heat = self.heat.plus(gain);
        self.heat = Decimal.min(self.heat, self.maxHeat);
    },

    tabFormat: [
        ['display-text', function() { return `
            <h2>You have <span style="color: red; text-shadow: 0 0 2px red; font-weight:600;">${format(player[this.layer].heat)}</span><span>/${player[this.layer].maxHeat}</span> heat.</h2><br>
            <h3>Your reactor produces <span style="color: red; text-shadow: 0 0 2px red; font-weight:600;">${player[this.layer].heatGeneration}</span> heat per second.</h3>`}],
        'blank',
        'h-line',
        'blank',
        'grid',
        'blank',
        'clickables'
    ],

    grid: {
        rows: 4,
        cols: 5,
        getStartData(id) {
            return 0;
        },
        getUnlocked(id) {
            return true
        },
        getCanClick(data, id) {
            return true
        },
        onClick(data, id) { 

        },
        getStyle(data, id) {
            return {
                'background-color': 'gray'
            }
        },
        getDisplay(data, id) {
            return 'Empty slot'
        }
    },

    clickables: {
        11: {
            title: 'Uranium-235',
            display() {
                return `Lifetime: 50 seconds
                        Generates 10 H/s
                        Cost: $40 / tile`
            },
            canClick() { return true; },
            style() { return { 'background-color': 'green' }}
        },
        12: {
            title: 'Thorium-189',
            display() {
                return `Lifetime: 2m30s
                        Generates 50 H/s
                        Cost: $500 / tile`
            },
            canClick() { return true; },
            style() { return { 'background-color': 'cyan' }}
        },
        13: {
            title: 'Americium-450',
            display() {
                return `Lifetime: 10m
                        Generates 200 H/s
                        Cost: $3500 / tile`
            },
            canClick() { return true; },
            style() { return { 'background-color': 'yellow' }}
        },

        21: {
            title: 'Booster Mk.I',
            display() {
                return `Boosts H/s
                        of 4 adjacent tiles by 1.5x, but lowers their
                        lifespan by 0.9x.
                        Cost: $100 / tile`
            },
            canClick() { return true; },
            style() { return { 'background-color': 'silver' }}
        },
        22: {
            title: 'Booster Mk.II',
            display() {
                return `Boosts H/s
                        of 8 adjacent tiles by 2x, but lowers their
                        lifespan by 0.8x.
                        Cost: $1000 / tile`
            },
            canClick() { return true; },
            style() { return { 'background-color': 'gray' }}
        },
        23: {
            title: 'Fission Beam',
            display() {
                return `Increases the lifespan of fuel by 1.75x,
                        but lowers their production by 0.75x.
                        Cost: $2000 / tile`
            },
            canClick() { return true; },
            style() { return { 'background-color': 'black', color: 'white' }}
        },

        31: {
            title: 'Copper Tubing',
            display() {
                return `Increases the maximum heat multiplier
                        by 1.2x for each Uranium fuel rod.
                        Cost: $650 / tile`
            },
            canClick() { return true; },
            style() { return { 'background-color': 'orange' }}
        },
        32: {
            title: 'Aluminium Plating',
            display() {
                return `Increases the base maximum heat
                        by 100 for each Thorium fuel rod.
                        Cost: $750 / tile`
            },
            canClick() { return true; },
            style() { return { 'background-color': 'white' }}
        },
        33: {
            title: 'Titanium Plating',
            display() {
                return `Increases the maximum heat by 1.5x,
                        but lowers the lifespan of fuel by 0.85x.
                        Cost: $600 / tile`
            },
            canClick() { return true; },
            style() { return { 'background-color': 'magenta' }}
        }
    }
});

/*
addLayer('g', {

    name: 'Generators',
    symbol: 'G',
    position: 1,
    row: 0,

    resource: 'energy',
    baseResource: 'cash',

    startData() {
        return {
            energy: new Decimal(0),
        }
    },

    midsection: ['grid'],

    grid: {
        rows: 4,
        cols: 5,
        getStartData(id) {
            return {
                plotType: 'empty'
            }
        },
        getUnlocked(id) { // Default
            return true
        },
        getCanClick(data, id) {
            return true
        },
        onClick(data, id) { 
            player[this.layer].grid[id]++
        },
        getDisplay(data, id) {
            switch(data.plotType) {
                case 'empty': return 'Empty plot';
            }
        }
    }

});
*/
