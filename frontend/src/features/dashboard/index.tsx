import { Box, Button, Heading, Text } from "@chakra-ui/react";

import { useAuth } from "~auth/AuthContext";

const Dashboard = () => {
  const { userName, userEmail, userRole, logout } = useAuth();

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
      <Button onClick={logout} colorScheme="red" mt={4}>
        Logout
      </Button>
      {/* Add your dashboard components here */}
    </Box>
  );
};

export default Dashboard;
