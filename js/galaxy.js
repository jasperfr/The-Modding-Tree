addLayer('g', {

    name: 'Galaxies',
    symbol: 'G',
    color: '#5339b3',
    resource: 'galaxies',

    layerShown() {
        return player.g.points.gt(0);
    },

    startData() {
        return {
            points: new Decimal(0),
            buff: new Decimal(0.015)
        }
    },

    tabFormat: {
        'Galaxies': {
            content: [
                ['display-text', function() { return  `You have <span style="color:#5339b3;font-size:20px;font-weight:bold;">${mixedStandardFormat(player.g.points, 2, 1)}</span> galax${player.g.points.eq(1) ? 'y' : 'ies'}.`; }, { 'color': 'silver' }],
                ['display-text', function() { return `Each galaxy buffs tickspeed upgrades by +${mixedStandardFormat(player.g.buff, 2)}x,<br>boosting tickspeed increase to <span style="color:#5339b3;font-size:20px;font-weight:bold;">${new Decimal(1.125).plus(player.g.buff.times(player.g.points))}x</span>.`; }, { 'font-size': '12px', 'color': 'silver' }],
                'blank','blank',
                ['display-text', 'You get 1 galaxy per 2<sup>1024</sup> (1.79e308) antimatter.<br><br>Galaxies will reset Antimatter, Dimension Shifts, Booster Points, Booster Upgrades, and Booster Dimensions.<br><br>Reach milestones to remove these resets.']
            ]
        },
        'Milestones': {
            content: [
                'milestones',
                ['display-text', 'Milestones are still in development and may not work at all.']
            ]
        },
    },

    milestones: {
        0: {
            requirementDescription: "1 Galaxy",
            effectDescription: "Start with 100 antimatter and Booster<br>Multiplier does not reset on Dimension Shifts.",
            done() { return player.g.points.gte(1) }
        },
        1: {
            requirementDescription: "2 Galaxies",
            effectDescription: "Keep autobuyer upgrades on reset, and they max all<br>regardless of the Booster Upgrade.",
            done() { return player.g.points.gte(2) }
        },
        2: {
            requirementDescription: "3 Galaxies",
            effectDescription: "Keep dimensional shifts on reset.",
            done() { return player.g.points.gte(3) }
        },
    }
});
