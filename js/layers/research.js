addLayer('r', {

    name: 'Research',
    symbol: '★',
    color: 'magenta',

    branches: ['h', ['t', 1], 'p'],

    resource: 'Research Points',
    baseResource: '$',

    startData() {
        return {
            steam: new Decimal(0),
            maxSteam: new Decimal(1000),
            steamPerSecond: new Decimal(0)
        }
    },
});