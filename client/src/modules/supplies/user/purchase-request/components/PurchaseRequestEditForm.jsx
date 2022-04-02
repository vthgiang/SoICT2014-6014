import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ErrorLabel, DatePicker, SelectBox, UploadFile } from '../../../../../common-components';

import { PurchaseRequestActions } from '../../../admin/purchase-request/redux/actions';
import { UserActions } from '../../../../super-admin/user/redux/actions';
import { convertJsonObjectToFormData } from '../../../../../helpers/jsonObjectToFormDataObjectConverter';
import ValidationHelper from '../../../../../helpers/validationHelper';

function PurchaseRequestEditForm(props) {
    const [state, setState] = useState({
        status: "waiting_approval"
    })
    const [prevProps, setPrevProps] = useState({
        _id:null,
    })
    const { _id, department } = props;
    const { translate, purchaseRequest, user } = props;
    const { recommendNumber, dateCreate, proponent, equipmentName, equipmentDescription, supplier, total, unit, estimatePrice, recommendUnits, files, approver,
        errorOnEquipment, errorOnEquipmentDescription, errorOnTotal, errorOnUnit, errorOnRecommendNumber } = state;
    var userlist = user.list;
    const departmentlist = department.list && department.list.map(obj => ({ value: obj._id, text: obj.name }));

    
        

    // Bắt sự kiện thay đổi mã phiếu
    const handleRecommendNumberChange = (e) => {
        let value = e.target.value;
        validateRecommendNumber(value, true);
    }
    const validateRecommendNumber = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateCode(props.translate, value);

        if (willUpdateState) {
            setState(state => {
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
    const handleDateCreateChange = (value) => {
        setState(state =>{
            return{
                ...state,
                dateCreate: value
            }
        })
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

    // Bắt sự kiện thay đổi "Vật tư đề nghị mua"
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

    // Bắt sự kiện thay đổi "Mô tả Vật tư đề nghị mua"
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
            return{
                ...state,
                upplier: value
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

    // Bắt sự kiện thay đổi "Giá trị dự tính"
    const handleEstimatePriceChange = (e) => {
        let value = e.target.value;
        setState(state =>{
            return{
                ...state,
                estimatePrice: value
            }
        })
    }

    const handleRecommendUnits = (value) => {
        setState(state =>{
            return{
                ...state,
                recommendUnits: value
            }
        })
    }

    const handleChangeFile = (file) => {
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

        setState(state =>{
            return{
                ...state,
                recommendFiles,
                oldFiles,
            }
        });
    }

    const handleApproverChange = (value) => {
        validateApprover(value, true);
    }

    const validateApprover = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

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
    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    const isFormValidated = () => {
        const { equipmentName, total, unit, recommendNumber, approver } = state;
        let result =
            validateEquipment(equipmentName, false) &&
            validateTotal(total, false) &&
            validateUnit(unit, false) &&
            validateApprover(approver, false)
        // &&validateRecommendNumber(recommendNumber, false);

        return result;
    }

    const save = () => {
        if (isFormValidated()) {
            let { recommendFiles, oldFiles, files } = state;
            let data = state;
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
            return props.updatePurchaseRequest(state._id, formData);
        }
    }
    if(props._id !== prevProps._id){
        let approver = []
        if(props.approver){
            for(let i in props.approver){
                approver.push(props.approver[i]._id)
            }
        }
        setState(state => {
            return{
                ...state,
                _id: props._id,
                recommendNumber: props.recommendNumber,
                dateCreate: formatDate(props.dateCreate),
                proponent: props.proponent,
                equipmentName: props.equipmentName,
                equipmentDescription: props.equipmentDescription,
                supplier: props.supplier,
                total: props.total,
                unit: props.unit,
                estimatePrice: props.estimatePrice,
                approver: approver,
                status: props.status,
                note: props.note,
                files: props.files,
                recommendUnits: props.recommendUnits ? props.recommendUnits.map(obj => obj._id) : [],
                errorOnEquipment: undefined,
                errorOnTotal: undefined,
                errorOnUnit: undefined,
                }
            })
        setPrevProps(props)
    }

        
    const  formatDate = (date) => {
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


    return (
        <React.Fragment>
            <DialogModal
                size='50' modalID="modal-edit-recommendprocure" isLoading={purchaseRequest.isLoading}
                formID="form-edit-recommendprocure"
                title={translate('supplies.general_information.edit_recommend_card')}
                func={save}
                disableSubmit={!isFormValidated()}
            >
                {/* Form chỉnh sửa phiếu đề nghị mua sắm Vật tư */}
                <form className="form-group" id="form-edit-recommendprocure">
                    <div className="col-md-12">

                        <div className="col-sm-6">
                            {/* Mã phiếu */}
                            <div className={`form-group `}>
                                <label>{translate('supplies.purchase_request.recommendNumber')}</label>
                                <input type="text" className="form-control" name="recommendNumber" value={recommendNumber} onChange={handleRecommendNumberChange} />
                                {/* <ErrorLabel content={errorOnRecommendNumber} /> */}
                            </div>

                            {/* Ngày lập */}
                            <div className="form-group">
                                <label>{translate('supplies.purchase_request.dateCreate')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`edit_start_date${_id}`}
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
                                            id={`proponent${_id}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={userlist.map(x => {
                                                return { value: x._id, text: x.name + " - " + x.email }
                                            })}
                                            onChange={handleProponentChange}
                                            value={proponent ? proponent._id : null}
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

                            {/* Vật tư đề nghị mua */}
                            <div className={`form-group ${!errorOnEquipment ? "" : "has-error"}`}>
                                <label>{translate('supplies.purchase_request.suppliesName')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="equipmentName" value={equipmentName ? equipmentName : ""} onChange={handleEquipmentChange} autoComplete="off" placeholder="Vật tư đề nghị mua" />
                                <ErrorLabel content={errorOnEquipment} />
                            </div>

                            {/* Mô tả Vật tư đề nghị mua */}
                            <div className={`form-group ${errorOnEquipmentDescription === undefined ? "" : "has-error"}`}>
                                <label>{translate('supplies.purchase_request.suppliesDescription')}</label>
                                <textarea className="form-control" rows="3" name="equipmentDescription" value={equipmentDescription ? equipmentDescription : ""} onChange={handleEquipmentDescriptionChange} autoComplete="off"
                                    placeholder="Vật tư đề nghị mua"></textarea>
                                <ErrorLabel content={errorOnEquipmentDescription} />
                            </div>

                        </div>

                        <div className="col-sm-6">
                            {/* Nhà cung cấp */}
                            <div className="form-group">
                                <label>{translate('supplies.purchase_request.supplier')}</label>
                                <input type="text" className="form-control" name="supplier" value={supplier ? supplier : ""} onChange={handleSupplierChange} />
                            </div>

                            {/* Số lượng */}
                            <div className={`form-group ${!errorOnTotal ? "" : "has-error"}`}>
                                <label>{translate('supplies.purchase_request.total')}<span className="text-red">*</span></label>
                                <input type="number" className="form-control" name="total" value={total ? total : ""} onChange={handleTotalChange} />
                                <ErrorLabel content={errorOnTotal} />
                            </div>

                            {/* Đơn vị tính */}
                            <div className={`form-group ${!errorOnUnit ? "" : "has-error"}`}>
                                <label>{translate('supplies.purchase_request.unit')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="unit" value={unit ? unit : ""} onChange={handleUnitChange} autoComplete="off" placeholder="Đơn vị tính" />
                                <ErrorLabel content={errorOnUnit} />
                            </div>

                            {/* Giá trị dự tính */}
                            <div className="form-group">
                                <label>{translate('supplies.purchase_request.estimatePrice')} (VNĐ)</label>
                                <input type="number" className="form-control" name="estimatePrice" value={estimatePrice ? estimatePrice : ""} onChange={handleEstimatePriceChange} />
                            </div>

                            <div className="form-group">
                                <label>{translate('supplies.purchase_request.files')}</label>
                                < UploadFile multiple={true} onChange={handleChangeFile} files={files} sendDataAfterDelete={true} />
                            </div>

                            {/* Người phê duyệt */}
                            <div className={`form-group`}>
                                <label>{translate('supplies.purchase_request.approver')}<span className="text-red">*</span></label>
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
                                            options={{ placeholder: translate('supplies.general_information.select_approver') }}
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
    const { purchaseRequest, user, department } = state;
    return { purchaseRequest, user, department };
};

const actionCreators = {
    getUser: UserActions.get,
    updatePurchaseRequest: PurchaseRequestActions.updatePurchaseRequest,
};

const editPurchaseRequest = connect(mapState, actionCreators)(withTranslate(PurchaseRequestEditForm));
export { editPurchaseRequest as PurchaseRequestEditForm };