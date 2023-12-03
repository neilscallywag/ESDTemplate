import { useEffect } from "react";
import { Box, Center, Text } from "@chakra-ui/react";
import { motion, useCycle } from "framer-motion";

const MotionBox = motion(Box);

const AnimatedLoader = () => {
  const [scale, cycleScale] = useCycle(1, 1.1);
  const [y, cycleY] = useCycle(0, -10);

  useEffect(() => {
    const interval = setInterval(() => {
      cycleScale();
      cycleY();
    }, 500);

    return () => clearInterval(interval);
  }, [cycleScale, cycleY]);

  return (
    <MotionBox
      as="div"
      w="100px"
      h="100px"
      borderRadius="50%"
      bg="blue.500"
      position="relative"
      display="flex"
      alignItems="center"
      justifyContent="center"
      initial={{ scale: 1, y: 0 }}
      animate={{ scale: scale, y: y }}
      exit={{ scale: 0 }}
      transition={{ type: "tween", duration: 0.5 }}
    >
      <motion.svg
        width="130%"
        height="130%"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ yoyo: Infinity, duration: 0.8 }}
        style={{
          position: "absolute",
          top: "-5px",
          left: "-21px",
        }}
      >
        {/* Hand-drawn irregular circle */}
        <path
          d="M50,5 C70,10, 95,20, 90,50 C85,80, 20,90, 15,50 C10,20, 30,0, 50,5"
          fill="blue.500"
          stroke="black"
          strokeWidth="2"
        />
      </motion.svg>
      <Text as="h2" color="white" fontSize="xl" fontWeight="bold" zIndex="1">
        C4SR
      </Text>
    </MotionBox>
  );
};

const SuspenseFallback = () => (
  <Box position="fixed" top="0" bottom="0" left="0" right="0" bg="#EDF2F7">
    <Center height="100vh">
      <AnimatedLoader />
    </Center>
  </Box>
);

export default SuspenseFallback;
