import {useForm} from "react-hook-form";
import {useEffect, useState} from "react";
import {Link, Navigate, useNavigate} from "react-router-dom";
import {CompactTable} from "@table-library/react-table-library/compact";
import {useTheme} from "@table-library/react-table-library/theme";

export default function NewHoaDonNhapHang(props) {
    //
    const [vendorList, setVendorList] = useState([]);
    const [productList, setProductList] = useState([]);
    //
    const [showProductList, setShowProductList] = useState([]);
    const [addMode, setAddMode] = useState(false);
    const [addModel, setAddModel] = useState({
        product: "",
        quantity: 1,
    });
    const [totalPrice, setTotalPrice] = useState(0)
    //
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const {register, handleSubmit, watch, formState: {errors}} = useForm();
    const navigate = useNavigate();


    const onSubmit = data => Create(data);
    const getVendorList = async () => {
        const response = await fetch('https://warehouseservice.azurewebsites.net/api/Vendors', {
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            method: "GET"
        });
        if (!response.ok) {
            const text = await response.text();
            throw Error(text);
        }
        const content = await response.json();
        setVendorList(content.data);
    }
    const getProductList = async () => {
        const response = await fetch('https://warehouseservice.azurewebsites.net/api/Products', {
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            method: "GET"
        });
        if (!response.ok) {
            const text = await response.text();
            throw Error(text);
        }
        const content = await response.json();
        setProductList(content.data);
        setShowProductList(content.data)
    }
    const checkData = (data) => {
        if (nodes.length < 1 || data.vendorId === "" || data.dateOrder === "") {
            setError("Chưa nhập đầy đủ thông tin")
            return false;
        }
        if (nodes.some(n => n.quantity <= 0)) {
            setError("Có sản phẩm chưa đủ số lượng")
            return false;
        }
        return true
    }
    const Create = async (data) => {
        setError("")
        if (checkData(data)) {
            try {
                setLoading(true)
                let list = []
                nodes.map(n => {
                    list.push({productId: n.id, quantity: n.quantity})
                })
                const response = await fetch('https://warehouseservice.azurewebsites.net/api/vendor-receipts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({vendorId: data.vendorId, dateOfOrder: data.dateOrder, details: list})
                })
                if (!response.ok) {
                    const content = await response.json();
                    setError(content.errorMessage)
                    setLoading(false)
                    throw Error(content.errorMessage);
                }
                setLoading(false)
                navigate("/HoaDonNhapHang")
            } catch (e) {
                setLoading(false)
            }
        }
    }


    //Table
    const [nodes, setNodes] = useState([]);
    const COLUMNS = [
        {label: 'Tên', renderCell: (item) => item.name, resize: true},
        {label: 'Giá', renderCell: (item) => new Intl.NumberFormat().format(item.pricePerUnit) + " VNĐ", resize: true},
        {
            label: 'Số lượng',
            renderCell: (item) => <input className="w-100" onChange={(e) => updateDetail(item.id, e)} type="number"
                                         value={item.quantity}/>,
            resize: true
        },
        {label: 'Tổng giá trị', renderCell: (item) => new Intl.NumberFormat().format(item.quantity * item.pricePerUnit) + " VNĐ", resize: true},
        {
            label: '', renderCell: (item) =>
                <div className="d-flex justify-content-center">
                    <button className="btn btn-danger" onClick={() => deleteDetail(item.id)}>Xóa</button>
                </div>
            , resize: false
        },
    ];
    const data = {nodes};
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
        --data-table-library_grid-template-columns:  1fr 1fr 1fr 1fr 1fr;
      `,
    });

    //UseEffect
    useEffect(() => {
        document.title = 'Tạo hóa đơn nhập hàng';
        getVendorList()
        getProductList()
        updateShowProductList(nodes)
    }, []);
    useEffect(() => {
        const sum = nodes.reduce((acc, o) => acc + parseInt(o.pricePerUnit * o.quantity), 0)
        setTotalPrice(sum)
    }, [nodes]);


    //Detail function
    const updateShowProductList = (l) => {
        let list = productList.filter(p =>
            !l.some(n => n.id === p.id)
        )
        setShowProductList(list)
    }
    const changeProduct = (e) => {
        setAddModel({
            product: e.target.value,
            quantity: addModel.quantity
        })
    }
    const changeQuantity = (e) => {
        setAddModel({
            product: addModel.product,
            quantity: e.target.value
        })
    }
    const deleteDetail = (id) => {
        let list = nodes.filter(p => p.id !== id);
        setNodes(list)
        updateShowProductList(list)
    }
    const addDetail = () => {
        let list = [...nodes]
        if (!list.some(p => p.id === addModel.product)) {
            productList.map(p => {
                if (p.id === addModel.product) {
                    list.push({
                        id: p.id,
                        name: p.name,
                        pricePerUnit: p.pricePerUnit,
                        quantity: addModel.quantity,
                    })
                }
            })
            setNodes(list)
            updateShowProductList(list)
            setAddModel({
                product: "",
                quantity: 1,
            })
        } else
            setError("Đã có sản phẩm trong hóa đơn")
    }
    const updateDetail = (id, e) => {
        let list = []
        nodes.map(d => {
            if (d.id === id) {
                let detail = {...d};
                if (e.target.value >= 0)
                    detail.quantity = e.target.value;
                else
                    detail.quantity = 0
                list.push(detail);
            } else
                list.push(d);
        });
        setNodes(list)
    }

    if(!props.user.isLogged && props.user.userId===""){
        return <Navigate to="/login"></Navigate>
    }
    let curr = new Date();
    curr.setDate(curr.getDate()+1);
    const date = curr.toISOString().substring(0,10);
    return (
        <div className="d-flex justify-content-center flex-column pt-3 p-5 w-100 ">
            <form className="w-100 d-flex justify-content-center flex-column"
                  onSubmit={handleSubmit(onSubmit)}>
                <button className="btn btn-outline-dark border-3 fw-bold  text-start mb-2" style={{width: "120px"}}
                        type={"button"} onClick={() => navigate(-1)}><i className="bi bi-backspace"> Quay về</i>
                </button>
                <p className="h1 page-header text-center mb-3">Tạo hóa đơn nhập hàng </p>
                <div className="d-flex flex-column">
                    <div className="row">
                        <div className="col-6">
                            <div className="form-floating mb-3">
                                <select className="form-select rounded-0 pb-1 border-3" id="floatingSelect"
                                        aria-label="Floating label select example" {...register("vendorId")}>
                                    <option value="" selected disabled>Lựa chọn nhà cung cấp</option>
                                    {vendorList.map(vendor =>
                                        <option value={vendor.id}>{vendor.name} - {vendor.id}</option>
                                    )}
                                </select>
                                <label htmlFor="floatingSelect">Nhà cung cấp</label>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="form-floating mb-3">
                                <input type={"date"} defaultValue={date} className="form-control rounded-0 border-3"
                                       id="floatingInput" {...register("dateOrder")} placeholder="Tên"/>
                                <label htmlFor="floatingInput">Ngày giao dịch</label>
                            </div>
                        </div>
                    </div>
                    <h6 className="text-danger">{error}</h6>
                </div>

                <div className="d-flex flex-column justify-content-center w-100 pb-4">
                    <button
                        className={`btn btn-success fw-bolder border-3 w-50 m-auto mt-2 rounded-0 ${loading ? "disabled" : ""}`}
                        type="submit">{loading ?
                        <>
                                <span className="spinner-grow spinner-grow-sm ms-1" role="status"
                                      aria-hidden="true"></span>
                            <span className="spinner-grow spinner-grow-sm ms-1" role="status"
                                  aria-hidden="true"></span>
                            <span className="spinner-grow spinner-grow-sm ms-1" role="status"
                                  aria-hidden="true"></span>
                        </> : <>
                            Tạo
                        </>
                    }</button>
                </div>
            </form>
            <div>
                {!addMode ?
                    <div>
                        <button type={"button"} className="btn btn-primary border-3 fw-bold mb-3 rounded-0 w-25" onClick={() => setAddMode(true)}>Thêm
                            sản phẩm vào hóa đơn
                        </button>
                    </div>
                    :
                    <div>
                        <button className="btn btn-secondary border-3 rounded-0 fw-bold w-25" onClick={() => setAddMode(false)}>Hủy</button>
                        <div className="d-flex pt-3 pb-3 gap-5">
                            <div className="form-floating w-100">
                                <select className="form-select" id="floatingSelect"
                                        onChange={changeProduct} aria-label="Floating label select example"
                                        value={addModel.product}>
                                    <option value="" selected disabled>Lựa chọn sản phẩm</option>
                                    {showProductList.map(product =>
                                        <option
                                            value={product.id}>{product.name} - {product.id} - {product.pricePerUnit} VNĐ</option>
                                    )}
                                </select>
                                <label htmlFor="floatingSelect">Sản phẩm</label>
                            </div>
                            <div className="d-flex fl">
                                <div className="form-floating ">
                                    <input type={"number"} className="form-control rounded-0 border-2"
                                           value={addModel.quantity} onChange={changeQuantity} id="floatingInput"
                                           placeholder="Quantity"/>
                                    <label htmlFor="floatingInput">Số lượng</label>
                                </div>
                            </div>
                            <div className="d-flex justify-content-center w-25">
                                <button className="btn btn-success rounded-0 border-3 fw-bold m-auto w-100" onClick={() => addDetail()}>Thêm
                                </button>
                            </div>
                        </div>
                    </div>}
            </div>
            <div>
                <CompactTable columns={COLUMNS} data={data} theme={theme}/>
                {nodes.length === 0 ?
                    <p className="text-center">Không có sản phẩm </p>
                    :
                    <div className="d-flex justify-content-end">
                        <h3>Tổng giá trị hóa đơn: {new Intl.NumberFormat().format(totalPrice)} VNĐ</h3>
                    </div>
                }
            </div>
        </div>
    )
}