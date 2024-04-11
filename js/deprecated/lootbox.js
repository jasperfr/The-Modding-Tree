function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const lootboxes = [
    {
        label: 'Ruin! x0.5 antimatter!',
        color: 'red',
        rarity: 'grey',
        effect: ['antimatter', 0.5]
    },
    {
        label: 'Gain x2 antimatter.',
        color: '#992c2c',
        rarity: 'white',
        effect: ['antimatter', 2]
    },
    {
        label: 'Gain x2 antimatter.',
        color: '#992c2c',
        rarity: 'white',
        effect: ['antimatter', 2]
    },
    {
        label: 'Gain x2 antimatter.',
        color: '#992c2c',
        rarity: 'white',
        effect: ['antimatter', 2]
    },
    {
        label: 'Gain x2 antimatter.',
        color: '#992c2c',
        rarity: 'white',
        effect: ['antimatter', 2]
    },
    {
        label: 'Gain x2 antimatter.',
        color: '#992c2c',
        rarity: 'white',
        effect: ['antimatter', 2]
    },
    {
        label: 'Gain x5 antimatter.',
        color: '#992c2c',
        rarity: 'silver',
        effect: ['antimatter', 5]
    },
    {
        label: 'Gain x5 antimatter.',
        color: '#992c2c',
        rarity: 'silver',
        effect: ['antimatter', 5]
    },
    {
        label: 'Gain x10 antimatter.',
        color: '#992c2c',
        rarity: 'yellow',
        effect: ['antimatter', 10]
    },
    {
        label: 'JACKPOT! ANTIMATTER x1000 !!!',
        color: 'aqua',
        rarity: 'aqua',
        effect: ['antimatter', 1000]
    },
    {
        label: 'Ruin! x0.1 BP!',
        color: 'red',
        rarity: 'grey',
        effect: ['BP', 0.1]
    },
    {
        label: 'Gain x2 BP.',
        color: '#63b8ff',
        rarity: 'white',
        effect: ['BP', 2]
    },
    {
        label: 'Gain x2 BP.',
        color: '#63b8ff',
        rarity: 'white',
        effect: ['BP', 2]
    },
    {
        label: 'Gain x2 BP.',
        color: '#63b8ff',
        rarity: 'white',
        effect: ['BP', 2]
    },
    {
        label: 'Gain x2 BP.',
        color: '#63b8ff',
        rarity: 'white',
        effect: ['BP', 2]
    },
    {
        label: 'Gain x2 BP.',
        color: '#63b8ff',
        rarity: 'white',
        effect: ['BP', 2]
    },
    {
        label: 'Gain x5 BP.',
        color: '#63b8ff',
        rarity: 'silver',
        effect: ['BP', 5]
    },
    {
        label: 'Gain x5 BP.',
        color: '#63b8ff',
        rarity: 'silver',
        effect: ['BP', 5]
    },
    {
        label: 'Gain x10 BP.',
        color: '#63b8ff',
        rarity: 'yellow',
        effect: ['BP', 10]
    },
    {
        label: 'JACKPOT! BP x100 !!!',
        color: 'aqua',
        rarity: 'aqua',
        effect: ['BP', 100]
    },
    {
        label: 'Ruin! $ x0.5 !',
        color: 'red',
        rarity: 'red',
        effect: ['$', 0.5]
    },
    {
        label: '$$$ x2 !!!',
        color: 'lime',
        rarity: 'white',
        effect: ['$', 2]
    },
    {
        label: '$$$ x2 !!!',
        color: 'lime',
        rarity: 'white',
        effect: ['$', 2]
    },
    {
        label: '$$$ x2 !!!',
        color: 'lime',
        rarity: 'white',
        effect: ['$', 2]
    },
    {
        label: '$$$ x2 !!!',
        color: 'lime',
        rarity: 'white',
        effect: ['$', 2]
    },
    {
        label: '$$$ x2 !!!',
        color: 'lime',
        rarity: 'white',
        effect: ['$', 2]
    },
    {
        label: '$$$ x5 !!!',
        color: 'lime',
        rarity: 'silver',
        effect: ['$', 5]
    },
    {
        label: '$$$ x5 !!!',
        color: 'lime',
        rarity: 'silver',
        effect: ['$', 5]
    },
    {
        label: '$$$ x10 !!!',
        color: 'lime',
        rarity: 'yellow',
        effect: ['$', 10]
    },
    {
        label: 'JACKPOT! $$$ x100 !!!',
        color: 'aqua',
        rarity: 'aqua',
        effect: ['$', 100]
    },
    {
        label: 'You win a nothing!!!',
        color: 'red',
        rarity: 'white',
        effect: ['none', 0]
    },
    {
        label: 'You win a NaN!',
        color: 'yellow',
        rarity: 'white',
        effect: ['none', 0]
    },
    {
        label: 'BANKRUPT! Lose your antimatter!',
        color: 'grey',
        rarity: 'white',
        effect: ['none', 0]
    },
    {
        label: 'You win a cookie!',
        color: 'brown',
        effect: ['none', 0]
    },
];

function swapShift(array) {
    return [].concat(array.slice(1), array[0])
}

addLayer('$', {

    name: 'Lootboxes',
    symbol: '$',
    row: 'side',
    color: 'lime',
    resource: '$',

    layerShown() {
        return false;
    },

    startData() {
        return {
            points: new Decimal(0),
            upgrades: new Decimal(0),
            spinning: 'off',
            spinPtr: 0,
            lootboxArray: [],
            delay: 0,
            speed: 0,
            timer: 0,

            effects: {
                antimatter: new Decimal(1),
                BP: new Decimal(1),
                $: new Decimal(1),
                none: new Decimal(0),
            }
        }
    },

    gain() {
        return Decimal.times(0.1, player.$.effects.$);
    },

    update(tick) {
        player.$.points = player.$.points.plus(tmp.$.gain);

        if(player.$.spinning === 'spin') {
            player.$.timer += tick;
            if(player.$.timer > Decimal.minus(11, getBuyableAmount('$', 'fasterLoot').div(2))) {
                player.$.spinning = 'off'

                if(player.$.lootboxArray[2].label === 'BANKRUPT! Lose your antimatter!') {
                    player.points = new Decimal(0);
                }

                const effect = player.$.lootboxArray[2].effect;
                player.$.effects[effect[0]] = player.$.effects[effect[0]].times(effect[1])
            }
        }
        
        player.$.delay += tick;
        if(player.$.delay < player.$.speed) {
            return;
        } else {
            player.$.delay = 0;
            player.$.speed += 0.001;
        }
        
        if(player.$.spinning === 'trigger') {
            player.$.lootboxArray = shuffleArray(lootboxes.slice());
            player.$.spinning = 'spin'
            player.$.timer = 0;
            player.$.speed = 0;
        }

        if(player.$.spinning === 'spin') {
            // Render lootboxes
            const lootboxNorth = document.querySelector('.lootbox-n');
            const lootboxNorthCenter = document.querySelector('.lootbox-nc');
            const lootboxCenter = document.querySelector('.lootbox-c');
            const lootboxCenterSouth = document.querySelector('.lootbox-cs');
            const lootboxSouth = document.querySelector('.lootbox-s');
            if(!lootboxNorth) return; // tab hidden

            const arr = player.$.lootboxArray;
            lootboxNorth.innerText = arr[0].label;
            lootboxNorth.style.borderColor = arr[0].color;
            lootboxNorth.style.color = arr[0].rarity;

            lootboxNorthCenter.innerText = arr[1].label;
            lootboxNorthCenter.style.borderColor = arr[1].color;
            lootboxNorthCenter.style.color = arr[1].rarity;

            lootboxCenter.innerText = arr[2].label;
            lootboxCenter.style.borderColor = arr[2].color;
            lootboxCenter.style.color = arr[2].rarity;

            lootboxCenterSouth.innerText = arr[3].label;
            lootboxCenterSouth.style.borderColor = arr[3].color;
            lootboxCenterSouth.style.color = arr[3].rarity;

            lootboxSouth.innerText = arr[4].label;
            lootboxSouth.style.borderColor = arr[4].color;
            lootboxSouth.style.color = arr[4].rarity;

            player.$.lootboxArray = swapShift(player.$.lootboxArray);
        }
    },

    tabFormat: [
        ['display-text', function() {
            const self = player[this.layer];
            const temp = tmp[this.layer];
            return `
                <tt>You have $<cash>${__(self.points,2,0)}</cash>.</tt><br>
                You are gaining $<cash>${__(temp.gain,2,0)}</cash>/second.
            `
        }, { 'color': 'silver', 'font-size': '12px' }],
        'blank',
        ['clickable', 'buyLootbox'],
        'blank',
        ['row', [
            ['column', [
                ['raw-html', '<div class="lootbox lootbox-n"></div>'],
                ['raw-html', '<div class="lootbox lootbox-nc"></div>'],
                ['raw-html', '<div class="lootbox lootbox-c"></div>'],
                ['raw-html', '<div class="lootbox lootbox-cs"></div>'],
                ['raw-html', '<div class="lootbox lootbox-s"></div>']
            ]],
        ]],
        'blank',
        ['row', [
            ['buyable', 'fasterLoot']
        ]],
        'blank',
        ['display-text', function() {
            const self = player[this.layer];
            const temp = tmp[this.layer];
            return `
                <tt><rainbow>Current bonuses:</rainbow></tt> <br>
                <rainbow>${__(self.effects.antimatter,2,0)}x to Antimatter Dimensions!</rainbow> <br>
                <rainbow>${__(self.effects.BP,2,0)}x to Booster Points!</rainbow> <br>
                <rainbow>${__(self.effects.$,2,0)}x to cash payout!</rainbow> <br>
            `
        }, { 'color': 'silver', 'font-size': '12px' }],
    ],

    clickables: {
        buyLootbox: {
            display() { return `Buy a lootbox for $100.` },
            canClick() { return player.$.spinning === 'off' && player.$.points.gte(100); },
            onClick() {
                player.$.points = player.$.points.minus(100);
                player.$.spinning = 'trigger';
            },
            style() { return {
                'font-size': '14pt',
                width: '316px',
                'margin-bottom': '8px',
                height: '100px'
            } }
        }
    },

    buyables: {
        fasterLoot: {
            cost(x) { return Decimal.pow(10, Decimal.plus(3, x)) },
            display() { return `Spin the wheel faster! (${getBuyableAmount('$', 'fasterLoot').toNumber()}/20)<br>Cost: ${mixedStandardFormat(this.cost(), 2, true)}` },
            canAfford() { return player.$.points.gte(this.cost()) },
            buy() {
                player.$.points = player.$.points.sub(this.cost());
                setBuyableAmount('$', 'fasterLoot', getBuyableAmount('$', 'fasterLoot').add(1))
            },
            style() { return { fontSize: '14pt', 'width': '200px', 'height': '200px', 'background-color': this.canAfford() ? '#357541 !important' : '' } }
        }
    }
})