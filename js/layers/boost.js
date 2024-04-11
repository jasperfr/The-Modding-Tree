const __bd = {
    header: ['column', [
        ['display-text', '<tb></tb><h1>Boost Power</h1>'],
        'blank',
        ['display-small', function() {
            const self = player.b;
            const temp = tmp.b;
            return `
                You have <bd>${__(self.points, 2, 1)}</bd> Boost Points.<br>
                You have <bd>${__(self.power, 2, 0)}</bd> Boost Power.<br>
                You are getting <bd>${__(temp.power.gain, 3)}</bd> Boost Power per second. ${temp.power.softcapped ? '<b>(softcapped)</b>' : ''} <br>
                This slows down exponentially after <bd>${__(temp.power.softcap, 2, 0)}</bd> power. <br>
                Your booster power multiplies all dimensions by <bd>${__(temp.power.effect, 1, 0)}</bd>x.<br>
                <span style="font-size: 8pt">The base booster power gain is based on your 8th dimensions.</span>
            `
        }],
        'blank'
    ]],
    footer: ['column', [
        'blank',
        ['clickable', 'gain']
    ]]
};

addLayer('b', {
    name: 'Boosters',
    symbol: 'B',
    color: '#63b8ff',
    tooltip: 'Boosters',

    resource: 'BP',

    layerShown() {
        return player.a.shifts === 4 || player[this.layer].points.gt(0);
    },

    startData() {
        return {
            unlocked: true,
            restart: false,
            points: new Decimal(0),
            power: new Decimal(0),
        }
    },

    update(delta) {
        const self = player[this.layer];
        const temp = tmp[this.layer];
        self.power = self.power.plus(
            temp.power.gain
            .times(delta)
        );
    },

    points: {
        gain() {
            if(player.a.dimensions[7].lt(20)) return new Decimal(0);
            return player.points.pow(0.025);
        }
    },

    power: {
        gain() {
            const multiplier = getBuyableAmount('b', 'gain-base');
            let base = player.a.dimensions[7].div(10);
            base = base.times(multiplier);
            if(this.softcapped()) {
                const over = Decimal.div(player.b.power, this.softcap());
                return base.div(over.pow(10));
            }
            return base;
        },

        softcapped() {
            return player.b.power.gt(this.softcap());
        },

        softcap() {
            return new Decimal(100)
        },

        effect() {
            return player.b.power.pow(0.5);
        }
    },

    tabFormat: {
        'Power': {
            content: [
                __bd.header,
                ['row', [['buyable', 'gain-base'], ['buyable', 'gain-power'], ['buyable', 'decrease-softcap']]],
                __bd.footer
            ]
        }
    },

    clickables: {
        gain: {
            canClick() {
                return tmp.b.points.gain.gt(0);
            },
            onClick() {
                player.points = new Decimal(10);
                layerDataReset('a');
                player[this.layer].points = player[this.layer].points.plus(tmp.b.points.gain);
                player.b.power = new Decimal(0);
            },
            display() {
                const bps = 0;
                return `Reset for ${__(tmp.b.points.gain,2,0)} BP.<br>(${bps} BP/sec)`;
            },
            style() {
                return {
                    'height': '60px'
                }
            }
        }
    },

    buyables: {
        'gain-base': {
            display() {
                return `Increase the base boost power per 8th dimensions by +0.01.<br>
                Cost: ${__(this.cost(), 2, 0)} BP`
            },
            cost(x) {
                return new Decimal(10).pow(x);
            },
            canAfford() { return player.b.points.gte(this.cost()); },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
            },
            style() {
                return { width: '150px', height: '100px', margin: '8px' }
            }
        },

        'gain-power': {
            display() {
                return `Increase boost power gain by 1.05x.<br>
                Cost: ${__(this.cost(), 2, 0)} BP`
            },
            cost() {
                return new Decimal(10)
            },
            style() {
                return { width: '150px', height: '100px', margin: '8px' }
            }
        },

        'decrease-softcap': {
            display() {
                return `Increase the softcap by x1.1. <br>
                Cost: ${__(this.cost(), 2, 0)} BP`
            },
            cost() {
                return new Decimal(10)
            },
            style() {
                return { width: '150px', height: '100px', margin: '8px' }
            }
        }
    }

});