export const makePrivateKey = (privateKey: string) => {
  return privateKey
    .replace(/(\w.{1,63})/g, '$1\n')
    .replace(/^/s, '-----BEGIN PRIVATE KEY-----\n')
    .replace(/$/s, '-----END PRIVATE KEY-----');
};
