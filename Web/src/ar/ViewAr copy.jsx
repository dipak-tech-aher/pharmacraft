import React, { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from "../AppContext";
import { get, post } from "../util/restUtil";
import { properties } from "../properties";
import { showSpinner, hideSpinner } from "../common/spinner";
import { toast } from 'react-toastify';
import { unstable_batchedUpdates } from 'react-dom';
import DynamicTable from '../common/table/DynamicTable';
import { useHistory } from "react-router-dom";
import moment from 'moment';

const ViewAr = (props) => {
    const history = useHistory();
    const { auth } = useContext(AppContext);

    const [tableRowData, setTableRowData] = useState([]);
    useEffect(() => {
        showSpinner();
        post(`${properties.PAYMENTS_API}/get-receipts`)
            .then((response) => {
                setTableRowData(response.data)
            })
            .finally(hideSpinner)
    }, [])

    const handleForm = (rowData) => {
        console.log("data...............>", rowData);
        history.push(`${process.env.REACT_APP_BASE}/add-receipts`, {
            data: {
                rowData,
                action: "UPDATE"
            }
        })
    }

    const handleCellRender = (cell, row) => {
        if (cell.column.id === "action") {
            return (<>
                <button className='btn btn-primary' onClick={(e) => handleForm(row?.original)}>
                    <i className="fas fa-items"></i> Update
                </button></>)
        }
        if (cell.column.id === "createdAt") {
            return (<span>{cell.value ? moment(cell.value)?.format('DD-MM-YYYY') : '-'}</span>);
        }
        if (cell.column.id === "prId") {
            return (<span>RECEIPT000{cell.value}</span>);
        }
        if (cell.column.id === "prTxnNo") {
            return (<span>{cell.value ?? "-"}</span>);
        }
        if (cell.column.id === "prChequeNo") {
            return (<span>{cell.value ?? "-"}</span>);
        }
        if (cell.column.id === "cName") {
            return (<span>{cell.value ?? "-"}</span>);
        }
        if (cell.column.id === "updatedAt") {
            return (<span>{cell.value ? moment(cell.value)?.format('DD-MM-YYYY') : '-'}</span>);
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
        const { prId } = rowData;
        history.push(`${process.env.REACT_APP_BASE}/ar-create`, {
            data: {
                prId,
                rowData,
                action: "UPDATE"
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
            Header: "Receipt Id",
            accessor: "prId",
            disableFilters: true,
            click: true,
            id: "prId"
        },
        {
            Header: "Status",
            accessor: "statusDesc.description",
            disableFilters: true,
            id: ""
        },
        {
            Header: "Type",
            accessor: "receiptTypeDesc.description",
            disableFilters: true,
            id: "email Id"
        },
        {
            Header: "Receipt Amount",
            accessor: "prAmount",
            disableFilters: true,
            id: "Amount"
        },
        {
            Header: "Used Amount",
            accessor: "prAmountApplied",
            disableFilters: true,
            id: "prAmountApplied"
        },
        {
            Header: "balance Amount",
            accessor: "prAvailableAmount",
            disableFilters: true,
            id: "prAvailableAmount"
        },
        {
            Header: "Company Name",
            accessor: "companyDetails.cName",
            disableFilters: true,
            id:"cName"
        },
        {
            Header: "Transaction No",
            accessor: "prTxnNo",
            disableFilters: true,
            id: "prTxnNo"
        },
        {
            Header: "Cheque No",
            accessor: "prChequeNo",
            disableFilters: true,
            id: "prChequeNo"
        },

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

    return (
        <div className="container-fluid">
            <div className="col-12">
                <h1 className="title bold">View receipts</h1>
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
        </div>
    )
}

export default ViewAr;