const elements = {
    infinityPercentage: function() {
        return {
            direction: RIGHT,
            width: 500,
            height: 20,
            display() { return `${format(Math.max(0, player.points.log10().divide(1024).times(100)), 1)}% to Infinity (2e1024)` },
            progress() {
                return Math.max(0, player.points.log10().divide(1024))
            },
            fillStyle: { 'background-color': '#4ABB5F', }
        }
    },

    ipHeader: function() {
        let ip = player.infinity.points;
        let infinities = player.infinity.infinities;
        return ['column', [
            ['display-text', `You have <span style="color:orange;font-size:20px;font-weight:bold;">${mixedStandardFormat(ip)}</span> IP.`, { 'color': 'silver' }],
            ['display-text', `You have infinitied <span style="color:orange;font-size:20px;font-weight:bold;">${formatWhole(infinities)}</span> times.`, { 'color': 'silver', 'font-size': '12px' }],
        'blank',
        ]]
    }
}
