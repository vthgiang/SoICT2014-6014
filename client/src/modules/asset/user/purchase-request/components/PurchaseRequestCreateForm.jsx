import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ButtonModal, DatePicker, DialogModal, ErrorLabel, SelectBox, UploadFile } from '../../../../../common-components';
import { generateCode } from "../../../../../helpers/generateCode";
import { convertJsonObjectToFormData } from '../../../../../helpers/jsonObjectToFormDataObjectConverter';

import { UserActions } from '../../../../super-admin/user/redux/actions';
import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions';
import { RecommendProcureActions } from '../redux/actions';

import ValidationHelper from '../../../../../helpers/validationHelper';

function PurchaseRequestCreateForm(props) {
    // Function format ngày hiện tại thành dạnh dd-mm-yyyy
    const formatDate = (date) => {
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
    const [state, setState] = useState({
        recommendNumber: "",
        dateCreate: formatDate(new Date()),
        equipmentName: "",
        supplier: "",
        total: "",
        unit: "",
        estimatePrice: "",
        status: "waiting_for_approval",
        approver: [],
        note: "",
        recommendUnits: "",
    })
    const { _id, translate, recommendProcure, user, auth, department } = props;
    const {
        recommendNumber, dateCreate, equipmentName, equipmentDescription, supplier, total, unit, estimatePrice, recommendUnits, approver,
        errorOnEquipment, errorOnEquipmentDescription, errorOnTotal, errorOnUnit, errorOnApprover
    } = state;
    var userlist = user.list
    const departmentlist = department.list && department.list.map(obj => ({ value: obj._id, text: obj.name }));

    const regenerateCode = () => {
        let code = generateCode("DNMS");
        setState((state) => ({
            ...state,
            recommendNumber: code,
        }));
    }
    useEffect(() => {
        props.getAllDepartments();
        props.getRoleSameDepartment(localStorage.getItem("currentRole"));
        props.getUserApprover();
        // Mỗi khi modal mở, cần sinh lại code
        window.$('#modal-create-recommendprocure').on('shown.bs.modal', regenerateCode)
        return () => {
            window.$('#modal-create-recommendprocure').unbind('shown.bs.modal', regenerateCode);
        }
    }, [])
    
    if (!recommendUnits && user && user.roledepartments) {
        const recommendUnits = [user.roledepartments._id];
        setState(state =>{
            return{
                ...state,
                recommendUnits,
            }
        })
    }   


    // Bắt sự kiện thay đổi mã phiếu
    const handleRecommendNumberChange = (e) => {
        const { value } = e.target;
        setState(state =>{
            return{
                ...state,
                recommendNumber: value,
            }
        })
    }


    // Bắt sự kiện thay đổi "Ngày lập"
    const handleDateCreateChange = (value) => {
        validateDateCreate(value, true);
    }
    const validateDateCreate = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            setState(state =>{
                return{
                    ...state,
                    errorOnDateCreate: message,
                    dateCreate: value
                }
            });
        }
        return message === undefined;
    }

    /**
     * Bắt sự kiện thay đổi người đề nghị
     */
    const handleProponentChange = (value) => {
        setState(state =>{
            return{
                ...state,
                proponent: value[0]
            }
        });
    }

    // Bắt sự kiện thay đổi "Thiết bị đề nghị mua"
    const handleEquipmentChange = (e) => {
        let value = e.target.value;
        validateEquipment(value, true);
    }
    const validateEquipment = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            setState(state => {
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
    const handleEquipmentDescriptionChange = (e) => {
        let value = e.target.value;
        validateEquipmentDescription(value, true);
    }
    const validateEquipmentDescription = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            setState(state => {
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
    const handleSupplierChange = (e) => {
        let value = e.target.value;
        setState(state =>{
            return {
                ...state,
                supplier: value
            }
        })
    }

    // Bắt sự kiện thay đổi "Số lượng"
    const handleTotalChange = (e) => {
        let value = e.target.value;
        validateTotal(value, true);
    }
    const validateTotal = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            setState(state => {
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
    const handleUnitChange = (e) => {
        let value = e.target.value;
        validateUnit(value, true);
    }
    const validateUnit = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            setState(state => {
                return {
                    ...state,
                    errorOnUnit: message,
                    unit: value,
                }
            });
        }
        return message === undefined;
    }

    const handleApproverChange = (value) => {
        validateApprover(value, true);
    }

    const validateApprover = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateArrayLength(props.translate, value);

        if (willUpdateState) {
            setState(state => {
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
    const handleEstimatePriceChange = (e) => {
        let value = e.target.value;
        setState(state =>{
            return {
                ...state,
                estimatePrice: value
            }
        })
    }

    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    const isFormValidated = () => {
        const { equipmentName, total, unit, recommendNumber, approver } = state;
        let result = validateEquipment(equipmentName, false) &&
            validateTotal(total, false) &&
            validateUnit(unit, false) &&
            validateApprover(approver, false)
        return result;
    }


    
    const handleChangeFile = (file) => {
        const recommendFiles = file.map(x => ({
            url: x.urlFile,
            fileUpload: x.fileUpload
        }))

        setState(state =>{
            return{
                ...state,
                recommendFiles,
            }
        });
    }

    const handleRecommendUnits = (value) => {
        setState(state =>{
            return{
                ...state,
                recommendUnits: value
            }
        })
    }

    // Bắt sự kiện submit form
    const save = () => {
        const { recommendFiles } = state;
        let dataToSubmit = { ...state, proponent: props.auth.user._id }
        let { dateCreate } = state;
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
        if (isFormValidated()) {
            return props.createRecommendProcure(formData);
        }
    }
    console.log(auth.user._id)
    console.log(auth.user.id)
    return (
        <React.Fragment>
            <ButtonModal modalID="modal-create-recommendprocure" button_name={translate('asset.general_information.add')} title={translate('asset.manage_recommend_procure.add_recommend_card')} />
            <DialogModal
                size='50' modalID="modal-create-recommendprocure" isLoading={recommendProcure.isLoading}
                formID="form-create-recommendprocure"
                title={translate('asset.manage_recommend_procure.add_recommend_card')}
                func={save}
                disableSubmit={!isFormValidated()}
            >
                {/* Form thêm mới phiếu đề nghị mua sắm thiết bị */}
                <form className="form-group" id="form-create-recommendprocure">
                    <div className="col-md-12">

                        <div className="col-sm-6">
                            {/* Mã phiếu */}
                            <div className={`form-group`}>
                                <label>{translate('asset.general_information.form_code')}</label>
                                <input type="text" className="form-control" name="recommendNumber" value={recommendNumber} onChange={handleRecommendNumberChange} autoComplete="off"
                                    placeholder="Mã phiếu" />
                            </div>

                            {/* Ngày lập */}
                            <div className="form-group">
                                <label>{translate('asset.general_information.create_date')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id="create_start_date"
                                    value={dateCreate}
                                    onChange={handleDateCreateChange}
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
                                            onChange={handleProponentChange}
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
                                                onChange={handleRecommendUnits}
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
                                <input type="text" className="form-control" name="equipmentName" value={equipmentName} onChange={handleEquipmentChange} autoComplete="off" placeholder="Thiết bị đề nghị mua" />
                                <ErrorLabel content={errorOnEquipment} />
                            </div>

                            {/* Mô tả thiết bị đề nghị mua */}
                            <div className={`form-group ${errorOnEquipmentDescription === undefined ? "" : "has-error"}`}>
                                <label>{translate('asset.manage_recommend_procure.equipment_description')}</label>
                                <textarea className="form-control" rows="3" name="equipmentDescription" value={equipmentDescription} onChange={handleEquipmentDescriptionChange} autoComplete="off"
                                    placeholder="Thiết bị đề nghị mua"></textarea>
                                <ErrorLabel content={errorOnEquipmentDescription} />
                            </div>
                        </div>

                        <div className="col-sm-6">
                            {/* Nhà cung cấp */}
                            <div className="form-group">
                                <label>{translate('asset.manage_recommend_procure.supplier')}</label>
                                <input type="text" className="form-control" name="supplier" value={supplier} onChange={handleSupplierChange} autoComplete="off" placeholder="Nhà cung cấp" />
                            </div>

                            {/* Số lượng */}
                            <div className={`form-group ${errorOnTotal === undefined ? "" : "has-error"}`}>
                                <label>{translate('asset.general_information.number')}<span className="text-red">*</span></label>
                                <input type="number" className="form-control" name="total" value={total} min="1" onChange={handleTotalChange} autoComplete="off" placeholder="Số lượng" />
                                <ErrorLabel content={errorOnTotal} />
                            </div>

                            {/* Đơn vị tính */}
                            <div className={`form-group ${errorOnUnit === undefined ? "" : "has-error"}`}>
                                <label>{translate('asset.manage_recommend_procure.unit')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="unit" value={unit} onChange={handleUnitChange} autoComplete="off" placeholder="Đơn vị tính" />
                                <ErrorLabel content={errorOnUnit} />
                            </div>

                            {/* Giá trị dự tính */}
                            <div className="form-group">
                                <label>{translate('asset.manage_recommend_procure.expected_value')} (VNĐ)</label>
                                <input type="number" className="form-control" name="estimatePrice" min="1" value={estimatePrice}
                                    onChange={handleEstimatePriceChange} autoComplete="off" placeholder="Giá trị dự tính" />
                            </div>

                            <div className="form-group">
                                <label>{translate('human_resource.profile.attached_files')}</label>
                                <UploadFile multiple={true} onChange={handleChangeFile} />
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
                                            onChange={handleApproverChange}
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

