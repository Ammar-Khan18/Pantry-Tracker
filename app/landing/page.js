'use client';

import { useRouter } from 'next/navigation';
import { Box, Button, Container, Typography, AppBar, Toolbar, CssBaseline, Paper } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import InventoryIcon from '@mui/icons-material/Inventory';

const theme = createTheme({
  palette: {
    primary: {
      main: '#16213e', // Dark blue/purple
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#e94560', // Red
    },
    background: {
      default: '#16213e', // Dark blue/purple background
    },
    text: {
      primary: '#ffffff', // White text
      secondary: '#e94560', // Red text
    },
  },
  typography: {
    h3: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 500,
    },
    body1: {
      fontWeight: 300,
    },
  },
});

const LandingPage = () => {
  const router = useRouter();

  const handleSignIn = () => {
    router.push('/signin');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" color="primary" elevation='0'>
        <Toolbar>
          <InventoryIcon sx={{color: '#FFFFFF', mr: 2}} />
          <Typography variant="h6" sx={{color: '#FFFFFF', flexGrow: 1}} component="div">
            Pantry Buddy
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{mt:5}}>

          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="70vh"
            textAlign="center"
          >
            <Typography variant="h3" component="h1" gutterBottom>
              Welcome to Pantry Buddy
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
              Revolutionize Your Kitchen
            </Typography>
            <Typography variant="body1" paragraph>
            Track, manage, and optimize your pantry effortlessly. Never run out of essentials!
            </Typography>
            <Button variant="contained" color="secondary" onClick={handleSignIn} sx={{ mt: 4 }}>
              Get Started
            </Button>
          </Box>
  
      </Container>
    </ThemeProvider>
  );
};

export default LandingPage;
