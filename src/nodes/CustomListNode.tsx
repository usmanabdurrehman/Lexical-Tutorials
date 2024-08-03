import { DecoratorNode, LexicalNode, NodeKey } from "lexical";
import { ListItemNode } from "@lexical/list";

export class CustomListNode extends ListItemNode {
  static getType(): string {
    return "video";
  }

  static clone(node: CustomListNode): CustomListNode {
    return new CustomListNode(node.__value, node.__checked, node.__key);
  }

  constructor(value?: number, checked?: boolean, key?: NodeKey) {
    super(value, checked, key);
    // this.__id = id;
  }

  createDOM(): HTMLElement {
    return document.createElement("div");
  }

  updateDOM(): false {
    return false;
  }

  //   decorate(): React.ReactNode {
  //     return <div>yo</div>;
  //   }
}

export function $createVideoNode(id: string): CustomListNode {
  return new CustomListNode(id);
}

export function $isVideoNode(
  node: LexicalNode | null | undefined
): node is CustomListNode {
  return node instanceof CustomListNode;
}
