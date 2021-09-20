addLayer('r', {
    name: 'radiation',
    symbol: '☢',
    branches: ['l'],
    position: 0,
    startData() {
        return {
            unlocked: 1,
            points: new Decimal(0),
        }
    },
    color: '#dbd637',
    requires() {
        return new Decimal(5);
    },
    resource: "rads",
    baseResource: "waves",
    baseAmount() { return player.points },
    type: "static",
    exponent: 0,
    row: 1,
    layerShown() { return 1; },
    infoboxes:{
        info: {
            title: 'Radiation',
            body: 'Unstable waves might turn into waves of radiation, which are volatile energy waves capable of unstabilizing everything in their path.',
            bodyStyle: {
                padding: '10px'
            }
        }
    },
    upgrades: {
    },
});