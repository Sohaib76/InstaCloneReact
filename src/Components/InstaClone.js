import React ,{useState, useEffect} from 'react'
import Post from './Post'
import {db,auth} from '../firebase.js'
import { Modal, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';




//-------------------------------------Modal Styling
function getModalStyle() {
    const top = 50;
    const left = 50;
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }
  
  const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }));

//--------------------------------------------------------








function InstaClone() {
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle)
    const [openSignIn, setOpenSignIn] = useState(false);

    const [posts,setPosts] = useState([]);
    const [open, setOpen] = useState(false);

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [user,setUser] = useState(null);



    
    useEffect(()=>{
        db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot =>{
            setPosts(snapshot.docs.map((doc) => (
                {   
                    id: doc.id,
                    post :doc.data()
                
                })))
        })
    },[])













    //Login Listener
    useEffect(()=>{
        const unsubscribe = auth.onAuthStateChanged((authUser) =>{
            if(authUser){
                //userLogged In
                console.log(authUser)
                setUser(authUser)
               
            }else{
                //user logged out
                setUser(null)
            }
        })

        return ()=> {
            //perform cleanup before refire useEffect
            unsubscribe()
        }
    },[user,username])




    const signup = (event)=>{
        event.preventDefault();

        auth.createUserWithEmailAndPassword(email,password)
        .then((authUser)=>{
            return authUser.user.updateProfile({
                displayName:username
            })
        })
        .catch((error)=>alert(error.message))

        setOpen(false)
    }


    const signin = (event) => {
        event.preventDefault();
        auth.signInWithEmailAndPassword(email,password)
        .catch((error)=>alert(error.message))

        setOpenSignIn(false)

    }






    
    return (
     
            <div className="app">
               
                

                <Modal
                    open={open}
                    onClose={()=> setOpen(false)}
                  
                    >
                    <div style={modalStyle} className={classes.paper}>
                      

                      <form className="app__signup">
                        <center>
                          <img className="app__modalImage" src="https://logodownload.org/wp-content/uploads/2017/04/instagram-logo-1.png" alt=""/>
                        </center>


                        <Input 
                        placeholder="username" 
                        type="text" 
                        value={username} 
                        onChange={(e)=>setUsername(e.target.value)}/>

                        <Input 
                        placeholder="email" 
                        type="text" 
                        value={email} 
                        onChange={(e)=>setEmail(e.target.value)}/>
                       
                       <Input 
                        placeholder="password" 
                        type="text" 
                        value={password} 
                        onChange={(e)=>setPassword(e.target.value)}/>

                   
                        <Button type="submit" onClick={signup}>SignUp</Button>
                       
                       
                        </form>

                    </div>
                </Modal>






                <Modal
                    open={openSignIn}
                    onClose={()=> setOpenSignIn(false)}
                  
                    >
                    <div style={modalStyle} className={classes.paper}>
                      

                      <form className="app__signup">
                        <center>
                          <img className="app__modalImage" src="https://logodownload.org/wp-content/uploads/2017/04/instagram-logo-1.png" alt=""/>
                        </center>



                        <Input 
                        placeholder="email" 
                        type="text" 
                        value={email} 
                        onChange={(e)=>setEmail(e.target.value)}/>
                       
                       <Input 
                        placeholder="password" 
                        type="text" 
                        value={password} 
                        onChange={(e)=>setPassword(e.target.value)}/>

                   
                        <Button type="submit" onClick={signin}>SignIn</Button>
                       
                       
                        </form>

                    </div>
                </Modal>

























                
                <div className="app__header" >
                    <img className="app__headerImage" src="https://logodownload.org/wp-content/uploads/2017/04/instagram-logo-1.png" alt=""/>
                
                
                    {user ? (
                            <Button onClick={()=>auth.signOut()}>
                            Sign Out
                            </Button>
                        ): 
                        <div className="app__loginContainer">
                        <Button onClick={()=>setOpenSignIn(true)}>Sign In</Button>
                        <Button onClick={()=>setOpen(true)}>Sign Up</Button>

                        </div>
                }
               
                
         </div>


           






                <div className="app__posts">
                    <div className="app__postsLeft">
                    {
                            posts.map(({id,post})=>(
                                <Post user={user} postId={id} key={id} username={post.username} caption={post.caption} avatar="src/"
                                    imageUrl={post.imageUrl} 
                        />
                            ))
                        }

                    </div>


                    <div className="app__postsRight">
                        
                    {/* url='https://instagram.com/p/B_uf9dmAGPw' */}
                        <InstagramEmbed
                        url='https://instagram.com/p/B_uf9dmAGPw'
                        maxWidth={320}
                        hideCaption={false}
                        containerTagName='div'
                        protocol=''
                        injectScript
                        onLoading={() => {}}
                        onSuccess={() => {}}
                        onAfterRender={() => {}}
                        onFailure={() => {}}
                        />

                    </div>


                </div>
                
               
               










            
            {

                    user?.displayName ? (
                        <ImageUpload username={user.displayName}/>
                    ):
                    <h3 style={{textAlign:'center',padding:20}}>Please Login To Upload</h3>
                }




              
            </div>
     
    )
}



export default InstaClone

