import { ListItemNode } from "@lexical/list";
import { EditorConfig } from "lexical";

export class CustomListItemNode extends ListItemNode {
  static getType(): string {
    return "custom-list-item";
  }

  static clone(node: CustomListItemNode): CustomListItemNode {
    return new CustomListItemNode(node.__value, node.__checked, node.__key);
  }

  createDOM(config: EditorConfig): HTMLElement {
    // const element = super.createDOM(config);
    // element.style.background = "green";

    const element = document.createElement("div");
    element.style.border = "1px solid black";

    return element;
  }
}
