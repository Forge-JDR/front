import React from 'react';
import './hexagon.css';

const Hexagon = ({ size, color, rotation, top, left }) => {
  const style = {
    width: size,
    height: size * 1.65, // height of hexagon based on width
    backgroundColor: color,
    transform: `rotate(${rotation}deg)`,
    position: 'absolute',
    top: top,
    left: left,
    borderRadius: '10px'
  };

  return <div className="hexagon" style={style}></div>;
};

export default Hexagon;