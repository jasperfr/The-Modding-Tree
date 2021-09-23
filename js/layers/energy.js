addLayer('e', {

    name: 'Energy',
    symbol: '↯',
    color: 'yellow',

    branches: [['p', 2], 'h'],

    resource: 'W',
    baseResource: 'RPM',

    startData() {
        return {
            rpm: new Decimal(0)
        }
    },

});