const old = {

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
}