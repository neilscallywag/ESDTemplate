import React from 'react';
import { GoogleLoginButton } from 'react-social-login-buttons';
import { Box } from '@chakra-ui/react';

import { useAuth } from '~features/auth';

const LandingPage: React.FC = () => {
  const { googleAuth } = useAuth();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh" // Set a specific height to center vertically
    >
      <GoogleLoginButton onClick={googleAuth} />
    </Box>
  );
};

export default LandingPage;
