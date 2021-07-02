import React, { Component } from 'react';

/**
 * Cần dùng jquery plugin http://jdewit.github.com/bootstrap-timepicker
 */
class TimePicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ""
        }
        this.zIndex = 1050;
    }
    componentDidMount = () => {
        const { id, dateFormat, onChange, deleteValue = true, getDefaultValue } = this.props;
        let zIndex = 1050;
        let time 
        console.log(this.state.value);
        if (this.state.value) {
            let timeValue= this.state.value
            let length = timeValue.length
            time  = [timeValue.slice(0,length-6),timeValue.slice(length-5,length-3),timeValue.slice(length-2,length)]
        }
        window.$("#" + id).timepicki({start_time: time,step_size_minutes:5,on_change:this.onChangeTimePicker})
    
       
        if (getDefaultValue){
            getDefaultValue(window.$("#" + id).val())
        }
    }

    getValue = () => { // Nếu không dùng onChange, có thể gọi phương thức này qua đối tượng ref để lấy các giá trị
        const { id } = this.props;
        return window.$("#" + id).val()
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            ...prevState,
            value: nextProps.value, // Lưu value ban đầu vào state
            id: nextProps.id
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.id !== this.state.id || nextState.value !== this.state.value) // Chỉ render 1 lần, trừ khi id,value thay đổi
            return true;
        return false;  // Tự chủ động update (do đã lưu value vào state)
    }
    onChangeTimePicker = (e) => {
        this.setState({
            value: e.value
        })
        this.props.onChange(e.value);
    }

    render() {
        const { id, disabled = false } = this.props;
        console.log(this.state.value);
        return (
            <React.Fragment>
                <div className="bootstrap-timepicker input-group has-feedback">
                    <span className="input-group-addon">
                        <i style={{ width: 16, height: 16 }} className="fa fa-clock-o"></i>
                    </span>
                    <input  type = "text" id={id} name = "timepicker"  className = "time_element form-control"  value={this.state.value ? this.state.value : "" } disabled={disabled}/>
                </div>
            </React.Fragment>
        );
    }
}

export { TimePicker as TimePicker };