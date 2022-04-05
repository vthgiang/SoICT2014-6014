import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ButtonModal, DatePicker, DialogModal, ErrorLabel, SelectBox, UploadFile } from '../../../../../common-components';
import { generateCode } from "../../../../../helpers/generateCode";
import { convertJsonObjectToFormData } from '../../../../../helpers/jsonObjectToFormDataObjectConverter';

import { UserActions } from '../../../../super-admin/user/redux/actions';
import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions';
import { PurchaseRequestActions } from '../../../admin/purchase-request/redux/actions';

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
        suppliesName: "",
        supplier: "",
        total: "",
        unit: "",
        estimatePrice: "",
        status: "waiting_for_approval",
        approver: [],
        note: "",
        recommendUnits: "",
    })
    const { _id, translate, purchaseRequest, user, auth, department } = props;
    const {
        recommendNumber, dateCreate, suppliesName, suppliesDescription, supplier, total, unit, estimatePrice, recommendUnits, approver,
        errorOnSupplies, errorOnSuppliesDescription, errorOnTotal, errorOnUnit, errorOnApprover
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
        window.$('#modal-create-purchaserequest').on('shown.bs.modal', regenerateCode)
        return () => {
            window.$('#modal-create-purchaserequest').unbind('shown.bs.modal', regenerateCode);
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

    // Bắt sự kiện thay đổi "vật tư đề nghị mua"
    const handleSuppliesChange = (e) => {
        let value = e.target.value;
        validateSupplies(value, true);
    }
    const validateSupplies = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            setState(state => {
                return {
                    ...state,
                    errorOnSupplies: message,
                    suppliesName: value,
                }
            });
        }
        return message === undefined;
    }

    // Bắt sự kiện thay đổi "Mô tảvật tư đề nghị mua"
    const handleSuppliesDescriptionChange = (e) => {
        let value = e.target.value;
        validateSuppliesDescription(value, true);
    }
    const validateSuppliesDescription = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            setState(state => {
                return {
                    ...state,
                    errorOnSuppliesDescription: message,
                    suppliesDescription: value,
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
        const { suppliesName, total, unit, recommendNumber, approver } = state;
        let result = validateSupplies(suppliesName, false) &&
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
            return props.createPurchaseRequest(formData);
        }
    }
    console.log(auth.user._id)
    console.log(auth.user.id)
    return (
        <React.Fragment>
            <ButtonModal modalID="modal-create-purchaserequest" button_name={translate('supplies.general_information.add')} title={translate('supplies.general_information.add_recommend_card')} />
            <DialogModal
                size='50' modalID="modal-create-purchaserequest" isLoading={purchaseRequest.isLoading}
                formID="form-create-purchaserequest"
                title={translate('supplies.general_information.add_recommend_card')}
                func={save}
                disableSubmit={!isFormValidated()}
            >
                {/* Form thêm mới phiếu đề nghị mua sắm vật tư */}
                <form className="form-group" id="form-create-purchaserequest">
                    <div className="col-md-12">

                        <div className="col-sm-6">
                            {/* Mã phiếu */}
                            <div className={`form-group`}>
                                <label>{translate('supplies.purchase_request.recommendNumber')}</label>
                                <input type="text" className="form-control" name="recommendNumber" value={recommendNumber} onChange={handleRecommendNumberChange} autoComplete="off"
                                    placeholder="Mã phiếu" />
                            </div>

                            {/* Ngày lập */}
                            <div className="form-group">
                                <label>{translate('supplies.purchase_request.dateCreate')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id="create_start_date"
                                    value={dateCreate}
                                    onChange={handleDateCreateChange}
                                />
                            </div>

                            {/* Người đề nghị */}
                            <div className={`form-group`}>
                                <label>{translate('supplies.purchase_request.proponent')}</label>
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
                                <label>{translate('supplies.purchase_request.recommendUnits')}</label>
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

                            {/* vật tư đề nghị mua */}
                            <div className={`form-group ${errorOnSupplies === undefined ? "" : "has-error"}`}>
                                <label>{translate('supplies.purchase_request.suppliesName')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="suppliesName" value={suppliesName} onChange={handleSuppliesChange} autoComplete="off" placeholder="vật tư đề nghị mua" />
                                <ErrorLabel content={errorOnSupplies} />
                            </div>

                            {/* Mô tả vật tư đề nghị mua */}
                            <div className={`form-group ${errorOnSuppliesDescription === undefined ? "" : "has-error"}`}>
                                <label>{translate('supplies.purchase_request.suppliesDescription')}</label>
                                <textarea className="form-control" rows="3" name="equipmentDescription" value={suppliesDescription} onChange={handleSuppliesDescriptionChange} autoComplete="off"
                                    placeholder="vật tư đề nghị mua"></textarea>
                                <ErrorLabel content={errorOnSuppliesDescription} />
                            </div>
                        </div>

                        <div className="col-sm-6">
                            {/* Nhà cung cấp */}
                            <div className="form-group">
                                <label>{translate('supplies.purchase_request.supplier')}</label>
                                <input type="text" className="form-control" name="supplier" value={supplier} onChange={handleSupplierChange} autoComplete="off" placeholder="Nhà cung cấp" />
                            </div>

                            {/* Số lượng */}
                            <div className={`form-group ${errorOnTotal === undefined ? "" : "has-error"}`}>
                                <label>{translate('supplies.purchase_request.total')}<span className="text-red">*</span></label>
                                <input type="number" className="form-control" name="total" value={total} min="1" onChange={handleTotalChange} autoComplete="off" placeholder="Số lượng" />
                                <ErrorLabel content={errorOnTotal} />
                            </div>

                            {/* Đơn vị tính */}
                            <div className={`form-group ${errorOnUnit === undefined ? "" : "has-error"}`}>
                                <label>{translate('supplies.purchase_request.unit')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="unit" value={unit} onChange={handleUnitChange} autoComplete="off" placeholder="Đơn vị tính" />
                                <ErrorLabel content={errorOnUnit} />
                            </div>

                            {/* Giá trị dự tính */}
                            <div className="form-group">
                                <label>{translate('supplies.purchase_request.expected_value')} (VNĐ)</label>
                                <input type="number" className="form-control" name="estimatePrice" min="1" value={estimatePrice}
                                    onChange={handleEstimatePriceChange} autoComplete="off" placeholder="Giá trị dự tính" />
                            </div>

                            <div className="form-group">
                                <label>{translate('supplies.purchase_request.files')}</label>
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
    const { purchaseRequest, auth, user, department } = state;
    return { purchaseRequest, auth, user, department };
};

const actionCreators = {
    getUser: UserActions.get,
    createPurchaseRequest: PurchaseRequestActions.createPurchaseRequest,
    getUserApprover: PurchaseRequestActions.getUserApprover,
    getAllDepartments: DepartmentActions.get,
    getRoleSameDepartment: UserActions.getRoleSameDepartment,
};

const createForm = connect(mapState, actionCreators)(withTranslate(PurchaseRequestCreateForm));
export { createForm as PurchaseRequestCreateForm };

