import { useState, useEffect } from "react";
import {Link, Outlet, Navigate, useNavigate} from "react-router-dom";
export default function Account(props) {
    const [User, setUser] = useState(props.user)
    const navigate = useNavigate();
    useEffect(() => {
        document.title = 'Tài khoản';
        setUser(props.user)
    }, [props.user])
    if(!props.user.isLogged && props.user.userId===""){
        return <Navigate to="/login"></Navigate>
    }
    return (
        <div className="d-flex flex-column gap-3">
            <div className="container fs-4 m-auto">
                <h1 className="text-center pt-2 page-header">Thông tin tài khoản</h1>
                <div className="container-fluid p-3 border border-black border-4 rounded-4">
                    <p className="">Tên đăng nhập: {User.userName}</p>
                    <div className="d-flex gap-2">
                        <p>Tên người dùng: {User.userFullName} </p>
                        <Link className="link fw-lighter link-dark " to="DoiTen">Thay đổi</Link>
                    </div>
                    <div className="d-flex gap-2">
                        <p>Email: {User.userEmail} </p>
                        <Link className="link fw-lighter link-dark " to="DoiEmail">Thay đổi</Link>
                    </div>
                    <div className="d-flex gap-2">
                        <Link className="link fw-lighter link-dark " to="DoiMatKhau">Đổi mật khẩu</Link>
                    </div>
                </div>
            </div>
            <div className="container mb-2">
                <Outlet/>
            </div>
        </div>
    )
}