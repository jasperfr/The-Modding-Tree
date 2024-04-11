addLayer('ch', {

    name: 'Chroma',
    symbol: 'C',
    color: '#222',
    resource: 'Chromatic Shards',
    branches: ['bd'],

    baseResource: 'IP',
    baseAmount() { return player.infinity.points; },
    requires: new Decimal(1),
    exponent: 1,
    type: 'normal',

    gainMult() { return new Decimal(1); },
    gainExp() { return new Decimal(1); },

    nodeStyle() {
        return {
            'animation': 'colorbg 20s linear infinite'
        }
    },

    componentStyles: {
        'prestige-button'() { return {
            'border-radius': '2px',
            'border': '2px solid #992c2c',
            'background': '#222',
            'color': '#fff',
        }}
    },

    startData() { return {                  
        unlocked: true,                     
        points: new Decimal(0),
        colors: { red: new Decimal(0), green: new Decimal(0), blue: new Decimal(0) },
        producing: 'red',
        next: 'green'
    }},

    gain() {
        return player[this.layer].points.div(10);
    },

    effect: {
        red() {
            let amount = player.ch.colors.red;
            if(amount.eq(0)) return new Decimal(1);
            return Decimal.max(Decimal.log10(amount), 0).div(1000).plus(1);
        },
        green() {
            let amount = player.ch.colors.green;
            if(amount.eq(0)) return new Decimal(1);
            return Decimal.max(Decimal.log(amount, 4), 0).div(2).plus(1);
        },
        blue() {
            let amount = player.ch.colors.blue;
            if(amount.eq(0)) return new Decimal(1);
            return Decimal.max(Decimal.log(amount, 1000), 0).plus(1);
        }
    },

    update(delta) {
        const self = player[this.layer];
        const temp = tmp[this.layer];
        self.colors.red = self.colors.red.plus(temp.gain.times(delta));
    },

    clickables: {
        'produce-red': {
            display: 'Produce next',
            canClick() { return true; },
            onClick() { player[this.layer].next = 'red' },
            style: function() { return { width: '100px', 'background-color': '#0002 !important', 'border-color': '#FFF8 !important' }}
        },
        
        'produce-green': {
            display: 'Produce next',
            canClick() { return true; },
            onClick() { player[this.layer].next = 'green' },
            style: function() { return { width: '100px', 'background-color': '#0002 !important', 'border-color': '#FFF8 !important' }}
        },
        
        'produce-blue': {
            display: 'Produce next',
            canClick() { return true; },
            onClick() { player[this.layer].next = 'blue' },
            style: function() { return { width: '100px', 'background-color': '#0002 !important', 'border-color': '#FFF8 !important' }}
        }
    },

    tabFormat: [
        ['raw-html', function() { return `<h>You have <ch>${__(player[this.layer].points, 3, 1)}</ch> Chromatic Shards.</h>`; }],
        'blank',
        "prestige-button",
        'blank',
        ['raw-html', function() { let c = player[this.layer].producing; let n = player[this.layer].next; return  `
            Colored Shards are gained based on your total Chromatic Shards. <br>
            Currently, you are gaining ${__(temp[this.layer].gain, 3, 0)} <${c}>${c}</${c}> shards per second. <br>
            You will produce ${__(temp[this.layer].gain, 3, 0)} <${n}>${n}</${n}> shards on next gain.`
        }],
        'blank',
        ['column', [
            ['raw-html', function() { return `<h3>Red</h3>
                <p>You have ${__(player[this.layer].colors.red, 3, 1)} Red Shards. <br>
                They are raising all Antimatter Dimension multipliers by ^${__(temp[this.layer].effect.red, 6, 0)}.
                </p>`; }
            ],
            'blank',
            ['clickable', 'produce-red']
        ], {
            'display': 'block',
            'width': '100%',
            'color': '#FF8080',
            'background-color': '#FE000080',
            'padding': '10pt 0'
        }],

        ['column', [
            ['raw-html', function() { return `<h3>Green</h3>
                <p>You have ${__(player[this.layer].colors.green, 3, 1)} Green Shards. <br>
                They are raising the Booster Power multiplier by *${__(temp[this.layer].effect.green, 6, 0)}.
                </p>`; }
            ],
            'blank',
            ['clickable', 'produce-green']
        ], {
            'display': 'block',
            'width': '100%',
            'color': '#80FF80',
            'background-color': '#00FE0080',
            'padding': '10pt 0'
        }],

        ['column', [
            ['raw-html', function() { return `<h3>Blue</h3>
                <p>You have ${__(player[this.layer].colors.blue, 3, 1)} Blue Shards. <br>
                They are raising Star Power by +${__(temp[this.layer].effect.blue, 6, 0)}.
                </p>`; }
            ],
            'blank',
            ['clickable', 'produce-blue']
        ], {
            'display': 'block',
            'width': '100%',
            'color': '#8080FF',
            'background-color': '#0000FE80',
            'padding': '10pt 0'
        }]
    ]

});
