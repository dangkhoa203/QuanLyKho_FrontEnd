import {useParams, useNavigate, Navigate, Link} from "react-router-dom";
import {useEffect, useState} from "react";
import {useTheme} from "@table-library/react-table-library/theme";
import {CompactTable} from "@table-library/react-table-library/compact";

export default function ChitietPhieuXuatKho(props) {
    //
    const {id} = useParams()
    const [form, setForm] = useState({
        receipt:{}
    })
    //
    const [deleteModal, setDeleteModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const [err, setErr] = useState(false);

    const getForm = async () => {
        setLoading(true);
        const response = await fetch(`https://warehouseservice.azurewebsites.net/api/export-Forms/${id}`, {
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            method: "GET"
        });
        if (!response.ok) {
            navigate("/Error")
        }
        setLoading(false)
        const content = await response.json();
        setNodes(content.data.details)
        setForm(content.data);
    }

    const Delete = async () => {
        const response = await fetch(`https://warehouseservice.azurewebsites.net/api/export-forms/`, {
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            method: "DELETE",
            body:JSON.stringify({id:id}),
        });
        if (!response.ok) {
            navigate("/Error")
        }
        navigate("../");
    }


    //Table
    const theme = useTheme({
        HeaderRow: `
        .th {
          border: 1px solid black;
          border-bottom: 3px solid black;
           background-color: #51973FFF;
           text-align: center;
        }
      `,
        BaseCell: `
        
      `,
        Row: `
        .td {
          border: 1px solid black;
          
          background: linear-gradient(180deg, rgba(218,218,230,1) 0%, rgba(255,254,254,1) 99%);
        }

       
      `,
        Table: `
        --data-table-library_grid-template-columns:  1fr 1fr 1fr 1fr 1fr ;
      `,
    });
    const [nodes, setNodes] = useState([]);
    const COLUMNS = [
        {label: 'Id sản phẩm', renderCell: (item) => item.productID, resize: true},
        {label: 'Tên sản phẩm', renderCell: (item) => item.productName, resize: true},
        {label: 'Số lượng', renderCell: (item) => item.quantity,resize: true},

    ];
    const data = {nodes};

    //State Change

    useEffect(() => {
        document.title = `Phiếu xuất kho - ${id}`;
        getForm()
    }, []);


    if (form == null) {
        return <Navigate to="/Error"/>
    }
    if(!props.user.isLogged && props.user.userId===""){
        return <Navigate to="/login"></Navigate>
    }
    return (
        <div className="container pt-1 m-auto">
            <h1 className="text-center page-header pt-1">Thông tin phiếu xuất kho</h1>
            <button className="btn btn-outline-dark border-3 fw-bold  text-start mb-2" style={{width: "120px"}}
                    onClick={() => navigate(-1)}><i className="bi bi-backspace"> Quay về</i></button>
            <div className="pt-4">
                {!loading ?
                    <>
                        <div className="row row-gap-2 rounded-5 border border-5 border-black bg-white p-3 text-center">
                            <div className="col-4">
                                <h2>ID:</h2>
                                <p>{form.id}</p>
                            </div>
                            <div className="col-4">
                                <h2>Ngày xuất kho</h2>
                               <p>{new Date(form.dateOfExport).toLocaleString('En-GB', {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                        hour12: false
                                    })}</p>
                            </div>
                            <div className="col-4">
                                <h2>Ngày tạo:</h2>
                                <p>{new Date(form.dateCreated).toLocaleString('En-GB', {hour12: false})}</p>
                            </div>
                            <hr/>
                            <div className="col-6">
                                <h2>ID hóa đơn</h2>
                                <p>{form.receipt.id}</p>
                            </div>
                            <div className="col-6">
                                <h2>Ngày thanh toán</h2>
                                <p>{new Date(form.receipt.dateOfOrder).toLocaleString('En-GB', {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour12: false
                                })}</p>
                            </div>
                            <div className="col-12">
                                <h2>Sản phẩm xuất kho</h2>
                                <CompactTable columns={COLUMNS} data={data} theme={theme}/>
                                {nodes.length === 0 ?
                                    <p className="text-center">Không có sản phẩm </p>
                                    :
                                    ""
                                }
                            </div>
                        </div>



                                <div className="d-flex flex-row gap-4 pt-3 pb-5">
                                    <button className="btn btn-danger fw-bold w-25 rounded-0" onClick={() => setDeleteModal(true)}>Xóa
                                    </button>

                                </div>

                        <div className={'modalpanel ' + (deleteModal ? "modal-active" : "")}>
                            <div
                                className='modalpanel-content rounded-0  bg-white m-auto d-flex justify-content-between flex-column'>
                                <div className='container-fluid d-flex justify-content-center'>
                                    <p className="h1">Xóa nhóm {form.id}</p>
                                </div>
                                <div className='modalpanel-content-text p-3'>
                                    Bạn có muốn xóa nhóm này?
                                </div>
                                <div className='align-bottom d-flex gap-3 justify-content-center p-2'>
                                    <button className='btn btn-secondary w-50'
                                            onClick={() => setDeleteModal(false)}>Hủy
                                    </button>
                                    <button className='btn btn-danger w-50' onClick={() => Delete()}>Ok</button>
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
    )
}