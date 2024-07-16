import { Box, IconButton, useOutsideClick } from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { SketchPicker } from "react-color";

interface ColorPickerProps {
  icon: React.ReactElement;
  color: string;
  onChange: (color: string) => void;
}

export default function ColorPicker({
  icon,
  color,
  onChange,
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick({
    ref,
    handler: () => setIsOpen(false),
  });

  return (
    <Box pos="relative">
      <IconButton
        aria-label={"Change Color"}
        icon={icon}
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
          userSelect="none"
          zIndex={10}
          ref={ref}
        >
          <SketchPicker
            onChangeComplete={(color) => {
              onChange(color.hex);
            }}
            color={color}
          />
        </Box>
      )}
    </Box>
  );
}
