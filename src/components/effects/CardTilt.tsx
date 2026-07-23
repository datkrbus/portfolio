"use client";

import React from 'react';
import { useCardTilt } from '@/hooks/useCardTilt';

export const CardTilt: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  useCardTilt();
  return <>{children}</>;
};
