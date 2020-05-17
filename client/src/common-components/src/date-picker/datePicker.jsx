import React, { Component } from 'react';
import './bootstrap-datepicker.min.css';
import { scriptDatePicker } from './bootstrap-datepicker.min';

class DatePicker extends Component {
    constructor(props) {
        super(props);
        this.state = {}

        if (document.getElementById("script-date-picker") === null) {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.id = "script-date-picker";
            script.innerHTML = scriptDatePicker;
            document.body.appendChild(script);
        }
    }
    componentDidMount() {
        const { id, dateFormat, onChange } = this.props;
        dateFormat !== "month-year" ?
            window.$("#" + id).datepicker({
                autoclose: true,
                format: "dd-mm-yyyy",
                todayHighlight: true,
            }):
            window.$("#" + id).datepicker({
                autoclose: true,
                format: "mm-yyyy",
                startView: 1,
                minViewMode: "months",
            });
        window.$("#" + id).keyup(function (e) {
            if (e.keyCode == 8 || e.keyCode == 46) {
                window.$("#" + id).datepicker('update', "");
            }
        });
        window.$("#" + id).on("change", () => {
            let value = this.refs.datePicker.value;
            this.setState({
                value: value
            })
            onChange(value); // Thông báo lại cho parent component về giá trị mới (để parent component lưu vào state của nó)
        });
    }

    componentDidUpdate() {
        const { id, dateFormat } = this.props;
        dateFormat !== "month-year" ?
            window.$("#" + id).datepicker({
                autoclose: true,
                format: "dd-mm-yyyy",
                todayHighlight: true,
            }) :
            window.$("#" + id).datepicker({
                autoclose: true,
                format: "mm-yyyy",
                startView: 1,
                minViewMode: "months",
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
        if (nextProps.id !== this.state.id) // Chỉ render 1 lần, trừ khi id thay đổi
            return true;
        return false;  // Tự chủ động update (do đã lưu value vào state)
    }

    render() {
        const { id, dateFormat, disabled = false } = this.props;
        return (
            <React.Fragment>
                <div className={'input-group date has-feedback'} id={id}>
                    <div className="input-group-addon">
                        <i className="fa fa-calendar" />
                    </div>
                    <input type="text" className="form-control" value={this.state.value} ref="datePicker" onChange={() => { }} disabled={disabled} />
                </div>
            </React.Fragment>
        );
    }
}

export { DatePicker as DatePicker };