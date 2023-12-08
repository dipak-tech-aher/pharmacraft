import React, { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from "../AppContext";
import { get, post, put } from "../util/restUtil";
import { properties } from "../properties";
import { showSpinner, hideSpinner } from "../common/spinner";
import { toast } from 'react-toastify';
import { unstable_batchedUpdates } from 'react-dom';
import DynamicTable from '../common/table/DynamicTable';
import { useHistory } from "react-router-dom";
import moment from 'moment';
import Modal from 'react-modal'

const ViewPo = (props) => {
    const history = useHistory();
    const { auth } = useContext(AppContext);
    const [recievedQty, setRecievedQty] = useState()
    const [openViewModal, setOpenViewModal] = useState(false)
    const [isRefresh, setIsRefresh] = useState(false)
    const [tableViewRowData, setTableViewRowData] = useState([]);

    const [tableRowData, setTableRowData] = useState([]);
    useEffect(() => {
        showSpinner();
        get(`${properties.PURCHASE_ORDER_API}`)
            .then((response) => {
                setTableRowData(response.data)
            })
            .finally(hideSpinner)
    }, [isRefresh])

    const handleOpenModal = (rows) => {
        setOpenViewModal(true);
        setTableViewRowData(rows)
    }

    const onClose = () => {
        setOpenViewModal(false);
        setTableViewRowData([])
        setIsRefresh(!isRefresh)
    }
    
    const handleForm=(rowData)=>{
       console.log("data...............>",rowData);
        history.push(`${process.env.REACT_APP_BASE}/po-create`,{
            data:{
                rowData,
                action:"UPDATE"
            }
        })
}
    const handleCellRender = (cell, row) => {
        if (cell.column.id === "action") {
            return (<>
                <button className='btn btn-primary' onClick={(e) => handleOpenModal(row?.original?.poTxnDetails)}>
                    <i className="fas fa-eye"></i> Get Entry
                </button>
                <span style={{ margin: '0 5px' }}></span>
                <button className='btn btn-primary' onClick={(e) => handleForm(row?.original)}>
                 Update
                </button>
            </>)
        }
        if (cell.column.id === "poId") {
            return (<span className="text-primary cursor-pointer" onClick={(e) => handleCellLinkClick(e, row.original)}>{cell.value}</span>)
        }
        if (cell.column.id === "itemsCount") {
            return (<span className="text-primary cursor-pointer">{row.original?.poTxnDetails?.length}</span>)
        }
        if (cell.column.id === "poDate") {
            return (<span>{moment(cell.value)?.format('DD-MM-YYYY')}</span>);
        }
        if (cell.column.id === "poDeliveryDate") {
            return (<span>{moment(cell.value)?.format('DD-MM-YYYY')}</span>);
        }
        if (cell.column.id === "createdAt") {
            return (<span>{moment(cell.value)?.format('DD-MM-YYYY')}</span>);
        }
        if (cell.column.id === "updatedAt") {
            return (<span>{moment(cell.value)?.format('DD-MM-YYYY')}</span>);
        }
        if (cell.column.id === "CreatedBy") {
            return (<span className="text-primary cursor-pointer" onClick={(e) => handleCellLinkClick(e, row.original)}>{row.original?.createdByDetails?.firstName + ' ' + row.original?.createdByDetails?.lastName}</span>)
        }
        if (cell.column.id === "UpdatedBy") {
            return (<span className="text-primary cursor-pointer" onClick={(e) => handleCellLinkClick(e, row.original)}>{row.original?.updatedByDetails?.firstName + ' ' + row.original?.updatedByDetails?.lastName}</span>)
        }
        else {
            return (<span>{cell.value}</span>)
        }
    }

    const handleCellLinkClick = (e, rowData) => {
        const { invId } = rowData;
        history.push(`${process.env.REACT_APP_BASE}/inventory-create`, {
            data: {
                invId,
                rowData
            }
        })
    }

    const columns = [
        {
            Header: "Action",
            accessor: "action",
            disableFilters: true,
            click: true,
            id: "action"
        },
        {
            Header: "Items Count",
            accessor: "itemsCount",
            disableFilters: true,
            click: true,
            id: "itemsCount"
        },
        // {
        //     Header: "Po Id",
        //     accessor: "poId",
        //     disableFilters: true,
        //     click: true,
        //     id: "poId"
        // },
        {
            Header: "Po Number",
            accessor: "poNumber",
            disableFilters: true
        },
        {
            Header: "Po Date",
            accessor: "poDate",
            disableFilters: true,
            id: "poDate"
        },
        {
            Header: "Schedled Delivery Date",
            accessor: "poDeliveryDate",
            id: "poDeliveryDate",
            disableFilters: true,
        },
        // {
        //     Header: "status",
        //     accessor: "statusDesc.description",
        //     disableFilters: true,
        // },
        {
            Header: "Created By",
            accessor: "createdByDetails.firstName",
            disableFilters: true,
            id: "CreatedBy"
        },
        {
            Header: "Updated By",
            accessor: "updatedByDetails.firstName",
            disableFilters: true,
            id: "UpdatedBy"
        },
        {
            Header: "Created At",
            accessor: "createdAt",
            disableFilters: true,
            id: "createdAt"
        },
        {
            Header: "Updated At",
            accessor: "updatedAt",
            disableFilters: true,
            id: "updatedAt"
        }
    ]

    const viewColumns = [
        {
            Header: "Items Name",
            accessor: "categoryDetails.catName",
            disableFilters: true,
            click: true,
            id: "catName"
        },
        {
            Header: "Size",
            accessor: "categoryDetails.catSize",
            disableFilters: true,
            click: true,
            id: "catSize"
        },
        {
            Header: "Unit",
            accessor: "categoryDetails.catUnit",
            disableFilters: true
        },
        {
            Header: "Items yet to be recieved",
            accessor: "poQty",
            disableFilters: true,
            id: "poQty"
        },
        {
            Header: "In Hand Stock",
            accessor: "poRecievedQty",
            disableFilters: true,
            id: "poRecievedQty"
        },
        {
            Header: "Recieved Qty",
            accessor: "recievedPoQty",
            disableFilters: true,
            id: "recievedPoQty"
        },
        {
            Header: "Action",
            accessor: "recievedPoQty",
            disableFilters: true,
            id: "action"
        }
    ]

    const handleSubmitEntry = (rows) => {
        console.log('rows------>', rows)
        console.log('recievedQty------>', recievedQty)
        if (rows?.poQty < recievedQty) {
            toast.error('Please Enter Valid Quantity')
            return
        }
        post(`${properties.PURCHASE_ORDER_API}/add-stock-entry`, {
            recievedQty,
            poCatId: rows?.poCatId,
            poId: rows?.poId,
            poTxnId: rows?.poTxnId,
            poQty: rows?.poQty
        })
            .then((response) => {
                toast.success(response?.message)
                onClose();
            })
            .finally(hideSpinner)
    }

    const handleViewCellRender = (cell, row) => {
        if (cell.column.id === "recievedPoQty") {
            return (<><center>{Number(row?.original?.poQty) !== 0 ? <input type="text" className='form-control' onChange={(e) => setRecievedQty(e?.target?.value)} placeholder='Recieved Qty' style={{ "width": "50%" }} /> : <span>Item already Recieved</span>}</center></>)
        }
        if (cell.column.id === "action") {
            return (<><button type='button' className='btn btn-primary' onClick={(e) => handleSubmitEntry(row?.original)}>Update</button></>)
        }
        else {
            return (<span>{cell.value}</span>)
        }
    }

    const handleViewCellLinkClick = (e, rowData) => {
        const { invId } = rowData;
        history.push(`${process.env.REACT_APP_BASE}/inventory-create`, {
            data: {
                invId
            }
        })
    }

    return (
        <div className="container-fluid">
            <div className="col-12">
                <h1 className="title bold">View po's</h1>
            </div>
            <div className="row mt-1">
                <div className="col-lg-12">
                    <div className="card-box">
                        <DynamicTable
                            row={tableRowData}
                            header={columns}
                            itemsPerPage={10}
                            handler={{
                                handleCellRender: handleCellRender,
                                handleLinkClick: handleCellLinkClick
                            }}
                        />
                    </div>
                </div>
            </div>
            <Modal isOpen={openViewModal}>
                <div style={{ display: 'flex' }}>
                    <h4>View po details</h4>
                    <button style={{ marginLeft: 'auto' }} className="btn btn-primary" onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <DynamicTable
                            row={tableViewRowData}
                            header={viewColumns}
                            itemsPerPage={10}
                            handler={{
                                handleCellRender: handleViewCellRender,
                                handleLinkClick: handleViewCellLinkClick
                            }}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default ViewPo;