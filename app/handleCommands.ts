import fs from "fs";
import { Commands, ObjectType, TreeEntry, isSha1 } from "./types";
import {
  buildFileSystemTree,
  getObjectData,
  writeBlobObject,
  writeCommitObject,
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

    case Commands.COMMIT_TREE:
      handleCommitTree(params);
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

function handleCommitTree(params: string[]) {
  if (params.length < 5) throw Error("Invalid number of arguments");
  const [tree_sha, _p, commit_sha, _m, message] = params;
  const authorEmail = "asdf@sdf.com";
  const authorName = "asdf";
  const commiterEmail = "asdf@asdf.com";
  const commiterName = "asfsdf";
  const commitSha = writeCommitObject({
    tree_sha,
    commit_sha,
    message,
    authorEmail,
    authorName,
    commiterEmail,
    commiterName,
  });
  process.stdout.write(commitSha);
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

  treeEntries.sort((a, b) => a.name.localeCompare(b.name));
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
    const hashedBlobFile = writeBlobObject(fileName);
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

    const hashedTree = writeTreeObject(currentDir);
    process.stdout.write(hashedTree);
  } catch (err: any) {
    console.error("Error reading directory:", err);
    console.log("Make sure to initialize the repo first: 'mygit init' ");
  }
}
