addLayer('debug', {
    row: 'side',
    symbol:'D',
    tooltip() { return 'Debugging' },

    // Snooping as usual, I see?
    layerShown() {
        const query = window.location.search;
        const params = new URLSearchParams(query);
        const hotel = params.get('hotel');
        return hotel === 'trivago';
    },

    tabFormat: [
        ['display-text', '<h1>God Mode</h1>'],
        ['display-text', 'Hey! You\'re not supposed to be here.<br>This section is for debugging purposes.'],
        ['display-text', 'if you post this on the discord server i will break your kneecaps', { 'font-size': '8px' }],
        'blank',
        'clickables'
    ],

    clickables: {
        11: {
            title: 'Gain 1e100 AM',
            canClick() { return true },
            style: { 'margin-bottom': '10px', 'height': '80px' },
            onClick() {
                player.points = player.points.plus(1e100);
            }
        },
        12: {
            title: 'Get 4 dimboosts',
            canClick() { return true },
            style: { 'margin-bottom': '10px', 'height': '80px' },
            onClick() {
                player.ad.shifts = 4;
            }
        },
        21: {
            title: '+100 8th ADs',
            canClick() { return true },
            style: { 'margin-bottom': '10px', 'height': '80px' },
            onClick() {
                player.ad.dimensions[7] = player.ad.dimensions[7].plus(100);
            }
        },
        22: {
            title: 'Skip to Booster Layer, +10BP',
            canClick() { return true },
            style: { 'margin-bottom': '10px', 'height': '80px' },
            onClick() {
                player.points = new Decimal(10);
                player.bd.points = player.bd.points.plus(10);
                player.bd.unlocked = true;
                layerDataReset('ad', ['upgrades']);
            }
        },
        31: {
            title: '+100BP',
            canClick() { return true },
            style: { 'margin-bottom': '10px', 'height': '80px' },
            onClick() {
                player.bd.points = player.bd.points.plus(100);
            }
        },
        32: {
            title: 'Unlock the galaxy layer',
            canClick() { return true },
            style: { 'margin-bottom': '10px', 'height': '80px' },
            onClick() {
                player.g.unlocked = true;
            }
        },
        41: {
            title: '+1 GP',
            canClick() { return true },
            style: { 'margin-bottom': '10px', 'height': '80px' },
            onClick() {
                player.g.points = player.g.points.plus(1);
            }
        }
    }
})