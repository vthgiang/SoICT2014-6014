import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DatePicker, DialogModal, ErrorLabel, SelectBox, UploadFile } from '../../../../../common-components';

import { PurchaseRequestFromValidator } from '../../../user/purchase-request/components/PurchaseRequestFromValidator';

import { RecommendProcureActions } from '../../../user/purchase-request/redux/actions';
import { UserActions } from '../../../../super-admin/user/redux/actions';
import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions';
import { convertJsonObjectToFormData } from '../../../../../helpers/jsonObjectToFormDataObjectConverter';
import { getFormatDateFromTime } from '../../../../../helpers/stringMethod';

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
        let msg = PurchaseRequestFromValidator.validateRecommendNumber(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnRecommendNumber: msg,
                    recommendNumber: value,
                }
            });
        }
        return msg === undefined;
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
        let msg = PurchaseRequestFromValidator.validateEquipment(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnEquipment: msg,
                    equipmentName: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi "Mô tảThiết bị đề nghị mua"
    handleEquipmentDescriptionChange = (e) => {
        let value = e.target.value;
        this.validateEquipmentDescription(value, true);
    }
    validateEquipmentDescription = (value, willUpdateState = true) => {
        let msg = PurchaseRequestFromValidator.validateEquipmentDescription(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnEquipmentDescription: msg,
                    equipmentDescription: value,
                }
            });
        }
        return msg === undefined;
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
        let msg = PurchaseRequestFromValidator.validateTotal(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnTotal: msg,
                    total: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi "Đơn vị tính"
    handleUnitChange = (e) => {
        let value = e.target.value;
        this.validateUnit(value, true);
    }
    validateUnit = (value, willUpdateState = true) => {
        let msg = PurchaseRequestFromValidator.validateUnit(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnUnit: msg,
                    unit: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi "Giá trị dự tính"
    handleEstimatePriceChange = (e) => {
        let value = e.target.value;
        this.setState({
            ...this.state,
            estimatePrice: value
        })
    }

    //Bắt sự kiện thay đổi "Người phê duyệt"
    handleApproverChange = (value) => {
        this.setState({
            ...this.state,
            approver: value[0]
        });
    };

    // Bắt sự kiện thay đổi "Trạng thái"
    handleStatusChange = (value) => {
        this.setState({
            ...this.state,
            status: value[0]
        })
    }

    // Bắt sự kiện thay đổi "Ghi chú"
    handleNoteChange = (e) => {
        let value = e.target.value;
        this.setState({
            ...this.state,
            note: value
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

    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    isFormValidated = () => {
        const { recommendNumber, equipmentName, total, unit } = this.state;

        let result = this.validateEquipment(equipmentName, false) &&
            this.validateTotal(total, false) &&
            this.validateUnit(unit, false)

        return result;
    };

    save = () => {
        let { dateCreate, recommendFiles, oldFiles, files } = this.state;
        let slitDateCreate, dateCreateConvert;
        if (dateCreate) {
            slitDateCreate = dateCreate.split('-');
            dateCreateConvert = new Date([slitDateCreate[2], slitDateCreate[1], slitDateCreate[0]].join('-'))
        }
        if (!recommendFiles && !oldFiles) {
            oldFiles = files;
        }

        let dataToSubmit = { ...this.state, oldFiles, dateCreate: dateCreateConvert, approver: [this.props.auth.user._id] };
        if (this.isFormValidated()) {
            let formData = convertJsonObjectToFormData(dataToSubmit);
            if (recommendFiles) {
                recommendFiles.forEach(obj => {
                    formData.append('recommendFiles', obj.fileUpload)
                })
            }
            return this.props.updateRecommendProcure(this.state._id, formData);
        }
    };

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
                dateCreate: getFormatDateFromTime(nextProps.dateCreate, 'dd-mm-yyyy'),
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

    componentDidMount = () => {
        this.props.getRoleSameDepartment(localStorage.getItem("currentRole"));
        this.props.getAllDepartments();
    }

    render() {
        const { _id, translate, recommendProcure, user, auth, department } = this.props;
        const {
            recommendNumber, dateCreate, proponent, equipmentName, equipmentDescription, supplier, total, unit, estimatePrice, approver, status, note, recommendUnits, files,
            errorOnEquipment, errorOnEquipmentDescription, errorOnTotal, errorOnUnit, errorOnRecommendNumber
        } = this.state;

        var userlist = user.list;
        const departmentlist = department.list && department.list.map(obj => ({ value: obj._id, text: obj.name }));
        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID="modal-edit-recommendprocuremanage" isLoading={recommendProcure.isLoading}
                    formID="form-edit-recommendprocuremanage"
                    title={translate('asset.manage_recommend_procure.edit_recommend_card')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    {/* Form chỉnh sửa phiếu đăng ký mua sắm tài sản */}
                    <form className="form-group" id="form-edit-recommendprocure">
                        <div className="col-md-12">

                            <div className="col-sm-6">
                                {/* Mã phiếu */}
                                <div className={`form-group`}>
                                    <label>{translate('asset.general_information.form_code')}</label>
                                    <input type="text" className="form-control" name="recommendNumber" value={recommendNumber ? recommendNumber : ''} onChange={this.handleRecommendNumberChange} />
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
                                    <input type="text" className="form-control" name="equipmentName" value={equipmentName ? equipmentName : ''} onChange={this.handleEquipmentChange} autoComplete="off" placeholder="Thiết bị đề nghị mua" />
                                    <ErrorLabel content={errorOnEquipment} />
                                </div>

                                {/* Nhà cung cấp */}
                                <div className="form-group">
                                    <label>{translate('asset.manage_recommend_procure.supplier')}</label>
                                    <input type="text" className="form-control" name="supplier" value={supplier ? supplier : ""} onChange={this.handleSupplierChange} />
                                </div>

                                {/* Mô tả thiết bị đề nghị mua */}
                                <div className={`form-group ${errorOnEquipmentDescription === undefined ? "" : "has-error"}`}>
                                    <label>{translate('asset.manage_recommend_procure.equipment_description')}</label>
                                    <textarea className="form-control" rows="3" name="equipmentDescription" value={equipmentDescription ? equipmentDescription : ''} onChange={this.handleEquipmentDescriptionChange} autoComplete="off"
                                        placeholder="Thiết bị đề nghị mua"></textarea>
                                    <ErrorLabel content={errorOnEquipmentDescription} />
                                </div>
                            </div>

                            <div className="col-sm-6">
                                {/* Số lượng */}
                                <div className={`form-group ${errorOnTotal === undefined ? "" : "has-error"}`}>
                                    <label>{translate('asset.general_information.number')}<span className="text-red">*</span></label>
                                    <input type="number" className="form-control" name="total" value={total ? total : ''} onChange={this.handleTotalChange} />
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

                                {/* Người phê duyệt */}
                                <div className={`form-group`}>
                                    <label>{translate('asset.usage.accountable')}</label>
                                    <div>
                                        <div id="approver">
                                            <SelectBox
                                                id={`approver${_id}`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                items={userlist.map(x => {
                                                    return { value: x._id, text: x.name + " - " + x.email }
                                                })}
                                                onChange={this.handleApproverChange}
                                                value={approver}
                                                multiple={true}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Trạng thái */}
                                <div className="form-group">
                                    <label>{translate('asset.general_information.status')}</label>
                                    <SelectBox
                                        id={`status${_id}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={status}
                                        items={[
                                            { value: 'approved', text: translate('asset.usage.approved') },
                                            { value: 'waiting_for_approval', text: translate('asset.usage.waiting_approval') },
                                            { value: 'disapproved', text: translate('asset.usage.not_approved') },
                                        ]}
                                        onChange={this.handleStatusChange}
                                    />
                                </div>

                                {/* Ghi chú */}
                                <div className="form-group">
                                    <label>{translate('asset.usage.note')}</label>
                                    <textarea className="form-control" rows="3" name="note" value={note ? note : ''} onChange={this.handleNoteChange}></textarea>
                                </div>

                                {/* tài liệu đính kèm */}
                                <div className="form-group">
                                    <label>{translate('human_resource.profile.attached_files')}</label>
                                    <UploadFile multiple={true} onChange={this.handleChangeFile} files={files} sendDataAfterDelete={true} />
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
    const { recommendProcure, user, auth, department } = state;
    return { recommendProcure, user, auth, department };
};

const actionCreators = {
    getUser: UserActions.get,
    updateRecommendProcure: RecommendProcureActions.updateRecommendProcure,
    getRoleSameDepartment: UserActions.getRoleSameDepartment,
    getAllDepartments: DepartmentActions.get,
};

const editRecommendProcureManager = connect(mapState, actionCreators)(withTranslate(PurchaseRequestEditForm));
export { editRecommendProcureManager as PurchaseRequestEditForm };
