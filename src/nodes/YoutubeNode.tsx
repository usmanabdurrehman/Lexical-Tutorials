import {
  DecoratorNode,
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  LexicalEditor,
  NodeKey,
} from "lexical";

interface YouTubeComponentProps {
  videoID: string;
}

const HEIGHT = "315px";
const WIDTH = "560px";
const ID_ATTR = "data-lexical-youtube";

const getYoutubeLink = (videoID: string) =>
  `https://www.youtube-nocookie.com/embed/${videoID}`;

function YouTubeComponent({ videoID }: YouTubeComponentProps) {
  return <iframe width={WIDTH} height={HEIGHT} src={getYoutubeLink(videoID)} />;
}

function $convertYoutubeElement(
  domNode: HTMLElement
): null | DOMConversionOutput {
  const videoID = domNode.getAttribute(ID_ATTR);
  if (videoID) {
    const node = $createYouTubeNode(videoID);
    return { node };
  }
  return null;
}

export class YouTubeNode extends DecoratorNode<JSX.Element> {
  __id: string;

  constructor(id: string, key?: NodeKey) {
    super(key);
    this.__id = id;
  }

  static getType(): string {
    return "youtube";
  }

  static clone(node: YouTubeNode): YouTubeNode {
    return new YouTubeNode(node.__id, node.__key);
  }

  decorate(_editor: LexicalEditor): JSX.Element {
    return <YouTubeComponent videoID={this.__id} />;
  }

  createDOM(): HTMLElement {
    const div = document.createElement("div");
    return div;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("iframe");
    element.setAttribute(ID_ATTR, this.__id);
    element.setAttribute("width", WIDTH);
    element.setAttribute("height", HEIGHT);
    element.setAttribute("src", getYoutubeLink(this.__id));
    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      iframe: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute(ID_ATTR)) {
          return null;
        }
        return {
          conversion: $convertYoutubeElement,
          priority: 1,
        };
      },
    };
  }
}

export function $createYouTubeNode(videoID: string): YouTubeNode {
  return new YouTubeNode(videoID);
}
