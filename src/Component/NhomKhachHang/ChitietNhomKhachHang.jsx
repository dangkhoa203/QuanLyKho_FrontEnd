import {useParams, useNavigate, Navigate, Link} from "react-router-dom";
import {useEffect, useState} from "react";

export default function ChitietNhomKhachHang(props) {
    //
    const {id} = useParams()
    const [group, setGroup] = useState({})
    //
    const [deleteModal, setDeleteModal] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [editModel, setEditModel] = useState({})
    const [editError, setEditError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const [err, setErr] = useState(false);
    const checkData = (data) => {
        setEditError("");
        if (data.name.length === 0) {
            setEditError("Bạn chưa nhập đủ thông tin!")
            return false;
        }
        return true;
    }
    const getGroup = async () => {
        setLoading(true);
        const response = await fetch(`https://warehouseservice.azurewebsites.net/api/Customer-Groups/${id}`, {
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            method: "GET"
        });
        if (!response.ok) {
            navigate("/Error")
        }
        setLoading(false)
        const content = await response.json();
        setEditModel(content.data)
        setGroup(content.data);
    }
    const Edit = async (data) => {
       if(checkData(data)){
            const response = await fetch(`https://warehouseservice.azurewebsites.net/api/Customer-Groups`, {
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
                getGroup();
            }
       }
    }
    const Delete = async () => {
        const response = await fetch(`https://warehouseservice.azurewebsites.net/api/Customer-Groups/`, {
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            method: "DELETE",
            body: JSON.stringify({
                id: id,
            })
        });
        if (!response.ok) {
            navigate("/Error")
        }
        navigate("/NhomKhachHang");
    }


    //State Change
    const changeEditName = (e) => {
        setEditModel({
            id: editModel.id,
            name: e.target.value,
            description: editModel.description,
        })
    }
    const changeEditDescription = (e) => {
        setEditModel({
            id: editModel.id,
            name: editModel.name,
            description: e.target.value,
        })
    }

    useEffect(() => {
        document.title = `Nhóm khách hàng - ${id}`;
        getGroup()
    }, []);

    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            Edit(editModel)
        }
    }
    if (group == null) {
        return <Navigate to="/Error"/>
    }
    if (!props.user.isLogged && props.user.userId === "") {
        return <Navigate to="/login"></Navigate>
    }
    return (
        <>
            <div className="container pt-1 m-auto">
                <h1 className="text-center page-header pt-1">Thông tin nhóm khách hàng</h1>
                <button className="btn btn-outline-dark border-3 fw-bold  text-start mb-2" style={{width: "120px"}}
                        onClick={() => navigate(-1)}><i className="bi bi-backspace"> Quay về</i></button>
                <div className="pt-4">
                    {!loading ?
                        <>
                            <div className="row rounded-5 border border-5 border-black bg-white p-3 text-center">
                                <div className="col-4">
                                    <h2>ID</h2>
                                    <p>{group.id}</p>
                                </div>
                                <div className="col-4">
                                    <h2>Tên</h2>
                                    {editMode ?
                                        <div className="form-floating mb-3">
                                            <input onKeyDown={handleKeyDown} type="text" className="form-control rounded-0 border-3"
                                                   id="floatingInput" onChange={changeEditName} value={editModel.name}
                                                   placeholder="Tên"/>
                                            <label htmlFor="floatingInput">Tên</label>
                                        </div> : <p>{group.name}</p>}
                                </div>
                                <div className="col-4">
                                    <h2>Ngày tạo</h2>
                                    <p>{new Date(group.dateCreated).toLocaleString('En-GB', {hour12: false})}</p>
                                </div>
                                <hr className="mt-2 mb-2"/>
                                <div className="col-12">
                                    <h2>Mô tả</h2>
                                    {editMode ?
                                        <div className="form-floating">
                            <textarea onKeyDown={handleKeyDown} className="form-control rounded-1 border-3 "
                                      id="floatingInput" onChange={changeEditDescription} value={editModel.description}
                                      placeholder="Mô tả"/>
                                            <label htmlFor="floatingInput">Mô tả</label>
                                        </div> : <p className="text-start p-2 m-0">{group.description}</p>}
                                </div>
                            </div>
                            <h4 className="text-danger pt-3">{editError}</h4>
                            {
                                editMode ?
                                    <div className="d-flex flex-row gap-4 pb-5">
                                        <button className="btn btn-secondary rounded-0 w-25 fw-bold border-3" onClick={() => setEditMode(false)}>Hủy
                                        </button>
                                        <button type={"submit"} className="btn btn-success rounded-0 w-25 fw-bold border-3"
                                                onClick={() => Edit(editModel)}>Cập nhật
                                        </button>

                                    </div>
                                    :
                                    <div className="d-flex flex-row gap-4 pb-5">
                                        <button className="btn btn-danger rounded-0 w-25 fw-bold border-3" onClick={() => setDeleteModal(true)}>Xóa
                                        </button>
                                        <button className="btn btn-secondary rounded-0 w-25 fw-bold border-3" onClick={() => setEditMode(true)}>Sửa
                                        </button>
                                    </div>
                            }
                            <div className={'modalpanel ' + (deleteModal ? "modal-active" : "")}>
                                <div
                                    className='modalpanel-content rounded-0  bg-danger text-black m-auto d-flex justify-content-between flex-column'>
                                    <div className='container-fluid d-flex justify-content-center'>
                                        <p className="h1">Xóa nhóm {group.name}</p>
                                    </div>
                                    <div className='modalpanel-content-text p-3'>
                                        Bạn có muốn xóa nhóm({group.id}) này?
                                    </div>
                                    <div className='align-bottom d-flex gap-3 justify-content-center p-2'>
                                        <button className='btn btn-secondary w-50 fw-bold border-3'
                                                onClick={() => setDeleteModal(false)}>Hủy
                                        </button>
                                        <button className='btn btn-success w-50 fw-bold border-3' onClick={() => Delete()}>Ok</button>
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