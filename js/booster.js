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
            points: new Decimal(0),
            power: new Decimal(0)
        }
    },

    power: {
        perSecond() {
            if(!player.bd.unlocked) return new Decimal(0);
            let base = tmp.bd.buyables[1].effect;
            let cap = tmp.bd.buyables[2].effect;
            if(player.bd.power.gte(cap)) {
                let over = Decimal.div(player.bd.power, cap);
                let nerf = hasUpgrade('bd', 'reducePenal2') ? 0.5 : (hasUpgrade('bd', 'reducePenal') ? 2 : 10);
                base = base.div(over.pow(nerf));
            }
            base = base.times(tmp.bd.upgrades.log10boost.effect)
            return base;
        },
        multiplier() { return Decimal.plus(1, player.bd.power).times(tmp.bd.buyables[4].effect) }
    },

    update(delta) {
        player.bd.power = player.bd.power.plus(Decimal.times(tmp.bd.power.perSecond, delta))
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
                        This slows down exponentially after <bd>${__(tmp.bd.buyables[2].effect,2,0)}</bd> power. <br>
                        Your booster power multiplies all dimensions by <bd>${__(temp.power.multiplier,1,0)}</bd>x.
                    `
                }, { 'color': 'silver', 'font-size': '12px' }],
                'blank',
                ['row', [['buyable', 1], ['buyable', 2]]],
                ['row', [['buyable', 3], ['buyable', 4]]]
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
                        This slows down exponentially after <bd>${__(tmp.bd.buyables[2].effect,2,0)}</bd> power. <br>
                        Your booster power multiplies all dimensions by <bd>${__(temp.power.multiplier,1,0)}</bd>x.
                    `
                }, { 'color': 'silver', 'font-size': '12px' }],
                'blank',
                ['row', [['upgrade', 'keep-1'], 'blank', ['upgrade', 'adim-m'], 'blank', ['upgrade', 'reducePenal']]],
                ['row', [['upgrade', 'keep-2'], 'blank', ['upgrade', 'doubleMaxCap'], 'blank', ['upgrade', 'reducePenal2']], { 'margin-top': '6px' }],
                ['row', [['upgrade', 'keep-3'], 'blank', ['upgrade', 'log10boost'], 'blank', ['upgrade', 'gain10times']], { 'margin-top': '6px' }],
                ['row', [['upgrade', 'keep-4'], 'blank', ['upgrade', 'placeholder'], 'blank', ['upgrade', 'placeholder']], { 'margin-top': '6px' }],
                'blank',
                ['bar', 'percentageToInfinity']
            ]
        }
    },

    bars: { percentageToInfinity: elements.infinityPercentage() },

    buyables: {
        1: {
            display() {
                return `Increase the booster power gain by +50%.
                Currently ${__(this.effect(),2,0)}/sec.
                
                Cost: ${__(this.cost(),2,0)} BP`
            },
            cost() { return Decimal.pow(2, getBuyableAmount(this.layer, this.id)) },
            effect() { return new Decimal(0.01).times(Decimal.pow(1.5, getBuyableAmount(this.layer, this.id))); },
            canAfford() { return player.bd.points.gte(this.cost()); },
            buy() { player.bd.points = player.bd.points.minus(this.cost()); setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1)) },
            style() { return { width: '150px', height: '150px', margin: '8px' } }
        },
        2: {
            display() { 
                return `Increase the booster power cap by ${hasUpgrade(this.layer, 'doubleMaxCap') ? 10 : 4}.
                Currently ${__(this.effect(),2,0)}.
                
                Cost: ${__(this.cost(),2,0)} BP`
            },
            cost() { return Decimal.pow(3, getBuyableAmount(this.layer, this.id)) },
            effect() { return new Decimal(2.0).plus(Decimal.times(hasUpgrade(this.layer, 'doubleMaxCap') ? 10 : 4, getBuyableAmount(this.layer, this.id))); },
            canAfford() { return player.bd.points.gte(this.cost()); },
            buy() { player.bd.points = player.bd.points.minus(this.cost()); setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1)) },
            style() { return { width: '150px', height: '150px', margin: '8px' } }
        },
        3: {
            display() { 
                return `Double the booster point gain per 8th dimensions.
                Currently ${__(this.effect(),2,1)} per 10 8th.
                
                Cost: ${__(this.cost(),2,0)} BP`
            },
            cost() { return Decimal.pow(10, getBuyableAmount(this.layer, this.id)) },
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
            cost() { return Decimal.pow(5, getBuyableAmount(this.layer, this.id)) },
            effect() { return Decimal.pow(1.35, getBuyableAmount(this.layer, this.id)); },
            canAfford() { return player.bd.points.gte(this.cost()); },
            buy() { player.bd.points = player.bd.points.minus(this.cost()); setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1)) },
            style() { return { width: '150px', height: '150px', margin: '8px' } }
        },

        // 'booster-dimension-5': boosterBuyable(4, 1e9 , 1e8 ),
        // 'booster-dimension-6': boosterBuyable(5, 1e13, 1e10),
        // 'booster-dimension-7': boosterBuyable(6, 1e18, 1e12),
        // 'booster-dimension-8': boosterBuyable(7, 1e24, 1e15),
        'mult-b': {
            cost(x) { return Decimal.pow(10, Decimal.plus(2, x)) },
            canAfford() { return player.bd.points.gte(this.cost()); },
            buy() {
                player.bd.points = player.bd.points.minus(this.cost());
                setBuyableAmount('bd', 'mult-b', getBuyableAmount('bd', 'mult-b').plus(1));
            },
            display() { return `Multiply BP gain by 2x.<br>Currently: ${mixedStandardFormat(Decimal.pow(2, getBuyableAmount('bd', 'mult-b')),2,1)}x<br><br>Cost: ${mixedStandardFormat(this.cost())} BP` },
            style() { return { height: '100px' } }
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
            cost: new Decimal(20),
            canAfford() { return hasUpgrade(this.layer, 'keep-1'); },
            style() { return { height: '100px' } }
        },
        'keep-3': {
            description: 'Keep the third Dimension Shift on reset.',
            cost: new Decimal(50),
            canAfford() { return hasUpgrade(this.layer, 'keep-2'); },
            style() { return { height: '100px' } }
        },
        'keep-4': {
            description: 'Keep all Dimension Shifts on reset.',
            cost: new Decimal(100),
            canAfford() { return hasUpgrade(this.layer, 'keep-3'); },
            style() { return { height: '100px' } }
        },
        'gain-2': {
            description: 'Achievements power is twice as powerful. (useless: no achievements)',
            cost: new Decimal(2500),
            style() { return { height: '100px' } },
        },
        'more-b': {
            description: 'Increase the amount of BP you get.<br>(8th/10 -> 8th/5)',
            cost: new Decimal(200),
            style() { return { height: '100px' } },
        },
        'incr-m': {
            description: 'Increase the Booster Dimension multiplier.<br>(1.2x -> 1.5x)',
            cost: new Decimal(150),
            style() { return { height: '100px' } },
        },
        'boos-t': {
            description() { return `Gain 5% your best BP gain per second.<br>Currently: ${mixedStandardFormat(Decimal.divide(player.bd.bestBoost, 20))}/s` },
            cost: new Decimal(500),
            style() { return { height: '100px' } },
        },
        'unlk-a': {
            description: 'Autobuy Booster Dimensions and they do not consume BP.',
            cost: new Decimal(1000),
            style() { return { height: '100px' } }
        },
        'keep-b': {
            description: 'Keep 50% of your Booster Multiplier on reset.',
            cost: new Decimal(350),
            style() { return { height: '100px' } },
        },
        'adim-m': {
            description: 'Dimensional Autobuyers will now buy max.',
            cost: new Decimal(75),
            style() { return { height: '100px' } }
        }
    },

    bars: {
        percentageToInfinity: {
            direction: RIGHT,
            width: 500,
            height: 20,
            display() { return `${format(player.points.log10().divide(1000).times(100), 1)}% to Infinity` },
            progress() {
                return player.points.log10().divide(1000)
            },
            fillStyle: { 'background-color': '#4ABB5F', }
        }
    },

    hotkeys: [
        {
            key: 'b',
            description: 'b: Gain BP',
            onPress() {
                clickClickable('ad', 'boost');
            }
        }
    ]

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