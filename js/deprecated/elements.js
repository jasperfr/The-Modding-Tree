addLayer('elements', {

    startData() {
        return {
            unlocked: false,
            points: new Decimal(0)
        }
    },

    bars: {
        percentageToInfinity: {
            direction: RIGHT,
            width: 500,
            height: 20,
            instant: true,
            display() {
                const percentage = Math.max(0, player.points.log10().divide(1024).times(100));
                return `${format(percentage)}% to Infinity`
            },
            progress() {
                return Math.max(0, player.points.log10().divide(1024))
            },
            fillStyle: { 'background-color': '#4ABB5F', }
        }
    }
});
