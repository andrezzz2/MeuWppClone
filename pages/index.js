import Head from 'next/head'
import styled from "styled-components";
import Sidebar from '../components/Sidebar';
import Chat from '../components/Chat';
import { useState } from 'react';
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../firebase";
export default function Home() {

  const [user] = useAuthState(auth);
  const [users, setUsers] = useState([user.email, ""]);

  return (
    <div>
      <Head>
        <title>MyDate</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <Sidebar setUsers={setUsers}/>
        <Chat users={users}/>
      </Container>
    </div>
  )
}


const Container = styled.div`
    display: flex;
    flex: 1;
    background-color: gray;
    justify-content: center;
    align-items: center;
    background-image: linear-gradient(to bottom, rgb(0,168,132) 0%, rgb(0,168,132) 13.1%, rgb(224,224,222) 13.1%, rgb(224,224,222) 100%);
    height: 100vh;
    overflow: hidden;
`;
