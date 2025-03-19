import { EditorConfig, LexicalNode, NodeKey, TextNode } from "lexical";

export class TagNode extends TextNode {
  constructor(text: string, key?: NodeKey) {
    super(text, key);
  }

  static getType(): string {
    return "tag";
  }

  static clone(node: TagNode): TagNode {
    return new TagNode(node.__text, node.__key);
  }

  // Not Required. If want to edit text node, can add it.
  createDOM(config: EditorConfig): HTMLElement {
    // The DOM Element for your Node
    const element = super.createDOM(config);

    // Since super.createDOM just makes a span tag with text inside. Can do this as well
    // const element = document.createElement("span");
    // element.replaceChildren(this.__text);
    element.style.background = "#f4f4f4";
    element.style.padding = "4px 8px";
    element.style.borderRadius = "18px";
    element.style.border = "2px solid #aaa";
    element.style.fontSize = "14px";
    return element;
  }

  //  static importJSON(serializedNode: SerializedTagNode): TagNode {
  //     return $createTagNode(serializedNode).updateFromJSON(serializedNode);
  //   }

  //   exportJSON(): SerializedQuestionNode {
  //     return {
  //       ...super.exportJSON(),
  //       question: this.__question,
  //       answer: this.__answer,
  //       options: this.__options,
  //     };
  //   }
}

export function $createTagNode(text: string): TagNode {
  return new TagNode(text);
}

export function $isTagNode(
  node: LexicalNode | null | undefined
): node is TagNode {
  return node instanceof TagNode;
}
