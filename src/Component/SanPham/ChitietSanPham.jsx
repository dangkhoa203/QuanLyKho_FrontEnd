import {useParams, useNavigate, Navigate, Link} from "react-router-dom";
import {useEffect, useState} from "react";

export default function ChitietSanPham(props) {
    const {id} = useParams()
    const [dsGroup, setDsGroup] = useState([]);
    const [deleteModal, setDeleteModal] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [editModel, setEditModel] = useState({})
    const [editError, setEditError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const [err, setErr] = useState(false);
    const [product, setProduct] = useState({
        type:{}
    })
    const checkData=(data)=>{
        setEditError("")
        if(data.name.length===0||data.measureUnit.length===0||data.pricePerUnit.length===0){
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
       if(checkData(data)) {
           const response = await fetch(`https://warehouseservice.azurewebsites.net/api/Products`, {
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
               getProduct();
           }
       }
    }
    const getDs = async () => {
        const response = await fetch('https://warehouseservice.azurewebsites.net/api/Product-types', {
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
    const getProduct = async () => {
        setLoading(true);
        const response = await fetch(`https://warehouseservice.azurewebsites.net/api/Products/${id}`, {
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
            pricePerUnit:content.data.pricePerUnit,
            measureUnit: content.data.measureUnit,
            typeId: content.data.group!=null ? content.data.group.id : "",
        })
        setProduct(content.data);
    }
    const Xoa = async () => {
        const response = await fetch(`https://warehouseservice.azurewebsites.net/api/Products/`, {
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            method: "DELETE",
            body:JSON.stringify({id:id})
        });
        if (!response.ok) {
            navigate("/Error")
        }
        navigate("/SanPham");
    }
    useEffect(() => {
        document.title = `Sản phẩm - ${id}`;
        getProduct()
    }, []);
    const changeEditName = (e) => {
        setEditModel({
            id: editModel.id,
            name: e.target.value,
            pricePerUnit:editModel.pricePerUnit,
            measureUnit: editModel.measureUnit,
            typeId: editModel.typeId,
        })
    }
    const changeEditPrice = (e) => {
        setEditModel({
            id: editModel.id,
            name: editModel.name,
            pricePerUnit:e.target.value,
            measureUnit: editModel.measureUnit,
            typeId: editModel.typeId,
        })
    }
    const changeEditUnit = (e) => {
        setEditModel({
            id: editModel.id,
            name: editModel.name,
            pricePerUnit:editModel.pricePerUnit,
            measureUnit: e.target.value,
            typeId: editModel.typeId,
        })
    }
    const changeEdittypeId = (e) => {
        setEditModel({
            id: editModel.id,
            name: editModel.name,
            pricePerUnit:editModel.pricePerUnit,
            measureUnit: editModel.measureUnit,
            typeId: e.target.value,
        })
    }
    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            Edit(editModel)
        }
    }
    if(!props.user.isLogged && props.user.userId===""){
        return <Navigate to="/login"></Navigate>
    }
    return (
        <>
            <div className="container pt-1 m-auto">
                <h1 className="page-header text-center pt-1">Thông tin sản phẩm</h1>
                <button className="btn btn-outline-dark border-3 fw-bold  text-start mb-2" style={{width: "120px"}}
                        onClick={() => navigate(-1)}><i className="bi bi-backspace"> Quay về</i></button>
                <div className="pt-4">
                    {!loading ?
                        <>
                            <div
                                className="row row-gap-3 rounded-5 border border-5 border-black bg-white p-3 text-center">
                                <div className="col-6">
                                    <h2>ID</h2>
                                    <p>{product.id}</p>
                                </div>
                                <div className="col-6">
                                    <h2>Ngày tạo</h2>
                                    <p>{new Date(product.dateCreated).toLocaleString('En-GB', {hour12: false})}</p>
                                </div>
                                <hr/>
                                <div className="col-4">
                                    <h2>Tên</h2>
                                    {editMode ?
                                        <div className="form-floating">
                                            <input onKeyDown={handleKeyDown} onChange={changeEditName} type="text" value={editModel.name}
                                                   className="form-control rounded-0 border-3  border-2"
                                                   id="floatingInput"
                                                   placeholder="Đơn vị tính"/>
                                            <label htmlFor="floatingInput">Tên sản phẩm</label>
                                        </div> : <p>{product.name}</p>}
                                </div>
                                <div className="col-4">
                                    <h2>Đơn vị tính</h2>
                                    {editMode ?
                                        <div className="form-floating">
                                            <input onKeyDown={handleKeyDown} onChange={changeEditUnit} type="text"
                                                   value={editModel.measureUnit}
                                                   className="form-control rounded-0 border-3  border-2"
                                                   id="floatingInput"
                                                   placeholder="Đơn vị tính"/>
                                            <label htmlFor="floatingInput">Đơn vị tính</label>
                                        </div> : <p>{product.measureUnit}</p>}
                                </div>
                                <div className="col-4">
                                    <h2>Giá</h2>
                                    {editMode ?
                                        <div className="form-floating">
                                            <input onKeyDown={handleKeyDown} onChange={changeEditPrice} type="number"
                                                   value={editModel.pricePerUnit}
                                                   className="form-control rounded-0 border-3  border-2"
                                                   id="floatingInput"
                                                   placeholder="Đơn vị tính"/>
                                            <label htmlFor="floatingInput">Giá(VNĐ)</label>
                                        </div> : <p>{new Intl.NumberFormat().format(product.pricePerUnit) + " VNĐ"}</p>}
                                </div>
                                <hr/>
                                {product.type !== null ?
                                    <>
                                        <div className="col-6">
                                            <h2>ID nhóm</h2>
                                            <p>{product.type.id}</p>
                                        </div>
                                        <div className="col-6">
                                            <h2>Tên nhóm</h2>
                                            <p>{product.type.name}</p>
                                        </div>
                                        {editMode ?
                                            <div className="col-12">
                                                <div className="form-floating">
                                                    <select className="form-select rounded-0 border-3 pb-1" id="floatingSelect"
                                                            aria-label="Floating label select example"
                                                            onChange={changeEdittypeId} value={editModel.typeId}>
                                                        <option value="" selected>Không có nhóm</option>
                                                        {dsGroup.map(group =>
                                                            <option value={group.id}>{group.name}({group.id})</option>
                                                        )}
                                                    </select>
                                                    <label htmlFor="floatingSelect">Nhóm</label>
                                                </div>
                                            </div>
                                            : ""}
                                    </> :
                                    <>
                                        <div className="col-12">
                                            <h2>Nhóm</h2>
                                            <p>Không có nhóm</p>
                                            {editMode ?
                                                <div className="form-floating">
                                                    <select className="form-select rounded-0 border-3" id="floatingSelect"
                                                            aria-label="Floating label select example"
                                                            onChange={changeEdittypeId} value={editModel.typeId}>
                                                        <option value="" selected>Không có nhóm</option>
                                                        {dsGroup.map(group =>
                                                            <option value={group.id}>{group.name}({group.id})</option>
                                                        )}
                                                    </select>
                                                    <label htmlFor="floatingSelect">Nhóm</label>
                                                </div>
                                                : ""}
                                        </div>
                                    </>}

                            </div>


                            <h4 className="text-danger pt-3">{editError}</h4>
                            {
                                editMode ?
                                    <div className="d-flex flex-row gap-4 pb-5">
                                        <button className="btn btn-secondary rounded-0 fw-bold w-25" onClick={() => {
                                            setEditMode(false)
                                            setEditModel({
                                                id: product.id,
                                                name: product.name,
                                                pricePerUnit: product.pricePerUnit,
                                                measureUnit: product.measureUnit,
                                                typeId: product.type!=null ? product.type.id : "",
                                            })
                                        }}>Hủy
                                        </button>
                                        <button type={"submit"} className="btn btn-success rounded-0 fw-bold w-25"
                                                onClick={() => Edit(editModel)}>Save
                                        </button>

                                    </div>
                                    :
                                    <div className="d-flex flex-row gap-4 pb-5">
                                        <button className="btn btn-danger rounded-0 fw-bold w-25" onClick={() => setDeleteModal(true)}>Xóa
                                        </button>
                                        <button className="btn btn-secondary rounded-0 fw-bold w-25" onClick={() => {
                                            setEditMode(true)
                                            getDs();
                                        }}>Sửa
                                        </button>
                                    </div>
                            }
                            <div className={'modalpanel ' + (deleteModal ? "modal-active" : "")}>
                                <div
                                    className='modalpanel-content rounded-0 border-3   bg-white m-auto d-flex justify-content-between flex-column'>
                                    <div className='container-fluid d-flex justify-content-center'>
                                        <p className="h1">Xóa nhóm {product.id}</p>
                                    </div>
                                    <div className='modalpanel-content-text p-3'>
                                        Bạn có muốn xóa nhóm này?
                                    </div>
                                    <div className='align-bottom d-flex gap-3 justify-content-center p-2'>
                                        <button className='btn btn-secondary w-50'
                                                onClick={() => setDeleteModal(false)}>Hủy
                                        </button>
                                        <button className='btn btn-danger w-50' onClick={() => Xoa()}>Ok</button>
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