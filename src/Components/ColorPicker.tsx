import { Box, Button, Grid, GridItem } from "@chakra-ui/react";
import React from "react";

const COLORS = [
  "#FF6633",
  "#FFB399",
  "#FF33FF",
  "#FFFF99",
  "#00B3E6",
  "#E6B333",
  "#3366E6",
  "#999966",
  "#99FF99",
  "#B34D4D",
];

interface ColorPickerProps {
  onClick: (color: string) => void;
}

export default function ColorPicker({ onClick }: ColorPickerProps) {
  return (
    <Grid templateColumns="repeat(5, 1fr)" gap={2} p={3}>
      {COLORS.map((color) => (
        <GridItem>
          <Box
            userSelect={"none"}
            height={2}
            width={2}
            bg={color}
            cursor="pointer"
            borderRadius="2px"
            _hover={{ bg: color }}
            minWidth={0}
            onClick={() => onClick(color)}
          ></Box>
        </GridItem>
      ))}
    </Grid>
  );
}
