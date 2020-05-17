import React, { Component } from 'react';
import { DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../common-components/index';
import { withTranslate } from 'react-redux-multilingual';
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
    validateProgress = (value) => {
        var { translate } = this.props;
        let msg = undefined;
        if (value < 0 || value > 100) {
            // msg = translate('task.task_perform.modal_approve_task.err_range');
            msg = 'Giá trị phải thuộc khoảng 0-100';
        }
        if (isNaN(value)) {
            // msg = translate('task.task_perform.modal_approve_task.err_empty');
            msg = 'Giá trị không được để trống';
        }
        return msg;
    }

    validateNumberInfo = (value) => {
        var { translate } = this.props;
        let msg = undefined;
        
        if (isNaN(value)) {
            // msg = translate('task.task_perform.modal_approve_task.err_empty');
            msg = 'Giá trị không được để trống';
        }
        return msg;
    }

    handleChangeProgress = async (e) => {
        var value = parseInt(e.target.value);
        await this.setState(state =>{
            return {
                ...state,
                progress: value,
                errorOnProgress: this.validateProgress(value)
            }
        })
        await this.props.handleChangeProgress()
        // document.getElementById("autoPoint").innerHTML = value;
    } 

    handleChangeNumberInfo = async (e) => {
        var value = parseInt(e.target.value);
        var name = e.target.name;
        await this.setState(state =>{
            return {
                ...state,
                [name]: value,
                errorOnNumberInfo: this.validateNumberInfo(value)
            }
        })
        await this.props.handleChangeNumberInfo(e);
    } 

    handleChangeTextInfo = async (e) => {
        var value = e.target.value;
        var name = e.target.name;
        await this.setState(state =>{
            return {
                ...state,
                [name]: value,
                // errorOnProgress: this.validateTextInfo(value)
            }
        })
        await this.props.handleChangeTextInfo(e);
    } 

    validateTextInfo = (value) =>{
        let msg = undefined;
        if(value === ""){
            msg = "Giá trị không được để trống"
        }
        return msg;
    }

    handleInfoDateChange = async (value) => {
        await this.setState(state => {
            return {
                ...state,
                errorOnInfoDate: this.validateDate(value),
                infoDate: value,
            }
        });
        await this.props.handleInfoDateChange(value)
    }

    validateDate = (value, willUpdateState = true) => {
        let msg = undefined;
        if (value.trim() === "") {
            msg = "Ngày đánh giá bắt buộc phải chọn";
        }
        
        return msg;
    }

    validateInfoBoolean = (value, willUpdateState = true) => {
        let msg = undefined;
        if (value === "") {
            msg = "Giá trị bắt buộc phải chọn";
        }
        
        return msg;
    }

    handleInfoBooleanChange  = async (value) => {
        await this.setState(state => {
            return {
                ...state,
                infoBoolean: value,
                errorOnInfoBoolean: this.validateInfoBoolean(value)
            }
        });
        await this.props.handleInfoBooleanChange(value)
    }
    
    handleSetOfValueChange = async (value) => {
        await this.setState(state => {
            return {
                ...state,
                setOfValue: value
            }
        });
        await this.props.handleSetOfValueChange(value)
    }
    static getDerivedStateFromProps(nextProps, prevState){
        console.log('Children nextProps, prevState', nextProps, prevState);
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
        // const { errorOnProgress, errorOnInfoDate } = this.state;
        const { errorOnProgress, errorOnInfoDate, errorOnInfoBoolean, errorOnTextInfo, errorOnNumberInfo } = this.props;

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
                                    onChange={this.props.handleChangeProgress}
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
                                        return <div className={`form-group ${errorOnTextInfo === undefined ? "" : "has-error"}`}>
                                            <label>{info.name}(<span style={{color:"red"}}>*</span>)</label>
                                            <input 
                                                className="form-control"
                                                type="text" 
                                                name={info.code}
                                                placeholder={85}
                                                onChange={this.props.handleChangeTextInfo}
                                                value={info.value}
                                            />
                                            <ErrorLabel content={errorOnTextInfo}/>
                                        </div>
                                    } 
                                     
                                    {
                                    if (info.type === 'Number') { 
                                        return <div className={`form-group ${errorOnNumberInfo === undefined ? "" : "has-error"}`}>
                                            <label>{info.name}(<span style={{color:"red"}}>*</span>)</label>
                                            <input 
                                                className="form-control"
                                                type="number" 
                                                name={info.code}
                                                placeholder={85}
                                                onChange={this.props.handleChangeNumberInfo}
                                                value={info.value}
                                            />
                                            <ErrorLabel content={errorOnNumberInfo}/>
                                        </div>
                                    }}
                                    
                                    {if (info.type === 'Date') {
                                     return <div className={`form-group ${errorOnInfoDate === undefined ? "" : "has-error"}`}>
                                            <label>{info.name}(<span style={{color:"red"}}>*</span>)</label>
                                            <DatePicker
                                                id={`info_date_${index}`}
                                                value={infoDate}
                                                onChange={this.props.handleInfoDateChange}
                                            />
                                            <ErrorLabel content={errorOnInfoDate} />
                                        </div>
                                    }}
                                    
                                    {if(info.type === 'Boolean'){
                                    return <div className={`form-group ${errorOnInfoBoolean === undefined ? "" : "has-error"}`}>
                                            <label>{info.name}(<span style={{color:"red"}}>*</span>)</label>

                                            <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                                id={`select-boolean-${index}`}
                                                className="form-control select2"
                                                style={{width: "100%"}}
                                                items = {[{ value: "", text: 'Chọn giá trị' }, { value: true, text: 'Đúng' }, { value: false, text: 'Sai' } ]}
                                                onChange={this.props.handleInfoBooleanChange}
                                                // multiple={true}
                                                value={infoBoolean}
                                            />
                                            <ErrorLabel content={errorOnInfoBoolean}/>
                                            
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
                                                onChange={this.props.handleSetOfValueChange}
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