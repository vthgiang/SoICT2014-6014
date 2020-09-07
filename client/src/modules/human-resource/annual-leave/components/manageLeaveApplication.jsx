import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DeleteNotification } from '../../../../common-components';

import { AnnualLeaveActions } from '../redux/actions';


class ManageLeaveApplication extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: '',
            page: 0,
            limit: 10000000000
        }
    }

    componentDidMount() {
        this.props.searchAnnualLeaves(this.state);
    }

    /**
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
     */
    formatDate(date, monthYear = false) {
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

    }
    render() {
        const { translate, annualLeave } = this.props;

        const { currentRow } = this.state;

        let listAnnualLeaves = [];
        if (annualLeave.isLoading === false) {
            listAnnualLeaves = annualLeave.listAnnualLeaves;
        }

        return (
            <div className="box" >
                <div className="box-body qlcv">
                    <table className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>{translate('human_resource.staff_number')}</th>
                                <th>{translate('human_resource.staff_name')}</th>
                                <th>{translate('human_resource.annual_leave.table.start_date')}</th>
                                <th>{translate('human_resource.annual_leave.table.end_date')}</th>
                                <th>{translate('human_resource.annual_leave.table.reason')}</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>{translate('human_resource.annual_leave.table.action')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listAnnualLeaves && listAnnualLeaves.length !== 0 &&
                                listAnnualLeaves.map((x, index) => (
                                    <tr key={index}>
                                        <td>{x.employee.employeeNumber}</td>
                                        <td>{x.employee.fullName}</td>
                                        <td>{this.formatDate(x.startDate)}</td>
                                        <td>{this.formatDate(x.endDate)}</td>
                                        <td>{x.reason}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a onClick={() => this.handleEdit(x)} className="edit text-yellow" style={{ width: '5px' }} title={translate('human_resource.annual_leave.delete_annual_leave')}><i className="material-icons">edit</i></a>
                                            <DeleteNotification
                                                content={translate('human_resource.annual_leave.delete_annual_leave')}
                                                data={{
                                                    id: x._id,
                                                    info: this.formatDate(x.startDate).replace(/-/gi, "/") + " - " + this.formatDate(x.startDate).replace(/-/gi, "/")
                                                }}
                                                func={this.props.updateAnnualLeave}
                                            />
                                        </td>
                                    </tr>))
                            }
                        </tbody>
                    </table>
                    {annualLeave.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (!listAnnualLeaves || listAnnualLeaves.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                </div>
            </div >
        );
    }
};

function mapState(state) {
    const { annualLeave } = state;
    return { annualLeave };
};

const actionCreators = {
    searchAnnualLeaves: AnnualLeaveActions.searchAnnualLeaves,
    updateAnnualLeave: AnnualLeaveActions.updateAnnualLeave,
};

const leaveApplication = connect(mapState, actionCreators)(withTranslate(ManageLeaveApplication));
export { leaveApplication as ManageLeaveApplication };