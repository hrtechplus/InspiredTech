import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Center,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
  Text,
} from "@chakra-ui/react";

const ParcelForm = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [parcelData, setParcelData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (parcelData && parcelData.user) {
      return; // Exit if user details are already fetched
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/parcels/${trackingNumber}`
        );
        setParcelData(response.data.parcel);
        setError(null); // Clear any previous errors

        // Retrieve user details concurrently
        const userResponse = await axios.get(
          `http://localhost:5000/parcels/${trackingNumber}`
        );
        setParcelData((prevData) => ({
          ...prevData,
          user: userResponse.data.user, // Attach user details to parcel data
        }));
      } catch (error) {
        setError(
          "Error fetching parcel data. Please check the tracking number."
        );
        console.error("Error fetching parcel data:", error);
      }
    };

    if (trackingNumber) {
      fetchData(); // Fetch data only if tracking number is provided
    }
  }, [trackingNumber, parcelData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Reset parcelData and error state to trigger useEffect
    setParcelData(null);
    setError(null);
  };

  const handleInputChange = (e) => {
    setTrackingNumber(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const handleNewSearch = () => {
    setTrackingNumber(""); // Clear the input field
  };

  return (
    <Center>
      <Box w="400px" p="20px" bg="gray.100" borderRadius="lg" boxShadow="lg">
        <VStack spacing={4} align="center">
          <form onSubmit={handleSubmit}>
            <FormControl>
              <FormLabel>Enter Tracking Number</FormLabel>
              <Input
                type="text"
                placeholder="Enter Tracking Number"
                value={trackingNumber}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress} // Trigger handleSubmit on Enter key press
              />
            </FormControl>
            <Button colorScheme="teal" type="submit">
              Search
            </Button>
          </form>
          {error && <Text color="red">{error}</Text>}
          {parcelData && (
            <Box>
              <Table variant="striped" colorScheme="teal">
                <Thead>
                  <Tr>
                    <Th>Parcel ID</Th>
                    <Th>Status</Th>
                    {/* Add more columns as needed */}
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>{parcelData.parcelId}</Td>
                    <Td>{parcelData.status}</Td>
                    {/* Map other parcel data here */}
                  </Tr>
                </Tbody>
              </Table>
              {parcelData.user && (
                <Box mt={4}>
                  <Text fontSize="lg" fontWeight="bold">
                    User Details:
                  </Text>
                  <Text>Username: {parcelData.user.username}</Text>
                  <Text>Email: {parcelData.user.email}</Text>
                  {/* Add more user details if needed */}
                </Box>
              )}
              <Button mt={4} colorScheme="teal" onClick={handleNewSearch}>
                New Search
              </Button>
            </Box>
          )}
        </VStack>
      </Box>
    </Center>
  );
};

export default ParcelForm;
