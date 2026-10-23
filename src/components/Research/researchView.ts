import { createContext } from 'react';
export type ResearchView = 'EASY' | 'DETAILED';
export const ResearchViewContext = createContext<ResearchView>('EASY');
