import { PageSummary } from './page-summary';

export interface Query {
  [name: string]: {
    root?: string;
    limit?: number;
    depth?: number;
    type?: 'page' | 'index';
    results: PageSummary[]
  };
}
