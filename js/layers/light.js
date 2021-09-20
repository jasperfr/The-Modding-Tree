addLayer('l', {
    name: 'light',
    symbol: 'RGB',
    position: 0,
    startData() {
        return {
            unlocked: 1,
            points: new Decimal(0),
        }
    },
    color: '#ffffff',
    requires() {
        return new Decimal(5);
    },
    resource: "light",
    baseResource: "radiation",
    baseAmount() { return player.points },
    type: "static",
    exponent: 0,
    row: 2,
    layerShown() { return 1; },
    infoboxes:{
        info: {
            title: 'Light',
            body: 'Radioactive wavelengts might lose their energy levels, turning from nuclear radiation into visible light.',
            bodyStyle: {
                padding: '10px'
            }
        }
    },
    upgrades: {
    },
});