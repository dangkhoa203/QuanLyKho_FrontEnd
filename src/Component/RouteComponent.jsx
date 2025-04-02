/* eslint-disable react/prop-types */
import { Routes, Route, useLocation } from "react-router-dom"
import Login from "./Login"
import Home from "./Home"
import Register from "./Register"
import Account from "./Account/Account"
import ErrorPage from "./ErrorPage"
import ConfirmEmail from "./ConfirmEmail"
import ChangeEmail from "./Account/ChangeEmail"
import ChangeName from "./Account/ChangeName"
import ConfirmEmailChange from "./Account/ConfirmEmailChange"
import ForgetPassword from "./ForgetPassword"
import ResetPassword from "./ResetPassword"
// import NhaCungCap from "./NhaCungCap/NhaCungCap.jsx";
// import NhomNhaCungCap from "./NhomNhaCungCap/NhomNhaCungCap.jsx";
// import ChitietNhomNhaCungCap from "./NhomNhaCungCap/ChitietNhomNhaCungCap.jsx";
// import NewNhomNhaCungCap from "./NhomNhaCungCap/NewNhomNhaCungCap.jsx";
// import NewNhaCungCap from "./NhaCungCap/NewNhaCungCap.jsx";
// import ChitietNhaCungCap from "./NhaCungCap/ChitietNhaCungCap.jsx";
// import NhomKhachHang from "./NhomKhachHang/NhomKhachHang.jsx";
// import NewNhomKhachHang from "./NhomKhachHang/NewNhomKhachHang.jsx";
// import ChitietNhomKhachHang from "./NhomKhachHang/ChitietNhomKhachHang.jsx";
// import KhachHang from "./KhachHang/KhachHang.jsx";
// import ChitietKhachHang from "./KhachHang/ChitietKhachHang.jsx";
// import NewKhachHang from "./KhachHang/NewKhachHang.jsx";
// import LoaiSanPham from "./LoaiSanPham/LoaiSanPham.jsx";
// import NewLoaiSanPham from "./LoaiSanPham/NewLoaiSanPham.jsx";
// import ChitietLoaiSanPham from "./LoaiSanPham/ChitietLoaiSanPham.jsx";
// import SanPham from "./SanPham/SanPham.jsx";
// import NewSanPham from "./SanPham/NewSanPham.jsx";
// import ChitietSanPham from "./SanPham/ChitietSanPham.jsx";
// import HoaDonNhapHang from "./HoaDonNhapHang/HoaDonNhapHang.jsx";
// import NewHoaDonNhapHang from "./HoaDonNhapHang/NewHoaDonNhapHang.jsx";
// import ChiTietHoaDonNhapHang from "./HoaDonNhapHang/ChiTietHoaDonNhapHang.jsx";
// import PhieuNhapKho from "./PhieuNhapKho/PhieuNhapKho.jsx";
// import NewPhieuNhapKho from "./PhieuNhapKho/NewPhieuNhapKho.jsx";
// import ChitietPhieuNhapKho from "./PhieuNhapKho/ChitietPhieuNhapKho.jsx";
// import TonKho from "./TonKho/TonKho.jsx";
// import HoaDonMuaHang from "./HoaDonMuaHang/HoaDonMuaHang.jsx";
// import NewHoaDonMuaHang from "./HoaDonMuaHang/NewHoaDonMuaHang.jsx";
// import ChitietHoaDonMuaHang from "./HoaDonMuaHang/ChitietHoaDonMuaHang.jsx";
// import PhieuXuatKho from "./PhieuXuatKho/PhieuXuatKho.jsx";
// import NewPhieuXuatKho from "./PhieuXuatKho/NewPhieuXuatKho.jsx";
// import ChitietPhieuXuatKho from "./PhieuXuatKho/ChitietPhieuXuatKho.jsx";
import ChangePassWord from "./Account/ChangePassword.jsx";
import ConfirmPasswordChange from "./Account/ConfirmPasswordChange.jsx";
export default function RouteComponent(props) {
    const location = useLocation()
    return (<>
        <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home user={props.user} />}></Route>
            {/* <Route path="/NhaCungCap" >
                <Route index element={<NhaCungCap user={props.user}/>} />
                <Route path=":id" element={<ChitietNhaCungCap user={props.user}/>}></Route>
                <Route path="Tao" element={<NewNhaCungCap user={props.user}/>}></Route>
            </Route>


            <Route path="/NhomNhaCungCap" >
                <Route index element={<NhomNhaCungCap user={props.user}/>} />
                <Route path="Tao" element={<NewNhomNhaCungCap user={props.user}/>}></Route>
                <Route path=":id" element={<ChitietNhomNhaCungCap user={props.user}/>}></Route>
            </Route>


            <Route path="/KhachHang" >
                <Route index element={<KhachHang user={props.user}/>} />
                <Route path=":id" element={<ChitietKhachHang user={props.user}/>}></Route>
                <Route path="Tao" element={<NewKhachHang user={props.user}/>}></Route>
            </Route>
            <Route path="/SanPham" >
                <Route index element={<SanPham user={props.user}/>} />
                <Route path="Tao" element={<NewSanPham user={props.user}/>}></Route>
                <Route path=":id" element={<ChitietSanPham user={props.user}/>}></Route>
            </Route>


            <Route path="/LoaiSanPham" >
                <Route index element={<LoaiSanPham user={props.user}/>} />
                <Route path="Tao" element={<NewLoaiSanPham user={props.user}/>}></Route>
                <Route path=":id" element={<ChitietLoaiSanPham user={props.user}/>}></Route>
            </Route>


            <Route path="/NhomKhachHang" >
                <Route index element={<NhomKhachHang user={props.user}/>} />
                <Route path="Tao" element={<NewNhomKhachHang user={props.user}/>}></Route>
                <Route path=":id" element={<ChitietNhomKhachHang user={props.user}/>}></Route>
            </Route>


            <Route path="/HoaDonNhapHang" >
                <Route index element={<HoaDonNhapHang user={props.user}/>} />
                <Route path="Tao" element={<NewHoaDonNhapHang user={props.user}/>}></Route>
                <Route path=":id" element={<ChiTietHoaDonNhapHang user={props.user}/>}></Route>
            </Route>


            <Route path="/HoaDonMuaHang" >
                <Route index element={<HoaDonMuaHang user={props.user}/>} />
                <Route path="Tao" element={<NewHoaDonMuaHang user={props.user}/>}></Route>
                <Route path=":id" element={<ChitietHoaDonMuaHang user={props.user}/>}></Route>
            </Route>


            <Route path="/PhieuNhapKho" >
                <Route index element={<PhieuNhapKho user={props.user}/>} />
                <Route path="Tao" element={<NewPhieuNhapKho user={props.user}/>}></Route>
                <Route path=":id" element={<ChitietPhieuNhapKho user={props.user}/>}></Route>
            </Route>


            <Route path="/PhieuXuatKho" >
                <Route index element={<PhieuXuatKho user={props.user}/>} />
                <Route path="Tao" element={<NewPhieuXuatKho user={props.user}/>}></Route>
                <Route path=":id" element={<ChitietPhieuXuatKho user={props.user}/>}></Route>
            </Route>



            <Route path="/TonKho" >
                <Route index element={<TonKho user={props.user}/>} />
            </Route> */}
            <Route path="/Login" element={<Login user={props.user} getInfo={props.getInfo}></Login>}></Route>
            <Route path="/QuenMatKhau" element={<ForgetPassword navigate={props.navigate} user={props.user}/>}></Route>
            <Route path="/ResetMatKhau/:id/:code" element={<ResetPassword navigate={props.navigate} isLogged={props.user.isLogged}/>}></Route>
            <Route path="/Register" element={<Register user={props.user} />}></Route>
            <Route path="/TaiKhoan" element={<Account getInfo={props.getInfo} user={props.user}  />}>
                <Route path="DoiEmail" element={<ChangeEmail user={props.user} />}></Route>
                <Route path="DoiTen" element={<ChangeName  getInfo={props.getInfo} user={props.user} />}></Route>
                <Route path="DoiMatKhau" element={<ChangePassWord user={props.user}></ChangePassWord>}></Route>
            </Route>
            <Route path="*" element={<ErrorPage user={props.user}/>}></Route>
            <Route path="/ConfirmEmail/:username/:code" element={<ConfirmEmail/>}></Route>
            <Route path="/ConfirmDoiEmail/:id/:email/:code" element={<ConfirmEmailChange></ConfirmEmailChange>}></Route>
            <Route path="/ConfirmDoiMatKhau/:id/:password/:code" element={<ConfirmPasswordChange></ConfirmPasswordChange>}></Route>
        </Routes>
    </>)
}