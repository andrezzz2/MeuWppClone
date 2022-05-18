import styled from "styled-components";
import Avatar from "@mui/material/Avatar";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import getRecipientEmail from "../utils/getRecipientEmail";
import { useCollection } from "react-firebase-hooks/firestore";
import {collection, query, where } from "firebase/firestore"; 
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useEffect } from "react";

export default function Chats({id, users, setUsers}) {
    const [user] = useAuthState(auth);
    const recipientEmail = getRecipientEmail(users, user);
    const recipientRef = query(collection(db, "users"), where("email", "==", recipientEmail));
    const [recipientSnapshot] = useCollection(recipientRef);
    const recipient = recipientSnapshot?.docs?.[0]?.data();

    const chatRef = query(collection(db, "chats"), where("users", "array-contains", user.email));
    const [chatsSnapshot] = useCollection(chatRef);
    const chatDoc = chatsSnapshot?.docs.filter((doc) => doc.data().users.includes(recipientEmail))[0];
    const lastmsg = chatDoc?.data().msgs.at(-1).msg;

    const selectChat = (users) =>{
        setUsers(users);
    }

    return(
        <Container onClick={()=>selectChat(users)}>
            {recipient?(
                <UserAvatar src={recipient.photoURL} /> 
            ):(
                //chat selecionado é de um email sem cadastro
                recipientEmail?(
                    <UserAvatar> {recipientEmail[0]} </UserAvatar>
                ):(<></>)
            )}
            <Infos>
                <UserName>{getRecipientEmail(users, user)}</UserName>
                <Date>19:20</Date>
                <LastMessage>{lastmsg?(lastmsg):("")}</LastMessage>
                <KeyboardArrowDownIcon sx={{position: "absolute", bottom: "8px", right:"10px"}}/>
            </Infos>
        </Container>
    )
}


const Container = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    padding: 10px;
    width: 402px;
    height: 70px;

    cursor: pointer;
    :hover{
        background-color: #e9eaeb;
    }
`;

const UserAvatar = styled(Avatar)`

`;

const Infos = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 350px;
    height: 60px;
    position: absolute;
    margin-left: 40px;
    flex-wrap: wrap;
    border-bottom: 1px solid #dcdcdc;
`;


const UserName = styled.div`
    position: absolute;
    top: 2px;
    left: 10px;
    max-width: 280px;
    white-space: nowrap;  //tira quebra de linha
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 18px;
    font-weight: 350;
`

const Date = styled.div`
    position: absolute;
    top: 0px;
    right: 10px;
    margin-left: 5px;
    padding-bottom: 5px;
    font-size: 12px;
`

const LastMessage = styled.div`
    position: absolute;
    left: 10px;
    bottom: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 13px;
    font-weight: 300;
    letter-spacing: 0.5px;
`
