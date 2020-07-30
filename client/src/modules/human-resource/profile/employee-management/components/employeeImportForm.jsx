import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { EmployeeGeneralInforImportForm, EmployeeExperienceImportForm } from './combinedContent';
import { DialogModal } from '../../../../../common-components';

class EmployeeImportForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal_import_file`} isLoading={false}
                    formID={`form_import_file`}
                    title='Thêm dữ liệu bằng việc Import file excel'
                    hasSaveButton={false}
                    hasNote={false}
                    size={75}
                >
                    <form className="form-group" id={`form_import_file`}>
                        <div className="nav-tabs-custom row" style={{ marginTop: '-15px' }} >
                            <ul className="nav nav-tabs">
                                <li className="active"><a title="Thông tin nhân viên" data-toggle="tab" href="#import_employee_general_infor">Thông tin cơ bản</a></li>
                                <li><a title="Kinh nghiệm làm việc" data-toggle="tab" href="#import_employee_experience">Kinh nghiệm làm việc</a></li>

                            </ul>
                            < div className="tab-content">
                                <EmployeeGeneralInforImportForm
                                    id="import_employee_general_infor"
                                />
                                <EmployeeExperienceImportForm
                                    id="import_employee_experience"
                                />
                            </div>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        )
    }
}
const importExcel = connect(null, null)(withTranslate(EmployeeImportForm));
export { importExcel as EmployeeImportForm };