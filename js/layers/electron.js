addLayer('e', {
    name: 'electrons',
    symbol: 'e<sup>-</sup>',
    position: 0,
    startData() {
        return {
            unlocked: 1,
            points: new Decimal(0),
        }
    },
    color: '#8dedf7',
    requires() {
        return new Decimal(5);
    },
    resource: "electrons",
    baseResource: "quarks",
    baseAmount() { return player.points },
    type: "static",
    exponent: 0,
    row: 2,
    layerShown() { return 1; },
    infoboxes:{
        info: {
            title: 'Electrons',
            body: 'Meta-stabilized quarks sometimes appear as electrons, the base source of electricity and energy distributed from atoms.',
            bodyStyle: {
                padding: '10px'
            }
        }
    },
    upgrades: {
    },
});