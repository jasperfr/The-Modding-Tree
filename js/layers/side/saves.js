addLayer('saves', {
    row: 'side',
    symbol:'S',
    tooltip() { return 'Layer saves' },

    // Snooping as usual, I see?
    layerShown() {
        return false;
    },

    tabFormat: [
        ['display-text', '<h1>Layer Saves</h1>'],
        ['display-text', 'This section is for debugging purposes.'],
         'blank',
        'clickables'
    ],

    clickables: {
        11: {
            title: 'Skip to Booster Layer',
            canClick() { return true },
            style: { 'margin-bottom': '10px', 'height': '80px' },
            onClick() {
                player.bd.unlocked = true;
                resetAD();
                resetBD();
                resetG();
                resetPoints();
            }
        },
        21: {
            title: 'Skip to Galaxy Layer',
            canClick() { return true },
            style: { 'margin-bottom': '10px', 'height': '80px' },
            onClick() {
                player.bd.unlocked = true;
                player.g.unlocked = true;
                resetAD();
                resetBD();
                resetG();
                resetPoints();
            }
        },
        31: {
            title: 'Skip to Infinity Layer',
            canClick() { return true },
            style: { 'margin-bottom': '10px', 'height': '80px' },
            onClick() {
                player.bd.unlocked = true;
                player.g.unlocked = true;
                player.infinity.unlocked = true;
                resetAD();
                resetBD();
                resetG();
                resetPoints();
            }
        },
        41: {
            title: 'Complete all challenges and skip to Break Infinity',
            canClick() { return true },
            style: { 'margin-bottom': '10px', 'height': '80px' },
            onClick() {
                player.infinity.challenges[11] = 1;
                player.infinity.challenges[12] = 1;
                player.infinity.challenges[21] = 1;
                player.infinity.challenges[22] = 1;
                player.infinity.challenges[31] = 1;
                player.infinity.challenges[32] = 1;
                player.infinity.challenges[41] = 1;
                player.infinity.challenges[42] = 1;
                player.infinity.challenges[51] = 1;
                player.infinity.broken = true;
            }
        },
    }
})