import React ,{useState,useContext} from 'react';
import {Link,useHistory} from 'react-router-dom'
import {UserContext}  from '../../App'
import M from 'materialize-css';

//sending reset password link in email
const Reset = ()=>{
    const history = useHistory()
    const [email,setEmail] = useState("")

    const PostData = ()=>{
        fetch('/reset-password', {
            method : 'post',
            headers :{ 'Content-Type' : 'application/json',
            },
            body : JSON.stringify({
                email   
            })
        }).then(response => response.json())
          .then(data => {
              if(data.error){
                M.toast({html: data.error,classes:"#c62828 red darken-3"})
            }
              else{
                M.toast({html: data.message ,classes:"#43a047 green darken-1"})
                history.push('/signin')
            }
        }).catch(err=>{
            console.log(err)
        })
    }        

    return(        
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>Instagram</h2>
                <input type="text" placeholder="email"
                value ={email}
                onChange= {(e)=>setEmail(e.target.value)}
                />               
                <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
                onClick={()=>PostData()}
                >Reset Password</button>
            </div>
        </div>
    )
}
export default Reset;