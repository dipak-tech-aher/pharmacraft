import React, { useEffect, useState } from 'react';
import { post, get,put } from '../util/restUtil';
import { properties } from '../properties';
import { showSpinner, hideSpinner } from '../common/spinner';
import { toast } from 'react-toastify';
import Select from 'react-select';

const AddEditAr = (props) => {
    console.log("props",props);
    const invData=props?.location?.state?.data?.rowData
    const action=props?.location?.state?.data?.action

    
    console.log("invData....>",invData);
    const [data, setData] = useState([]);
    const [status, setStatus] = useState([]);

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

        post(properties.BUSINESS_ENTITY_API, ['COMMON_STATUS'])
            .then((resp) => {
                if (resp.data) {
                    let statusArr = []
                    resp?.data?.COMMON_STATUS?.map((e) => {
                        statusArr.push({ label: e.description, value: e.code })
                    })
                    setStatus(statusArr)
                }
            })
            .finally(hideSpinner)
    }, [])

    const [categoryData, setCategoryData] = useState({
        qty: '',
        // hsnSac: '',
        // size: '',
        category: { label: "", value: "" },
        invStatus: '',
        catUnit:''

    });
    useEffect(() => {

        if (invData) {

            setCategoryData({
                qty:invData?.invQty,
                category:{ label: invData?.categoryDetails?.catName, value: invData?.categoryDetails?.catId },
                catUnit:{ label: invData?.categoryDetails?.catName, value: invData?.categoryDetails?.catId },
                invStatus:invData?.invStatus,
            })
        }
    },[props])
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        let formIsValid = true;
        let newErrors = {};

        Object.keys(categoryData).forEach((key) => {
            console.log("ima here in from valid");
            if (key !== 'selectedCategory' && !categoryData[key]) {
                formIsValid = false;
                newErrors[key] = `This field is mandatory`;
            }
        });

        setErrors(newErrors);
        return formIsValid;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCategoryData({ ...categoryData, [name]: value });
    };

    const handleCategoryChange = (selectedOption) => {
        setCategoryData({ ...categoryData, category: selectedOption });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            showSpinner();
            let inventoryPayload = {
                invQty: categoryData.qty,
                // invHsnCat: categoryData.hsnSac,
                // invSize: categoryData.size,
                category: categoryData.category,
                catUnit: categoryData.catUnit,                
                invStatus: categoryData.invStatus
            };

            console.log("inventoryPayload....>",inventoryPayload);
            inventoryPayload.invCatId = categoryData.category?.value
            delete inventoryPayload?.category
                if(action === "UPDATE"){
                    put(`${properties?.INVENTORY_API}/${invData?.invId}`, { ...inventoryPayload })
                    .then((response) => {
                        toast.success(`${response.message}`);
                        props.history.push(`${process.env.REACT_APP_BASE}/inventory-search`);
                    })
                    .finally(() => {
                        hideSpinner();
                    });



                }else{
                    post(properties?.INVENTORY_API, { ...inventoryPayload })
                    .then((response) => {
                        toast.success(`${response.message}`);
                        props.history.push(`${process.env.REACT_APP_BASE}/inventory-search`);
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
                <h1 className="title bold">{action ==="UPDATE" ? "Update" : "Add"} Inventory</h1>
            </div>
            <div className="row mt-1">
                <div className="col-lg-12 ">
                    <div className="card-box">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6 p-1">
                                    <label>Select Item</label>
                                    <Select
                                        closeMenuOnSelect={false}
                                        value={categoryData?.category}
                                        options={data}
                                        onChange={handleCategoryChange}
                                        isClearable
                                        name="category"
                                    />
                                    {errors.category && <p className="error-msg">{errors.category}</p>}
                                </div>
                                <div className="col-md-6 p-1">
                                    <label>Qty</label>
                                    <input
                                        type="text"
                                        name="qty"
                                        placeholder='Enter Quantity'
                                        value={categoryData.qty}
                                        onChange={handleInputChange}
                                        className={errors.qty ? 'form-control error' : 'form-control'}
                                    />
                                    {errors.qty && <p className="error-msg">{errors.qty}</p>}
                                </div>
                                {/* <div className="col-md-6 p-1">
                                    <label>HSN/SAC</label>
                                    <input
                                        type="text"
                                        name="hsnSac"
                                        placeholder='Enter HSN/SAC Number'
                                        value={categoryData.hsnSac}
                                        onChange={handleInputChange}
                                        className={errors.hsnSac ? 'form-control error' : 'form-control'}
                                    />
                                    {errors.hsnSac && <p className="error-msg">{errors.hsnSac}</p>}
                                </div> */}
                                {/* <div className="col-md-6 p-1">
                                    <label>Size</label>
                                    <input
                                        type="text"
                                        name="size"
                                        placeholder='Enter Size'
                                        value={categoryData.size}
                                        onChange={handleInputChange}
                                        className={errors.size ? 'form-control error' : 'form-control'}
                                    />
                                    {errors.size && <p className="error-msg">{errors.size}</p>}
                                </div> */}
                                <div className="col-md-6 p-1">
                                    <label className=''>Inventory Status</label>
                                    <select
                                        name="invStatus"
                                        value={categoryData.invStatus}
                                        onChange={handleInputChange}
                                        className={errors.invStatus ? 'form-control error' : 'form-control'}
                                    >
                                        <option value="">Select Category Status</option>
                                        {status?.map((ele) => <option value={ele?.value}>{ele?.label}</option>)}
                                    </select>
                                    {errors.invStatus && <p className="error-msg">{errors.invStatus}</p>}
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

export default AddEditAr;
