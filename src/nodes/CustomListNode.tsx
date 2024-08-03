import { DecoratorNode, LexicalNode, NodeKey } from "lexical";
import { ListItemNode } from "@lexical/list";

export class CustomListNode extends ListItemNode {
  constructor(value?: number, checked?: boolean, key?: NodeKey) {
    console.log({ value, checked, key });
    super(value, checked, key);
  }
}
