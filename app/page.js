"use client"
import { Box, Stack, Typography, Button, TextField, Toolbar, IconButton, styled, Container} from "@mui/material";
import { firestore } from "@/firebase";
import { collection, getDoc, getDocs, query, setDoc,doc, deleteDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import InventoryIcon from '@mui/icons-material/Inventory';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { createTheme, makeStyles, ThemeProvider} from '@mui/material/styles';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import WebIcon from '@mui/icons-material/Web';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  gap: 3,
};

const theme = createTheme({
  palette: {
    primary: {
      main: '#d5d5d6',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FF0000',
    },
    error: {
      main: '#dc2626',
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
        },
      },
    },
  },
});

const Header = styled(Box)(({ theme }) => ({
  backgroundColor: '#e6e6e6',
  color: '#000000',
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
    flexDirection: 'row',
    alignItems: 'center',
  },
}));

export default function Home() {
  const [pantry, setPantry] = useState([])

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [itemName, setItemName] = useState('')

  const updatePantry = async () => {
    const snapshots = query(collection(firestore, 'pantry'))
    const docs = await getDocs(snapshots) 
    const pantryList = []
    docs.forEach((doc) => {
      pantryList.push({name: doc.id, ...doc.data()})
    })
    console.log(pantryList)
    setPantry(pantryList)
  }

  useEffect(() => {
    updatePantry()
  }, [])

const addItem = async (item) => {
  const docRef = doc(collection(firestore,'pantry'),item)
  //Check if exists
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    const {count} = docSnap.data()
    await setDoc(docRef, {count: count + 1})
  } else {
    await setDoc(docRef, {count: 1})
  }
  await updatePantry()
}

const removeItem = async (item) => {
  const docRef = doc(collection(firestore,'pantry'),item)
  const docSnap = await getDoc(docRef)
  if(docSnap.exists()) {
    const {count} = docSnap.data()
    if(count == 1) {
      await deleteDoc(docRef)
    } else {
      await setDoc(docRef, {count: count - 1})
    }
  }
  await updatePantry()
}

  return(
    <ThemeProvider theme={theme}>
      {/*Header*/}
      <Header>
        <HeaderContent maxWidth='2000'>
          <InventoryIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Pantry Buddy
          </Typography>
        </HeaderContent>
      </Header>
      <Box width="100vw" height="100vh" display={"flex"} justifyContent={"center"} flexDirection={"column"} alignItems={"center"} bgcolor={'#3d3d43'}>
        <Box display={'flex'} flexDirection={{xs:'row', md:'column'}} gap={2}>
          {/*Input Field for items*/}
          <Card borderradius={4} boxShadow={'0 4px 8px rgba(0,0,0,0.1)'} sx={{bgcolor: '#e6e6e6'}}>
            <CardContent>
              <Stack width="100%" direction={'row'} spacing={2}>
              <TextField label="Enter Item Name" variant="outlined" fullWidth value={itemName} onChange={(e) => setItemName(e.target.value)}/>
              <Button variant="contained" sx={{backgroundColor: '#d5d5d6', color: '#000000'}}
              onClick={() => {
                addItem(itemName) 
                setItemName('')
                handleClose()}}
                >Add</Button>
              </Stack>
            </CardContent> 
          </Card>
          {/*Pantry Items Display*/}
          <Card borderradius={4} boxShadow={'0 4px 8px rgba(0,0,0,0.1)'} sx={{bgcolor: '#e6e6e6'}}>
            <CardContent>
              <Box width="800px" height="85px" bgcolor={'#0f0f10'} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                <Typography variant={'h2'} color={'#ffffff'} textAlign={'center'}>
                  Pantry Items
                </Typography>
              </Box>
              <Stack width="800px" height="500px" spacing={2} overflow={'auto'}>
                {pantry.map(({name, count}) => (
                    <Box key={name} width="100%" minHeight="40px" display={"flex"} justifyContent={"space-between"} alignItems={"center"} bgcolor={'#e6e6e6'} color={'#000000'} paddingX={5}>
                      <Typography variant="h6">{name.charAt(0).toUpperCase() + name.slice(1)}</Typography>
                      <Box display="flex" alignItems="center">
                        <IconButton onClick={() => addItem(name)} sx={{ mx: 1, color: '#008000' }}>
                          <AddIcon />
                        </IconButton>
                        <Typography variant="body1" sx={{ mx: 2 }}> {count} </Typography>
                        <IconButton onClick={() => removeItem(name)} sx={{ mx: 1, color: '#FF0000' }} >
                          <RemoveIcon />
                        </IconButton>
                      </Box>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Box>
      {/*Footer*/}
      <Box sx={{backgroundColor: '#3d3d43', color: '#000000', spacing: 2, bottom: 0, width: '100%'}} padding={2}>
        <Typography variant="h6" textAlign={'left'}> © Pantry Buddy 2024 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .Made by Ammar Khan</Typography>
        <Box sx={{backgroundColor: '#3d3d43', color: '#000000', bottom: 0, width: '100%'}} padding={2} justifyContent={'center'} display={'flex'}>
            <a href="https://github.com/Ammar-Khan18" style={{ display: 'flex', alignItems: 'center', color: 'inherit', textDecoration: 'none' }}>
              <GitHubIcon />
            </a>
            <a href="https://www.linkedin.com/in/ammarbinaamirkhan/" style={{ display: 'flex', alignItems: 'center', color: 'inherit', textDecoration: 'none' }}>
              <LinkedInIcon />
            </a>
            <a href="https://ammar-khan18.github.io/Portfolio-Website/" style={{ display: 'flex', alignItems: 'center', color: 'inherit', textDecoration: 'none' }}>
              <WebIcon />
            </a>
        </Box>
      </Box>
    </ThemeProvider>
  )
}
