import React,{useEffect,createContext,useReducer,useContext} from 'react';
import {BrowserRouter,Route,Switch,useHistory} from 'react-router-dom'
import {reducer,initialState} from './reducers/userReducer'
import logo from './logo.svg';
import './App.css';
import NavBar from './components/Navbar'
import Home from './components/screens/Home'
import Signin from './components/screens/SignIn'
import Profile from './components/screens/Profile'
import Signup from './components/screens/Signup'
import CreatePost from './components/screens/CreatePost'
import UserProfile from './components/screens/UserProfile'
import Reset from './components/screens/Reset'
import Newpassword from './components/screens/Newpassword'

export const UserContext = createContext()

const Routing =()=>{
  const history = useHistory()
  const {state, dispatch} =useContext(UserContext)

  useEffect(()=>{
    if(history.location.pathname){
      history.push('/signin')
    }    
    else if(history.location.pathname.startsWith('/reset')){
     console.log(history.location.pathname)
    //  history.push('/reset/:token')
    }
    else if(JSON.parse(localStorage.getItem("user"))){
      const user = JSON.parse(localStorage.getItem("user"))
      console.log(typeof(user),user)  
      dispatch({type:"USER",payload:user})
    }
  },[])

  return(
    <Switch>
    <Route exact path="/">
        <Home/>
      </Route>
      <Route path="/signin">
        <Signin/>
      </Route>
      <Route path="/signup">
        <Signup/>
      </Route>
      <Route exact path="/profile">
        <Profile/>
      </Route>
      <Route path="/create">
        <CreatePost/>
      </Route>
      <Route path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route exact path="/reset">
        <Reset/>
      </Route>
      <Route path="/reset/:token">
        <Newpassword/>
      </Route>
    </Switch>
  )
}

function App() {
  const [state,dispatch] = useReducer(reducer,initialState)
  return (
    <div className="App">
      <UserContext.Provider value={{state,dispatch}}>
        <BrowserRouter>
          <NavBar/>
          <Routing/>
        </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
}

export default App;
