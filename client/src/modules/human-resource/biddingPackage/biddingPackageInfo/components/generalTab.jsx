import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

function GeneralTab(props) {

    const [state, setState] = useState({

    })

    /**
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     * @param {*} monthYear : true trả về tháng năm , false trả về ngày tháng năm
     */
    const formatDate = (date, monthYear = false) => {
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
        } else {
            return date;
        }
    }

    useEffect(() => {
        setState(state => {
            return {
                ...state,
                id: props.id,
                name: props.biddingPackage.name,
                code: props.biddingPackage.code,
                startDate: props.biddingPackage.startDate,
                endDate: props.biddingPackage.endDate,
                type: props.biddingPackage.type,
                status: props.biddingPackage.status,
                description: props.biddingPackage.description,
            }
        })
    }, [props.id])

    const { translate } = props;

    const { id, name, code, startDate, endDate, type, status, description } = state;

    return (
        <div id={id} className="tab-pane active">
            <div className=" row box-body">
                <div className="pull-right col-lg-12 col-md-12 col-ms-12 col-xs-12">
                    <div className="row">
                        {/* Name */}
                        <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                            <strong>Tên gói thầu&emsp; </strong>
                            {name}
                        </div>
                        {/* Mã gói thầu */}
                        <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                            <strong>Mã gói thầu&emsp; </strong>
                            {code}
                        </div>
                    </div>
                    <div className="row">
                        {/* Thời gian bắt đầu */}
                        <div className="form-group col-lg-6 col-md-6 col-ms-12 col-xs-12">
                            <strong>Thời gian bắt đầu&emsp; </strong>
                            {formatDate(startDate)}
                        </div>
                        {/* Thời gian kết thúc */}
                        <div className="form-group col-lg-6 col-md-6 col-ms-12 col-xs-12">
                            <strong>Thời gian kết thúc&emsp; </strong>
                            {formatDate(endDate)}
                        </div>
                    </div>
                    <div className="row">
                        {/* Loại gói thầu */}
                        <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                            <strong>Loại gói thầu&emsp; </strong>
                            {type}
                        </div>
                        {/* Trạng thái */}
                        <div className="form-group col-lg-6 col-md-6 col-ms-6 col-xs-6">
                            <strong>Trạng thái&emsp; </strong>
                            {status}
                        </div>
                    </div>
                    <div className="row">
                        {/* Mô tả */}
                        <div className={`form-group col-lg-12 col-md-12 col-ms-12 col-xs-12`}>
                            <label htmlFor="emailCompany">Mô tả</label>
                            &emsp; { description }
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

const tabGeneral = connect(null, null)(withTranslate(GeneralTab));
export { tabGeneral as GeneralTab };