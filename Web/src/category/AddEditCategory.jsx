import React, { useState, useEffect } from 'react';
import { post } from '../util/restUtil';
import { properties } from '../properties';
import { showSpinner, hideSpinner } from '../common/spinner';
import { toast } from 'react-toastify';

const AddEditCategory = (props) => {
    const [status, setStatus] = useState([]);
    const [units, setUnits] = useState([]);
    const [categoryData, setCategoryData] = useState({
        catName: '',
        catNumber: '',
        catDesc: '',
        catUnit: '',
        catStatus: '',
        catHsnSac: '',
        catSize: '',
    });

    useEffect(() => {
        showSpinner();
        post(properties.BUSINESS_ENTITY_API, ['COMMON_STATUS', 'ITEM_UNITS'])
            .then((resp) => {
                if (resp.data) {
                    let statusArr = []
                    resp?.data?.COMMON_STATUS?.map((e) => {
                        statusArr.push({ label: e.description, value: e.code })
                    })
                    setStatus(statusArr)
                    let unitsArr = []
                    resp?.data?.ITEM_UNITS?.map((e) => {
                        unitsArr.push({ label: e.description, value: e.code })
                    })
                    setUnits(unitsArr)
                }
            })
            .finally(hideSpinner)
    }, [])


    const [errors, setErrors] = useState({});

    const validateForm = () => {
        let formIsValid = true;
        let newErrors = {};

        Object.keys(categoryData).forEach((key) => {
            if (!categoryData[key]) {
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

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            showSpinner();
            const complaint = {
                catName: categoryData.catName,
                catNumber: categoryData.catNumber,
                catHsnSac: categoryData.catHsnSac,
                catDesc: categoryData.catDesc,
                catUnit: categoryData.catUnit,
                catStatus: categoryData.catStatus,
                catSize: categoryData.catSize,
            };
            console.log('complaint---------->', complaint)

            post(properties?.CATEGORY_API, { ...complaint })
                .then((response) => {
                    toast.success(`${response.message}`);
                    props.history.push(`${process.env.REACT_APP_BASE}/category-search`);
                })
                .finally(() => {
                    hideSpinner();
                });
        }
    };

    return (
        <div className="container-fluid">
            <div className="col-12">
                <h1 className="title bold">Create item</h1>
            </div>
            <div className="row mt-1">
                <div className="col-lg-12 ">
                    <div className="card-box">
                        <form onSubmit={handleSubmit}>
                            <div className='row'>
                                <div className="col-md-6 p-1">
                                    <label>Item Name</label>
                                    <input
                                        type="text"
                                        name="catName"
                                        placeholder='Enter Item Name'
                                        value={categoryData.catName}
                                        onChange={handleInputChange}
                                        className={errors.catName ? 'form-control error' : 'form-control'}
                                    />
                                    {errors.catName && <p className="error-msg">{errors.catName}</p>}
                                </div>
                                <div className="col-md-6 p-1">
                                    <label>Item Number</label>
                                    <input
                                        type="text"
                                        name="catNumber"
                                        placeholder='Enter Item Number'
                                        value={categoryData.catNumber}
                                        onChange={handleInputChange}
                                        className={errors.catNumber ? 'form-control error' : 'form-control'}
                                    />
                                    {errors.catNumber && <p className="error-msg">{errors.catNumber}</p>}
                                </div>
                                <div className="col-md-6 p-1">
                                    <label>HSN SAC Number</label>
                                    <input
                                        type="text"
                                        name="catHsnSac"
                                        placeholder='Enter HSN/SAC Number'
                                        value={categoryData.catHsnSac}
                                        onChange={handleInputChange}
                                        className={errors.catHsnSac ? 'form-control error' : 'form-control'}
                                    />
                                    {errors.catHsnSac && <p className="error-msg">{errors.catHsnSac}</p>}
                                </div>
                                <div className="col-md-6 p-1">
                                    <label>Item Description</label>
                                    <input
                                        type="text"
                                        name="catDesc"
                                        placeholder='Enter Item Description'
                                        value={categoryData.catDesc}
                                        onChange={handleInputChange}
                                        className={errors.catDesc ? 'form-control error' : 'form-control'}
                                    />
                                    {errors.catDesc && <p className="error-msg">{errors.catDesc}</p>}
                                </div>
                                <div className="col-md-6 p-1">
                                    <label>Item Size</label>
                                    <input
                                        type="text"
                                        name="catSize"
                                        placeholder='Enter Item Size'
                                        value={categoryData.catSize}
                                        onChange={handleInputChange}
                                        className={errors.catSize ? 'form-control error' : 'form-control'}
                                    />
                                    {errors.catSize && <p className="error-msg">{errors.catSize}</p>}
                                </div>
                                <div className="col-md-6 p-1">
                                    <label>Item Unit</label>
                                    {/* <select
                                        name="catUnit"
                                        value={categoryData.catUnit}
                                        onChange={handleInputChange}
                                        className={errors.catUnit ? 'form-control error' : 'form-control'}
                                    >
                                        <option value="">Select Item Unit</option>
                                        <option value="unit1">Unit 1</option>
                                        <option value="unit2">Unit 2</option>
                                    </select> */}
                                    <select
                                        name="catUnit"
                                        value={categoryData.catUnit}
                                        onChange={handleInputChange}
                                        className={errors.catUnit ? 'form-control error' : 'form-control'}
                                    >
                                        <option value="">Select Item Unit</option>
                                        {units?.map((ele) => <option value={ele?.value}>{ele?.label}</option>)}
                                    </select>
                                    {errors.catUnit && <p className="error-msg">{errors.catUnit}</p>}
                                </div>
                                <div className="col-md-6 p-1">
                                    <label className=''>Item Status</label>
                                    <select
                                        name="catStatus"
                                        value={categoryData.catStatus}
                                        onChange={handleInputChange}
                                        className={errors.catStatus ? 'form-control error' : 'form-control'}
                                    >
                                        <option value="">Select Item Status</option>
                                        {status?.map((ele) => <option value={ele?.value}>{ele?.label}</option>)}
                                    </select>
                                    {errors.catStatus && <p className="error-msg">{errors.catStatus}</p>}
                                </div>
                            </div>
                            <div className="text-center mt-2"> {/* Center the button */}
                                <button type="submit" className='btn btn-primary'>Submit</button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddEditCategory;
