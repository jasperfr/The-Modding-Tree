addLayer('w', {
    name: 'waves',
    symbol: 'W',
    branches: ['r', 'q'],
    position: 0,
    startData() {
        return {
            unlocked: 1,
            points: new Decimal(0),
        }
    },
    color: '#c844cf',
    requires() {
        return new Decimal(5);
    },
    resource: "waves",
    baseResource: "particles",
    baseAmount() { return player.points },
    type: "static",
    exponent: 0,
    row: 0,
    layerShown() { return 1; },
    infoboxes:{
        info: {
            title: 'Wave Theory',
            body: 'Joining particles together gives them a force of attraction to each other, releasing an energy burst of so-called "waves". These waves, albeit near-invisible, are the source of all energy and matter of the universe.',
            bodyStyle: {
                padding: '10px'
            }
        }
    },
    upgrades: {
        11: {
            title: 'Particle Compression',
            description: 'Gain twice as much particles.',
            cost: new Decimal(3)
        },
        12: {
            title: 'String Theory',
            description: 'Gain more particles based on waves.',
            cost: new Decimal(10)
        }
    },
});