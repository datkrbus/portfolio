"use client";

import React from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export const ScrollReveal: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  useScrollReveal();
  return <>{children}</>;
};
