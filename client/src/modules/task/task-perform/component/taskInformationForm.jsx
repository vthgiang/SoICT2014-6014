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

    render() {
        const { translate } = this.props;
        const { value, task, perform, role, id } = this.props;

        return (
            <React.Fragment>
                <div>

                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border">{translate('task.task_management.eval_on_month')}</legend>
                        <div className={`form-group ${value.errorOnProgress === undefined ? "" : "has-error"}`}>
                            <label>{translate('task.task_management.detail_progress')} (<span style={{ color: "red" }}>*</span>)</label>
                            <input
                                className="form-control"
                                type="number"
                                name="progress"
                                placeholder={translate('task.task_management.edit_enter_progress')}
                                onChange={this.props.handleChangeProgress}
                                value={value.progress ? value.progress : ''}
                            />
                            <ErrorLabel content={value.errorOnProgress} />

                        </div>

                        {
                            (task && task.taskInformations.length !== 0) &&
                            task.taskInformations.map((info, index) => {
                                if (info.type === 'Text') {
                                    return <div className={`form-group`} key={index}>
                                        <label>{info.name}(<span style={{ color: "red" }}>*</span>)</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            name={info.code}
                                            placeholder={translate('task.task_management.edit_enter_value')}
                                            onChange={this.props.handleChangeTextInfo}
                                            disabled={info.filledByAccountableEmployeesOnly && role !== "accountable"}
                                            value={(value.info[`${info.code}`] && value.info[`${info.code}`].value !== undefined) ? value.info[`${info.code}`].value : ''}
                                        />

                                        {/* <ErrorLabel content={value.errorOnTextInfo}/> */}
                                    </div>
                                }

                                {
                                    if (info.type === 'Number') {
                                        return <div className={`form-group`} key={index}>
                                            <label>{info.name}(<span style={{ color: "red" }}>*</span>)</label>
                                            <input
                                                className="form-control"
                                                type="number"
                                                name={info.code}
                                                placeholder={translate('task.task_management.edit_enter_value')}
                                                onChange={this.props.handleChangeNumberInfo}
                                                disabled={info.filledByAccountableEmployeesOnly && role !== "accountable"}
                                                value={(value.info[`${info.code}`] && value.info[`${info.code}`].value !== undefined) && value.info[`${info.code}`].value}
                                            />
                                            {/* <ErrorLabel content={value.errorOnNumberInfo}/> */}
                                        </div>
                                    }
                                }

                                {
                                    if (info.type === 'Date') {
                                        return <div key={index} className={`form-group ${value.errorOnInfoDate === undefined ? "" : "has-error"}`}>
                                            <label>{info.name}(<span style={{ color: "red" }}>*</span>)</label>
                                            <DatePicker
                                                id={`info_date_${perform}_${index}_${info.code}_${id}`}
                                                value={(value.info[`${info.code}`] && value.info[`${info.code}`].value !== undefined) ? value.info[`${info.code}`].value : undefined}
                                                onChange={(value) => this.props.handleInfoDateChange(value, info.code)}
                                                disabled={info.filledByAccountableEmployeesOnly && role !== "accountable"}
                                            />
                                            <ErrorLabel content={value.errorOnInfoDate} />
                                        </div>
                                    }
                                }

                                {
                                    if (info.type === 'Boolean') {
                                        return <div key={index} className={`form-group ${value.errorOnInfoBoolean === undefined ? "" : "has-error"}`}>
                                            <label style={{ marginRight: "30px" }}>{info.name}(<span style={{ color: "red" }}>*</span>)</label>
                                            <label class="radio-inline">
                                                <input
                                                    type="radio"
                                                    name={info.code}
                                                    value={true}
                                                    onChange={this.props.handleInfoBooleanChange}
                                                    checked={(value.info[`${info.code}`] && value.info[`${info.code}`].value !== undefined) && value.info[`${info.code}`].value === "true"}
                                                    disabled={info.filledByAccountableEmployeesOnly && role !== "accountable"}
                                                /> Đúng
                                            </label>
                                            <label class="radio-inline">
                                                <input
                                                    type="radio"
                                                    name={info.code}
                                                    value={false}
                                                    onChange={this.props.handleInfoBooleanChange}
                                                    checked={(value.info[`${info.code}`] && value.info[`${info.code}`].value !== undefined) && value.info[`${info.code}`].value === "false"}
                                                    disabled={info.filledByAccountableEmployeesOnly && role !== "accountable"}
                                                /> Sai
                                            </label>
                                        </div>
                                    }
                                }

                                {
                                    if (info.type === 'SetOfValues') {
                                        return <div key={index} className={`form-group `}>
                                            <label>{info.name}(<span style={{ color: "red" }}>*</span>)</label>
                                            <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                                id={`select-set-of-value-${index}-${id}-${perform}`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                items={info.extra.split('\n').map(x => { return { value: x, text: x } })}
                                                onChange={(value) => this.props.handleSetOfValueChange(value, info.code)}
                                                multiple={false}
                                                disabled={info.filledByAccountableEmployeesOnly && role !== "accountable"}
                                                value={(value.info[`${info.code}`] && value.info[`${info.code}`].value !== undefined) && value.info[`${info.code}`].value}
                                            />
                                        </div>
                                    }
                                }
                            })
                        }
                        {(perform === 'evaluate') &&
                            <label>
                                <input
                                    type="checkbox"
                                    checked={value.checkSave === true}
                                    // value={elem._id}
                                    name="checkSave" onChange={(e) => this.props.handleChangeSaveInfo(e)}
                                /> Lưu thông tin công việc ra thông tin chung
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