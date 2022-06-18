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
import { async } from "@firebase/util";
import getScheduleIDs from "../../../../services/schedules/get_schedule_ids";
const SubjectsModal = ({ isOpen, onClose, schedule }) => {
  const [scheduleData, setScheduleData] = useState([]);
  const [scheduleIDs, setScheduleIDs] = useState([]);

  async function readData() {
    var schedules = [];
    if (schedule.email) {
      //GRADE SEVEN
      const ref = doc(firestore_db, "schedules", "GRADE-SEVEN");
      const datas = await getDoc(ref);

      schedules = schedules.concat(
        datas
          .data()
          .subjects.filter(
            ({ teacher_email }) => teacher_email === schedule.email
          )
      );

      //GRADE EIGHT
      const GRADE_EIGHT = doc(firestore_db, "schedules", "GRADE-EIGHT");

      const GEIGHT_REF = await getDoc(GRADE_EIGHT);

      schedules = schedules.concat(
        GEIGHT_REF.data().subjects?.filter(
          ({ teacher_email }) => teacher_email === schedule.email
        )
      );

      //GRADE NINE
      const GRADE_NINE = doc(firestore_db, "schedules", "GRADE-NINE");

      const GNINE_REF = await getDoc(GRADE_NINE);

      schedules = schedules.concat(
        GNINE_REF.data().subjects.filter(
          ({ teacher_email }) => teacher_email === schedule.email
        )
      );

      //GRADE TEN
      const GRADE_TEN = doc(firestore_db, "schedules", "GRADE-TEN");

      const GTEN_REF = await getDoc(GRADE_TEN);

      schedules = schedules.concat(
        GTEN_REF.data().subjects.filter(
          ({ teacher_email }) => teacher_email === schedule.email
        )
      );
      setScheduleData(schedules);
      console.log(scheduleData);
    }

    // setScheduleData((scheduleData) => [...scheduleData, schedules]);
  }
  function ModalBodyContent() {
    useEffect(async () => {
      await readData();
    }, []);
    return (
      <>
        {scheduleData.length ? (
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
                {scheduleData
                  ? scheduleData.map((data, index) => {
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
        setScheduleData([]);
        onClose();
      }}
      size={scheduleData?.length ? "xxl" : "md"}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{"Teacher's Schedule"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <ModalBodyContent />
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={() => {
              setScheduleData([]);
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
