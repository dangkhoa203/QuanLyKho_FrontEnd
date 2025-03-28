import {Link, Navigate, useNavigate} from "react-router-dom"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form";
export default function ForgetPassword(props) {
    const { register, handleSubmit } = useForm();
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState("")
    const navigate=useNavigate();
    const onSubmit = data => sendResetRequest(data);
    async function sendResetRequest(data) {
        setError("");
        setLoading(true)
        const response = await fetch(`https://warehouseservice.azurewebsites.net/api/Account/PasswordReset`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({email:data.email})
        })
        const content = await response.json()
        if (!response.ok) {
            setError(content.errorMessage)
        }
        else {
            setSuccess("Email xác nhận sẽ được gửi đến email đã nhập!")
        }
        setLoading(false)
    }
    if (props.user.isLogged) {
        return <Navigate to="/" />
    }
    useEffect(()=>{
        document.title = 'Quên mật khẩu';
    },[])
    return (
        <>
            <div className="container-fluid h-100 d-flex flex-column">
                <div className="container w-50 m-auto d-flex flex-column p-5 ">
                    <h1 className="text-center">Quên mật khẩu</h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="w-100 text-start mb-1 mt-1">
                            <Link className="link" onClick={() => navigate(-1)}>{"<- Quay về"}</Link>
                        </div>
                        <div className="form-floating">
                            <input type="email" className="form-control rounded-4 border-2" id="floatingInput"
                                   placeholder="username" {...register("email")} />
                            <label htmlFor="floatingInput">Email</label>
                        </div>
                        <h6 className="text-center text-danger mt-1">{error}</h6>
                        {success === "" ?
                            <button className={`btn btn-outline-success rounded-5 fw-bolder border-3 w-100 ${loading ? "disabled" : ""}`}
                                    type="submit">{loading ?
                                <>
                                    <span className="spinner-grow spinner-grow-sm ms-1" role="status"
                                          aria-hidden="true"></span>
                                    <span className="spinner-grow spinner-grow-sm ms-1" role="status"
                                          aria-hidden="true"></span>
                                    <span className="spinner-grow spinner-grow-sm ms-1" role="status"
                                          aria-hidden="true"></span>
                                </> : <>
                                    Gửi email đặt lại mật khẩu
                                </>
                            }</button>
                            :
                            <div>
                                <h6 className="text-center text-success mt-1">{success}</h6>
                                <button className="btn btn-outline-dark w-100 rounded-5 fw-bolder border-3"
                                        onClick={() => props.navigate("/")}>Quay về
                                </button>
                            </div>

                        }
                    </form>

                </div>
            </div>
        </>
    )
}