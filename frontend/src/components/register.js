import React, {useEffect, useRef, useState, useMemo} from "react";
import { Link as RouterLink } from "react-router-dom";
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { isRequired, validateEmail } from '../utils/inputValidation'

import  { register } from '../api/auth'

export default function Register(){
    const [err, setErr] = useState(false)
    const [UserErr, setUserErr] = useState(true)
    const [SurErr, setSurErr] = useState(true)
    const [pwdMatch, setPwdMatch] = useState(true)
    const [success, setSuccess] = useState(false)
    const [errMessage, setMessage] = useState("")
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        setSuccess(false)
        const data = new FormData(event.currentTarget);

        const credentials = {
            fullname: data.get('name'),
            lastname: data.get('lastname'),
            username: data.get('email'),
            password: data.get('lpassword')
        }

        validatePasswords(credentials.password, data.get('rpassword'))
        setUserErr(isRequired(credentials.fullname))
        setSurErr(isRequired(credentials.lastname))

        if(!pwdMatch || err){
            return
        }

        console.log(credentials);

        const [stat, token] = await register(credentials)
        setSuccess(true) 
        setMessage( stat ? parseResponse(token) : parseErrors(token))
        
    };

    function parseResponse(res) {
        return res.message
    }

    function parseErrors(errors){
        let ret = ''
        errors.forEach(err => {
            ret += err.param + " : " + err.msg + " "
        })

        return ret;
    }

    /**
     * Ongelmatilanteiden info
     * 
     * @param {props} paneelin asetelma 
     * @returns palauttaa infopoaneelin typograafin
     */
    function InfoPanel(props){
        return (
            <Typography variant="body2" color="text.blue" align="center" {...props}>
                {success && errMessage}
            </Typography>
        )
    }

    const theme = createTheme();

    /**
     * Validate password input fields by equality and sanitazion
     * @param {string} lpwd 
     * @param {string} rpwd 
     */
    const validatePasswords = (lpwd, rpwd) => {
        const valid = isRequired(lpwd) && isRequired(rpwd)
        setPwdMatch(lpwd == rpwd && valid)
    }


    return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          
          <Typography component="h1" variant="h4">
          Join a community of readers
          </Typography>
          <Typography>
          <p>track your reading progess and browse community collections</p>
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                            error = {!UserErr}
                            helperText={!UserErr && "Text field must not be empty"} 
                            required
                            fullWidth
                            id="name"
                            label="First Name"
                            name="name"
                            autoComplete="given-name"
                            autoFocus
                        />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                            error = {!SurErr}
                            helperText={!SurErr && "Text field must not be empty"} 
                            required
                            fullWidth
                            id="lastname"
                            label="Surname"
                            name="lastname"
                            autoComplete="family-name"
                            autoFocus
                        />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                        error= { err }
                        helperText={err && "Invalid Email Address. Try Another."}
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        onChange= { (e) => { setErr(!validateEmail(e.target.value))  }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                            error = { !pwdMatch }
                            helperText={!pwdMatch && "Passwords do not match."}
                            margin="normal"
                            required
                            fullWidth
                            name="lpassword"
                            label="Type Password"
                            type="password"
                            id="lpassword"
                            autoComplete="new-password"
                        />
                        <TextField
                            error = { !pwdMatch }
                            helperText={!pwdMatch && "Passwords do not match."}
                            margin="normal"
                            required
                            fullWidth
                            name="rpassword"
                            label="Retype Password"
                            type="password"
                            id="rpassword"
                            autoComplete="new-password"
                        />
                  </Grid>
              </Grid>
              <InfoPanel sx={{ mb: 1, mt: 1}} />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                >
              Sign In
            </Button>
            <Grid container justifyContent="flex-end">
                <Grid item>

                    <RouterLink to="/login" variant="body2">
                        Already have an account? Log in here
                    </RouterLink>
                    
                </Grid>
            </Grid>
        </Box>
        </Box>
        </Container>
        </ThemeProvider>
    );
}