import { EditorConfig } from "lexical";
import { ListItemNode } from "@lexical/list";

export class CustomListNode extends ListItemNode {
  static clone(node: CustomListNode): CustomListNode {
    return new CustomListNode(node.__value, node.__checked, node.__key);
  }

  createDOM(config: EditorConfig): HTMLElement {
    // const element = super.createDOM(config);
    // element.style.listStyleType = "upper-roman";

    const element = document.createElement("div");
    element.style.border = "1px solid black";
    return element;
  }

  static getType(): string {
    return "custom-list";
  }
}
