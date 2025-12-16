'use client';

import React from 'react';

interface FormErrorProps {
  message?: string;
}

export const FormError: React.FC<FormErrorProps> = ({ message }) => {
  if (!message) return null;

  return <p className="text-sm font-medium text-red-500 mt-1">{message}</p>;
};
