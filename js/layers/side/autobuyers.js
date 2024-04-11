const __auto = {
    header: ['column', [
        ['display-text', '<ta>Antimatter Autobuyers</ta>'],
        'blank',
    ]]
}

addLayer('auto', {
    row: 'side',
    symbol: '<h1 style="margin:0;line-height:32px;font-size:26pt">⚙</h1>',
    tooltip: 'Autobuyers',

    tabFormat: {
        'Antimatter': {
            content: [
                __auto.header,
                ['display-text', '<h3>Antimatter Dimensions</h3>'],
                'blank',
                function() {
                    const html = ['column', []];
                    for(let i = 1; i <= 8; i++) {
                        html[1].push(['row', [
                            ['autobuyer', [`${ORDINAL[i]} Dimension`, `autobuyer-dimension-${i}`, `autobuyer-toggle-dimension-${i}`]]
                        ]]);
                    }
                    return html;
                },
                'blank',
                ['display-text', '<h3>Upgrades</h3>'],
                'blank',
                ['autobuyer', ['Tickspeed', `autobuyer-tickspeed`, `autobuyer-toggle-tickspeed`]],
                ['autobuyer', ['Dimension Shift', `autobuyer-shift`, `autobuyer-toggle-shift`]],
                'blank'
            ]
        }
    },

    buyables: {
        'autobuyer-dimension-1': intervalAutobuyer('autobuyer-dimension-1', 1000, 2, 'autobuyer-toggle-dimension-1'),
        'autobuyer-dimension-2': intervalAutobuyer('autobuyer-dimension-2', 2000, 2, 'autobuyer-toggle-dimension-2'),
        'autobuyer-dimension-3': intervalAutobuyer('autobuyer-dimension-3', 4000, 2, 'autobuyer-toggle-dimension-3'),
        'autobuyer-dimension-4': intervalAutobuyer('autobuyer-dimension-4', 8000, 2, 'autobuyer-toggle-dimension-4'),
        'autobuyer-dimension-5': intervalAutobuyer('autobuyer-dimension-5', 16000, 2, 'autobuyer-toggle-dimension-5'),
        'autobuyer-dimension-6': intervalAutobuyer('autobuyer-dimension-6', 32000, 2, 'autobuyer-toggle-dimension-6'),
        'autobuyer-dimension-7': intervalAutobuyer('autobuyer-dimension-7', 64000, 2, 'autobuyer-toggle-dimension-7'),
        'autobuyer-dimension-8': intervalAutobuyer('autobuyer-dimension-8', 128000, 2, 'autobuyer-toggle-dimension-8'),

        'autobuyer-tickspeed': intervalAutobuyer('autobuyer-tickspeed', 256000, 2, 'autobuyer-toggle-tickspeed'),
        'autobuyer-shift': intervalAutobuyer('autobuyer-shift', 512000, 2, 'autobuyer-toggle-shift'),
    },

    clickables: {
        'autobuyer-toggle-dimension-1': toggleAutoBuyer(1e10, 'a', 'dimension-1'),
        'autobuyer-toggle-dimension-2': toggleAutoBuyer(1e20, 'a', 'dimension-2'),
        'autobuyer-toggle-dimension-3': toggleAutoBuyer(1e30, 'a', 'dimension-3'),
        'autobuyer-toggle-dimension-4': toggleAutoBuyer(1e40, 'a', 'dimension-4'),
        'autobuyer-toggle-dimension-5': toggleAutoBuyer(1e50, 'a', 'dimension-5'),
        'autobuyer-toggle-dimension-6': toggleAutoBuyer(1e60, 'a', 'dimension-6'),
        'autobuyer-toggle-dimension-7': toggleAutoBuyer(1e70, 'a', 'dimension-7'),
        'autobuyer-toggle-dimension-8': toggleAutoBuyer(1e80, 'a', 'dimension-8'),

        'autobuyer-toggle-tickspeed': toggleAutoBuyer(1e100, 'a', 'tickspeed'),
        'autobuyer-toggle-shift': toggleAutoBuyer(1e120, 'a', 'shift'),
    }
});

function toggleAutoBuyer(cost, otherLayer, otherId) {
    return {
        price: new Decimal(cost),

        canClick() {
            const state = getClickableState(this.layer, this.id);
            switch(state) {
                case 'Locked': return player.points.gte(this.price);
                default: return true;
            }
        },
        
        onClick() {
            const state = getClickableState(this.layer, this.id);
            switch(state) {
                case 'Locked':
                    player.points = player.points.sub(this.price);
                    setClickableState(this.layer, this.id, 'Enabled');
                    break;
                case 'Enabled': setClickableState(this.layer, this.id, 'Disabled'); break;
                case 'Disabled': setClickableState(this.layer, this.id, 'Enabled'); break;
            }
        },

        display() {
            if(!getClickableState(this.layer, this.id)) setClickableState(this.layer, this.id, 'Locked');
            const state = getClickableState(this.layer, this.id);

            switch(state) {
                case 'Locked': return `<h3>Cost: ${mixedStandardFormat(this.price)}</h3>`;
                case 'Enabled': return `<h3>Enabled</h3><h6>Click to disable.</h6>`;
                case 'Disabled': return `<h3>Disabled</h3><h6>Click to enable.</h6>`;
            }
        },

        style() {
            let borderColor = '';
            let backgroundImage = '';
            let animation = '';
            const state = getClickableState(this.layer, this.id);

            switch(state) {
                case 'Locked': break;
                case 'Enabled':
                    borderColor = '#c733cc !important';
                    backgroundImage = 'repeating-linear-gradient(-45deg, #332833, 10%, #222 10%, #222 20%)';
                    animation = 'ani-autobuyer-enabled 2000ms linear infinite';
                    break;
                case 'Disabled':
                    borderColor = 'orange !important';
                    backgroundImage = 'repeating-linear-gradient(-45deg, #423726, 10%, #222 10%, #222 20%)';
                    break;
            }
            
            return {
                'background-size': '200% 200%',
                'background-image': backgroundImage,
                'border-color': borderColor,
                'animation': animation,
                'margin-left': '4px',
                'height': '60px',
                'border-radius': '2px'
            }
        }
    }
}

function intervalAutobuyer(buyableName, startInterval, cost, toggleId) {
    return {
        price: new Decimal(cost),

        effect(x) {
            if(x === undefined) x = 0;
            return startInterval * (0.4 ** (x + getBuyableAmount(this.layer, this.id).toNumber()));
        },

        isMaxedOut() {
            return this.effect() < 0.1;
        },

        canAfford() {
            if(getClickableState(this.layer, toggleId) === 'Locked') return false;
            if(this.isMaxedOut()) return false;
            return player.b.points.gt(this.price)
        },

        display() {
            if(getClickableState(this.layer, toggleId) === 'Locked') {
                return `Buy Autobuyer to decrease interval.`;
            }
            return `40% smaller interval<br> ${__(this.effect(), 3, 0)}ms -> ${__(this.effect(1), 3, 0)}ms <br>Cost: ${mixedStandardFormat(this.price)} BP`
        },

        style() {
            return {
                'margin-left': '160px',
                'height': '60px',
                'border-radius': '2px'
            }
        }
    }
}

function antimatterDimensionAutobuyer(dimension, cost) {
    return {
        price: new Decimal(cost),
        display() {
            let label = ORDINAL[dimension] + ' Dimension';

            if(!getClickableState(this.layer, this.id)) setClickableState(this.layer, this.id, 'Locked');
            const state = getClickableState(this.layer, this.id);

            switch(state) {
                case 'Locked': return `<h3>${label} Autobuyer</h3><br><br><h3>Cost: ${mixedStandardFormat(this.price)}</h3>`;
                case 'Enabled': return `<h3>${label} Autobuyer</h3><br><br><h3>Enabled</h3><h6>Click to disable.</h6>`;
                case 'Disabled': return `<h3>${label} Autobuyer</h3><br><br><h3>Disabled</h3><h6>Click to enable.</h6>`;
            }
        },

        canClick() {
            const state = getClickableState(this.layer, this.id);
            switch(state) {
                case 'Locked': return player.points.gte(this.price);
                default: return true;
            }
        },

        onClick() {
            const state = getClickableState(this.layer, this.id);
            switch(state) {
                case 'Locked':
                    player.points = player.points.sub(this.price);
                    setClickableState(this.layer, this.id, 'Enabled');
                    break;
                case 'Enabled': setClickableState(this.layer, this.id, 'Disabled'); break;
                case 'Disabled': setClickableState(this.layer, this.id, 'Enabled'); break;
            }
        },

        style() {
            let borderColor = '';
            let backgroundImage = '';
            let animation = '';
            const state = getClickableState(this.layer, this.id);

            switch(state) {
                case 'Locked':
                    borderColor = '';
                    backgroundImage = this.canClick() ? 'linear-gradient(#30472e, #30472e)' : 'linear-gradient(#381f1f, #381f1f)';
                    break;
                case 'Enabled':
                    borderColor = '#c733cc !important';
                    backgroundImage = 'repeating-linear-gradient(-45deg, #332833, 10%, #222 10%, #222 20%)';
                    animation = 'ani-autobuyer-enabled 2000ms linear infinite';
                    break;
                case 'Disabled':
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
    }
}