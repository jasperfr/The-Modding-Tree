const __in = {
    header: ['column', [
        ['display-text', function() { return `You have <span style="color:orange;font-size:20px;font-weight:bold;">${__(player.infinity.points, 3, 1)}</span> IP.`; }, { 'color': 'silver' }],
        ['display-text', function() { return `You have infinitied <span style="color:orange;font-size:20px;font-weight:bold;">${formatWhole(player.infinity.infinities)}</span> times.`; }, { 'color': 'silver', 'font-size': '12px' }],
        ['display-text', function() { return `You have <span style="color:orange;font-size:20px;font-weight:bold;">${formatWhole(player.infinity.studyPoints)}</span>/${formatWhole(tmp.infinity.maxStudyPoints)} Study Points.`; }, { 'color': 'silver', 'font-size': '12px' }],
        'blank',
        function() { if(hasUpgrade('infinity', 'breakInfinity')) return ['column', ['prestige-button', 'blank']] },
        'blank'
    ]],

    enterChallenge() {
        resetAD();
        resetBD();
        resetG();
        resetPoints();
    },

    exitChallenge() {
        player.ad.unlocked = true;
        player.bd.unlocked = true;
        player.g.unlocked = true;
        resetAD();
        resetBD();
        resetG();
        resetPoints();
    }
}

addLayer('infinity', {

    /* === Base information === */
    name: 'Infinity',
    symbol() { return options.toggleButtonAnimations ? '' : 'I' },
    color: 'orange',
    branches: ['bd', 'g'],
    layerShown() { return player.infinity.unlocked },
    resource: 'IP',
    tooltip: 'Infinity',

    baseResource: 'antimatter',
    exponent: 0.001,
    type: 'normal',

    requires: new Decimal('2e1024'),
    baseAmount() { return player.points; },
    gainMult() {
        return new Decimal(1)
        .times(tmp.infinity.buyables[1].effect);
    },
    gainExp() { return new Decimal(1); },

    componentStyles: {
        'prestige-button'() { return {
            'border-radius': '2px',
            'border': '2px solid #992c2c',
            'background': '#222 !important',
            'background-color': '#222 !important',
            'color': '#fff',
            'width': '400px',
            'height': '100px'
        }}
    },

    nodeStyle() {
        return options.toggleButtonAnimations ? {
            'color': 'white',
            'background-image': 'url("resources/infinity.gif")',
            'background-position': 'center center',
            'background-size': '250%',
            'border': '1px solid white'
        } : {
            'background-image': 'linear-gradient(to bottom right, #e3bb29, orange)',
        }
    },

    doReset(layer) {
        if(layer !== 'infinity') return;

        player[this.layer].timeInCurrentInfinity = 0;

        if(player.infinity.activeChallenge == null) {
            if(getClickableState('infinity', 'respecOnNextInfinity') === 'ON') {
                player.infinity.studyPoints = tmp.infinity.maxStudyPoints;
                player.infinity.upgrades = [];
                buyUpgrade('infinity', 'unlockChallenges');
                buyUpgrade('infinity', 'breakInfinity');
            }
        } else {
            player[this.layer].infinities = player[this.layer].infinities.plus(1);
        }

        resetAD();
        resetBD();
        resetG();
        resetPoints();
    },

    /* === Data information === */
    startData() {
        return {
            unlocked: false,
            broken: false,
            points: new Decimal(0),
            infinities: new Decimal(0),
            studyPoints: new Decimal(0),
            timeInCurrentInfinity: 0
        }
    },

    maxStudyPoints() {
        return getBuyableAmount('infinity', 'SPFromAM').plus(getBuyableAmount('infinity', 'SPFromIP')).plus(getBuyableAmount('infinity', 'SPFromFE'))
    },

    update(delta) {
        player.infinity.timeInCurrentInfinity += delta;
    },

    tabFormat: {
        'Infinity Studies': {
            content: [
                __in.header,
                ['row', [['buyable', 'SPFromAM'], 'blank', ['buyable', 'SPFromIP'], 'blank', ['buyable', 'SPFromFE']]],
                'blank',
                ['row', [['clickable', 'respecOnNextInfinity']]],
                'blank','blank',
                ['row', [['upgrade', 'keepBuyMax']]],
                'blank','blank',
                ['row', [['upgrade', 'boostTimePlayed'], 'blank', ['upgrade', 'achievementBonus']]],
                'blank','blank',
                ['row', [['upgrade', 'unlockChallenges']]],
                'blank','blank',
                ['row', [['upgrade', 'keep10ADonReset'], 'blank', ['upgrade', 'xBoosterPower'], 'blank', ['upgrade', 'ultraFastSpawnRate']]],
                'blank','blank',
                ['row', [['upgrade', 'x1e10Boost'], 'blank', ['upgrade', 'freeBoosterUpgrades'], 'blank', ['upgrade', 'ultraFastMergeRate']]],
                'blank','blank',
                ['row', [['upgrade', 'breakInfinity']]],
                'blank','blank',
                ['row', [['upgrade', 'unlockInfinityDims']]],
                'blank','blank',
                // ['row', [['upgrade', 'unlockIncrementy'], 'blank', ['upgrade', 'unlockUniverses']]],
                // 'blank','blank',
                // ['row', [['upgrade', 'collapseInfinity']]],
                // 'blank','blank',
            ]
        },
        'Challenges': {
            unlocked() { return hasUpgrade('infinity', 'unlockChallenges') },
            content: [
                __in.header,
                'challenges'
            ]
        },
        'Break': {
            unlocked() { return hasUpgrade('infinity', 'breakInfinity') },
            content: [
                __in.header,
                ['clickable', 'break-infinity'],
                ['row', [['buyable', 1], ['buyable', 2]]],
                ['row', [['buyable', 3], ['buyable', 4]]],
                ['row', [['buyable', 5], ['buyable', 6]]]
            ]
        }
    },

    challenges: {
        11: {
            name: 'True AD',
            challengeDescription: 'Play the true original version of Antimatter Dimensions.<br>(At 100 times the speed).<br>',
            goalDescription: '1.79e308 True Antimatter<br>',
            rewardDescription: 'Unlock autobuyers for Booster Power Upgrades.',
            canComplete: function() { return player.points.gte('1.79e308') },
            onEnter() {
                __in.enterChallenge();
                layerDataReset('ta');
                player.points = new Decimal(10);
            },
            onExit() {
                __in.exitChallenge();
            }
        },
        12: {
            name: '2048',
            challengeDescription() { return `You can only merge using the arrow keys. The grid is 5x5.<br>Challenge completions raise the base atom by <b>1</b> per completion.<br>(Currently: ${tmp.c_2048.nerf.effect})` },
            goalDescription: '1 Iron atom<br>',
            rewardDescription: 'Unlock autobuyers for Galaxy Upgrades.',
            onEnter() {
                layerDataReset('c_2048');
                __in.enterChallenge();
                player.g.unlocked = false;
                player.bd.unlocked = false;
            },
            canComplete: function() {
                for(let item of GRIDLIST) {
                    if(player.c_2048.grid[item] === IRON) return true;
                }
                return false;
            },
            onExit() {
                __in.exitChallenge();
            }
        },
        21: {
            name: 'Boostless',
            challengeDescription: 'The Booster Layer is disabled.<br>GP generation starts at 1e100 AM.',
            goalDescription: '7e777 Antimatter<br>',
            rewardDescription: 'Dimensional Shifts and boosts reset nothing (except boosts to shifts).',
            canComplete: function() { return player.points.gte('7e777') },
            onEnter() {
                __in.enterChallenge();
            },
            onExit() {
                __in.exitChallenge();
            }
        },
        22: {
            name: 'Starless',
            challengeDescription: 'The Galaxy Layer is disabled.<br>BP generation is based on your <b>super square rooted</b> 1st Dimensions instead.',
            goalDescription: '7e777 Antimatter<br>',
            rewardDescription: 'Galaxial shifts reset nothing and unlock 2 more Galaxy Upgrades.',
            canComplete: function() { return player.points.gte('7e777') },
            onEnter() {
                __in.enterChallenge();
                player.g.unlocked = false;
            },
            onExit() {
                __in.exitChallenge();
            }
        },
        31: {
            name: 'Drought',
            challengeDescription: 'Booster and Galaxy layers are disabled.<br>',
            goalDescription: '1e100 Antimatter<br>',
            rewardDescription: 'Unlock autobuyers for Booster Upgrades.',
            canComplete: function() { return player.points.gte('4e444') },
            onEnter() {
                __in.enterChallenge();
                player.bd.unlocked = false;
                player.g.unlocked = false;
            },
            onExit() {
                __in.exitChallenge();
            }
        },
        32: {
            name: 'Speed',
            challengeDescription: 'There is exponentially rising matter which divides the power of all your Antimatter Dimensions.<br>If it reaches 1.79e308, <b>you lose.</b>',
            goalDescription: '1e750 Antimatter<br>',
            rewardDescription: 'Unlock autobuyers for Supernovas and Supernovas do not reset your atomic grid.',
            canComplete: function() { return player.points.gte('1e750') },
            onEnter() {
                __in.enterChallenge();
            },
            onExit() {
                __in.exitChallenge();
            }
        },
        41: {
            name: 'Boost or Nerf',
            challengeDescription: 'All 6 Booster Upgrades are unlocked, but you can only buy 2 of them. x10 to BP gain.<br>',
            goalDescription: '1e512 Antimatter<br>',
            rewardDescription: 'Gain 100% BP per second and keep your Booster Milestones.',
            canComplete: function() { return player.points.gte('1e512') },
            onEnter() {
                __in.enterChallenge();
                player.bd.c_41_boughtUpgrades = [];
            },
            onExit() {
                __in.exitChallenge();
            }
        },
        42: {
            name: 'Compact Universe',
            challengeDescription: 'The Galaxy Layer\'s atomic grid is now 2x2.<br>',
            goalDescription: '7e777 Antimatter<br>',
            rewardDescription: 'Gain 100% of GP gain per second.',
            canComplete: function() { return player.points.gte('7e777') },
            onEnter() {
                __in.enterChallenge();
                tmp.g.grid.rows = 2;
                tmp.g.grid.cols = 2;
            },
            onExit() {
                __in.exitChallenge();
                tmp.g.grid.rows = 4;
                tmp.g.grid.cols = 4;
            }
        },
        51: {
            name: 'The Ultimate Challenge',
            challengeDescription: 'There is raising decrementy that divides ALL production multipliers. Each challenge completion nerfs this raise. When Decrementy reaches 1.79e308, it will explode exponentially. Galaxy points are gained <b>instantly.</b><br>',
            goalDescription: '6e666 Antimatter<br>',
            rewardDescription: 'Unlock the power to Break Infinity.',
            canComplete: function() { return player.points.gte('6e666') },
            style: function() { return { 'width': '680px' } },
            onEnter() {
                __in.enterChallenge();
            },
            onExit() {
                __in.exitChallenge();
            }
        },
    },

    upgrades: {
        keepBuyMax: {
            fullDisplay() { return `Keep your "Autobuyers Buy Max" upgrade.<br><br>Free` },
            cost: 0,
            style: { height: '100px', border: '2px solid orange !important' },
            branches: ['boostTimePlayed', 'achievementBonus']
        },

        boostTimePlayed: {
            canAfford() { return player.infinity.studyPoints.gte(this.price) && hasUpgrade('infinity', 'keepBuyMax'); },
            effect() { return Decimal.max(1.0, Decimal.pow(player.timePlayed, 0.5)) },
            fullDisplay() { return `Antimatter Dimensions gain a multiplier based on time played.<br>Currently: ${mixedStandardFormat(this.effect(), 2, 0)}x<br><br>Cost: ${this.price} SP`  },
            onPurchase() { player.infinity.studyPoints = player.infinity.studyPoints.minus(this.price); },
            price: 2,
            style: { height: '100px', border: '2px solid orange !important' },
            branches: ['unlockChallenges']
        },
        achievementBonus: {
            canAfford() { return player.infinity.studyPoints.gte(this.price) && hasUpgrade('infinity', 'keepBuyMax'); },
            fullDisplay() { return `Achievement bonus is raised to the power of 3.<br>Currently: ${mixedStandardFormat(tmp.ach.multiplier, 3, 1)}x to Antimatter Dimensions.<br><br>Cost: ${this.price} SP`  },
            onPurchase() { player.infinity.studyPoints = player.infinity.studyPoints.minus(this.price); },
            price: 2,
            style: { height: '100px', border: '2px solid orange !important' },
            branches: ['unlockChallenges']
        },
        unlockChallenges: {
            canAfford() { return tmp[this.layer].maxStudyPoints.gte(this.price); },
            fullDisplay() { return `Unlock challenges.<br><br>Need ${this.price} total SP`  },
            onPurchase() { },
            price: 5,
            style: { height: '100px', border: '2px solid orange !important' },
            branches: ['keep10ADonReset', 'xBoosterPower', 'ultraFastSpawnRate']
        },

        keep10ADonReset: {
            canAfford() { return player.infinity.studyPoints.gte(this.price) && (hasUpgrade('infinity', 'achievementBonus') || hasUpgrade('infinity', 'boostTimePlayed')); },
            fullDisplay() { return `Keep 10 of each Antimatter Dimension on reset.<br><br>Cost: ${this.price} SP`  },
            onPurchase() { player.infinity.studyPoints = player.infinity.studyPoints.minus(this.price); },
            price: 3,
            style: { height: '100px', border: '2px solid #992c2c !important' },
            branches: ['x1e10Boost']
        },
        x1e10Boost: {
            canAfford() { return player.infinity.studyPoints.gte(this.price) && hasUpgrade('infinity', 'keep10ADonReset'); },
            fullDisplay() { return `Antimatter Dimensions gain a 1e10x boost each.<br><br>Cost: ${this.price} SP`  },
            onPurchase() { player.infinity.studyPoints = player.infinity.studyPoints.minus(this.price); },
            price: 3,
            style: { height: '100px', border: '2px solid #992c2c !important' },
            branches: ['breakInfinity']
        },
        xBoosterPower: {
            canAfford() { return player.infinity.studyPoints.gte(this.price) && (hasUpgrade('infinity', 'achievementBonus') || hasUpgrade('infinity', 'boostTimePlayed')); },
            fullDisplay() { return `x10,000 to Booster Power gain.<br><br>Cost: ${this.price} SP`  },
            onPurchase() { player.infinity.studyPoints = player.infinity.studyPoints.minus(this.price); },
            price: 3,
            style: { height: '100px', border: '2px solid #63b8ff !important' },
            branches: ['freeBoosterUpgrades']
        },

        freeBoosterUpgrades: {
            canAfford() { return player.infinity.studyPoints.gte(this.price) && hasUpgrade('infinity', 'xBoosterPower'); },
            fullDisplay() { return `All booster upgrades are free.<br><br>Cost: ${this.price} SP`  },
            onPurchase() { player.infinity.studyPoints = player.infinity.studyPoints.minus(this.price); },
            price: 3,
            style: { height: '100px', border: '2px solid #63b8ff !important' },
            branches: ['breakInfinity']
        },
        ultraFastSpawnRate: {
            canAfford() { return player.infinity.studyPoints.gte(this.price) && (hasUpgrade('infinity', 'achievementBonus') || hasUpgrade('infinity', 'boostTimePlayed')); },
            effect() { return Decimal.max(1, Decimal.minus(100, Decimal.pow(Decimal.div(player.infinity.timeInCurrentInfinity, 10), 2.5))) },
            fullDisplay() { return `The Galaxy Layer's starting generation speed is 100x faster, but drops exponentially.<br>Currently ${__(this.effect(), 2, 0)}x<br><br>Cost: ${this.price} SP`  },
            onPurchase() { player.infinity.studyPoints = player.infinity.studyPoints.minus(this.price); },
            price: 3,
            style: { height: '100px', border: '2px solid #dd3ffc !important' },
            branches: ['ultraFastMergeRate']
        },
        ultraFastMergeRate: {
            canAfford() { return player.infinity.studyPoints.gte(this.price) && hasUpgrade('infinity', 'ultraFastSpawnRate'); },
            effect() { return Decimal.max(1, Decimal.minus(100, Decimal.pow(Decimal.div(player.infinity.timeInCurrentInfinity, 10), 2.5))) },
            fullDisplay() { return `The same applies to the Galaxy layer's merge speed.<br>Currently ${__(this.effect(), 2, 0)}x<br><br>Cost: ${this.price} SP`  },
            onPurchase() { player.infinity.studyPoints = player.infinity.studyPoints.minus(this.price); },
            price: 3,
            style: { height: '100px', border: '2px solid #dd3ffc !important' },
            branches: ['breakInfinity']
        },

        breakInfinity: {
            canAfford() { return Object.values(player.infinity.challenges).filter(e => e == 1).length === 9; },
            fullDisplay() { return `Break Infinity<br><br>Requires all challenges completed.`  },
            onPurchase() { },
            price: 0,
            style: { height: '100px', border: '2px solid orange !important' },
            branches: ['unlockInfinityDims']
        },

        pickAnotherPath: {
            canAfford() { return player.infinity.studyPoints.gte(this.price) && hasUpgrade('infinity', 'breakInfinity') },
            fullDisplay() { return `Pick another path from the second split.<br><br>Cost: ${this.price} SP`  },
            onPurchase() { player.infinity.studyPoints = player.infinity.studyPoints.minus(this.price); },
            price: 10,
            style: { height: '100px', border: '2px solid orange !important' },
            branches: ['unlockIncrementy']
        },

        unlockInfinityDims: {
            canAfford() { return player.infinity.studyPoints.gte(this.price) && hasUpgrade('infinity', 'breakInfinity') },
            fullDisplay() { return `Unlock Infinity Dimensions.<br><br>Soon`  },
            onPurchase() { player.infinity.studyPoints = player.infinity.studyPoints.minus(this.price); },
            price: 1e308,
            style: { height: '100px', border: '2px solid orange !important' },
            branches: ['unlockIncrementy', 'unlockUniverses']
        },

        unlockIncrementy: {
            canAfford() { return player.infinity.studyPoints.gte(this.price) && hasUpgrade('infinity', 'breakInfinity') },
            fullDisplay() { return `Unlock Incrementy.<br><br>Soon`  },
            onPurchase() { player.infinity.studyPoints = player.infinity.studyPoints.minus(this.price); },
            price: 1e308,
            style: { height: '100px', border: '2px solid blue !important' },
            branches: ['collapseInfinity']
        },
        unlockUniverses: {
            canAfford() { return player.infinity.studyPoints.gte(this.price) && hasUpgrade('infinity', 'breakInfinity') },
            fullDisplay() { return `Unlock Universes.<br><br>Soon`  },
            onPurchase() { player.infinity.studyPoints = player.infinity.studyPoints.minus(this.price); },
            price: 1e308,
            style: { height: '100px', border: '2px solid white !important' },
            branches: ['collapseInfinity']
        },

        collapseInfinity: {
            effect() { return Math.floor(Math.random() * 2) - Math.floor(Math.random() * 2) },
            description() { return `Perform the Universal Collapse`  },
            cost: 1.79e308,
            style() { return {
                height: '150px',
                width: '300px',
                fontSize: '16pt',
                border: '2px solid orange !important',
                transform: `translateX(${this.effect()}px) translateY(${this.effect()}px)`,
                zIndex: '100',
                'transition-duration': '0s'
            } }
        },
    },

    buyables: {
        'SPFromAM': {
            cost() { return Decimal.pow(1e200, getBuyableAmount(this.layer, this.id).plus(1)) },
            canAfford() { return player.points.gte(this.cost()) },
            display() { return `Get a Study Point from your Antimatter amount.<br>Next at ${__(this.cost(), 0, 1)} AM` },
            buy() { player.infinity.studyPoints = player.infinity.studyPoints.plus(1); player.points = player.points.minus(this.cost()); setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1)) },
            style() { return { height: '60px' } }
        },
        'SPFromIP': {
            cost() { return Decimal.pow(2, getBuyableAmount(this.layer, this.id)) },
            canAfford() { return player.infinity.points.gte(this.cost()) },
            display() { return `Get a Study Point from your Infinity Points.<br>Next at ${__(this.cost(), 0, 1)} IP` },
            buy() { player.infinity.studyPoints = player.infinity.studyPoints.plus(1); player.infinity.points = player.infinity.points.minus(this.cost()); setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1)) },
            style() { return { height: '60px' } }
        },
        'SPFromFE': {
            cost() { return 0 },
            canAfford() { return false },
            display() { return `Get a Study Point from your Incrementy amount.<br>Locked` },
            buy() {  },
            style() { return { height: '60px' } }
        },

        1: {
            cost() { return Decimal.pow(4, getBuyableAmount(this.layer, this.id).plus(getBuyableAmount(this.layer, this.id))) },
            canAfford() { return player.infinity.points.gte(this.cost()); },
            effect() { return Decimal.pow(2, getBuyableAmount(this.layer, this.id).plus(1))},
            display() { return `Gain x2 more IP.<br>Currently x${__(this.effect())}.<br><br>Cost: ${__(this.cost(), 3, 1)} IP` },
            buy() { player.infinity.points = player.infinity.points.minus(this.cost()); setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1)) },
            style() { return { height: '120px' } }
        },
        2: {
            cost() { return Decimal.pow(2, getBuyableAmount(this.layer, this.id).plus(getBuyableAmount(this.layer, this.id))) },
            canAfford() { return getBuyableAmount('infinity', 2).lt(10) && player.infinity.points.gte(this.cost()); },
            effect() { return new Decimal(2).minus(getBuyableAmount(this.layer, this.id).times(0.05)) },
            effectNext() { return new Decimal(2).minus((getBuyableAmount(this.layer, this.id).plus(1)).times(0.05)) },
            display() { return `Reduce the AD cost scaling.<br>Currently ${__(this.effect(), 2)}.<br>${getBuyableAmount('infinity', 2).lt(10) ? `Next ${__(this.effect(), 2)} -> ${__(this.effectNext(), 2)}` : 'Maxed Out'}<br><br>Cost: ${__(this.cost(), 3, 1)} IP` },
            buy() { player.infinity.points = player.infinity.points.minus(this.cost()); setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1)) },
            style() { return { height: '120px' } }
        },
        3: {
            cost() { return Decimal.pow(2, getBuyableAmount(this.layer, this.id).plus(getBuyableAmount(this.layer, this.id))) },
            canAfford() { return player.infinity.points.gte(this.cost()); },
            effect() { return Decimal.pow(0.1, getBuyableAmount(this.layer, this.id))},
            display() { return `Reduce Booster Upgrade cost by *0.1.<br>Currently x / ${__(Decimal.div(1, this.effect()))}.<br><br>Cost: ${__(this.cost())} IP` },
            buy() { player.infinity.points = player.infinity.points.minus(this.cost()); setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1)) },
            style() { return { height: '120px' } }
        },
        4: {
            cost() { return Decimal.pow(2, getBuyableAmount(this.layer, this.id).plus(getBuyableAmount(this.layer, this.id))) },
            canAfford() { return player.infinity.points.gte(this.cost()); },
            effect() { return Decimal.pow(0.1, getBuyableAmount(this.layer, this.id))},
            display() { return `Reduce Galaxy Upgrade cost by *0.1.<br>Currently x / ${__(Decimal.div(1, this.effect()))}.<br><br>Cost: ${__(this.cost())} IP` },
            buy() { player.infinity.points = player.infinity.points.minus(this.cost()); setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1)) },
            style() { return { height: '120px' } }
        },
        5: {
            cost() { return Decimal.times(10, Decimal.pow(10, getBuyableAmount(this.layer, this.id))) },
            canAfford() { return player.infinity.points.gte(this.cost()); },
            effect() { return getBuyableAmount(this.layer, this.id) },
            display() { return `Galaxies can produce atoms beyond iron.<br>Currently ${this.effect()} new atoms.<br><br>Cost: ${__(this.cost())} IP` },
            buy() { player.infinity.points = player.infinity.points.minus(this.cost()); setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1)) },
            style() { return { height: '120px' } }
        },
        6: {
            cost() { return Decimal.pow(100, getBuyableAmount(this.layer, this.id).plus(getBuyableAmount(this.layer, this.id))) },
            canAfford() { return player.infinity.points.gte(this.cost()); },
            effect() { return Decimal.pow('1e10', getBuyableAmount(this.layer, this.id)) },
            display() { return `x1e10 to all Antimatter Dimensions.<br>Currently x${this.effect()}.<br><br>Cost: ${__(this.cost())} IP` },
            buy() { player.infinity.points = player.infinity.points.minus(this.cost()); setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1)) },
            style() { return { height: '120px' } }
        },
    },

    clickables: {
        respecOnNextInfinity: {
            onClick() { setClickableState(this.layer, this.id, getClickableState(this.layer, this.id) === 'OFF' ? 'ON' : 'OFF') }, 
            canClick() { return true; },
            display() { return `Respec SP on next Infinity<br>(or challenge enter/exit): ${getClickableState(this.layer, this.id)}` }
        }
    }

});