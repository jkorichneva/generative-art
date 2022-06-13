import random from "canvas-sketch-util/random";
import palettes from 'nice-color-palettes';

export default function getPalette(colorCountMin, colorCountMax) {
    const colorCount = random.rangeFloor(colorCountMin, colorCountMax);
    return random.shuffle(random.pick(palettes)).slice(0, colorCount);
}
