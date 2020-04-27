import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, ErrorLabel, DatePicker } from '../../../../common-components';
import { AssetTypeFromValidator } from './AssetTypeFromValidator';
import { AssetTypeActions } from '../redux/actions';
class AssetTypeEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        // this.save = this.save.bind(this);
    }

    /**
     * Bắt sự kiện thay đổi tên loại tài sản
     */
    handleTypeNameChange = (e) => {
        let value = e.target.value;
        this.validateTypeName(value, true);
    }
    validateTypeName = (value, willUpdateState = true) => {
        let msg = AssetTypeFromValidator.validateTypeName(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnTypeName: msg,
                    typeName: value,
                }
            });
        }
        return msg === undefined;
    }

    /**
     * Bắt sự kiện thay đổi thời gian trích khấu hao
     */
    handleTimeDepreciationChange = (e) => {
        let value = e.target.value;
        this.setState({
            ...this.state,
            timeDepreciation: value
        })
    }

    /**
     * Bắt sự kiện thay đổi loại tài sản cha
     */
    handleParentChange = (e) => {
        let value = e.target.value;
        this.setState({
            ...this.state,
            parent: value
        })
    }

    /**
     * Bắt sự kiện thay đổi mô tả
     */
    handleDescriptionChange = (e) => {
        let value = e.target.value;
        this.setState({
            ...this.state,
            description: value
        })
    }

    /**
     * Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
     */
    isFormValidated = () => {
        let result = this.validateTypeName(this.state.typeName, false);
        return result;
    }
    /**
     * Bắt sự kiện submit form
     */
    save = () => {
        if (this.isFormValidated()) {
            return this.props.updateAssetType(this.state._id, this.state);
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps._id,
                typeNumber: nextProps.typeNumber,
                typeName: nextProps.typeName,
                timeDepreciation: nextProps.timeDepreciation,
                parent: nextProps.parent,
                description: nextProps.description,
                errorOnTypeName: undefined,
            }
        } else {
            return null;
        }
    }
    render() {
        const { translate, assetType } = this.props;
        const { typeNumber, typeName, timeDepreciation, parent, description,
                 errorOnTypeName } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID="modal-edit-assettype" isLoading={assetType.isLoading}
                    formID="form-edit-assettype"
                    title="Chỉnh sửa thông tin loại tài sản"
                    msg_success="Chỉnh sửa loại tài sản thành công"
                    msg_faile="Chỉnh sửa loại tài sản thất bại"
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id="form-edit-assettype">
                        <div className="form-group">
                            <label>Mã loại tài sản<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="typeNumber" value={typeNumber} disabled />
                        </div>
                        <div className={`form-group ${errorOnTypeName === undefined ? "" : "has-error"}`}>
                            <label>Tên loại tài sản<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="typeName" value={typeName} onChange={this.handleTypeNameChange} />
                            <ErrorLabel content={errorOnTypeName} />
                        </div>
                        <div className="form-group">
                            <label>Thời gian khấu hao</label>
                            <input style={{ display: "inline", width: "93%" }} type="number" className="form-control" name="timeDepreciation" value={ timeDepreciation } onChange={this.handleTimeDepreciationChange} />
                            <label style={{ height: 34, display: "inline", width: "5%"}}> &nbsp; Năm</label>
                        </div>
                        <div className="form-group">
                            <label>Loại tài sản cha</label>
                            <input type="text" className="form-control" name="parent" value={parent} onChange={this.handleParentChange} />
                        </div>
                        <div className="form-group">
                            <label>Mô tả</label>
                            <textarea className="form-control" rows="3" style={{ height: 34 }} name="description" value={description} onChange={this.handleDescriptionChange} ></textarea>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
};
function mapState(state) {
    const { assetType } = state;
    return { assetType };
};

const actionCreators = {
    updateAssetType: AssetTypeActions.updateAssetType,
};

const editAssetType = connect(mapState, actionCreators)(withTranslate(AssetTypeEditForm));
export { editAssetType as AssetTypeEditForm };