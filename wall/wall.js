import canvasSketch from 'canvas-sketch';
import random from 'canvas-sketch-util/random';
import getPalette from '../utils/getPalette';
import getCoords from '../utils/getCoords';

const settings = {
  dimensions: [ 3072, 2048 ]
};
const canvasSettings = {
  margin: 150,
  colorCountMax: 6,
  colorCountMin: 2,
  gridSize: 4,
  lineWidth: 50,
  background: 'white',
}

const sketch = () => {
  const { margin, colorCountMax, colorCountMin } = canvasSettings;
  const points = createGrid();
  const palette = getPalette(colorCountMin, colorCountMax)

  const drawTrapezoid = (trapezoid, width, height, context) => {
    const { firstX, firstY, secondX, secondY } = trapezoid;
    context.beginPath();
    context.moveTo(firstX, firstY);
    context.lineTo(secondX, secondY);
    context.lineTo(secondX, height);
    context.lineTo(firstX, height);
    context.lineTo(firstX, firstY);
    context.closePath();

    context.lineWidth = canvasSettings.lineWidth;
    context.strokeStyle = canvasSettings.background;
    context.stroke();

    context.fillStyle = random.pick(palette);
    context.fill();
  }

  const formTrapezoid = (points, width, height) => {
    const [firstX, firstY] = getCoords(getRandomPoint(points).position, width, height, margin);
    const [secondX, secondY] = getCoords(getRandomPoint(points).position, width, height, margin);
    return { firstX, firstY, secondX, secondY };
  }

  return ({ context, width, height }) => {
    context.fillStyle = canvasSettings.background;
    context.fillRect(0, 0, width, height);
    const trapezoids = [];
    for (let i = points.length; i > 0; i--) {
      trapezoids.push(formTrapezoid(points, width, height, context));
      i--;
    }
    console.log(trapezoids);
    trapezoids.sort((a, b) => ((a.firstY + a.secondY / 2) > (b.firstY + b.secondY / 2) ? 1 : -1));
    trapezoids.forEach(trapezoid => drawTrapezoid(trapezoid, width, height, context));
  };
};

canvasSketch(sketch, settings);

function getRandomPoint(points) {
  const index = random.rangeFloor(0, points.length);
  const point = points[index];
  points.splice(index, 1);
  return point;
}

function createGrid() {
  const points = [];
  const count = canvasSettings.gridSize;
  for (let x = 0; x < count; x++) {
    for (let y = 0; y < count; y++) {
      const u = count <= 1 ? 0.5 : x / (count - 1);
      const v = count <= 1 ? 0.5 : y / (count - 1);
      points.push({
        position: [ u, v ],
      });
    }
  }
  return points;
}
