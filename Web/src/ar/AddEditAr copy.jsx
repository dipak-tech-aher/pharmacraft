import React, { useEffect, useState } from 'react';
import { post, get, put } from '../util/restUtil';
import { properties } from '../properties';
import { showSpinner, hideSpinner } from '../common/spinner';
import { toast } from 'react-toastify';
import Select from 'react-select';

const AddEditAr = (props) => {
    console.log("props", props);
    const prData = props?.location?.state?.data?.rowData
    const action = props?.location?.state?.data?.action
    console.log("prData....>", prData);
    const [receiptTypes, setReceiptTypes] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [company, setCompany] = useState([]);
    const [isCompanyOpen, setIsCompanyOpen] = useState(false);
    const [isTxnOpen, setIsTxnOpen] = useState(false);
    const [isChequeOpen, setIsChequeOpen] = useState(false);

    useEffect(() => {
        showSpinner();

        post(properties.PURCHASE_ORDER_API + '/company')
            .then((resp) => {
                if (resp.data) {
                    let companyArr = []
                    resp.data?.filter((ele) => ele?.cType === "BUYER").map((e) => {
                        companyArr.push({ label: e?.cName, value: e?.cId })
                    })
                    setCompany(companyArr)
                }
            })
            .finally(hideSpinner);

        post(properties.BUSINESS_ENTITY_API, ['PAYMENT_METHOD', 'RECEIPT_TYPE'])
            .then((resp) => {
                if (resp.data) {
                    let paymentMothodArr = []
                    resp?.data?.PAYMENT_METHOD?.map((e) => {
                        paymentMothodArr.push({ label: e.description, value: e.code })
                    })
                    setPaymentMethods(paymentMothodArr)

                    let paymentTypeArr = []
                    resp?.data?.RECEIPT_TYPE?.map((e) => {
                        paymentTypeArr.push({ label: e.description, value: e.code })
                    })
                    setReceiptTypes(paymentTypeArr)
                }
            })
            .finally(hideSpinner)
    }, [])

    const [receiptData, setReceiptData] = useState({
        prType: '',
        prCId: { label: '', value: '' },
        prAmount: '',
        prStatus: '',
        prChequeNo: '',
        prTxnNo: ''
    });

    useEffect(() => {
        if (prData) {
            setReceiptData({
                prType: prData?.prType,
                prCId: { label: prData?.companyDetails?.cName, value: prData?.companyDetails?.cId },
                prAmount: prData?.prAmount,
                prStatus: prData?.prStatus,
                prChequeNo: prData?.prChequeNo,
                prTxnNo: prData?.prTxnNo,
            })
        }
    }, [props]);

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        let formIsValid = true;
        let newErrors = {};

        Object.keys(receiptData).forEach((key) => {
            if (
                key !== 'prCId' &&
                key !== 'prChequeNo' &&
                key !== 'prTxnNo' &&
                !receiptData[key]) {
                formIsValid = false;
                newErrors[key] = `This field is mandatory`;
            }
        });

        setErrors(newErrors);
        return formIsValid;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "prStatus" && value === "IDENTIFIED") {
            setIsCompanyOpen(true)
        }
        if (name === "prStatus" && value === "UNIDENTIFIED") {
            setIsCompanyOpen(false)
        }
        if (name === "prType" && value === "CHEQUE") {
            setIsChequeOpen(true);
            setIsTxnOpen(false);
        } else if (name === "prType" && value === "ONLINE") {
            setIsTxnOpen(true);
            setIsChequeOpen(false)
        }
        setReceiptData({ ...receiptData, [name]: value });
    };

    const handleCompanyChange = (selectedOption) => {
        setReceiptData({ ...receiptData, prCId: selectedOption });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            showSpinner();
            let receiptPayload = {
                prType: receiptData?.prType,
                prCId: Number(receiptData?.prCId?.value) ?? null,
                prAmount: receiptData?.prAmount,
                prStatus: receiptData?.prStatus,
                prChequeNo: receiptData?.prChequeNo,
                prTxnNo: receiptData?.prTxnNo
            };
            console.log("receiptPayload....>", receiptPayload);
            if (action === "UPDATE") {
                put(`${properties?.PAYMENTS_API}/${prData?.prId}`, { ...receiptPayload })
                    .then((response) => {
                        toast.success(`${response.message}`);
                        props.history.push(`${process.env.REACT_APP_BASE}/ar-search`);
                    })
                    .finally(() => {
                        hideSpinner();
                    });
            } else {
                post(`${properties?.PAYMENTS_API}/add-receipts`, { ...receiptPayload })
                    .then((response) => {
                        toast.success(`${response.message}`);
                        props.history.push(`${process.env.REACT_APP_BASE}/ar-search`);
                    })
                    .finally(() => {
                        hideSpinner();
                    });
            }

        }
    };

    return (
        <div className="container-fluid">
            <div className="col-12">
                <h1 className="title bold">{action === "UPDATE" ? "Update" : "Add"} Inventory</h1>
            </div>
            <div className="row mt-1">
                <div className="col-lg-12 ">
                    <div className="card-box">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6 p-1">
                                    <label>Amount</label>
                                    <input
                                        type="number"
                                        name="prAmount"
                                        placeholder='Enter Amount'
                                        value={receiptData?.prAmount}
                                        onChange={handleInputChange}
                                        className={errors?.prAmount ? 'form-control error' : 'form-control'}
                                    />
                                    {errors?.prAmount && <p className="error-msg">{errors?.prAmount}</p>}
                                </div>

                                <div className="col-md-6 p-1">
                                    <label className=''>Receipt Type</label>
                                    <select
                                        name="prStatus"
                                        value={receiptData?.prStatus}
                                        onChange={handleInputChange}
                                        className={errors.prStatus ? 'form-control error' : 'form-control'}
                                    >
                                        <option value="">Receipt Type</option>
                                        {receiptTypes?.map((ele) => <option value={ele?.value}>{ele?.label}</option>)}
                                    </select>
                                    {errors.prStatus && <p className="error-msg">{errors.prStatus}</p>}
                                </div>

                                {isCompanyOpen && <div className="col-md-6 p-1">
                                    <label>Select Company</label>
                                    <Select
                                        closeMenuOnSelect={false}
                                        value={receiptData?.prCId}
                                        options={company}
                                        onChange={handleCompanyChange}
                                        isClearable
                                        name="prCId"
                                    />
                                    {errors?.prCId && <p className="error-msg">{errors?.prCId}</p>}
                                </div>
                                }

                                <div className="col-md-6 p-1">
                                    <label className=''>Payment Method</label>
                                    <select
                                        name="prType"
                                        value={receiptData?.prType}
                                        onChange={handleInputChange}
                                        className={errors?.prType ? 'form-control error' : 'form-control'}
                                    >
                                        <option value="">Payment Method</option>
                                        {paymentMethods?.map((ele) => <option value={ele?.value}>{ele?.label}</option>)}
                                    </select>
                                    {errors.prType && <p className="error-msg">{errors?.prType}</p>}
                                </div>

                                {isChequeOpen && <div className="col-md-6 p-1">
                                    <label> Cheque Number</label>
                                    <input
                                        type="text"
                                        name="prChequeNo"
                                        placeholder='Enter Cheque Number'
                                        value={receiptData?.prChequeNo}
                                        onChange={handleInputChange}
                                        className={errors?.prChequeNo ? 'form-control error' : 'form-control'}
                                    />
                                    {errors?.prChequeNo && <p className="error-msg">{errors?.prChequeNo}</p>}
                                </div>}

                                {isTxnOpen && <div className="col-md-6 p-1">
                                    <label>Transaction Number</label>
                                    <input
                                        type="text"
                                        name="prTxnNo"
                                        placeholder='Enter Transaction Number'
                                        value={receiptData?.prTxnNo}
                                        onChange={handleInputChange}
                                        className={errors?.prTxnNo ? 'form-control error' : 'form-control'}
                                    />
                                    {errors?.prTxnNo && <p className="error-msg">{errors?.prTxnNo}</p>}
                                </div>}
                            </div>
                            <div className="text-center mt-2">
                                <button type="submit" className="btn btn-primary">
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddEditAr;
