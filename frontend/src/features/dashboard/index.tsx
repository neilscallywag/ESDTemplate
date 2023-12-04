import { Box, Button, Heading, Text } from "@chakra-ui/react";

import { useAuth } from "~auth/AuthContext";

const Dashboard = () => {
  const {
    userName,
    userEmail,
    userRole,
    checkServiceOne,
    checkServiceTwo,
    checkServiceThree,
    checkUnknownEndpoint,
    checkUnknownService,
    logout,
  } = useAuth();

  return (
    <Box p={4}>
      <Heading size="lg" mb={4}>
        Dashboard
      </Heading>
      {/* Populate using userName userEmail and userRole. Add para stating to add more info edit authcontext */}
      <Text>{userName}</Text>
      <Text>{userEmail}</Text>
      <Text>{userRole}</Text>
      <Text>To add more info edit authcontext</Text>
      <Button onClick={checkServiceOne} colorScheme="green" mt={4}>
        Check service one
      </Button>
      <Button onClick={checkServiceTwo} colorScheme="green" mt={4}>
        Check service two
      </Button>
      <Button onClick={checkServiceThree} colorScheme="green" mt={4}>
        Check service three
      </Button>
      <Button onClick={checkUnknownEndpoint} colorScheme="red" mt={4}>
        Check not found error
      </Button>
      <Button onClick={checkUnknownService} colorScheme="red" mt={4}>
        Check not gateway error
      </Button>
      <Button onClick={logout} colorScheme="red" mt={4}>
        Logout
      </Button>
      {/* Add your dashboard components here */}
    </Box>
  );
};

export default Dashboard;
