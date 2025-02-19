"use client";
import { Box, Stack, Typography, Button, TextField, IconButton, styled, Container, Grid } from "@mui/material";
import { collection, getDoc, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import InventoryIcon from '@mui/icons-material/Inventory';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { onAuthStateChanged } from 'firebase/auth';
import { firestore, auth } from '@/firebase';
import { useRouter } from 'next/navigation';
import withAuth from '../protectedRoute';
import { GitHub, LinkedIn, Public } from '@mui/icons-material';
import useMediaQuery from '@mui/material/useMediaQuery';

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

const Header = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(1, 2),
  position: 'relative',
  width: '100%',
  padding: 10,
}));

const HeaderContent = styled(Container)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 0,
  margin: 0,
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

const Page = () => {
  const [pantry, setPantry] = useState([]);
  const [itemName, setItemName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userUid, setUserUid] = useState('');
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
        setUserUid(user.uid);
      } else {
        setUserEmail('');
        setUserUid('');
      }
    });
    return () => unsubscribe();
  }, []);

  const updatePantry = async () => {
    if (userUid) {
      const snapshots = collection(firestore, `pantry-${userUid}`);
      const docs = await getDocs(snapshots);
      const pantryList = [];
      docs.forEach((doc) => {
        pantryList.push({ name: doc.id, ...doc.data() });
      });
      setPantry(pantryList);
    }
  };

  useEffect(() => {
    if (userUid) {
      updatePantry();
    }
  }, [userUid]);

  const addItem = async (item) => {
    if (userUid) {
      const docRef = doc(firestore, `pantry-${userUid}`, item);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const { count } = docSnap.data();
        await setDoc(docRef, { count: count + 1 });
      } else {
        await setDoc(docRef, { count: 1 });
      }
      await updatePantry();
    }
  };

  const removeItem = async (item) => {
    if (userUid) {
      const docRef = doc(firestore, `pantry-${userUid}`, item);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const { count } = docSnap.data();
        if (count == 1) {
          await deleteDoc(docRef);
        } else {
          await setDoc(docRef, { count: count - 1 });
        }
      }
      await updatePantry();
    }
  };

  const ToHome = () => {
    router.push('/');
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ backgroundColor: '#16213e', minHeight: '100vh' }}>
        <Header>
          <HeaderContent maxWidth="lg">
            <InventoryIcon sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <a href="/" onClick={ToHome} style={{ color: 'white', textDecoration: 'none' }}>Pantry Buddy</a>
            </Typography>
          </HeaderContent>
        </Header>
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Box width="100%" display="flex" justifyContent="center" flexDirection="column" alignItems="center">
            <Grid container spacing={4} alignItems="flex-start" justifyContent="center">
              <Grid item xs={12} md={6}>
                <Card sx={{ bgcolor: '#2D2D2D' }}>
                  <CardContent>
                    <Stack width="100%" direction={isMobile ? 'column' : 'row'} spacing={2}>
                      <TextField label="Enter Item Name" variant="outlined" fullWidth value={itemName} onChange={(e) => setItemName(e.target.value)} />
                      <Button variant="contained" color="secondary" sx={{ color: '#000000' }} onClick={() => { addItem(itemName); setItemName(''); }}>
                        Add
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={12}>
                <Card sx={{ bgcolor: '#2D2D2D' }}>
                  <CardContent>
                    <Box width="100%" bgcolor="#0f0f10" display="flex" justifyContent="center" alignItems="center" paddingY={2}>
                      <Typography variant="h2" color="#ffffff" textAlign="center">
                        Pantry Items
                      </Typography>
                    </Box>
                    <Stack width="100%" spacing={2} overflow="auto" sx={{ maxHeight: '500px' }}>
                      {pantry.map(({ name, count }) => (
                        <Box key={name} display="flex" justifyContent="space-between" alignItems="center" bgcolor="#2D2D2D" color="#ffffff" paddingX={2}>
                          <Typography variant="h6">{name.charAt(0).toUpperCase() + name.slice(1)}</Typography>
                          <Box display="flex" alignItems="center">
                            <IconButton onClick={() => addItem(name)} sx={{ mx: 1, color: '#008000' }}>
                              <AddIcon />
                            </IconButton>
                            <Typography variant="body1" sx={{ mx: 2 }}> {count} </Typography>
                            <IconButton onClick={() => removeItem(name)} sx={{ mx: 1, color: '#FF0000' }}>
                              <RemoveIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Container>
        <Box sx={{ backgroundColor: '#16213e', color: '#ffffff', padding: 2, width: '100%', textAlign: 'center', mt: 4 }}>
          <Typography variant="h6">© Pantry Buddy 2024. Made by Ammar Khan</Typography>
          <Box display="flex" justifyContent="center" gap={2} mt={1}>
            <a href="https://github.com/Ammar-Khan18" style={{ display: 'flex', alignItems: 'center', color: 'inherit', textDecoration: 'none' }}>
              <GitHub />
            </a>
            <a href="https://www.linkedin.com/in/ammarbinaamirkhan/" style={{ display: 'flex', alignItems: 'center', color: 'inherit', textDecoration: 'none' }}>
              <LinkedIn />
            </a>
            <a href="https://ammar-khan18.github.io/Portfolio-Website/" style={{ display: 'flex', alignItems: 'center', color: 'inherit', textDecoration: 'none' }}>
              <Public />
            </a>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default withAuth(Page);
