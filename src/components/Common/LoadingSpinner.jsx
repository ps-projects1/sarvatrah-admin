// import { Box, CircularProgress, Typography } from "@mui/material";

// const LoadingSpinner = () => {
//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "center",
//         alignItems: "center",
//         height: "100vh",
//         gap: 2,
//         backgroundColor: "background.paper",
//       }}
//     >
//       <CircularProgress
//         size={60}
//         thickness={4}
//         sx={{
//           color: "primary.main",
//           animationDuration: "800ms",
//         }}
//       />
//       <Typography
//         variant="h6"
//         color="text.secondary"
//         sx={{
//           mt: 2,
//           fontWeight: 500,
//           letterSpacing: 0.5,
//         }}
//       >
//         Loading Application...
//       </Typography>
//     </Box>
//   );
// };

import { Box, CircularProgress, Typography, keyframes } from "@mui/material";
import logo from "../../assets/images/mainLogo.svg";

const pulse = keyframes`
  0% { transform: scale(0.95); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.8; }
`;

const LoadingSpinner = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        gap: 3,
        backgroundColor: "background.paper",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
      }}
    >
      <Box
        component="img"
        src={logo} // Your logo path
        alt="Loading"
        sx={{
          width: 120,
          mb: 2,
          animation: `${pulse} 2s infinite ease-in-out`,
        }}
      />
      <CircularProgress
        size={60}
        thickness={4}
        disableShrink
        sx={{
          color: "primary.main",
          animationDuration: "800ms",
        }}
      />
      <Typography
        variant="h6"
        color="text.secondary"
        sx={{
          mt: 2,
          fontWeight: 500,
          letterSpacing: 0.5,
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        }}
      >
        Loading...
      </Typography>
      <Typography
        variant="caption"
        color="text.disabled"
        sx={{
          position: "absolute",
          bottom: 40,
        }}
      >
        Securely loading your data
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;
