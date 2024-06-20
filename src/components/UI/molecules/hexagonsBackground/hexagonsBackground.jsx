import React from 'react';
import './hexagonsBackground.css'
import Hexagon from '../../atoms/hexagon/hexagon';
import {interpolateColor} from '../../../../utils/colors.utils'


    const color1 = "#2596BE"; // Première couleur du dégradé
    const color2 = "#752ACB"; // Deuxième couleur du dégradé
    const interpolatedColor = interpolateColor(color1, color2, Math.random())

    const hexagons = Array.from({ length: 5 }).map((_, index) => ({
        size: Math.random() * 100 + 50,
        color: interpolatedColor,
        rotation: Math.random() * 360,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`
    }));

const HexagonBackground = () => {
  return (
    <>
    <Hexagon id="hex0"></Hexagon>
    <Hexagon 
      id="hex1" 
      top="150px"
      left="150px"
      rotation="45"
      size="160">
      </Hexagon>
    <Hexagon 
      id="hex2"
      top="500px"
      left="300px">
      </Hexagon>
      {/* {hexagons.map((hex, index) => (
            <Hexagon
              key={index}
              size={hex.size}
              color={hex.color}
              rotation={hex.rotation}
              top={hex.top}
              left={hex.left}
            />
          ))} */}
    </>
  );
};

export default HexagonBackground;
