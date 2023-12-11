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

const ViewAr = (props) => {
    const history = useHistory();
    const { auth } = useContext(AppContext);
    const [tableRowData, setTableRowData] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [isTxnOpen, setIsTxnOpen] = useState(false);
    const [isChequeOpen, setIsChequeOpen] = useState(false);
    const [isRefresh, setIsRefresh] = useState(false);
    const initialPaymentdata = {
        paymentMethod: '',
        pAmount: '',
        paymentChequeNo: '',
        paymentTxnNo: ''
    }
    const [paymentData, setPaymentData] = useState(initialPaymentdata);
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const [openPayBillModal, setOpenPayBillModal] = useState(false)
    const [invoiceRowData, setInvoiceRowData] = useState({})

    useEffect(() => {
        showSpinner();
        post(`${properties.BILING_API}/get-pending-invoices`)
            .then((response) => {
                setTableRowData(response.data)
            })
            .finally(hideSpinner)

        post(properties.BUSINESS_ENTITY_API, ['PAYMENT_METHOD'])
            .then((resp) => {
                if (resp.data) {
                    let paymentMothodArr = []
                    resp?.data?.PAYMENT_METHOD?.map((e) => {
                        paymentMothodArr.push({ label: e.description, value: e.code })
                    })
                    setPaymentMethods(paymentMothodArr)
                }
            })
            .finally(hideSpinner)
    }, [isRefresh]);


    const handlePayBill = (row) => {
        setOpenPayBillModal(true)
        setInvoiceRowData(row)
    }

    const handleCellRender = (cell, row) => {
        if (cell.column.id === "action") {
            return (<>
                {row?.original?.invOutstandingAmount !== 0 && < button className='btn btn-primary' onClick={(e) => handlePayBill(row?.original)}>
                    <i className="fas fa-cash"></i> Pay
                </button >}
            </>)
        }
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
            return (<span className="text-primary cursor-pointer" onClick={(e) => handleCellLinkClick(e, row.original)}>{row.original?.createdByDetails?.firstName ?? '-' + ' ' + (row.original?.createdByDetails?.lastName ?? '-')}</span>)
        }
        if (cell.column.id === "UpdatedBy") {
            return (<span className="text-primary cursor-pointer" onClick={(e) => handleCellLinkClick(e, row.original)}>{row.original?.updatedByDetails?.firstName ?? '-' + ' ' + (row.original?.updatedByDetails?.lastName ?? '-')}
            </span>)
        }
        else {
            return (<span>{cell.value}</span>)
        }
    }

    const handleCellLinkClick = (e, rowData) => {
        const { invId } = rowData;
        history.push(`${process.env.REACT_APP_BASE}/inventory-create`, {
            data: {
                invId
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
            Header: "Invoice Number",
            accessor: "invId",
            disableFilters: true,
            click: true,
            id: "InvoiceNumber"
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
        // {
        //     Header: "Created By",
        //     accessor: "createdByDetails.firstName",
        //     disableFilters: true,
        //     id: "CreatedBy"
        // },
        // {
        //     Header: "Updated By",
        //     accessor: "updatedByDetails.firstName",
        //     disableFilters: true,
        //     id: "UpdatedBy"
        // },
        // {
        //     Header: "Created At",
        //     accessor: "createdAt",
        //     disableFilters: true,
        //     id: "createdAt"
        // },
        // {
        //     Header: "Updated At",
        //     accessor: "updatedAt",
        //     disableFilters: true,
        //     id: "updatedAt"
        // }
    ]

    const handleOnClose = () => {
        setOpenPayBillModal(false)
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "paymentMethod" && value === "CHEQUE") {
            setIsChequeOpen(true);
            setIsTxnOpen(false);
        } else if (name === "paymentMethod" && value === "ONLINE") {
            setIsTxnOpen(true);
            setIsChequeOpen(false)
        } else if (name === "paymentMethod" && value === "CASH" || value === "") {
            setIsTxnOpen(false);
            setIsChequeOpen(false)
        }
        if (name === "pAmount") {
            if (value > invoiceRowData?.invOutstandingAmount) {
                toast.error('Payment Amount should be less than oustanding amount');
                return
            } else if (value === 0) {
                toast.error('Invalid Payment Amount!!');
                return
            }
        }
        setPaymentData({ ...paymentData, [name]: value });
    };

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        let formIsValid = true;
        let newErrors = {};

        Object.keys(paymentData).forEach((key) => {
            if (
                key !== 'paymentChequeNo' &&
                key !== 'paymentTxnNo' &&
                !paymentData[key]) {
                formIsValid = false;
                newErrors[key] = `This field is mandatory`;
            }
        });

        setErrors(newErrors);
        return formIsValid;
    };

    const handleSubmit = (e) => {
        // e.preventDefault();
        if (validateForm()) {
            let paymentPayload = {
                paymentMethod: paymentData?.paymentMethod,
                pAmount: Number(paymentData?.pAmount),
                paymentChequeNo: paymentData?.paymentChequeNo,
                paymentTxnNo: paymentData?.paymentTxnNo
            };
            showSpinner();
            post(`${properties.BILING_API}/pay-bill/${invoiceRowData?.invId}`, paymentPayload)
                .then((response) => {
                    toast.success(response?.message);
                    setOpenPayBillModal(!openPayBillModal);
                    setIsRefresh(!isRefresh)
                    setPaymentData(initialPaymentdata);
                    setIsTxnOpen(false);
                    setIsChequeOpen(false)
                })
                .finally(hideSpinner)
        }
    }

    return (
        <div className="container-fluid">
            <div className="col-12">
                <h1 className="title bold">View bills</h1>
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
            <Modal isOpen={openPayBillModal} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div >
                    <div style={{ display: 'flex' }}>
                        <button style={{ marginLeft: 'auto' }} className="btn btn-primary" onClick={handleOnClose}>
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                    <div className="row">
                        <div className="col-md-4"></div>
                        <div className="col-md-4">
                            <div className="col-md-12 mt-4">
                                <div className="col-md-12 p-1">
                                    <label htmlFor=""><b>Pay Bill Of : INV{invoiceRowData?.invId}</b></label>
                                </div>
                                <div className="col-md-12 p-1">
                                    <label htmlFor="" style={{ color: "red" }}> <b>Invoice Outstanding Amount: {invoiceRowData?.invOutstandingAmount}</b> </label>
                                </div>

                                <div className="col-md-12 p-1">
                                    <label className=''>Payment Method</label>
                                    <select
                                        name="paymentMethod"
                                        value={paymentData?.paymentMethod}
                                        onChange={handleInputChange}
                                        className={errors?.paymentMethod ? 'form-control error' : 'form-control'}
                                    >
                                        <option value="">Payment Method</option>
                                        {paymentMethods?.map((ele) => <option value={ele?.value}>{ele?.label}</option>)}
                                    </select>
                                    {errors.paymentMethod && <p className="error-msg">{errors?.paymentMethod}</p>}
                                </div>

                                {isChequeOpen && <div className="col-md-12 p-1">
                                    <label> Cheque Number</label>
                                    <input
                                        type="text"
                                        name="paymentChequeNo"
                                        placeholder='Enter Cheque Number'
                                        value={paymentData?.paymentChequeNo}
                                        onChange={handleInputChange}
                                        className={errors?.paymentChequeNo ? 'form-control error' : 'form-control'}
                                    />
                                    {errors?.paymentChequeNo && <p className="error-msg">{errors?.paymentChequeNo}</p>}
                                </div>}

                                {isTxnOpen && <div className="col-md-12 p-1">
                                    <label>Transaction Number</label>
                                    <input
                                        type="text"
                                        name="paymentTxnNo"
                                        placeholder='Enter Transaction Number'
                                        value={paymentData?.paymentTxnNo}
                                        onChange={handleInputChange}
                                        className={errors?.paymentTxnNo ? 'form-control error' : 'form-control'}
                                    />
                                    {errors?.paymentTxnNo && <p className="error-msg">{errors?.paymentTxnNo}</p>}
                                </div>}

                                <div className="col-md-12 p-1">
                                    <label htmlFor="">Amount</label>
                                    <input type="number" className='form-control' name="pAmount"
                                        value={paymentData?.pAmount}
                                        onChange={handleInputChange} placeholder='Enter Amount' />
                                </div>

                                <div className="col-md-12 p-1">
                                    <button className='btn btn-primary' type='button' onClick={() => handleSubmit()}>Submit</button>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4"></div>
                    </div>
                </div>
            </Modal>

        </div >
    )
}

export default ViewAr;