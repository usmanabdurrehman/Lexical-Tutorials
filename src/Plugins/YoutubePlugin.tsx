import { Button, IconButton, Input } from "@chakra-ui/react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $insertNodeToNearestRoot } from "@lexical/utils";
import { useState } from "react";
import { Youtube } from "react-bootstrap-icons";

import { $createYouTubeNode } from "../nodes/YoutubeNode";
import Modal from "../Components/Modal";

export default function YouTubePlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState<string>();

  const onEmbed = () => {
    if (!url) return;
    const match =
      /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/.exec(url);

    const id = match && match?.[2]?.length === 11 ? match[2] : null;
    if (!id) return;
    editor.update(() => {
      const youTubeNode = $createYouTubeNode(id);
      $insertNodeToNearestRoot(youTubeNode);
    });

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
