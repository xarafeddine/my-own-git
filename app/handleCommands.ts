import fs from "fs";
import zlib from "zlib";
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
      const [opt, sha1] = params;
      if (opt == "-p" && isSha1(sha1)) {
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

    default:
      throw new Error(`Unknown command ${command}`);
  }
}
