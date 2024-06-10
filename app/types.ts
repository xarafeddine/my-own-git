export enum Commands {
  INIT = "init",
  CAT_FILE = "cat-file",
  HASH_OBJECT = "hash-object",
  LS_TREE = "ls-tree",
}
export enum FileMode {
  Regular = "100644",
  Executable = "100755",
  SymbolicLink = "120000",
  Directory = "040000",
}

export function isSha1(str: string) {
  const sha1Regex = /^[a-fA-F0-9]{40}$/;
  return sha1Regex.test(str);
}

export type TreeEntry = {
  mode: string;
  name: string;
  hash: string;
};
