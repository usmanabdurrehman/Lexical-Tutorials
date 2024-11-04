import { Button, IconButton, Input } from "@chakra-ui/react";
import { useState } from "react";
import { Mic, Youtube } from "react-bootstrap-icons";
import Modal from "../Components/Modal";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $insertNodes } from "lexical";
import { $createAudioNode } from "../nodes/AudioNode";

export default function AudioPlugin() {
  const [editor] = useLexicalComposerContext();

  const onEmbed = () => {
    editor.update(() => {
      const node = $createAudioNode({ url: "sample_audio.mp3" });
      $insertNodes([node]);
    });
  };

  return (
    <div>
      <IconButton
        icon={<Mic />}
        aria-label="Embed Youtube Video"
        size="sm"
        variant="ghost"
      />
    </div>
  );
}
