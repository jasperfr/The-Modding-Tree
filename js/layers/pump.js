addLayer('p', {

    name: 'Pumps',
    symbol: '≋',
    color: '#2384eb',
    nodeStyle: {
        'background': 'linear-gradient(317deg, #2f5bb4, #53a3e4, #a1bdf5)',
        'background-size': '400% 400%',
    
        '-webkit-animation': 'hydro 2s ease infinite',
        '-moz-animation': 'hydro 2s ease infinite',
        'animation': 'hydro 2s ease infinite',
    },

    branches: ['s'],

    resource: 'L water',
    baseResource: 'energy',

    startData() {
        return {
            water: new Decimal(0),
            pumps: new Decimal(0),
            tankSize: new Decimal(10),
            pumpProduction: new Decimal(0),
            energyConsumption: new Decimal(0),
        }
    },

    tooltip() { return `${format(player[this.layer].water)}/${player[this.layer].tankSize} L water` },

    tabFormat: [
        ['display-text', function () {
            const self = player[this.layer];
            return `
            <h2>You have <span style="color: cyan; text-shadow: 0 0 2px blue; font-weight:600;">${format(player[this.layer].water)}</span><span>/${player[this.layer].tankSize}</span> L water.</h2><br>
            <h3>Your tank's capacity is ${format(player[this.layer].tankSize)} L.</h3><br><br>
            <h4>You have ${self.pumps.toFixed(0)} pumps.<br>
            Each pump pumps ${format(self.pumpProduction)} L of water per second.<br>
            Your pumps produce <span style="color: cyan; text-shadow: 0 0 2px blue;">${format(self.pumps.times(self.pumpProduction))}</span> L of water per second.<br>
            Your pumps need <span style="color: yellow; text-shadow: 0 0 2px blue;">0</span> kWh of energy per second to operate.</h4>
            `
        }],
        'blank',
        ['bar', 'waterTank'],
        'blank',
        ['clickables', 11],
    ],

    clickables: {
        11: {
            display() { return 'Scoop 1L of water manually.' },
            onClick() { 
                const self = player[this.layer];
                if(self.water.lt(self.tankSize)) {
                    self.water = self.water.plus(1);
                }
             },
            canClick() { return true; }
        }
    },

    bars: {
        waterTank: {
            direction: UP,
            width: 300,
            height: 300,
            progress() { return player[this.layer].water.divide(player[this.layer].tankSize) },
            fillStyle: { 
                'background': 'linear-gradient(317deg, #2f5bb4, #53a3e4, #a1bdf5)',
                'background-size': '400% 400%',
            
                '-webkit-animation': 'hydro 2s ease infinite',
                '-moz-animation': 'hydro 2s ease infinite',
                'animation': 'hydro 2s ease infinite',
             },
        }
    },

    update(diff) {
        const self = player[this.layer];
        // const gain = new Decimal(1).times(diff);
        self.water = self.water.plus(new Decimal(5).times(diff));
        self.water = Decimal.min(self.water, self.tankSize);
    }

});