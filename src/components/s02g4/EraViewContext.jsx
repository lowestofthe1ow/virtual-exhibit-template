import React, { createContext, useContext } from 'react';

export const EraViewContext = createContext('preview');
export function useEraView() {
  return useContext(EraViewContext);
}
