import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import InventoryDashboardHeader from './inventoryDashboardHeader';
import QuantityInventoryDashboard from './quantityInventoryDashboard';
import QuantityExpirationDate from './quantityExpirationDate';
import QuantityExpiratedDate from './quantityExpiratedDate';
import NormDasdboard from './normDasdboard';
import GoodWillIssue from './goodWillIssue';
import GoodWillReceipt from './goodWillReceipt';
import QuantityNorm from './quantityNorm';
import QuantityInventoryByTime from './quantityInventorybyTime';

function DashBoardInventories(props) {
    const [state, setState] = useState({
        stock: null,
        actionSearch: true,
    })

    /**
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
     */
    function formatDate(date, monthYear = false) {
        if (date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            if (monthYear === true) {
                return [month, year].join('-');
            } else return [day, month, year].join('-');
        }
        return date;
    };

    /**
     * Bắt sự kiện thay đổi tháng
     * @param {*} value : Giá trị tháng chart nhân sự theo dải lương và chart top lương cao nhất
     */
    const handleMonthChange = async (value) => {
        await setState({
            ...state,
            month: value
        })
    }

    /**
     * Bắt sự kiện thay đổi đơn vị
     * @param {*} value 
     */
    const handleSelectOrganizationalUnit = async (value) => {
        await setState({
            ...state,
            organizationalUnits: value,
            actionSearch: state.actionSearch,
        })
    };

    const { stock, actionSearch } = state;

    return (
        <div className="qlcv">
            <InventoryDashboardHeader handleSelectOrganizationalUnit={handleSelectOrganizationalUnit} handleMonthChange={handleMonthChange} />
            <div className="row">
                <div className=" col-lg-12 col-md-12 col-md-sm-12 col-xs-12">
                    <QuantityInventoryDashboard actionSearch={actionSearch} />
                </div>
                <div className=" col-lg-12 col-md-12 col-md-sm-12 col-xs-12">
                    <QuantityNorm actionSearch={actionSearch} />
                </div>
                {/* <div className=" col-lg-12 col-md-12 col-md-sm-12 col-xs-12">
                    <QuantityInventoryByTime actionSearch={actionSearch} />
                </div> */}
                <div className=" col-lg-6 col-md-6 col-md-sm-12 col-xs-12">
                    <GoodWillIssue actionSearch={actionSearch} />
                </div>
                <div className=" col-lg-6 col-md-6 col-md-sm-12 col-xs-12">
                    <GoodWillReceipt actionSearch={actionSearch} />
                </div>

                <div className=" col-lg-6 col-md-6 col-md-sm-12 col-xs-12">
                    <QuantityExpirationDate handleMonthChange={handleMonthChange} />
                </div>
                <div className=" col-lg-6 col-md-6 col-md-sm-12 col-xs-12">
                    <QuantityExpiratedDate handleMonthChange={handleMonthChange} />
                </div>

                <div className=" col-lg-6 col-md-6 col-md-sm-12 col-xs-12">
                    <NormDasdboard handleMonthChange={handleMonthChange} />
                </div>
            </div>
        </div>
    );
}

export default connect(null, null)(withTranslate(DashBoardInventories));