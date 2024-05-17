import { HTMLElement } from "happy-dom";

/**
 * Manages a dom object
 */
export default class DomParser {
  constructor(private body: HTMLElement) {}

  /**
   * Gets the i-th child of the dom object
   */
  getChildAtIndex(i: number): HTMLElement {
    let curBody = this.body;
    while (curBody != undefined) {
      if (i >= curBody.childElementCount) {
        i -= curBody.childElementCount;
        curBody = curBody.children[curBody.childElementCount - 1];
      } else {
        return curBody.children[i];
      }
    }
    throw "Id was too high";
  }

  /**
   * Finds the index of the child the the given heading
   */
  findChildIndexOfHeading(heading: string): number {
    let i = 0;
    const headingRegEx = /(h|H)[0-9]/;
    let curBody = this.body;
    while (curBody != undefined) {
      for (const child of curBody.children) {
        if (headingRegEx.test(child.tagName) && child.innerHTML == heading) {
          return i;
        }
        i++;
      }
      curBody = curBody.children[curBody.childElementCount - 1];
    }

    throw "Could not find child with this heading";
  }

  /**
   * Gets the first dom object after the heading
   */
  getChildAfterHeading(heading: string): HTMLElement {
    return this.getChildAtIndex(this.findChildIndexOfHeading(heading) + 1);
  }

  /**
   * Gets all children of the dom object in the given range
   * @param start inclusive
   * @param end exclusive
   */
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

  /**
   * Gets all children of the dom object in an array
   */
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
