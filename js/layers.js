addLayer('p', {
    name: 'prestige',
    symbol: 'P',
    color: '#0394fc',
    branches: ['m', 'i'],

    position: 0,
    row: 0,

    startData() { return {
        unlocked: 1,
        points: new Decimal(0)
    }},

    resource: 'Prestige Points',
    baseResource: 'points',

    requires: new Decimal(3),
    baseAmount() { return player.points },
    type: 'normal',
    exponent: 0.5,

    gainMult() {
        let mult = new Decimal(1);
        if(hasUpgrade(this.layer, 13)) mult = mult.times(upgradeEffect(this.layer, 13));
        if(hasUpgrade(this.layer, 14)) mult = mult.times(2);
        if(hasUpgrade(this.layer, 21)) mult = mult.times(upgradeEffect(this.layer, 21));
        // mastery
        if(hasUpgrade('m', 11)) mult = mult.times(upgradeEffect('m', 11));
        return mult;
    },

    update(delta) {
        if(hasMilestone('m', 0)) {
            let gain = getResetGain(this.layer);
            gain = gain.times(0.1); // 10%;
            gain = gain.times(delta); // divide by delta
            player[this.layer].points = player[this.layer].points.add(gain);
        }
    },

    upgrades: {
        11: {
            title: 'Multi-points',
            description: 'Double point gain.',
            cost: new Decimal(3)
        },
        12: {
            title: 'Point Collapse',
            description: 'Gain more points based on your Prestige Points.',
            cost: new Decimal(10),
            effect() {
                return player[this.layer].points.add(1).pow(0.5);
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id)) + 'x';
            }
        },
        13: {
            title: 'Powered Points',
            description: 'Gain more prestige points based on points.',
            cost: new Decimal(25),
            effect() {
                return player.points.add(1).pow(0.15);
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id)) + 'x';
            }
        },
        14: {
            title: 'Double Points',
            description: 'Gain twice as much prestige points.',
            cost: new Decimal(50)
        },
        15: {
            title: 'Point^2',
            description: 'Square your point gain.',
            cost: new Decimal(500)
        },
        21: {
            title: 'Even More Prestige',
            description: 'Gain more prestige points based on your points.',
            cost: new Decimal(10_000),
            effect() { return player.points.add(1).pow(0.2) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + 'x' }
        },
        22: {
            title: 'Even More Points!',
            description: 'Gain 10x points.',
            cost: new Decimal(1_000_000)
        },
        23: {
            title: 'Reorder of Magnitude',
            description: 'The previous upgrade is applied before the square upgrade.',
            cost: new Decimal(1e15)
        },
        24: {
            title: 'Pushing for More',
            description: 'Gain more points based on the exponent of your prestige points.',
            cost: new Decimal(1e20),
            effect() { return player[this.layer].points.add(1).log10(); },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + 'x'; }
        },
        25: {
            title: 'To the Limit',
            description: 'The previous upgrade is also applied before the square upgrade.',
            cost: new Decimal(1e30)
        }
    }
});

addLayer('m', {
    name: 'mastery',
    symbol: 'M',
    color: '#d552f2',
    branches: [],

    position: 0,
    row: 1,

    startData() { return {
        unlocked: 0,
        points: new Decimal(0),
        total: new Decimal(0)
    }},

    resource: 'Mastery Points',
    baseResource: 'prestige points',

    requires: new Decimal(1e40),
    baseAmount() { return player.p.points },
    type: 'normal',
    exponent: 0.5,

    upgrades: {
        11: {
            title: 'Presitigious',
            description: 'Gain more prestige points based on your Mastery points.',
            cost: new Decimal(1),
            effect() {
                return player[this.layer].points.add(4).pow(0.5);
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id)) + 'x';
            }
        }
    },

    milestones: {
        0: {
            requirementDescription: '2 total Mastery Points',
            effectDescription: 'Gain 10% of your Prestige Points per second.',
            done() { return player[this.layer].best.gte(2); }
        },
        1: {
            requirementDescription: '5 total Mastery Points',
            effectDescription: 'Autobuy Prestige Points.',
            done() { return player[this.layer].best.gte(5); }
        },
        2: {
            requirementDescription: '20 total Mastery Points',
            effectDescription: 'Gain 100% of your Prestige Points per second.',
            done() { return player[this.layer].best.gte(20); }
        },
        3: {
            requirementDescription: '50 total Mastery Points',
            effectDescription: 'Prestige upgrades do not reset upon a Mastery.',
            done() { return player[this.layer].best.gte(50); }
        },
        4: {
            requirementDescription: '1000 total Mastery Points',
            effectDescription: 'Unlock Challenges.',
            done() { return player[this.layer].best.gte(1000); }
        }
    }

});

addLayer('i', {
    name: 'incrementy',
    symbol: 'I',
    color: '#ab7760',

    row: 1,
    position: 1,

    startData() { return {
        unlocked: 1,
        points: new Decimal(0),
        incrementyGain: new Decimal(0.001),
        incrementyBoost: new Decimal(5),
        ratio: new Decimal(50),
        
        incrementyGainPercentage: new Decimal(100),
        incrementyBoostPercentage: new Decimal(100)
    }},

    resource: 'Incrementy',
    baseResource: 'prestige points',

    requires: new Decimal(5),
    baseAmount() { return player.p.points },
    type: 'normal',
    exponent: 0.5,
    effect() {
        const self = player[this.layer];
        return { 
            incrementyGain: self.incrementyGain.times(self.ratio),
            incrementyBoost: self.incrementyBoost.times(100 - self.ratio),
            incrementyProduction: player[this.layer].incrementyGain.times(player[this.layer].points)
    }},
    effectDescription() { // Optional text to describe the effects
        const eff = this.effect();
        return `which is multiplying point gain by ${eff.incrementyGain} * ${eff.incrementyGain} = x${eff.incrementyBoost.toFixed(3)}.<br>
            Each incrementy increases the multiplier by ${format(eff.incrementyGain)}/second.<br>
            You are getting ${eff.incrementyProduction.toFixed(3)} incrementy boost per second.`
    },
    update(delta) {
        let gain = player[this.layer].incrementyGain;
        gain = gain.times(player[this.layer].points);
        gain = gain.times(delta);
        player[this.layer].incrementyBoost = player[this.layer].incrementyBoost.add(gain);
    },

    midsection: [
        ["display-text", "Distribute your generation / boost ratio."],
        ['display-text', function() {
            return `${format(player.i.incrementyGainPercentage)}% / ${format(player.i.incrementyBoostPercentage)}%`
        }],
        ["slider", ["ratio", 0, 100]],
    ]
});