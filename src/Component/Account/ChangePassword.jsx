import {useEffect, useState} from "react"
import {Navigate, useNavigate} from "react-router-dom";

export default function ChangePassword(props) {
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const [passwordCheck, setPasswordCheck] = useState("")
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")

    function onNewPasswordChange(e) {
        setNewPassword(e.target.value)
    }

    function onOldPasswordChange(e) {
        setOldPassword(e.target.value)
    }

    function onPasswordCheckChange(e) {
        setPasswordCheck(e.target.value)
    }


    function GoBack() {
        navigate("/TaiKhoan")
    }
    const checkData=()=>{
        setError("");
        if(oldPassword.length===0){
            setError("Bạn chưa nhập mật khẩu cũ!");
            return false;
        }
        if(newPassword !== passwordCheck){
            setError("Xin nhập mật khẩu xác nhận giống mật khẩu mới!");
            return false;
        }
        if(newPassword.length<4){
            setError("Độ dài mật khẩu phải tối thiểu 4 chữ!");
            return false;
        }
        return true;
    }
    async function SendPasswordChangeMail() {
        if (checkData()) {
            setLoading(true)
            const response = await fetch(`https://warehouseservice.azurewebsites.net/api/Account/PasswordChange`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({
                    NewPassword:newPassword,
                    ConfirmNewPassword:passwordCheck,
                    OldPassword:oldPassword,
                })
            })

            if (!response.ok) {
                const content = await response.json()
                if(!content.result.isValid){
                    let list=content.result.errors
                    list.forEach((element) => {
                        if(element.propertyName==="NewPassword")
                            setError(element.errorMessage)
                        if(element.propertyName==="ConfirmNewPassword")
                            setError(element.errorMessage)
                        if(element.propertyName==="OldPassword")
                            setError(element.errorMessage)
                    })
                }else {
                    setError(content.errorMessage)
                }
            } else {
                const content = await response.text()
                setMessage("Đã gửi email thay đổi thành công")
            }
            setLoading(false)
        }
    }
    if(!props.user.isLogged && props.user.userId===""){
        return <Navigate to="/login"></Navigate>
    }
    return (
        <div className="container-fluid d-flex flex-column border-black gap-2 border rounded-5 pt-3 pb-3">
            <h2 className="text-center page-header">Thay đổi mật khẩu</h2>
            <div className="form-floating">
                <input type="email" className="form-control" id="floatingInput" placeholder="ten" value={oldPassword}
                       onChange={(e) => onOldPasswordChange(e)} required/>
                <label htmlFor="floatingInput">Mật khẩu cũ</label>
            </div>
            <div className="form-floating">
                <input type="email" className="form-control" id="floatingInput" placeholder="ten" value={newPassword}
                       onChange={(e) => onNewPasswordChange(e)} required/>
                <label htmlFor="floatingInput">Mật khẩu mới</label>
            </div>
            <div className="form-floating">
                <input type="email" className="form-control" id="floatingInput" placeholder="ten" value={passwordCheck}
                       onChange={(e) => onPasswordCheckChange(e)} required/>
                <label htmlFor="floatingInput">Xác nhận mật khẩu</label>
            </div>
            <h5 className="m-0 text-center text-success">
                {message}
            </h5>
            <h5 className="m-0 text-center text-danger">
                {error}
            </h5>
            <div className="d-flex flex-column gap-2">
                {message === "" ?
                    <div className="d-flex gap-2">
                        <button className={`btn btn-outline-danger rounded-5 fw-bolder border-3 w-50  ${loading ? "disabled" : ""}`} onClick={() => GoBack()}>Quay về</button>
                        <button className={`btn btn-outline-success rounded-5 fw-bolder border-3 w-50  ${loading ? "disabled" : ""}`} onClick={() => SendPasswordChangeMail()}>Thay
                            đổi </button>
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