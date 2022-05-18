import styled from "styled-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useDocument } from "react-firebase-hooks/firestore";
import { collection, doc } from "firebase/firestore"; 
import { useState, useEffect } from "react";


export default function Text({chatId}) {
    const [user] = useAuthState(auth);
    const chatRef = doc(db, "chats", chatId);
    const [chatSnapshot] = useDocument(chatRef);
        
    return(
        <Container>
            {chatSnapshot?.data().msgs.map((msg)=>{
                if(msg.user == user.email)
                    return <MyMsg id={msg.id}> <MyContent> {msg.msg} </MyContent> </MyMsg>
                return <OthersMsg id={msg.id}> <OthersContent> {msg.msg}  </OthersContent> </OthersMsg>
            })}
        </Container>
    )
}


const Container = styled.div`
    display: flex;
    flex-direction: column;
    background-color: rgb(239,234,226);
    height: 100%;
    justify-content: flex-start;
    overflow: scroll;
    color: white;
`;

const MyMsg = styled.p`
    display: flex;
    justify-content: flex-end;
    margin: 0px;
`;

const MyContent = styled.p`
    background-color: #03bb85;
    border: 1px solid #03bb85;
    border-radius: 8px;
    padding: 2px 5px 2px 5px;
    margin: 4px 4px 0px 4px;
    overflow-wrap: anywhere;
`;

const OthersMsg = styled.p`
    display: flex;
    justify-content: flex-start;
    margin: 0px;
`;

const OthersContent = styled.p`
    background-color: #a9a9a9;
    border: 1px solid #a9a9a9;
    border-radius: 8px;
    padding: 2px 5px 2px 5px;
    margin: 4px 4px 0px 4px;
    overflow-wrap: anywhere;
`;


