// https://github.dev/facebook/lexical/blob/main/packages/lexical-playground/src/nodes/PollNode.tsx

import {
  DecoratorNode,
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  LexicalNode,
  NodeKey,
} from "lexical";
import { Option } from "../types";

export const $createPollNode = ({
  question,
  options,
}: {
  question: string;
  options: Option[];
}) => {
  return new PollNode({ question, options });
};

const $convertPollElement = (
  domNode: HTMLElement
): DOMConversionOutput | null => {
  const question = domNode.getAttribute("data-lexical-poll-question");
  const options = domNode.getAttribute("data-lexical-poll-options");
  if (question !== null && options !== null) {
    const node = $createPollNode({ question, options: JSON.parse(options) });
    return { node };
  }
  return null;
};

export class PollNode extends DecoratorNode<JSX.Element> {
  __question: string;
  __options: Option[];

  constructor({
    question,
    options,
    key,
  }: {
    question: string;
    options: Option[];
    key?: NodeKey;
  }) {
    super(key);
    this.__question = question;
    this.__options = options;
  }

  static getType(): string {
    return "poll";
  }

  static clone(node: PollNode): PollNode {
    return new PollNode({ question: node.__question, options: node.__options });
  }

  decorate(): JSX.Element {
    return <div></div>;
  }

  createDOM(): HTMLElement {
    const span = document.createElement("span");
    return span;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("span");
    element.setAttribute("data-lexical-poll-question", this.__question);
    element.setAttribute(
      "data-lexical-poll-options",
      JSON.stringify(this.__options)
    );
    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      span: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute("data-lexical-poll-question")) {
          return null;
        }
        return {
          conversion: $convertPollElement,
          priority: 2,
        };
      },
    };
  }
}
