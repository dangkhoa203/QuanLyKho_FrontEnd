import { useState } from "react";
import {NavLink, useNavigate} from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"
import "/src/css/navbar.css"
import Accordion from 'react-bootstrap/Accordion';
export default function NavBar(props) {
    const [show, setShow] = useState(false);
    const navigate=useNavigate()
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const logout = async () => {
        await fetch('https://warehouseservice.azurewebsites.net/api/Account/LogOut', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        props.getInfo()
    };
    let menu;
    if (!props.user.isLogged) {
        menu = (
           ''
        )
    } else {
        menu = (
            <div className="d-flex gap-2 w-100 justify-content-between  p-2 pt-0 mb-1 pb-0">
              <Link to="/TaiKhoan" className="link-light link-underline-opacity-0 h-100 fs-3">{props.user.userFullName}</Link>
                <button  className="btn btn-success rounded-0 fw-light border-3" onClick={logout}>LOGOUT</button>
            </div>)
            }
            return (
            <>
                <nav className="navigationbar navbar navbar-expand-md p-1  w-100 position-fixed">
                <Button variant="outline-dark" className="border-0 btn-md" onClick={handleShow}>
                    <i className="bi bi-list" style={{fontSize:"1.5em",fontStyle:"normal"}}></i>
                </Button>
            </nav>
            <Offcanvas className="bg-secondary" show={show} onHide={handleClose} scroll={true}>
                <Offcanvas.Header className="menubutton " closeButton>
                    <Offcanvas.Title></Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body style={{backgroundColor:"#008e93"}} className="d-flex flex-column gap-1 p-0">
                    <div className="d-flex gap-5">
                        {menu}
                    </div>
                    <div className="linkcontainer">
                        <Accordion className=" gap-0" flush>
                            <Accordion.Item className="bg-secondary border-0" eventKey="0">
                                <Accordion.Header className="h3">Quản lý nhà cung cấp</Accordion.Header>
                                <Accordion.Body className="pt-0 pb-1 navigate-font">
                                    <NavLink preventScrollReset={true}
                                             className={({isActive}) => (isActive ? "is-active navlink" : "navlink")}
                                             to="/NhaCungCap">Nhà cung cấp</NavLink> <br/>
                                    <NavLink preventScrollReset={true}
                                             className={({isActive}) => (isActive ? "is-active navlink" : "navlink")}
                                             to="/NhomNhaCungCap">Nhóm nhà cung cấp</NavLink>
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item className="bg-secondary border-0" eventKey="1">
                                <Accordion.Header className="h3">Quản lý khách hàng</Accordion.Header>
                                <Accordion.Body className="pt-0 pb-1 navigate-font">
                                    <NavLink preventScrollReset={true}
                                             className={({isActive}) => (isActive ? "is-active navlink" : "navlink")}
                                             to="/KhachHang">Khách hàng</NavLink> <br/>
                                    <NavLink preventScrollReset={true}
                                             className={({isActive}) => (isActive ? "is-active navlink" : "navlink")}
                                             to="/NhomKhachHang">Nhóm khách hàng</NavLink>
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item className="bg-secondary border-0" eventKey="2">
                                <Accordion.Header className="h3">Quản lý sản phẩm</Accordion.Header>
                                <Accordion.Body className="pt-0 pb-1 navigate-font">
                                    <NavLink preventScrollReset={true}
                                             className={({isActive}) => (isActive ? "is-active navlink" : "navlink")}
                                             to="/SanPham">Sản phẩm</NavLink> <br/>
                                    <NavLink preventScrollReset={true}
                                             className={({isActive}) => (isActive ? "is-active navlink" : "navlink")}
                                             to="/LoaiSanPham">Loại sản phẩm</NavLink>
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item className="bg-secondary border-0" eventKey="3">
                                <Accordion.Header className="h3">Quản lý hóa đơn</Accordion.Header>
                                <Accordion.Body className="pt-0 pb-1 navigate-font">
                                    <NavLink preventScrollReset={true}
                                             className={({isActive}) => (isActive ? "is-active navlink" : "navlink")}
                                             to="/HoaDonNhapHang">Hóa đơn nhập hàng</NavLink> <br/>
                                    <NavLink preventScrollReset={true}
                                             className={({isActive}) => (isActive ? "is-active navlink" : "navlink")}
                                             to="/HoaDonMuaHang">Hóa đơn mua hàng</NavLink>
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item className="bg-secondary border-0" eventKey="4">
                                <Accordion.Header className="h3">Quản lý tồn kho</Accordion.Header>
                                <Accordion.Body className="pt-0 pb-1 navigate-font">
                                    <NavLink preventScrollReset={true}
                                             className={({isActive}) => (isActive ? "is-active navlink" : "navlink")} to="/PhieuNhapKho">Quản lý nhập kho</NavLink> <br/>
                                    <NavLink preventScrollReset={true}
                                             className={({isActive}) => (isActive ? "is-active navlink" : "navlink")} to="/PhieuXuatKho">Quản lý xuất kho</NavLink> <br/>
                                    <NavLink preventScrollReset={true}
                                             className={({isActive}) => (isActive ? "is-active navlink" : "navlink")} to="/TonKho">Tồn kho</NavLink>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    )
}