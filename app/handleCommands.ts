import fs from "fs";
import zlib from "zlib";
import { Commands, isSha1 } from "./types";
import { computeSHA1Hash, getObjectData, getObjectPath } from "./utils";

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

  process.stdout.write(objContent);
}

function handleLsTree(params: string[]) {
  const [flag, sha1] = params;

  if (!isSha1(sha1)) throw "error";

  const { treeEntries } = getObjectData(sha1);
  if (!treeEntries) throw Error("");
  if (params.includes("--name-only")) {
    for (const entry of treeEntries) {
      console.log(entry.name);
    }
    return;
  }
  for (const entry of treeEntries) {
    console.log(`${entry.mode}  ${entry.hash} ${entry.name}`);
  }
}

function handleHashObject(params: string[]) {
  const [flag, fileName] = params;
  if (flag !== "-w") throw "error";
  const fileContent = fs.readFileSync(fileName);
  const blobFile = Buffer.from(`blob ${fileContent.length}\0${fileContent}`);

  // Compute hash for blob
  const hashedBlobFile = computeSHA1Hash(blobFile, "hex");

  const [blobFileDir, blobFileName] = getObjectPath(hashedBlobFile);

  const compressBlob = zlib.deflateSync(blobFile);
  fs.mkdirSync(`.git/objects/${blobFileDir}`);
  // Store blob
  fs.writeFileSync(`.git/objects/${blobFileDir}/${blobFileName}`, compressBlob);
  // Print the computed hash
  process.stdout.write(hashedBlobFile);
}
