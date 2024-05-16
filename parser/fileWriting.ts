import { writeFile } from 'fs'

export default function writeToFile(object: any, path: string[]) {
  writeFile('/Users/joe/test.txt', JSON.stringify(object), err => {
    if (err) {
      console.error(err);
    }
  });
}