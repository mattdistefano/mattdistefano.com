export type asyncDataStatus = 'loading' | 'loaded' | 'notfound';

export interface AsyncData<T> {
  timestamp: number;
  status: asyncDataStatus;
  path: string;
  data?: T;
}
