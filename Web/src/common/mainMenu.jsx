import React, { useContext, useRef, useState, useEffect } from "react";
import { AppContext } from "../AppContext";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { post } from "../util/restUtil";
import { properties } from "../properties";
import { showSpinner, hideSpinner } from "../common/spinner";
import { CustomerSearchColumns, CustomerSearchHiddenColumns, ComplaintCustomerSearchHiddenColumns } from "../customer/customerSearchColumns";
import SearchModal from "./SearchModal";
import { unstable_batchedUpdates } from "react-dom";
import { formFilterObject } from "../util/util";

const MainMenu = () => {

    const history = useHistory();
    let requestParam;
    const { auth } = useContext(AppContext);
    const [errorMsg, setErrorMsg] = useState('')
    const [customerQuickSearchInput, setCustomerQuickSearchInput] = useState("");

    const [totalCount, setTotalCount] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [filters, setFilters] = useState([]);

    const isFirstRender = useRef(true);
    const isTableFirstRender = useRef(true);
    const hasExternalSearch = useRef(false);
    const handleCustomerQuickSearch = (e) => {
        e.preventDefault();
        if (customerQuickSearchInput === undefined || customerQuickSearchInput === "") {
            toast.error("Please enter a value to Search");
        } else {
            requestParam = {
                searchType: 'QUICK_SEARCH',
                customerQuickSearchInput: customerQuickSearchInput
            }
            showSpinner();
            post(properties.CUSTOMER_API + "/search?limit=10&page=0", requestParam)
                .then((resp) => {
                    if (resp.data) {
                        if (resp.status === 200) {
                            if (resp.data.length === 0) {
                                toast.error("No search results available for the given search input");
                            } else if (resp.data.rows.length === 1) {
                                sessionStorage.setItem("customerId", resp.data.rows[0].customerId)
                                sessionStorage.setItem("accountId", resp.data.rows[0].accountId)
                                sessionStorage.setItem("serviceId", resp.data.rows[0].serviceId)
                                sessionStorage.setItem("accountNo", resp.data.rows[0].accountNo)
                                if (Number(resp.data.rows[0].crmCustomerNo) === Number(customerQuickSearchInput)) {
                                    sessionStorage.removeItem("service")
                                    sessionStorage.removeItem("account")
                                }
                                else if (Number(resp.data.rows[0].accountNo) === Number(customerQuickSearchInput)) {
                                    sessionStorage.removeItem("service")
                                    sessionStorage.setItem("account", true)
                                }
                                else if (Number(resp.data.rows[0].accessNbr) === Number(customerQuickSearchInput)) {
                                    sessionStorage.removeItem("account")
                                    sessionStorage.setItem("service", true)
                                }
                                else {
                                    sessionStorage.removeItem("service")
                                    sessionStorage.removeItem("account")
                                }
                                history.push(`${process.env.REACT_APP_BASE}/customer360`)
                                //setCustomerQuickSearchInput("")
                            } else {
                                sessionStorage.setItem("searchType", 'QUICK_SEARCH')
                                sessionStorage.setItem("customerQuickSearchInput", customerQuickSearchInput)
                                history.push(`${process.env.REACT_APP_BASE}/search`)
                                //setCustomerQuickSearchInput("")
                            }
                        } else {
                            toast.error("Uexpected error during customer search - " + resp.status + ', ' + resp.message);
                        }
                    } else {
                        toast.error("Records Not Found");
                        //toast.error("Uexpected error during customer search " + resp.statusCode);
                    }
                }).finally(() => {
                    setCustomerQuickSearchInput("");
                    hideSpinner();
                });
        }
    }

    const [isComplaintModalOpen, setIsComplaintModalOpen] = useState({ openModal: false, searchType: '' });
    const [complaintSearchInput, setComplaintSearchInput] = useState("");
    const [complaintSearchData, setComplaintSearchData] = useState([]);

    useEffect(() => {
        if (!isFirstRender.current) {
            getCustomerDataForComplaint()
        }
        else {
            isFirstRender.current = false;
        }
    }, [perPage, currentPage])

    const handleOnCustomerSearch = (e) => {
        e.preventDefault();
        isTableFirstRender.current = true;
        unstable_batchedUpdates(() => {
            setFilters([])
            setCurrentPage((currentPage) => {
                if (currentPage === 0) {
                    return '0'
                }
                return 0
            });
        })
    }

    const getCustomerDataForComplaint = () => {
        requestParam = {
            searchType: 'QUICK_SEARCH',
            customerQuickSearchInput: complaintSearchInput,
            filters: formFilterObject(filters),
            source: 'COMPLAINT'
        }
        showSpinner();
        post(`${properties.CUSTOMER_API}/search?limit=${perPage}&page=${currentPage}`, requestParam)
            .then((resp) => {
                if (resp.data) {
                    if (resp.status === 200) {
                        const { rows, count } = resp.data;
                        unstable_batchedUpdates(() => {
                            setTotalCount(count)
                            setComplaintSearchData(rows);
                        })
                    } else {
                        setComplaintSearchData([])
                        //toast.error("Error searching for customer - " + resp.status + ', ' + resp.message);
                    }
                } else {
                    setComplaintSearchData([])
                    //toast.error("Uexpected error searching for customer " + resp.statusCode);
                }
            }).finally(hideSpinner);
    }

    const handleCellLinkClick = (e, rowData, searchName) => {
        const { customerId, accountId, accountNo, accountName, accountContactNo, accountEmail, serviceId, accessNbr, serviceStatus, prodType } = rowData;

        const data = {
            customerId,
            accountId,
            accountNo,
            accountName,
            accountContactNo,
            accountEmail,
            serviceId,
            serviceNo: accessNbr,
            serviceStatus,
            serviceType: prodType,
            type: searchName.searchType
        }
        if (['Complaint', 'Service Request'].includes(searchName.searchType)) {
            if (serviceStatus === "PENDING") {
                toast.error('Complaint cannot be created when service is in PENDING status');
                setIsComplaintModalOpen({ ...isComplaintModalOpen, openModal: true });
                return false;
            }
            setIsComplaintModalOpen({ openModal: false });
            history.push(`${process.env.REACT_APP_BASE}/create-${searchName.searchType.toLowerCase().replace(' ', '-')}`, { data })
            setComplaintSearchData([]);
            setComplaintSearchInput("")
        }
        else if (searchName.searchType === 'Inquiry') {
            history.push(`${process.env.REACT_APP_BASE}/create-inquiry-existing-customer`, { data })
            setComplaintSearchData([]);
            setComplaintSearchInput("")
        }

    }
    const handleCellRender = (cell, row) => {
        if (cell.column.Header === "Access Number") {
            return (<span className="text-primary cursor-pointer" onClick={(e) => handleCellLinkClick(e, row.original, isComplaintModalOpen)}>{cell.value}</span>)
        } else {
            return (<span>{cell.value}</span>)
        }
    }

    const handlePageSelect = (pageNo) => {
        setCurrentPage(pageNo)
    }

    return (
        <div className="clearfix">
            {auth && auth?.user ? (
                <div id="menu_area" className="menu-area topnav">
                    <div className="container-fluid">
                        <div className="row">
                            <nav className="navbar navbar-light navbar-expand-lg mainmenu topnav-menu">
                                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon"></span>
                                </button>
                                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                    <ul className="navbar-nav">
                                        {/* <li className="nav-item dropdown">
                                            <Link className="nav-link dropdown-toggle arrow-none active" to="/" id="topnav-dashboard">
                                                <i className="fe-airplay mr-1"></i> Dashboard
                                            </Link>
                                        </li> */}
                                        <li className="dropdown">
                                            <span className="nav-link dropdown-toggle arrow-none" id="topnav-apps" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <i className="fe-grid mr-1"></i> Company's <div className="arrow-down"></div>
                                            </span>
                                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                                <li>
                                                    <Link to={`${process.env.REACT_APP_BASE}/company-search`} className="dropdown-item">
                                                        <i className="fe-search"></i> Search
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to={`${process.env.REACT_APP_BASE}/company-create`} className="dropdown-item">
                                                        <i className="fe-plus"></i> Create
                                                    </Link>
                                                </li>
                                            </ul>
                                        </li>
                                        <li className="dropdown">
                                            <span className="nav-link dropdown-toggle arrow-none" id="topnav-apps" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <i className="fe-grid mr-1"></i> Item's <div className="arrow-down"></div>
                                            </span>
                                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                                <li>
                                                    <Link to={`${process.env.REACT_APP_BASE}/category-search`} className="dropdown-item">
                                                        <i className="fe-search"></i> Search
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to={`${process.env.REACT_APP_BASE}/category-create`} className="dropdown-item">
                                                        <i className="fe-plus"></i> Create
                                                    </Link>
                                                </li>
                                            </ul>
                                        </li>
                                        <li className="dropdown">
                                            <span className="nav-link dropdown-toggle arrow-none" id="topnav-apps" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <i className="fe-grid mr-1"></i> Inventory <div className="arrow-down"></div>
                                            </span>
                                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                                <li>
                                                    <Link to={`${process.env.REACT_APP_BASE}/inventory-search`} className="dropdown-item">
                                                        <i className="fe-search"></i> Search
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to={`${process.env.REACT_APP_BASE}/inventory-create`} className="dropdown-item">
                                                        <i className="fe-plus"></i> Create
                                                    </Link>
                                                </li>
                                            </ul>
                                        </li>
                                        <li className="dropdown">
                                            <span className="nav-link dropdown-toggle arrow-none" id="topnav-apps" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <i className="fe-grid mr-1"></i> Purchase Order <div className="arrow-down"></div>
                                            </span>
                                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                                <li>
                                                    <Link to={`${process.env.REACT_APP_BASE}/po-search`} className="dropdown-item">
                                                        <i className="fe-search"></i> Search
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to={`${process.env.REACT_APP_BASE}/po-create`} className="dropdown-item">
                                                        <i className="fe-plus"></i> Create
                                                    </Link>
                                                </li>
                                            </ul>
                                        </li>
                                        <li className="dropdown">
                                            <span className="nav-link dropdown-toggle arrow-none" id="topnav-apps" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <i className="fe-grid mr-1"></i> Sales Order<div className="arrow-down"></div>
                                            </span>
                                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                                <li>
                                                    <Link to={`${process.env.REACT_APP_BASE}/so-search`} className="dropdown-item">
                                                        <i className="fe-search"></i> View
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to={`${process.env.REACT_APP_BASE}/so-create`} className="dropdown-item">
                                                        <i className="fe-plus"></i> Create
                                                    </Link>
                                                </li>
                                            </ul>
                                        </li>
                                        <li className="dropdown">
                                            <span className="nav-link dropdown-toggle arrow-none" id="topnav-apps" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <i className="fe-grid mr-1"></i> Billing <div className="arrow-down"></div>
                                            </span>
                                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                                <li>
                                                    <Link to={`${process.env.REACT_APP_BASE}/invoice-search`} className="dropdown-item">
                                                        <i className="fe-search"></i> Search
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to={`${process.env.REACT_APP_BASE}/bill-view`} className="dropdown-item">
                                                        <i className="fe-plus"></i> Create
                                                    </Link>
                                                </li>
                                            </ul>
                                        </li>
                                        <li className="dropdown">
                                            <span className="nav-link dropdown-toggle arrow-none" id="topnav-apps" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <i className="fe-grid mr-1"></i> AR <div className="arrow-down"></div>
                                            </span>
                                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                                <li>
                                                    <Link to={`${process.env.REACT_APP_BASE}/ar-search`} className="dropdown-item">
                                                        <i className="fe-search"></i> Search
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to={`${process.env.REACT_APP_BASE}/ar-create`} className="dropdown-item">
                                                        <i className="fe-plus"></i> Create
                                                    </Link>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
            ) : (
                ""
            )
            }
        </div >
    );
};

export default MainMenu;
