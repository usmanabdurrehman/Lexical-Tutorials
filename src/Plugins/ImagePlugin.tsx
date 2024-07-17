import { Button, IconButton, Input } from "@chakra-ui/react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $insertNodes } from "lexical";
import { useRef, useState } from "react";
import { ImageFill } from "react-bootstrap-icons";

import Modal from "../Components/Modal";
import { $createImageNode } from "../nodes/ImageNode";

export default function ImagePlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

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
    editor.update(() => {
      const imageNode = $createImageNode(payload);
      $insertNodes([imageNode]);
    });

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
          if (file) {
            setFile(file);
          }
          if (imageRef.current) imageRef.current.files = null;
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
