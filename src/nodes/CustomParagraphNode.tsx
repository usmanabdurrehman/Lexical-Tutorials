import { EditorConfig, ParagraphNode } from "lexical";

export class CustomParagraphNode extends ParagraphNode {
  static getType() {
    return "custom-paragraph";
  }

  static clone(node: CustomParagraphNode): CustomParagraphNode {
    return new CustomParagraphNode(node.__key);
  }

  createDOM(config: EditorConfig) {
    const dom = super.createDOM(config);
    dom.style.background = "green";
    dom.style.paddingLeft = "4px";
    dom.style.color = "white";
    return dom;
  }
}
