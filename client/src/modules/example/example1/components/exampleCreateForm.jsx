import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ErrorLabel } from '../../../../common-components';
import ValidationHelper from '../../../../helpers/validationHelper';

import { exampleActions } from '../redux/actions';

class ExampleCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            exampleName: "",
            description: "",
            exampleNameError: {
                message: undefined,
                status: true
            }
        }
    }

    /**
     * Hàm dùng để kiểm tra xem form đã được validate hay chưa
     */
    isFormValidated = () => {
        const { exampleNameError } = this.state;
        if (!exampleNameError.status) {
            return false;
        }
        return true;
    }


    /**
     * Hàm dùng để lưu thông tin của form và gọi service tạo mới ví dụ
     */
    save = () => {
        if (this.isFormValidated()) {
            const { page, perPage } = this.props;
            const { exampleName, description } = this.state;

            if (exampleName) {
                this.props.createExample([{ exampleName, description }]);
                this.props.getExamples({
                    exampleName: "",
                    page: page,
                    perPage: perPage
                })
            }
        }
    }


    /**
     * Hàm xử lý khi tên ví dụ thay đổi
     * @param {*} e 
     */
    handleExampleName = (e) => {
        const { value } = e.target;
        let { translate } = this.props;

        let result = ValidationHelper.validateName(translate, value, 6, 255);
        this.setState(state => {
            return {
                ...state,
                exampleName: value,
                exampleNameError: result
            }
        })
    }


    /**
     * Hàm xử lý khi mô tả ví dụ thay đổi
     * @param {*} e 
     */
    handleExampleDescription = (e) => {
        const { value } = e.target;
        this.setState({
            description: value
        });
    }

    render() {
        const { translate, example } = this.props;
        const { exampleName, description, exampleNameError } = this.state;

        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-create-example" isLoading={example.isLoading}
                    formID="form-create-example"
                    title={translate('manage_example.add_title')}
                    msg_success={translate('manage_example.add_success')}
                    msg_faile={translate('manage_example.add_fail')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                    size={50}
                    maxWidth={500}
                >
                    <form id="form-create-example" onSubmit={() => this.save(translate('manage_example.add_success'))}>
                        {/* Tên ví dụ */}
                        <div className={`form-group ${exampleNameError.status ? "" : "has-error"}`}>
                            <label>{translate('manage_example.exampleName')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" value={exampleName} onChange={this.handleExampleName}></input>
                            <ErrorLabel content={exampleNameError.message} />
                        </div>

                        {/* Mô tả ví dụ */}
                        <div className={`form-group`}>
                            <label>{translate('manage_example.example_description')}</label>
                            <input type="text" className="form-control" value={description} onChange={this.handleExampleDescription}></input>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const example = state.example1;
    return { example }
}

const mapDispatchToProps = {
    createExample: exampleActions.createExample,
    getExamples: exampleActions.getExamples,
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ExampleCreateForm)); 