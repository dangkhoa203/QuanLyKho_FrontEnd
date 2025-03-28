import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
export default function ConfirmPasswordChange() {

    const navigate = useNavigate()
    const { id, password, code } = useParams()
    async function ChangePassword() {
        const response = await fetch(`https://warehouseservice.azurewebsites.net/api/Account/PasswordChange/${id}/${password}/${code}`, {
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
        ChangePassword()
    }, [])
    return(
        <>
        </>
    )
}