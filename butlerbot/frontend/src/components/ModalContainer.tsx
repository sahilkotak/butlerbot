import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  ModalHeader,
  Modal,
  Highlight,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

const ModalContainer = ({ showModal, setShowModal, onCheckoutCompletion }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    let timeout1;
    let timeout2;
    if (showModal.display) {
      timeout1 = setTimeout(() => {
        setShowContent(true);
      }, 5000);
      timeout2 = setTimeout(() => {
        setShowModal(false);
        onCheckoutCompletion();
      }, 10000);
    }
    // Cleanup timeouts when isOpen changes to false
    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
    // eslint-disable-next-line
  }, [showModal]);

  return (
    <Modal
      blockScrollOnMount={false}
      isOpen={showModal.display}
      onClose={() => {}}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {showModal.content ? "Please Pay" : "Oops, something went wrong"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {showContent && (
            <Text fontWeight="400" fontSize={"sm"} color="black" as="em">
              <Highlight
                query={["successful"]}
                styles={{ px: "2", py: "1", rounded: "full", bg: "green.100" }}
              >
                Your transaction was successful, please proceed to the counter
                to collect your order.
              </Highlight>
            </Text>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalContainer;
