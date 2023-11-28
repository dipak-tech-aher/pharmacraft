import React, { useEffect, useState } from 'react';
import { post, get } from '../util/restUtil';
import { properties } from '../properties';
import { showSpinner, hideSpinner } from '../common/spinner';
import { toast } from 'react-toastify';
import Select from 'react-select';

const AddEditPo = (props) => {
    const [data, setData] = useState([]);
    const [fromCompanyData, setFromCompanyData] = useState([]);
    const [toCompanyData, setToCompanyData] = useState([]);
    const [status, setStatus] = useState([]);
    const [categoryData, setCategoryData] = useState({});

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
            if (key !== 'selectedCategory' && !categoryData[key]) {
                formIsValid = false;
                newErrors[key] = `This field is mandatory`;
            }
        });

        setErrors(newErrors);
        return formIsValid;
    };


    const [items, setItems] = useState([
        {
            poCatId: "",
            poRate: "",
            poQty: "",
            poCgstPercentage: "",
            poSgstPercentage: "",
            poIgstPercentage: "",
        }
    ]);

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
            poCatId: "",
            poRate: "",
            poQty: "",
            poCgstPercentage: "",
            poSgstPercentage: "",
            poIgstPercentage: ""
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
                        poQty: Number(ele?.poQty),
                        poCgstPercentage: Number(ele?.poCgstPercentage),
                        poSgstPercentage: Number(ele?.poSgstPercentage),
                        poIgstPercentage: Number(ele?.poIgstPercentage)
                    };
                }),
                poFromId: categoryData?.poFromId?.value,
                poToId: categoryData?.poToId?.value,
                poNumber: categoryData?.poNumber,
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
            console.log('poPayload--------->', poPayload)
            post(properties?.PURCHASE_ORDER_API, { ...poPayload })
                .then((response) => {
                    toast.success(`${response.message}`);
                    props.history.push(`${process.env.REACT_APP_BASE}/po-search`);
                })
                .finally(() => {
                    hideSpinner();
                });
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
                                    <label>Po From</label>
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
                                    <label>Po To</label>
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
                                    <label>Po Number</label>
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
                                    <label>Po Date</label>
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
                                    {items.map((item, index) => (
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

                                            <div className="col-md-2 p-1">
                                                <label>CGST%</label>
                                                <input
                                                    type="text"
                                                    name="poCgstPercentage"
                                                    placeholder='CGST %'
                                                    value={item.poCgstPercentage}
                                                    onChange={(e) => handleChangeItem(index, 'poCgstPercentage', e)}
                                                    className={errors.poCgstPercentage ? 'form-control error' : 'form-control'}
                                                />
                                                {errors.poCgstPercentage && <p className="error-msg">{errors.poCgstPercentage}</p>}
                                            </div>

                                            <div className="col-md-1 p-1">
                                                <label>SGST%</label>
                                                <input
                                                    type="text"
                                                    name="poSgstPercentage"
                                                    placeholder='SGST%'
                                                    value={item.poSgstPercentage}
                                                    onChange={(e) => handleChangeItem(index, 'poSgstPercentage', e)}
                                                    className={errors.poSgstPercentage ? 'form-control error' : 'form-control'}
                                                />
                                                {errors.poSgstPercentage && <p className="error-msg">{errors.poSgstPercentage}</p>}
                                            </div>

                                            <div className="col-md-1 p-1">
                                                <label>IGST%</label>
                                                <input
                                                    type="text"
                                                    name="poIgstPercentage"
                                                    placeholder='IGST%'
                                                    value={item.poIgstPercentage}
                                                    onChange={(e) => handleChangeItem(index, 'poIgstPercentage', e)}
                                                    className={errors.poIgstPercentage ? 'form-control error' : 'form-control'}
                                                />
                                                {errors.poIgstPercentage && <p className="error-msg">{errors.poIgstPercentage}</p>}
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
