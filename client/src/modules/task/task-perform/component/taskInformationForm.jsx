import React, { Component } from 'react';
import { DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../common-components/index';
import { withTranslate } from 'react-redux-multilingual';
class TaskInformationForm extends Component {
    
    constructor(props) {
        super(props);
        this.state={}
    }

    static getDerivedStateFromProps(nextProps, prevState){
        console.log('Children nextProps, prevState', nextProps, prevState);
        if (nextProps.task !== prevState.task) {
            return {
                ...prevState,
                // ...nextProps,
                // TODO: ve sau can sửa

                id: nextProps.id,
                
                // task: nextProps.task,
                errorOnInfoDate: undefined,
                errorOnProgress: undefined
            } 
        } else {
            return null;
        }
    }

    render() {
        // const { errorOnProgress, errorOnInfoDate, errorOnInfoBoolean, errorOnTextInfo, errorOnNumberInfo } = this.props;
        const { value } = this.props;
        
        var task = this.props.task
        
        // console.log('taskkkkkkkkkkkkk', task);

        return (
            <React.Fragment>
                <div>
                    
                    <fieldset className="scheduler-border">
                            <legend className="scheduler-border">Thông tin đánh giá công việc tháng này</legend>
                            {/* information task */}
                            <div className={`form-group ${value.errorOnProgress===undefined?"":"has-error"}`}>
                                <label>Mức độ hoàn thành (<span style={{color:"red"}}>*</span>)</label>
                                <input 
                                    className="form-control"
                                    type="number" 
                                    name="progress"
                                    placeholder={85}
                                    onChange={this.props.handleChangeProgress}
                                    value={value.progress}
                                />
                                <ErrorLabel content={value.errorOnProgress}/>
                                
                            </div>
                            
                            {
                                (task && task.taskInformations.length !== 0) &&
                                task.taskInformations.map((info, index)=> 
                                {
                                    if (info.type === 'Text'){
                                        // return <div className={`form-group ${value.errorOnTextInfo === undefined ? "" : "has-error"}`}>
                                        return <div className={`form-group`}>
                                            <label>{info.name}(<span style={{color:"red"}}>*</span>)</label>
                                            {
                                                <input 
                                                    className="form-control"
                                                    type="text" 
                                                    name={info.code}
                                                    placeholder={'Nhập giá trị'}
                                                    onChange={this.props.handleChangeTextInfo}
                                                    disabled={info.filledByAccountableEmployeesOnly && this.props.role !== "accountable" }
                                                    value={(value.info[`${info.code}`] && value.info[`${info.code}`].value !== undefined ) ? value.info[`${info.code}`].value  : '' }
                                                />
                                            }
                                                
                                            {/* <ErrorLabel content={value.errorOnTextInfo}/> */}
                                        </div>
                                    } 
                                     
                                    {
                                    if (info.type === 'Number') { 
                                        // return <div className={`form-group ${value.errorOnNumberInfo === undefined ? "" : "has-error"}`}>
                                        return <div className={`form-group`}>
                                            <label>{info.name}(<span style={{color:"red"}}>*</span>)</label>
                                            <input 
                                                className="form-control"
                                                type="number" 
                                                name={info.code}
                                                placeholder={'Nhập giá trị'}
                                                onChange={this.props.handleChangeNumberInfo}
                                                disabled={info.filledByAccountableEmployeesOnly && this.props.role !== "accountable" }
                                                value={(value.info[`${info.code}`] && value.info[`${info.code}`].value !== undefined ) && value.info[`${info.code}`].value }
                                            />
                                            {/* <ErrorLabel content={value.errorOnNumberInfo}/> */}
                                        </div>
                                    }}
                                    
                                    {if (info.type === 'Date') {
                                     return <div className={`form-group ${value.errorOnInfoDate === undefined ? "" : "has-error"}`}>
                                            <label>{info.name}(<span style={{color:"red"}}>*</span>)</label>
                                            <DatePicker
                                                id={`info_date_${this.props.perform}_${index}_${info.code}`}
                                                value={(value.info[`${info.code}`] && value.info[`${info.code}`].value !== undefined ) ? value.info[`${info.code}`].value : undefined}
                                                onChange={(value)=>this.props.handleInfoDateChange(value, info.code)}
                                                disabled={info.filledByAccountableEmployeesOnly && this.props.role !== "accountable" }
                                            />
                                            <ErrorLabel content={value.errorOnInfoDate} />
                                        </div>
                                    }}
                                    
                                    {if(info.type === 'Boolean'){
                                    return <div className={`form-group ${value.errorOnInfoBoolean === undefined ? "" : "has-error"}`}>
                                            <label style={{marginRight: "30px"}}>{info.name}(<span style={{color:"red"}}>*</span>)</label>
                                            <label class="radio-inline">
                                                <input 
                                                    type="radio"
                                                    name={info.code}
                                                    value={true}
                                                    onChange={this.props.handleInfoBooleanChange}
                                                    checked={(value.info[`${info.code}`] && value.info[`${info.code}`].value !== undefined ) && value.info[`${info.code}`].value === "true" }
                                                    disabled={info.filledByAccountableEmployeesOnly && this.props.role !== "accountable" }
                                                /> Đúng
                                            </label>
                                            <label class="radio-inline">
                                                <input 
                                                    type="radio"
                                                    name={info.code}
                                                    value={false}
                                                    onChange={this.props.handleInfoBooleanChange}
                                                    checked={(value.info[`${info.code}`] && value.info[`${info.code}`].value !== undefined ) && value.info[`${info.code}`].value === "false" }
                                                    disabled={info.filledByAccountableEmployeesOnly && this.props.role !== "accountable" }
                                                /> Sai
                                            </label>
                                        </div>
                                    }}
                                    
                                    {if(info.type === 'SetOfValues') {
                                    return <div className={`form-group `}>
                                            <label>{info.name}(<span style={{color:"red"}}>*</span>)</label>
                                            <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                                id={`select-set-of-value-${index}-${this.props.perform}`}
                                                className="form-control select2"
                                                style={{width: "100%"}}
                                                items = {info.extra.split('\n').map(x => { return { value: x, text: x } })}
                                                onChange={(value)=>this.props.handleSetOfValueChange(value, info.code)}
                                                multiple={false}
                                                disabled={info.filledByAccountableEmployeesOnly && this.props.role !== "accountable" }
                                                value={(value.info[`${info.code}`] && value.info[`${info.code}`].value !== undefined ) && value.info[`${info.code}`].value } 
                                                // : [info.extra[0].value]
                                            />
                                        </div>
                                    }}
                                })
                            }
                        </fieldset>
                </div>
            </React.Fragment>
        );
    }
}

export { TaskInformationForm };