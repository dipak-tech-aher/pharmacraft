import React from "react";
import { Switch, Redirect, Router } from "react-router-dom";
import { history } from "./util/history";
import { PrivateRoute, PublicRoute } from "./common/route";
import Login from "./user/login";
import Signup from "./user/signup";
import ChangePassword from "./user/changePassword";
import Logout from "./common/logout";
import ClearAuth from "./common/clearAuth";
import NewCustomer from './customer/newCustomer'
import CustomerSearch from './customer/customerSearch'
import UserView from "./admin/userView";
import Customer360 from "./customer360/customer360";
import RoleTable from "./role/RoleTable";
import NewRole from "./role/NewRole";
import UpdateRole from "./role/UpdateRole";
import EditCustomer from "./editCustomer/editCustomer";
import FileUpload from "./common/uploadAttachment/fileUpload";
import InteractionSearch from "./interactionSearch/InteractionSearch";
import LeadDataTable from "./lead/leadDataTable";
import EditServiceRequest from "./serviceRequest/editServiceRequest";
import CustomerAdvanceSearch from "./customerAdvanceSearch/CustomerAdvanceSearch";
import MyProfile from "./user/myProfile";
import EditProfile from "./user/EditProfile";
import ForgotPassword from "./user/ForgotPassword";
import LoginToForgotPass from "./user/loginToForgot";
import Register from "./user/register";
import RegisterVerify from "./user/registerVerify";
import ManageParameters from "./manageParameters/manageParameters";
import ScrollToTop from "./ScrollToTop";
import AddParameter from "./manageParameters/addParameter";
import EditParameter from "./manageParameters/editParameter";
import ParametersMapping from "./manageParameters/ParametersMapping";
import NotificationTable from "./common/notificationTable";
import ExternalLogin from "./user/ExternalLogin";

import ChangePasswordInitial from "./user/changePasswordInitial";
import WFViewer from "./wf/wfViewer";
import WFModeler from "./wf/wfModeler";
import AddEditWorkflow from "./wf/addEditWorkflow";
import WFStatusViewer from "./wf/wfStatusViewer";

// PHARMAKRAFT ROUTES STARTS HERE
import AddEditCategory from "./category/AddEditCategory";
import ViewCategory from "./category/ViewCategory";
import AddEditInventory from "./inventory/AddEditInventory";
import ViewInventory from "./inventory/ViewInventory";
import AddEditPo from "./purchaseOrders/AddEditPo";
import ViewPo from "./purchaseOrders/ViewPo";
import ViewSo from "./saleOrders/ViewSo";
import AddEditSo from "./saleOrders/AddEditSo";
import ViewBill from "./billing/ViewBill";
import ViewInvoices from "./billing/ViewInvoices";
import AddEditBill from "./billing/AddEditBill";
import GenerateInvoice from "./billing/GenerateInvoice";
import ViewCompany from "./company/ViewCompany";
import AddEditCompany from "./company/AddEditCompany";
import AddEditAr from "./ar/AddEditAr";
import ViewAr from "./ar/ViewAr";
import PayBill from "./ar/PayBill";
import OperationalDashboard from "./dashboard/operational/OperationalDashboard";
import InvoiceReport from "./reports/InvoiceReport";

// PHARMAKRAFT ROUTES ENDS HERE

function App() {
  return (
    <Router history={history} basename={`${process.env.REACT_APP_BASE}`}>
      <ScrollToTop />
      <Switch>
        <PublicRoute exact path={`${process.env.REACT_APP_BASE}/user/login`} component={Login} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/logout`} component={Logout} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/clearAuth`} component={ClearAuth} />

        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/`} component={OperationalDashboard} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/operational-dashboard`} component={OperationalDashboard} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/category-search`} component={ViewCategory} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/category-create`} component={AddEditCategory} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/inventory-search`} component={ViewInventory} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/inventory-create`} component={AddEditInventory} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/po-search`} component={ViewPo} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/po-create`} component={AddEditPo} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/so-search`} component={ViewSo} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/so-create`} component={AddEditSo} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/bill-view`} component={ViewBill} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/generate-invoice`} component={GenerateInvoice} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/invoice-search`} component={ViewInvoices} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/bill-create`} component={AddEditBill} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/company-search`} component={ViewCompany} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/company-create`} component={AddEditCompany} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/ar-search`} component={ViewAr} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/ar-create`} component={AddEditAr} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/pay-bill`} component={PayBill} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/invoice-report`} component={InvoiceReport} />
        <PublicRoute exact path={`${process.env.REACT_APP_BASE}/wf-modeler`} component={WFModeler} />
        <PublicRoute exact path={`${process.env.REACT_APP_BASE}/wf-viewer`} component={WFViewer} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/wf-addedit`} component={AddEditWorkflow} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/wf-status-viewer`} component={WFStatusViewer} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/admin-user-view`} component={UserView} />
        
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/search`} component={CustomerSearch} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/new-customer`} component={NewCustomer} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/edit-customer/:id`} component={EditCustomer} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/customer360`} component={Customer360} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/role`} component={RoleTable} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/newrole`} component={NewRole} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/attachment`} component={FileUpload} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/updaterole`} component={UpdateRole} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/ticket-search`} component={InteractionSearch} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/lead`} component={LeadDataTable} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/edit-service-request`} component={EditServiceRequest} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/manage-parameters`} component={ManageParameters} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/edit-parameters`} component={EditParameter} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/add-parameters`} component={AddParameter} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/notification`} component={NotificationTable} />
        <PublicRoute exact path={`${process.env.REACT_APP_BASE}/user/external-login`} component={ExternalLogin} />

        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/mapping-parameters`} component={ParametersMapping} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/customer-advance-search`} component={CustomerAdvanceSearch} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/user/signup/:inviteToken`} component={Signup} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/user/changepassword`} component={ChangePassword} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/user/myprofile`} component={MyProfile} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/user/editprofile`} component={EditProfile} />
        <PublicRoute exact path={`${process.env.REACT_APP_BASE}/user/changePasswordInitial/:forgotpasswordtoken`} component={ChangePasswordInitial} />
        <PublicRoute exact path={`${process.env.REACT_APP_BASE}/user/forgotpassword/setpassword/:forgotpasswordtoken`} component={ForgotPassword} />
        <PublicRoute exact path={`${process.env.REACT_APP_BASE}/user/forgotpassword`} component={LoginToForgotPass} />
        <PublicRoute exact path={`${process.env.REACT_APP_BASE}/user/register`} component={Register} />
        <PublicRoute exact path={`${process.env.REACT_APP_BASE}/user/registerverify/:inviteToken`} component={RegisterVerify} />
       
        <Redirect to={`${process.env.REACT_APP_BASE}/operational-dashboard`} />
      </Switch>
    </Router>
  );
}

export default App;
