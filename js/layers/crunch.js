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

    update(tick) {
        // const p = {
        //     image: 'resources/genericParticle.png',
        //     spread: 25,
        //     gravity: 0,
        //     time: 5,
        //     speed() { // Randomize speed a bit
        //         return (Math.random() + 1.2) * 10 
        //     },
        //     dir: Math.random() * 360,
        //     x: 1450,
        //     y: 850,
        //     layer: 'infinity',
        //     style: {
        //         zIndex: '10'
        //     }
        // }

        // makeParticles(p, 4);
    },

    tabFormat: {
        'Information': {
            content: [
                elements.ipHeader,
                ['display-text', 'The Infinity layer is still a work in progress.<br>Consider this to be the end game.']
            ]
        },
        'Infinity Studies': {
            content: [
                elements.ipHeader,
                ['row', [['upgrade', 'boostTimePlayed']]],
                'blank','blank',
                ['row', [['upgrade', 'achievementBonus'], 'blank', ['upgrade', 'boostUnspentIP']]],
                'blank','blank',
                ['row', [['upgrade', 'reduceCostScaling']]],
                'blank','blank',
                ['row', [['upgrade', 'infChallenge1']]],
                'blank','blank',
                ['row', [['upgrade', 'boostInfinities'], 'blank', ['upgrade', 'gainMoreBP'], 'blank', ['upgrade', 'log10EffectGP']]],
                'blank',
                ['row', [['upgrade', 'dimPower10'], 'blank', ['upgrade', 'boostUnspentBP'], 'blank', ['upgrade', 'startAtC']]],
                'blank',
                ['row', [['upgrade', 'increaseTickspeed'], 'blank', ['upgrade', 'bpsBoostsItself'], 'blank', ['upgrade', 'startAt308']]],
                'blank','blank',
                ['row', [['upgrade', 'infChallenge2']]],
                'blank','blank',
                ['row', [['upgrade', 'unlockDuplicanti']]],
                'blank','blank',
                ['row', [['upgrade', 'furtherReduceCostScaling']]],
                'blank','blank',
                ['row', [['upgrade', 'activeBoostIP'], 'blank', ['upgrade', 'passiveBoostIP'], 'blank', ['upgrade', 'idleBoostIP']]],
                'blank','blank',
                ['row',[['upgrade', 'activeBoostBP'], 'blank', ['upgrade', 'passiveBoostBP'], 'blank', ['upgrade', 'idleBoostBP']]],
                'blank','blank',
                ['row', [['upgrade', 'activeBoostDuplicanti'], 'blank', ['upgrade', 'passiveBoostDuplicanti'], 'blank', ['upgrade', 'idleBoostDuplicanti']]],
                'blank','blank',
                ['row', [['upgrade', 'infChallenge3'], 'blank', ['upgrade', 'infChallenge5'], 'blank', ['upgrade', 'infChallenge4']]],
                'blank','blank',
                ['row', [['upgrade', 'furtherReduceCostScalingMore']]],
                'blank','blank',
                ['row', [['upgrade', 'collapseInfinity']]],
                'blank','blank',
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
            description() { return `Antimatter Dimensions gain a multiplier based on time played.<br>Currently: ${mixedStandardFormat(this.effect(), 2, 0)}x`  },
            cost: 1,
            style: { height: '100px', border: '2px solid orange !important' },
            branches: ['achievementBonus', 'boostUnspentIP']
        },

        achievementBonus: {
            description() { return `Achievement bonus is raised to the power of 10.`  },
            cost: 2,
            style: { height: '100px', border: '2px solid orange !important' },
            branches: ['reduceCostScaling']
        },
        boostUnspentIP: {
            effect() { return Decimal.max(1.0, Decimal.pow(player.infinity.points / 10, 0.25)) },
            description() { return `Multiplier to ADs, Booster Power and Galaxy Power based on IP.<br>Currently: ${mixedStandardFormat(this.effect(), 2, 0)}x`  },
            cost: 2,
            style: { height: '100px', border: '2px solid orange !important' },
            branches: ['reduceCostScaling']
        },

        reduceCostScaling: {
            description() { return `Reduce the cost scaling post-e308.<br>((b⋅m<sup>2a</sup>)/1e308 -> (b⋅m<sup>1.8a</sup>)/1e308)`  },
            cost: 4,
            style: { height: '100px', border: '2px solid orange !important' },
            branches: ['infChallenge1']
        },

        infChallenge1: {
            description() { return `Infinity Challenge I (0/5)<br>Requirement: Broken Infinity`  },
            cost: 2,
            style: { height: '100px', border: '2px solid orange !important' },
            branches: ['boostInfinities', 'gainMoreBP', 'log10EffectGP']
        },

        boostInfinities: {
            effect() { return Decimal.plus(5.0, Decimal.times(player.infinity.infinities, 0.55)) },
            description() { return `Antimatter Dimensions gain a multiplier based on infinities.<br>Currently: ${mixedStandardFormat(this.effect(), 2, 0)}x`  },
            cost: 4,
            style: { height: '100px', border: '2px solid #58bf72 !important' },
            branches: ['dimPower10']
        },
        gainMoreBP: {
            effect() { return new Decimal(10) },
            description() { return `Gain 10x as much Booster Points.` },
            cost: 3,
            style: { height: '100px', border: '2px solid #63b8ff !important' },
            branches: ['boostUnspentBP']
        },
        log10EffectGP: {
            effect() { return player.g.points },
            description() { return `Unspent Galaxy Points boost Antimatter Dimensions.<br>Currently: ${___(this.effect(), 2, 0)}x` },
            cost: 4,
            style: { height: '100px', border: '2px solid #dd3ffc !important' },
            branches: ['startAtC']
        },

        dimPower10: {
            description() { return `Dimension Boost Power becomes 10x.`  },
            cost: 5,
            style: { height: '100px', border: '2px solid #58bf72 !important' },
            branches: ['increaseTickspeed']
        },
        boostUnspentBP: {
            effect() { return Decimal.log10(Decimal.plus(10, player.bd.points)) },
            description() { return `Antimatter Dimensions gain a boost based on the log10 of your unspent BP. Currently ${___(this.effect(), 2, 0)}x` },
            cost: 6,
            style: { height: '100px', border: '2px solid #63b8ff !important' },
            branches: ['bpsBoostsItself']
        },
        startAtC: {
            description() { return `Star generation starts at Carbon (C).` },
            cost: 5,
            style: { height: '100px', border: '2px solid #dd3ffc !important' },
            branches: ['startAt308']
        },

        increaseTickspeed: {
            description() { return `Increase tickspeed to 1.25x.`  },
            cost: 3,
            style: { height: '100px', border: '2px solid #58bf72 !important' },
            branches: ['infChallenge2']
        },
        bpsBoostsItself: {
            effect() { return Decimal.log10(Decimal.plus(10, player.bd.points)) },
            description() { return `BP/s boosts itself. Currently ${___(this.effect(), 2, 0)}x` },
            cost: 6,
            style: { height: '100px', border: '2px solid #63b8ff !important' },
            branches: ['infChallenge2']
        },
        startAt308: {
            description() { return `GP generation starts at e308 instead of e512.` },
            cost: 5,
            style: { height: '100px', border: '2px solid #dd3ffc !important' },
            branches: ['infChallenge2']
        },
        
        infChallenge2: {
            description() { return `Infinity Challenge II (0/5)<br>Requirement: Use the Antimatter Dimension path (left)`  },
            cost: 10,
            style: { height: '100px', border: '2px solid orange !important' },
            branches: ['unlockDuplicanti']
        },
        
        unlockDuplicanti: {
            description() { return `Unlock Duplicanti`  },
            cost: 25,
            style: { height: '100px', border: '2px solid orange !important' },
            branches: ['furtherReduceCostScaling']
        },
        
        furtherReduceCostScaling: {
            description() { return `Further reduce the cost scaling.<br>((b⋅m<sup>1.8a</sup>)/1e308 -> (b⋅m<sup>1.5a</sup>)/1e308)`  },
            cost: 1e5,
            style: { height: '100px', border: '2px solid orange !important' },
            branches: ['activeBoostIP', 'passiveBoostIP', 'idleBoostIP']
        },

        activeBoostIP: {
            effect() { return new Decimal(1.0) },
            description() { return `Multiplier to IP generation, which decays over time<br>Currently ${___(this.effect(), 2, 0)}x`  },
            cost: 1e10,
            style: { height: '100px', border: '2px solid #b03131 !important' },
            branches: ['activeBoostBP']
        },
        passiveBoostIP: {
            description() { return `IP generation x100.` },
            cost: 1e10,
            style: { height: '100px', border: '2px solid #dd3ffc !important' },
            branches: ['passiveBoostBP']
        },
        idleBoostIP: {
            effect() { return new Decimal(1.0) },
            description() { return `Multiplier to IP generation, which increases over time<br>Currently ${___(this.effect(), 2, 0)}x`  },
            cost: 1e10,
            style: { height: '100px', border: '2px solid #63b8ff !important' },
            branches: ['idleBoostBP']
        },

        activeBoostBP: {
            description() { return `BP/s multiplier based on your fastest Booster Time this Infinity.` },
            cost: 1e10,
            style: { height: '100px', border: '2px solid #b03131 !important' },
            branches: ['activeBoostDuplicanti']
        },
        passiveBoostBP: {
            effect() { return new Decimal(1.0) },
            description() { return `BP/s multiplier x100.`  },
            cost: 1e10,
            style: { height: '100px', border: '2px solid #dd3ffc !important' },
            branches: ['passiveBoostDuplicanti']
        },
        idleBoostBP: {
            description() { return `BP/s multiplier slowly increases, but drops at BP gain.` },
            cost: 1e10,
            style: { height: '100px', border: '2px solid #63b8ff !important' },
            branches: ['idleBoostDuplicanti']
        },
        
        activeBoostDuplicanti: {
            description() { return `Auto-fold Duplicanti disabled, but Duplicanti tickspeed upgrades are 50% more powerful.` },
            cost: 1e20,
            style: { height: '100px', border: '2px solid #b03131 !important' },
            branches: ['infChallenge3', 'infChallenge5']
        },
        passiveBoostDuplicanti: {
            effect() { return new Decimal(1.0) },
            description() { return `Duplicanti tickspeed upgrades are 40% more powerful.`  },
            cost: 1e20,
            style: { height: '100px', border: '2px solid #dd3ffc !important' },
            branches: ['infChallenge5']
        },
        idleBoostDuplicanti: {
            description() { return `Duplicanti folds 50% slower, but their tickspeed upgrades are 50% more powerful.` },
            cost: 1e20,
            style: { height: '100px', border: '2px solid #63b8ff !important' },
            branches: ['infChallenge4', 'infChallenge5']
        },

        infChallenge3: {
            description() { return `Infinity Challenge 3 (0/5)<br>Requirement: Fastest BP time ≥ 200ms`  },
            cost: 1e50,
            style: { height: '100px', border: '2px solid orange !important' }
        },
        infChallenge4: {
            description() { return `Infinity Challenge 4 (0/5)<br>Requirement: Slowest BP time ≥ 10 minutes`  },
            cost: 1e50,
            style: { height: '100px', border: '2px solid orange !important' }
        },
        infChallenge5: {
            description() { return `Infinity Challenge 5 (0/5)<br>Requirement: 1e100 IP`  },
            cost: 1e100,
            style: { height: '100px', border: '2px solid orange !important' },
            branches: ['furtherReduceCostScalingMore']
        },
        
        furtherReduceCostScalingMore: {
            description() { return `Further reduce the cost scaling.<br>((b⋅m<sup>1.5a</sup>)/1e308 -> (b⋅m<sup>1.25a</sup>)/1e308)`  },
            cost: 1e200,
            style: { height: '100px', border: '2px solid orange !important' },
            branches: ['collapseInfinity']
        },

        collapseInfinity: {
            effect() { return Math.floor(Math.random() * 20) - Math.floor(Math.random() * 20) },
            description() { return `Perform the Universal Collapse`  },
            cost: 1.79e308,
            style() { return {
                height: '200px',
                width: '400px',
                fontSize: '24pt',
                border: '2px solid orange !important',
                transform: `translateX(${this.effect()}px) translateY(${this.effect()}px)`,
                zIndex: '100'
            } }
        },
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