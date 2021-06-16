import { Button, Input } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { useEffect, useState } from 'react';
import './App.css';
import { auth, db } from './firebase';
import ImageUpload from './ImageUpload';
import Post from './Post';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyle = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: `2px solid #000`,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyle();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  const [openSignIn, setOpenSignIn] = useState(false);

  // useEffect => Runs piece of code based on a specific condition

  useEffect(() => {
    const unsubscribe =  auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in
        console.log(authUser);
        setUser(authUser);

      } else {
        // user has logged out
        setUser(null);
      }
    })

    return () => {
      // perform some clean up action
      unsubscribe();
    }
  }, [user, username]);

  useEffect(() => {
    db
      .collection('posts')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        // every time new post added this code fire up
        setPosts(snapshot.docs.map(doc => ({
          id: doc.id,
          post: doc.data()
        })));
      })
  }, []);

  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error) => alert(error.message));

      setOpen(false);
      setUsername('');
      setPassword('');
      setUser(null);
  }

  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignIn(false);
    setUsername('');
    setPassword('');
    setUser(null);
  }

  return (
    <div className="app">
      
      <Modal
        open = {open}
        onClose = {() => setOpen(false)}
      >
        <div style = {modalStyle} className = {classes.paper}>
          <center>
            <img 
              className = "app__headerImage"
              src = "https://1000logos.net/wp-content/uploads/2017/02/Instagram-Logo.png"
              alt = "logo"
            />  
          </center>
          <form className = "app__signup"> 
            <Input 
              placeholder = "username"
              type = "text"
              value = {username}
              onChange = {(e) => setUsername(e.target.value)}
            />

            <Input
              placeholder = "email"
              type = "text"
              value = {email}
              onChange = {(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder = "password"
              type = "password"
              value = {password}
              onChange = {(e) => setPassword(e.target.value)}
            />
            <Button type = "submit" onClick = {signUp}>Sign Up</Button>
          </form>
          
        </div>
      </Modal>

      <Modal
        open = {openSignIn}
        onClose = {() => setOpenSignIn(false)}
      >
        <div style = {modalStyle} className = {classes.paper}>
          <center>
            <img 
              className = "app__headerImage"
              src = "https://1000logos.net/wp-content/uploads/2017/02/Instagram-Logo.png"
              alt = "logo"
            />  
          </center>
          <form className = "app__signup"> 
            <Input
              placeholder = "email"
              type = "text"
              value = {email}
              onChange = {(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder = "password"
              type = "password"
              value = {password}
              onChange = {(e) => setPassword(e.target.value)}
            />
            <Button type = "submit" onClick = {signIn}>Sign In</Button>
          </form>
          
        </div>
      </Modal>
      
      <div className = "app__header">
        <img 
          className = "app__headerImage"
          src = "https://1000logos.net/wp-content/uploads/2017/02/Instagram-Logo.png"
          alt = "logo"
        />
        {user ? (
          <Button onClick = {() => auth.signOut()}>Logout</Button>
        ) : (
          <div className = "app__loginContainer">
            <Button onClick = {() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick = {() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div>

      <div className = "app__posts">
        <div className = "app__postsLeft">
          {
            posts.map(({id, post}) => (
              <Post 
                key = {id}
                username = {post.username}
                caption = {post.caption}
                imageUrl = {post.imageUrl}
              />
            ))
          }
        </div>
        <div className = "app__postsRight">
          <InstagramEmbed 
            url = 'https://www.instagram.com/p/CP5f-mQHjig/?utm_source=ig_embed&amp;utm_campaign=loading'
            maxWidth = {320}
            hideCaption = {false}
            containerTagName = 'div'
            protocol = ''
            injectScript
            onLoading = {() => {}}
            onSuccess = {() => {}}
            onAfterRender = {() => {}}
            onFailure = {() => {}}
          />
        </div>
      </div>
      
      {user?.displayName ? (
        <ImageUpload username = {user.displayName} />
      ) : (
        <h3>Sorry you need to login to upload</h3>
      )}
    
    </div>
  );
}

export default App;
