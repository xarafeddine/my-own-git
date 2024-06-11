import fs from "fs";
import { Commands, ObjectType, TreeEntry, isSha1 } from "./types";
import {
  buildFileSystemTree,
  getObjectData,
  writeBlobObject,
  writeTreeObject,
} from "./utils";

export function handleCommands(args: string[]) {
  const [command, ...params] = args;
  switch (command) {
    case Commands.INIT:
      handleInit();
      break;
    case Commands.CAT_FILE:
      handleCatFile(params);
      break;

    case Commands.HASH_OBJECT:
      handleHashObject(params);
      break;

    case Commands.LS_TREE:
      handleLsTree(params);
      break;

    case Commands.WRITE_TREE:
      handleWriteTree();
      break;

    default:
      throw new Error(`Unknown command ${command}`);
  }
}

function handleInit() {
  fs.mkdirSync(".git", { recursive: true });
  fs.mkdirSync(".git/objects", { recursive: true });
  fs.mkdirSync(".git/refs", { recursive: true });
  fs.writeFileSync(".git/HEAD", "ref: refs/heads/main\n");
  console.log("Initialized git directory");
}

function handleCatFile(params: string[]) {
  const [flag, sha1] = params;
  if (flag != "-p" || !isSha1(sha1)) throw "error";
  const { objContent } = getObjectData(sha1);

  process.stdout.write(objContent as string);
}

function handleLsTree(params: string[]) {
  const [param] = params;
  let sha1;
  if (param === "--name-only") {
    sha1 = params[1];
  } else {
    sha1 = param;
  }

  if (!isSha1(sha1)) throw "error";

  const { objContent } = getObjectData(sha1);
  const treeEntries = objContent as TreeEntry[];
  if (!treeEntries) throw Error("");

  if (param === "--name-only") {
    for (const entry of treeEntries) {
      console.log(entry.name);
    }
    return;
  }

  for (const entry of treeEntries) {
    console.log(
      `${entry.mode} ${ObjectType[parseInt(entry.mode)]}  ${entry.hash} ${
        entry.name
      }`
    );
  }
}

function handleHashObject(params: string[]) {
  const [flag, fileName] = params;
  if (flag !== "-w") throw Error("Invalid flag");
  try {
    const { hashedBlobFile } = writeBlobObject(fileName);
    process.stdout.write(hashedBlobFile);
  } catch (err: any) {
    console.error("Error reading directory:", err.message);
    console.log("Make sure to initialize the repo first: 'mygit init' ");
  }
}

function handleWriteTree() {
  const currentDirectory = process.cwd();
  try {
    const currentDir = buildFileSystemTree(currentDirectory);
    
    const { hashedTree } = writeTreeObject(currentDir);
    process.stdout.write(hashedTree);
  } catch (err: any) {
    console.error("Error reading directory:", err);
    console.log("Make sure to initialize the repo first: 'mygit init' ");
  }
}
