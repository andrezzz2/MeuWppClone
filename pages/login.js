import Head from 'next/head';
import styled from 'styled-components';
import { Button } from '@mui/material';
import { auth, provider } from '../firebase';
import { signInWithPopup,GoogleAuthProvider } from 'firebase/auth';

const Container = styled.div`
    display: flex;
    justify-content: center;
    height: 100vh;
    background-color: rgb(240,242,245);
`;

const LoginContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const Logo = styled.img`
`;



function login(){
    const signIn = () =>{
        signInWithPopup(auth, provider).then((result) =>{
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
        }).catch(alert);
    }
    return (
        <Container>
            <Head>
                <title> Login </title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <LoginContainer>
                <Logo src="https://icones.pro/wp-content/uploads/2021/02/icone-du-logo-whatsapp-rose.png"/>
                <Button onClick={signIn} variant="outlined" sx={{my: "10px"}}> Sign in with Google</Button>
            </LoginContainer>
        </Container>

    );
}

export default login;