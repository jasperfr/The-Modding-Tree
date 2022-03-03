addLayer('bd', {
    name: 'Booster Dimensions',
    symbol: 'B',
    color: '#63b8ff',
    resource: 'BP',

    layerShown() {
        return player.bd.unlocked
    },

    startData() {
        return {
            unlocked: false,
            restart: false,
            points: new Decimal(0),
            power: new Decimal(0),
            timeInCurrentAD: 0,
            lowestTime: 1e100,
        }
    },

    points: {
        gain() {
            return Decimal.divide(player.ad.dimensions[7], 10)
                .floor()
                .times(tmp.bd.buyables[3].effect)
                .times(hasUpgrade('bd', 'gain10times') ? 10 : 1)
            .times(hasMilestone('bd', 4) ? 10 : 1)
        }
    },

    power: {
        perSecond() {
            if(!player.bd.unlocked) return new Decimal(0);
            if(player.bd.restart) {
                player.bd.restart = false;
                return new Decimal(0.001);
            }
            let base = tmp.bd.buyables[1].effect;
            let cap = tmp.bd.buyables[2].effect;

            if(hasMilestone('bd', 0)) base = base.times(2);
            if(hasMilestone('bd', 1)) base = base.times(3);
            if(hasMilestone('bd', 2)) base = base.times(5);
            if(hasMilestone('bd', 3)) base = base.times(10);

            if(player.bd.power.gte(cap) && !hasMilestone('bd', 5)) {
                let over = Decimal.div(player.bd.power, cap);
                let nerf = hasUpgrade('bd', 'reducePenal2') ? 0.5 : (hasUpgrade('bd', 'reducePenal') ? 2 : 10);
                base = base.div(over.pow(nerf));
            }

            base = base.times(tmp.bd.upgrades.log10boost.effect);
            base = base.times(tmp.bd.upgrades.log100boost.effect);
            return base;
        },
        multiplier() { return Decimal.plus(1, player.bd.power).times(tmp.bd.buyables[4].effect) }
    },

    update(delta) {
        player.bd.power = player.bd.power.plus(Decimal.times(tmp.bd.power.perSecond, delta));
        player.bd.points = player.bd.points.plus(tmp.bd.buyables[5].effect.times(delta));
        player.bd.timeInCurrentAD += delta;
    },

    tabFormat: {
       'Power': {
            content: [
                ['display-text', function() {
                    const self = player[this.layer];
                    const temp = tmp[this.layer];
                    return `
                        You have <bd>${__(self.points,2,1)}</bd> Booster Points. <br>
                        You have <bd>${__(self.power,2,0)}</bd> Booster Power. <br>
                        You are getting <bd>${__(temp.power.perSecond,3,0)}</bd> Booster Power per second. <br>
                        ${hasMilestone('bd', 5) ? '' : `This slows down exponentially after <bd>${__(tmp.bd.buyables[2].effect,2,0)}</bd> power. <br>`}
                        Your booster power multiplies all dimensions by <bd>${__(temp.power.multiplier,1,0)}</bd>x.<br>
                        Your time in this booster reset is <bd>${TIME(self.timeInCurrentAD)}</bd>.<br>
                        Your best time is <bd>${TIME(self.lowestTime)}</bd>.<br>
                    `
                }, { 'color': 'silver', 'font-size': '12px' }],
                'blank',
                ['clickable', 'gain'],
                ['row', [['buyable', 1], ['buyable', 2]]],
                ['row', [['buyable', 3], ['buyable', 4]]],
                ['row', [['buyable', 5]]]
            ]
        }, 
        'Upgrades': {
            content: [
                ['display-text', function() {
                    const self = player[this.layer];
                    const temp = tmp[this.layer];
                    return `
                        You have <bd>${__(self.points,2,1)}</bd> Booster Points. <br>
                        You have <bd>${__(self.power,2,0)}</bd> Booster Power. <br>
                        You are getting <bd>${__(temp.power.perSecond,3,0)}</bd> Booster Power per second. <br>
                        ${hasMilestone('bd', 5) ? '' : `This slows down exponentially after <bd>${__(tmp.bd.buyables[2].effect,2,0)}</bd> power. <br>`}
                        Your booster power multiplies all dimensions by <bd>${__(temp.power.multiplier,1,0)}</bd>x.<br>
                        Your time in this booster reset is <bd>${TIME(self.timeInCurrentAD)}</bd>.<br>
                        Your best time is <bd>${TIME(self.lowestTime)}</bd>.<br>
                    `
                }, { 'color': 'silver', 'font-size': '12px' }],
                'blank',
                ['row', [['upgrade', 'keep-1'], 'blank', ['upgrade', 'adim-m'], 'blank', ['upgrade', 'reducePenal']]],
                ['row', [['upgrade', 'keep-2'], 'blank', ['upgrade', 'doubleMaxCap'], 'blank', ['upgrade', 'reducePenal2']], { 'margin-top': '6px' }],
                ['row', [['upgrade', 'keep-3'], 'blank', ['upgrade', 'log10boost'], 'blank', ['upgrade', 'gain10times']], { 'margin-top': '6px' }],
                ['row', [['upgrade', 'keep-4'], 'blank', ['upgrade', 'log100boost'], 'blank', ['upgrade', 'cheaperBuyables']], { 'margin-top': '6px' }],
            ]
        },
        'Milestones': {
            content: [
                ['display-text', function() {
                    const self = player[this.layer];
                    const temp = tmp[this.layer];
                    return `
                        You have <bd>${__(self.points,2,1)}</bd> Booster Points. <br>
                        You have <bd>${__(self.power,2,0)}</bd> Booster Power. <br>
                        You are getting <bd>${__(temp.power.perSecond,3,0)}</bd> Booster Power per second. <br>
                        ${hasMilestone('bd', 5) ? '' : `This slows down exponentially after <bd>${__(tmp.bd.buyables[2].effect,2,0)}</bd> power. <br>`}
                        Your booster power multiplies all dimensions by <bd>${__(temp.power.multiplier,1,0)}</bd>x.<br>
                        Your time in this booster reset is <bd>${TIME(self.timeInCurrentAD)}</bd>.<br>
                        Your best time is <bd>${TIME(self.lowestTime)}</bd>.<br>
                    `
                }, { 'color': 'silver', 'font-size': '12px' }],
                'blank',
                ['display-text', 'Complete milestones to get rewards!'],
                'blank',
                'milestones'
            ]
        }
    },

    milestones: {
        0 : {
            requirementDescription: "Boost in under 10 minutes",
            effectDescription: "Reward: BPS * 2",
            done() { return player.bd.lowestTime < 600 },
            style() {
                if(player.bd.timeInCurrentAD > 600 && !hasMilestone(this.layer, this.id)) {
                    return { 'background-color': '#992c2c !important' }
                }
            }
        },
        1 : {
            requirementDescription: "Boost in under 5 minutes",
            effectDescription: "Reward: BPS * 3",
            done() { return player.bd.lowestTime < 300 },
            style() {
                if(player.bd.timeInCurrentAD > 300 && !hasMilestone(this.layer, this.id)) {
                    return { 'background-color': '#992c2c !important' }
                }
            }
        },
        2 : {
            requirementDescription: "Boost in under 1 minute",
            effectDescription: "Reward: BPS * 5",
            done() { return player.bd.lowestTime < 60 },
            style() {
                if(player.bd.timeInCurrentAD > 60 && !hasMilestone(this.layer, this.id)) {
                    return { 'background-color': '#992c2c !important' }
                }
            }
        },
        3 : {
            requirementDescription: "Boost in under 10 seconds",
            effectDescription: "Reward: BPS * 10, Booster cap * 10",
            done() { return player.bd.lowestTime < 10 },
            style() {
                if(player.bd.timeInCurrentAD > 10 && !hasMilestone(this.layer, this.id)) {
                    return { 'background-color': '#992c2c !important' }
                }
            }
        },
        4 : {
            requirementDescription: "Boost in under 2 seconds",
            effectDescription: "Reward: BP gain * 5",
            done() { return player.bd.lowestTime < 2 },
            style() {
                if(player.bd.timeInCurrentAD > 2 && !hasMilestone(this.layer, this.id)) {
                    return { 'background-color': '#992c2c !important' }
                }
            }
        },
        5 : {
            requirementDescription: "Boost in under 1 second",
            effectDescription: "Reward: Remove the booster cap",
            done() { return player.bd.lowestTime < 1 },
            style() {
                if(player.bd.timeInCurrentAD > 1 && !hasMilestone(this.layer, this.id)) {
                    return { 'background-color': '#992c2c !important' }
                }
            }
        }
    },

    clickables: {
        gain: {
            display() { return `Reset for ${__(tmp.bd.points.gain,2,0)} BP.` },
            canClick() { return tmp.bd.points.gain.gte(1); },
            onClick() {
                player.points = new Decimal(10);
                player.bd.points = player.bd.points.plus(tmp.bd.points.gain);
                let temp = JSON.stringify(player.ad.autobuyers);
                layerDataReset('ad', ['upgrades', 'autobuyers']);
                player.ad.autobuyers = JSON.parse(temp);
                if(hasUpgrade('bd', 'keep-1')) player.ad.shifts = 1;
                if(hasUpgrade('bd', 'keep-2')) player.ad.shifts = 2;
                if(hasUpgrade('bd', 'keep-3')) player.ad.shifts = 3;
                if(hasUpgrade('bd', 'keep-4')) player.ad.shifts = 4;
                player.bd.lowestTime = Math.min(player.bd.lowestTime, player.bd.timeInCurrentAD);
                player.bd.timeInCurrentAD = 0;
            },
            style() { return { 'font-size': '10px', width: '316px', 'margin-bottom': '8px' } }
        }
    },

    buyables: {
        1: {
            display() {
                return `Increase the booster power gain by +50%.
                Currently ${__(this.effect(),2,0)}/sec.
                
                Cost: ${__(this.cost(),2,0)} BP`
            },
            cost() { return Decimal.pow(2, getBuyableAmount(this.layer, this.id)).times(tmp.bd.upgrades.cheaperBuyables.effect) },
            effect() { return new Decimal(0.001).times(Decimal.pow(1.5, getBuyableAmount(this.layer, this.id))); },
            canAfford() { return player.bd.points.gte(this.cost()); },
            buy() { player.bd.points = player.bd.points.minus(this.cost()); setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1)) },
            style() { return { width: '150px', height: '150px', margin: '8px' } }
        },
        2: {
            display() { 
                return `Increase the booster power cap by ${hasUpgrade(this.layer, 'doubleMaxCap') ? 10 : 4}.
                Currently ${__(this.effect(),2,0)}.
                
                ${hasMilestone('bd', 5) ? 'Disabled<br>(best time < 0:01)' : `Cost: ${__(this.cost(),2,0)} BP`}`
            },
            cost() { return Decimal.pow(3, getBuyableAmount(this.layer, this.id)).times(tmp.bd.upgrades.cheaperBuyables.effect) },
            effect() {
                return new Decimal(2.0)
                    .plus(
                        Decimal.times(
                            hasUpgrade(this.layer, 'doubleMaxCap') ? 10 : 4,
                            getBuyableAmount(this.layer, this.id)
                        )
                    ).times(hasMilestone('bd', 3) ? 10 : 1)
                },
            canAfford() { return !hasMilestone('bd', 5) && player.bd.points.gte(this.cost()); },
            buy() { player.bd.points = player.bd.points.minus(this.cost()); setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1)) },
            style() { return { width: '150px', height: '150px', margin: '8px' } }
        },
        3: {
            display() { 
                return `Double the booster point gain per 8th dimensions.
                Currently ${__(this.effect(),2,1)} per 10 8th.
                
                Cost: ${__(this.cost(),2,0)} BP`
            },
            cost() { return Decimal.pow(10, getBuyableAmount(this.layer, this.id)).times(tmp.bd.upgrades.cheaperBuyables.effect) },
            effect() { return Decimal.pow(2, getBuyableAmount(this.layer, this.id)); },
            canAfford() { return player.bd.points.gte(this.cost()); },
            buy() { player.bd.points = player.bd.points.minus(this.cost()); setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1)) },
            style() { return { width: '150px', height: '150px', margin: '8px' } }
        },
        4: {
            display() { 
                return `Increase the booster multiplier effectiveness by +35%.
                Currently x * ${__(this.effect(),2,0)}.
                
                Cost: ${__(this.cost(),2,0)} BP`
            },
            cost() { return Decimal.pow(5, getBuyableAmount(this.layer, this.id)).times(tmp.bd.upgrades.cheaperBuyables.effect) },
            effect() { return Decimal.pow(1.35, getBuyableAmount(this.layer, this.id)); },
            canAfford() { return player.bd.points.gte(this.cost()); },
            buy() { player.bd.points = player.bd.points.minus(this.cost()); setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1)) },
            style() { return { width: '150px', height: '150px', margin: '8px' } }
        },
        5: {
            display() {
                return `Gain +5% of your BP gain per second.
                Currently +${__(getBuyableAmount(this.layer, this.id).times(5),2,0)}%
                (${__(this.effect(),2,0)} / sec).
                
                Cost: ${__(this.cost(),2,0)} BP`
            },
            cost() { return Decimal.pow(25, getBuyableAmount(this.layer, this.id)) },
            effect() { return new Decimal(0.05).times(getBuyableAmount(this.layer, this.id)).times(tmp.bd.points.gain) },
            canAfford() { return player.bd.points.gte(this.cost()); },
            unlocked() { return hasUpgrade(this.layer, 'cheaperBuyables') },
            buy() { player.bd.points = player.bd.points.minus(this.cost()); setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1)) },
            style() { return { width: '150px', height: '150px', margin: '8px' } }
        }
    },

    upgrades: {
        reducePenal: {
            description: `Reduce the power scaling penalty.<br>
            x/((power - cap)<sup>10</sup>) -> <br>
            x/((power - cap)<sup>2</sup>)`,
            cost: new Decimal(100),
            style() { return { height: '100px' } }
        },
        doubleMaxCap: {
            description: 'Increase the booster power cap effect.<br>(4 -> 10)',
            cost: new Decimal(1000),
            style() { return { height: '100px' } }
        },
        reducePenal2: {
            description: `Reduce the power scaling penalty even more.<br>
            x/((power - cap)<sup>2</sup>) -> <br>
            x/(√(power - cap))`,
            cost: new Decimal(1000),
            canAfford() { return hasUpgrade(this.layer, 'reducePenal') },
            style() { return { height: '100px' } }
        },
        log10boost: {
            description() { return `BPS gains a multiplier <i>after</i> the scaling nerf based on the log10 of your current BP.<br>
            Currently: ${__(this.effect(),2)}x` },
            cost: new Decimal(2500),
            effect() { return hasUpgrade(this.layer, this.id) ? Decimal.plus(1, Decimal.log10(player.bd.points)) : new Decimal(1); },
            style() { return { height: '100px' } }
        },
        gain10times: {
            description: 'Gain 10x as much BP per 8th dimensions.',
            cost: new Decimal(3500),
            style() { return { height: '100px' } }
        },
        log100boost: {
            description() { return `BPS gains a multiplier <i>after</i> the scaling nerf based on the log100 of your current multiplier.<br>
            Currently: ${__(this.effect(),2)}x` },
            cost: new Decimal(10000),
            effect() { return hasUpgrade(this.layer, this.id) ? Decimal.plus(1, Decimal.log(tmp.bd.power.multiplier, 100)) : new Decimal(1); },
            style() { return { height: '100px' } }
        },
        cheaperBuyables: {
            description() { return `All buyables are 1,000x cheaper, and unlock a new one.` },
            cost: new Decimal(100000),
            effect() { return hasUpgrade(this.layer, this.id) ? new Decimal(0.001) : new Decimal(1); },
            style() { return { height: '100px' } }
        },

        placeholder: {
            description: 'Placeholder, not implemented yet.',
            cost: new Decimal(0),
            canAfford() { return false; },
            style() { return { height: '100px' } }
        },

        'keep-1': {
            description: 'Keep the first Dimension Shift on reset.',
            cost: new Decimal(10),
            style() { return { height: '100px' } }
        },
        'keep-2': {
            description: 'Keep the second Dimension Shift on reset.',
            cost: new Decimal(100),
            canAfford() { return hasUpgrade(this.layer, 'keep-1'); },
            style() { return { height: '100px' } }
        },
        'keep-3': {
            description: 'Keep the third Dimension Shift on reset.',
            cost: new Decimal(1000),
            canAfford() { return hasUpgrade(this.layer, 'keep-2'); },
            style() { return { height: '100px' } }
        },
        'keep-4': {
            description: 'Keep all Dimension Shifts on reset.',
            cost: new Decimal(10000),
            canAfford() { return hasUpgrade(this.layer, 'keep-3'); },
            style() { return { height: '100px' } }
        },
        'adim-m': {
            description: 'Dimensional Autobuyers will now buy max.',
            cost: new Decimal(75),
            style() { return { height: '100px' } }
        }
    }
});

function boosterBuyable(dimension, cost, multiplier) {
    return {
        cost() { return Decimal.times(cost, Decimal.pow(multiplier, getBuyableAmount(this.layer, this.id))) },
        display() { return `Cost: ${mixedStandardFormat(this.cost(), 2, true)}` },
        canAfford() { return player.bd.points.gte(this.cost()) },
        buy() {
            player.bd.dimensions[dimension] = player.bd.dimensions[dimension].plus(1);
            if(!hasUpgrade(this.layer, 'unlk-a')) player.bd.points = player.bd.points.sub(this.cost());
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1));
        },
        buyMax() { while(this.canAfford()) { this.buy() } },
        multiplier() { return Decimal.pow(2, getBuyableAmount(this.layer, this.id)) },
        style() {
            return {
                'width': '150px',
                'background-color': this.canAfford() ? '#357541 !important' : ''
            }
        }
    }
}