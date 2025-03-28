import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
export default function ConfirmEmailChange() {

    const navigate = useNavigate()
    const { id, email, code } = useParams()
    async function ChangeEmail() {
        const response = await fetch(`https://warehouseservice.azurewebsites.net/api/Account/EmailChange/${id}/${email}/${code}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
        })
        if (response.ok) {
            navigate("/")
        }
        else {
            navigate("/Error")
        }
    }
    useEffect(() => {
        document.title = 'Xác nhận';
        ChangeEmail()
    }, [])
    return(
        <>
        </>
    )
}