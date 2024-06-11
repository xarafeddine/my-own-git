export enum Commands {
  INIT = "init",
  CAT_FILE = "cat-file",
  HASH_OBJECT = "hash-object",
  LS_TREE = "ls-tree",
  WRITE_TREE = "write-tree",
}
export enum FileMode {
  Regular = "100644",
  Executable = "100755",
  SymbolicLink = "120000",
  Directory = "040000",
}

export const ObjectType: Record<number, string> = {
  40000: "tree",
  100644: "blob",
  100755: "exec",
  120000: "symb",
};

export function isSha1(str: string) {
  const sha1Regex = /^[a-fA-F0-9]{40}$/;
  return sha1Regex.test(str);
}

export type TreeEntry = {
  mode: string;
  name: string;
  hash: string;
};

export type FileSystemNode = {
  name: string;
  type: "file" | "directory";
  children?: FileSystemNode[];
};
