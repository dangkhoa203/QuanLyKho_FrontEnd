import {useEffect, useState} from "react"
import {Navigate, useNavigate} from "react-router-dom";

export default function ChangeEmail(props) {
    const [newEmail, setNewEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const [emailCheck, setEmailCheck] = useState("")
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")

    function onNewEmailChange(e) {
        setNewEmail(e.target.value)
    }

    function onEmailcheckChange(e) {
        setEmailCheck(e.target.value)
    }


    function GoBack() {
        navigate("/TaiKhoan")
    }
    const checkData=()=>{
        setError("");

        if(newEmail.length===0){
            setError("Bạn chưa nhập email mới!");
            return false;
        }
        return true;
    }
    async function SendEmailChangeMail() {
        if (checkData()) {
            setLoading(true)
            const response = await fetch(`https://warehouseservice.azurewebsites.net/api/Account/EmailChange`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({newEmail:newEmail,oldEmail:emailCheck})
            })

            if (!response.ok) {
                const content = await response.json()
                setError(content.errorMessage)
            } else {
                setMessage("Gửi email thay đổi thành công")
            }
            setLoading(false)
        }
    }
    if(!props.user.isLogged && props.user.userId===""){
        return <Navigate to="/login"></Navigate>
    }
    return (
        <div className="container-fluid d-flex flex-column gap-2 border border-black rounded-5 pt-3 pb-3">
            <h2 className="text-center page-header">Thay đổi Email</h2>
            <p className="fs-4 m-0">Email hiện tại: {props.user.userEmail}</p>
            <div className="form-floating">
                <input type="email" className="form-control rounded-4 border-3" id="floatingInput" placeholder="ten"
                       value={newEmail}
                       onChange={(e) => onNewEmailChange(e)} required/>
                <label htmlFor="floatingInput">Email mới</label>
            </div>
            <div className="form-floating">
                <input type="email" className="form-control rounded-4 border-3" id="floatingInput" placeholder="ten"
                       value={emailCheck}
                       onChange={(e) => onEmailcheckChange(e)} required/>
                <label htmlFor="floatingInput">Xác nhận email cũ </label>
            </div>
            <h5 className="text-center text-success">
                {message}
            </h5>
            <h5 className="text-center text-danger">
                {error}
            </h5>
            <div className="d-flex flex-column gap-2">
                {message === "" ?
                    <div className="d-flex gap-2">
                        <button className={`btn btn-outline-danger rounded-5 fw-bolder border-3 w-50  ${loading ? "disabled" : ""}`} onClick={() => GoBack()}>{loading ?
                            <>
                                <span className="spinner-grow spinner-grow-sm ms-1" role="status"
                                      aria-hidden="true"></span>
                                <span className="spinner-grow spinner-grow-sm ms-1" role="status"
                                      aria-hidden="true"></span>
                                <span className="spinner-grow spinner-grow-sm ms-1" role="status"
                                      aria-hidden="true"></span>
                            </> : <>
                                Hủy
                            </>
                        } </button>
                        <button className={`btn btn-outline-success rounded-5 fw-bolder border-3 w-50  ${loading ? "disabled" : ""}`} onClick={() => SendEmailChangeMail()}>{loading ?
                            <>
                                <span className="spinner-grow spinner-grow-sm ms-1" role="status"
                                      aria-hidden="true"></span>
                                <span className="spinner-grow spinner-grow-sm ms-1" role="status"
                                      aria-hidden="true"></span>
                                <span className="spinner-grow spinner-grow-sm ms-1" role="status"
                                      aria-hidden="true"></span>
                            </> : <>
                                Thay đổi
                            </>
                        } </button>
                    </div>
                    :
                    <>
                        <button className="btn btn-dark" onClick={() => GoBack()}>Quay về</button>
                    </>
                }
            </div>
        </div>
    )
}