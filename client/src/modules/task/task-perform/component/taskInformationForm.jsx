import React, { Component } from 'react';
import { DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../common-components/index';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
class TaskInformationForm extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.task !== prevState.task) {
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
        if( x === null || x === undefined ) {
            return false;
        }
        else return true;
    }

    render() {
        const { translate } = this.props;
        const { value, task, perform, role, id, disabled, indexReRender, legendText = translate('task.task_management.detail_info')} = this.props;

        return (
            <React.Fragment>
                <div>

                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border">{legendText}</legend>

                        {(perform === 'evaluate') &&
                            <div className="pull-right" style={{marginTop: -20}}>
                                <a style={{cursor: "pointer"}}>Nhập tự động từ thông tin công việc hiện tại</a>
                            </div>
                        }

                        <div className={`form-group ${value.errorOnProgress === undefined ? "" : "has-error"}`}>
                            <label>{translate('task.task_management.detail_progress')} (<span style={{ color: "red" }}>*</span>)</label>
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

                        {
                            (task && task.taskInformations.length !== 0) &&
                            task.taskInformations.map((info, index) => {
                                if (info.type === 'Text') {
                                    return <div className={`form-group ${value.errorInfo && value.errorInfo[info.code] === undefined ? "" : "has-error"}`} key={index}>
                                        <label>{info.name}(<span style={{ color: "red" }}>*</span>)</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            name={info.code}
                                            placeholder={translate('task.task_management.edit_enter_value')}
                                            onChange={this.props.handleChangeTextInfo}
                                            disabled={info.filledByAccountableEmployeesOnly && role !== "accountable"}
                                            value={(value.info[`${info.code}`] && this.checkNullUndefined(value.info[`${info.code}`].value)) ? value.info[`${info.code}`].value : ''}
                                            disabled={disabled} 
                                        />

                                        <ErrorLabel content={value.errorInfo ? value.errorInfo[info.code] : ''}/>
                                    </div>
                                }

                                {
                                    if (info.type === 'Number') {
                                        return <div className={`form-group ${value.errorInfo && value.errorInfo[info.code] === undefined ? "" : "has-error"}`} key={index}>
                                            <label>{info.name}(<span style={{ color: "red" }}>*</span>)</label>
                                            <input
                                                className="form-control"
                                                type="number"
                                                name={info.code}
                                                placeholder={translate('task.task_management.edit_enter_value')}
                                                onChange={this.props.handleChangeNumberInfo}
                                                disabled={info.filledByAccountableEmployeesOnly && role !== "accountable"}
                                                value={(value.info[`${info.code}`] && this.checkNullUndefined(value.info[`${info.code}`].value)) && value.info[`${info.code}`].value}
                                                disabled={disabled} 
                                            />
                                            <ErrorLabel content={value.errorInfo ? value.errorInfo[`${info.code}`] : ''}/>
                                        </div>
                                    }
                                }

                                {
                                    if (info.type === 'Date') {
                                        return <div key={index} className={`form-group ${value.errorInfo && value.errorInfo[info.code] === undefined ? "" : "has-error"}`}>
                                            <label>{info.name}(<span style={{ color: "red" }}>*</span>)</label>
                                            <DatePicker
                                                id={`info_date_${perform}_${index}_${info.code}_${id}_${indexReRender}`}
                                                name={info.code}
                                                value={(value.info[`${info.code}`] && this.checkNullUndefined(value.info[`${info.code}`].value)) ? value.info[`${info.code}`].value : undefined}
                                                onChange={(value) => this.props.handleInfoDateChange(value, info.code)}
                                                disabled={info.filledByAccountableEmployeesOnly && role !== "accountable"}
                                                disabled={disabled} 
                                            />
                                            <ErrorLabel content={value.errorInfo ? value.errorInfo[info.code] : ''} />
                                        </div>
                                    }
                                }

                                {
                                    if (info.type === 'Boolean') {
                                        return <div key={index} className={`form-group ${value.errorInfo && value.errorInfo[info.code] === undefined ? "" : "has-error"}`}>
                                            <label style={{ marginRight: "30px" }}>{info.name}(<span style={{ color: "red" }}>*</span>)</label>
                                            <label class="radio-inline">
                                                <input
                                                    type="radio"
                                                    name={info.code}
                                                    value={true}
                                                    onChange={this.props.handleInfoBooleanChange}
                                                    checked={(value.info[`${info.code}`] && this.checkNullUndefined(value.info[`${info.code}`].value)) && value.info[`${info.code}`].value === "true"}
                                                    disabled={info.filledByAccountableEmployeesOnly && role !== "accountable"}
                                                    disabled={disabled} 
                                                /> {translate('task.task_management.bool_yes')}
                                            </label>
                                            <label class="radio-inline">
                                                <input
                                                    type="radio"
                                                    name={info.code}
                                                    value={false}
                                                    onChange={this.props.handleInfoBooleanChange}
                                                    checked={(value.info[`${info.code}`] && this.checkNullUndefined(value.info[`${info.code}`].value)) && value.info[`${info.code}`].value === "false"}
                                                    disabled={info.filledByAccountableEmployeesOnly && role !== "accountable"}
                                                    disabled={disabled} 
                                                /> {translate('task.task_management.bool_no')}
                                            </label>
                                        </div>
                                    }
                                }

                                {
                                    if (info.type === 'SetOfValues') {
                                        return <div key={index} className={`form-group ${value.errorInfo && value.errorInfo[info.code] === undefined ? "" : "has-error"}`}>
                                            <label>{info.name}(<span style={{ color: "red" }}>*</span>)</label>
                                            <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                                id={`select-set-of-value-${index}-${id}-${perform}_${indexReRender}`}
                                                className="form-control select2"
                                                name={info.code}
                                                style={{ width: "100%" }}
                                                items={info.extra.split('\n').map(x => { return { value: x, text: x } })}
                                                onChange={(value) => this.props.handleSetOfValueChange(value, info.code)}
                                                multiple={false}
                                                disabled={info.filledByAccountableEmployeesOnly && role !== "accountable"}
                                                value={(value.info[`${info.code}`] && this.checkNullUndefined(value.info[`${info.code}`].value)) && value.info[`${info.code}`].value}
                                                disabled={disabled} 
                                            />
                                        </div>
                                    }
                                }
                            })
                        }
                        {(perform === 'evaluate') &&
                            <label className={`form-group`}>
                                <input
                                    type="checkbox"
                                    checked={value.checkSave === true}
                                    disabled={disabled} 
                                    // value={elem._id}
                                    name="checkSave" onChange={(e) => this.props.handleChangeSaveInfo(e)}
                                /> {translate('task.task_management.store_info')}
                            </label>
                        }

                    </fieldset>
                </div>
            </React.Fragment>
        );
    }
}

const informationTaskForm = connect(null, null)(withTranslate(TaskInformationForm));
export { informationTaskForm as TaskInformationForm };