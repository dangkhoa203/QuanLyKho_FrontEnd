import {useEffect, useState} from "react";
import {Link, Navigate} from "react-router-dom";
import {CompactTable} from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import {SortToggleType, useSort} from "@table-library/react-table-library/sort";
import {usePagination} from "@table-library/react-table-library/pagination";
export default function HoaDonMuaHang(props) {
    const [err, setError] = useState("");
    async function getList() {
        const response = await fetch('https://warehouseservice.azurewebsites.net/api/customer-Receipts', {
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            method: "GET"
        });
        if (!response.ok) {
            const text = await response.text();
            throw Error(text);
        }
        const content = await response.json();
        setNodes(content.data)
    }


    //Table
    const theme = useTheme({
        HeaderRow: `
        .th {
          border: 1px solid black;
          border-bottom: 3px solid black;
           background-color: #009063;
        }
      `,
        BaseCell: `
        
      `,
        Row: `
        cursor: pointer;
        .td {
          border: 1px solid black;
          background-color: #007ed4;
          transition: all 0.2s ease-in-out;
        }

        &:hover .td {
          border-top: 1px solid yellow;
          border-bottom: 1px solid yellow;
          transition: all 0.2s ease-in-out;
        }
      `,
        Table: `
        --data-table-library_grid-template-columns:  1fr 1fr 1fr 1fr;
      `,
    });
    const COLUMNS = [
        {label: 'Id', renderCell: (item) => <Link className="link link-warning link-underline-opacity-0 fw-bolder" to={item.id}>{item.id}</Link>,sort: { sortKey: "id" }},
        {label: 'Ngày thanh toán', renderCell: (item) => new Date(item.dateOfOrder).toLocaleString('En-GB', {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour12: false
            }),sort: { sortKey: "ngaythanhtoan" }},
        {label: 'Tên khách hàng', renderCell: (item) => item.customer.name,sort: { sortKey: "tenhacungcap" }},
        {label: 'Ngày tạo', renderCell: (item) => new Date(item.dateCreated).toLocaleString('En-GB', {hour12: false}),sort: { sortKey: "ngaytao" }},
    ];
    const [nodes, setNodes] = useState([]);
    const data = {nodes};
    const sort = useSort(
        data,
        {
            onChange: onSortChange,
        },
        {
            sortToggleType: SortToggleType.AlternateWithReset,
            sortFns: {
                id: (array) => array.sort((a, b) => a.id.localeCompare(b.id)),
                tennhacungcap: (array) => array.sort((a, b) => a.vendor.name.localeCompare(b.vendor.name)),
                ngaythanhtoan: (array) => array.sort((a, b) => a.dateOrder - b.dateOrder),
                ngaytao: (array) => array.sort((a, b) => a.dateCreated - b.dateCreated),
            },
        }
    );
    function onSortChange(action, state) {
    }
    const pagination = usePagination(data, {
        state: {
            page: 0,
            size: 10,
        },
        onChange: onPaginationChange,
    });
    function onPaginationChange(action, state) {
    }
    //UseEffect
    useEffect(() => {
        document.title = 'Hóa đơn mua hàng';
        getList()
    }, []);

    if(!props.user.isLogged && props.user.userId===""){
        return <Navigate to="/login"></Navigate>
    }
    return (<>
        <div className="p-5 pt-0">
            <h1 className="pt-4 page-header text-center">Danh sách hoá đơn mua hàng</h1>
            <Link className="btn btn-success rounded-0 border-2 fw-bold mb-2" to="tao"><i className="bi bi-plus-circle"> Tạo thêm hoá đơn mua hàng</i></Link>
            <CompactTable columns={COLUMNS} data={data} theme={theme} sort={sort}
                          layout={{custom: true, horizontalScroll: true}} pagination={pagination}/>
            {nodes.length === 0 ? <p className="text-center">Không có dữ liệu </p> :
                <div className="d-flex justify-content-end">
                       <span>
          Trang:{" "}
                           {pagination.state.getPages(data.nodes).map((_, index) => (
                               <button
                                   className={`btn ${pagination.state.page === index ? "btn-primary" : "btn-outline-primary"} btn-sm`}
                                   key={index}
                                   type="button"
                                   style={{
                                       marginRight: "5px",
                                       fontWeight: pagination.state.page === index ? "bold" : "normal",
                                   }}
                                   onClick={() => pagination.fns.onSetPage(index)}
                               >
                                   {index + 1}
                               </button>
                           ))}
        </span>
                </div>}
        </div>
    </>)
}