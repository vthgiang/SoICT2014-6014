import React, { Component } from 'react';
import './bootstrap-datepicker.min.css';
import { scriptDatePicker } from './bootstrap-datepicker.min';

class datePicker extends Component {
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
        dateFormat !== "month-year" ? window.$("#" + id).datepicker({ autoclose: true }) :
            window.$("#" + id).datepicker({
                autoclose: true,
                startView: 1,
                minViewMode: "months"
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
        dateFormat !== "month-year" ? window.$("#" + id).datepicker({ autoclose: true }) :
            window.$("#" + id).datepicker({
                autoclose: true,
                startView: 1,
                minViewMode: "months"
            });
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                value: nextProps.value, // Lưu value ban đầu vào state
                id: nextProps.id
            }
        } else {
            return null;
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
                <div className={'input-group date has-feedback'} id={id} data-date-format={dateFormat === "month-year" ? "mm-yyyy" : "dd-mm-yyyy"}>
                    <div className="input-group-addon">
                        <i className="fa fa-calendar" />
                    </div>
                    <input type="text" className="form-control" defaultValue={this.state.value} ref="datePicker" onChange={() => { }} disabled={disabled} />
                </div>
            </React.Fragment>
        );
    }
}

export { datePicker as DatePicker };