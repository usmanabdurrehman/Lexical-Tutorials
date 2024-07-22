import { Box, IconButton, useOutsideClick } from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { SketchPicker } from "react-color";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  icon: React.ReactElement;
}

export default function ColorPicker({
  color,
  onChange,
  icon,
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useOutsideClick({ ref, handler: () => setIsOpen(false) });

  return (
    <Box pos={"relative"}>
      <IconButton
        icon={icon}
        aria-label="Change Color"
        size="sm"
        variant="ghost"
        color="#333"
        onClick={() => setIsOpen(true)}
      />
      {isOpen && (
        <Box
          pos="absolute"
          top={"30px"}
          left={"30px"}
          zIndex={10}
          ref={ref}
          userSelect="none"
        >
          <SketchPicker
            color={color}
            onChangeComplete={(color) => {
              onChange(color.hex);
            }}
          />
        </Box>
      )}
    </Box>
  );
}
