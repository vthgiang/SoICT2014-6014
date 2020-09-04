import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { AnnualLeaveApplicationForm } from './combinedContent';

import { HolidayActions } from '../../holiday/redux/actions';
import { AnnualLeaveActions } from '../redux/actions';

class AnnualLeave extends Component {
    constructor(props) {
        super(props);
        this.state = {
            year: new Date().getFullYear(),
        }
    }

    componentDidMount() {
        const { year } = this.state;
        this.props.getListHoliday({ year: year });
        this.props.getNumberAnnaulLeave({ numberAnnulLeave: true });
    }

    /**
    * Function format ngày hiện tại thành dạnh dd/mm/yyyy
    * @param {*} date : Ngày muốn format
    */
    formatDate(date) {
        if (date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;
            return [day, month, year].join('/');
        }
        return date;
    }

    // /**
    //  * Function format ngày hiện tại thành dạnh dd-mm-yyyy
    //  * @param {*} date : Ngày muốn format
    //  */
    // formatDate2(date) {
    //     if (date) {
    //         let d = new Date(date),
    //             month = '' + (d.getMonth() + 1),
    //             day = '' + d.getDate(),
    //             year = d.getFullYear();

    //         if (month.length < 2)
    //             month = '0' + month;
    //         if (day.length < 2)
    //             day = '0' + day;
    //         return [day, month, year].join('-');
    //     }
    //     return date;
    // }


    render() {
        const { translate, holiday, annualLeave } = this.props;

        let holidays = [], numberDateLeaveOfYear = 0;
        if (holiday.listHoliday && holiday.listHoliday.length !== 0) {
            holidays = holiday.listHoliday;
            numberDateLeaveOfYear = holiday.numberDateLeaveOfYear;
        };
        return (
            <div className="row qlcv">
                <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12' style={{ padding: 0 }}>
                    <div className='col-lg-8 col-md-7 col-sm-12 col-xs-12'>
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <h3 className="box-title">{translate('human_resource.annual_leave_personal.list_annual_leave')}</h3>
                            </div>
                            <div className="box-body">
                                <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }}>
                                    <thead>
                                        <tr>
                                            <th style={{ width: 40 }}>{translate('human_resource.stt')}</th>
                                            <th>{translate('human_resource.holiday.table.timeline')}</th>
                                            <th>{translate('human_resource.holiday.table.describe_timeline')}</th>
                                            <th>{translate('human_resource.annual_leave_personal.note')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {holidays && holidays.length !== 0 &&
                                            holidays.map((x, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{(this.formatDate(x.startDate) === this.formatDate(x.endDate)) ? this.formatDate(x.startDate) : this.formatDate(x.startDate) + " - " + this.formatDate(x.endDate)}</td>
                                                    <td>{x.description}</td>
                                                    <td>{translate(`human_resource.holiday.${x.type}`)}</td>
                                                </tr>)
                                            )}
                                    </tbody>
                                </table>
                                {
                                    holiday.isLoading ?
                                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                                        (!holidays || holidays.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-4 col-md-5 col-sm-12 col-xs-12'>
                        <div className="box box-success">
                            <div className="box-header with-border">
                                <h3 className="box-title">{translate('human_resource.annual_leave_personal.inform_annual_leave')}</h3>
                            </div>
                            <div className="box-body">
                                <p><span>{`${translate('human_resource.annual_leave_personal.total_number_leave_of_year')}: ${numberDateLeaveOfYear} ngày`}</span></p>
                                <p><span>{`${translate('human_resource.annual_leave_personal.leaved')}: ${annualLeave.numberAnnulLeave} ngày`}</span></p>
                                <p><span className="text-danger">{`( ${translate('human_resource.annual_leave_personal.view_detail')} "${translate('menu.detail_employee')}")`}</span></p>
                                <AnnualLeaveApplicationForm />
                            </div>
                        </div>

                    </div>
                </div>
            </div >
        );
    }
};

function mapState(state) {
    const { holiday, annualLeave } = state;
    return { holiday, annualLeave };
};

const actionCreators = {
    getListHoliday: HolidayActions.getListHoliday,
    getNumberAnnaulLeave: AnnualLeaveActions.searchAnnualLeaves,
};

const annualLeave = connect(mapState, actionCreators)(withTranslate(AnnualLeave));
export { annualLeave as AnnualLeave };