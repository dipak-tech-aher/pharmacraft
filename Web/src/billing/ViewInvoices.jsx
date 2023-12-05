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

const ViewInvoices = (props) => {
    const history = useHistory();
    const { auth } = useContext(AppContext);
    const [tableRowData, setTableRowData] = useState([]);


    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const [openPreviewViewModal, setOpenPreviewViewModal] = useState(false)
    const [previewData, setPreviewData] = useState({})

    useEffect(() => {
        showSpinner();
        get(`${properties.BILING_API}`)
            .then((response) => {
                setTableRowData(response.data)
            })
            .finally(hideSpinner)
    }, []);


    const preview = (soData) => {
        console.log('soData------------->', soData)
        setOpenPreviewViewModal(true)
        let data = soData;
        function calculateGst(percentage, totalRate) {
            return (Number(percentage) / 100) * totalRate;
        }

        const updatedInvoiceItems = data?.invoiceTxnDetails?.map((ele) => {
            const invTotalRate = Number(ele?.invQty) * Number(ele?.invRate);
            return {
                invCatId: ele?.invCatId,
                invRate: ele?.invRate,
                invQty: ele?.invQty,
                invTotalRate
            };
        });

        let invSubTotal = updatedInvoiceItems.reduce((total, ele) => total + (Number(ele?.invTotalRate) || 0), 0);

        const invOtherCharges = data?.invOtherCharges ? Number(data?.invOtherCharges) : 0;
        invSubTotal = Number(invSubTotal) + Number(invOtherCharges);

        let invTotalCgst = data?.invCgstPercentage ? calculateGst(data?.invCgstPercentage, invSubTotal) : 0;
        let invTotalSgst = data?.invSgstPercentage ? calculateGst(data?.invSgstPercentage, invSubTotal) : 0;
        let invTotalIgst = data?.invIgstPercentage ? calculateGst(data?.invIgstPercentage, invSubTotal) : 0;

        const totaltax = Number(invTotalSgst) + Number(invTotalCgst) + Number(invTotalIgst)

        let invTotal = Number(invSubTotal) + Number(totaltax);

        data = {
            ...data,
            invSubTotal,
            invOtherCharges,
            invTotalCgst,
            invTotalSgst,
            invTotalIgst,
            invTotal,
            totaltax
        }
        setPreviewData(data)
    }

    function convertAmountToWords(amount) {
        const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
        const teens = ['Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
        const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

        function convertChunkToWords(chunk) {
            let words = '';

            if (chunk >= 100) {
                words += ones[Math.floor(chunk / 100)] + ' Hundred';
                chunk %= 100;
            }

            if (chunk >= 20) {
                words += ' ' + tens[Math.floor(chunk / 10)];
                chunk %= 10;
            }

            if (chunk > 0) {
                if (chunk >= 11 && chunk <= 19) {
                    words += ' ' + teens[chunk - 11];
                } else {
                    words += ' ' + ones[chunk];
                }
            }

            return words;
        }

        function convertDecimalToWords(decimal) {
            const decimalWords = ones[Math.floor(decimal)] || '';
            const cents = Math.round((decimal % 1) * 100);

            if (cents > 0) {
                const centsWords = ` and ${convertChunkToWords(cents)} paise`;
                return decimalWords + centsWords;
            }

            return decimalWords;
        }


        if (isNaN(amount) || amount < 0 || amount >= 1e12) {
            return 'Invalid input';
        }

        const integerPart = Math.floor(amount);
        const decimalPart = amount % 1;

        let result = '';

        if (integerPart > 0) {
            result += convertChunkToWords(integerPart);
            result += integerPart === 1 ? ' Rupee' : ' Rupees';
        }

        if (decimalPart > 0) {
            result += ' ' + convertDecimalToWords(decimalPart);
        }

        return result.trim();
    }

    const handleCellRender = (cell, row) => {
        if (cell.column.id === "action") {
            return (<>
                <button className='btn btn-primary' onClick={(e) => preview(row?.original)}>
                    <i className="fas fa-eye"></i> Download
                </button>
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
            Header: "Invoice Date",
            accessor: "invDate",
            disableFilters: true,
            id: "invDate"
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
            <Modal isOpen={openPreviewViewModal}>
                <div style={{ display: 'flex' }}>
                    <button className='btn btn-primary' onClick={handlePrint}>Download</button>
                    <button style={{ marginLeft: 'auto' }} className="btn btn-primary" onClick={() => setOpenPreviewViewModal(false)}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <div className="container" ref={componentRef}>
                    <div className="row">
                        <div className="col-sm-6">
                            <img src={logoSM} alt="" />
                        </div>
                        <div className="col-sm-6 text-right">
                            {console.log('previewData------------->', previewData)}
                            <h4>Invoice# INV{previewData?.invId}</h4>
                            <h4>Invoice Date {moment(previewData?.invDate).format('DD-MM-YYYY')}</h4>
                        </div>
                    </div>
                    <hr />
                    <div className="row">
                        <div className="col-sm-6">
                            <h4>Invoice By</h4>
                            <p>{previewData?.fromDetails?.cName}</p>
                            <p>{previewData?.fromDetails?.cPhone}</p>
                            <p>{previewData?.fromDetails?.cWebsite}</p>
                            <p>{previewData?.fromDetails?.cAddress + ', ' + previewData?.fromDetails?.cCountry}</p>
                            <p>{previewData?.fromDetails?.cGst}</p>
                        </div>
                        <div className="col-sm-6 text-right">
                            <h4>Invoice To</h4>
                            <p>{previewData?.toDetails?.cName}</p>
                            <p>{previewData?.toDetails?.cPhone}</p>
                            <p>{previewData?.toDetails?.cWebsite}</p>
                            <p>{previewData?.toDetails?.cAddress + ', ' + previewData?.toDetails?.cCountry}</p>
                            <p>{previewData?.fromDetails?.cGst}</p>
                        </div>
                    </div>
                    <hr />
                    <div className="row">
                        <div className="col-sm-6">
                        </div>
                        <div className="col-sm-6 text-right">
                            <h4>Payment Method</h4>
                            <p>{previewData?.invPaymentTerms}</p>
                        </div>
                    </div>
                    <hr />
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Sr.no</th>
                                <th>Item</th>
                                <th>HSN/SAC</th>
                                <th>Description</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {previewData && Object.keys(previewData)?.length > 0 && previewData?.invoiceTxnDetails?.map((ele, index) => (<tr>
                                <td>{index + 1}</td>
                                <td>{ele?.categoryDetails?.catName}</td>
                                <td>{ele?.categoryDetails?.catHsnSac}</td>
                                <td>{ele?.categoryDetails?.catDesc}</td>
                                <td>{ele?.invQty}</td>
                                <td>{ele?.invRate}</td>
                                <td>{Number(ele?.invQty) * Number(ele?.invRate)}</td>
                            </tr>))}
                            <tr>
                                <td colSpan="6" className="text-right">Other Charges</td>
                                <td>{previewData?.invOtherCharges?.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td colSpan="6" className="text-right">Subtotal</td>
                                <td>{previewData?.invSubTotal?.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td colSpan="6" className="text-right">Tax</td>
                                <td>{previewData?.totaltax?.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td colSpan="6" className="text-right">Total</td>
                                <td>{previewData?.invTotal?.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td colSpan="7" className="text-left" style={{ fontWeight: "bolder" }}>Amount (In Words): {convertAmountToWords(previewData?.invTotal?.toFixed(2))}</td>
                            </tr>

                            <tr>
                                <th scope="col" colSpan={2}>Taxable Value</th>
                                <th scope="col" colSpan={2}>Central Tax</th>
                                <th scope="col" colSpan={2}>State Tax</th>
                                <th scope="col">Total Tax Amount</th>
                            </tr>
                            <tr>
                                <td colSpan={2}></td>
                                <th scope="col">Rate</th>
                                <th scope="col">Amount</th>
                                <th scope="col">Rate</th>
                                <th scope="col">Amount</th>
                                <td></td>
                            </tr>
                            <tr>
                                <td colSpan={2}>{previewData?.invSubTotal}</td>
                                <td scope="col">{previewData?.invCgstPercentage}%</td>
                                <td scope="col">{previewData?.invTotalCgst?.toFixed(2)}</td>
                                <td scope="col">{previewData?.invSgstPercentage}%</td>
                                <td scope="col">{previewData?.invTotalSgst?.toFixed(2)}</td>
                                <td>{previewData?.totaltax?.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td colSpan="7" className="text-left" style={{ fontWeight: "bolder" }}>Tax Amount (In Words): {convertAmountToWords(previewData?.totaltax?.toFixed(2))}</td>
                            </tr>

                        </tbody>
                    </table>
                    <hr />
                    <p><i> Computer generated invoice, no signature required.</i></p>
                </div>
            </Modal>
        </div>
    )
}

export default ViewInvoices;