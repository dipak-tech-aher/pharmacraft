import React, { useEffect, useState } from 'react';
import { post, get } from '../util/restUtil';
import { properties } from '../properties';
import { showSpinner, hideSpinner } from '../common/spinner';
import { toast } from 'react-toastify';
import Select from 'react-select';

const AddEditBill = (props) => {
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
            soCatId: "",
            soRate: "",
            soQty: ""
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
        setCategoryData({ ...categoryData, soStatus: e });
    };

    const handlePoFromInputChange = (e) => {
        setCategoryData({ ...categoryData, soFromId: e });
    };

    const handlePoToInputChange = (e) => {
        setCategoryData({ ...categoryData, soToId: e });
    };

    const addRow = () => {
        setItems([...items, {
            soCatId: "",
            soRate: "",
            soQty: "",
            // soCgstPercentage: "",
            // soSgstPercentage: "",
            // soIgstPercentage: ""
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
            let soPayload = {
                items: items?.map((ele) => {
                    return {
                        soCatId: Number(ele?.soCatId?.value),
                        soRate: Number(ele?.soRate),
                        soQty: Number(ele?.soQty),
                        // soCgstPercentage: Number(ele?.soCgstPercentage),
                        // soSgstPercentage: Number(ele?.soSgstPercentage),
                        // soIgstPercentage: Number(ele?.soIgstPercentage)
                    };
                }),
                soCgstPercentage: Number(categoryData?.soCgstPercentage),
                soSgstPercentage: Number(categoryData?.soSgstPercentage),
                soIgstPercentage: Number(categoryData?.soIgstPercentage),
                soOtherCharges: Number(categoryData?.soOtherCharges),
                soFromId: categoryData?.soFromId?.value,
                soToId: categoryData?.soToId?.value,
                soNumber: categoryData?.soNumber,
                soMrpNumber: categoryData?.soMrpNumber,
                soTransporter: categoryData?.soTransporter,
                soTransportMode: categoryData?.soTransportMode,
                soFriegth: categoryData?.soFriegth,
                soPackingForwarding: categoryData?.soPackingForwarding,
                soInsurance: categoryData?.soInsurance,
                soDate: categoryData?.soDate,
                soMrpDate: categoryData?.soMrpDate,
                soDeliveryDate: categoryData?.soDeliveryDate,
                soStatus: categoryData?.soStatus?.value
            };
            console.log('soPayload--------->', soPayload)
            post(properties?.SALES_ORDER_API, { ...soPayload })
                .then((response) => {
                    toast.success(`${response.message}`);
                    props.history.push(`${process.env.REACT_APP_BASE}/so-search`);
                })
                .finally(() => {
                    hideSpinner();
                });
        }
    };

    return (
        <div className="container-fluid">
            <div className="col-12">
                <h1 className="title bold">Create Sale order</h1>
            </div>
            <div className="row mt-1">
                <div className="col-lg-12">
                    <div className="card-box">
                        <form onSubmit={handleSubmit}>

                            <div className="row">
                                <div className="col-md-4 p-1">
                                    <label>So From</label>
                                    <Select
                                        closeMenuOnSelect={false}
                                        value={categoryData?.soFromId}
                                        options={fromCompanyData}
                                        onChange={handlePoFromInputChange}
                                        isClearable
                                        name="soFromId"
                                    />
                                    {errors.soFromId && <p className="error-msg">{errors.soFromId}</p>}
                                </div>

                                <div className="col-md-4 p-1">
                                    <label>So To</label>
                                    <Select
                                        closeMenuOnSelect={false}
                                        value={categoryData?.soToId}
                                        options={toCompanyData}
                                        onChange={handlePoToInputChange}
                                        isClearable
                                        name="soToId"
                                    />
                                    {errors.soToId && <p className="error-msg">{errors.soToId}</p>}
                                </div>

                                <div className="col-md-4 p-1">
                                    <label>CGST%</label>
                                    <input
                                        type="text"
                                        name="soCgstPercentage"
                                        placeholder='CGST %'
                                        value={categoryData?.soCgstPercentage}
                                        onChange={handleInputChange}
                                        className={errors.soCgstPercentage ? 'form-control error' : 'form-control'}
                                    />
                                    {errors.soCgstPercentage && <p className="error-msg">{errors.soCgstPercentage}</p>}
                                </div>

                                <div className="col-md-4 p-1">
                                    <label>SGST%</label>
                                    <input
                                        type="text"
                                        name="soSgstPercentage"
                                        placeholder='SGST%'
                                        value={categoryData?.soSgstPercentage}
                                        onChange={handleInputChange}
                                        className={errors.soSgstPercentage ? 'form-control error' : 'form-control'}
                                    />
                                    {errors.soSgstPercentage && <p className="error-msg">{errors.soSgstPercentage}</p>}
                                </div>

                                <div className="col-md-4 p-1">
                                    <label>IGST%</label>
                                    <input
                                        type="text"
                                        name="soIgstPercentage"
                                        placeholder='IGST%'
                                        value={categoryData?.soIgstPercentage}
                                        onChange={handleInputChange}
                                        className={errors.soIgstPercentage ? 'form-control error' : 'form-control'}
                                    />
                                    {errors.soIgstPercentage && <p className="error-msg">{errors.soIgstPercentage}</p>}
                                </div>

                                <div className="col-md-4 p-1">
                                    <label>Other charges</label>
                                    <input
                                        type="text"
                                        name="soOtherCharges"
                                        placeholder='Enter Other charges'
                                        value={categoryData.soOtherCharges}
                                        onChange={handleInputChange}
                                        className={errors.soOtherCharges ? 'form-control error' : 'form-control'}
                                    />
                                    {errors.soOtherCharges && <p className="error-msg">{errors.soOtherCharges}</p>}
                                </div>

                                <div className="col-md-4 p-1">
                                    <label>So Number</label>
                                    <input
                                        type="text"
                                        name="soNumber"
                                        placeholder='Enter Po Number'
                                        value={categoryData.soNumber}
                                        onChange={handleInputChange}
                                        className={errors.soNumber ? 'form-control error' : 'form-control'}
                                    />
                                    {errors.soNumber && <p className="error-msg">{errors.soNumber}</p>}
                                </div>

                                <div className="col-md-4 p-1">
                                    <label>Mrp Number</label>
                                    <input
                                        type="text"
                                        name="soMrpNumber"
                                        placeholder='Enter Mrp Number'
                                        value={categoryData.soMrpNumber}
                                        onChange={handleInputChange}
                                        className={errors.soMrpNumber ? 'form-control error' : 'form-control'}
                                    />
                                    {errors.soMrpNumber && <p className="error-msg">{errors.soMrpNumber}</p>}
                                </div>

                                <div className="col-md-4 p-1">
                                    <label>Transporter</label>
                                    <input
                                        type="text"
                                        name="soTransporter"
                                        placeholder='Enter Transporter'
                                        value={categoryData.soTransporter}
                                        onChange={handleInputChange}
                                        className={errors.soTransporter ? 'form-control error' : 'form-control'}
                                    />
                                    {errors.soTransporter && <p className="error-msg">{errors.soTransporter}</p>}
                                </div>

                                <div className="col-md-4 p-1">
                                    <label>Transport Mode</label>
                                    <input
                                        type="text"
                                        name="soTransportMode"
                                        placeholder='Enter Transport Mode'
                                        value={categoryData.soTransportMode}
                                        onChange={handleInputChange}
                                        className={errors.soTransportMode ? 'form-control error' : 'form-control'}
                                    />
                                    {errors.soTransportMode && <p className="error-msg">{errors.soTransportMode}</p>}
                                </div>

                                <div className="col-md-4 p-1">
                                    <label>Friegth</label>
                                    <input
                                        type="text"
                                        name="soFriegth"
                                        placeholder='Enter Friegth'
                                        value={categoryData.soFriegth}
                                        onChange={handleInputChange}
                                        className={errors.soFriegth ? 'form-control error' : 'form-control'}
                                    />
                                    {errors.soFriegth && <p className="error-msg">{errors.soFriegth}</p>}
                                </div>

                                <div className="col-md-4 p-1">
                                    <label>Packing and Forwarding</label>
                                    <input
                                        type="text"
                                        name="soPackingForwarding"
                                        placeholder='Enter Packing and Forwarding'
                                        value={categoryData.soPackingForwarding}
                                        onChange={handleInputChange}
                                        className={errors.soPackingForwarding ? 'form-control error' : 'form-control'}
                                    />
                                    {errors.soPackingForwarding && <p className="error-msg">{errors.soPackingForwarding}</p>}
                                </div>

                                <div className="col-md-4 p-1">
                                    <label>Insurance</label>
                                    <input
                                        type="text"
                                        name="soInsurance"
                                        placeholder='Enter Insurance'
                                        value={categoryData.soInsurance}
                                        onChange={handleInputChange}
                                        className={errors.soInsurance ? 'form-control error' : 'form-control'}
                                    />
                                    {errors.soInsurance && <p className="error-msg">{errors.soInsurance}</p>}
                                </div>

                                <div className="col-md-4 p-1">
                                    <label>So Date</label>
                                    <input
                                        type="date"
                                        name="soDate"
                                        value={categoryData.soDate}
                                        onChange={handleInputChange}
                                        className={errors.soDate ? 'form-control error' : 'form-control'}
                                    />
                                    {errors.soDate && <p className="error-msg">{errors.soDate}</p>}
                                </div>

                                <div className="col-md-4 p-1">
                                    <label>Mrp Date</label>
                                    <input
                                        type="date"
                                        name="soMrpDate"
                                        value={categoryData.soMrpDate}
                                        onChange={handleInputChange}
                                        className={errors.soMrpDate ? 'form-control error' : 'form-control'}
                                    />
                                    {errors.soMrpDate && <p className="error-msg">{errors.soMrpDate}</p>}
                                </div>

                                <div className="col-md-4 p-1">
                                    <label>Scheduled Delivery Date</label>
                                    <input
                                        type="date"
                                        name="soDeliveryDate"
                                        value={categoryData.soDeliveryDate}
                                        onChange={handleInputChange}
                                        className={errors.soDeliveryDate ? 'form-control error' : 'form-control'}
                                    />
                                    {errors.soDeliveryDate && <p className="error-msg">{errors.soDeliveryDate}</p>}
                                </div>

                                <div className="col-md-4 p-1">
                                    <label>Status</label>
                                    <Select
                                        closeMenuOnSelect={false}
                                        value={categoryData?.soStatus}
                                        options={status}
                                        onChange={handleStatusInputChange}
                                        isClearable
                                        name="soStatus"
                                    />
                                    {errors.soStatus && <p className="error-msg">{errors.soStatus}</p>}
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
                                                    value={item.soCatId}
                                                    options={data}
                                                    onChange={(e) => handleCategoryChangeItem(index, 'soCatId', e)}
                                                    isClearable
                                                    name="soCatId"
                                                />
                                                {errors.soCatId && <p className="error-msg">{errors.soCatId}</p>}
                                            </div>

                                            <div className="col-md-2 p-1">
                                                <label>Quantity</label>
                                                <input
                                                    type="text"
                                                    name="soQty"
                                                    placeholder='Quantity'
                                                    value={item.soQty}
                                                    onChange={(e) => handleChangeItem(index, 'soQty', e)}
                                                    className={errors.soQty ? 'form-control error' : 'form-control'}
                                                />
                                                {errors.soQty && <p className="error-msg">{errors.soQty}</p>}
                                            </div>

                                            <div className="col-md-2 p-1">
                                                <label>Rate</label>
                                                <input
                                                    type="text"
                                                    name="soRate"
                                                    placeholder='Rate'
                                                    value={item.soRate}
                                                    onChange={(e) => handleChangeItem(index, 'soRate', e)}
                                                    className={errors.soRate ? 'form-control error' : 'form-control'}
                                                />
                                                {errors.soRate && <p className="error-msg">{errors.soRate}</p>}
                                            </div>

                                            {/* <div className="col-md-2 p-1">
                                                <label>CGST%</label>
                                                <input
                                                    type="text"
                                                    name="soCgstPercentage"
                                                    placeholder='CGST %'
                                                    value={item.soCgstPercentage}
                                                    onChange={(e) => handleChangeItem(index, 'soCgstPercentage', e)}
                                                    className={errors.soCgstPercentage ? 'form-control error' : 'form-control'}
                                                />
                                                {errors.soCgstPercentage && <p className="error-msg">{errors.soCgstPercentage}</p>}
                                            </div>

                                            <div className="col-md-1 p-1">
                                                <label>SGST%</label>
                                                <input
                                                    type="text"
                                                    name="soSgstPercentage"
                                                    placeholder='SGST%'
                                                    value={item.soSgstPercentage}
                                                    onChange={(e) => handleChangeItem(index, 'soSgstPercentage', e)}
                                                    className={errors.soSgstPercentage ? 'form-control error' : 'form-control'}
                                                />
                                                {errors.soSgstPercentage && <p className="error-msg">{errors.soSgstPercentage}</p>}
                                            </div>

                                            <div className="col-md-1 p-1">
                                                <label>IGST%</label>
                                                <input
                                                    type="text"
                                                    name="soIgstPercentage"
                                                    placeholder='IGST%'
                                                    value={item.soIgstPercentage}
                                                    onChange={(e) => handleChangeItem(index, 'soIgstPercentage', e)}
                                                    className={errors.soIgstPercentage ? 'form-control error' : 'form-control'}
                                                />
                                                {errors.soIgstPercentage && <p className="error-msg">{errors.soIgstPercentage}</p>}
                                            </div> */}

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

export default AddEditBill;
