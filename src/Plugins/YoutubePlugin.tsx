import { Button, IconButton, Input } from "@chakra-ui/react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $insertNodeToNearestRoot } from "@lexical/utils";
import { createCommand, LexicalCommand } from "lexical";
import { useEffect, useState } from "react";
import { Youtube } from "react-bootstrap-icons";
import { LOW_PRIORIRTY } from "../constants";

import { $createYouTubeNode, YouTubeNode } from "../nodes/YoutubeNode";
import Modal from "../Components/Modal";

export const INSERT_YOUTUBE_COMMAND: LexicalCommand<string> = createCommand(
  "INSERT_YOUTUBE_COMMAND"
);

export default function YouTubePlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([YouTubeNode])) {
      throw new Error("YouTubePlugin: YouTubeNode not registered on editor");
    }

    return editor.registerCommand<string>(
      INSERT_YOUTUBE_COMMAND,
      (payload) => {
        const youTubeNode = $createYouTubeNode(payload);
        $insertNodeToNearestRoot(youTubeNode);

        return true;
      },
      LOW_PRIORIRTY
    );
  }, [editor]);

  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState<string>();

  const onEmbed = () => {
    if (!url) return;
    const match =
      /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/.exec(url);

    const id = match ? (match?.[2].length === 11 ? match[2] : null) : null;
    if (!id) return;
    editor.dispatchCommand(INSERT_YOUTUBE_COMMAND, id);
    setIsOpen(false);
    setUrl(undefined);
  };

  return (
    <>
      <IconButton
        aria-label={"Upload Video"}
        icon={<Youtube />}
        colorScheme="red"
        size="sm"
        variant="ghost"
        onClick={() => {
          setIsOpen(true);
        }}
      />
      <Modal
        title="Embed Video"
        onClose={() => setIsOpen(false)}
        isOpen={isOpen}
        footer={
          <>
            <Button variant="ghost" onClick={onEmbed}>
              Embed
            </Button>
          </>
        }
      >
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Add Youtube Video URL"
        />
      </Modal>
    </>
  );
}
