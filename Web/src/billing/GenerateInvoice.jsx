import React, { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from "../AppContext";
import logoSM from '../assets/images/logos/Logo.jpeg';
import { useReactToPrint } from 'react-to-print';
import Modal from 'react-modal'

import { get, post, put } from "../util/restUtil";
import { properties } from "../properties";
import { showSpinner, hideSpinner } from "../common/spinner";
import { toast } from 'react-toastify';
import { unstable_batchedUpdates } from 'react-dom';
import DynamicTable from '../common/table/DynamicTable';
import { useHistory } from "react-router-dom";
import moment from 'moment';

const GenerateInvoice = (props) => {
    const rowsData = props?.location?.state?.data?.rows;
    const soData = props?.location?.state?.data?.soData;
    console.log('soId---------->', soData)
    const history = useHistory();
    const { auth } = useContext(AppContext);
    const [tableRowData, setTableRowData] = useState(rowsData);
    const [readyItemId, setReadyItemId] = useState([])
    const [rowsToBilled, setRowsToBilled] = useState([])
    const [otherCharges, setOtherCharges] = useState(0)
    const [isPrint, setIsPrint] = useState(false);

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const [openPreviewViewModal, setOpenPreviewViewModal] = useState(false)
    const [previewData, setPreviewData] = useState({})

    const handleCheck = (e, row) => {
        const { checked } = e?.target;
        if (checked) {
            setReadyItemId(prevItems => [...prevItems, row?.soTxnId]);
        } else {
            setReadyItemId(prevItems =>
                prevItems.filter(itemId => itemId !== row?.soTxnId)
            );
        }
    };

    const handleInputChange = (e, row) => {
        const { value } = e?.target;
        const existingRowIndex = rowsToBilled.findIndex(item => item.soTxnId === row.soTxnId);

        if (existingRowIndex !== -1) {
            setRowsToBilled(prevItems => {
                const updatedRows = [...prevItems];
                updatedRows[existingRowIndex] = { ...row, soQtyToBilled: Number(value) };
                return updatedRows;
            });
        } else {
            setRowsToBilled(prevItems => [...prevItems, { ...row, soQtyToBilled: Number(value) }]);
        }
    };

    const getData = () => {
        delete soData?.soTxnDetails
        let invoicePayload = {
            items: rowsToBilled,
            ...soData
        }
        const propertiesToSkip = ["createdByDetails", "updatedByDetails", "statusDesc", "createdBy",
            "createdAt",
            "updatedBy",
            "updatedAt"];

        const soPayloadData = Object.fromEntries(
            Object.entries(invoicePayload).filter(([key]) => !propertiesToSkip.includes(key))
        );

        const propertiesToSkipInItems = ["createdBy",
            "createdAt",
            "updatedBy",
            "updatedAt"];

        const filteredItems = invoicePayload.items.map(item => {
            const filteredItem = Object.fromEntries(
                Object.entries(item).filter(([key]) => !propertiesToSkipInItems.includes(key))
            );
            return filteredItem;
        });

        const filteredObject = { ...soPayloadData, invOtherCharges: otherCharges, items: filteredItems };
        return filteredObject
    }


    const handleGenerate = () => {
        showSpinner();
        const filteredObject = getData();
        post(`${properties.BILING_API}`, { ...filteredObject })
            .then((response) => {
                toast.success(`${response.message}`);
                history.push(`${process.env.REACT_APP_BASE}/bill-view`)
            })
            .finally(hideSpinner)
    }

    const handleCellRender = (cell, row) => {
        if (cell.column.id === "action") {
            return (<>
                <center><input type="checkbox" onClick={(e) => handleCheck(e, row.original)} /></center>
            </>)
        }
        if (cell.column.id === "itemsToInvoice") {
            return (<>
                <center><input type="number" className='form-control' placeholder='Qty to bill' style={{ width: "100px" }} readOnly={!readyItemId?.includes(row?.original?.soTxnId)} onChange={(e) => handleInputChange(e, row?.original)} /></center>
            </>)
        }
        if (cell.column.id === "totalItemsYetToBill") {
            return (<>
                <center>{Number(row?.original?.soQty) - Number(row?.original?.soBilledQty)}</center>
            </>)
        }
        if (cell.column.id === "poId") {
            return (<span className="text-primary cursor-pointer" onClick={(e) => handleCellLinkClick(e, row.original)}>{cell.value}</span>)
        }
        if (cell.column.id === "itemsCount") {
            return (<span className="text-primary cursor-pointer">{row.original?.soTxnDetails?.length}</span>)
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
            Header: "Total items to invoice",
            accessor: "",
            disableFilters: true,
            click: true,
            id: "itemsToInvoice"
        },
        {
            Header: "Total requested item qty to bill",
            accessor: "soQty",
            disableFilters: true,
            click: true,
            id: "soQty"
        },
        {
            Header: "Total billed item qty",
            accessor: "soBilledQty",
            disableFilters: true,
            click: true,
            id: "soBilledQty"
        },
        {
            Header: "Total item qty yet to bill",
            accessor: "totalItemsYetToBill",
            disableFilters: true,
            click: true,
            id: "totalItemsYetToBill"
        },
        {
            Header: "Items Name",
            accessor: "categoryDetails.catName",
            disableFilters: true,
            click: true,
            id: "catName"
        },
        {
            Header: "Items Size",
            accessor: "categoryDetails.catSize",
            disableFilters: true,
            click: true,
            id: "catSize"
        },
        {
            Header: "Items unit",
            accessor: "categoryDetails.catUnit",
            disableFilters: true,
            click: true,
            id: "catUnit"
        },
        {
            Header: "In hand stock",
            accessor: "categoryDetails.invDetails.invQty",
            disableFilters: true,
            click: true
        },
    ]

    const preview = () => {
        setOpenPreviewViewModal(true)
        let data = getData();
        function calculateGst(percentage, totalRate) {
            return (Number(percentage) / 100) * totalRate;
        }

        const updatedInvoiceItems = data?.items?.map((ele) => {
            const invTotalRate = Number(ele?.soQtyToBilled) * Number(ele?.soRate);
            return {
                soId: ele?.soId,
                soTxnId: ele?.soTxnId,
                invCatId: ele?.soCatId,
                invRate: ele?.soRate,
                invQty: ele?.soQtyToBilled,
                invTotalRate
            };
        });

        let invSubTotal = updatedInvoiceItems.reduce((total, ele) => total + (Number(ele?.invTotalRate) || 0), 0);

        const invOtherCharges = data?.invOtherCharges ? Number(data?.invOtherCharges) : 0
        let invTotalCgst = data?.soCgstPercentage ? calculateGst(data?.soCgstPercentage, invSubTotal) : 0;
        let invTotalSgst = data?.soSgstPercentage ? calculateGst(data?.soSgstPercentage, invSubTotal) : 0;
        let invTotalIgst = data?.soIgstPercentage ? calculateGst(data?.soIgstPercentage, invSubTotal) : 0;

        const totaltax = Number(invTotalSgst) + Number(invTotalCgst) + Number(invTotalIgst)

        invSubTotal = Number(invSubTotal) + Number(invOtherCharges);
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




    return (
        <div className="container-fluid">
            <div className="col-12" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1 className="title bold">View Sales Orders Items</h1>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                        type="number"
                        className='form-control mr-2'
                        onChange={(e) => setOtherCharges(e?.target?.value)}
                        placeholder='Other charges'
                        style={{ width: "150px" }}
                    />
                    <button type='button' className='btn btn-primary mr-2' onClick={() => preview()}>Preview</button>
                    <button type='button' className='btn btn-primary' onClick={() => handleGenerate()}>Generate</button>
                </div>
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
                            <h4>Invoice# {previewData?.soNumber}</h4>
                            <h4>Invoice Date {previewData?.soDate}</h4>
                        </div>
                    </div>
                    <hr />
                    <div className="row">
                        <div className="col-sm-6">
                            <h4>Invoice By</h4>
                            <p>{soData?.fromDetails?.cName}</p>
                            <p>{soData?.fromDetails?.cPhone}</p>
                            <p>{soData?.fromDetails?.cWebsite}</p>
                            <p>{soData?.fromDetails?.cAddress + ', ' + soData?.fromDetails?.cCountry}</p>
                        </div>
                        <div className="col-sm-6 text-right">
                            <h4>Invoice To</h4>
                            <p>{soData?.toDetails?.cName}</p>
                            <p>{soData?.toDetails?.cPhone}</p>
                            <p>{soData?.toDetails?.cWebsite}</p>
                            <p>{soData?.toDetails?.cAddress + ', ' + soData?.toDetails?.cCountry}</p>
                        </div>
                    </div>
                    <hr />
                    <div className="row">
                        <div className="col-sm-6">
                            <h4>Date</h4>
                            <p>Due Date: 24/08/2021</p>
                        </div>
                        <div className="col-sm-6 text-right">
                            <h4>Payment Method</h4>
                            <p>Credit Card</p>
                        </div>
                    </div>
                    <hr />
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Sr.no</th>
                                <th>Item</th>
                                <th>Description</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {previewData && Object.keys(previewData)?.length > 0 && previewData?.items?.map((ele, index) => (<tr>
                                <td>{index + 1}</td>
                                <td>{ele?.categoryDetails?.catName}</td>
                                <td>{ele?.categoryDetails?.catDesc}</td>
                                <td>{ele?.soQtyToBilled}</td>
                                <td>{ele?.soRate}</td>
                                <td>{Number(ele?.soQtyToBilled) * Number(ele?.soRate)}</td>
                            </tr>))}
                            <tr>
                                <td colSpan="5" className="text-right">Other Charges</td>
                                <td>{previewData?.invOtherCharges?.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td colSpan="5" className="text-right">Subtotal</td>
                                <td>{previewData?.invSubTotal?.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td colSpan="3" className="text-right">CGST</td>
                                <td colSpan="2">{previewData?.soCgstPercentage}%</td>
                                <td colSpan="1">{previewData?.invTotalCgst?.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td colSpan="3" className="text-right">SGST</td>
                                <td colSpan="2">{previewData?.soSgstPercentage}%</td>
                                <td colSpan="1">{previewData?.invTotalSgst?.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td colSpan="3" className="text-right">IGST</td>
                                <td colSpan="2">{previewData?.soIgstPercentage}%</td>
                                <td colSpan="1">{previewData?.invTotalIgst?.toFixed(2)}</td>
                            </tr>
                            {/* <tr>
                                <td colSpan="5" className="text-right">Tax</td>
                                <td>{previewData?.totaltax?.toFixed(2)}</td>
                            </tr> */}
                            <tr>
                                <td colSpan="5" className="text-right">Total</td>
                                <td>{previewData?.invTotal?.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td colSpan="6" className="text-left" style={{ fontWeight: "bolder" }}>Amount (In Words): {convertAmountToWords(previewData?.invTotal?.toFixed(2))}</td>
                            </tr>
                        </tbody>
                    </table>
                    <hr />
                    <p>Thank you for your business!</p>
                </div>
            </Modal>
        </div>
    )
}

export default GenerateInvoice;