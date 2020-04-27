import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, ErrorLabel, DatePicker } from '../../../../common-components';
import { AssetTypeFromValidator } from './AssetTypeFromValidator';
import { AssetTypeActions } from '../redux/actions';
class AssetTypeCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            typeNumber: "",
            typeName: "",
            timeDepreciation: "",
            parent: "",
            description: "",
        };
    }

    /**
     * Bắt sự kiện thay đổi mã loại tài sản
     */
    handleTypeNumberChange = (e) => {
        let value = e.target.value;
        this.validateTypeNumber(value, true);
    }
    validateTypeNumber = (value, willUpdateState = true) => {
        let msg = AssetTypeFromValidator.validateTypeNumber(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnTypeNumber: msg,
                    typeNumber: value,
                }
            });
        }
        return msg === undefined;
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
        let result =
            this.validateTypeNumber(this.state.typeNumber, false) &&
            this.validateTypeName(this.state.typeName, false);
        return result;
    }
    /**
     * Bắt sự kiện submit form
     */
    save = () => {
        if (this.isFormValidated()) {
            return this.props.createAssetType(this.state);
        }
    }
    render() {
        const { translate, assetType } = this.props;
        const { typeNumber, typeName, timeDepreciation, parent, description,
            errorOnTypeNumber, errorOnTypeName } = this.state;
        return (
            <React.Fragment>
                <ButtonModal modalID="modal-create-assettype" button_name="Thêm mới " title="Thêm mới loại tài sản" />
                <DialogModal
                    size='50' modalID="modal-create-assettype" isLoading={assetType.isLoading}
                    formID="form-create-assettype"
                    title="Thêm mới loại tài sản"
                    msg_success="{translate('modal.add_success')}"
                    msg_faile={translate('modal.add_faile')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id="form-create-assettype">
                        <div className={`form-group ${errorOnTypeNumber === undefined ? "" : "has-error"}`}>
                            <label>Mã loại tài sản<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="typeNumber" value={typeNumber} onChange={this.handleTypeNumberChange} autoComplete="off" placeholder="Mã loại tài sản" />
                            <ErrorLabel content={errorOnTypeNumber} />
                        </div>
                        <div className={`form-group ${errorOnTypeName === undefined ? "" : "has-error"}`}>
                            <label>Tên loại tài sản<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="typeName" value={typeName} onChange={this.handleTypeNameChange} autoComplete="off" placeholder="Tên loại tài sản" />
                            <ErrorLabel content={errorOnTypeName} />
                        </div>
                        <div className="form-group">
                            <label>Thời gian khấu hao</label>
                            <input style={{ display: "inline", width: "93%" }} type="number" className="form-control" name="timeDepreciation" value={ timeDepreciation } onChange={this.handleTimeDepreciationChange} autoComplete="off" placeholder="Thời gian khấu hao" />
                            <label style={{ height: 34, display: "inline", width: "5%"}}> &nbsp; Năm</label>
                        </div>
                        <div className="form-group">
                            <label>Loại tài sản cha</label>
                            <input type="text" className="form-control" name="parent" value={parent} onChange={this.handleParentChange} autoComplete="off" placeholder="Loại tài sản cha" />
                        </div>
                        <div className="form-group">
                            <label>Mô tả</label>
                            <textarea className="form-control" rows="3" style={{ height: 34 }} name="description" value={description} onChange={this.handleDescriptionChange} autoComplete="off" placeholder="Mô tả"></textarea>
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
    createAssetType: AssetTypeActions.createAssetType
};

const createForm = connect(mapState, actionCreators)(withTranslate(AssetTypeCreateForm));
export { createForm as AssetTypeCreateForm };