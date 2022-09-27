// hidden layer, only for style
addLayer('c_31_crunch', {
    tabFormat: [
        ['display-text', '<h1>The universe has exploded due to excess matter.</h1>'],
        'blank',
        ['row', [['clickable', 'restart'], 'blank', ['clickable', 'exit']]]
    ],

    update() {
        if(inChallenge('infinity', 32) && player.ad.matter.gte(new Decimal('1.79e308'))) {
            options.forceOneTab = true;
            player.points = new Decimal('0')
            showTab('c_31_crunch');
        }
    },

    clickables: {
        restart: {
            display() { return 'Restart Challenge' },
            canClick() { return true },
            onClick() {
                resetAD();
                resetBD();
                resetG();
                resetPoints();
                
                options.forceOneTab = false;
                showTab('ad');
            },
            style() {
                return {
                    width: '500px',
                    height: '200px',
                    border: '8px solid #45b0b0 !important',
                    'font-size': '48px'
                }
            }
        },
        exit: {
            display() { return 'Exit Challenge' },
            canClick() { return true },
            onClick() {
                resetAD();
                resetBD();
                resetG();
                resetPoints();

                options.forceOneTab = false;
                player.infinity.activeChallenge = null;
                showTab('ad');
            },
            style() {
                return {
                    width: '500px',
                    height: '200px',
                    border: '8px solid #45b0b0 !important',
                    'font-size': '48px'
                }
            }
        }
    }
})

addLayer('crunch', {
    tabFormat: [
        ['display-text', '<h1>The universe has collapsed due to excess antimatter.</h1>'],
        'blank',
        ['clickable', 'crunch']
    ],

    update() {
        if(hasUpgrade('infinity', 'breakInfinity')) return;
        if(
           (player.infinity.activeChallenge != null && player.points.gte(new Decimal('2e1024')))
        || (player.infinity.infinities.lte(10) && player.points.gte(new Decimal('2e1024')))
        ) {
            options.forceOneTab = true;
            player.points = new Decimal('2e1024')
            showTab('crunch');
        }
    },

    clickables: {
        'crunch': {
            display() { return inChallenge('infinity', 21) || inChallenge('infinity', 21) || inChallenge('infinity', 41) || inChallenge('infinity', 42) ? 'Complete Challenge' : 'Big Crunch' },
            canClick() { return true },
            onClick() {
                if(inChallenge('infinity', 21)) {
                    completeChallenge('infinity', 21);
                }
                if(inChallenge('infinity', 22)) {
                    completeChallenge('infinity', 22);
                }
                if(inChallenge('infinity', 41)) {
                    completeChallenge('infinity', 41);
                }
                if(inChallenge('infinity', 42)) {
                    completeChallenge('infinity', 42);
                }

                player.infinity.timeInCurrentInfinity = 0;
        
                if(player.infinity.activeChallenge == null) {
                    if(getClickableState('infinity', 'respecOnNextInfinity') === 'ON') {
                        player.infinity.studyPoints = tmp.infinity.maxStudyPoints;
                        player.infinity.upgrades = [];
                        buyUpgrade('infinity', 'unlockChallenges');
                        buyUpgrade('infinity', 'breakInfinity');
                    }
                }

                player.infinity.unlocked = true;
                player.infinity.points = player.infinity.points.plus(1);
                player.infinity.infinities = player.infinity.infinities.plus(1);
                resetAD();
                resetBD();
                resetG();

                player.points = new Decimal(100);
                
                options.forceOneTab = false;
                showTab('ad');
            },
            style() {
                return {
                    width: '500px',
                    height: '200px',
                    border: '8px solid orange !important',
                    'font-size': '72px'
                }
            }
        }
    }
});