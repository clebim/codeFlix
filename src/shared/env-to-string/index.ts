export const envToString = (name: string, defaultValue = ''): string =>
  process.env[name] ?? defaultValue;
