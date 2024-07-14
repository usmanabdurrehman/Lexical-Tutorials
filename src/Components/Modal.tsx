import React from "react";
import {
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

interface CustomModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  footer: React.ReactNode;
}

export default function Modal({
  title,
  isOpen,
  onClose,
  children,
  footer,
}: CustomModalProps) {
  return (
    <ChakraModal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>
        <ModalFooter>{footer}</ModalFooter>
      </ModalContent>
    </ChakraModal>
  );
}
