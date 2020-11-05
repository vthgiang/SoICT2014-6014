import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal } from '../../../common-components';

class ViewAllEmployee extends Component {
    constructor(props) {
        super(props);
    };

    render() {
        const { translate } = this.props;
        const { dataEmployee, title } = this.props;

        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID={'modal-view-all-employee'} isLoading={false}
                    formID={`form-view-all-employee`}
                    title={title}
                    hasSaveButton={false}
                    hasNote={false}
                >
                    <form className="form-group" id={`form-view-all-employee`}>
                        <table className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Họ và tên</th>
                                    <th>Giới tính</th>
                                    <th>Trình độ chuyên môn</th>
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
                                            <td>{translate(`human_resource.profile.${x.professionalSkill}`)}</td>
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