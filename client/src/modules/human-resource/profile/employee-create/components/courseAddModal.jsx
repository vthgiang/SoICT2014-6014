import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ErrorLabel, DatePicker, ButtonModal } from '../../../../../common-components';

class CourseAddModal extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }
    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    isFormValidated = () => {
        // let result =
        //     this.validateEndDate(this.state.endDate, false) &&
        //     this.validateReason(this.state.reason, false) && this.validateStartDate(this.state.startDate, false);
        // return result;
    }

    // Bắt sự kiện submit form
    save = async () => {
        // if (this.isFormValidated()) {
        //     return null;
        // }
    }
    render() {
        const { translate, id } = this.props;
        //const { } = this.state;
        return (
            <React.Fragment>
                <ButtonModal modalID={`modal-create-course-${id}`} button_name={translate('modal.create')} title='Thêm mới khoá đào tạo' />
                <DialogModal
                    size='50' modalID={`modal-create-course-${id}`} isLoading={false}
                    formID={`form-create-course-${id}`}
                    title='Thêm mới khoá đào tạo'
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id={`form-create-course-${id}`}>
                        

                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
};

const addModal = connect(null, null)(withTranslate(CourseAddModal));
export { addModal as CourseAddModal };
