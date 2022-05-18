import styled from "styled-components";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TextField from '@mui/material/TextField';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import MicIcon from '@mui/icons-material/Mic';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import getRecipientEmail from "../utils/getRecipientEmail";
import { useCollection } from "react-firebase-hooks/firestore";
import {collection, query, where, setDoc, doc } from "firebase/firestore"; 
import { useEffect, useState } from "react";
import Text from "./Text";


export default function Chat({id, users}) {
    const [user] = useAuthState(auth);
    const recipientEmail = getRecipientEmail(users, user);
    const recipientRef = query(collection(db, "users"), where("email", "==", recipientEmail));
    const [recipientSnapshot] = useCollection(recipientRef);
    const recipient = recipientSnapshot?.docs?.[0]?.data();

    const chatRef = query(collection(db, "chats"), where("users", "array-contains", user.email));
    const [chatsSnapshot] = useCollection(chatRef);
    const chatDoc = chatsSnapshot?.docs.filter((doc) => doc.data().users.includes(recipientEmail))[0];
    const chatId = chatDoc?.id;

    useEffect(() => {

        const txtfield = document.getElementById("txtfield");
        /*
        txtfield.addEventListener('keyup', function(e){
            var key = e.keyCode;
            if (key == 13)
                sendMsg();
        });
        */
        
    }, []);


    function sendMsg (){
        const msgs = chatDoc?.data().msgs;
        const txtfield = document.getElementById("txtfield").value;
        console.log(msgs);
        msgs?.push({user:user.email, msg:txtfield});
        setDoc(doc(db, "chats", chatId), {
            msgs: msgs,
        }, { merge:true });
        document.getElementById("txtfield").value = "";
    }

    if (users[1]=="")
        return (<Container></Container>);
    
    else{
        return(
            <Container>
                <Header>
                    
                    {recipient?(
                        <AvatarNameContainer>
                            <ChatAvatar src={recipient.photoURL} /> 
                            <p>{recipient.email}</p>
                        </AvatarNameContainer>
                    ):(
                        recipientEmail?(
                            <AvatarNameContainer>
                                <ChatAvatar> {recipientEmail[0]} </ChatAvatar>
                                <p>{recipientEmail}</p>
                            </AvatarNameContainer>
                        ):( //nenhum chat selecionado
                            <AvatarNameContainer>
                            </AvatarNameContainer>
                        )
                        
                    )}
                    
                    <IconsContainer>
                        <IconButton>
                            <SearchIcon />
                        </IconButton>
                        <IconButton>
                            <MoreVertIcon />
                        </IconButton>
                    </IconsContainer>
                </Header>
                
                {chatId?(
                    <Text chatId={chatId}/>
                    
                    ):(<> </>)
                }

                <TextBar>
                    <IconButton sx={{}}>
                        <InsertEmoticonIcon/>
                    </IconButton>
                    <IconButton sx={{}}>
                        <AttachFileIcon/>
                    </IconButton>
                    <TextField id="txtfield" variant="standard" placeholder="Mensagem" sx={{width:'100%', textOverflow: 'clip', bgcolor: "white", px: "10px", py: "5px", borderRadius: '8px', mx: "5px"}}  InputProps= {{disableUnderline: true, style:{fontSize: '1rem', fontWeight: "350", letterSpacing: "0.1px"}}}/>
                    <IconButton sx={{}} onClick={sendMsg}>
                        <MicIcon/>
                    </IconButton>
                </TextBar>
            </Container>
        )
    }
       
}


const Container = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: flex-start;
    height: 100%;
    max-width: 980px;
    max-height: 930px;
    background-color:  rgb(240,242,245);
`;

const Header = styled.div`
    display: flex;   //torna o elemento um flex container, transformando seus filhos em flex itens
    background-color: rgb(240,242,245); //cor do fundo da div
    justify-content: space-between; //justifica com espaço entre os itens, horizontalmente
    align-items: center; //alinha elementos para o meio, verticalmente
    padding: 15px; //distancia entre os 4 lados do conteudo do elemento e a sua borda
    height: 55px; //altura do conteudo do elemento
    border-bottom: 1px solid whitesmoke; //estilo da borda de baixo 
`;

const AvatarNameContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
`;

const IconsContainer = styled.div`
    display: flex;
    flex-direction: row;
`;

const ChatAvatar = styled(Avatar)`
    margin-right: 10px;
    cursor: pointer;
`;

const TextBar = styled.div`
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    height: 70px;
    background-color: rgb(240,242,245);
    padding: 6px 11px;
`;