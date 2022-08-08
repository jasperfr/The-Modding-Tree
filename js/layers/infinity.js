const __in = {
    header: ['column', [
        function() { if(player.infinity.broken) return ['column', ['prestige-button', 'blank']] },
        ['display-text', function() { return `You have <span style="color:orange;font-size:20px;font-weight:bold;">${__(player.infinity.points, 3, 1)}</span> IP.`; }, { 'color': 'silver' }],
        ['display-text', function() { return `You have infinitied <span style="color:orange;font-size:20px;font-weight:bold;">${formatWhole(player.infinity.infinities)}</span> times.`; }, { 'color': 'silver', 'font-size': '12px' }],
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
            'background-image': 'radial-gradient(circle at center, #e3bb29, orange)'
        }
    },

    doReset(layer) {
        if(layer !== 'infinity') return;
        player[this.layer].infinities = player[this.layer].infinities.plus(1);
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
            timeInCurrentInfinity: 0
        }
    },

    update(delta) {
        player.infinity.timeInCurrentInfinity += delta;
    },

    tabFormat: {
        'Infinity Studies': {
            content: [
                __in.header,
                ['row', [['upgrade', 'keepBuyMax']]],
                'blank','blank',
                ['row', [['upgrade', 'boostTimePlayed']]],
                'blank','blank',
                ['row', [['upgrade', 'achievementBonus'], 'blank', ['upgrade', 'ultraFastSpawnRate']]],
                'blank','blank',
                ['row', [['upgrade', 'reduceCostScaling']]],
                'blank','blank',
                ['row', [['upgrade', 'infChallenge1']]],
                'blank','blank',
                // ['row', [['upgrade', 'boostInfinities'], 'blank', ['upgrade', 'gainMoreBP'], 'blank', ['upgrade', 'log10EffectGP']]],
                // 'blank',
                // ['row', [['upgrade', 'dimPower10'], 'blank', ['upgrade', 'boostUnspentBP'], 'blank', ['upgrade', 'startAtC']]],
                // 'blank',
                // ['row', [['upgrade', 'increaseTickspeed'], 'blank', ['upgrade', 'bpsBoostsItself'], 'blank', ['upgrade', 'startAt308']]],
                // 'blank','blank',
                // ['row', [['upgrade', 'infChallenge2']]],
                // 'blank','blank',
                // ['row', [['upgrade', 'unlockDuplicanti']]],
                // 'blank','blank',
                // ['row', [['upgrade', 'furtherReduceCostScaling']]],
                // 'blank','blank',
                // ['row', [['upgrade', 'activeBoostIP'], 'blank', ['upgrade', 'passiveBoostIP'], 'blank', ['upgrade', 'idleBoostIP']]],
                // 'blank','blank',
                // ['row',[['upgrade', 'activeBoostBP'], 'blank', ['upgrade', 'passiveBoostBP'], 'blank', ['upgrade', 'idleBoostBP']]],
                // 'blank','blank',
                // ['row', [['upgrade', 'activeBoostDuplicanti'], 'blank', ['upgrade', 'passiveBoostDuplicanti'], 'blank', ['upgrade', 'idleBoostDuplicanti']]],
                // 'blank','blank',
                // ['row', [['upgrade', 'infChallenge3'], 'blank', ['upgrade', 'infChallenge5'], 'blank', ['upgrade', 'infChallenge4']]],
                // 'blank','blank',
                // ['row', [['upgrade', 'furtherReduceCostScalingMore']]],
                // 'blank','blank',
                // ['row', [['upgrade', 'collapseInfinity']]],
                // 'blank','blank',
            ]
        },
        'Challenges': {
            content: [
                __in.header,
                ['raw-html', '<h1>Challenges</h1>'],
                'blank',
                'blank',
                'challenges'
            ]
        },
        'Break': {
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
            goalDescription: '1e512 Antimatter<br>',
            rewardDescription: 'Dimensional Shifts and boosts reset nothing (except boosts to shifts).',
            canComplete: function() { return player.points.gte('1e512') },
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
            goalDescription: '1e700 Antimatter<br>',
            rewardDescription: 'Galaxial shifts reset nothing and unlock 2 more Galaxy Upgrades.',
            canComplete: function() { return player.points.gte('1e700') },
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
            canComplete: function() { return player.points.gte('1e100') },
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
            goalDescription: '1e450 Antimatter<br>',
            rewardDescription: 'Unlock the power to Break Infinity.',
            canComplete: function() { return player.points.gte('1e450') },
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
            description() { return `Keep your "Autobuyers Buy Max" upgrade.` },
            cost: 0,
            style: { height: '100px', border: '2px solid orange !important' },
            branches: ['boostTimePlayed']
        },
        boostTimePlayed: {
            effect() { return Decimal.max(1.0, Decimal.pow(player.timePlayed / 10, 0.25)) },
            description() { return `Antimatter Dimensions gain a multiplier based on time played.<br>Currently: ${mixedStandardFormat(this.effect(), 2, 0)}x`  },
            cost: 1,
            style: { height: '100px', border: '2px solid orange !important' },
            branches: ['achievementBonus', 'ultraFastSpawnRate']
        },

        achievementBonus: {
            description() { return `Achievement bonus is raised to the power of 1.5.`  },
            cost: 2,
            style: { height: '100px', border: '2px solid orange !important' },
            branches: ['reduceCostScaling']
        },
        ultraFastSpawnRate: {
            effect() { return Decimal.max(1, Decimal.minus(100, Decimal.pow(Decimal.div(player.infinity.timeInCurrentInfinity, 10), 2.5))) },
            description() { return `The Galaxy Layer's starting generation speed is 100x faster, but drops exponentially.<br>Currently ${__(this.effect(), 2, 0)}x`  },
            cost: 2,
            style: { height: '100px', border: '2px solid orange !important' },
            branches: ['reduceCostScaling']
        },

        reduceCostScaling: {
            description() { return `Locked until next update`  },
            cost: 1e300,
            style: { height: '100px', border: '2px solid orange !important' },
            branches: ['infChallenge1']
        },

        infChallenge1: {
            description() { return `To be continued...`  },
            cost: 1e300,
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
            effect() { return Math.floor(Math.random() * 5) - Math.floor(Math.random() * 5) },
            description() { return `Perform the Universal Collapse`  },
            cost: 1.79e308,
            style() { return {
                height: '200px',
                width: '400px',
                fontSize: '24pt',
                border: '2px solid orange !important',
                transform: `translateX(${this.effect()}px) translateY(${this.effect()}px)`,
                zIndex: '100',
                'transition-duration': '0s'
            } }
        },
    },

    clickables: {
        'break-infinity': {
            effect() { return Math.floor(Math.random() * 2) - Math.floor(Math.random() * 2) },
            display() {
                if(sumValues(player.infinity.challenges).toNumber() === 9) {
                    return `<h1>BREAK INFINITY</h1><br><br>There is no going back!`
                }
                return `<h1>BREAK INFINITY</h1><br><br>Requires all challenge completions.<br>You are not worthy yet.<br>(${sumValues(player.infinity.challenges).toNumber()}/9 Completions)`;
            },
            canClick() {
                return sumValues(player.infinity.challenges).toNumber() === 9;
            },
            onClick() {
                player.infinity.broken = true;
            },
            unlocked() {
                return !player.infinity.broken;
            },
            style() {
                return {
                    width: '600px',
                    height: '300px',
                    transform: `translateX(${this.effect()}px) translateY(${this.effect()}px)`,
                    'font-size': '20pt',
                    'transition-duration': '0s'
                }
            }
        }
    },

    buyables: {
        1: {
            unlocked() { return player.infinity.broken; },
            cost() { return Decimal.pow(4, getBuyableAmount(this.layer, this.id).plus(getBuyableAmount(this.layer, this.id))) },
            canAfford() { return player.infinity.points.gte(this.cost()); },
            effect() { return Decimal.pow(2, getBuyableAmount(this.layer, this.id).plus(1))},
            display() { return `Gain x2 more IP.<br>Currently x${__(this.effect())}.<br><br>Cost: ${__(this.cost(), 3, 1)} IP` },
            buy() { player.infinity.points = player.infinity.points.minus(this.cost()); setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1)) },
            style() { return { height: '120px' } }
        },
        2: {
            unlocked() { return player.infinity.broken; },
            cost() { return Decimal.pow(2, getBuyableAmount(this.layer, this.id).plus(getBuyableAmount(this.layer, this.id))) },
            canAfford() { return player.infinity.points.gte(this.cost()); },
            effect() { return new Decimal(2).minus(getBuyableAmount(this.layer, this.id).times(0.05)) },
            effectNext() { return new Decimal(2).minus((getBuyableAmount(this.layer, this.id).plus(1)).times(0.05)) },
            display() { return `Reduce the AD cost scaling.<br>Currently ${__(this.effect(), 2)}.<br>Next ${__(this.effect(), 2)} -> ${__(this.effectNext(), 2)}<br><br>Cost: ${__(this.cost(), 3, 1)} IP` },
            buy() { player.infinity.points = player.infinity.points.minus(this.cost()); setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1)) },
            style() { return { height: '120px' } }
        },
        3: {
            unlocked() { return player.infinity.broken; },
            cost() { return Decimal.pow(2, getBuyableAmount(this.layer, this.id).plus(getBuyableAmount(this.layer, this.id))) },
            canAfford() { return player.infinity.points.gte(this.cost()); },
            effect() { return Decimal.pow(0.1, getBuyableAmount(this.layer, this.id))},
            display() { return `Reduce Booster Upgrade cost by *0.1.<br>Currently x / ${__(Decimal.div(1, this.effect()))}.<br><br>Cost: ${__(this.cost())} IP` },
            buy() { player.infinity.points = player.infinity.points.minus(this.cost()); setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1)) },
            style() { return { height: '120px' } }
        },
        4: {
            unlocked() { return player.infinity.broken; },
            cost() { return Decimal.pow(2, getBuyableAmount(this.layer, this.id).plus(getBuyableAmount(this.layer, this.id))) },
            canAfford() { return player.infinity.points.gte(this.cost()); },
            effect() { return Decimal.pow(0.1, getBuyableAmount(this.layer, this.id))},
            display() { return `Reduce Galaxy Upgrade cost by *0.1.<br>Currently x / ${__(Decimal.div(1, this.effect()))}.<br><br>Cost: ${__(this.cost())} IP` },
            buy() { player.infinity.points = player.infinity.points.minus(this.cost()); setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1)) },
            style() { return { height: '120px' } }
        },
        5: {
            unlocked() { return player.infinity.broken; },
            cost() { return Decimal.times(10, Decimal.pow(10, getBuyableAmount(this.layer, this.id))) },
            canAfford() { return player.infinity.points.gte(this.cost()); },
            effect() { return getBuyableAmount(this.layer, this.id) },
            display() { return `Galaxies can produce atoms beyond iron.<br>Currently ${this.effect()} new atoms.<br><br>Cost: ${__(this.cost())} IP` },
            buy() { player.infinity.points = player.infinity.points.minus(this.cost()); setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1)) },
            style() { return { height: '120px' } }
        },
        6: {
            unlocked() { return player.infinity.broken; },
            cost() { return Decimal.pow(100, getBuyableAmount(this.layer, this.id).plus(getBuyableAmount(this.layer, this.id))) },
            canAfford() { return player.infinity.points.gte(this.cost()); },
            effect() { return Decimal.pow('1e10', getBuyableAmount(this.layer, this.id)) },
            display() { return `x1e10 to all Antimatter Dimensions.<br>Currently x${this.effect()}.<br><br>Cost: ${__(this.cost())} IP` },
            buy() { player.infinity.points = player.infinity.points.minus(this.cost()); setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1)) },
            style() { return { height: '120px' } }
        },
    }

});