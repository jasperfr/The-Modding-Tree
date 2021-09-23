addLayer('s', {

    name: 'Steam',
    symbol: '∿',
    color: 'white',

    branches: [['h', 3], 't'],

    resource: 'steam',
    baseResource: 'heat',

    startData() {
        return {
            steam: new Decimal(0),
            maxSteam: new Decimal(1000),
            steamPerSecond: new Decimal(0)
        }
    },

    tooltip() { return `${format(player[this.layer].steam)}/${player[this.layer].maxSteam} L of steam` },

    tabFormat: [
        ['display-text', function () {
            return `
            <h2>You have <span style="text-shadow: 0 0 2px white; font-weight:600;">${format(player[this.layer].steam)}</span><span>/${player[this.layer].maxSteam}</span> m³ of steam.</h2><br>
            <h3>Your steam boiler can produce <span style="text-shadow: 0 0 2px white; font-weight:600;">${format(player[this.layer].steamPerSecond)}</span> m³ per second.</h3><br>
            <h4>You will start producing steam at 100˚C, at a rate of 1.00 + (temp * 0.025) m³ per second.</h4><br>
            <h4>Your reactor's temperature is <span style="color: red; text-shadow: 0 0 2px red; font-weight:600;">${format(player.h.heat)}</span><span>/${player.h.maxHeat}</span>°C,<br>
            multiplying conversion rate by ${format(player.h.heat.divide(100))}x.</h4>
            <h4>You have <span style="color: cyan; text-shadow: 0 0 2px blue; font-weight:600;">${format(player.p.water)}</span><span>/${player.p.tankSize}</span> L water.</h4>
            <h4>Your pumps are pumping <span style="color: cyan; text-shadow: 0 0 2px blue; font-weight:600;">0</span> mL of water per second. </h4>
            `
        }],
        'blank',
        ['row', [
            ['bar', 'waterBar'],
            'blank',
            ['bar', 'heatBar'],
            'blank',
            ['bar', 'steamBar']
        ]]
    ],

    update(diff) {
        const conversionRate = player.h.heat.divide(100).times(2.5);
        const self = player[this.layer];
        if(player.h.heat.lt(20)) return;
        var gain = Decimal.min(player.p.water, 1).times(diff).times(conversionRate);
        gain = Decimal.min(self.maxSteam.minus(self.steam), gain);

        player.p.water = player.p.water.minus(gain);
        self.steam = self.steam.plus(gain);
        self.steamPerSecond = gain.divide(diff);
    },

    bars: {
        waterBar: {
            direction: UP,
            width: 50,
            height: 300,
            progress() { return player.p.water.divide(player.p.tankSize) },
            fillStyle: { 'background-color': 'blue' },
        },
        heatBar: {
            direction: UP,
            width: 50,
            height: 300,
            progress() { return player.h.heat.divide(player.h.maxHeat) },
            fillStyle: { 'background-color': 'red' },
        },
        steamBar: {
            direction: UP,
            width: 50,
            height: 300,
            progress() { return player[this.layer].steam.divide(player[this.layer].maxSteam) },
        }
    }
})