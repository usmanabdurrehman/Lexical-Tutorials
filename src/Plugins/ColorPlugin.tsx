import React, { useEffect, useState } from "react";
import { PaintBucket, Type } from "react-bootstrap-icons";
import ColorPicker from "../Components/ColorPicker";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import {
  $patchStyleText,
  $getSelectionStyleValueForProperty,
} from "@lexical/selection";
import { mergeRegister } from "@lexical/utils";
import { LOW_PRIORIRTY } from "../constants";

export default function ColorPlugin() {
  const [editor] = useLexicalComposerContext();
  const [{ color, bgColor }, setColors] = useState({
    color: "#000",
    bgColor: "#fff",
  });

  const updateToolbar = () => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const color = $getSelectionStyleValueForProperty(
        selection,
        "color",
        "#000"
      );
      const bgColor = $getSelectionStyleValueForProperty(
        selection,
        "background",
        "#fff"
      );
      setColors({ color, bgColor });
    }
  };

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (payload) => {
          updateToolbar();
          return false;
        },
        LOW_PRIORIRTY
      )
    );
  }, [editor]);

  const updateColor = ({
    property,
    color,
  }: {
    property: "background" | "color";
    color: string;
  }) => {
    editor.update(() => {
      const selection = $getSelection();
      if (selection) $patchStyleText(selection, { [property]: color });
    });
  };

  return (
    <>
      <ColorPicker
        color={color}
        onChange={(color) => {
          updateColor({ property: "color", color });
        }}
        icon={<Type />}
      />
      <ColorPicker
        color={bgColor}
        onChange={(color) => {
          updateColor({ property: "background", color });
        }}
        icon={<PaintBucket />}
      />
    </>
  );
}
