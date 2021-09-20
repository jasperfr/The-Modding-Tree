addLayer('a', {
    name: 'atoms',
    symbol: '⚛',
    position: 0,
    startData() {
        return {
            unlocked: 1,
            points: new Decimal(0),
        }
    },
    color: '#eb5542',
    requires() {
        return new Decimal(5);
    },
    resource: "atoms",
    baseResource: "quarks",
    baseAmount() { return player.points },
    type: "static",
    exponent: 0,
    row: 2,
    layerShown() { return 1; },
    infoboxes:{
        info: {
            title: 'Atoms',
            body: 'Joining quarks with each other creates two types of atoms: Protons and Neutrons. These two particles are the core of each atom in the universe.',
            bodyStyle: {
                padding: '10px'
            }
        }
    },
    upgrades: {
    },
});