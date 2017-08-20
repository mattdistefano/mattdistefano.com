export type asyncDataStatus = 'loading' | 'loaded' | 'notfound';

export interface AsyncData<T> {
  timestamp: number;
  data?: T;
  status: asyncDataStatus;
}
