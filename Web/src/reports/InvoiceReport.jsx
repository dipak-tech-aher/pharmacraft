import React, { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from "../AppContext";
import logoSM from '../assets/images/logos/Logo.jpeg';
import { get, post, put } from "../util/restUtil";
import { properties } from "../properties";
import { showSpinner, hideSpinner } from "../common/spinner";
import { toast } from 'react-toastify';
import { unstable_batchedUpdates } from 'react-dom';
import DynamicTable from '../common/table/DynamicTable';
import { useHistory } from "react-router-dom";
import moment from 'moment';
import Modal from 'react-modal'
import { useReactToPrint } from 'react-to-print';
import Select from 'react-select';
import DateRangePicker from 'react-bootstrap-daterangepicker';

const InvoiceReport = (props) => {
    const history = useHistory();
    const { auth } = useContext(AppContext);
    const [tableRowData, setTableRowData] = useState([]);
    const [isRefresh, setIsRefresh] = useState(false);
    const [filters, setFilters] = useState({});
    const [payloadData, setPayloadData] = useState({});
    const componentRef = useRef();
    const [toCompanyData, setToCompanyData] = useState([]);
    const [invStatuses, setInvStatuses] = useState([]);


    const [dateRange, setDateRange] = useState(
        {
            startDate: auth && auth.dashboardData && auth.dashboardData.startDate,
            endDate: auth && auth.dashboardData && auth.dashboardData.endDate,
        });


    useEffect(() => {
        post(properties.PURCHASE_ORDER_API + '/company')
            .then((resp) => {
                if (resp.data) {
                    let toCompanyArr = []
                    resp.data?.filter((ele) => ele?.cType === "BUYER").map((e) => {
                        toCompanyArr.push({ label: e?.cName, value: e?.cId })
                    })
                    setToCompanyData(toCompanyArr)
                }
            })
            .finally(hideSpinner);

        post(properties.BUSINESS_ENTITY_API, ['INVOICE_STATUS'])
            .then((resp) => {
                if (resp.data) {
                    let statusArr = []
                    resp?.data?.INVOICE_STATUS?.map((e) => {
                        statusArr.push({ label: e.description, value: e.code })
                    })
                    setInvStatuses(statusArr)
                }
            })
            .finally(hideSpinner)
    }, [])

    useEffect(() => {
        showSpinner();
        post(`${properties.REPORT_API}/get-invoice-report`, filters)
            .then((response) => {
                if (response?.data) {
                    setTableRowData(response?.data ?? [])
                } else {
                    toast.error("No Invoices Found!!")
                    setTableRowData([])
                }
            })
            .finally(hideSpinner)
    }, [isRefresh, filters]);

    const handleCellRender = (cell, row) => {
        if (cell.column.id === "invDate") {
            return (<span>{moment(cell.value)?.format('DD-MM-YYYY')}</span>);
        }
        if (cell.column.id === "InvoiceNumber") {
            return (<span>{"INV" + cell.value}</span>);
        }
        if (cell.column.id === "createdAt") {
            return (<span>{moment(cell.value)?.format('DD-MM-YYYY')}</span>);
        }
        if (cell.column.id === "updatedAt") {
            return (<span>{moment(cell.value)?.format('DD-MM-YYYY')}</span>);
        }
        if (cell.column.id === "CreatedBy") {
            return (<span className="text-primary cursor-pointer">{row.original?.createdByDetails?.firstName ?? '-' + ' ' + (row.original?.createdByDetails?.lastName ?? '-')}</span>)
        }
        if (cell.column.id === "UpdatedBy") {
            return (<span className="text-primary cursor-pointer">{row.original?.updatedByDetails?.firstName ?? '-' + ' ' + (row.original?.updatedByDetails?.lastName ?? '-')}
            </span>)
        }
        else {
            return (<span>{cell.value}</span>)
        }
    }

    const columns = [
        {
            Header: "Invoice Number",
            accessor: "invId",
            disableFilters: true,
            click: true,
            id: "InvoiceNumber"
        },
        {
            Header: "Invoice Date",
            accessor: "invDate",
            disableFilters: true,
            click: true,
            id: "invDate"
        },
        {
            Header: "Invoice Status",
            accessor: "statusDesc.description",
            disableFilters: true,
            click: true,
            id: "description"
        },
        {
            Header: "Customer Name",
            accessor: "billToDetails.cName",
            disableFilters: true,
            id: "cName"
        },
        {
            Header: "Total",
            accessor: "invTotal",
            disableFilters: true,
            id: "invTotal"
        },
        {
            Header: "Total Outstanding amount",
            accessor: "invOutstandingAmount",
            disableFilters: true,
            id: "invOutstandingAmount"
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

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        let formIsValid = true;
        let newErrors = {};

        Object.keys(payloadData).forEach((key) => {
            if (
                key !== 'fromDate' &&
                key !== 'toDate' &&
                key !== 'invNo' &&
                key !== 'compId' &&
                key !== 'invStatus' &&
                !payloadData[key]) {
                formIsValid = false;
                newErrors[key] = `This field is mandatory`;
            }
        });
        console.log('newErrors------------->', newErrors)
        setErrors(newErrors);
        return formIsValid;
    };

    const handleSubmit = (e) => {
        console.log('hee')
        e.preventDefault();
        if (validateForm()) {
            let payload = {
                fromDate: payloadData?.startDate,
                toDate: payloadData?.endDate,
                invNo: payloadData?.invNo,
                compId: payloadData?.compId,
                invStatus: payloadData?.invStatus,
            };
            setFilters(payload)
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPayloadData({ ...payloadData, [name]: value });
    };


    const handleCompanyInputChange = (e) => {
        setPayloadData({ ...payloadData, compId: e });
    };


    const handleDateRangeChange = (event, picker) => {
        let startDate = moment(picker.startDate).format('YYYY-MM-DD');
        let endDate = moment(picker.endDate).format('YYYY-MM-DD');
        unstable_batchedUpdates(() => {
            setDateRange({ startDate, endDate });
            setPayloadData({ ...payloadData, startDate, endDate });
        })
    }

    const handleClear = () => {
        setPayloadData({})
        setFilters({})
        setIsRefresh(!isRefresh)
    }

    return (
        <div className="container-fluid">
            <div className="col-lg-12">
                <h1 className="title bold">Invoice Report</h1>
            </div>
            <div className="row">
                <div className="col-lg-12">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-4 p-1">
                                <label style={{ fontWeight: "bolder" }}>Invoice Number</label>
                                <input type="text" className='form-control' name='invNo' id='invNo' onChange={handleInputChange} placeholder='Enter Invoice Number' />
                                {errors.invNo && <p className="error-msg">{errors.invNo}</p>}
                            </div>
                            <div className="col-md-4 p-1">
                                <label style={{ fontWeight: "bolder" }}>Company Name</label>
                                <Select
                                    closeMenuOnSelect={false}
                                    value={payloadData?.compId}
                                    options={toCompanyData}
                                    onChange={handleCompanyInputChange}
                                    isClearable
                                    name="compId"
                                />
                                {errors.compId && <p className="error-msg">{errors.compId}</p>}
                            </div>
                            <div className="col-md-4 p-1">
                                <label style={{ fontWeight: "bolder" }}>Invoice Status</label>
                                <select className='form-control' name="invStatus" id="invStatus" onChange={handleInputChange}>
                                    <option value="" >Select Status</option>
                                    {invStatuses?.map((ele) => <option value={ele?.value}>{ele?.label}</option>)}
                                </select>
                                {errors?.invStatus && <p className="error-msg">{errors?.invStatus}</p>}
                            </div>
                            <div className="col-md-4 p-1">
                                <label style={{ fontWeight: "bolder" }}>Invoice Date</label>
                                <DateRangePicker
                                    initialSettings={{
                                        startDate: dateRange?.startDate, endDate: dateRange?.endDate,
                                        linkedCalendars: true, showCustomRangeLabel: true,
                                        showDropdowns: true, alwaysShowCalendars: true,
                                        locale: { format: "DD/MM/YYYY" },
                                        maxDate: moment(),
                                        opens: 'left',
                                        ranges: {
                                            'Today': [moment(), moment()],
                                            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                                            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                                            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                                            'This Month': [moment().startOf('month'), moment().endOf('month')],
                                            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                                            'This Year': [moment().startOf('year'), moment().format('DD-MM-YYYY')]
                                        }
                                    }}
                                    onApply={handleDateRangeChange}
                                >
                                    <input className='form-control border-0 ml-1 pl-3 cursor-pointer' />
                                </DateRangePicker>
                            </div>
                            <div className="col-md-4 mt-3">
                                <label htmlFor="">    </label>
                                <button type="button" className="btn btn-primary" onClick={() => handleClear()}>
                                    Clear Filters
                                </button> &nbsp; &nbsp;
                                <button type="submit" className="btn btn-primary">
                                    Submit
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div className="row mt-1">
                <div className="col-lg-12">
                    <div className="card-box">
                        {tableRowData?.length > 0 ? <DynamicTable
                            row={tableRowData}
                            header={columns}
                            itemsPerPage={10}
                            handler={{
                                handleCellRender: handleCellRender
                            }}
                        /> : <span>No Invoices Found!!</span>}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default InvoiceReport;