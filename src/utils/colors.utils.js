export function interpolateColor(color1, color2, factor) {
  if (arguments.length < 3) { 
    factor = 0.5; 
  }
  const result = color1.slice(1).match(/.{2}/g)
    .map((hex, index) => {
      const value1 = parseInt(hex, 16);
      const value2 = parseInt(color2.slice(1).match(/.{2}/g)[index], 16);
      const value = Math.round(value1 + factor * (value2 - value1));
      return value.toString(16).padStart(2, '0');
    });
  return `#${result.join('')}`;
}