import React from 'react';

interface BezelCardProps {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  style?: React.CSSProperties;
  dataId?: string | number;
}

export const BezelCard: React.FC<BezelCardProps> = ({
  children,
  className = '',
  innerClassName = '',
  style,
  dataId,
}) => {
  return (
    <div
      className={`bezel-card-outer ${className}`}
      style={style}
      data-id={dataId}
    >
      <div className={`bezel-card-inner ${innerClassName}`}>
        {children}
      </div>
    </div>
  );
};
