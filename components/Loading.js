import Head from 'next/head';
import styled from "styled-components";
import { Circle, ThreeBounce } from "better-react-spinkit";



function Loading(){
    return (
        <Container>
                
            <Head>
                <title> Loading </title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Img src="https://icones.pro/wp-content/uploads/2021/02/icone-du-logo-whatsapp-rose.png" alt=''/>
            <AnimatedLoadingText>
                <Text>Loading</Text>
                <ThreeBounce color="pink" size={5}/>
            </AnimatedLoadingText>
            <Circle color="pink" size={40} />
        </Container>
    );
}


export default Loading;

const Img = styled.img`
`;


const Container = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: rgb(240,242,245);
`;

const AnimatedLoadingText = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const Text = styled.p`
    margin-right: 5px;
    color: rgb(241,145,155);
`;

//can't use styled components, because server-side redenring does not 
//fetch the styles before rendering the page, so use _document.js to fix it


