import { writeFileSync } from "fs";

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
