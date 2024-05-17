import { writeFileSync } from "fs";

/**
 * Writes an object to a file
 * @param path each string is a folder. the last string should be the file name
 */
export default function writeToFile(object: any, path: string[]) {
  writeFileSync(
    "./" + path.join("/"),
    JSON.stringify(object),
    { flag: "w" },
    (err) => {
      if (err) {
        console.error(err);
      }
    }
  );
}
