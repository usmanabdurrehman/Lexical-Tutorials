import { Button, IconButton, Input } from "@chakra-ui/react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $insertNodeToNearestRoot } from "@lexical/utils";
import { $insertNodes, createCommand, LexicalCommand } from "lexical";
import { useEffect, useRef, useState } from "react";
import { ImageFill, Youtube } from "react-bootstrap-icons";
import { LOW_PRIORIRTY } from "../constants";

import { $createYouTubeNode, YouTubeNode } from "../nodes/YoutubeNode";
import Modal from "../Components/Modal";
import { INSERT_YOUTUBE_COMMAND } from "./YoutubePlugin";
import { InsertImagePayload } from "./ToolbarPlugin";
import { $createImageNode, ImageNode } from "../nodes/ImageNode";

export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> =
  createCommand("INSERT_IMAGE_COMMAND");

export default function ImagePlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error("ImagePlugin: ImageNode not registered on editor");
    }

    return editor.registerCommand<InsertImagePayload>(
      INSERT_IMAGE_COMMAND,
      (payload) => {
        const imageNode = $createImageNode(payload);
        $insertNodes([imageNode]);

        return false;
      },
      LOW_PRIORIRTY
    );
  }, [editor]);

  const [isOpen, setIsOpen] = useState(false);

  const [file, setFile] = useState<File>();
  const [url, setUrl] = useState<string>();

  const onUpload = () => {
    let src = "";
    if (file) src = URL.createObjectURL(file);
    if (url) src = url;
    const payload = {
      src,
      altText: "Sum image",
    };

    editor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
    setIsOpen(false);
    setUrl(undefined);
    setFile(undefined);
  };

  const imageRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <IconButton
        aria-label={"Upload Image"}
        icon={<ImageFill />}
        onClick={() => {
          setIsOpen(true);
        }}
        color="#444"
        size="sm"
        variant="ghost"
      />
      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        ref={imageRef}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) setFile(file);
        }}
      />
      <Modal
        title="Upload Image"
        onClose={() => setIsOpen(false)}
        isOpen={isOpen}
        footer={
          <>
            <Button
              variant="ghost"
              onClick={onUpload}
              isDisabled={!(file || url)}
            >
              Add Image
            </Button>
          </>
        }
      >
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Add Image URL"
        />
        <Button
          variant="ghost"
          onClick={() => imageRef?.current?.click()}
          mt={4}
        >
          {file ? file.name : "Upload Image"}
        </Button>
      </Modal>
    </>
  );
}
