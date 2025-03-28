import { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";
export default function ChangeName(props) {
    const [name, setName] = useState(props.user.userFullName)
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    function changenewname(e) {
        setName(e.target.value)
    }
    function CancelChange() {
        navigate("/TaiKhoan")
    }
    return (
        <div className="container-fluid d-flex flex-column border-black gap-2 border rounded-5 pt-2 pb-3">
            <h2 className="text-center page-header">Thay đổi tên người dùng</h2>
            <p className="fs-4 m-0">Tên mới của bạn : {name}</p>
            <div className="form-floating">
                <input  type="text" className="form-control" id="floatingInput" placeholder="ten" value={name}
                        onChange={(e) => changenewname(e)}/>
                <label htmlFor="floatingInput">Tên mới</label>
            </div>
            <p className="text-danger">{error}</p>
            <div className="d-flex gap-2 ">
                <button className={`btn btn-outline-danger rounded-5 fw-bolder border-3 w-50  ${loading ? "disabled" : ""}`} onClick={() => CancelChange()}>{loading ?
                    <>
                        <span className="spinner-grow spinner-grow-sm ms-1" role="status" aria-hidden="true"></span>
                        <span className="spinner-grow spinner-grow-sm ms-1" role="status" aria-hidden="true"></span>
                        <span className="spinner-grow spinner-grow-sm ms-1" role="status" aria-hidden="true"></span>
                    </> : <>
                        Hủy
                    </>
                }</button>
                <button className={`btn btn-outline-success rounded-5 fw-bolder border-3 w-50  ${loading ? "disabled" : ""}`} onClick={() => SaveNewName()}>{loading ?
                    <>
                        <span className="spinner-grow spinner-grow-sm ms-1" role="status" aria-hidden="true"></span>
                        <span className="spinner-grow spinner-grow-sm ms-1" role="status" aria-hidden="true"></span>
                        <span className="spinner-grow spinner-grow-sm ms-1" role="status" aria-hidden="true"></span>
                    </> : <>
                        Thay đổi
                    </>
                }</button>
            </div>
        </div>
    )

    async function SaveNewName() {
        if (name.length <= 0) {
            setError("Hãy nhập tên của bạn!")
            return 0
        }
        const response = await fetch(`https://warehouseservice.azurewebsites.net/api/Account/FullNameChange`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body:JSON.stringify({fullName:name})
        })
        const content = await response.json();
        if (!response.ok) {
            setError(content)
        }
        else {
            props.getInfo()
            navigate("/TaiKhoan")
        }
    }
}