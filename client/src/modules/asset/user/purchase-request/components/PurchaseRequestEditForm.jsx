import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ErrorLabel, DatePicker, SelectBox, UploadFile } from '../../../../../common-components';

import { RecommendProcureActions } from '../redux/actions';
import { UserActions } from '../../../../super-admin/user/redux/actions';
import { convertJsonObjectToFormData } from '../../../../../helpers/jsonObjectToFormDataObjectConverter';
import ValidationHelper from '../../../../../helpers/validationHelper';

class PurchaseRequestEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: "waiting_approval"
        };
    }

    // Bắt sự kiện thay đổi mã phiếu
    handleRecommendNumberChange = (e) => {
        let value = e.target.value;
        this.validateRecommendNumber(value, true);
    }
    validateRecommendNumber = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateCode(this.props.translate, value);

        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnRecommendNumber: message,
                    recommendNumber: value,
                }
            });
        }
        return message === undefined;
    }

    // Bắt sự kiện thay đổi "Ngày lập"
    handleDateCreateChange = (value) => {
        this.setState({
            ...this.state,
            dateCreate: value
        })
    }

    /**
     * Bắt sự kiện thay đổi người đề nghị
     */
    handleProponentChange = (value) => {
        this.setState({
            ...this.state,
            proponent: value[0]
        });
    }

    // Bắt sự kiện thay đổi "Thiết bị đề nghị mua"
    handleEquipmentChange = (e) => {
        let value = e.target.value;
        this.validateEquipment(value, true);
    }
    validateEquipment = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(this.props.translate, value);

        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnEquipment: message,
                    equipmentName: value,
                }
            });
        }
        return message === undefined;
    }

    // Bắt sự kiện thay đổi "Mô tảThiết bị đề nghị mua"
    handleEquipmentDescriptionChange = (e) => {
        let value = e.target.value;
        this.validateEquipmentDescription(value, true);
    }
    validateEquipmentDescription = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(this.props.translate, value);

        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnEquipmentDescription: message,
                    equipmentDescription: value,
                }
            });
        }
        return message === undefined;
    }

    // Bắt sự kiện thay đổi "Nhà cung cấp"
    handleSupplierChange = (e) => {
        let value = e.target.value;
        this.setState({
            ...this.state,
            supplier: value
        })
    }

    // Bắt sự kiện thay đổi "Số lượng"
    handleTotalChange = (e) => {
        let value = e.target.value;
        this.validateTotal(value, true);
    }
    validateTotal = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(this.props.translate, value);

        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnTotal: message,
                    total: value,
                }
            });
        }
        return message === undefined;
    }

    // Bắt sự kiện thay đổi "Đơn vị tính"
    handleUnitChange = (e) => {
        let value = e.target.value;
        this.validateUnit(value, true);
    }
    validateUnit = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(this.props.translate, value);

        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnUnit: message,
                    unit: value,
                }
            });
        }
        return message === undefined;
    }

    // Bắt sự kiện thay đổi "Giá trị dự tính"
    handleEstimatePriceChange = (e) => {
        let value = e.target.value;
        this.setState({
            ...this.state,
            estimatePrice: value
        })
    }

    handleRecommendUnits = (value) => {
        this.setState({
            ...this.state,
            recommendUnits: value
        })
    }

    handleChangeFile = (file) => {
        let newFiles = [], oldFiles = [], recommendFiles;
        if (file) {
            file.forEach(obj => {
                if (obj.urlFile) {
                    newFiles = [...newFiles, obj]
                } else {
                    oldFiles = [...oldFiles, obj]
                }
            })
        }

        if (newFiles && newFiles.length > 0) {
            recommendFiles = newFiles.map(x => ({
                url: x.urlFile,
                fileUpload: x.fileUpload
            }))
        }

        this.setState({
            recommendFiles,
            oldFiles,
        });
    }

    handleApproverChange = (value) => {
        this.validateApprover(value, true);
    }

    validateApprover = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(this.props.translate, value);

        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnApprover: message,
                    approver: value,
                }
            });
        }
        return message === undefined;
    }
    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    isFormValidated = () => {
        const { equipmentName, total, unit, recommendNumber, approver } = this.state;
        let result =
            this.validateEquipment(equipmentName, false) &&
            this.validateTotal(total, false) &&
            this.validateUnit(unit, false) &&
            this.validateApprover(approver, false)
        // &&this.validateRecommendNumber(recommendNumber, false);

        return result;
    }

    save = () => {
        if (this.isFormValidated()) {
            let { recommendFiles, oldFiles, files } = this.state;
            let data = this.state;
            if (data.dateCreate) {
                let dateData = data.dateCreate.split("-");
                data = {
                    ...data,
                    dateCreate: new Date(`${dateData[2]}-${dateData[1]}-${dateData[0]}`)
                }
            }
            if (!recommendFiles && !oldFiles) {
                oldFiles = files;
            }
            data = { ...data, oldFiles }

            let formData = convertJsonObjectToFormData(data);
            if (recommendFiles) {
                recommendFiles.forEach(obj => {
                    formData.append('recommendFiles', obj.fileUpload)
                })
            }
            return this.props.updateRecommendProcure(this.state._id, formData);
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            let approver = []
            if (nextProps.approver) {
                for (let i in nextProps.approver) {
                    approver.push(nextProps.approver[i]._id)
                }
            }
            return {
                ...prevState,
                _id: nextProps._id,
                recommendNumber: nextProps.recommendNumber,
                dateCreate: PurchaseRequestEditForm.formatDate(nextProps.dateCreate),
                proponent: nextProps.proponent,
                equipmentName: nextProps.equipmentName,
                equipmentDescription: nextProps.equipmentDescription,
                supplier: nextProps.supplier,
                total: nextProps.total,
                unit: nextProps.unit,
                estimatePrice: nextProps.estimatePrice,
                approver: approver,
                status: nextProps.status,
                note: nextProps.note,
                files: nextProps.files,
                recommendUnits: nextProps.recommendUnits ? nextProps.recommendUnits.map(obj => obj._id) : [],
                errorOnEquipment: undefined,
                errorOnTotal: undefined,
                errorOnUnit: undefined,
            }
        } else {
            return null;
        }
    }

    static formatDate = (date) => {
        if (!date) return null;
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) {
            month = '0' + month;
        }

        if (day.length < 2) {
            day = '0' + day;
        }

        return [day, month, year].join('-');
    }

    render() {
        const { _id, department } = this.props;
        const { translate, recommendProcure, user } = this.props;
        const { recommendNumber, dateCreate, proponent, equipmentName, equipmentDescription, supplier, total, unit, estimatePrice, recommendUnits, files, approver,
            errorOnEquipment, errorOnEquipmentDescription, errorOnTotal, errorOnUnit, errorOnRecommendNumber } = this.state;
        console.log("aaa", approver)
        var userlist = user.list;
        const departmentlist = department.list && department.list.map(obj => ({ value: obj._id, text: obj.name }));

        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID="modal-edit-recommendprocure" isLoading={recommendProcure.isLoading}
                    formID="form-edit-recommendprocure"
                    title={translate('asset.manage_recommend_procure.edit_recommend_card')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    {/* Form chỉnh sửa phiếu đề nghị mua sắm thiết bị */}
                    <form className="form-group" id="form-edit-recommendprocure">
                        <div className="col-md-12">

                            <div className="col-sm-6">
                                {/* Mã phiếu */}
                                <div className={`form-group `}>
                                    <label>{translate('asset.general_information.form_code')}</label>
                                    <input type="text" className="form-control" name="recommendNumber" value={recommendNumber} onChange={this.handleRecommendNumberChange} />
                                    {/* <ErrorLabel content={errorOnRecommendNumber} /> */}
                                </div>

                                {/* Ngày lập */}
                                <div className="form-group">
                                    <label>{translate('asset.general_information.create_date')}<span className="text-red">*</span></label>
                                    <DatePicker
                                        id={`edit_start_date${_id}`}
                                        value={dateCreate}
                                        onChange={this.handleDateCreateChange}
                                    />
                                </div>

                                {/* Người đề nghị */}
                                <div className={`form-group`}>
                                    <label>{translate('asset.usage.proponent')}</label>
                                    <div>
                                        <div id="proponentBox">
                                            <SelectBox
                                                id={`proponent${_id}`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                items={userlist.map(x => {
                                                    return { value: x._id, text: x.name + " - " + x.email }
                                                })}
                                                onChange={this.handleProponentChange}
                                                value={proponent ? proponent._id : null}
                                                multiple={false}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Đơn vị đề nghị */}
                                <div className={`form-group`}>
                                    <label>{translate('asset.usage.recommend_units')}</label>
                                    <div>
                                        <div id="recommend_units">
                                            {recommendUnits &&
                                                <SelectBox
                                                    id={`add-recommend_units${_id}`}
                                                    className="form-control select2"
                                                    style={{ width: "100%" }}
                                                    items={departmentlist}
                                                    onChange={this.handleRecommendUnits}
                                                    value={recommendUnits}
                                                    multiple={true}
                                                />
                                            }
                                        </div>
                                    </div>
                                </div>

                                {/* Thiết bị đề nghị mua */}
                                <div className={`form-group ${!errorOnEquipment ? "" : "has-error"}`}>
                                    <label>{translate('asset.manage_recommend_procure.asset_recommend')}<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="equipmentName" value={equipmentName ? equipmentName : ""} onChange={this.handleEquipmentChange} autoComplete="off" placeholder="Thiết bị đề nghị mua" />
                                    <ErrorLabel content={errorOnEquipment} />
                                </div>

                                {/* Mô tả thiết bị đề nghị mua */}
                                <div className={`form-group ${errorOnEquipmentDescription === undefined ? "" : "has-error"}`}>
                                    <label>{translate('asset.manage_recommend_procure.equipment_description')}</label>
                                    <textarea className="form-control" rows="3" name="equipmentDescription" value={equipmentDescription ? equipmentDescription : ""} onChange={this.handleEquipmentDescriptionChange} autoComplete="off"
                                        placeholder="Thiết bị đề nghị mua"></textarea>
                                    <ErrorLabel content={errorOnEquipmentDescription} />
                                </div>

                            </div>

                            <div className="col-sm-6">
                                {/* Nhà cung cấp */}
                                <div className="form-group">
                                    <label>{translate('asset.manage_recommend_procure.supplier')}</label>
                                    <input type="text" className="form-control" name="supplier" value={supplier ? supplier : ""} onChange={this.handleSupplierChange} />
                                </div>

                                {/* Số lượng */}
                                <div className={`form-group ${!errorOnTotal ? "" : "has-error"}`}>
                                    <label>{translate('asset.general_information.number')}<span className="text-red">*</span></label>
                                    <input type="number" className="form-control" name="total" value={total ? total : ""} onChange={this.handleTotalChange} />
                                    <ErrorLabel content={errorOnTotal} />
                                </div>

                                {/* Đơn vị tính */}
                                <div className={`form-group ${!errorOnUnit ? "" : "has-error"}`}>
                                    <label>{translate('asset.manage_recommend_procure.unit')}<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="unit" value={unit ? unit : ""} onChange={this.handleUnitChange} autoComplete="off" placeholder="Đơn vị tính" />
                                    <ErrorLabel content={errorOnUnit} />
                                </div>

                                {/* Giá trị dự tính */}
                                <div className="form-group">
                                    <label>{translate('asset.manage_recommend_procure.expected_value')} (VNĐ)</label>
                                    <input type="number" className="form-control" name="estimatePrice" value={estimatePrice ? estimatePrice : ""} onChange={this.handleEstimatePriceChange} />
                                </div>

                                <div className="form-group">
                                    <label>{translate('human_resource.profile.attached_files')}</label>
                                    < UploadFile multiple={true} onChange={this.handleChangeFile} files={files} sendDataAfterDelete={true} />
                                </div>

                                {/* Người phê duyệt */}
                                <div className={`form-group`}>
                                    <label>Người phê duyệt<span className="text-red">*</span></label>
                                    <div>
                                        {userlist &&
                                            <SelectBox
                                                id={`add-approver${_id}`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                items={userlist && userlist.map(x => {
                                                    return { value: x._id, text: x.name + " - " + x.email }
                                                })}
                                                onChange={this.handleApproverChange}
                                                value={approver}
                                                multiple={true}
                                                options={{ placeholder: "Chọn người phê duyệt" }}
                                            />
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
};

function mapState(state) {
    const { recommendProcure, user, department } = state;
    return { recommendProcure, user, department };
};

const actionCreators = {
    getUser: UserActions.get,
    updateRecommendProcure: RecommendProcureActions.updateRecommendProcure,
};

const editRecommendProcure = connect(mapState, actionCreators)(withTranslate(PurchaseRequestEditForm));
export { editRecommendProcure as PurchaseRequestEditForm };