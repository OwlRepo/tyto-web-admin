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
import updateAccountInformation from "../../../services/accounts/student/update_information";
import getScheduleIDs from "../../../services/schedules/get_schedule_ids";
const AccountInformationTable = ({ data, refreshList }) => {
  const [isEditingAccountInfo, setIsEditingAccountInfo] = useState(false);
  const [scheduleIDs, setScheduleIDs] = useState(undefined);
  const [selectedScheduleID, setSelectedScheduleID] = useState(
    data[0].schedule_id
  );
  const [newFullName, setNewFullName] = useState(data[0].fullname);
  const [newPassword, setNewPassword] = useState(data[0].password);
  const toast = useToast();
  const submitUpdate = async () => {
    const updateResult = await updateAccountInformation({
      email: data[0].email,
      fullname: newFullName,
      schedule_id: selectedScheduleID,
      password: newPassword,
    });

    if (updateResult.success) {
      refreshList();
    } else {
      toast({
        title: "Update Failed",
        description: updateResult.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Center>
        <Heading>
          {isEditingAccountInfo ? "Update Information" : "Account Information"}
        </Heading>
      </Center>
      <TableContainer>
        <Table variant="striped" colorScheme="facebook">
          <Thead>
            <Tr>
              <Th>Email</Th>
              <Th>Password</Th>
              <Th>Fullname</Th>
              <Th>Schedule ID</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>{data[0].email}</Td>
              <Td>
                {isEditingAccountInfo && scheduleIDs !== undefined ? (
                  <Input
                    type={"password"}
                    backgroundColor={"white"}
                    variant={"filled"}
                    defaultValue={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                  />
                ) : (
                  `******`
                )}
              </Td>
              <Td>
                {isEditingAccountInfo && scheduleIDs !== undefined ? (
                  <Input
                    backgroundColor={"white"}
                    variant={"filled"}
                    defaultValue={newFullName}
                    onChange={(event) => setNewFullName(event.target.value)}
                  />
                ) : (
                  data[0].fullname
                )}
              </Td>
              <Td>
                {isEditingAccountInfo && scheduleIDs !== undefined ? (
                  <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                      {selectedScheduleID}
                    </MenuButton>
                    <MenuList>
                      {scheduleIDs.map((data, index) => {
                        return (
                          <MenuItem
                            key={index}
                            onClick={() => setSelectedScheduleID(data.id)}
                          >
                            {data.id}
                          </MenuItem>
                        );
                      })}
                    </MenuList>
                  </Menu>
                ) : (
                  data[0].schedule_id
                )}
              </Td>
              <Td>
                {isEditingAccountInfo && scheduleIDs !== undefined ? (
                  <ButtonGroup>
                    <IconButton
                      backgroundColor={"green.500"}
                      icon={<CheckIcon color={"white"} />}
                      onClick={submitUpdate}
                    />
                    <IconButton
                      backgroundColor={"red.500"}
                      icon={<CloseIcon color={"white"} />}
                      onClick={() =>
                        setIsEditingAccountInfo(!isEditingAccountInfo)
                      }
                    />
                  </ButtonGroup>
                ) : (
                  <ButtonGroup>
                    <Tooltip label={"Edit"}>
                      <IconButton
                        colorScheme={"facebook"}
                        icon={<EditIcon />}
                        onClick={async () => {
                          setScheduleIDs(await getScheduleIDs());
                          setSelectedScheduleID(data[0].schedule_id);
                          setIsEditingAccountInfo(!isEditingAccountInfo);
                          setNewFullName(data[0].fullname);
                        }}
                      />
                    </Tooltip>
                  </ButtonGroup>
                )}
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default AccountInformationTable;
