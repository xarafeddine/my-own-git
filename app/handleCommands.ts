import fs from "fs";
import zlib from "zlib";
import crypto from "crypto";
import { Commands, isSha1 } from "./types";

export function handleCommands(args: string[]) {
  const [command, ...params] = args;
  switch (command) {
    case Commands.Init:
      handleInit();
      break;
    case Commands.CatFile:
      handleCatFile(params);
      break;

    case Commands.hashObject:
      handleHashObject(params);
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
  const blobFileDir = sha1.substring(0, 2);
  const blobFileName = sha1.substring(2);
  const blobFile = fs.readFileSync(
    `.git/objects/${blobFileDir}/${blobFileName}`
  );
  const decompressedBuffer = zlib.unzipSync(blobFile);
  const blobString = decompressedBuffer.toString();
  const [_, blobContent] = blobString.split("\0");

  process.stdout.write(blobContent);
}
function handleHashObject(params: string[]) {
  const [flag, fileName] = params;
  if (flag !== "-w") throw "error";
  const fileContent = fs.readFileSync(fileName);
  const blobFile = Buffer.from(`blob ${fileContent.length}\0${fileContent}`);

  // Compute hash for blob
  const shasum = crypto.createHash("sha1");
  shasum.update(blobFile);
  const hashedBlobFile = shasum.digest("hex");

  const blobFileDir = hashedBlobFile.substring(0, 2);
  const blobFileName = hashedBlobFile.substring(2);

  const compressBlob = zlib.deflateSync(blobFile);
  fs.mkdirSync(`.git/objects/${blobFileDir}`);
  // Store blob
  fs.writeFileSync(`.git/objects/${blobFileDir}/${blobFileName}`, compressBlob);
  // Print the computed hash
  process.stdout.write(hashedBlobFile);
}
