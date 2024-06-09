export enum Commands {
  Init = "init",
  CatFile = "cat-file",
  hashObject = "hash-object",
}
export function isSha1(str: string) {
  const sha1Regex = /^[a-fA-F0-9]{40}$/;
  return sha1Regex.test(str);
}
