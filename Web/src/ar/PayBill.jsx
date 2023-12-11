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
import Swal from 'sweetalert2';

const PayBill = (props) => {
    const rowsData = props?.location?.state?.data?.rows;
    const soData = {};
    console.log('rowsData-------->', rowsData)
    const history = useHistory();
    const { auth } = useContext(AppContext);
    const [tableRowData, setTableRowData] = useState([]);
    const [tableRowDataCopy, setTableRowDataCopy] = useState([]);
    const [readyItemId, setReadyItemId] = useState([])
    const [rowsToBilled, setRowsToBilled] = useState([])
    const [otherCharges, setOtherCharges] = useState(0)

    useEffect(() => {
        if (rowsData) {
            const cId = rowsData?.billToDetails?.cId;
            showSpinner();
            post(`${properties.PAYMENTS_API}/get-receipts-by-company/${cId}`)
                .then((response) => {
                    setTableRowData(response.data);
                    setTableRowDataCopy(response.data);
                })
                .finally(hideSpinner)
        }
    }, [rowsData])

    const [invOutStandingAmount, setInvOutStandingAmount] = useState(Number(rowsData?.invOutstandingAmount));
    const [appliedReceipts, setAppliedReceipts] = useState([]);

    const handleCheck = (e, row) => {
        const { checked } = e?.target;

        if (checked) {
            const prAvailableAmount = Number(row?.prAvailableAmount);
            let remainingOutstandingAmount = 0;

            if (prAvailableAmount > invOutStandingAmount) {
                remainingOutstandingAmount = 0;
            } else {
                remainingOutstandingAmount = invOutStandingAmount - prAvailableAmount;
            }

            // Update the state to track applied receipts
            setAppliedReceipts((prevReceipts) => [
                ...prevReceipts,
                {
                    receiptId: row?.prId, // Add relevant properties from 'row' object
                    appliedAmount: prAvailableAmount > invOutStandingAmount ? invOutStandingAmount : prAvailableAmount,
                }
            ]);

            setTableRowData((prevData) => {
                return prevData.map((ele) => {
                    if (ele?.prId === row?.prId) {
                        const deductedAmount = Math.min(prAvailableAmount, invOutStandingAmount);
                        const newPrAvailableAmount = prAvailableAmount - deductedAmount;
                        return {
                            ...ele,
                            prAvailableAmount: newPrAvailableAmount,
                        };
                    }
                    return ele;
                });
            });

            // Update the outstanding amount
            setInvOutStandingAmount(remainingOutstandingAmount);

        } else {
            setTableRowData((prevData) => {
                return tableRowDataCopy.map((ele) => {
                    if (ele?.prId === row?.prId) {
                        // Revert prAvailableAmount to its original value
                        return {
                            ...ele,
                            prAvailableAmount: Number(ele?.prAvailableAmount),
                        };
                    }
                    return ele;
                });
            });

          

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
        console.log('appliedReceipts---------->', appliedReceipts)
        // Swal.fire({
        //     title: 'Are you sure want to generate invoice? generated invoices you cant edit!',
        //     icon: 'warning',
        //     showCancelButton: true,
        //     confirmButtonColor: '#3085d6',
        //     cancelButtonColor: '#d33',
        //     confirmButtonText: 'Confirm'
        // }).then((result) => {
        //     if (result.isConfirmed) {
        //         showSpinner();
        //         const filteredObject = getData();
        //         post(`${properties.BILING_API}`, { ...filteredObject })
        //             .then((response) => {
        //                 toast.success(`${response.message}`);
        //                 history.push(`${process.env.REACT_APP_BASE}/bill-view`)
        //             })
        //             .finally(hideSpinner)
        //     }
        // })
    }

    const handleCellRender = (cell, row) => {
        if (cell.column.id === "action") {
            return (<>
                <center><input type="checkbox" onClick={(e) => handleCheck(e, row.original)} /></center>
            </>)
        }
        if (cell.column.id === "prId") {
            return (<>
                <center>RECEIPT000{row?.original?.prId}</center>
            </>)
        }
        if (cell.column.id === "prAvailableAmount") {
            return (<span>{row?.original?.prAvailableAmount}</span>);
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
            Header: "Receipt Number",
            accessor: "prId",
            disableFilters: true,
            click: true,
            id: "prId"
        },
        {
            Header: "Receipt Amount",
            accessor: "prAvailableAmount",
            disableFilters: true,
            click: true,
            id: "prAvailableAmount"
        },
        {
            Header: "Company Name",
            accessor: "companyDetails.cName",
            disableFilters: true,
            click: true,
            id: "cName"
        },
    ]

    return (
        <div className="container-fluid">
            <div className="col-12" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1 className="title bold">Pay Bill Of Invoice: INV{rowsData?.invId}<br /><br /> <b style={{ color: "red" }}>Invoice Outstanding Amount: {invOutStandingAmount}</b></h1>

                <div style={{ display: "flex", alignItems: "center" }}>
                    <button type='button' className='btn btn-primary' onClick={() => handleGenerate()}>Pay</button>
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

        </div >
    )
}

export default PayBill;