import {useParams, useNavigate, Navigate, Link} from "react-router-dom";
import {useEffect, useState} from "react";

export default function ChitietKhachHang(props) {
    const {id} = useParams()
    const [dsGroup, setDsGroup] = useState([]);
    const [deleteModal, setDeleteModal] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [editModel, setEditModel] = useState({})
    const [editError, setEditError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const [customer, setCustomer] = useState({
        group: {}
    })
    const checkData=(data)=>{
        console.log(data)
        setEditError("")
        if(data.name.length===0){
            setEditError("Chưa nhập đầy đủ thông tin")
            return false;
        }
        if(data.pricePerUnit<0){
            setEditError("Lỗi data")
            return false;
        }
        return true;
    }
    const Edit = async (data) => {
       if(checkData(data)){
            const response = await fetch(`https://warehouseservice.azurewebsites.net/api/Customers`, {
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify(data),
                method: "PUT"
            });
            if (!response.ok) {
                const content = await response.json();
                if(content.validateError!==null && !content.validateError.isValid){
                    let list=content.validateError.errors
                    list.forEach((element) => {
                        setEditError(element.errorMessage)
                    })
                }else {
                    setEditError(content.errorMessage)
                }
            }else {
                setEditMode(false)
                getVendor();
            }
       }
    }
    const getDs = async () => {
        const response = await fetch('https://warehouseservice.azurewebsites.net/api/Customer-Groups', {
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            method: "GET"
        });
        if (!response.ok) {
            const text = await response.text();
            throw Error(text);
        }
        const content = await response.json();
        setDsGroup(content.data);
    }
    const getVendor = async () => {
        setLoading(true);
        const response = await fetch(`https://warehouseservice.azurewebsites.net/api/Customers/${id}`, {
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            method: "GET"
        });
        if (!response.ok) {
            navigate("/Error")
        }
        setLoading(false)
        const content = await response.json();
        setEditModel({
            id: content.data.id,
            name: content.data.name,
            address: content.data.address,
            email: content.data.email,
            phoneNumber: content.data.phoneNumber,
            groupId: "",
        })
        setCustomer(content.data);
    }
    const Xoa = async () => {
        const response = await fetch(`https://warehouseservice.azurewebsites.net/api/v1/Customers/`, {
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            method: "DELETE",
            body: JSON.stringify({ id: id }),
        });
        if (!response.ok) {
            navigate("/Error")
        }
        navigate("/KhachHang");
    }

    useEffect(() => {
        document.title = `Khách hàng - ${id}`;
        getVendor()
    }, []);
    const changeEditName = (e) => {
        setEditModel({
            id: editModel.id,
            name: e.target.value,
            address: editModel.address,
            email: editModel.email,
            phoneNumber: editModel.phoneNumber,
            groupId: editModel.groupId,
        })
    }
    const changeEditAddress = (e) => {
        setEditModel({
            id: editModel.id,
            name: editModel.name,
            address: e.target.value,
            email: editModel.email,
            phoneNumber: editModel.phoneNumber,
            groupId: editModel.groupId,
        })
    }
    const changeEditEmail = (e) => {
        setEditModel({
            id: editModel.id,
            name: editModel.name,
            address: editModel.address,
            email: e.target.value,
            phoneNumber: editModel.phoneNumber,
            groupId: editModel.groupId,
        })
    }
    const changeEditPhoneNumber = (e) => {
        setEditModel({
            id: editModel.id,
            name: editModel.name,
            address: editModel.address,
            email: editModel.email,
            phoneNumber: e.target.value,
            groupId: editModel.groupId,
        })
    }
    const changeEditGroupId = (e) => {
        setEditModel({
            id: editModel.id,
            name: editModel.name,
            address: editModel.address,
            email: editModel.email,
            phoneNumber: editModel.phoneNumber,
            groupId: e.target.value,
        })
    }
    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            Edit(editModel)
        }
    }
    if (!props.user.isLogged && props.user.userId === "") {
        return <Navigate to="/login"></Navigate>
    }
    return (
        <>
            <div className="container pt-1 m-auto">
                <h1 className="text-center page-header pt-1">Thông tin khách hàng</h1>
                <button className="btn btn-outline-dark border-3 fw-bold  text-start mb-2" style={{width: "120px"}}
                        onClick={() => navigate(-1)}><i className="bi bi-backspace"> Quay về</i></button>
                <div className="pt-4">
                    {!loading ?
                        <>
                            <div className="row row-gap-3 rounded-5 border border-5 border-black bg-white p-3 text-center">
                                <div className="col-4">
                                    <h2>ID</h2>
                                    <p>{customer.id}</p>
                                </div>

                                <div className="col-4">
                                    <h2>Tên</h2>
                                    {editMode ?
                                        <div className="form-floating ">
                                            <input onKeyDown={handleKeyDown} onChange={changeEditName} type="text" value={editModel.name}
                                                   className="form-control rounded-0 border-3 "
                                                   id="floatingInput" placeholder="Tên"/>
                                            <label htmlFor="floatingInput">Tên</label>
                                        </div> : <p>{customer.name}</p>}
                                </div>
                                <div className="col-4">
                                    <h2>Ngày tạo</h2>
                                    <p>{new Date(customer.dateCreated).toLocaleString('En-GB', {hour12: false})}</p>
                                </div>
                                <hr/>
                                <div className="col-4">
                                    <h2>Địa chỉ</h2>
                                    {editMode ?
                                        <div className="form-floating ">
                                            <input onKeyDown={handleKeyDown} onChange={changeEditAddress} type="text"
                                                   value={editModel.address}
                                                   className="form-control rounded-0 border-3 "
                                                   id="floatingInput" placeholder="Tên"/>
                                            <label htmlFor="floatingInput">Địa chỉ</label>
                                        </div> : <p>{customer.address!== "" ? customer.address : "Không có"}</p>}
                                </div>
                                <div className="col-4">
                                    <h2>Email</h2>
                                    {editMode ?
                                        <div className="form-floating ">
                                            <input onKeyDown={handleKeyDown} onChange={changeEditEmail} type="email" value={editModel.email}
                                                   className="form-control rounded-0 border-3 "
                                                   id="floatingInput" placeholder="Tên"/>
                                            <label htmlFor="floatingInput">Email</label>
                                        </div> : <p>{customer.email!== "" ? customer.email : "Không có"}</p>}
                                </div>
                                <div className="col-4">
                                    <h2>Điện thoại:</h2>
                                    {editMode ?
                                        <div className="form-floating ">
                                            <input onKeyDown={handleKeyDown} onChange={changeEditPhoneNumber} type="tel"
                                                   value={editModel.phoneNumber}
                                                   className="form-control rounded-0 border-3 "
                                                   id="floatingInput" placeholder="Tên"/>
                                            <label htmlFor="floatingInput">Điện thoại</label>
                                        </div> : <p>{customer.phoneNumber !== "" ? customer.phoneNumber : "Không có"}</p>}
                                </div>
                                <hr/>
                                {customer.group == null ?
                                    <>
                                        <div className="col-12">
                                            <h2>Nhóm:</h2>
                                            <p>Không có nhóm</p>
                                            {editMode ?
                                                <div className="form-floating">
                                                    <select onChange={changeEditGroupId} value={editModel.groupId}
                                                            className="form-select rounded-0 border-3 pb-1 "
                                                            id="floatingSelect"
                                                            aria-label="Floating label select example">
                                                        <option value="" selected>Không có nhóm</option>
                                                        {dsGroup.map(group =>
                                                            <option key={group.id}
                                                                    value={group.id}>{group.name}({group.id})</option>
                                                        )}
                                                    </select>
                                                    <label htmlFor="floatingSelect">Nhóm</label>
                                                </div>
                                                : ""}
                                        </div>
                                    </> :
                                    <>
                                        <div className="col-6">
                                            <h2>ID nhóm:</h2>
                                            <p>{customer.group.id}</p>
                                        </div>
                                        <div className="col-6">
                                            <h2>Tên nhóm</h2>
                                            <p>{customer.group.name}</p>
                                        </div>
                                        {editMode ?
                                            <div className="col-12">
                                                <div className="form-floating">
                                                    <select onChange={changeEditGroupId} value={editModel.groupId}
                                                            className="form-select rounded-0 border-3 pb-1 "
                                                            id="floatingSelect"
                                                            aria-label="Floating label select example">
                                                        <option value="" selected>Không có nhóm</option>
                                                        {dsGroup.map(group =>
                                                            <option key={group.id}
                                                                    value={group.id}>{group.name}({group.id})</option>
                                                        )}
                                                    </select>
                                                    <label htmlFor="floatingSelect">Nhóm</label>
                                                </div>
                                            </div>
                                            : ""}
                                    </>}
                            </div>
                            <h4 className="text-danger pt-3">{editError}</h4>
                            {
                                editMode ?
                                    <div className="d-flex flex-row gap-4 pb-5">
                                        <button className="btn btn-secondary rounded-0 w-25 fw-bold border-3"
                                                onClick={() => {
                                                    setEditMode(false)
                                                    setEditModel({
                                                        id: customer.id,
                                                        name: customer.name,
                                                        address: customer.address,
                                                        email: customer.email,
                                                        phoneNumber: customer.phoneNumber,
                                                        groupId: "",
                                            })
                                        }}>Hủy
                                        </button>
                                        <button type={"submit"} className="btn btn-success rounded-0 w-25 fw-bold border-3"
                                                onClick={() => Edit(editModel)}>Save
                                        </button>

                                    </div>
                                    :
                                    <div className="d-flex flex-row gap-4 pb-5">
                                        <button className="btn btn-danger rounded-0 w-25 fw-bold border-3 " onClick={() => setDeleteModal(true)}>Xóa
                                        </button>
                                        <button className="btn btn-secondary rounded-0 w-25 fw-bold border-3" onClick={() => {
                                            setEditMode(true)
                                            getDs();
                                        }}>Sửa
                                        </button>
                                    </div>
                            }
                            <div className={'modalpanel ' + (deleteModal ? "modal-active" : "")}>
                                <div
                                    className='modalpanel-content rounded-0  bg-danger m-auto d-flex justify-content-between flex-column'>
                                    <div className='container-fluid d-flex justify-content-center'>
                                        <p className="h1">Xóa khách hàng {customer.name}</p>
                                    </div>
                                    <div className='modalpanel-content-text p-3'>
                                        Bạn có muốn xóa khách hàng({customer.id}) này?
                                    </div>
                                    <div className='align-bottom d-flex gap-3 justify-content-center p-2'>
                                        <button className='btn btn-secondary fw-bold w-50'
                                                onClick={() => setDeleteModal(false)}>Hủy
                                        </button>
                                        <button className='btn btn-success fw-bold w-50' onClick={() => Xoa()}>Ok</button>
                                    </div>
                                </div>
                            </div>
                        </> :
                        <div className='text-center mt-4'>
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}