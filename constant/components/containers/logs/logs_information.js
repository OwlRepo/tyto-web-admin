import {
  CheckIcon,
  ChevronDownIcon,
  CloseIcon,
  DeleteIcon,
  EditIcon,
} from "@chakra-ui/icons";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  IconButton,
  ButtonGroup,
  Center,
  Heading,
  Input,
  Button,
  useToast,
  Tooltip,
} from "@chakra-ui/react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import updateAccountInformation from "../../../services/accounts/teacher/update_information";
import getScheduleIDs from "../../../services/schedules/get_schedule_ids";
const LogsInformationTable = ({ data }) => {
  console.log(data);
  return (
    <>
      <Center>
        <Heading>{"Logs Information"}</Heading>
      </Center>
      <TableContainer maxHeight={"50vh"} overflowY={"scroll"}>
        <Table variant="striped" colorScheme="facebook">
          <Thead>
            <Tr>
              <Th>Timestamp</Th>
              <Th>Admin Email</Th>
              <Th>User Email</Th>
              <Th>Action Type</Th>
              <Th>Description</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((data, index) => {
              return (
                <Tr key={index}>
                  <Td>{data.timestamp}</Td>
                  <Td>{data.admin_email}</Td>
                  <Td>{data.user_email}</Td>
                  <Td>{data.action}</Td>
                  <Td>{data.description}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default LogsInformationTable;
