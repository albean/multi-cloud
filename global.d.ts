
declare global {
  const CONFIG: {
    apiUrl: string;
    timeout: number;
  } & string;

  const EVENTS_BACKEND_PREFIX: string;
}

export {};
