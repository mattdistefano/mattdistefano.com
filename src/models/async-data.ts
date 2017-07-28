export interface AsyncData<T> {
  timestamp: number;
  data: T;
  status: 'loading' | 'loaded' | 'notfound';
};
