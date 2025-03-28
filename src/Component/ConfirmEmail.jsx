import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
export default function ConfirmEmail() {
    const navigate=useNavigate()
    const { username, code } = useParams()
    async function ConfirmAccount(username,code) {
        const response = await fetch(`https://warehouseservice.azurewebsites.net/api/Account/ConfirmAccount/${username}/${code}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        })
        if(response.ok){
            navigate("/")
        }
        else{
            navigate("/Error")
        }
    }
    useEffect(()=>{
        document.title = 'Xác nhận';
        ConfirmAccount(username,code)
    },[])
    return (
        <>
        </>
    )
}