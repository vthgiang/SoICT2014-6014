import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal } from '../../../common-components';

class ViewAllEmployee extends Component {
    constructor(props) {
        super(props);
    };

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
    };

    render() {
        const { translate } = this.props;
        const { dataEmployee, title, viewAll = false } = this.props;

        return (
            <React.Fragment>
                <DialogModal
                    size='75' modalID={'modal-view-all-employee'} isLoading={false}
                    formID={`form-view-all-employee`}
                    title={title}
                    hasSaveButton={false}
                    hasNote={false}
                >
                    <form className="form-group" id={`form-view-all-employee`}>
                        <table className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th className="col-fixed" style={{ width: 80 }}>STT</th>
                                    <th>Họ và tên</th>
                                    <th>Giới tính</th>
                                    <th>Ngày sinh</th>
                                    <th>Trình độ chuyên môn</th>
                                    <th>Tình trạng làm việc</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    dataEmployee && dataEmployee.length !== 0 &&
                                    dataEmployee.map((x, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{x.fullName}</td>
                                            <td>{translate(`human_resource.profile.${x.gender}`)}</td>
                                            <td>{this.formatDate(x.birthdate, false)}</td>
                                            <td>{translate(`human_resource.profile.${x.professionalSkill}`)}</td>
                                            <td>{translate(`human_resource.profile.${x.status}`)}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

const viewAllEmployee = connect(null, null)(withTranslate(ViewAllEmployee));
export { viewAllEmployee as ViewAllEmployee };