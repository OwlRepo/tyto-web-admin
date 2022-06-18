import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Button,
  Input,
  VStack,
  Box,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  setDoc,
  getDocs,
  query,
  collection,
  onSnapshot,
  where,
} from "firebase/firestore";
import firestore_db from "../../../../configurations/firebase_init";
const SubjectsModal = ({ isOpen, onClose, subjects }) => {
  const [subjectsData, setSubjectsData] = useState([]);

  function readData() {
    const sectionPath = doc(
      firestore_db,
      "sections",
      subjects.schedule_id,
      subjects.section,
      subjects.section
    );
    const unsub = onSnapshot(sectionPath, (doc) => {
      const student = [];
      const subject = [];
      doc.data()?.students?.map((data) => {
        student.push(data);
      });
      doc.data()?.subjects?.map((data) => {
        subject.push(data);
      });
      setSubjectsData([...subject]);
      console.log(subjectsData);
    });
  }
  function ModalBodyContent() {
    useEffect(() => {
      readData();
    }, []);
    return (
      <>
        {subjectsData.length ? (
          <TableContainer maxH={"50vh"} overflowY={"scroll"}>
            <Table variant="striped" colorScheme="facebook">
              <Thead position={"sticky"}>
                <Tr>
                  <Th>Grade Level</Th>
                  <Th>Section</Th>
                  <Th>Subject</Th>
                  <Th>Time</Th>
                  <Th>Teacher</Th>
                  <Th>Teachers Email</Th>
                </Tr>
              </Thead>
              <Tbody>
                {subjectsData
                  ? subjectsData.map((data, index) => {
                      return (
                        <Tr key={index}>
                          <Td>{data.grade_level}</Td>
                          <Td>{data.section}</Td>
                          <Td>{data.name}</Td>
                          <Td>{data.time}</Td>
                          <Td>{data.teacher_name}</Td>
                          <Td>{data.teacher_email}</Td>
                        </Tr>
                      );
                    })
                  : `Start selecting for grade level to get started`}
              </Tbody>
            </Table>
          </TableContainer>
        ) : (
          <></>
        )}
      </>
    );
  }
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setSubjectsData([]);
        onClose();
      }}
      size={subjectsData.length ? "xxl" : "md"}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{"Student's Subjects"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <ModalBodyContent />
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={() => {
              setSubjectsData([]);
              onClose();
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SubjectsModal;
