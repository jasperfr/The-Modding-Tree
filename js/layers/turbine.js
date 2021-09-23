addLayer('t', {

    name: 'Turbine',
    symbol: '⊛',
    color: 'silver',

    branches: ['e'],

    resource: 'RPM',
    baseResource: 'steam',

    startData() {
        return {
            rpm: new Decimal(0)
        }
    },

});