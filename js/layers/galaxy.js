/**
 * Gain Galaxy Points on prestige.
 * You can spend these points on Galaxy Dimensions.
 * Galaxies have milestones based on best GP in a prestige.
 * 
 * Gain Galaxy Power based on your Galaxy Dimensions.
 * Per 2^x Galaxy Power you gain a free Tickspeed upgrade.
 * This scales to 10^x after 2e1024 (break).
 */
addLayer('gd', {

    name: 'Galaxies',
    symbol: 'G',
    color: '#d676d6',
    resource: 'GP',

    layerShown() {
        return player.gd.unlocked
    },

    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            bestGP: new Decimal(0),
            power: new Decimal(0),
            dimensions: Array(8).fill(0).map(()=>new Decimal(0))
        }
    },

    tickUpgrades: {
        amount() { return Decimal.floor(Decimal.max(0, Decimal.log2(player.gd.power))) },
        next() { return Decimal.pow(2, (tmp.gd.tickUpgrades.amount.plus(1))) }
    },

    update(delta) {
        const self = player[this.layer];
        const temp = tmp[this.layer];
        self.power = self.power.plus(Decimal.times(delta, self.dimensions[0]).times(temp.buyables['multiverse-0'].multiplier));
        for(let i = 0; i < 7; i++) {
            self.dimensions[i] = self.dimensions[i].plus(Decimal.times(self.dimensions[i + 1], temp.buyables[`multiverse-${i+1}`].multiplier).times(delta));
        }
    },

    tabFormat: {
        'Galaxies': {
            content: [
                ['display-text', function() { return `You have <span class="g">${mixedStandardFormat(player.gd.points, 2, 1)}</span> Galactic Points.<br>You have <span class="g">${mixedStandardFormat(player.gd.power, 2, 0)}</span> Galaxy Power.`; }, { 'color': 'silver' }],
                'blank',
                ['display-text', function() { return `You gain a free tickspeed upgrade every 2<sup>x</sup> power.<br>Your next tickspeed upgrade requires <span class="g">${mixedStandardFormat(tmp.gd.tickUpgrades.next, 2, 1)}</span> Galaxy Power.<br>Your galaxies made <span class="g">${mixedStandardFormat(tmp.gd.tickUpgrades.amount,0,0)}</span> free tickspeed upgrades.<br>Your best GP gain was <span class="g">${mixedStandardFormat(player.gd.bestGP, 2, 1)}</span> GP on reset.`; }, { 'font-size': '12px', 'color': 'silver' }],
                'blank',
                // Dimensions
                ['column', function() {
                    const html = []
                    for(let i = 0; i < 8; i++) {
                        const id = `multiverse-${i}`
                        const amount = mixedStandardFormat(player[this.layer].dimensions[i], 2, 1);
                        const multiplier = mixedStandardFormat(tmp[this.layer].buyables[id].multiplier, 1);
                        html.push(['row', [
                            ['raw-html', `<div style="width:150px; text-align:left;"><b>${ORDINAL[i+1]} Multiverse</b><br><span style="color:silver;">x${multiplier}</span></div>`, { margin: 'auto 0', 'font-size': '12px' }],
                            ['raw-html', `<div style="width:200px;font-weight:bold;">${amount}</div>`, { margin: 'auto 0', 'font-size': '14px' }],
                            ['buyable', id, { margin: 'auto 0' }]
                        ], { width: '100%', margin: 0, 'justify-content': 'space-between', 'background-color' : i % 2 && '#473447' }]);
                    }
                    return html;
                }]
            ]
        },
        'Milestones': {
            content: [
                ['display-text', function() { return `You have <span class="g">${mixedStandardFormat(player.gd.points, 2, 1)}</span> Galactic Points.<br>You have <span class="g">${mixedStandardFormat(player.gd.power, 2, 0)}</span> Galaxy Power.`; }, { 'color': 'silver' }],
                'blank',
                ['display-text', function() { return `You gain a free tickspeed upgrade every 2<sup>x</sup> power.<br>Your next tickspeed upgrade requires <span class="g">${mixedStandardFormat(tmp.gd.tickUpgrades.next, 2, 1)}</span> Galaxy Power.<br>Your galaxies made <span class="g">${mixedStandardFormat(tmp.gd.tickUpgrades.amount,0,0)}</span> free tickspeed upgrades.<br>Your best GP gain was <span class="g">${mixedStandardFormat(player.gd.bestGP, 2, 1)}</span> GP on reset.`; }, { 'font-size': '12px', 'color': 'silver' }],
                'blank',
                ['display-text', 'Milestones are not implemented in this version.', { 'font-size': '20px', 'color': 'red' }],
                'blank',
                'milestones',
            ]
        },
    },

    buyables: {
        'multiverse-0': multiverse(0, '1', 3),
        'multiverse-1': multiverse(1, '3', 4),
        'multiverse-2': multiverse(2, '9', 5),
        'multiverse-3': multiverse(3, '27', 6), 
        'multiverse-4': multiverse(4, '1e100', 7),
        'multiverse-5': multiverse(5, '1e200', 8),
        'multiverse-6': multiverse(6, '1e300', 9),
        'multiverse-7': multiverse(7, '1e400', 10), 
    },

    milestones: {
        0: {
            requirementDescription: '1 best GP gain',
            effectDescription: 'Keep your autobuyers on reset, and start with 100 antimatter.',
            done() { return false; }
        },
        1: {
            requirementDescription: '10 best GP gain',
            effectDescription: 'Keep the first Dimension Shift on reset.',
            done() { return false; }
        },
        2: {
            requirementDescription: '20 best GP gain',
            effectDescription: 'Keep the second Dimension Shift on reset.',
            done() { return false; }
        },
        3: {
            requirementDescription: '30 best GP gain',
            effectDescription: 'Keep the third Dimension Shift on reset.<br>Start with the Achievement Boost upgrade.',
            done() { return false; }
        },
        4: {
            requirementDescription: '40 best GP gain',
            effectDescription: 'Keep all your Dimension Shifts on reset.<br>Start with the Buy Max Autobuyer upgrade.',
            done() { return false; }
        },
        5: {
            requirementDescription: '100 best GP gain',
            effectDescription: 'Galaxies and GP do not reset your Booster Dimensions.',
            done() { return false; }
        },
        6: {
            requirementDescription: '500 best GP gain',
            effectDescription: 'Galaxies and GP do not reset your Booster Upgrades.',
            done() { return false; }
        },
        7: {
            requirementDescription: '1000 best GP gain',
            effectDescription: 'Generate 1% of your best GP gain per second.<br>Currently: 0 GP/s',
            done() { return false; }
        }
    }
});

function multiverse(id, cost, multiplier) {
    return {
        cost() { return Decimal.times(cost, Decimal.pow(multiplier, getBuyableAmount(this.layer, this.id))) },
        display() { return `Cost: ${mixedStandardFormat(this.cost(), 2, true)}` },
        canAfford() { return player.gd.points.gte(this.cost()) },
        multiplier() { return Decimal.times(50, getBuyableAmount(this.layer, this.id)).plus(1) },
        buy() {
            player.gd.points = player.gd.points.minus(this.cost());
            player[this.layer].dimensions[id] = player[this.layer].dimensions[id].plus(1);
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1));
        },
        style() { return { 'width': '150px', 'background-color': this.canAfford() ? '#357541 !important' : '' } }
    }
}