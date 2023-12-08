import React, { useEffect, useState } from 'react';
import { post, get, put } from '../util/restUtil';
import { properties } from '../properties';
import { showSpinner, hideSpinner } from '../common/spinner';
import { toast } from 'react-toastify';
import Select from 'react-select';
import moment from 'moment';

const AddEditPo = (props) => {
    console.log("props..................>", props)
    const dataPo = props?.location?.state?.data?.rowData
    console.log("dataPo----------->", dataPo)
    const action = props?.location?.state?.data?.action
    const [data, setData] = useState([]);
    const [fromCompanyData, setFromCompanyData] = useState([]);
    const [toCompanyData, setToCompanyData] = useState([]);
    const [status, setStatus] = useState([]);
    const [categoryData, setCategoryData] = useState({
        poCgstPercentage: '',
        poSgstPercentage: '',
        poIgstPercentage: '',
        poFromId: { label: "", value: "" },
        poToId: { label: "", value: "" },
        poNumber: '',
        poOtherCharges: '',
        poDeliveryNoteDate: '',
        poDeliveryNote: '',
        poPaymentTerms: '',
        poMrpNumber: '',
        poTransporter: '',
        poTransportMode: '',
        poFriegth: '',
        poPackingForwarding: '',
        poInsurance: '',
        poDate: '',
        poMrpDate: '',
        poDeliveryDate: '',
        poStatus: { label: "", value: "" }
    });

    const [items, setItems] = useState([
        {
            poCatId: { label: "", value: "" },
            poRate: "",
            poQty: ""
        }
    ]);

    useEffect(() => {
        const poItems = dataPo?.poTxnDetails;
        const poTxnDetails = poItems?.map((ele) => {
            return {
                poCatId: { label: ele?.categoryDetails?.catName, value: ele?.categoryDetails?.catId },
                poRate: ele?.poRate,
                poQty: ele?.poQty
            }
        })
        setItems(poTxnDetails)
        if (dataPo) {
            setCategoryData({
                poCgstPercentage: dataPo?.poCgstPercentage ?? '',
                poSgstPercentage: dataPo?.poSgstPercentage ?? '',
                poIgstPercentage: dataPo?.poIgstPercentage ?? '',
                poFromId: { label: dataPo?.fromDetails?.cName, value: dataPo?.fromDetails?.cId },
                poToId: { label: dataPo?.toDetails?.cName, value: dataPo?.toDetails?.cId },
                poNumber: dataPo?.poNumber ?? '',
                poOtherCharges: dataPo?.poOtherCharges ?? '',
                poDeliveryNoteDate: dataPo?.poDeliveryNoteDate ?? '',
                poDeliveryNote: dataPo?.poDeliveryNote ?? '',
                poPaymentTerms: dataPo?.poPaymentTerms ?? '',
                poMrpNumber: dataPo?.poMrpNumber ?? '',
                poTransporter: dataPo?.poTransporter ?? '',
                poTransportMode: dataPo?.poTransportMode ?? '',
                poFriegth: dataPo?.poFriegth ?? '',
                poPackingForwarding: dataPo?.poPackingForwarding ?? '',
                poInsurance: dataPo?.poInsurance ?? '',
                poDate: moment(dataPo?.poDate)?.format('YYYY-MM-DD') ?? '',
                poMrpDate: moment(dataPo?.poMrpDate)?.format('YYYY-MM-DD') ?? '',
                poDeliveryDate: moment(dataPo?.poDeliveryNoteDate)?.format('YYYY-MM-DD') ?? '',
                poStatus: { label: dataPo?.statusDesc?.description, value: dataPo?.statusDesc?.code } ?? ''
            })
        }
    }, [props])

    useEffect(() => {
        showSpinner();
        get(properties.CATEGORY_API)
            .then((resp) => {
                if (resp.data) {
                    let categoriesArr = []
                    resp.data.map((e) => {
                        categoriesArr.push({ label: e?.catName, value: e?.catId })
                    })
                    setData(categoriesArr)
                }
            })
            .finally(hideSpinner);

        post(properties.PURCHASE_ORDER_API + '/company')
            .then((resp) => {
                if (resp.data) {
                    let formCompanyArr = []
                    resp.data?.filter((ele) => ele?.cType === "SUPLIER").map((e) => {
                        formCompanyArr.push({ label: e?.cName, value: e?.cId })
                    })
                    setFromCompanyData(formCompanyArr);

                    let toCompanyArr = []
                    resp.data?.filter((ele) => ele?.cType === "COMPANY").map((e) => {
                        toCompanyArr.push({ label: e?.cName, value: e?.cId })
                    })
                    setToCompanyData(toCompanyArr)
                }
            })
            .finally(hideSpinner);

        post(properties.BUSINESS_ENTITY_API, ['PO_STATUS'])
            .then((resp) => {
                if (resp.data) {
                    let statusArr = []
                    resp?.data?.PO_STATUS?.map((e) => {
                        statusArr.push({ label: e.description, value: e.code })
                    })
                    setStatus(statusArr)
                }
            })
            .finally(hideSpinner)
    }, [])

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        let formIsValid = true;
        let newErrors = {};
        Object.keys(categoryData).forEach((key) => {
            if (key !== "poOtherCharges" && key !== 'selectedCategory' && !categoryData[key]) {
                formIsValid = false;
                newErrors[key] = `This field is mandatory`;
            }
        });
        setErrors(newErrors);
        return formIsValid;
    };

    const handleChangeItem = (index, name, e) => {
        const value = e?.target?.value;
        setItems(prevItems => {
            const newItems = [...prevItems];
            newItems[index] = { ...newItems[index], [name]: value ?? e };
            return newItems;
        });
    };

    const handleCategoryChangeItem = (index, name, e) => {
        setItems(prevItems => {
            const newItems = [...prevItems];
            newItems[index] = { ...newItems[index], [name]: e };
            return newItems;
        });
    };

    const handleInputChange = (e) => {
        const name = e?.target?.name;
        const value = e.target?.value;
        setCategoryData({ ...categoryData, [name]: value ?? e });
    };

    const handleStatusInputChange = (e) => {
        setCategoryData({ ...categoryData, poStatus: e });
    };

    const handlePoFromInputChange = (e) => {
        setCategoryData({ ...categoryData, poFromId: e });
    };

    const handlePoToInputChange = (e) => {
        setCategoryData({ ...categoryData, poToId: e });
    };

    const addRow = () => {
        setItems([...items, {
            poCatId: { label: "", value: "" },
            poRate: "",
            poQty: ""
        }]);
    };

    const deleteRow = (index) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            showSpinner();
            let poPayload = {
                items: items?.map((ele) => {
                    return {
                        poCatId: Number(ele?.poCatId?.value),
                        poRate: Number(ele?.poRate),
                        poQty: Number(ele?.poQty)
                    };
                }),
                poCgstPercentage: Number(categoryData?.poCgstPercentage),
                poSgstPercentage: Number(categoryData?.poSgstPercentage),
                poIgstPercentage: Number(categoryData?.poIgstPercentage),
                poFromId: categoryData?.poFromId?.value,
                poToId: categoryData?.poToId?.value,
                poNumber: categoryData?.poNumber,
                poOtherCharges: categoryData?.poOtherCharges,
                poDeliveryNoteDate: categoryData?.poDeliveryNoteDate,
                poDeliveryNote: categoryData?.poDeliveryNote,
                poPaymentTerms: categoryData?.poPaymentTerms,
                poMrpNumber: categoryData?.poMrpNumber,
                poTransporter: categoryData?.poTransporter,
                poTransportMode: categoryData?.poTransportMode,
                poFriegth: categoryData?.poFriegth,
                poPackingForwarding: categoryData?.poPackingForwarding,
                poInsurance: categoryData?.poInsurance,
                poDate: categoryData?.poDate,
                poMrpDate: categoryData?.poMrpDate,
                poDeliveryDate: categoryData?.poDeliveryDate,
                poStatus: categoryData?.poStatus?.value
            };
            if (action === 'UPDATE') {
                put(`${properties?.PURCHASE_ORDER_API}/${dataPo?.poId}`, { ...poPayload })
                    .then((response) => {
                        toast.success(`${response.message}`);
                        if (response?.status === 200) {
                            props.history.push(`${process.env.REACT_APP_BASE}/po-search`);
                        }
                    })
                    .finally(() => {
                        hideSpinner();
                    });
            } else {
                post(properties?.PURCHASE_ORDER_API, { ...poPayload })
                    .then((response) => {
                        toast.success(`${response.message}`);
                        // props.history.push(`${process.env.REACT_APP_BASE}/po-search`);
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
                <h1 className="title bold">Create purchase order</h1>
            </div>
            <div className="row mt-1">
                <div className="col-lg-12">
                    <div className="card-box">
                        <form onSubmit={handleSubmit}>

                            <div className="row">
                                <div className="col-md-4 p-1">
                                    <label>Order From</label>
                                    <Select
                                        closeMenuOnSelect={false}
                                        value={categoryData?.poFromId}
                                        options={fromCompanyData}
                                        onChange={handlePoFromInputChange}
                                        isClearable
                                        name="poFromId"
                                    />
                                    {errors.poFromId && <p className="error-msg">{errors.poFromId}</p>}
                                </div>

                                <div className="col-md-4 p-1">
                                    <label>Order To</label>
                                    <Select
                                        closeMenuOnSelect={false}
                                        value={categoryData?.poToId}
                                        options={toCompanyData}
                                        onChange={handlePoToInputChange}
                                        isClearable
                                        name="poToId"
                                    />
                                    {errors.poToId && <p className="error-msg">{errors.poToId}</p>}
                                </div>

                                <div className="col-md-4 p-1">
                                    <label>Order Number</label>
                                    <input
                                        type="text"
                                        name="poNumber"
                                        placeholder='Enter Po Number'
                                        value={categoryData.poNumber}
                                        onChange={handleInputChange}
                                        className={errors.poNumber ? 'form-control error' : 'form-control'}
                                    />
                                    {errors.poNumber && <p className="error-msg">{errors.poNumber}</p>}
                                </div>

                                <div className="col-md-4 p-1">
                                    <label>Mrp Number</label>
                                    <input
                                        type="text"
                                        name="poMrpNumber"
                                        placeholder='Enter Mrp Number'
                                        value={categoryData.poMrpNumber}
                                        onChange={handleInputChange}
                                        className={errors.poMrpNumber ? 'form-control error' : 'form-control'}
                                    />
                                    {errors.poMrpNumber && <p className="error-msg">{errors.poMrpNumber}</p>}
                                </div>

                                <div className="col-md-4 p-1">
                                    <label>Other charges</label>
                                    <input
                                        type="text"
                                        name="poOtherCharges"
                                        placeholder='Enter Other charges'
                                        value={categoryData.poOtherCharges}
                                        onChange={handleInputChange}
                                        className={errors.poOtherCharges ? 'form-control error' : 'form-control'}
                                    />
                                    {errors.poOtherCharges && <p className="error-msg">{errors.poOtherCharges}</p>}
                                </div>

                                <div className="col-md-4 p-1">
                                    <label>CGST%</label>
                                    <input
                                        type="text"
                                        name="poCgstPercentage"
                                        placeholder='CGST %'
                                        value={categoryData?.poCgstPercentage}
                                        onChange={handleInputChange}
                                        className={errors.poCgstPercentage ? 'form-control error' : 'form-control'}
                                    />
                                    {errors.poCgstPercentage && <p className="error-msg">{errors.poCgstPercentage}</p>}
                                </div>

                                <div className="col-md-4 p-1">
                                    <label>SGST%</label>
                                    <input
                                        type="text"
                                        name="poSgstPercentage"
                                        placeholder='SGST%'
                                        value={categoryData?.poSgstPercentage}
                                        onChange={handleInputChange}
                                        className={errors.poSgstPercentage ? 'form-control error' : 'form-control'}
                                    />
                                    {errors.poSgstPercentage && <p className="error-msg">{errors.poSgstPercentage}</p>}
                                </div>

                                <div className="col-md-4 p-1">
                                    <label>IGST%</label>
                                    <input
                                        type="text"
                                        name="poIgstPercentage"
                                        placeholder='IGST%'
                                        value={categoryData?.poIgstPercentage}
                                        onChange={handleInputChange}
                                        className={errors.poIgstPercentage ? 'form-control error' : 'form-control'}
                                    />
                                    {errors.poIgstPercentage && <p className="error-msg">{errors.poIgstPercentage}</p>}
                                </div>

                                <div className="col-md-4 p-1">
                                    <label>Delivery Note Date</label>
                                    <input
                                        type="date"
                                        name="poDeliveryNoteDate"
                                        value={categoryData.poDeliveryNoteDate}
                                        onChange={handleInputChange}
                                        className={errors.poDeliveryNoteDate ? 'form-control error' : 'form-control'}
                                    />
                                    {errors.poDeliveryNoteDate && <p className="error-msg">{errors.poDeliveryNoteDate}</p>}
                                </div>

                                <div className="col-md-4 p-1">
                                    <label>Delivery Note</label>
                                    <input
                                        type="text"
                                        name="poDeliveryNote"
                                        placeholder='Enter Mrp Number'
                                        value={categoryData.poDeliveryNote}
                                        onChange={handleInputChange}
                                        className={errors.poDeliveryNote ? 'form-control error' : 'form-control'}
                                    />
                                    {errors.poDeliveryNote && <p className="error-msg">{errors.poDeliveryNote}</p>}
                                </div>

                                <div className="col-md-4 p-1">
                                    <label>Payment terms/mode</label>
                                    <input
                                        type="text"
                                        name="poPaymentTerms"
                                        placeholder='Enter payment terms/mode'
                                        value={categoryData.poPaymentTerms}
                                        onChange={handleInputChange}
                                        className={errors.poPaymentTerms ? 'form-control error' : 'form-control'}
                                    />
                                    {errors.poPaymentTerms && <p className="error-msg">{errors.poPaymentTerms}</p>}
                                </div>

                                <div className="col-md-4 p-1">
                                    <label>Transporter</label>
                                    <input
                                        type="text"
                                        name="poTransporter"
                                        placeholder='Enter Transporter'
                                        value={categoryData.poTransporter}
                                        onChange={handleInputChange}
                                        className={errors.poTransporter ? 'form-control error' : 'form-control'}
                                    />
                                    {errors.poTransporter && <p className="error-msg">{errors.poTransporter}</p>}
                                </div>

                                <div className="col-md-4 p-1">
                                    <label>Transport Mode</label>
                                    <input
                                        type="text"
                                        name="poTransportMode"
                                        placeholder='Enter Transport Mode'
                                        value={categoryData.poTransportMode}
                                        onChange={handleInputChange}
                                        className={errors.poTransportMode ? 'form-control error' : 'form-control'}
                                    />
                                    {errors.poTransportMode && <p className="error-msg">{errors.poTransportMode}</p>}
                                </div>

                                <div className="col-md-4 p-1">
                                    <label>Friegth</label>
                                    <input
                                        type="text"
                                        name="poFriegth"
                                        placeholder='Enter Friegth'
                                        value={categoryData.poFriegth}
                                        onChange={handleInputChange}
                                        className={errors.poFriegth ? 'form-control error' : 'form-control'}
                                    />
                                    {errors.poFriegth && <p className="error-msg">{errors.poFriegth}</p>}
                                </div>

                                <div className="col-md-4 p-1">
                                    <label>Packing and Forwarding</label>
                                    <input
                                        type="text"
                                        name="poPackingForwarding"
                                        placeholder='Enter Packing and Forwarding'
                                        value={categoryData.poPackingForwarding}
                                        onChange={handleInputChange}
                                        className={errors.poPackingForwarding ? 'form-control error' : 'form-control'}
                                    />
                                    {errors.poPackingForwarding && <p className="error-msg">{errors.poPackingForwarding}</p>}
                                </div>

                                <div className="col-md-4 p-1">
                                    <label>Insurance</label>
                                    <input
                                        type="text"
                                        name="poInsurance"
                                        placeholder='Enter Insurance'
                                        value={categoryData.poInsurance}
                                        onChange={handleInputChange}
                                        className={errors.poInsurance ? 'form-control error' : 'form-control'}
                                    />
                                    {errors.poInsurance && <p className="error-msg">{errors.poInsurance}</p>}
                                </div>

                                <div className="col-md-4 p-1">
                                    <label>Order Date</label>
                                    {console.log('categoryData.poDate----------->', categoryData.poDate)}
                                    <input
                                        type="date"
                                        name="poDate"
                                        value={categoryData.poDate}
                                        onChange={handleInputChange}
                                        className={errors.poDate ? 'form-control error' : 'form-control'}
                                    />
                                    {errors.poDate && <p className="error-msg">{errors.poDate}</p>}
                                </div>

                                <div className="col-md-4 p-1">
                                    <label>Mrp Date</label>
                                    <input
                                        type="date"
                                        name="poMrpDate"
                                        value={categoryData.poMrpDate}
                                        onChange={handleInputChange}
                                        className={errors.poMrpDate ? 'form-control error' : 'form-control'}
                                    />
                                    {errors.poMrpDate && <p className="error-msg">{errors.poMrpDate}</p>}
                                </div>

                                <div className="col-md-4 p-1">
                                    <label>Scheduled Delivery Date</label>
                                    {console.log('categoryData.poDeliveryDate---------->', categoryData.poDeliveryDate)}
                                    <input
                                        type="date"
                                        name="poDeliveryDate"
                                        value={categoryData.poDeliveryDate}
                                        onChange={handleInputChange}
                                        className={errors.poDeliveryDate ? 'form-control error' : 'form-control'}
                                    />
                                    {errors.poDeliveryDate && <p className="error-msg">{errors.poDeliveryDate}</p>}
                                </div>

                                <div className="col-md-4 p-1">
                                    <label>Status</label>
                                    <Select
                                        closeMenuOnSelect={false}
                                        value={categoryData?.poStatus}
                                        options={status}
                                        onChange={handleStatusInputChange}
                                        isClearable
                                        name="poStatus"
                                    />
                                    {errors.poStatus && <p className="error-msg">{errors.poStatus}</p>}
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-12">
                                    {items?.map((item, index) => (
                                        <div className='row' key={index}>
                                            <div className="col-md-2 p-1">
                                                <label>Category</label>
                                                <Select
                                                    closeMenuOnSelect={false}
                                                    value={item.poCatId}
                                                    options={data}
                                                    onChange={(e) => handleCategoryChangeItem(index, 'poCatId', e)}
                                                    isClearable
                                                    name="poCatId"
                                                />
                                                {errors.poCatId && <p className="error-msg">{errors.poCatId}</p>}
                                            </div>

                                            <div className="col-md-2 p-1">
                                                <label>Quantity</label>
                                                <input
                                                    type="text"
                                                    name="poQty"
                                                    placeholder='Quantity'
                                                    value={item.poQty}
                                                    onChange={(e) => handleChangeItem(index, 'poQty', e)}
                                                    className={errors.poQty ? 'form-control error' : 'form-control'}
                                                />
                                                {errors.poQty && <p className="error-msg">{errors.poQty}</p>}
                                            </div>

                                            <div className="col-md-2 p-1">
                                                <label>Rate</label>
                                                <input
                                                    type="text"
                                                    name="poRate"
                                                    placeholder='Rate'
                                                    value={item.poRate}
                                                    onChange={(e) => handleChangeItem(index, 'poRate', e)}
                                                    className={errors.poRate ? 'form-control error' : 'form-control'}
                                                />
                                                {errors.poRate && <p className="error-msg">{errors.poRate}</p>}
                                            </div>

                                            <div className="col-md-2 mt-3">
                                                <label></label>
                                                <button className='btn btn-danger' type="button" onClick={() => deleteRow(index)}>
                                                    Delete Row
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    <button className='btn btn-primary' type="button" onClick={addRow}>
                                        Add Row
                                    </button>
                                </div>
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

export default AddEditPo;
