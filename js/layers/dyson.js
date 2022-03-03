addLayer('ds', {

    /* === Base information === */
    name: 'Dyson Sphere',
    symbol: 'DS',
    color: '#ebb734',
    tooltip: 'Dyson Sphere',
    baseResource: 'energy',

    /* === Data information === */
    startData() {
        return {
            generation: new Decimal(1337000),
            energy: new Decimal(0), // energy in KW/MW/GW etc... might change?
        }
    },

    // Stop it.
    layerShown() {
        const query = window.location.search;
        const params = new URLSearchParams(query);
        const hotel = params.get('gamesphere');
        return hotel === 'spherical';
    },

    update(delta) {
        player.ds.energy = player.ds.energy.plus(player.ds.generation.times(delta));
    },

    tabFormat: [
        ['display-text', function() { return  `Your Dyson Sphere produces <span style="color:#66d1ff;font-size:20px;font-weight:bold;text-shadow:0 0 8px #66d1ff;">${___(player.ds.generation, 2)}W</span>/s.`; }, { 'color': 'silver' }], 'blank',
        ['display-text', function() { return  `You have accumulated a total of <span style="color:#66d1ff;font-size:20px;font-weight:bold;text-shadow:0 0 8px #66d1ff;">${___(player.ds.energy, 2)}J</span>.`; }, { 'color': 'silver' }], 'blank',
        ['display-text', function() { return `With all this energy, Antimatter Dimensions are boosted by <span style="color:#ebb734;font-size:14px;font-weight:bold;">${1.29}</span>x!` }, { 'font-size': '12px', 'color': 'silver' }],
        ['display-text', function() { return `(multiplier = log10(energy))` }, { 'font-size': '12px', 'color': 'silver' }],
        'blank','blank','blank',
        ['raw-html',`<canvas width="500" height="500" id="dyson-sphere" style="border: 1px solid white; background-color: rgb(13, 13, 13);"></canvas>`]
    ]
});

const $ = function(e) { return document.querySelector(e); }
var xxx = 0;
const render = function() {
    xxx += 0.1;
    const star = $('.gxstar');
    if(star) {
        star.style.left = `${210 + Math.sin(xxx)}px`;
        star.style.top = `${210 + Math.cos(xxx)}px`;
    }
    requestAnimationFrame(render);
}

var canvas, ctx;

function renderPlanet(x, y, width, height, theta, phi, radius = 5, color = 'd1e0e8', orbit = true) {
    let px = x - sin(phi) * width;
    let py = y + cos(phi) * height;
    let p_x = cos(theta) * (px - x) - sin(theta) * (py - y) + x;
    let p_y = sin(theta) * (px - x) + cos(theta) * (py - y) + y;
    
    if(orbit) {
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.beginPath();
        ctx.ellipse(x, y, width, height, theta, 0, Math.PI * 2)
        ctx.stroke();
    }

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(p_x, p_y, radius, radius, 0, 0, Math.PI * 2)
    ctx.fill();
}

const renderDysonSphere = function(tick) {
    try {
        canvas = document.getElementById('dyson-sphere');
        ctx = canvas.getContext('2d');
    } catch(TypeError) {
        setTimeout(renderDysonSphere, 1000);
        return;
    };
    let i = tick / 10000;

    ctx.clearRect(0, 0, 500, 500);

    ctx.shadowBlur = 0;
    for(let q = 0; q < 500; q++) {
        let x = Math.sin(q) * 10000;
        let randx = (x - Math.floor(x)) * 500;
        let y = Math.sin(q) * 12345;
        let randy = (y - Math.floor(y)) * 500;
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.ellipse((i * 200 + randx) % 500, randy, 1, 1, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    // draw the sun
    ctx.fillStyle = '#ebb734';
        ctx.shadowColor = '#fada66';
        ctx.shadowBlur = 25;
        ctx.beginPath();
        ctx.ellipse(250, 250, 20, 20, 0, 0, Math.PI * 2)
        ctx.fill();
        ctx.shadowColor = 'none';
        ctx.shadowBlur = 0;

    // draw the dyson sphere
    ctx.fillStyle = 'rgba(127, 127, 127, 0.4)';
    ctx.beginPath();
    ctx.ellipse(250, 250, 100, 100, 0, 0, Math.PI * 2);
    ctx.fill();
    for(let j = 0; j < Math.PI * 2; j += Math.PI / 8) {
        ctx.strokeStyle = '#d1e0e8';
        ctx.beginPath();
        ctx.ellipse(250, 250, Math.abs(Math.sin(i + j) * 100), 100, 0, 0, Math.PI * 2);
        ctx.stroke();
    }
    for(let j = 0; j < Math.PI * 2; j += Math.PI / 8) {
        ctx.beginPath();
        ctx.ellipse(250, 250 + Math.sin(j) * 100, Math.abs(Math.cos(j) * 100), 1, 0, 0, Math.PI * 2);
        ctx.stroke();
    }

    renderPlanet(250, 250, 120, 25, -.2, i * 1.2 + 0.2, 6, '#69486b');
    renderPlanet(250, 250, 175, 50, 0.1, i, 6, '#594d38');
    renderPlanet(250, 250, 200, 50, 0, i * 2 + Math.PI, 6, '#5135cc');
    renderPlanet(250 + Math.sin(i * 30) * 10, 250 + Math.cos(i * 30) * 5, 200, 50, 0, i * 2 + Math.PI, 2, '#b9b7c4', false);
    renderPlanet(250, 250, 400, 100, 0.5, i * 2 + Math.PI, 10, '#97cccf');

    requestAnimationFrame(renderDysonSphere);
}

if(document.readyState !== 'loading') {
    requestAnimationFrame(renderDysonSphere);
} else {
    document.addEventListener('DOMContentLoaded', () => {
        canvas = document.getElementById('dyson');
        ctx = canvas.getContext('2d');
        requestAnimationFrame(renderDysonSphere);
    });
}