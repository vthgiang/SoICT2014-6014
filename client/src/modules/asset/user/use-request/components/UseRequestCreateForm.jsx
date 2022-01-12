import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DatePicker, TimePicker, DialogModal, ErrorLabel, SelectBox } from '../../../../../common-components';
import { compareTime } from '../../../../../helpers/stringMethod';
import { RecommendDistributeActions } from '../redux/actions';
import { AssetManagerActions } from '../../../admin/asset-information/redux/actions';
import { UserActions } from '../../../../super-admin/user/redux/actions';
import Swal from 'sweetalert2';
import ValidationHelper from '../../../../../helpers/validationHelper';
import { generateCode } from "../../../../../helpers/generateCode";
import { taskManagementActions } from '../../../../task/task-management/redux/actions';

function UseRequestCreateForm(props) {
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
        dateCreate: formatDate(Date.now()),
        proponent: "",
        reqContent: "",
        dateStartUse: props.startDate ? formatDate(props.startDate) : formatDate(Date.now()),
        dateEndUse: props.endDate ? formatDate(props.endDate) : formatDate(Date.now()),
        startTime: null,
        stopTime: null,
        status: "waiting_for_approval",
        asset: "",
        task: "",
    })
    const [prevProps, setPrevProps] = useState({
        _id: null
    })
    const { _id } = props;
    const { translate, recommendDistribute, assetsManager, user, auth, tasks } = props;
    const {
        recommendNumber, dateCreate, asset, reqContent, dateStartUse, dateEndUse, task,
        errorOnRecommendNumber, errorOnDateCreate, errorOnReqContent, errorOnDateStartUse, errorOnDateEndUse, startTime, stopTime
    } = state;
    const getAll = true;

    var assetlist = assetsManager.listAssets;
    var userlist = user.list;

    if (prevProps._id !== props._id) {
        setState(state => {
            return {
                ...state,
                _id: props._id,
                asset: props.asset,
                stopTime: props.stopTime,
                startTime: props.startTime,
            }
        })
        setPrevProps(props)
    }

    useEffect(() => {
        // Mỗi khi modal mở, cần sinh lại code
        let { _id } = props;
        _id && window.$(`#modal-create-recommenddistribute-${_id}`).on('shown.bs.modal', regenerateCode);
        return () => {
            let { _id } = props;
            _id && window.$(`#modal-create-recommenddistribute-${_id}`).unbind('shown.bs.modal', regenerateCode)
        }
    }, [])

    useEffect(() => {
        let data = { getAll };
        props.getPaginateTasks(data);
    }, [])


    const regenerateCode = () => {
        let code = generateCode("UR");
        setState((state) => ({
            ...state,
            recommendNumber: code,
        }));
    }

    // Bắt sự kiện thay đổi mã phiếu
    const handleRecommendNumberChange = (e) => {
        let { value } = e.target;
        let { translate } = props;
        let { message } = ValidationHelper.validateName(translate, value, 4, 255);
        setState(state => {
            return {
                ...state,
                recommendNumber: value,
                errorOnRecommendNumber: message
            }
        });
    }

    // Bắt sự kiện thay đổi "Ngày lập"
    const handleDateCreateChange = (value) => {
        let { translate } = props;
        let { message } = ValidationHelper.validateName(translate, value, 4, 255);
        setState(state => {
            return {
                ...state,
                dateCreate: value,
                errorOnDateCreate: message
            }
        });
    }

    /**
     * Bắt sự kiện thay đổi người sử dụng
     */
    const handleProponentChange = (value) => {
        setState({
            ...state,
            proponent: value[0]
        });
    }

    /**
     * Bắt sự kiện thay đổi công việc
     */
    const handleTaskChange = (value) => {
        setState({
            ...state,
            task: value[0]
        });
    }

    // Bắt sự kiện thay đổi "Nội dung đề nghị"
    const handleReqContentChange = (e) => {
        let { value } = e.target;
        let { translate } = props;
        let { message } = ValidationHelper.validateName(translate, value, 4, 255);
        setState(state => {
            return {
                ...state,
                reqContent: value,
                errorOnReqContent: message
            }
        });
    }

    /**
     * Bắt sự kiện thay đổi Mã tài sản
     */
    const handleAssetChange = (value) => {
        setState(state => {
            return {
                ...state,
                asset: value[0]
            }
        });
    }

    // Bắt sự kiện thay đổi "Thời gian đăng ký sử dụng từ ngày"
    const handleDateStartUseChange = (value) => {
        let { translate } = props;
        let { message } = ValidationHelper.validateName(translate, value, 4, 255);
        setState(state => {
            return {
                ...state,
                dateStartUse: value,
                errorOnDateStartUse: message
            }
        });
    }

    const handleStartTimeChange = (value) => {
        setState(state => {
            return {
                ...state,
                startTime: value
            }
        });
    }

    const handleStopTimeChange = (value) => {
        setState(state => {
            return {
                ...state,
                stopTime: value
            }
        });

    }
    // Bắt sự kiện thay đổi "Thời gian đăng ký sử dụng đến ngày"
    const handleDateEndUseChange = (value) => {
        let { translate } = props;
        let { message } = ValidationHelper.validateName(translate, value, 4, 255);
        setState(state => {
            return {
                ...state,
                dateEndUse: value,
                errorOnDateEndUse: props.typeRegisterForUse == 3 ? undefined : message
            }
        });
    }

    const getDefaultStartValue = (value) => {
        setState(state => {
            return {
                ...state,
                startTime: value
            }
        });
    }

    const getDefaultEndValue = (value) => {
        setState(state => {
            return {
                ...state,
                stopTime: value
            }
        });
    }

    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    const isFormValidated = () => {
        let { recommendNumber, dateCreate, reqContent, dateStartUse, dateEndUse, errorOnReqContent } = state;
        let { translate } = props;
        if (
            // !ValidationHelper.validateEmpty(translate, recommendNumber).status ||
            !ValidationHelper.validateEmpty(translate, dateCreate).status ||
            !ValidationHelper.validateEmpty(translate, reqContent).status ||
            !ValidationHelper.validateName(translate, reqContent, 4, 255).status ||
            !ValidationHelper.validateEmpty(translate, dateStartUse).status ||
            (props.typeRegisterForUse != 3 && !ValidationHelper.validateName(translate, dateEndUse).status)
        ) return false;
        return true;
    }

    // Bắt sự kiện submit form
    const save = async () => {
        let { dateStartUse, dateEndUse, dateCreate, date, partStart, partEnd, partCreate, startTime, stopTime } = state;

        partStart = dateStartUse.split('-');
        partEnd = dateEndUse.split('-');
        partCreate = dateCreate.split('-');

        if (startTime) {
            date = [partStart[2], partStart[1], partStart[0]].join('/') + ' ' + startTime;
            dateStartUse = new Date(date);
        } else {
            date = [partStart[2], partStart[1], partStart[0]].join('/')
            dateStartUse = new Date(date);
        }
        if (stopTime) {
            date = [partEnd[2], partEnd[1], partEnd[0]].join('/') + ' ' + stopTime;
            dateEndUse = new Date(date);
        } else {
            date = [partEnd[2], partEnd[1], partEnd[0]].join('/');
            dateEndUse = new Date(date);
        }

        date = [partCreate[2], partCreate[1], partCreate[0]].join('/');
        dateCreate = new Date(date);

        let dataToSubmit = { ...state, dateCreate, dateStartUse, dateEndUse, proponent: props.auth.user._id }
        if (isFormValidated()) {
            let nowDate = new Date();
            let dateStartUse, date;

            date = state.dateStartUse.split("-");
            date = [date[2], date[1], date[0]].join('/')
            dateStartUse = new Date(date)
            console.log('dataToSubmitdataToSubmit', dataToSubmit)
            if (compareTime(nowDate, dateStartUse) === 1) {
                Swal.fire({
                    title: 'Ngày đã qua không thể tạo đăng ký sử dụng',
                    type: 'warning',
                    confirmButtonColor: '#dd4b39',
                    confirmButtonText: "Đóng",
                })
            } else {
                await props.createRecommendDistribute(dataToSubmit);
                if (props._id === `calendar-${props.asset}`) {
                    await props.handleChange(dataToSubmit)
                }
            }
        }
    }

    var taskList = tasks.tasks && tasks.tasks.map(x => {
        return { value: x._id, text: x.name }
    })

    return (
        <React.Fragment>
            <DialogModal
                size='50' modalID={`modal-create-recommenddistribute-${_id}`} isLoading={recommendDistribute.isLoading}
                formID="form-create-recommenddistribute"
                title={translate('asset.asset_info.add_usage_info')}
                func={save}
                disableSubmit={!isFormValidated()}
            >
                {/* Form thêm mới phiếu đăng ký sử dụng thiết bị */}
                <form className="form-group" id="form-create-recommenddistribute">
                    <div className="col-md-12">

                        <div className="col-sm-6">
                            {/* Mã phiếu */}
                            <div className={`form-group`}>
                                <label>{translate('asset.general_information.form_code')}</label>
                                <input type="text" className="form-control" name="recommendNumber" value={recommendNumber} onChange={handleRecommendNumberChange} autoComplete="off" placeholder="Mã phiếu" />
                                {/* <ErrorLabel content={errorOnRecommendNumber} /> */}
                            </div>

                            {/* Ngày lập */}
                            <div className={`form-group ${!errorOnDateCreate ? "" : "has-error"}`}>
                                <label>{translate('asset.general_information.create_date')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id="create_start_date"
                                    value={dateCreate}
                                    onChange={handleDateCreateChange}
                                />
                                <ErrorLabel content={errorOnDateCreate} />
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
                                            items={userlist.map(x => {
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

                            {/* Nội dung đề nghị */}
                            <div className={`form-group ${!errorOnReqContent ? "" : "has-error"}`}>
                                <label>{translate('asset.general_information.content')}<span className="text-red">*</span></label>
                                <textarea className="form-control" rows="3" name="reqContent" value={reqContent} onChange={handleReqContentChange} autoComplete="off" placeholder="Nội dung đề nghị"></textarea>
                                <ErrorLabel content={errorOnReqContent} />
                            </div>
                        </div>

                        <div className="col-sm-6">
                            {/* Tài sản */}
                            <div className={`form-group`}>
                                <label>{translate('asset.general_information.asset')}</label>
                                <div>
                                    <div id="assetUBox">
                                        <SelectBox
                                            id={`asset${_id}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={assetlist.map(x => {
                                                return { value: x._id, text: x.code + " - " + x.assetName }
                                            })}
                                            onChange={handleAssetChange}
                                            value={asset}
                                            multiple={false}
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Thời gian đăng ký sử dụng từ ngày */}
                            <div className={`form-group ${errorOnDateStartUse === undefined ? "" : "has-error"}`}>
                                <label>{translate('asset.general_information.handover_from_date')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id="create_start_use"
                                    value={dateStartUse}
                                    onChange={handleDateStartUseChange}
                                />
                                {props.typeRegisterForUse == 2 &&
                                    <TimePicker
                                        id={`time-picker-start`}
                                        onChange={handleStartTimeChange}
                                        value={startTime}
                                    />
                                }
                                <ErrorLabel content={errorOnDateStartUse} />
                            </div>

                            {/* Thời gian đăng ký sử dụng đến ngày */}
                            <div className={`form-group ${errorOnDateEndUse === undefined ? "" : "has-error"}`}>
                                <label>{translate('asset.general_information.handover_to_date')}{props.typeRegisterForUse != 3 && <span className="text-red">*</span>}</label>
                                <DatePicker
                                    id="create_end_use"
                                    value={dateEndUse}
                                    onChange={handleDateEndUseChange}
                                />
                                {props.typeRegisterForUse == 2 &&
                                    <TimePicker
                                        id={`time-picker-end`}
                                        onChange={handleStopTimeChange}
                                        value={stopTime}
                                    />
                                }

                                <ErrorLabel content={errorOnDateEndUse} />
                            </div>

                            {/* công việc*/}
                            <div className="form-group">
                                <label>{translate('asset.usage.task_in_use_request')}</label>
                                <div id="taskCreateRequestDiv">
                                    <SelectBox
                                        id={`taskCreateRequestBox`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={[{ value: "", text: "Chọn công việc" }, ...(taskList ? taskList : [])]}
                                        onChange={handleTaskChange}
                                        value={task}
                                        multiple={false}
                                    />
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
    const { recommendDistribute, auth, user, assetsManager, tasks } = state;
    return { recommendDistribute, auth, user, assetsManager, tasks };
};

const actionCreators = {
    getUser: UserActions.get,
    getAllAsset: AssetManagerActions.getAllAsset,
    createRecommendDistribute: RecommendDistributeActions.createRecommendDistribute,
    getPaginateTasks: taskManagementActions.getPaginateTasks,
};

const createForm = connect(mapState, actionCreators)(withTranslate(UseRequestCreateForm));
export { createForm as UseRequestCreateForm };
