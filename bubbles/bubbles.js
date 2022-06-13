import canvasSketch from 'canvas-sketch';
import random from 'canvas-sketch-util/random';
import getCoords from '../utils/getCoords';
import getPalette from '../utils/getPalette';

const settings = {
    dimensions: [ 2048, 2048 ], // a4, a3
    // units: 'px', // cm, px, in
    // pixelsPerInch: 300, // 300 - main for printing
    // : 'portrait',
};
const canvasSettings = {
    margin: 150,
    colorCountMax: 6,
    colorCountMin: 2,
    gridSize: 50,
    background: 'white',
    withNoise: false,
    radiusSize: 10,
}

const sketch = () => {
    const { margin, colorCountMin, colorCountMax, gridSize, background, withNoise, radiusSize } = canvasSettings;
    const points = createGrid(gridSize, getPalette(colorCountMin, colorCountMax), withNoise, radiusSize).filter(() => random.value() > 0.6);

    return ({ context, width, height }) => {
        context.fillStyle = background;
        context.fillRect(0, 0, width, height);
        points.forEach(({position, radius, color }) => {
            const [x, y] = getCoords(position, width, height, margin);

            context.beginPath();
            context.arc(x, y, radius * width, 0, Math.PI * 2, false);
            context.fillStyle = color;
            context.lineWidth = 7;
            context.fill();
        })
    };
};

canvasSketch(sketch, settings);

function createGrid(count, palette, withNoise, radiusSize) {
    const points = [];
    for (let x = 0; x < count; x++) {
        for (let y = 0; y < count; y++) {
            const u = count <= 1 ? 0.5 : x / (count - 1);
            const v = count <= 1 ? 0.5 : y / (count - 1);

            const radius = withNoise
                ? Math.abs(random.noise2D(u, v) * 0.1)
                : Math.abs(0.01 + random.gaussian() * 0.01);
            points.push({
                color: random.pick(palette),
                radius,
                rotation: random.noise2D(u, v),
                position: [ u, v ],
            });
        }
    }
    return points;
}
