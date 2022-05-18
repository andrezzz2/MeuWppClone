import styled from "styled-components";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import * as EmailValidator from "email-validator";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { collection, addDoc, query, where } from "firebase/firestore"; 
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import Chats2 from "./Chats";


export default function Sidebar({setUsers}) {

    const [user] = useAuthState(auth);
    const userChatsRef = query(collection(db, "chats"), where("users", "array-contains", user.email));
    const [chatsSnapshot] = useCollection(userChatsRef);

    const createChat = () => {
        const input = prompt(
            "Please enter an email address for the user you wish to chat with"
        );
        if (!input) return null;

        if (EmailValidator.validate(input) && input!=user.email && !chatAlreadyExists(input)) {
            try{
                //usando add, porque o doc não tem um id expressivo pra ser usado com set
                addDoc(collection(db, "chats"), {
                  users: [user.email, input],
                  msgs: [],
                });
                //,{ merge: true } caso queira só acrescenter e não substitui o doc inteiro
              } catch (e) {
                console.error("Error adding document: ", e);
              }
        }
        else {
            alert("Invalid email");
        }

    }

    const chatAlreadyExists = (recipientEmail) =>{
        chatsSnapshot.docs.forEach((doc) => {
            const chatObject = doc.data();
            if (chatObject.users.includes(recipientEmail)){
                return true;
            }
        })
        return false;
    }


    const SignOut = () =>{
        signOut(auth).then(() => {
            // Sign-out successful.
        }).catch((error) => {
            // An error happened.
        });
    }
    
    
    return(
        <Container>
            <Header>
                <IconButton onClick={SignOut}>
                    <UserAvatar src={user.photoURL}/>
                </IconButton>

                <IconsContainer>
                    <IconButton>
                        < DataUsageIcon />
                    </IconButton>
                    <IconButton onClick={createChat}>
                        <ChatIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </IconsContainer>
            </Header>


            <Search>
                <Box sx={{ display: 'flex', alignItems: 'flex-center' , justifyContent: 'flex-start', bgcolor: 'rgb(240,242,245)', px:'10px', py:'3px', borderRadius: '9px'}}>
                    <IconButton sx={{width:30, height:30, mr:4}}>
                        <SearchIcon sx={{ color: 'action.active', width:20, height:20}}/> 
                    </IconButton>
                    <TextField variant="standard" placeholder="Pesquisar ou começar uma nova conversa" sx={{width:'100%', textOverflow: 'clip'}}  InputProps= {{disableUnderline: true, style:{fontSize: '0.8rem', fontWeight: '350'}}}/>
                </Box>
            </Search>

            <Chats>
                {chatsSnapshot?.docs.map( doc => (
                    <Chats2 key={doc.id} id={doc.id} users={doc.data().users} setUsers={setUsers}/>
                ))}
            </Chats>

        </Container>
    )
}



const Container = styled.div`
    display: flex;
    flex: 2;
    flex-direction: column;
    justify-content: flex-start;
    height: 100%;
    max-width: 420px;
    max-height: 930px;
    min-width: 100px;
    min-height: 100px;
`;

const Header = styled.div`
    display: flex;   //torna o elemento um flex container, transformando seus filhos em flex itens
    flex-direction: row;
    flex-wrap: nowrap;
    background-color: rgb(240,242,245); //cor do fundo da div
    justify-content: space-between; //justifica com espaço entre os itens, horizontalmente
    align-items: center; //alinha elementos para o meio, verticalmente
    padding: 15px; //distancia entre os 4 lados do conteudo do elemento e a sua borda
    height: 55px; //altura do conteudo do elemento
    border-right: 1px solid #dcdcdc; //border-right-width, border-right-style, border-right-color
`;

const Search = styled.div`
    background-color: white;
    padding: 6px 11px;
    border-right: 1px solid rgb(239,234,226);
    border-bottom: 1px solid #dcdcdc;
`;


const Chats = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    background-color: white;
    border-right: 1px solid rgb(239,234,226);
    overflow: scroll;
`;

const UserAvatar = styled(Avatar)`

`;

const IconsContainer = styled.div`
    display: flex;
    flex-direction: row;
`;

