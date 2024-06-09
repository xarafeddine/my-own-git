import fs from "fs";
import zlib from "zlib";
import crypto from "crypto";
import { Commands, isSha1 } from "./types";

export function handleCommands(args: string[]) {
  const [command, ...params] = args;
  switch (command) {
    case Commands.Init:
      fs.mkdirSync(".git", { recursive: true });
      fs.mkdirSync(".git/objects", { recursive: true });
      fs.mkdirSync(".git/refs", { recursive: true });
      fs.writeFileSync(".git/HEAD", "ref: refs/heads/main\n");
      console.log("Initialized git directory");
      break;
    case Commands.CatFile:
      const [flag, sha1] = params;
      if (flag == "-p" && isSha1(sha1)) {
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
      break;

    case Commands.hashObject:
      const [ops, fileName] = params;
      if (ops == "-w") {
        const fileContent = fs.readFileSync(fileName);
        console.log(fileContent.toString());
        const blobFile = Buffer.from(
          `blob ${fileContent.length}\0${fileContent}`
        );

        // Compute hash for blob
        const shasum = crypto.createHash("sha1");
        shasum.update(blobFile);
        const hashedBlobFile = shasum.digest("hex");

        const blobFileDir = hashedBlobFile.substring(0, 2);
        const blobFileName = hashedBlobFile.substring(2);

        const compressBlob = zlib.deflateSync(blobFile);
        fs.mkdirSync(`.git/objects/${blobFileDir}`);
        // Store blob
        fs.writeFileSync(
          `.git/objects/${blobFileDir}/${blobFileName}`,
          compressBlob
        );
        // Print the computed hash
        process.stdout.write(hashedBlobFile);
      }
      break;

    default:
      throw new Error(`Unknown command ${command}`);
  }
}
