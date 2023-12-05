import React, { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from "../AppContext";
import logoSM from '../assets/images/logos/Logo.jpeg';

import { get, post, put } from "../util/restUtil";
import { properties } from "../properties";
import { showSpinner, hideSpinner } from "../common/spinner";
import { toast } from 'react-toastify';
import { unstable_batchedUpdates } from 'react-dom';
import DynamicTable from '../common/table/DynamicTable';
import { useHistory } from "react-router-dom";
import moment from 'moment';

const InvoicePrint = (props) => {
    const rowsData = props?.location?.state?.data?.rows;
    const soData = props?.location?.state?.data?.soData;
    console.log('soId---------->', soData)



    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-6">
                   <img src={logoSM} alt="" />
                </div>
                <div className="col-sm-6 text-right">
                    <h4>Invoice# 24578924</h4>
                    <h4>Invoice Date 21/09/2021</h4>
                </div>
            </div>
            <hr />
            <div className="row">
                <div className="col-sm-6">
                    <h4>Invoice To</h4>
                    <p>Theme Vessel</p>
                    <p>info@themevessel.com</p>
                    <p>21-12 Green Street, Meherpur, Bangladesh</p>
                </div>
                <div className="col-sm-6 text-right">
                    <h4>Bill To</h4>
                    <p>Apexo Inc</p>
                    <p>billing@apexo.com</p>
                    <p>169 Teroghoria, Bangladesh</p>
                </div>
            </div>
            <hr />
            <div className="row">
                <div className="col-sm-6">
                    <h4>Date</h4>
                    <p>Due Date: 24/08/2021</p>
                </div>
                <div className="col-sm-6 text-right">
                    <h4>Payment Method</h4>
                    <p>Credit Card</p>
                </div>
            </div>
            <hr />
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Item 1</td>
                        <td>Description of item 1</td>
                        <td>1</td>
                        <td>$10.00</td>
                        <td>$10.00</td>
                    </tr>
                    <tr>
                        <td>Item 2</td>
                        <td>Description of item 2</td>
                        <td>2</td>
                        <td>$20.00</td>
                        <td>$40.00</td>
                    </tr>
                    <tr>
                        <td colspan="4" className="text-right">Subtotal</td>
                        <td>$50.00</td>
                    </tr>
                    <tr>
                        <td colspan="4" className="text-right">Tax</td>
                        <td>$5.00</td>
                    </tr>
                    <tr>
                        <td colspan="4" className="text-right">Total</td>
                        <td>$55.00</td>
                    </tr>
                </tbody>
            </table>
            <hr />
            <p>Thank you for your business!</p>
        </div>
    )
}

export default InvoicePrint;