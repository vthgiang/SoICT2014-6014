import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DatePicker, DialogModal, ErrorLabel, SelectBox, UploadFile } from '../../../../../common-components';

import { RecommendProcureActions } from '../../../user/purchase-request/redux/actions';
import { UserActions } from '../../../../super-admin/user/redux/actions';
import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions';
import { convertJsonObjectToFormData } from '../../../../../helpers/jsonObjectToFormDataObjectConverter';
import { getFormatDateFromTime } from '../../../../../helpers/stringMethod';
import ValidationHelper from '../../../../../helpers/validationHelper';

function PurchaseRequestEditForm(props) {
    const [state, setState] = useState({
        status: "waiting_approval"
    })
    const [prevProps, setPrevProps] = useState({
        _id: null
    })

    const { _id, translate, recommendProcure, user, auth, department } = props;
    const {
        recommendNumber, dateCreate, proponent, equipmentName, equipmentDescription, supplier, total, unit, estimatePrice, approver, status, note, recommendUnits, files,
        errorOnEquipment, errorOnEquipmentDescription, errorOnTotal, errorOnUnit, errorOnRecommendNumber
    } = state;

    var userlist = user.list;
    const departmentlist = department.list && department.list.map(obj => ({ value: obj._id, text: obj.name }));

    if(prevProps._id !== props._id) {
        setState(state =>{
            return{
                ...state,
                _id: props._id,
                recommendNumber: props.recommendNumber,
                dateCreate: getFormatDateFromTime(props.dateCreate, 'dd-mm-yyyy'),
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

    useEffect(() => {
        props.getRoleSameDepartment(localStorage.getItem("currentRole"));
        props.getAllDepartments();
    }, [])


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
            return {
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
            return {
                ...state,
                proponent: value[0]
            }
        })
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

    //Bắt sự kiện thay đổi "Người phê duyệt"
    const handleApproverChange = (value) => {
        setState(state =>{
            return {
                ...state,
                approver: value[0]
            }
        })
    };

    // Bắt sự kiện thay đổi "Trạng thái"
    const handleStatusChange = (value) => {
        setState(state =>{
            return {
                ...state,
                status: value[0]
            }
        })
    }

    // Bắt sự kiện thay đổi "Ghi chú"
    const handleNoteChange = (e) => {
        let value = e.target.value;
        setState(value =>{
            return {
                ...state,
                note: value
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

    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    const isFormValidated = () => {
        const { recommendNumber, equipmentName, total, unit } = state;

        let result = validateEquipment(equipmentName, false) &&
            validateTotal(total, false) &&
            validateUnit(unit, false)

        return result;
    };

    const save = () => {
        let { dateCreate, recommendFiles, oldFiles, files } = state;
        let slitDateCreate, dateCreateConvert;
        if (dateCreate) {
            slitDateCreate = dateCreate.split('-');
            dateCreateConvert = new Date([slitDateCreate[2], slitDateCreate[1], slitDateCreate[0]].join('-'))
        }
        if (!recommendFiles && !oldFiles) {
            oldFiles = files;
        }

        let dataToSubmit = { ...state, oldFiles, dateCreate: dateCreateConvert, approver: [props.auth.user._id] };
        if (isFormValidated()) {
            let formData = convertJsonObjectToFormData(dataToSubmit);
            if (recommendFiles) {
                recommendFiles.forEach(obj => {
                    formData.append('recommendFiles', obj.fileUpload)
                })
            }
            return props.updateRecommendProcure(state._id, formData);
        }
    };

   
    return (
        <React.Fragment>
            <DialogModal
                size='50' modalID="modal-edit-recommendprocuremanage" isLoading={recommendProcure.isLoading}
                formID="form-edit-recommendprocuremanage"
                title={translate('asset.manage_recommend_procure.edit_recommend_card')}
                func={save}
                disableSubmit={!isFormValidated()}
            >
                {/* Form chỉnh sửa phiếu đăng ký mua sắm tài sản */}
                <form className="form-group" id="form-edit-recommendprocure">
                    <div className="col-md-12">

                        <div className="col-sm-6">
                            {/* Mã phiếu */}
                            <div className={`form-group`}>
                                <label>{translate('asset.general_information.form_code')}</label>
                                <input type="text" className="form-control" name="recommendNumber" value={recommendNumber ? recommendNumber : ''} onChange={handleRecommendNumberChange} />
                            </div>

                            {/* Ngày lập */}
                            <div className="form-group">
                                <label>{translate('asset.general_information.create_date')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`edit_start_date${_id}`}
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
                            <div className={`form-group ${!errorOnEquipment ? "" : "has-error"}`}>
                                <label>{translate('asset.manage_recommend_procure.asset_recommend')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="equipmentName" value={equipmentName ? equipmentName : ''} onChange={handleEquipmentChange} autoComplete="off" placeholder="Thiết bị đề nghị mua" />
                                <ErrorLabel content={errorOnEquipment} />
                            </div>

                            {/* Nhà cung cấp */}
                            <div className="form-group">
                                <label>{translate('asset.manage_recommend_procure.supplier')}</label>
                                <input type="text" className="form-control" name="supplier" value={supplier ? supplier : ""} onChange={handleSupplierChange} />
                            </div>

                            {/* Mô tả thiết bị đề nghị mua */}
                            <div className={`form-group ${errorOnEquipmentDescription === undefined ? "" : "has-error"}`}>
                                <label>{translate('asset.manage_recommend_procure.equipment_description')}</label>
                                <textarea className="form-control" rows="3" name="equipmentDescription" value={equipmentDescription ? equipmentDescription : ''} onChange={handleEquipmentDescriptionChange} autoComplete="off"
                                    placeholder="Thiết bị đề nghị mua"></textarea>
                                <ErrorLabel content={errorOnEquipmentDescription} />
                            </div>
                        </div>

                        <div className="col-sm-6">
                            {/* Số lượng */}
                            <div className={`form-group ${errorOnTotal === undefined ? "" : "has-error"}`}>
                                <label>{translate('asset.general_information.number')}<span className="text-red">*</span></label>
                                <input type="number" className="form-control" name="total" value={total ? total : ''} onChange={handleTotalChange} />
                                <ErrorLabel content={errorOnTotal} />
                            </div>

                            {/* Đơn vị tính */}
                            <div className={`form-group ${!errorOnUnit ? "" : "has-error"}`}>
                                <label>{translate('asset.manage_recommend_procure.unit')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="unit" value={unit ? unit : ""} onChange={handleUnitChange} autoComplete="off" placeholder="Đơn vị tính" />
                                <ErrorLabel content={errorOnUnit} />
                            </div>

                            {/* Giá trị dự tính */}
                            <div className="form-group">
                                <label>{translate('asset.manage_recommend_procure.expected_value')} (VNĐ)</label>
                                <input type="number" className="form-control" name="estimatePrice" value={estimatePrice ? estimatePrice : ""} onChange={handleEstimatePriceChange} />
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
                                            onChange={handleApproverChange}
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
                                    onChange={handleStatusChange}
                                />
                            </div>

                            {/* Ghi chú */}
                            <div className="form-group">
                                <label>{translate('asset.usage.note')}</label>
                                <textarea className="form-control" rows="3" name="note" value={note ? note : ''} onChange={handleNoteChange}></textarea>
                            </div>

                            {/* tài liệu đính kèm */}
                            <div className="form-group">
                                <label>{translate('human_resource.profile.attached_files')}</label>
                                <UploadFile multiple={true} onChange={handleChangeFile} files={files} sendDataAfterDelete={true} />
                            </div>
                        </div>
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
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
