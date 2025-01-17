import React, {useEffect, useRef, useState, useMemo} from "react";
import {useNavigate} from 'react-router-dom'
import { Link as RouterLink } from "react-router-dom";
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { isRequired, validateEmail } from '../utils/inputValidation'

import  { login } from '../api/auth'

export default function Login(){
    const [errMessage, setMessage] = useState("")
    const [success, setSuccess] = useState(false)
    const [illegalPass, setPassErr] = useState(false)
    const [illegalEmail, setEmailErr] = useState(false)
    const navigate = useNavigate()
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        setPassErr(!isRequired(data.get('password')))

        if(illegalPass || illegalEmail){
          return
        }

        const credentials = {
            username: data.get('email'),
            password: data.get('password'),
            remember: event.currentTarget[4].checked
        }

        const [stat, token] = await login(credentials)
        setSuccess(!stat)
        setMessage(stat ? "token" : token)

        if(stat){
          console.log(token)
          
          navigate("/");
        }
    };


    function InfoPanel(props){
      return (
          <Typography variant="body2" color="red" align="center" {...props}>
              {success && errMessage}
          </Typography>
      )
  }

    const theme = createTheme();


    return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          
          <Typography component="h1" variant="h5">
            Sign In
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              error = { illegalEmail }
              helperText={illegalEmail && "Type a valid Email Address" }
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange= {(e) => { setEmailErr(!validateEmail(e.target.value)) }}
            />
            <TextField
              error = { illegalPass }
              helperText = { illegalPass && "Password must not be empty"}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox id="remember" value="remember" color="primary" />}
              label="Remember Me"
            />
            <InfoPanel sx={{ mb: 1, mt: 1}} />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <RouterLink to="/register" variant="body2">
                  {"Don't have an account? Register Now"}
                </RouterLink>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
    );
}