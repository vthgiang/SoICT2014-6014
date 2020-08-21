import React, { Component } from 'react';

/**
 * Cần dùng jquery plugin https://github.com/uxsolutions/bootstrap-datepicker
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
        const { id, dateFormat, onChange, deleteValue = true } = this.props;
        let zIndex = 1050;
        window.$("#" + id).timepicker({
            template: "modal",
            minuteStep: 5,
        })
        window.$("#" + id).on("change", () => {
            let value = this.refs.timePicker.value;
            this.setState({
                value: value
            })
            onChange(value); // Thông báo lại cho parent component về giá trị mới (để parent component lưu vào state của nó)
        });
    }

    componentDidUpdate = () => {
        const { id, dateFormat } = this.props;
        window.$("#" + id).timepicker({
            minuteStep: 5,
            template: "modal"
        })
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        // if (nextProps.id !== prevState.id) {
        //     return {
        //         value: nextProps.value, // Lưu value ban đầu vào state
        //         id: nextProps.id
        //     }
        // } else {
        //     return null;
        // }

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

    render() {
        const { id, dateFormat, disabled = false } = this.props;
        return (
            <React.Fragment>
                <div className="bootstrap-timepicker" id={id}>
                    <div className="form-group">
                        <div className="input-group">
                            <input type="text" id="timepicker" className="form-control timepicker" value={this.state.value ? this.state.value : ""} ref="timePicker" />
                            <div className="input-group-addon">
                                <i className="fa fa-clock-o"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export { TimePicker as TimePicker };