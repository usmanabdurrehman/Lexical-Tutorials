import { EditorConfig, ParagraphNode } from "lexical";

export class CustomParagraphNode extends ParagraphNode {
  static getType(): string {
    return "custom-paragraph";
  }

  static clone(node: CustomParagraphNode): CustomParagraphNode {
    return new CustomParagraphNode(node.__key);
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = super.createDOM(config);
    element.style.background = "green";
    element.style.color = "white";
    element.style.paddingLeft = "8px";

    return element;
  }
}
