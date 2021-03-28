import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ButtonModal, DatePicker, DialogModal, ErrorLabel, SelectBox, UploadFile } from '../../../../../common-components';
import { generateCode } from "../../../../../helpers/generateCode";
import { convertJsonObjectToFormData } from '../../../../../helpers/jsonObjectToFormDataObjectConverter';

import { UserActions } from '../../../../super-admin/user/redux/actions';
import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions';
import { RecommendProcureActions } from '../redux/actions';

import ValidationHelper from '../../../../../helpers/validationHelper';

class PurchaseRequestCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recommendNumber: "",
            dateCreate: this.formatDate(new Date()),
            equipmentName: "",
            supplier: "",
            total: "",
            unit: "",
            estimatePrice: "",
            status: "waiting_for_approval",
            approver: [],
            note: "",
            recommendUnits: "",
        };
    }

    // Function format ngày hiện tại thành dạnh dd-mm-yyyy
    formatDate = (date) => {
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

    // Bắt sự kiện thay đổi mã phiếu
    handleRecommendNumberChange = (e) => {
        const { value } = e.target;
        this.setState({
            recommendNumber: value,
        })
    }

    regenerateCode = () => {
        let code = generateCode("DNMS");
        this.setState((state) => ({
            ...state,
            recommendNumber: code,
        }));
    }

    // Bắt sự kiện thay đổi "Ngày lập"
    handleDateCreateChange = (value) => {
        this.validateDateCreate(value, true);
    }
    validateDateCreate = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(this.props.translate, value);

        if (willUpdateState) {
            this.setState({
                errorOnDateCreate: message,
                dateCreate: value
            });
        }
        return message === undefined;
    }

    /**
     * Bắt sự kiện thay đổi người đề nghị
     */
    handleProponentChange = (value) => {
        this.setState({
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
    // Bắt sự kiện thay đổi "Giá trị dự tính"
    handleEstimatePriceChange = (e) => {
        let value = e.target.value;
        this.setState({
            ...this.state,
            estimatePrice: value
        })
    }

    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    isFormValidated = () => {
        const { equipmentName, total, unit, recommendNumber, approver } = this.state;
        let result = this.validateEquipment(equipmentName, false) &&
            this.validateTotal(total, false) &&
            this.validateUnit(unit, false) &&
            this.validateApprover(approver, false)
        return result;
    }

    componentDidMount = () => {
        this.props.getAllDepartments();
        this.props.getRoleSameDepartment(localStorage.getItem("currentRole"));
        this.props.getUserApprover();
        // Mỗi khi modal mở, cần sinh lại code
        window.$('#modal-create-recommendprocure').on('shown.bs.modal', this.regenerateCode)
    }

    componentWillUnmount = () => {
        // Unsuscribe event
        window.$('#modal-create-recommendprocure').unbind('shown.bs.modal', this.regenerateCode)
    }

    handleChangeFile = (file) => {
        const recommendFiles = file.map(x => ({
            url: x.urlFile,
            fileUpload: x.fileUpload
        }))

        this.setState({
            recommendFiles,
        });
    }

    handleRecommendUnits = (value) => {
        this.setState({
            recommendUnits: value
        })
    }

    // Bắt sự kiện submit form
    save = () => {
        const { recommendFiles } = this.state;
        let dataToSubmit = { ...this.state, proponent: this.props.auth.user._id }
        let { dateCreate } = this.state;
        let dateData = dateCreate.split("-");
        let formData;

        dataToSubmit = {
            ...dataToSubmit,
            dateCreate: new Date(`${dateData[2]}-${dateData[1]}-${dateData[0]}`)
        }
        formData = convertJsonObjectToFormData(dataToSubmit);
        if (recommendFiles) {
            recommendFiles.forEach(obj => {
                formData.append('recommendFiles', obj.fileUpload)
            })
        }
        if (this.isFormValidated()) {
            return this.props.createRecommendProcure(formData);
        }
    }

    static getDerivedStateFromProps(props, state) {
        const { user } = props;
        let { recommendUnits } = state;
        if (!recommendUnits && user && user.roledepartments) {
            const recommendUnits = [user.roledepartments._id];
            return {
                ...state,
                recommendUnits,
            }
        } else {
            return null;
        }
    }

    render() {
        const { _id, translate, recommendProcure, user, auth, department } = this.props;
        const {
            recommendNumber, dateCreate, equipmentName, equipmentDescription, supplier, total, unit, estimatePrice, recommendUnits, approver,
            errorOnEquipment, errorOnEquipmentDescription, errorOnTotal, errorOnUnit, errorOnApprover
        } = this.state;
        var userlist = recommendProcure && recommendProcure.listuser ? recommendProcure.listuser : [];
        const departmentlist = department.list && department.list.map(obj => ({ value: obj._id, text: obj.name }));
        return (
            <React.Fragment>
                <ButtonModal modalID="modal-create-recommendprocure" button_name={translate('asset.general_information.add')} title={translate('asset.manage_recommend_procure.add_recommend_card')} />
                <DialogModal
                    size='50' modalID="modal-create-recommendprocure" isLoading={recommendProcure.isLoading}
                    formID="form-create-recommendprocure"
                    title={translate('asset.manage_recommend_procure.add_recommend_card')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    {/* Form thêm mới phiếu đề nghị mua sắm thiết bị */}
                    <form className="form-group" id="form-create-recommendprocure">
                        <div className="col-md-12">

                            <div className="col-sm-6">
                                {/* Mã phiếu */}
                                <div className={`form-group`}>
                                    <label>{translate('asset.general_information.form_code')}</label>
                                    <input type="text" className="form-control" name="recommendNumber" value={recommendNumber} onChange={this.handleRecommendNumberChange} autoComplete="off"
                                        placeholder="Mã phiếu" />
                                </div>

                                {/* Ngày lập */}
                                <div className="form-group">
                                    <label>{translate('asset.general_information.create_date')}<span className="text-red">*</span></label>
                                    <DatePicker
                                        id="create_start_date"
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
                                                id={`add-proponent${_id}`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                items={userlist && userlist.map(x => {
                                                    return { value: x._id, text: x.name + " - " + x.email }
                                                })}
                                                onChange={this.handleProponentChange}
                                                value={auth.user._id}
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
                                <div className={`form-group ${errorOnEquipment === undefined ? "" : "has-error"}`}>
                                    <label>{translate('asset.manage_recommend_procure.asset_recommend')}<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="equipmentName" value={equipmentName} onChange={this.handleEquipmentChange} autoComplete="off" placeholder="Thiết bị đề nghị mua" />
                                    <ErrorLabel content={errorOnEquipment} />
                                </div>

                                {/* Mô tả thiết bị đề nghị mua */}
                                <div className={`form-group ${errorOnEquipmentDescription === undefined ? "" : "has-error"}`}>
                                    <label>{translate('asset.manage_recommend_procure.equipment_description')}</label>
                                    <textarea className="form-control" rows="3" name="equipmentDescription" value={equipmentDescription} onChange={this.handleEquipmentDescriptionChange} autoComplete="off"
                                        placeholder="Thiết bị đề nghị mua"></textarea>
                                    <ErrorLabel content={errorOnEquipmentDescription} />
                                </div>
                            </div>

                            <div className="col-sm-6">
                                {/* Nhà cung cấp */}
                                <div className="form-group">
                                    <label>{translate('asset.manage_recommend_procure.supplier')}</label>
                                    <input type="text" className="form-control" name="supplier" value={supplier} onChange={this.handleSupplierChange} autoComplete="off" placeholder="Nhà cung cấp" />
                                </div>

                                {/* Số lượng */}
                                <div className={`form-group ${errorOnTotal === undefined ? "" : "has-error"}`}>
                                    <label>{translate('asset.general_information.number')}<span className="text-red">*</span></label>
                                    <input type="number" className="form-control" name="total" value={total} onChange={this.handleTotalChange} autoComplete="off" placeholder="Số lượng" />
                                    <ErrorLabel content={errorOnTotal} />
                                </div>

                                {/* Đơn vị tính */}
                                <div className={`form-group ${errorOnUnit === undefined ? "" : "has-error"}`}>
                                    <label>{translate('asset.manage_recommend_procure.unit')}<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="unit" value={unit} onChange={this.handleUnitChange} autoComplete="off" placeholder="Đơn vị tính" />
                                    <ErrorLabel content={errorOnUnit} />
                                </div>

                                {/* Giá trị dự tính */}
                                <div className="form-group">
                                    <label>{translate('asset.manage_recommend_procure.expected_value')} (VNĐ)</label>
                                    <input type="number" className="form-control" name="estimatePrice" value={estimatePrice}
                                        onChange={this.handleEstimatePriceChange} autoComplete="off" placeholder="Giá trị dự tính" />
                                </div>

                                <div className="form-group">
                                    <label>{translate('human_resource.profile.attached_files')}</label>
                                    <UploadFile multiple={true} onChange={this.handleChangeFile} />
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
    const { recommendProcure, auth, user, department } = state;
    return { recommendProcure, auth, user, department };
};

const actionCreators = {
    getUser: UserActions.get,
    createRecommendProcure: RecommendProcureActions.createRecommendProcure,
    getUserApprover: RecommendProcureActions.getUserApprover,
    getAllDepartments: DepartmentActions.get,
    getRoleSameDepartment: UserActions.getRoleSameDepartment,
};

const createForm = connect(mapState, actionCreators)(withTranslate(PurchaseRequestCreateForm));
export { createForm as PurchaseRequestCreateForm };

