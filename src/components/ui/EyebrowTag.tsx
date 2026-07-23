import React from 'react';

interface EyebrowTagProps {
  text: string;
  style?: React.CSSProperties;
}

export const EyebrowTag: React.FC<EyebrowTagProps> = ({ text, style }) => {
  return (
    <div className="eyebrow-tag" style={style}>
      <span className="dot"></span>
      <span>{text}</span>
    </div>
  );
};
