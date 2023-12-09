import React, { useEffect, useState } from 'react';
import { post, get, put } from '../util/restUtil';
import { properties } from '../properties';
import { showSpinner, hideSpinner } from '../common/spinner';
import { toast } from 'react-toastify';
import Select from 'react-select';

const AddEditCompany = (props) => {
    console.log("props", props);
    const companyPropsData = props?.location?.state?.data?.rowData
    const action = props?.location?.state?.data?.action

    console.log("companyPropsData....>", companyPropsData);
    const [data, setData] = useState([]);
    const [status, setStatus] = useState([]);
    const [companyTypes, setCompanyTypes] = useState([]);
    const [country, setCountry] = useState([]);
    const [states, setStates] = useState([]);
    const [countries, setCountries] = useState([]);

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

        post(properties.BUSINESS_ENTITY_API, ['COMMON_STATUS', 'COMPANY_TYPE', 'COUNTRY'])
            .then((resp) => {
                if (resp.data) {
                    setCountries(resp?.data?.COUNTRY)
                    let statusArr = []
                    resp?.data?.COMMON_STATUS?.map((e) => {
                        statusArr.push({ label: e.description, value: e.code })
                    })
                    setStatus(statusArr)
                    let companyArr = []
                    resp?.data?.COMPANY_TYPE?.map((e) => {
                        companyArr.push({ label: e.description, value: e.code })
                    })
                    setCompanyTypes(companyArr)
                    let countryArr = []
                    resp?.data?.COUNTRY?.map((e) => {
                        countryArr.push({ label: e.description, value: e.code })
                    })
                    setCountry(countryArr)
                }
            })
            .finally(hideSpinner)
    }, [])

    const [companyData, setCompanyData] = useState({
        cType: { label: "", value: "" },
        cName: '',
        cAddress: '',
        cPincode: '',
        cState: { label: "", value: "" },
        cCountry: { label: "", value: "" },
        cPhone: '',
        cEmail: '',
        cFax: '',
        cWebsite: '',
        cGst: '',
        cPan: '',
        cLic: '',
        cStatus: '',
        cBankName: '',
        cAccountNo: '',
        cBranchName: '',
        cIfsc: ''
    });

    useEffect(() => {
        if (companyPropsData) {
            const label = companyPropsData?.cCountryDesc?.mappingPayload?.states?.find((ele) => ele?.code === companyPropsData?.cState)?.description;
            const value = companyPropsData?.cCountryDesc?.mappingPayload?.states?.find((ele) => ele?.code === companyPropsData?.cState)?.code;

            const cState = { label, value }

            setCompanyData({
                cType: { label: companyPropsData?.typeDesc?.description, value: companyPropsData?.typeDesc?.code },
                cName: companyPropsData?.cName,
                cAddress: companyPropsData?.cAddress,
                cPincode: companyPropsData?.cPincode,
                cState,
                cCountry: { label: companyPropsData?.cCountryDesc?.description, value: companyPropsData?.typeDesc?.code },
                cPhone: companyPropsData?.cPhone,
                cEmail: companyPropsData?.cEmail,
                cFax: companyPropsData?.cFax,
                cWebsite: companyPropsData?.cWebsite,
                cGst: companyPropsData?.cGst,
                cPan: companyPropsData?.cPan,
                cLic: companyPropsData?.cLic,
                cStatus: companyPropsData?.cStatus,
                cBankName: companyPropsData?.cBankName,
                cAccountNo: companyPropsData?.cAccountNo,
                cBranchName: companyPropsData?.cBranchName,
                cIfsc: companyPropsData?.cIfsc
            })
        }
    }, [props])
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        let formIsValid = true;
        let newErrors = {};
        Object.keys(companyData).forEach((key) => {
            console.log("ima here in from valid");
            if (key !== 'selectedCategory' && !companyData[key]) {
                formIsValid = false;
                newErrors[key] = `This field is mandatory`;
            }
        });

        setErrors(newErrors);
        return formIsValid;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCompanyData({ ...companyData, [name]: value });
    };

    const handleCategoryChange = (selectedOption) => {
        setCompanyData({ ...companyData, cType: selectedOption });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('companyData-------------->', companyData)
        if (validateForm()) {
            showSpinner();
            let companyPayload = {
                cType: companyData?.cType?.value,
                cName: companyData?.cName,
                cAddress: companyData?.cAddress,
                cPincode: companyData?.cPincode,
                cState: companyData?.cState?.value,
                cCountry: companyData?.cCountry?.value,
                cPhone: companyData?.cPhone,
                cEmail: companyData?.cEmail,
                cFax: companyData?.cFax,
                cWebsite: companyData?.cWebsite,
                cGst: companyData?.cGst,
                cPan: companyData?.cPan,
                cLic: companyData?.cLic,
                cStatus: companyData?.cStatus,
                cBankName: companyData?.cBankName,
                cAccountNo: companyData?.cAccountNo,
                cBranchName: companyData?.cBranchName,
                cIfsc: companyData?.cIfsc
            };

            console.log("companyPayload....>", companyPayload);
            if (action === "UPDATE") {
                put(`${properties?.COMPANY_API}/${companyPropsData?.cId}`, { ...companyPayload })
                    .then((response) => {
                        toast.success(`${response.message}`);
                        props.history.push(`${process.env.REACT_APP_BASE}/company-search`);
                    })
                    .finally(() => {
                        hideSpinner();
                    });
            } else {
                post(properties?.COMPANY_API, { ...companyPayload })
                    .then((response) => {
                        toast.success(`${response.message}`);
                        props.history.push(`${process.env.REACT_APP_BASE}/company-search`);
                    })
                    .finally(() => {
                        hideSpinner();
                    });
            }
        }
    };

    const handleCountryChange = (cCountry) => {
        setCompanyData({ ...companyData, cCountry });
        let statesArr = [];
        console.log('countries---------->', countries)
        countries?.length > 0 && countries[0]?.mapping?.states?.map((e) => {
            statesArr.push({ label: e.description, value: e.code })
        })
        setStates(statesArr)
    }

    const handleStateChange = (cState) => {
        setCompanyData({ ...companyData, cState });
    }

    return (
        <div className="container-fluid">
            <div className="col-12">
                <h1 className="title bold">{action === "UPDATE" ? "Update" : "Add"} Company</h1>
            </div>
            <div className="row mt-1">
                <div className="col-lg-12 ">
                    <div className="card-box">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6 p-1">
                                    <label>Select Company Type</label>
                                    <Select
                                        closeMenuOnSelect={false}
                                        value={companyData?.cType}
                                        options={companyTypes}
                                        onChange={handleCategoryChange}
                                        isClearable
                                        name="cType"
                                    />
                                    {errors.cType && <p className="error-msg">{errors.cType}</p>}
                                </div>
                                <div className="col-md-6 p-1">
                                    <label>Name</label>
                                    <input
                                        type="text"
                                        name="cName"
                                        placeholder='Enter Name'
                                        value={companyData.cName}
                                        onChange={handleInputChange}
                                        className={errors.cName ? 'form-control error' : 'form-control'}
                                    />
                                    {errors.cName && <p className="error-msg">{errors.cName}</p>}
                                </div>
                                <div className="col-md-6 p-1">
                                    <label>Address</label>
                                    <textarea
                                        name="cAddress"
                                        placeholder='Enter Address'
                                        value={companyData.cAddress}
                                        onChange={handleInputChange}
                                        className={errors.cAddress ? 'form-control error' : 'form-control'}
                                    />
                                    {errors.cAddress && <p className="error-msg">{errors.cAddress}</p>}
                                </div>
                                <div className="col-md-6 p-1">
                                    <label>Pincode</label>
                                    <input
                                        type="text"
                                        name="cPincode"
                                        placeholder='Enter Pincode'
                                        value={companyData.cPincode}
                                        onChange={handleInputChange}
                                        className={errors.cPincode ? 'form-control error' : 'form-control'}
                                    />
                                    {errors.cPincode && <p className="error-msg">{errors.cPincode}</p>}
                                </div>
                                <div className="col-md-6 p-1">
                                    <label>Country</label>
                                    <Select
                                        closeMenuOnSelect={false}
                                        value={companyData?.cCountry}
                                        options={country}
                                        onChange={handleCountryChange}
                                        isClearable
                                        name="cCountry"
                                    />
                                    {errors.cCountry && <p className="error-msg">{errors.cCountry}</p>}
                                </div>
                                <div className="col-md-6 p-1">
                                    <label>State</label>
                                    <Select
                                        closeMenuOnSelect={false}
                                        value={companyData?.cState}
                                        options={states}
                                        onChange={handleStateChange}
                                        isClearable
                                        name="cState"
                                    />
                                    {errors.cState && <p className="error-msg">{errors.cState}</p>}
                                </div>
                                <div className="col-md-6 p-1">
                                    <label>Phone Number</label>
                                    <input
                                        type="text"
                                        name="cPhone"
                                        placeholder='Enter Phone Number'
                                        value={companyData.cPhone}
                                        onChange={handleInputChange}
                                        className={errors.cPhone ? 'form-control error' : 'form-control'}
                                    />
                                    {errors.cPhone && <p className="error-msg">{errors.cPhone}</p>}
                                </div>
                                <div className="col-md-6 p-1">
                                    <label>Email Id</label>
                                    <input
                                        type="text"
                                        name="cEmail"
                                        placeholder='Enter Email Id'
                                        value={companyData.cEmail}
                                        onChange={handleInputChange}
                                        className={errors.cEmail ? 'form-control error' : 'form-control'}
                                    />
                                    {errors.cEmail && <p className="error-msg">{errors.cEmail}</p>}
                                </div>
                                <div className="col-md-6 p-1">
                                    <label>Fax</label>
                                    <input
                                        type="text"
                                        name="cFax"
                                        placeholder='Enter Fax'
                                        value={companyData.cFax}
                                        onChange={handleInputChange}
                                        className={errors.cFax ? 'form-control error' : 'form-control'}
                                    />
                                    {errors.cFax && <p className="error-msg">{errors.cFax}</p>}
                                </div>
                                <div className="col-md-6 p-1">
                                    <label>Company Website</label>
                                    <input
                                        type="text"
                                        name="cWebsite"
                                        placeholder='Enter Company Website'
                                        value={companyData.cWebsite}
                                        onChange={handleInputChange}
                                        className={errors.cWebsite ? 'form-control error' : 'form-control'}
                                    />
                                    {errors.cWebsite && <p className="error-msg">{errors.cWebsite}</p>}
                                </div>
                                <div className="col-md-6 p-1">
                                    <label>GST Number</label>
                                    <input
                                        type="text"
                                        name="cGst"
                                        placeholder='Enter GST Number'
                                        value={companyData.cGst}
                                        onChange={handleInputChange}
                                        className={errors.cGst ? 'form-control error' : 'form-control'}
                                    />
                                    {errors.cGst && <p className="error-msg">{errors.cGst}</p>}
                                </div>
                                <div className="col-md-6 p-1">
                                    <label>PAN Number</label>
                                    <input
                                        type="text"
                                        name="cPan"
                                        placeholder='Enter PAN Number'
                                        value={companyData.cPan}
                                        onChange={handleInputChange}
                                        className={errors.cPan ? 'form-control error' : 'form-control'}
                                    />
                                    {errors.cPan && <p className="error-msg">{errors.cPan}</p>}
                                </div>
                                <div className="col-md-6 p-1">
                                    <label>LIC Number</label>
                                    <input
                                        type="text"
                                        name="cLic"
                                        placeholder='Enter LIC Number'
                                        value={companyData.cLic}
                                        onChange={handleInputChange}
                                        className={errors.cLic ? 'form-control error' : 'form-control'}
                                    />
                                    {errors.cLic && <p className="error-msg">{errors.cLic}</p>}
                                </div>
                                <div className="col-md-6 p-1">
                                    <label>Bank Name</label>
                                    <input
                                        type="text"
                                        name="cBankName"
                                        placeholder='Enter Bank Name'
                                        value={companyData.cBankName}
                                        onChange={handleInputChange}
                                        className={errors.cBankName ? 'form-control error' : 'form-control'}
                                    />
                                    {errors.cBankName && <p className="error-msg">{errors.cBankName}</p>}
                                </div>
                                <div className="col-md-6 p-1">
                                    <label>Account Number</label>
                                    <input
                                        type="text"
                                        name="cAccountNo"
                                        placeholder='Enter Account Number'
                                        value={companyData.cAccountNo}
                                        onChange={handleInputChange}
                                        className={errors.cAccountNo ? 'form-control error' : 'form-control'}
                                    />
                                    {errors.cAccountNo && <p className="error-msg">{errors.cAccountNo}</p>}
                                </div>
                                <div className="col-md-6 p-1">
                                    <label>Branch Name</label>
                                    <input
                                        type="text"
                                        name="cBranchName"
                                        placeholder='Enter Branch Name'
                                        value={companyData.cBranchName}
                                        onChange={handleInputChange}
                                        className={errors.cBranchName ? 'form-control error' : 'form-control'}
                                    />
                                    {errors.cBranchName && <p className="error-msg">{errors.cBranchName}</p>}
                                </div>
                                <div className="col-md-6 p-1">
                                    <label>IFSC</label>
                                    <input
                                        type="text"
                                        name="cIfsc"
                                        placeholder='Enter IFSC code'
                                        value={companyData.cIfsc}
                                        onChange={handleInputChange}
                                        className={errors.cIfsc ? 'form-control error' : 'form-control'}
                                    />
                                    {errors.cIfsc && <p className="error-msg">{errors.cIfsc}</p>}
                                </div>
                                <div className="col-md-6 p-1">
                                    <label className=''>Status</label>
                                    <select
                                        name="cStatus"
                                        value={companyData.cStatus}
                                        onChange={handleInputChange}
                                        className={errors.cStatus ? 'form-control error' : 'form-control'}
                                    >
                                        <option value="">Select Status</option>
                                        {status?.map((ele) => <option value={ele?.value}>{ele?.label}</option>)}
                                    </select>
                                    {errors.cStatus && <p className="error-msg">{errors.cStatus}</p>}
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

export default AddEditCompany;
