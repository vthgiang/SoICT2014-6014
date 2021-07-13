import React, { Component, useEffect, useState } from 'react';
import { DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../common-components/index';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { ModalEditInfo } from './modalEditInfo';

function TaskInformationForm(props) {
    const [state, setState] = useState(initState())
    const { translate } = props;
    const { value, task, perform, role, id, disabled, indexReRender, progress, errorOnProgress } = props;
    const { listInfo } = state;

    function initState() {
        let { task, evaluationInfo } = props;

        let initialInfo = task && task.taskInformations;
        if (props.perform === 'evaluate') {
            initialInfo = evaluationInfo && evaluationInfo.taskInformations;
        }
        return {
            listInfo: initialInfo
        }
    }
    useEffect(() => {
        if (props.perform === 'evaluate') {
            setState({
                ...state,
                listInfo: props.evaluationInfo && props.evaluationInfo.taskInformations,
                evaluationInfo: props.evaluationInfo,
            })
        }
    }, [props._id])

    useEffect(() => {
        setState({
            ...state,

            id: props.id,

            errorOnInfoDate: undefined,
            errorOnProgress: undefined
        })
    }, [props.task])


    const checkNullUndefined = (x) => {
        if (x === null || x === undefined) {
            return false;
        }
        else return true;
    }

    const clickEditInfo = () => {
        setState({
            ...state,
            showEdit: true
        });
        window.$(`#modelEditInfo`).modal('show');
    }

    const onEditListInfo = (data) => {
        setState({
            ...state,
            listInfo: data
        });
        props.handleChangeListInfo(data);
        // forceUpdate();
    }

    return (
        <React.Fragment>
            <div>

                <fieldset className="scheduler-border">
                    <legend className="scheduler-border">{translate('task.task_management.detail_info')}</legend>

                    {(perform === 'evaluate' && !disabled) &&
                        <div className="pull-right" style={{ marginTop: -20 }}>
                            <a style={{ cursor: "pointer" }} onClick={props.updateInfo}>{translate('task.task_management.get_outside_info')}</a>
                        </div>
                    }

                    <div className={`form-group ${errorOnProgress === undefined ? "" : "has-error"}`}>
                        <label>{translate('task.task_management.detail_progress')} (1-100)</label>
                        <input
                            className="form-control"
                            type="number"
                            name="progress"
                            placeholder={translate('task.task_management.edit_enter_progress')}
                            onChange={props.handleChangeProgress}
                            value={checkNullUndefined(progress) ? progress : ''}
                            disabled={disabled}
                        />
                        <ErrorLabel content={errorOnProgress} />

                    </div>
                    {(perform !== 'evaluate' && !disabled) && role === "accountable" &&
                        <div className="pull-right">
                            <a onClick={clickEditInfo} style={{ cursor: 'pointer', fontWeight: "normal" }}>Chỉnh sửa thông tin</a>
                        </div>
                    }
                    {
                        (listInfo?.length > 0) &&
                        listInfo.map((info, index) => {
                            if (info?.type === 'text') {
                                return <div className={`form-group ${value.errorInfo && value.errorInfo[info.code] === undefined ? "" : "has-error"}`} key={index}>
                                    {/* style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: "-5px" }} */}
                                    <label>{info?.name} ({info?.code})</label>
                                    <textarea
                                        className="form-control"
                                        row={3}
                                        // type="text"
                                        name={info.code}
                                        placeholder={translate('task.task_management.edit_enter_value')}
                                        onChange={props.handleChangeTextInfo}
                                        disabled={disabled || (info.filledByAccountableEmployeesOnly && role !== "accountable")}
                                        value={(value.info[`${info.code}`] && checkNullUndefined(value.info[`${info.code}`].value)) ? value.info[`${info.code}`].value : ''}
                                    />

                                    <ErrorLabel content={value.errorInfo ? value.errorInfo[info.code] : ''} />
                                </div>
                            }

                            {
                                if (info.type === 'number') {
                                    return <div className={`form-group ${value.errorInfo && value.errorInfo[info.code] === undefined ? "" : "has-error"}`} key={index}>
                                        <label>{info.name}</label>
                                        <input
                                            className="form-control"
                                            type="number"
                                            name={info.code}
                                            placeholder={translate('task.task_management.edit_enter_value')}
                                            onChange={props.handleChangeNumberInfo}
                                            disabled={disabled || (info.filledByAccountableEmployeesOnly && role !== "accountable")}
                                            value={(value.info[`${info.code}`] && checkNullUndefined(value.info[`${info.code}`].value)) ? value.info[`${info.code}`].value : info?.value}
                                        />
                                        <ErrorLabel content={value.errorInfo ? value.errorInfo[`${info.code}`] : ''} />
                                    </div>
                                }
                            }

                            {
                                if (info.type === 'date') {
                                    return <div key={index} className={`form-group ${value.errorInfo && value.errorInfo[info.code] === undefined ? "" : "has-error"}`}>
                                        <label>{info.name}</label>
                                        <DatePicker
                                            id={`info_date_${perform}_${index}_${info.code}_${id}_${indexReRender}`}
                                            name={info.code}
                                            value={(value.info[`${info.code}`] && checkNullUndefined(value.info[`${info.code}`].value)) ? value.info[`${info.code}`].value : undefined}
                                            onChange={(value) => props.handleInfoDateChange(value, info.code)}
                                            disabled={disabled || (info.filledByAccountableEmployeesOnly && role !== "accountable")}
                                        />
                                        <ErrorLabel content={value.errorInfo ? value.errorInfo[info.code] : ''} />
                                    </div>
                                }
                            }

                            {
                                if (info.type === 'boolean') {
                                    return <div key={index} className={`form-group ${value.errorInfo && value.errorInfo[info.code] === undefined ? "" : "has-error"}`}>
                                        <label style={{ marginRight: "30px" }}>{info.name}</label>
                                        <label className="radio-inline">
                                            <input
                                                type="radio"
                                                name={info.code}
                                                value={true}
                                                onChange={props.handleInfoBooleanChange}
                                                checked={(value.info[`${info.code}`] && checkNullUndefined(value.info[`${info.code}`].value)) && value.info[`${info.code}`].value === "true"}
                                                disabled={disabled || (info.filledByAccountableEmployeesOnly && role !== "accountable")}
                                            /> {translate('task.task_management.bool_yes')}
                                        </label>
                                        <label className="radio-inline">
                                            <input
                                                type="radio"
                                                name={info.code}
                                                value={false}
                                                onChange={props.handleInfoBooleanChange}
                                                checked={(value.info[`${info.code}`] && checkNullUndefined(value.info[`${info.code}`].value)) && value.info[`${info.code}`].value === "false"}
                                                disabled={disabled || (info.filledByAccountableEmployeesOnly && role !== "accountable")}
                                            /> {translate('task.task_management.bool_no')}
                                        </label>
                                    </div>
                                }
                            }

                            {
                                if (info.type === 'set_of_values') {
                                    return <div key={index} className={`form-group ${value.errorInfo && value.errorInfo[info.code] === undefined ? "" : "has-error"}`}>
                                        <label>{info.name}</label>
                                        <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                            id={`select-set-of-value-${index}-${id}-${perform}_${indexReRender}`}
                                            className="form-control select2"
                                            name={info.code}
                                            style={{ width: "100%" }}
                                            items={info.extra.split('\n').map(x => { return { value: x, text: x } })}
                                            onChange={(value) => props.handleSetOfValueChange(value, info.code)}
                                            multiple={false}
                                            disabled={disabled || (info.filledByAccountableEmployeesOnly && role !== "accountable")}
                                            value={(value.info[`${info.code}`] && checkNullUndefined(value.info[`${info.code}`].value[0])) && value.info[`${info.code}`].value[0]}
                                        />
                                    </div>
                                }
                            }
                        })
                    }
                    {(perform === 'evaluate' && !disabled) &&
                        <label className={`form-group`}>
                            <input
                                type="checkbox"
                                checked={value.checkSave === true}
                                disabled={disabled}
                                name="checkSave" onChange={(e) => props.handleChangeSaveInfo(e)}
                            /> {translate('task.task_management.store_info')}
                        </label>
                    }
                </fieldset>
            </div>
            {
                state.showEdit && <ModalEditInfo taskInformation={listInfo} onEditListInfo={onEditListInfo} />
            }
        </React.Fragment>
    );
}


const informationTaskForm = connect(null, null)(withTranslate(TaskInformationForm));
export { informationTaskForm as TaskInformationForm };