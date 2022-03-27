// hidden layer, only for style
addLayer('crunch', {
    tabFormat: [
        ['display-text', '<h1>The universe has collapsed due to excess antimatter.</h1>'],
        'blank',
        ['clickable', 'crunch']
    ],

    update() {
        if(player.points.gte(new Decimal('2e1024'))) {
            options.forceOneTab = true;
            player.points = new Decimal('2e1024')
            showTab('crunch');
        }
    },

    clickables: {
        'crunch': {
            display() { return 'Big Crunch' },
            canClick() { return true },
            onClick() {
                player.infinity.unlocked = true;
                player.infinity.points = player.infinity.points.plus(1);
                player.infinity.infinities = player.infinity.infinities.plus(1);
                layerDataReset('ad');
                layerDataReset('bd');
                layerDataReset('g');

                // hasMilestone does not work for whatever reason, just hard code values for now...
                player.points = player.infinity.infinities.gte(1) ? new Decimal(100) : new Decimal(10);
                player.bd.points = player.infinity.infinities.gte(2) ? new Decimal(1) : new Decimal(0);
                player.g.unlocked = false;
                player.g.points = player.infinity.infinities.gte(3) ? new Decimal(1) : new Decimal(0);
                player.g.buff = player.infinity.infinities.gte(3) ? new Decimal(0.03) : new Decimal(0.015);

                options.forceOneTab = false;
                showTab('ad');
            },
            style() {
                return {
                    width: '500px',
                    height: '200px',
                    border: '8px solid orange !important',
                    'font-size': '72px'
                }
            }
        }
    }
});

addLayer('infinity', {

    /* === Base information === */
    name: 'Infinity',
    symbol: 'I',
    color: 'orange',
    branches: ['ad'],
    layerShown() { return player.infinity.unlocked },
    resource: 'IP',

    /* === Data information === */
    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            infinities: new Decimal(0)
        }
    },

    tabFormat: {
        'Information': {
            content: [
                elements.ipHeader,
                ['display-text', 'The Infinity layer is still a work in progress.<br>Consider this to be the end game.']
            ]
        },
        'Upgrades': {
            content: [
                elements.ipHeader,
                ['row', [['upgrade', 'boostTimePlayed'], 'blank', ['upgrade', 'boostInfinities'], 'blank', ['upgrade', 'gainMoreBP']]]
            ]
        },
        'Challenges': {
            content: [
                elements.ipHeader,
                ['display-text', 'Challenges are still a work in progress.']
            ]
        },
        'Milestones': {
            content: [
                elements.ipHeader,
                'milestones',
                ['display-text', 'Milestones after the third one have not been implemented yet.']
            ]
        },
        'Break': {
            content: [
                elements.ipHeader,
                ['display-text', 'Break Infinity is still a work in progress.']
            ]
        }
    },

    upgrades: {
        boostTimePlayed: {
            effect() { return Decimal.max(1.0, Decimal.pow(player.timePlayed / 10, 0.25)) },
            description() { return `Antimatter and Booster Dimensions gain a multiplier based on time played.<br>Currently: ${mixedStandardFormat(this.effect(), 2, 0)}x`  },
            cost: 1,
            style: { height: '100px', border: '2px solid orange !important' }
        },
        boostInfinities: {
            effect() { return Decimal.plus(5.0, Decimal.times(player.infinity.infinities, 0.55)) },
            description() { return `Antimatter and Booster Dimensions gain a multiplier based on infinities.<br>Currently: ${mixedStandardFormat(this.effect(), 2, 0)}x`  },
            cost: 1,
            style: { height: '100px', border: '2px solid orange !important' }
        },
        gainMoreBP: {
            effect() { return new Decimal(2.5) },
            description() { return `Gain 2.5x as much Booster Points.` },
            cost: 1,
            style: { height: '100px', border: '2px solid orange !important' }
        }
    },

    milestones: {
        hunderedAM: {
            requirementDescription: '1 Infinity',
            effectDescription: 'Start with 100 antimatter.',
            done() { return player.infinity.infinities.gte(1); }
        },
        startWithBP: {
            requirementDescription: '2 Infinities',
            effectDescription: 'Start with 1 Booster Point.',
            done() { return player.infinity.infinities.gte(2); }
        },
        galaxyBoost: {
            requirementDescription: '3 Infinities',
            effectDescription: 'Start with 1 galaxy and galaxies are twice as powerful.',
            done() { return player.infinity.infinities.gte(3); }
        },
        bpGeneration: {
            requirementDescription: '5 Infinities',
            effectDescription: 'Gain  50% BP/sec based on your maximum BP gain.',
            done() { return player.infinity.infinities.gte(5); }
        },
        keepBpMulti: {
            requirementDescription: '10 Infinities',
            effectDescription: 'The Booster Multiplier doesn\'t reset on BP gain.',
            done() { return player.infinity.infinities.gte(5); }
        },
        keepShifts: {
            requirementDescription: '25 Infinities',
            effectDescription: 'Keep your Dimension Shifts on reset.',
            done() { return player.infinity.infinities.gte(25); }
        },
        noReset: {
            requirementDescription: '25 Infinities',
            effectDescription: 'Galaxies and Booster Points don\'t reset anything.',
            done() { return player.infinity.infinities.gte(50); }
        },
        break: {
            requirementDescription: '100 Infinities',
            effectDescription: 'You can break Infinity.',
            done() { return player.infinity.infinities.gte(100); }
        },
    }

});