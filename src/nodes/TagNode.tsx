import {
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedTextNode,
  TextNode,
} from "lexical";
import { ExtendedTextNode } from "./ExtendedTextNode";

export class TagNode extends ExtendedTextNode {
  constructor(text: string, key?: NodeKey) {
    super(text, key);
  }

  static getType(): string {
    return "tag";
  }

  static clone(node: TagNode): TagNode {
    return new TagNode(node.__text, node.__key);
  }

  createDOM(config: EditorConfig, editor?: LexicalEditor): HTMLElement {
    const element = super.createDOM(config);
    element.style.background = "#f4f4f4";
    element.style.padding = "4px 8px";
    element.style.borderRadius = "18px";
    element.style.border = "2px solid #aaa";
    element.style.fontSize = "14px";

    return element;
  }

  updateDOM(): boolean {
    return false;
  }

  static importJSON(serializedNode: SerializedTextNode): TagNode {
    return $createTagNode(serializedNode.text).updateFromJSON(serializedNode);
  }

  // exportJSON(): SerializedTextNode {
  //   return {
  //     ...super.exportJSON(),
  //   };
  // }
}

export const $createTagNode = (text: string) => {
  return new TagNode(text);
};

export const $isTagNode = (
  node: LexicalNode | null | undefined
): node is TagNode => {
  return node instanceof TagNode;
};
