import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  ModalHeader,
  Modal,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BiLogoCreativeCommons } from "react-icons/bi";

const ModalContainer = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [showContent, setShowContent] = useState(false);
  useEffect(() => {
    let timeout1;
    let timeout2;
    if (isOpen) {
      timeout1 = setTimeout(() => {
        setShowContent(true);
      }, 3000);
      timeout2 = setTimeout(() => {
        setIsOpen(false);
      }, 6000);
    }
    // Cleanup timeouts when isOpen changes to false
    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, [isOpen]);

  return (
    <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={() => {}}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Display your card to complete your transaction
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontWeight="bold" mb="1rem" color="#000">
            {showContent &&
              "Your Your transaction was successful, please proceed to the counter"}
          </Text>
          <BiLogoCreativeCommons count={2} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalContainer;
