import React, {useEffect, useRef, useState, useMemo} from "react";
import { Link } from "react-router-dom";

import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';


import { getBooks, tagToBook } from "../api/books";
import BookCard from "./bookCard";

/**
 * Käyttäjän tekemät arvostelut
 * 
 * @param {*} props 
 * @returns 
 */
function BookCollection(props) {
  const { state } = props;
  const { id } = state.useAuth()
  const [volume, setVolume] = useState([])  // fill volume with book data from Google Books based on tag
  const {lock, setLock} = useState(false)


  useEffect(() => {
    (async function fetchBooks(){
      const { data } = await getBooks(id)
      if(data){
        const tagged = []
        data.rows.forEach(async bid => {
          console.log(1)
          tagged.push(bid)
          //tagged.push( await tagToBook(bid))
        })

        //setVolume(tagged)
      }
    }())
    
  }, [id, volume, setVolume, lock])

  const theme = createTheme();

  return (
    <ThemeProvider theme={theme}>
    <CssBaseline />
    <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h3"
              align="center"
              color="text.primary"
              gutterBottom
            >
              My Collection
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
              This section contains all your favorite books in a single collection—You may 
              add more books or remove any extras as you wish.
            </Typography>
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Button variant="contained">Main call to action</Button>
              <Button variant="outlined">Secondary action</Button>
            </Stack>
    </Container>
    <Container sx={{ py: 8 }} maxWidth="md">
    <Grid container spacing={4}>
    {volume.map((card) => (
      <Grid item key={card.id} xs={12} sm={6} md={4}>
       
      </Grid>
    ))}

    </Grid>
    </Container>

    </ThemeProvider>
  );
}

export default BookCollection;

  