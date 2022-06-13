import { lerp } from 'canvas-sketch-util/math';

export default function getCoords(position, width, height, margin) {
    const [u, v] = position;
    const x = lerp(margin, width - margin, u);
    const y = lerp(margin, height - margin, v);
    return [x, y]
}
