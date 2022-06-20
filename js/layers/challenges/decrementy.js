addLayer('d', {

    /* === Base information === */
    name: 'Decrementy',
    symbol: '',
    color: '#444',
    tooltip: 'Decrementy',
    branches: ['ad'],

    baseResource: 'decrementy',

    nodeStyle: {
        'color': 'white',
        'background-image': 'url("resources/decrementy.gif")',
        'background-position': 'center center',
        'background-size': '100%',
        'border': '1px solid white'
    },

    startData() {
        return {
            points: new Decimal(0)
        }
    },

    update(tick) {
        const self = player.d;
        if(!inChallenge('infinity', 51)) {
            self.points = new Decimal(0);
            return;
        }

        self.points = self.points.plus(tmp.d.decrementy.gain.times(tick));
    },

    layerShown() {
        return inChallenge('infinity', 51);
    },

    decrementy: {
        raise() {
            let challengeCompletions = sumValues(player.infinity.challenges).toNumber();
            let raise = Decimal.pow(10, 10 / (challengeCompletions + 1));
            return raise;
        },
        gain() {
            if(player.d.points.gte('1.79e308')) {
                return Decimal.pow(player.d.points, 1.01);
            }
            return Decimal.times(Decimal.plus(1, player.d.points), tmp.d.decrementy.raise);
        },
        effectAD() {
            let log = Decimal.max(1, Decimal.log10(player.d.points));
            return Decimal.min(1, Decimal.divide(1, Decimal.plus(1, log)));
        },
        effectB() {
            let log = Decimal.max(1, Decimal.sqrt(Decimal.plus(10, player.d.points)).pow(0.062));
            return Decimal.min(1, Decimal.divide(1, Decimal.plus(1, log)));
        },
        effectG() {
            let log = Decimal.max(1, Decimal.ssqrt(Decimal.plus(1, Decimal.log10(player.d.points.plus(1)))));
            return Decimal.min(1, Decimal.divide(1, Decimal.plus(1, log)));
        }
    },

    tabFormat: [
        ['display-text', function() { return `There is <d>${__(player.d.points,3,1)}</d> decrementy.`}],
        ['display-text', function() { return `This nerfs <b>all</b> ADs by x<d>${tmp.d.decrementy.effectAD.toFixed(3)}</d>.`}],
        ['display-text', function() { return `This nerfs Booster Power by x<d>${tmp.d.decrementy.effectB.toFixed(3)}</d>.`}],
        ['display-text', function() { return `This nerfs Star Power by x<d>${tmp.d.decrementy.effectG.toFixed(3)}</d>.`}],
        'blank',
        ['display-text', function() { return `Your ${sumValues(player.infinity.challenges).toNumber()} Challenge completions nerf the pre-1.79e308 Decrementy gain.` }],
        ['display-text', function() { return `<d>D*1e+10</d> -> <d>D*${tmp.d.decrementy.raise.toExponential(2)}</d>` }],
        ['display-text', `Decrementy explodes after <d>1.79e308</d> Decrementy.`],
        ['display-text', function() { return `You gain <d>${__(tmp.d.decrementy.gain,3,1)}</d> Decrementy per second.`}],
        'blank',
        ['clickable', 'restart']
    ],

    clickables: {
        restart: {
            display() {
                return 'Restart the challenge.'
            },
            canClick() {
                return player.d.points.gte('1.79e308');
            },
            onClick() {
                resetAD();
                resetBD();
                resetG();
                resetPoints();
                layerDataReset('d');
            },
            style() {
                return {
                    height: '120px'
                }
            }
        }
    }
});