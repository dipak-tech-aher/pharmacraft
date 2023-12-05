import React, { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from "../AppContext";
import { get, post } from "../util/restUtil";
import { string, object } from "yup";
import { properties } from "../properties";
import { showSpinner, hideSpinner } from "../common/spinner";
import { toast } from 'react-toastify';
import { unstable_batchedUpdates } from 'react-dom';
import { useHistory } from "react-router-dom";
import moment from 'moment';
import DynamicTable from '../common/table/DynamicTable';

const ViewCategory = (props) => {
    const history = useHistory();
    const { auth } = useContext(AppContext);

    const [tableRowData, setTableRowData] = useState([]);
    useEffect(() => {
        showSpinner();
        get(`${properties.CATEGORY_API}`)
            .then((response) => {
                setTableRowData(response.data)
            })
            .finally(hideSpinner)
    }, [])

    const handleCellRender = (cell, row) => {
        if (cell.column.id === "catId") {
            return (<span className="text-primary cursor-pointer" onClick={(e) => handleCellLinkClick(e, row.original)}>{cell.value}</span>)
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
        const { catId } = rowData;
        history.push(`${process.env.REACT_APP_BASE}/category-create`, {
            data: {
                catId,
                rowData,
                action:"UPDATE"

            }
        })
    }

    const columns = [
        {
            Header: "Category Id",
            accessor: "catId",
            disableFilters: true,
            click: true,
            id: "catId"
        },
        {
            Header: "Category Number",
            accessor: "catNumber",
            disableFilters: true
        },
        {
            Header: "Category Description",
            accessor: "catDesc",
            disableFilters: true,
            id: "email Id"
        },
        {
            Header: "Unit",
            accessor: "catUnit",
            disableFilters: true,
        },
         {
            Header: "HSN/SAC",
            accessor: "catHsnSac",
            disableFilters: true,
        },
        {
            Header: "Size",
            accessor: "catSize",
            disableFilters: true
        },
        {
            Header: "status",
            accessor: "catStatus",
            disableFilters: true,
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
                <h1 className="title bold">View category</h1>
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

export default ViewCategory;