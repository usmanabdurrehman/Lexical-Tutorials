import { Box, ButtonGroup, Flex, IconButton, Select } from "@chakra-ui/react";
import { css } from "@emotion/css";

export default function ToolbarPlugin() {
  return (
    <Flex gap={4}>
      <ButtonGroup
        size="xs"
        isAttached
        variant="ghost"
        color="#444"
        className={css({
          "& > button": { borderRadius: 0 },
          alignItems: "center",
        })}
      ></ButtonGroup>
    </Flex>
  );
}
