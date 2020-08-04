import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class DisposalTab extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    // Function format dữ liệu Date thành string
    formatDate(date, monthYear = false) {
        var d = new Date(date),
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

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                disposalDate: nextProps.disposalDate,
                disposalType: nextProps.disposalType,
                disposalCost: nextProps.disposalCost,
                disposalDesc: nextProps.disposalDesc,
            }
        } else {
            return null;
        }
    }


    render() {
        const { id, translate } = this.props;
        const { disposalDate, disposalType, disposalCost, disposalDesc } = this.state;
        var formater = new Intl.NumberFormat();
        return (
            <div id={id} className="tab-pane">
                <div className="box-body">
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">Thông tin thanh lý</h4></legend>
                        <div className="form-group">
                            <strong>Thời gian thanh lý:&emsp; </strong>
                            {disposalDate ? this.formatDate(disposalDate) : ''}
                        </div>
                        <div className="form-group">
                            <strong>Hình thức thanh lý:&emsp; </strong>
                            {disposalType}
                        </div>
                        <div className="form-group">
                            <strong>Giá trị thanh lý:&emsp; </strong>
                            {disposalCost ? formater.format(parseInt(disposalCost)) : ''} VNĐ
                        </div>
                        <div className="form-group">
                            <strong>Nội dung thanh lý:&emsp; </strong>
                            {disposalDesc}
                        </div>
                    </fieldset>
                </div>
            </div>
        );
    }
};
const disposalTab = connect(null, null)(withTranslate(DisposalTab));
export { disposalTab as DisposalTab };