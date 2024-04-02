import React, { useState, useEffect } from "react";
import "../css/style.css";
import SideNavigation from "./Component/SideNavigation";
import {
  Badge,
  Image,
  Grid,
  GridItem,
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Flex,
  Input,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  IconButton,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Collapse,
  Progress,
  Spacer,
} from "@chakra-ui/react";
import {
  SearchIcon,
  RepeatIcon,
  DeleteIcon,
  EditIcon,
  AddIcon,
} from "@chakra-ui/icons";
import axios from "axios";

const AdminPanel = () => {
  const [parcels, setParcels] = useState([]);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editParcel, setEditParcel] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [deleteParcelId, setDeleteParcelId] = useState(null);
  const [showFooter, setShowFooter] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchParcels();
  }, []);

  const fetchParcels = async () => {
    try {
      const response = await axios.get("http://localhost:5000/admin/parcels");
      setParcels(response.data);
    } catch (error) {
      console.error("Error fetching parcels:", error);
    }
  };

  const handleDeleteParcel = async (trackingNumber) => {
    try {
      await axios.delete(
        `http://localhost:5000/admin/parcels/${trackingNumber}`
      );
      fetchParcels();
      toast({
        title: "Parcel Deleted",
        description: "The parcel has been successfully deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting parcel:", error);
      toast({
        title: "Error",
        description: "Failed to delete parcel. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRefresh = () => {
    fetchParcels();
  };

  const handleInputChange = (e) => {
    setTrackingNumber(e.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/admin/parcels/${trackingNumber}`
      );
      setParcels([response.data]);
    } catch (error) {
      console.error("Error searching parcel:", error);
      toast({
        title: "Error",
        description: "Failed to search for parcel. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEditParcel = (parcel) => {
    setEditMode(true);
    setEditParcel(parcel);
    setIsModalOpen(true);
  };
  const handleUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/user/:email");
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(
        `http://localhost:5000/admin/parcels/${editParcel.trackingNumber}`,
        editParcel
      );
      setEditMode(false);
      fetchParcels();
      setIsModalOpen(false);
      toast({
        title: "Parcel Updated",
        description: "The parcel has been successfully updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error updating parcel:", error);
    }
  };

  const handleEditInputChange = (e, key) => {
    setEditParcel({
      ...editParcel,
      [key]: e.target.value,
    });
  };

  const handleDeleteConfirmation = (trackingNumber) => {
    setIsDeleteAlertOpen(true);
    setDeleteParcelId(trackingNumber);
  };

  const handleDeleteCancel = () => {
    setIsDeleteAlertOpen(false);
    setDeleteParcelId(null);
  };

  const handleDeleteConfirm = async () => {
    if (deleteParcelId) {
      await handleDeleteParcel(deleteParcelId);
      setIsDeleteAlertOpen(false);
    }
  };

  const toggleFooter = () => {
    setShowFooter(!showFooter);
  };

  return (
    <Grid
      templateAreas={`"nav main"`}
      gridTemplateRows={"1fr"}
      gridTemplateColumns={"250px 1fr"}
      h="100vh"
      gap="1"
    >
      <GridItem pl="2" area={"nav"}>
        <SideNavigation />
      </GridItem>

      <GridItem pl="2" area={"main"} className="grid_second">
        <Center h="100%">
          <Box
            p={8}
            boxShadow="2xl"
            borderRadius="xl"
            m={4}
            width="100%"
            className="adminPanel"
            overflow="hidden"
          >
            <Stack spacing={4} mb={4} direction="row" align="center">
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter tracking number"
                  value={trackingNumber}
                  onChange={handleInputChange}
                />
              </FormControl>
              <IconButton
                className="btn search-btn"
                icon={<SearchIcon />}
                onClick={handleSearch}
              ></IconButton>

              <IconButton
                className="btn refresh-btn"
                aria-label="Refresh parcels"
                icon={<RepeatIcon />}
                onClick={handleRefresh}
              />
              <Button
                className="btn search-btn"
                leftIcon={<AddIcon />}
                onClick={handleUsers}
              >
                Add
              </Button>
            </Stack>

            <Box height="calc(100% - 120px)" overflowY="auto">
              <Table variant="simple">
                <Thead>
                  <Tr boxShadow="md">
                    <Th>Parcel ID</Th>
                    <Th>Status</Th>
                    <Th>Hand Over Date</Th>
                    <Th>Delivery Fee</Th>
                    <Th>Tracking Number</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody className="table_body">
                  {parcels.map((parcel) => (
                    <Tr key={parcel._id} boxShadow="xs" rounded="md">
                      <Td>
                        {" "}
                        <Badge>{parcel.parcelId}</Badge>
                      </Td>

                      <Td>
                        {parcel.status}{" "}
                        <Progress
                          value={
                            parcel.status === "Delivered"
                              ? 100
                              : parcel.status === "In Transit"
                              ? 50
                              : parcel.status === "Pending"
                              ? 10
                              : 0
                          }
                          size="xs"
                          colorScheme={
                            parcel.status === "Delivered"
                              ? "green"
                              : parcel.status === "In Transit"
                              ? "orange"
                              : parcel.status === "Pending"
                              ? "yellow"
                              : 0
                          }
                        />
                      </Td>
                      <Td fontSize={"sm"}>
                        {
                          new Date(parcel.handOverDate)
                            .toISOString()
                            .split("T")[0]
                        }
                      </Td>
                      <Td>{parcel.deliveryCost}</Td>
                      <Td>{parcel.trackingNumber}</Td>
                      <Td>
                        <IconButton
                          className=" btn edit_btn"
                          aria-label="Edit parcel"
                          icon={<EditIcon color={"#525CEB"} />}
                          onClick={() => handleEditParcel(parcel)}
                        />
                        <IconButton
                          className="btn delete-btn"
                          aria-label="Delete parcel"
                          icon={<DeleteIcon color={"#B31312"} />}
                          onClick={() =>
                            handleDeleteConfirmation(parcel.trackingNumber)
                          }
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>

            <Collapse in={showFooter} animateOpacity>
              <Box mt={4} p={4} bg="gray.100" borderRadius="md">
                <Text fontWeight="bold" mb={2}>
                  Developer Details:
                </Text>
                <Text>Name: John Doe</Text>
                <Text>Email: john.doe@example.com</Text>
              </Box>
            </Collapse>
          </Box>

          {/* Edit Parcel Modal */}
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Edit Parcel</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl mb={4}>
                  <FormLabel>Parcel ID</FormLabel>
                  <Input
                    type="text"
                    value={editParcel?.parcelId}
                    onChange={(e) => handleEditInputChange(e, "parcelId")}
                  />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Status</FormLabel>
                  <Input
                    type="text"
                    value={editParcel?.status}
                    onChange={(e) => handleEditInputChange(e, "status")}
                    placeholder="In Transit, Delivered, Pending"
                  />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Hand Over Date</FormLabel>
                  <Input
                    type="date"
                    value={editParcel?.handOverDate}
                    onChange={(e) => handleEditInputChange(e, "handOverDate")}
                  />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Delivery Cost</FormLabel>
                  <Input
                    type="number"
                    value={editParcel?.deliveryCost}
                    onChange={(e) => handleEditInputChange(e, "deliveryCost")}
                  />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="teal" onClick={handleSaveEdit}>
                  Save
                </Button>
                <Button
                  colorScheme="gray"
                  ml={3}
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* Delete Parcel Confirmation Dialog */}
          <AlertDialog
            isOpen={isDeleteAlertOpen}
            leastDestructiveRef={undefined}
            onClose={handleDeleteCancel}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader>Delete Parcel</AlertDialogHeader>
                <AlertDialogBody>
                  Are you sure you want to delete this parcel? This action
                  cannot be undone.
                </AlertDialogBody>
                <AlertDialogFooter>
                  <Button colorScheme="red" onClick={handleDeleteConfirm}>
                    Delete
                  </Button>
                  <Button onClick={handleDeleteCancel}>Cancel</Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </Center>
      </GridItem>
    </Grid>
  );
};

export default AdminPanel;
