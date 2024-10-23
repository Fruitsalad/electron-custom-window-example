// This file contains a completely unnecessary particle effect.
import {Vec2} from "./math";
const {vec2, add, sub, div, mult} = Vec2;

export function explode_at(pos: Vec2) {
  for (let i = 0; i < 30; i++)
    createParticle(pos);
}

function createParticle(pos: Vec2) {
  // Mostly based on an article from CSS tricks.
  // https://css-tricks.com/playing-with-particles-using-the-web-animations-api/
  const particle = document.createElement("particle");
  document.body.appendChild(particle);

  const radius = 30;
  const size = vec2(5, 5);
  const random = vec2(Math.random(), Math.random());
  const origin = sub(pos, div(size, 2));
  const dest = add(pos, mult(sub(random, 0.5), 2 * radius));

  particle.style.width = `${size.x}px`;
  particle.style.height = `${size.y}px`;
  particle.style.background = `hsl(5, 1%, ${Math.random() * 20 + 80}%)`;

  particle.animate(
    [
      {
        transform: `translate(${insert(origin)}) scale(100%)`,
        opacity: 0.4
      }, {
      transform: `translate(${insert(dest)}) scale(0%)`,
      opacity: 0
    }
    ], {
      duration: 500 + Math.random() * 1000,
      easing: 'ease-out',
      delay: Math.random() * 100
    }).onfinish = () => particle.remove();

  function insert(v: Vec2, unit='px') {
    return `${v.x}${unit}, ${v.y}${unit}`;
  }
}
