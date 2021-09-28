addLayer('t', {

    name: 'Turbine',
    symbol: '⊛',
    color: 'silver',

    branches: ['e'],

    resource: 'rpm',
    baseResource: 'steam',

    startData() {
        return {
            rpm: new Decimal(0),
            maxRpm: new Decimal(10000),
            rpmWsConversionRatio: new Decimal(0.1),
            acceleration: new Decimal(1.01),
            steamRequired: new Decimal(1)
        }
    },

    calculateSteamRequirement() {
        const self = player[this.layer];
        return self.rpm.pow(1.5);
    },

    calculateWs() {
        return player[this.layer].rpmWsConversionRatio.times(player[this.layer].rpm);
    },

    tooltip() { return `${format(player[this.layer].rpm)}/${player[this.layer].maxRpm} RPM<br>(${this.calculateWs()} W/s)` },

    tabFormat: [
        ['display-text', function () {
            const self = player[this.layer];
            return `
            <h2>Your turbine is running at <span style="color: silver; text-shadow: 0 0 2px blue; font-weight:600;">${format(self.rpm)}</span><span>/${self.maxRpm}</span> RPM.</h2><br>
            <h4>It needs <span style="color: white;">${format(self.steamRequired)}</span> m³ of steam per second to operate.</h4>
            `
        }]
    ],

    update(delta) {
        const self = player[this.layer];
        if(self.rpm.lte(0)) {
            self.rpm = self.rpm.plus(0.01)
        } else {
            self.rpm = self.rpm.times(self.acceleration)
            self.rpm = Decimal.min(self.rpm, self.maxRpm)
        }
        self.steamRequired = this.calculateSteamRequirement();
    }

});