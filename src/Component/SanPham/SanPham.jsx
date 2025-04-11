import {useState, useEffect} from "react";
import {Link, Navigate} from "react-router-dom";
import {CompactTable} from '@table-library/react-table-library/compact';
import {SortToggleType, useSort} from "@table-library/react-table-library/sort";
import {useTheme} from "@table-library/react-table-library/theme";
import {usePagination} from "@table-library/react-table-library/pagination";
import Button from "react-bootstrap/Button";
import {Container, Dropdown, DropdownButton, Form, InputGroup, Spinner} from "react-bootstrap";
export default function SanPham(props) {
    const [loading, setLoading] = useState(false);
    const [nodes, setNodes] = useState([]);
    const [err, setError] = useState(false);
    const [mode, setMode] = useState(1)
    const [search, setSearch] = useState("");
    const [searchLabel, setSearchLabel] = useState("Id");
    useEffect(() => {
        switch (mode){
            case 1:
                setSearchLabel("Id");
                break;
            case 2:
                setSearchLabel("Tên");
                break;
            case 3:
                setSearchLabel("Giá");
                break;
            case 4:
                setSearchLabel("Đơn vị tính");
                break;
            default:
                setSearchLabel("Id");
                break;

        }
    },[mode])
    async function getDs() {
        try {
            setLoading(true);
            setError(false);
            const response = await fetch('https://warehouseservice.azurewebsites.net/api/Products', {
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                method: "GET"
            });
            if (!response.ok) {
                setError(true);
            }
            const content = await response.json();
            setNodes(content.data);
        }catch (er){
            setError(true);
        }finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        document.title = 'Sản phẩm';
        getDs();
    }, []);

    let data = { nodes };
    data={ nodes: data.nodes.filter((item) =>{
                switch (mode){
                    case 1:
                        return  item.id.toLowerCase().includes(search.toLowerCase())
                    case 2:
                        return  item.name.toLowerCase().includes(search.toLowerCase())
                    case 3:
                        return  item.pricePerUnit.toString().toLowerCase().includes(search.toLowerCase())
                    case 4:
                        return  item.measureUnit.toLowerCase().includes(search.toLowerCase())
                    default:
                        return item.id.toLowerCase().includes(search.toLowerCase())

                }

            }
        ),
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
    const handleSearch = (event) => {
        setSearch(event.target.value);
        pagination.fns.onSetPage(0)
    };
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
          font-size: 1.2em;
          border-bottom: 3px solid black;
           background-color: #009063;
           text-align: center;
           div{
            margin: auto;
           }
        }
      `,
        BaseCell: `
        
      `,
        Row: `
         cursor: pointer;
        .td {
          border: 1px solid black;
          font-size:1.1em;
          font-weight: lighter;
          background-color: #1D243A;
          text-align: center;
          color: white;
           transition: 0.3s all ease-in-out;
        }

        &:hover .td {
          background-color: #434656;
           transition: 0.3s all ease-in-out;
        }
      `,
        Table: `
        --data-table-library_grid-template-columns:  1fr 1fr 1fr 1fr 1fr 1fr;
      `,
    });
    const COLUMNS = [
        {label: 'Id', renderCell: (item) => <Link className="detail-nav" to={item.id}>{item.id}</Link>,sort: { sortKey: "id" }},
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

            <Container fluid className="d-flex flex-md-row flex-column justify-content-between align-items-center">
                <Link className="btn btn-success rounded-0 border-2 fw-bold mb-2" to="tao"><i
                    className="bi bi-plus-circle"> Tạo thêm sản phẩm</i></Link>
                <InputGroup style={{width:"400px"}} className="mb-3 rounded-0">
                    <DropdownButton
                        variant="success"
                        title={searchLabel}

                    >
                        <Dropdown.Item onClick={()=>setMode(1)}>Id</Dropdown.Item>
                        <Dropdown.Item onClick={()=>setMode(2)}>Tên</Dropdown.Item>
                        <Dropdown.Item onClick={()=>setMode(3)}>Giá</Dropdown.Item>
                        <Dropdown.Item onClick={()=>setMode(4)}>Đơn vị tính</Dropdown.Item>
                    </DropdownButton>
                    <Form.Control value={search} placeholder="Search" onChange={handleSearch}  />
                </InputGroup>
            </Container>
            {err ?
                <div className="container-fluid d-flex flex-column align-items-center">
                    <div className="container text-center">
                        <p className="m-0 text-danger h3">Lỗi</p>
                        <Button variant="dark" style={{width:"200px"}} onClick={()=>getDs()} >Thử lại</Button>
                    </div>
                </div>
                :
                <>
                    <CompactTable columns={COLUMNS} data={data} theme={theme} sort={sort}
                                  layout={{custom: true, horizontalScroll: true}} pagination={pagination}/>
                    {loading ?
                        <div className="m-auto">
                            <div className="d-flex flex-row gap-3 justify-content-center">
                                <div className="spinner-grow" role="status">
                                </div>
                                <div className="spinner-grow" role="status">
                                </div>
                                <div className="spinner-grow" role="status">
                                </div>
                            </div>
                            <p className="text-center">Loading</p>
                        </div>
                        : <>
                            {nodes.length === 0 ? <p className="text-center">Không có dữ liệu </p> :
                                <div className="d-flex justify-content-end">
                                <span>
                                    Trang:{" "}
                                    {pagination.state.getPages(data.nodes).map((_, index) => (
                                        <button
                                            className={`btn ${pagination.state.page === index ? "btn-success" : "btn-outline-success"} btn-sm`}
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
                        </> }
                </>
            }
        </div>
    </>)
}