import {
  DecoratorNode,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedTextNode,
  TextNode,
} from "lexical";
import { ExtendedTextNode } from "./ExtendedTextNode";
import { Option } from "../types";

export class QuestionNode extends DecoratorNode<JSX.Element> {
  __question: string;
  __options: Option[];
  __answer: string | undefined;

  constructor(
    params: { question: string; options: Option[]; answer?: string },
    key?: NodeKey
  ) {
    const { question, options, answer } = params;
    super(key);
    this.__question = question;
    this.__options = options;
    this.__answer = answer;
  }

  static getType(): string {
    return "question";
  }

  static clone(node: QuestionNode): QuestionNode {
    return new QuestionNode(
      {
        question: node.__question,
        answer: node.__answer,
        options: node.__options,
      },
      node.__key
    );
  }

  createDOM(config: EditorConfig, editor?: LexicalEditor): HTMLElement {
    const element = document.createElement("span");

    return element;
  }

  updateDOM(): boolean {
    return false;
  }

  decorate(editor: LexicalEditor, config: EditorConfig): JSX.Element {
    return <div>Question</div>;
  }

  //   static importJSON(serializedNode: SerializedTextNode): TagNode {
  //     return $createTagNode(serializedNode.text).updateFromJSON(serializedNode);
  //   }

  // exportJSON(): SerializedTextNode {
  //   return {
  //     ...super.exportJSON(),
  //   };
  // }
}

export const $createQuestionNode = (params: {
  question: string;
  options: Option[];
  answer?: string;
}) => {
  return new QuestionNode(params);
};

export const $isQuestionNode = (
  node: LexicalNode | null | undefined
): node is QuestionNode => {
  return node instanceof QuestionNode;
};
