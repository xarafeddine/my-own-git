import crypto, { BinaryToTextEncoding } from "crypto";
import fs from "fs";
import zlib from "zlib";
import { FileMode, TreeEntry } from "./types";

// const encoder = new TextEncoder();
// const decoder = new TextDecoder();
// export const strToBytes = encoder.encode.bind(encoder);
// export const bytesToStr = decoder.decode.bind(decoder);

export function getProcessParams() {
  const args = process.argv.slice(2); // Skip the first two arguments
  const params: Record<string, string> = {};

  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace("--", "");
    const value = args[i + 1];
    params[key] = value;
  }

  return params;
}

export function stringToBytes(s: string): Uint8Array {
  return new Uint8Array(s.split("").map((s: string) => s.charCodeAt(0)));
}
export function bytesToString(arr: Uint8Array): string {
  return Array.from(arr)
    .map((n) => String.fromCharCode(n))
    .join("");
}

export function getObjectPath(sha1: string) {
  const objectDir = sha1.substring(0, 2);
  const objectFile = sha1.substring(2);
  return [objectDir, objectFile];
}
export function getObjectData(sha1: string) {
  const [objDir, objFile] = getObjectPath(sha1);

  const objBuffer = fs.readFileSync(`.git/objects/${objDir}/${objFile}`);
  const decompressedBuffer = zlib.unzipSync(objBuffer);

  const objString = decompressedBuffer.toString();
  const [header, objContent] = objString.split("\0");
  const [objType, objSize] = header.split(" ");

  console.log("objString:\n", objString);
  if (objType === "tree") {
    const arr = objContent.split("\0");
    const [mode, name] = arr[0].split(" ");
    const treeEntries: TreeEntry[] = [{ mode, name, hash: "" }];
    for (let i = 0; i < arr.length - 1; i++) {
      const hash = arr[i + 1].substring(0, 20);
      const modeAndName = arr[i + 1].substring(20);
      treeEntries[i].hash = hash;

      if (modeAndName) {
        const [mode, name] = modeAndName.split(" ");
        treeEntries.push({ mode, name, hash: "" });
      }
    }
    treeEntries?.sort((entry1, entry2) =>
      entry1.name.localeCompare(entry2.name)
    );
    return { objType, objSize, objContent, treeEntries };
  }
  return { objType, objSize, objContent };
}

export function computeSHA1Hash(
  input: string | Buffer,
  option?: BinaryToTextEncoding
) {
  const shasum = crypto.createHash("sha1");
  shasum.update(input);

  return shasum.digest(option || "binary");
}
