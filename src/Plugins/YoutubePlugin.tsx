import { Button, IconButton, Input } from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { ImageFill, Youtube } from "react-bootstrap-icons";
import Modal from "../Components/Modal";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createImageNode } from "../nodes/ImageNode";
import { $insertNodes } from "lexical";
import { $createYoutubeNode } from "../nodes/YoutubeNode";

export default function YoutubePlugin() {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setURL] = useState("");

  const [editor] = useLexicalComposerContext();

  const onEmbed = () => {
    if (!url) return;
    const match =
      /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/.exec(url);

    const id = match && match?.[2]?.length === 11 ? match?.[2] : null;
    if (!id) return;
    editor.update(() => {
      const node = $createYoutubeNode({ id });
      $insertNodes([node]);
    });
    setURL("");
    setIsOpen(false);
  };

  return (
    <div>
      <IconButton
        icon={<Youtube />}
        aria-label="Embed Youtube Video"
        size="sm"
        variant="ghost"
        colorScheme={"red"}
        onClick={() => setIsOpen(true)}
      />

      {isOpen && (
        <Modal
          title="Embed Youtube Video"
          onClose={() => setIsOpen(false)}
          footer={
            <Button variant="ghost" isDisabled={!url} onClick={onEmbed}>
              Embed
            </Button>
          }
          isOpen={isOpen}
        >
          <Input
            value={url}
            onChange={(e) => setURL(e.target.value)}
            placeholder="Add Youtube URL"
          />
        </Modal>
      )}
    </div>
  );
}
