import { useEffect } from "react"
import {Link, Navigate} from "react-router-dom"
export default function ErrorPage(props){

    if(!props.user.isLogged && props.user.userId===""){
        return <Navigate to="/login"></Navigate>
    }
    useEffect(()=>{
        document.title = 'Lỗi';
    },[])
    return(
        <>
        <div className="d-flex w-25 flex-column m-auto p-auto text-center container-fluid">
            <p>Lỗi đã xảy ra.</p>
            <Link to="/" className="btn btn-dark" >Go back</Link>
        </div>
        </>
    )
}