import {useState, useEffect} from "react";
import {Link, Navigate} from "react-router-dom";
import {CompactTable} from '@table-library/react-table-library/compact';
import {SortToggleType, useSort} from "@table-library/react-table-library/sort";
import {useTheme} from "@table-library/react-table-library/theme";
import {usePagination} from "@table-library/react-table-library/pagination";
export default function SanPham(props) {
    const [nodes, setNodes] = useState([]);
    const [err, setError] = useState("");

    async function getDs() {
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
        setNodes(content.data);
    }

    useEffect(() => {
        document.title = 'Sản phẩm';
        getDs();
    }, []);

    const data = {nodes};
    const pagination = usePagination(data, {
        state: {
            page: 0,
            size: 10,
        },
        onChange: onPaginationChange,
    });

    function onPaginationChange(action, state) {

    }
    const sort = useSort(
        data,
        {
            onChange: onSortChange,
        },
        {
            sortToggleType: SortToggleType.AlternateWithReset,
            sortFns: {
                id: (array) => array.sort((a, b) => a.id.localeCompare(b.id)),
                ten: (array) => array.sort((a, b) => a.name.localeCompare(b.name)),
                ngaytao: (array) => array.sort((a, b) => a.dateCreated - b.dateCreated),
                gia: (array) =>
                    array.sort((a, b) => a.pricePerUnit - b.pricePerUnit),
                donvitinh: (array) => array.sort((a, b) => a.address.localeCompare(b.address)),
                nhom: (array) => array.sort((a, b) => a.typeName.localeCompare(b.typeName)),
            },
        }
    );
    function onSortChange(action, state) {

    }
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
        --data-table-library_grid-template-columns:  1fr 1fr 1fr 1fr 1fr 1fr;
      `,
    });
    const COLUMNS = [
        {label: 'Id', renderCell: (item) => <Link className="link link-warning link-underline-opacity-0 fw-bolder" to={item.id}>{item.id}</Link>,sort: { sortKey: "id" }},
        {label: 'Tên', renderCell: (item) => item.name,sort: { sortKey: "ten" }},
        {label: 'Giá', renderCell: (item) => new Intl.NumberFormat().format(item.pricePerUnit)+" VNĐ",sort: { sortKey: "gia" }},
        {label: 'Đơn vị tính', renderCell: (item) => item.measureUnit,sort: { sortKey: "donvitinh" }},
        {label: 'Nhóm', renderCell: (item) => item.typeName!=='' ? item.typeName:"Không có nhóm",sort: { sortKey: "nhom" }},
        { label: 'Ngày tạo', renderCell: (item) => new Date(item.dateCreated).toLocaleString('En-GB', { hour12: false }),sort: { sortKey: "ngaytao" } },
    ];
    if(!props.user.isLogged && props.user.userId===""){
        return <Navigate to="/login"></Navigate>
    }
    return (<>
        <div className="p-5 pt-0">
            <h1 className="page-header pt-4 text-center">Danh sách sản phẩm</h1>
            <Link className="btn btn-success rounded-0 border-2 fw-bold mb-2" to="tao"><i
                className="bi bi-plus-circle"> Tạo thêm sản phẩm</i></Link>
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