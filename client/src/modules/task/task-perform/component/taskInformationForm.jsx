import React, { Component } from 'react';
import { DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../common-components/index';

class TaskInformationForm extends Component {
    
    constructor(props) {
        super(props);
        this.state={}
    }
    
    // componentDidMount() {
    //     const { id, onChange } = this.props;
        
    //     window.$("#" + id).on("change", () => {
    //         let value = this.refs.datePicker.value;
    //         this.setState({
    //             value: value
    //         })
    //         onChange(value); // Thông báo lại cho parent component về giá trị mới (để parent component lưu vào state của nó)
    //     });
    // }
    validatePoint = (value) => {
        var { translate } = this.props;
        let msg = undefined;
        if (value < 0 || value > 100) {
            msg = translate('task.task_perform.modal_approve_task.err_range');
        }
        if (isNaN(value)) {
            msg = translate('task.task_perform.modal_approve_task.err_empty');
        }
        return msg;
    }

    handleChangeProgress = async (e) => {
        var value = parseInt(e.target.value);
        await this.setState(state =>{
            return {
                ...state,
                progress: value,
                errorOnProgress: this.validatePoint(value)
            }
        })
        document.getElementById("autoPoint").innerHTML = value;
    } 

    handleDateChange = (value) => {
        // var value = e.target.value;
        this.setState(state => {
                return {
                    ...state,
                    errorOnDate: this.validateDate(value),
                    date: value,
                }
            });
        
    }
    handleInfoDateChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                errorOnInfoDate: this.validateDate(value),
                infoDate: value,
            }
        });
    }

    validateDate = (value, willUpdateState = true) => {
        let msg = undefined;
        if (value.trim() === "") {
            msg = "Ngày đánh giá bắt buộc phải chọn";
        }
        
        return msg;
    }

    handleKpiChange =(value) => {
        this.setState(state => {
            return {
                ...state,
                kpi: value
            }
        });
    }

    handleInfoBooleanChange  =(value) => {
        this.setState(state => {
            return {
                ...state,
                infoBoolean: value
            }
        });
    }
    
    handleSetOfValueChange =(value) => {
        this.setState(state => {
            return {
                ...state,
                setOfValue: value
            }
        });
    }
    static getDerivedStateFromProps(nextProps, prevState){
        if (nextProps.task !== prevState.task) {
            return {
                ...prevState,
                // TODO: ve sau can sửa
                // id: nextProps.id,
                // kpi: nextProps.kpi,
                // date: nextProps.date,
                // point: nextProps.point,

                task: nextProps.task,
                errorOnInfoDate: undefined,
                errorOnProgress: undefined
            } 
        } else {
            return null;
        }
    }
    render() {
        // var { id, items} = this.props;
        // const { translate, tasks, performtasks, KPIPersonalManager, kpimembers } = this.props;
        const { progress, infoDate, infoBoolean, setOfValue } = this.state;
        const { errorOnProgress, errorOnInfoDate } = this.state;
        var task = this.props.task
        return (
            <React.Fragment>
                <div>
                    {/* {
                        items.map((item, index)=> 
                            <div className={`form-group `}>
                                <label>{item.name}(<span style={{color:"red"}}>*</span>)</label>
                                <input 
                                    className="form-control"
                                    type="text" 
                                    ref={`${item.code}`}
                                    name={item.code}
                                    placeholder={85}
                                    onChange={ () => {} }
                                    value={this.state.value}
                                />
                                // <ErrorLabel content={errorOnProgress}/> 
                            </div>
                        )
                    } */}
                    <fieldset className="scheduler-border">
                            <legend className="scheduler-border">Thông tin đánh giá công việc tháng này</legend>
                            {/* information task */}
                            <div className={`form-group ${errorOnProgress===undefined?"":"has-error"}`}>
                                <label>Mức độ hoàn thành (<span style={{color:"red"}}>*</span>)</label>
                                <input 
                                    className="form-control"
                                    type="number" 
                                    name="progress"
                                    placeholder={85}
                                    onChange={this.handleChangeProgress}
                                    value={progress}
                                />
                                <ErrorLabel content={errorOnProgress}/>
                                
                            </div>
                            {/* type: {
                                type: String,
                                required: true,
                                enum: ['Text', 'Boolean', 'Date', 'Number', 'SetOfValues'],
                            }, */}
                            {
                                (task && task.taskInformations.length !== 0) &&
                                task.taskInformations.map((info, index)=> 
                                {
                                   
                                
                                    if (info.type === 'Text'){
                                        return <div className={`form-group `}>
                                            <label>{info.name}(<span style={{color:"red"}}>*</span>)</label>
                                            <input 
                                                className="form-control"
                                                type="text" 
                                                name={info.code}
                                                placeholder={85}
                                                // onChange={this.handleChangeProgress}
                                                // value={index}
                                            />
                                            {/* <ErrorLabel content={errorOnProgress}/> */}
                                        </div>
                                    } 
                                     
                                    {
                                    if (info.type === 'Number') { 
                                        return <div className={`form-group `}>
                                            <label>{info.name}(<span style={{color:"red"}}>*</span>)</label>
                                            <input 
                                                className="form-control"
                                                type="number" 
                                                name={info.code}
                                                placeholder={85}
                                                // onChange={this.handleChangeProgress}
                                                // value={index}
                                            />
                                            {/* <ErrorLabel content={errorOnProgress}/> */}
                                        </div>
                                    }}
                                    
                                    {if (info.type === 'Date') {
                                     return <div className={`form-group `}>
                                            <label>{info.name}(<span style={{color:"red"}}>*</span>)</label>
                                            <DatePicker
                                                id={`info_date_${index}`}
                                                value={infoDate}
                                                onChange={this.handleInfoDateChange}
                                            />
                                            <ErrorLabel content={errorOnInfoDate} />
                                        </div>
                                    }}
                                    
                                    {if(info.type === 'Boolean'){
                                    return <div className={`form-group `}>
                                            <label>{info.name}(<span style={{color:"red"}}>*</span>)</label>
                                            {
                                                <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                                    id={`select-boolean-${index}`}
                                                    className="form-control select2"
                                                    style={{width: "100%"}}
                                                    items = {[{ value: true, text: 'Đúng' }, { value: false, text: 'Sai' } ]}
                                                    onChange={this.handleInfoBooleanChange}
                                                    // multiple={true}
                                                    value={infoBoolean}
                                                />
                                            }
                                        </div>
                                    }}
                                    
                                    {if(info.type === 'SetOfValues') {
                                    return <div className={`form-group `}>
                                            <label>{info.name}(<span style={{color:"red"}}>*</span>)</label>
                                            <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                                id={`select-set-of-value-${index}`}
                                                className="form-control select2"
                                                style={{width: "100%"}}
                                                items = {info.extra.split('\n').map(x => { return { value: x, text: x } })}
                                                onChange={this.handleSetOfValueChange}
                                                multiple={true}
                                                value={setOfValue}
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