import {
  DecoratorNode,
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  LexicalNode,
  NodeKey,
} from "lexical";

export const $createYoutubeNode = ({ id }: { id: string }) => {
  return new YoutubeNode({ id });
};

const ID_ATTR = "data-lexical-youtube";

const convertYoutubeElement = (
  domNode: HTMLElement
): DOMConversionOutput | null => {
  const id = domNode?.getAttribute(ID_ATTR);
  if (!id) return null;
  const node = $createYoutubeNode({ id });
  return { node };
};

const HEIGHT = "315px";
const WIDTH = "560px";
const getYoutubeLink = (id: string) =>
  `https://www.youtube-nocookie.com/embed/${id}`;

export class YoutubeNode extends DecoratorNode<JSX.Element> {
  __id: string;

  constructor({ id, key }: { id: string; key?: NodeKey }) {
    super(key);
    this.__id = id;
  }

  static getType(): string {
    return "youtube";
  }

  static clone(_node: YoutubeNode): YoutubeNode {
    return new YoutubeNode({
      id: _node.__id,
    });
  }

  decorate(): JSX.Element {
    return (
      <iframe height={HEIGHT} width={WIDTH} src={getYoutubeLink(this.__id)} />
    );
  }

  createDOM(): HTMLElement {
    const div = document.createElement("div");
    return div;
  }

  exportDOM(): DOMExportOutput {
    const iframe = document.createElement("iframe");
    iframe.setAttribute(ID_ATTR, this.__id);
    iframe.setAttribute("height", HEIGHT);
    iframe.setAttribute("width", WIDTH);
    iframe.setAttribute("src", getYoutubeLink(this.__id));

    return { element: iframe };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      iframe: (node: Node) => {
        return { conversion: convertYoutubeElement, priority: 0 };
      },
    };
  }
}
