import React, { Component } from 'react';
import { DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../common-components/index';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { ModalEditInfo } from './modalEditInfo';
class TaskInformationForm extends Component {

    constructor(props) {
        super(props);
        let { task, evaluationInfo } = props;

        let initialInfo = task && task.taskInformations;
        if(props.perform === 'evaluate'){
            initialInfo = evaluationInfo && evaluationInfo.taskInformations;
        }

        this.state = {
            listInfo: initialInfo
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if(nextProps.perform === 'evaluate'){
            if (nextProps.evaluationInfo?._id !== prevState.evaluationInfo?._id){
                return {
                    ...prevState,
                    listInfo: nextProps.evaluationInfo && nextProps.evaluationInfo.taskInformations,
                    evaluationInfo: nextProps.evaluationInfo,
                }
            }
        } else if (nextProps.task !== prevState.task) {
            return {
                ...prevState,

                id: nextProps.id,

                errorOnInfoDate: undefined,
                errorOnProgress: undefined
            }
        } else {
            return null;
        }
    }

    checkNullUndefined = (x) => {
        if (x === null || x === undefined) {
            return false;
        }
        else return true;
    }

    clickEditInfo = async () => {
        await this.setState({ showEdit: true });
        window.$(`#modelEditInfo`).modal('show');
    }

    onEditListInfo = async (data) => {
        await this.setState({ listInfo: data });
        this.props.handleChangeListInfo(data);
        // this.forceUpdate();
    }

    render() {
        const { translate } = this.props;
        const { value, task, perform, role, id, disabled, indexReRender, legendText = translate('task.task_management.detail_info') } = this.props;
        const { listInfo } = this.state;

        return (
            <React.Fragment>
                <div>

                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border">{legendText}</legend>

                        {(perform === 'evaluate' && !disabled) &&
                            <div className="pull-right" style={{ marginTop: -20 }}>
                                <a style={{ cursor: "pointer" }} onClick={this.props.updateInfo}>{translate('task.task_management.get_outside_info')}</a>
                            </div>
                        }

                        <div className={`form-group ${value.errorOnProgress === undefined ? "" : "has-error"}`}>
                            <label>{translate('task.task_management.detail_progress')} (1-100)</label>
                            <input
                                className="form-control"
                                type="number"
                                name="progress"
                                placeholder={translate('task.task_management.edit_enter_progress')}
                                onChange={this.props.handleChangeProgress}
                                value={this.checkNullUndefined(value.progress) ? value.progress : ''}
                                disabled={disabled}
                            />
                            <ErrorLabel content={value.errorOnProgress} />

                        </div>
                        {(perform !== 'evaluate' && !disabled) && role === "accountable" &&
                            <div className="pull-right">
                                <a onClick={this.clickEditInfo} style={{ cursor: 'pointer', fontWeight: "normal" }}>Chỉnh sửa thông tin</a>
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
                                            onChange={this.props.handleChangeTextInfo}
                                            disabled={disabled || (info.filledByAccountableEmployeesOnly && role !== "accountable")}
                                            value={(value.info[`${info.code}`] && this.checkNullUndefined(value.info[`${info.code}`].value)) ? value.info[`${info.code}`].value : ''}
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
                                                onChange={this.props.handleChangeNumberInfo}
                                                disabled={disabled || (info.filledByAccountableEmployeesOnly && role !== "accountable")}
                                                value={(value.info[`${info.code}`] && this.checkNullUndefined(value.info[`${info.code}`].value)) ? value.info[`${info.code}`].value : ''}
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
                                                value={(value.info[`${info.code}`] && this.checkNullUndefined(value.info[`${info.code}`].value)) ? value.info[`${info.code}`].value : undefined}
                                                onChange={(value) => this.props.handleInfoDateChange(value, info.code)}
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
                                                    onChange={this.props.handleInfoBooleanChange}
                                                    checked={(value.info[`${info.code}`] && this.checkNullUndefined(value.info[`${info.code}`].value)) && value.info[`${info.code}`].value === "true"}
                                                    disabled={disabled || (info.filledByAccountableEmployeesOnly && role !== "accountable")}
                                                /> {translate('task.task_management.bool_yes')}
                                            </label>
                                            <label className="radio-inline">
                                                <input
                                                    type="radio"
                                                    name={info.code}
                                                    value={false}
                                                    onChange={this.props.handleInfoBooleanChange}
                                                    checked={(value.info[`${info.code}`] && this.checkNullUndefined(value.info[`${info.code}`].value)) && value.info[`${info.code}`].value === "false"}
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
                                                onChange={(value) => this.props.handleSetOfValueChange(value, info.code)}
                                                multiple={false}
                                                disabled={disabled || (info.filledByAccountableEmployeesOnly && role !== "accountable")}
                                                value={(value.info[`${info.code}`] && this.checkNullUndefined(value.info[`${info.code}`].value[0])) && value.info[`${info.code}`].value[0]}
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
                                    name="checkSave" onChange={(e) => this.props.handleChangeSaveInfo(e)}
                                /> {translate('task.task_management.store_info')}
                            </label>
                        }
                    </fieldset>
                </div>
                {
                    this.state.showEdit && <ModalEditInfo taskInformation={listInfo} onEditListInfo={this.onEditListInfo} />
                }
            </React.Fragment>
        );
    }
}

const informationTaskForm = connect(null, null)(withTranslate(TaskInformationForm));
export { informationTaskForm as TaskInformationForm };