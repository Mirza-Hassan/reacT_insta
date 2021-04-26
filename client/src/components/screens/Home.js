import React,{useState,useEffect,useContext} from 'react'
import {UserContext} from '../../App'
import {Link} from 'react-router-dom'

//Fetching post and showing that in home screen
const Home = ()=>{
    const [data,setData] = useState([])
    const {state,dispatch} = useContext(UserContext)

    useEffect(()=>{
        fetch('/allpost',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result =>{
            console.log(result)
            setData(result.posts)
        })
    },[])

        //Delete post 
        const deletePost = (postid)=>{
            console.log(postid)
            fetch('/deletepost/'+postid,{
                method:"DELETE",
                headers:{
                    Authorization:"Bearer "+localStorage.getItem("jwt")
                }
            }).then(res=>res.json())
            .then(result=>{
                console.log(result)
                const newData = data.filter(item=>{
                    return item._id !== result._id
                })
                setData(newData)
            })
        }

    return(        
            <div className="home">
                {
                data.map(item =>{
                    console.log(item)
                    return(
                        <div className="card home-card" key={item._id}>
                        <h2>
                        <Link to={item.postedBy._id !== state._id?"/profile/"+item.postedBy._id :"/profile"  }>{item.postedBy.name}</Link> 
                        {item.postedBy._id == state._id 
                        && <i className="material-icons" style={{float:"right"}}
                        onClick={()=>deletePost(item._id)}
                        >delete</i>}</h2>
                        <div className="card-image">
                            <img src={item.photo}/>
                        </div>
                        <div className="card-content">
                            <i className="material-icons" style={{color:"red"}}>favorite</i>
                            <h6>{item.title}</h6>
                            <p>{item.body}</p>
                            <input type="text" placeholder="add a comment"></input>
                        </div>
                    </div>                                
                    )
                })}

            </div>
    )
}
export default Home;