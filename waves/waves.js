import canvasSketch from 'canvas-sketch';
import random from 'canvas-sketch-util/random';
import getCoords from '../utils/getCoords';
import getPalette from "../utils/getPalette";

const settings = {
    dimensions: [ 2048, 2048 ], // a4, a3
};

const canvasSettings = {
    margin: 150,
    colorCountMax: 6,
    colorCountMin: 2,
    gridSize: 50,
    symbols: ['-', '=', '.'],
    background: 'white',
    fontFamily: "Helvetica"
}

const sketch = () => {
    const { margin, colorCountMin, colorCountMax, gridSize, background, symbols, fontFamily } = canvasSettings;
    const points = createGrid(gridSize, getPalette(colorCountMin, colorCountMax), symbols).filter(() => random.value() > 0.1);

    return ({ context, width, height }) => {
        context.fillStyle = background;
        context.fillRect(0, 0, width, height);
        points.forEach(({position, radius, color, rotation, symbol }) => {
            const [x, y] = getCoords(position, width, height, margin);
            context.save();
            context.fillStyle = color;
            context.font = `${radius * width}px ${fontFamily}`;
            context.translate(x, y);
            context.rotate(rotation);
            context.fillText(symbol, 0, 0);
            context.restore();
        })
    };
};

canvasSketch(sketch, settings);

function createGrid (count, palette, symbols) {
    const points = [];
    for (let x = 0; x < count; x++) {
        for (let y = 0; y < count; y++) {
            const u = count <= 1 ? 0.5 : x / (count - 1);
            const v = count <= 1 ? 0.5 : y / (count - 1);
            const radius = Math.abs(random.noise2D(u, v) * 0.1);
            points.push({
                color: random.pick(palette),
                radius,
                rotation: random.noise2D(u, v),
                position: [ u, v ],
                symbol: random.pick(symbols),
            });
        }
    }
    return points;
}
