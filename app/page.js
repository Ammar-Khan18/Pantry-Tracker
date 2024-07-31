"use client"
import { Box, Stack, Typography, Button, Modal, TextField, AppBar, Toolbar, IconButton } from "@mui/material";
import { firestore } from "@/firebase";
import { collection, getDoc, getDocs, query, setDoc,doc, deleteDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import InventoryIcon from '@mui/icons-material/Inventory';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

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
    <Box
    width="100vw"
    height="100vh"
    display={"flex"}
    justifyContent={"center"}
    flexDirection={"column"}
    alignItems={"center"}
    gap={2}>
      {/*App Bar*/}
      <AppBar position="static" sx={{ mb: 1 }}>
        <Toolbar>
          <InventoryIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Pantry Buddy
          </Typography>
        </Toolbar>
      </AppBar>
      {/*Input Field for items*/}
      <Box>
        <Stack width="100%" direction={'row'} spacing={2}>
        <TextField label="Item" variant="outlined" fullWidth value={itemName} onChange={(e) => setItemName(e.target.value)}/>
        <Button variant="contained" 
        onClick={() => {
          addItem(itemName) 
          setItemName('')
          handleClose()}}
          >Add</Button>
        </Stack>
      </Box>
      
      <Box border={'1px solid #333'}>
        <Box width="800px" height="100px" bgcolor={'#ADD8E6'} display={"flex"} justifyContent={"center"} alignItems={"center"}>
          <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
            Pantry Items
          </Typography>
        </Box>
        <Stack width="800px" height="500px" spacing={2} overflow={'auto'}>
          {pantry.map(({name, count}) => (
              <Box
                key={name}
                width="100%"
                minHeight="150px"
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
                bgcolor={'#f0f0f0'}
                paddingX={5}>
                <Typography variant="h6">{name}</Typography>
                  <Box display="flex" alignItems="center">
                    <IconButton
                      color="primary"
                      onClick={() => addItem(name)}
                      sx={{ mx: 1 }}
                    >
                      <AddIcon />
                    </IconButton>
                    <Typography variant="body1" sx={{ mx: 2 }}>
                      {count}
                    </Typography>
                    <IconButton
                      color="secondary"
                      onClick={() => removeItem(name)}
                      sx={{ mx: 1 }}
                    >
                      <RemoveIcon />
                    </IconButton>
                  </Box>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
