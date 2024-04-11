const __bd = {
    header: ['column', [
        ['display-text', function() {
            const self = player.bd;
            const temp = tmp.bd;
            const auto = hasChallenge('infinity', 41);
            return `
                You have <bd>${__(self.points,2,1)}</bd> Booster Points. <br>
                You have <bd>${__(self.power,2,0)}</bd> Booster Power. <br>
                You are getting <bd>${__(temp.power.perSecond,3,0)}</bd> Booster Power per second. <br>
                ${hasMilestone('bd', 5) ? '' : `This slows down exponentially after <bd>${__(temp.buyables[2].effect,2,0)}</bd> power. <br>`}
                Your booster power multiplies all dimensions by <bd>${__(temp.power.multiplier,1,0)}</bd>x.<br>
                ${auto ? `You are getting <bd>${__(temp.points.gain,2,1)}</bd> Booster Points per second.`: `Your time in this booster reset is <bd>${TIME(self.timeInCurrentAD)}</bd>.<br>
                Your best time is <bd>${TIME(self.lowestTime)}</bd>.<br>`}
            `
        }, { 'color': 'silver', 'font-size': '12px' }],
        'blank'
    ]]
}

function resetBD() {
    let autoBoosterUpgradeState = 'Locked';
    let autoBoosterState = 'Locked';
    let keep = ['clickables'];

    if(hasChallenge('infinity', 11)) autoBoosterState = getClickableState('bd', 'auto');
    if(hasChallenge('infinity', 31)) autoBoosterUpgradeState = getClickableState('bd', 'autoUpgrade');
    if(hasChallenge('infinity', 41)) keep.push('milestones');

    layerDataReset('bd', keep);
    setClickableState('bd', 'auto', autoBoosterState);
    setClickableState('bd', 'autoUpgrade', autoBoosterUpgradeState);
}

addLayer('bd', {
    name: 'Booster Dimensions',
    symbol() { return options.toggleButtonAnimations ? '' : 'B' },
    color: '#63b8ff',
    tooltip: 'Boosters',
    resource: 'BP',

    nodeStyle() {
        return options.toggleButtonAnimations ? {
            'color': 'white',
            'background-image': 'url("resources/booster.gif")',
            'background-position': 'center center',
            'background-size': '200%',
            'border': '1px solid white'
        } : {
            'background-image': 'radial-gradient(circle at center, #5ae887, #63b8ff)'
        }
    },

    layerShown() {
        if(inChallenge('infinity', 11)) return false;   // true AD
        if(inChallenge('infinity', 12)) return false;   // 2048
        if(inChallenge('infinity', 21)) return false;    // boostless
        if(inChallenge('infinity', 22)) return true;   // starless
        if(inChallenge('infinity', 31)) return false;   // drought
        return player.bd.unlocked;
    },

    startData() {
        return {
            unlocked: false,
            restart: false,
            points: new Decimal(0),
            power: new Decimal(0),
            timeInCurrentAD: 0,
            lowestTime: 1e100,
            boosterStats: [null, null, null, null, null, null, null, null, null, null],
            c_41_boughtUpgrades: []
        }
    },

    points: {
        gain() {
            if(inChallenge('infinity', 22)) {
                return Decimal.max(0, Decimal.ssqrt(player.ad.dimensions[0]))
                    .floor()
                    .times(tmp.bd.buyables[3].effect)
                    .times(hasUpgrade('bd', 'gain10times') ? 10 : 1)
                .times(hasMilestone('bd', 4) ? 10 : 1)
            }
            return Decimal.divide(player.ad.dimensions[7], 10)
                .floor()
                .times(tmp.bd.buyables[3].effect)
                .times(hasUpgrade('bd', 'gain10times') ? 10 : 1)
                .times(inChallenge('infinity', 41) ? 10 : 1)
            .times(hasMilestone('bd', 4) ? 10 : 1)
        },
        perSecond() {
            return tmp.bd.points.gain.div(player.bd.timeInCurrentAD);
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
            base = base.times(Decimal.pow(10, getBuyableAmount('bd', 6)))
            if(hasAchievement('ach', 25)) base = base.times(1.1);
            // INF-STUDY-42
            if(hasUpgrade('infinity', 'xBoosterPower')) base = base.times(10000);
            base = Decimal.max(base, 0.001);
            return base;
        },
        multiplier() {
            return Decimal.plus(1, player.bd.power)
            .times(tmp.bd.buyables[4].effect)
            .times(tmp.d.decrementy.effectB)
            .times(inChallenge('infinity', 22) ? 1 + player.ad.dimensions[7] : 1)
        }
    },

    update(delta) {
        if(hasChallenge('infinity', 41)) {
            player.bd.points = player.bd.points.plus(tmp.bd.points.gain.times(delta));
        }

        player.bd.power = player.bd.power.plus(Decimal.times(tmp.bd.power.perSecond, delta));
        player.bd.points = player.bd.points.plus(tmp.bd.buyables[5].effect.times(delta));
        player.bd.timeInCurrentAD += delta;

        if(getClickableState(this.layer, 'autoUpgrade') === 'ON') {
            buyUpgrade(this.layer, 'reducePenal');
            buyUpgrade(this.layer, 'keep50OnReset');
            buyUpgrade(this.layer, 'reducePenal2');
            buyUpgrade(this.layer, 'log10boost');
            buyUpgrade(this.layer, 'gain10times');
            buyUpgrade(this.layer, 'log100boost');
            buyUpgrade(this.layer, 'cheaperBuyables');
            buyUpgrade(this.layer, 'adim-m');
            buyUpgrade(this.layer, 'keep-1');
            buyUpgrade(this.layer, 'keep-2');
            buyUpgrade(this.layer, 'keep-3');
            buyUpgrade(this.layer, 'keep-4');
        };

        if(getClickableState(this.layer, 'auto') === 'ON') {
            buyBuyable(this.layer, 1);
            buyBuyable(this.layer, 2);
            buyBuyable(this.layer, 3);
            buyBuyable(this.layer, 4);
            buyBuyable(this.layer, 5);
            buyBuyable(this.layer, 6);
        }
    },

    tabFormat: {
       'Power': {
            content: [
                __bd.header,
                ['clickable', 'gain'],
                ['row', [['buyable', 1], ['buyable', 2]]],
                ['row', [['buyable', 3], ['buyable', 4]]],
                ['row', [['buyable', 5], ['buyable', 6]]],
                'blank',
                ['clickable', 'auto']
            ]
        }, 
        'Upgrades': {
            content: [
                __bd.header,
                ['row', [['upgrade', 'keep-1'], 'blank', ['upgrade', 'adim-m'], 'blank', ['upgrade', 'reducePenal']]],
                ['row', [['upgrade', 'keep-2'], 'blank', ['upgrade', 'keep50OnReset'], 'blank', ['upgrade', 'reducePenal2']], { 'margin-top': '6px' }],
                ['row', [['upgrade', 'keep-3'], 'blank', ['upgrade', 'log10boost'], 'blank', ['upgrade', 'gain10times']], { 'margin-top': '6px' }],
                ['row', [['upgrade', 'keep-4'], 'blank', ['upgrade', 'log100boost'], 'blank', ['upgrade', 'cheaperBuyables']], { 'margin-top': '6px' }],,
                'blank',
                ['clickable', 'autoUpgrade'],
            ]
        },
        'Milestones': {
            content: [
                __bd.header,
                ['display-text', 'Complete milestones to get rewards!'],
                'blank',
                'milestones'
            ]
        },
        'Statistics': {
            unlocked() {
                return !hasChallenge('infinity', 41);
            },
            content: [
                __bd.header,
                ['display-text', 'Last 10 boosters:'],
                'blank',
                function() {
                    const html = ['column', []];
                    for(let i = 0; i < 10; i++) {
                        const statistic = player.bd.boosterStats[i];
                        if(!statistic) {
                            html[1].push(['display-text', `${i + 1}: Not happened yet`]);
                        } else {
                            html[1].push(['display-text', `${i + 1}: ${statistic.time}, ${__(statistic.gain,1,0)} BP, ${__(statistic.bps, 2, 0)} BP/s`]);
                        }
                    }
                    return html;
                }
            ]
        }
    },

    milestones: {
        0 : {
            requirementDescription: "Boost in under 10 minutes",
            effectDescription: "Reward: BPS * 2",
            done() { return hasChallenge('infinity', 41) || player.bd.lowestTime < 600 },
            style() {
                if(player.bd.timeInCurrentAD > 600 && !hasMilestone(this.layer, this.id)) {
                    return { 'background-color': '#992c2c !important' }
                }
            }
        },
        1 : {
            requirementDescription: "Boost in under 5 minutes",
            effectDescription: "Reward: BPS * 3",
            done() { return hasChallenge('infinity', 41) || player.bd.lowestTime < 300 },
            style() {
                if(player.bd.timeInCurrentAD > 300 && !hasMilestone(this.layer, this.id)) {
                    return { 'background-color': '#992c2c !important' }
                }
            }
        },
        2 : {
            requirementDescription: "Boost in under 1 minute",
            effectDescription: "Reward: BPS * 5",
            done() { return hasChallenge('infinity', 41) || player.bd.lowestTime <= 60 },
            style() {
                if(player.bd.timeInCurrentAD > 60 && !hasMilestone(this.layer, this.id)) {
                    return { 'background-color': '#992c2c !important' }
                }
            }
        },
        3 : {
            requirementDescription: "Boost in under 15 seconds",
            effectDescription: "Reward: BPS * 10, Booster cap * 10",
            done() { return hasChallenge('infinity', 41) || player.bd.lowestTime <= 15 },
            style() {
                if(player.bd.timeInCurrentAD > 15 && !hasMilestone(this.layer, this.id)) {
                    return { 'background-color': '#992c2c !important' }
                }
            }
        },
        4 : {
            requirementDescription: "Boost in under 2 seconds",
            effectDescription: "Reward: BP gain * 5",
            done() { return hasChallenge('infinity', 41) || player.bd.lowestTime < 2 },
            style() {
                if(player.bd.timeInCurrentAD > 2 && !hasMilestone(this.layer, this.id)) {
                    return { 'background-color': '#992c2c !important' }
                }
            }
        },
        5 : {
            requirementDescription: "Boost in under 1 second",
            effectDescription: "Reward: Remove the booster cap",
            done() { return hasChallenge('infinity', 41) || player.bd.lowestTime < 1 },
            style() {
                if(player.bd.timeInCurrentAD > 1 && !hasMilestone(this.layer, this.id)) {
                    return { 'background-color': '#992c2c !important' }
                }
            }
        }
    },

    clickables: {
        autoUpgrade: {
            display() {
                if(!getClickableState(this.layer, this.id)) setClickableState(this.layer, this.id, 'Locked');
                const state = getClickableState(this.layer, this.id);
                if(state === 'Locked' && hasChallenge('infinity', 31)) setClickableState(this.layer, this.id, 'ON');

                return `Auto: ${state}`;
            },

            canClick() {
                const state = getClickableState(this.layer, this.id);
                return state !== 'Locked'
            },

            onClick() {
                const state = getClickableState(this.layer, this.id);
                switch(state) {
                    case 'Locked': break;
                    case 'ON': setClickableState(this.layer, this.id, 'OFF'); break;
                    case 'OFF': setClickableState(this.layer, this.id, 'ON'); break;
                }
            },

            style() {
                let borderColor = '';
                let backgroundImage = '';
                let animation = '';
                const state = getClickableState(this.layer, this.id);

                if(state === 'Locked') return { 'display': 'none !important' }
    
                switch(state) {
                    case 'ON':
                        borderColor = '#c733cc !important';
                        backgroundImage = 'repeating-linear-gradient(-45deg, #332833, 10%, #222 10%, #222 20%)';
                        animation = 'ani-autobuyer-enabled 2000ms linear infinite';
                        break;
                    case 'OFF':
                        borderColor = 'orange !important';
                        backgroundImage = 'repeating-linear-gradient(-45deg, #423726, 10%, #222 10%, #222 20%)';
                        break;
                }
                
                return {
                    'background-size': '200% 200%',
                    'background-image': backgroundImage,
                    'border-color': borderColor,
                    'animation': animation,
                    'height': '100px',
                    'margin': '2px',
                }
            }
        },

        auto: {
            display() {
                if(!getClickableState(this.layer, this.id)) setClickableState(this.layer, this.id, 'Locked');
                const state = getClickableState(this.layer, this.id);
                if(state === 'Locked' && hasChallenge('infinity', 11)) setClickableState(this.layer, this.id, 'ON');

                return `Auto: ${state}`;
            },

            canClick() {
                const state = getClickableState(this.layer, this.id);
                return state !== 'Locked'
            },

            onClick() {
                const state = getClickableState(this.layer, this.id);
                switch(state) {
                    case 'Locked': break;
                    case 'ON': setClickableState(this.layer, this.id, 'OFF'); break;
                    case 'OFF': setClickableState(this.layer, this.id, 'ON'); break;
                }
            },

            style() {
                let borderColor = '';
                let backgroundImage = '';
                let animation = '';
                const state = getClickableState(this.layer, this.id);

                if(state === 'Locked') return { 'display': 'none !important' }
    
                switch(state) {
                    case 'ON':
                        borderColor = '#c733cc !important';
                        backgroundImage = 'repeating-linear-gradient(-45deg, #332833, 10%, #222 10%, #222 20%)';
                        animation = 'ani-autobuyer-enabled 2000ms linear infinite';
                        break;
                    case 'OFF':
                        borderColor = 'orange !important';
                        backgroundImage = 'repeating-linear-gradient(-45deg, #423726, 10%, #222 10%, #222 20%)';
                        break;
                }
                
                return {
                    'background-size': '200% 200%',
                    'background-image': backgroundImage,
                    'border-color': borderColor,
                    'animation': animation,
                    'height': '100px',
                    'margin': '2px',
                }
            }
        },

        gain: {
            display() { 
                if(hasChallenge('infinity', 41)) {
                    return `You are getting ${__(tmp.bd.points.gain, 2, 1)} points per second.`
                }
                let bps = __(tmp.bd.points.perSecond, 2, 0);
                if(bps === 'NaN') return `Reset for ${__(tmp.bd.points.gain,2,0)} BP.<br>(You gain BP too fast to be calculated.)`;
                return `Reset for ${__(tmp.bd.points.gain,2,0)} BP.<br>(${bps} BP/sec)` },
            canClick() { return !hasChallenge('infinity', 41) && tmp.bd.points.gain.gte(1); },
            onClick() {
                if(hasChallenge('infinity', 41)) {
                    return;
                }
                
                if(hasChallenge('infinity', 21)) {
                    player.ad.shifts = 0 + hasUpgrade('bd', 'keep-1') + hasUpgrade('bd', 'keep-2') + hasUpgrade('bd', 'keep-3') + hasUpgrade('bd', 'keep-4');
                    player.bd.points = player.bd.points.plus(tmp.bd.points.gain);
                    player.bd.lowestTime = Math.min(player.bd.lowestTime, player.bd.timeInCurrentAD);
                    player.bd.power = hasUpgrade('bd', 'keep50OnReset') ? player.bd.power.times(0.5) : new Decimal(0);
                    player.bd.timeInCurrentAD = 0;
                    return;
                }

                saveBPStatistics();

                resetAD();
                
                player.bd.points = player.bd.points.plus(tmp.bd.points.gain);
                player.bd.lowestTime = Math.min(player.bd.lowestTime, player.bd.timeInCurrentAD);
                player.bd.timeInCurrentAD = 0;
                player.bd.power = hasUpgrade('bd', 'keep50OnReset') ? player.bd.power.times(0.5) : new Decimal(0);
            },
            style() {
                let bColor = {};
                if(hasChallenge('infinity', 41)) bColor = { 'border-color': '#63b8ff' };
                return { ...{ 'font-size': '10px', width: '316px', 'margin-bottom': '8px' }, ...bColor };
            }
        }
    },

    buyables: {
        1: {
            display() {
                return `Increase the booster power gain by +50%.
                Currently ${__(this.effect(),2,0)}/sec.
                
                Cost: ${__(this.cost(),2,0)} BP`
            },
            cost() {
                return Decimal.pow(2, getBuyableAmount(this.layer, this.id))
                .times(tmp.bd.upgrades.cheaperBuyables.effect)
                .times(tmp.infinity.buyables[3].effect)
            },
            effect() { return new Decimal(0.001).times(Decimal.pow(1.5, getBuyableAmount(this.layer, this.id))); },
            canAfford() { 
                if(inChallenge('infinity', 41) && (player.bd.c_41_boughtUpgrades.indexOf(this.id) === -1 && player.bd.c_41_boughtUpgrades.length >= 2)) {
                    return false;
                }
                return player.bd.points.gte(this.cost());
            },
            buy() {
                if(!this.canAfford()) return;
                player.bd.points = player.bd.points.minus(this.cost());
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1));
                if(inChallenge('infinity', 41) && player.bd.c_41_boughtUpgrades.indexOf(this.id) === -1) player.bd.c_41_boughtUpgrades.push(this.id);
            },
            style() { return { width: '150px', height: '150px', margin: '8px' } }
        },
        2: {
            display() { 
                return `Increase the booster power cap by 4.
                Currently ${__(this.effect(),2,0)}.
                
                ${hasMilestone('bd', 5) ? 'Disabled<br>(best time < 0:01)' : `Cost: ${__(this.cost(),2,0)} BP`}`
            },
            cost() {
                return Decimal.pow(3, getBuyableAmount(this.layer, this.id))
                .times(tmp.bd.upgrades.cheaperBuyables.effect)
                .times(tmp.infinity.buyables[3].effect)
            },
            effect() {
                return new Decimal(2.0)
                    .plus(
                        Decimal.times(
                            4,
                            getBuyableAmount(this.layer, this.id)
                        )
                    ).times(hasMilestone('bd', 3) ? 10 : 1)
                },
            canAfford() {
                if(hasMilestone('bd', 5)) return false; 
                if(inChallenge('infinity', 41) && (player.bd.c_41_boughtUpgrades.indexOf(this.id) === -1 && player.bd.c_41_boughtUpgrades.length >= 2)) {
                    return false;
                }
                return player.bd.points.gte(this.cost());
            },
            buy() {
                if(!this.canAfford()) return;
                player.bd.points = player.bd.points.minus(this.cost());
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1));
                if(inChallenge('infinity', 41) && player.bd.c_41_boughtUpgrades.indexOf(this.id) === -1) player.bd.c_41_boughtUpgrades.push(this.id);
            },
            style() { return { width: '150px', height: '150px', margin: '8px' } }
        },
        3: {
            display() { 
                return `Double the booster point gain per ${inChallenge('infinity', 22) ? '1st' : '8th'} dimensions.
                Currently ${__(this.effect(),2,1)} per 10 ${inChallenge('infinity', 22) ? '1st' : '8th'}.
                
                Cost: ${__(this.cost(),2,0)} BP`
            },
            cost() {
                return Decimal.pow(10, getBuyableAmount(this.layer, this.id))
                .times(tmp.bd.upgrades.cheaperBuyables.effect)
                .times(tmp.infinity.buyables[3].effect)
            },
            effect() { return Decimal.pow(2, getBuyableAmount(this.layer, this.id)); },
            canAfford() {
                if(inChallenge('infinity', 41) && (player.bd.c_41_boughtUpgrades.indexOf(this.id) === -1 && player.bd.c_41_boughtUpgrades.length >= 2)) {
                    return false;
                }
                return player.bd.points.gte(this.cost());
            },
            buy() {
                if(!this.canAfford()) return;
                player.bd.points = player.bd.points.minus(this.cost());
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1));
                if(inChallenge('infinity', 41) && player.bd.c_41_boughtUpgrades.indexOf(this.id) === -1) player.bd.c_41_boughtUpgrades.push(this.id);
            },
            style() { return { width: '150px', height: '150px', margin: '8px' } }
        },
        4: {
            display() { 
                return `Increase the booster multiplier effectiveness by +35%.
                Currently x * ${__(this.effect(),2,0)}.
                
                Cost: ${__(this.cost(),2,0)} BP`
            },
            cost() {
                return Decimal.pow(5, getBuyableAmount(this.layer, this.id))
                .times(tmp.bd.upgrades.cheaperBuyables.effect)
                .times(tmp.infinity.buyables[3].effect)
            },
            effect() { return Decimal.pow(1.35, getBuyableAmount(this.layer, this.id)); },
            canAfford() {
                if(inChallenge('infinity', 41) && (player.bd.c_41_boughtUpgrades.indexOf(this.id) === -1 && player.bd.c_41_boughtUpgrades.length >= 2)) {
                    return false;
                }
                return player.bd.points.gte(this.cost());
            },
            buy() {
                if(!this.canAfford()) return;
                player.bd.points = player.bd.points.minus(this.cost());
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1));
                if(inChallenge('infinity', 41) && player.bd.c_41_boughtUpgrades.indexOf(this.id) === -1) player.bd.c_41_boughtUpgrades.push(this.id);
            },
            style() { return { width: '150px', height: '150px', margin: '8px' } }
        },
        5: {
            display() {
                return `Gain +5% of your BP gain per second.
                Currently +${__(getBuyableAmount(this.layer, this.id).times(5),2,0)}%
                (${__(this.effect(),2,0)} / sec).
                
                Cost: ${__(this.cost(),2,0)} BP`
            },
            cost() {
                return Decimal.pow(25, getBuyableAmount(this.layer, this.id))
                .times(tmp.bd.upgrades.cheaperBuyables.effect)
                .times(tmp.infinity.buyables[3].effect)
            },
            effect() { return new Decimal(0.05).times(getBuyableAmount(this.layer, this.id)).times(tmp.bd.points.gain) },
            canAfford() {
                if(inChallenge('infinity', 41) && (player.bd.c_41_boughtUpgrades.indexOf(this.id) === -1 && player.bd.c_41_boughtUpgrades.length >= 2)) {
                    return false;
                }
                return player.bd.points.gte(this.cost());
            },
            unlocked() { return inChallenge('infinity', 41) || hasUpgrade(this.layer, 'cheaperBuyables') },
            buy() {
                if(!this.canAfford()) return;
                player.bd.points = player.bd.points.minus(this.cost());
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1));
                if(inChallenge('infinity', 41) && player.bd.c_41_boughtUpgrades.indexOf(this.id) === -1) player.bd.c_41_boughtUpgrades.push(this.id);
            },
            style() { return { width: '150px', height: '150px', margin: '8px' } }
        },
        6: {
            display() {
                return `x10 to Booster Power.
                Multiplicative.
                Currently x${__(Decimal.pow(10, getBuyableAmount(this.layer, this.id)), 2, 0)}.
                
                Cost: ${__(this.cost(),2,0)} BP`
            },
            cost() {
                return Decimal.pow(100, getBuyableAmount(this.layer, this.id))
                .times(tmp.bd.upgrades.cheaperBuyables.effect)
                .times(tmp.infinity.buyables[3].effect)
            },
            effect() { return Decimal.pow(10, getBuyableAmount(this.layer, this.id))},
            canAfford() {
                if(inChallenge('infinity', 41) && (player.bd.c_41_boughtUpgrades.indexOf(this.id) === -1 && player.bd.c_41_boughtUpgrades.length >= 2)) {
                    return false;
                }
                return player.bd.points.gte(this.cost());
            },
            unlocked() { return inChallenge('infinity', 41) || hasUpgrade(this.layer, 'cheaperBuyables') },
            buy() {
                if(!this.canAfford()) return;
                player.bd.points = player.bd.points.minus(this.cost());
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).plus(1));
                if(inChallenge('infinity', 41) && player.bd.c_41_boughtUpgrades.indexOf(this.id) === -1) player.bd.c_41_boughtUpgrades.push(this.id);
            },
            style() { return { width: '150px', height: '150px', margin: '8px' } }
        }
    },

    upgrades: {
        reducePenal: {
            description: `Reduce the power scaling penalty.<br>
            x/((power - cap)<sup>10</sup>) -> <br>
            x/((power - cap)<sup>2</sup>)`,
            cost() { return hasUpgrade('infinity', 'freeBoosterUpgrades') ? 0 : new Decimal(100) },
            style() { return { height: '100px' } }
        },
        keep50OnReset: {
            description: 'Keep 50% of your Booster Power on reset.',
            cost() { return hasUpgrade('infinity', 'freeBoosterUpgrades') ? 0 : new Decimal(250) },
            style() { return { height: '100px' } }
        },
        reducePenal2: {
            description: `Reduce the power scaling penalty even more.<br>
            x/((power - cap)<sup>2</sup>) -> <br>
            x/(√(power - cap))`,
            cost() { return hasUpgrade('infinity', 'freeBoosterUpgrades') ? 0 : new Decimal(1000) },
            canAfford() { return hasUpgrade(this.layer, 'reducePenal') },
            style() { return { height: '100px' } }
        },
        log10boost: {
            description() { return `BPS gains a multiplier <i>after</i> the scaling nerf based on the log10 of your current BP.<br>
            Currently: ${__(this.effect(),2)}x` },
            cost() { return hasUpgrade('infinity', 'freeBoosterUpgrades') ? 0 : new Decimal(2500) },
            effect() { return hasUpgrade(this.layer, this.id) ? Decimal.plus(1, Decimal.log10(Decimal.max(1, player.bd.points))) : new Decimal(1); },
            style() { return { height: '100px' } }
        },
        gain10times: {
            description() { return `Gain 10x as much BP per ${inChallenge('infinity', 22) ? '1st' : '8th'} dimensions.` },
            cost() { return hasUpgrade('infinity', 'freeBoosterUpgrades') ? 0 : new Decimal(3500) },
            style() { return { height: '100px' } }
        },
        log100boost: {
            description() { return `BPS gains a multiplier <i>after</i> the scaling nerf based on the log100 of your current multiplier.<br>
            Currently: ${__(this.effect(),2)}x` },
            cost() { return hasUpgrade('infinity', 'freeBoosterUpgrades') ? 0 : new Decimal(50000) },
            effect() { return hasUpgrade(this.layer, this.id) ? Decimal.plus(1, Decimal.log(tmp.bd.power.multiplier, 100)) : new Decimal(1); },
            style() { return { height: '100px' } }
        },
        cheaperBuyables: {
            description() { return `All buyables are 1,000x cheaper, and unlock a new one.` },
            cost() { return hasUpgrade('infinity', 'freeBoosterUpgrades') ? 0 : new Decimal(1e6) },
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
            cost() { return hasUpgrade('infinity', 'freeBoosterUpgrades') ? 0 : new Decimal(10) },
            style() { return { height: '100px' } }
        },
        'keep-2': {
            description: 'Keep the second Dimension Shift on reset.',
            cost() { return hasUpgrade('infinity', 'freeBoosterUpgrades') ? 0 : new Decimal(1e2) },
            canAfford() { return hasUpgrade(this.layer, 'keep-1'); },
            style() { return { height: '100px' } }
        },
        'keep-3': {
            description: 'Keep the third Dimension Shift on reset.',
            cost() { return hasUpgrade('infinity', 'freeBoosterUpgrades') ? 0 : new Decimal(1e3) },
            canAfford() { return hasUpgrade(this.layer, 'keep-2'); },
            style() { return { height: '100px' } }
        },
        'keep-4': {
            description: 'Keep all Dimension Shifts on reset.',
            cost() { return hasUpgrade('infinity', 'freeBoosterUpgrades') ? 0 : new Decimal(1e4) },
            canAfford() { return hasUpgrade(this.layer, 'keep-3'); },
            style() { return { height: '100px' } }
        },
        'adim-m': {
            description() { return `Dimensional Autobuyers will now buy max.${hasUpgrade('infinity', 'keepBuyMax') ? '<br>Bought (Infinity Study 1)' : ''}`},
            cost() { return hasUpgrade('infinity', 'freeBoosterUpgrades') ? 0 : new Decimal(75) },
            canAfford() { return !hasUpgrade('infinity', 'keepBuyMax') },
            style() {
                if(hasUpgrade('infinity', 'keepBuyMax')) return { height: '100px', 'border-color': '#4ABB5F', 'background-color': '#357541 !important' }
                return { height: '100px' }
            }
        }
    },

    hotkeys: [
        {
            key: 'b',
            description: 'b: Gain BP',
            onPress() {
                clickClickable(this.layer, 'gain');
            }
        }
    ]
});

function saveBPStatistics() {
    const statistics = {
        gain: tmp.bd.points.gain,
        time: TIME(player.bd.timeInCurrentAD),
        bps: tmp.bd.points.perSecond,
        power: player.bd.power,
        multiplier: tmp.bd.power.multiplier
    };

    player.bd.boosterStats = [].concat([statistics], player.bd.boosterStats.slice(0, player.bd.boosterStats.length - 1));
}

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