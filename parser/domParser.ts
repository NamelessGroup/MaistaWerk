import { HTMLElement } from "happy-dom";

export default class DomParser {
  constructor(private body: HTMLElement) {}

  getChildAtId(id: number): HTMLElement {
    let curBody = this.body;
    while (curBody != undefined) {
      if (id >= curBody.childElementCount) {
        id -= curBody.childElementCount;
        curBody = curBody.children[curBody.childElementCount - 1];
      } else {
        return curBody.children[id];
      }
    }
    throw "Id was too high";
  }

  findChildIdOfHeading(heading: string): number {
    let id = 0;
    const headingRegEx = /(h|H)[0-9]/;
    let curBody = this.body;
    while (curBody != undefined) {
      for (const child of curBody.children) {
        if (headingRegEx.test(child.tagName) && child.innerHTML == heading) {
          return id;
        }
        id++;
      }
      curBody = curBody.children[curBody.childElementCount - 1];
    }

    throw "Could not find child with this heading";
  }

  getChildAfterHeading(heading: string): HTMLElement {
    return this.getChildAtId(this.findChildIdOfHeading(heading) + 1);
  }

  publicGetChildRange(start: number, end: number) {
    let result: HTMLElement[] = [];
    let curBody = this.body;
    let id = start;
    while (curBody != undefined) {
      if (id >= curBody.childElementCount) {
        id -= curBody.childElementCount;
        curBody = curBody.children[curBody.childElementCount - 1];
      } else {
        break;
      }
    }
    let curTotalId = start;
    while (curTotalId < end) {
      if (id == curBody.childElementCount - 1) {
        curBody = curBody.children[curBody.childElementCount - 1];
        id = 0;
      } else {
        result.push(curBody.children[id]);
        id++;
        curTotalId++;
      }
    }
    return result;
  }

  getAllChildren(): HTMLElement[] {
    let result: HTMLElement[] = [];
    let curBody = this.body;
    let id = 0;
    while (curBody != undefined) {
      if (id == curBody.childElementCount - 1) {
        curBody = curBody.children[curBody.childElementCount - 1];
        id = 0;
        if (curBody.childElementCount <= 0) break;
      } else {
        result.push(curBody.children[id]);
        id++;
      }
    }
    return result;
  }
}
