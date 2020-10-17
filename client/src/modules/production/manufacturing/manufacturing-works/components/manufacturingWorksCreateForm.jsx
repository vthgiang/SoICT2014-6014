import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { ButtonModal, DialogModal } from '../../../../../common-components';

class ManufacturingWorksCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        const { translate } = this.props;
        return (
            <React.Fragment>
                <ButtonModal modalID="modal-create-works" button_name={translate('manufacturing.manufacturing_works.create_works')} title={translate('manufacturing.manufacturing_works.create_works')} />
                <DialogModal
                    modalID="modal-create-works" isLoading={false}
                    formID="form-create-works"
                    title="Thêm nhà máy sản xuất"
                    // msg_success={translate('manage_plan.add_success')}
                    // msg_faile={translate('manage_plan.add_fail')}
                    // func={this.save}
                    // disableSubmit={!this.isFormValidated()}
                    size={50}
                    maxWidth={500}
                >
                    <form id="form-create-works">
                        <div className="form-group">
                            <label>Mã nhà máy<span className="text-red">*</span></label>
                            <input type="text" className="form-control"></input>
                        </div>
                        <div className="form-group">
                            <label>Tên nhà máy<span className="text-red">*</span></label>
                            <input type="text" className="form-control"></input>
                        </div>
                        <div className="form-group">
                            <label>Giám đốc nhà máy<span className="text-red">*</span></label>
                            <input type="text" className="form-control"></input>
                        </div>
                        <div className="form-group">
                            <label>Quản đốc<span className="text-red">*</span></label>
                            <input type="text" className="form-control"></input>
                        </div>
                        <div className="form-group">
                            <label>Xưởng sản xuất<span className="text-red">*</span></label>
                            <input type="text" className="form-control"></input>
                        </div>
                        <div className="form-group">
                            <label>Số điện thoại<span className="text-red">*</span></label>
                            <input type="text" className="form-control"></input>
                        </div>
                        <div className="form-group">
                            <label>Địa chỉ<span className="text-red">*</span></label>
                            <input type="text" className="form-control"></input>
                        </div>
                        <div className="form-group">
                            <label>Trạng thái<span className="text-red">*</span></label>
                            <input type="text" className="form-control"></input>
                        </div>
                        <div className="form-group">
                            <label>Mô tả</label>
                            <input type="text" className="form-control"></input>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment >
        );
    }
}

export default withTranslate(ManufacturingWorksCreateForm);