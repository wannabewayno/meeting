type Callback = (...args: any[]) => void;

export const Debouncer = (callback: Callback, timeout = 500): Callback => {
  let debounceTimer: NodeJS.Timeout | null = null;

  return (...args: any[]) => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => callback(...args), timeout);
  };
};