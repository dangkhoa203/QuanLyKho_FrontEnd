import { useForm } from "react-hook-form";
import {useEffect, useState} from "react";
import {Link, Navigate, useNavigate} from "react-router-dom";
export default function NewPhieuXuatKho(props){
    const [receiptList, setReceiptList]=useState([]);
    const [loading, setLoading] = useState(false)
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [error, setError] = useState("")
    const getReceiptList = async () =>{
        const response = await fetch('https://warehouseservice.azurewebsites.net/api/customer-Receipts', {
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            method:"GET"
        });
        if (!response.ok) {
            const text = await response.text();
            throw Error(text);
        }
        const content = await response.json();
        setReceiptList(content.data);
    }
    const onSubmit = data => Create(data);
    const checkData=(data)=>{
        if(data.orderDate===""||data.receiptId===""){
            setError("Thông tin chưa được nhâp đầy đủ")
            return false;
        }
        return true;
    }
    const Create=async (data)=>{
        setError("")
        if(checkData(data)){
            try {
                setLoading(true)
                const response = await fetch('https://warehouseservice.azurewebsites.net/api/export-forms', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(data)
                })
                if (!response.ok) {
                    const content = await response.json();
                    setError(content.errorMessage)
                    setLoading(false)
                    throw Error(content.errorMessage);
                }
                setLoading(false)
                navigate("../")
            } catch (e) {
                setLoading(false) }
        }

    }

    useEffect(() => {
        document.title = 'Tạo phiếu xuất kho';
        getReceiptList()
    }, []);
    if(!props.user.isLogged && props.user.userId===""){
        return <Navigate to="/login"></Navigate>
    }
    let curr = new Date();
    curr.setDate(curr.getDate()+1);
    const date = curr.toISOString().substring(0,10);
    return(
        <>
            <div className="container d-flex justify-content-center p-5 w-100 ">
                <form className="w-50 border border-3 rounded-0 p-3 bg-white d-flex justify-content-center flex-column"
                      onSubmit={handleSubmit(onSubmit)}>
                    <p className="h1 page-header text-center mb-3">Tạo phiếu xuất kho</p>
                    <button type={"button"} className="btn btn-outline-dark border-3 fw-bold  text-start mb-2"
                            style={{width: "120px"}}
                            onClick={() => navigate(-1)}><i className="bi bi-backspace"> Quay về</i></button>
                    <div className="d-flex flex-column">
                        <div className="form-floating mb-3">
                            <input type={"date"} defaultValue={date} className="form-control rounded-0 border-3"
                                   id="floatingInput" {...register("DateOfExport")} placeholder="Tên"/>
                            <label htmlFor="floatingInput">Ngày hoàn tiền</label>
                        </div>
                        <div className="form-floating mb-1">
                            <select className="form-select rounded-0 border-3 pb-1" id="floatingSelect"
                                    aria-label="Floating label select example" {...register("receiptId")}>
                                <option value="" selected disabled>Lựa chọn hóa đơn</option>
                                {receiptList.map(receipt =>
                                    <option
                                        key={receipt.id}
                                        value={receipt.id}>{receipt.id + " (" + new Date(receipt.dateOfOrder).toLocaleString('En-GB', {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                        hour12: false
                                    }) + ")"}</option>
                                )}
                            </select>
                            <label htmlFor="floatingSelect">Hóa đơn</label>
                        </div>
                        <div className="form-floating mb-1">
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" {...register("updateStock")}
                                       id="defaultCheck1"/>
                                <label className="form-check-label" htmlFor="defaultCheck1">
                                    Update tồn kho
                                </label>
                            </div>
                        </div>
                        <h6 className="text-danger">{error}</h6>
                    </div>
                    <div className="d-flex flex-column justify-content-center w-100">
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

            </div>
        </>
    )
}