export type DefaultError = {
  message: string,
  error: any
};
export const error = (message: string, e: any) => ({ message, error: e }) as DefaultError;