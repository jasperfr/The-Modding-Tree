addLayer('q', {
    name: 'quarks',
    symbol: 'Q',
    branches: ['e', 'a'],
    position: 0,
    startData() {
        return {
            unlocked: 1,
            points: new Decimal(0),
        }
    },
    color: '#bf4396',
    requires() {
        return new Decimal(5);
    },
    resource: "quarks",
    baseResource: "waves",
    baseAmount() { return player.points },
    type: "static",
    exponent: 0,
    row: 1,
    layerShown() { return 1; },
    infoboxes:{
        info: {
            title: 'Quirky quarks',
            body: 'With an immense amount of particles glued together by waves, the first quarks are formed. These little things are the building blocks of every atom.',
            bodyStyle: {
                padding: '10px'
            }
        }
    },
    upgrades: {
    },
});