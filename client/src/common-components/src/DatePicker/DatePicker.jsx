import React, { Component } from 'react';
import './bootstrap-datepicker.min.css';
import {scriptDatePicker} from './bootstrap-datepicker.min';
const loadJS = () => {
    if (document.getElementById("script-date-picker") === null) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.id = "script-date-picker";
        script.innerHTML = scriptDatePicker;
        document.body.appendChild(script);
    }
}
const datePicker = React.forwardRef((props, ref) => {
    loadJS();

    /* classDataPicker ==="datepicker month-year" là các datepicker hiện thị tháng năm
     * classDataPicker === "datepicker month-year" là các datepicker hiện thị ngày tháng năm
    */
    var { nameLabel, classDatePicker, defaultValue } = props;
    return <React.Fragment>
        <label className="form-control-static">{nameLabel}:</label>
        <div className={'input-group date has-feedback'}>
            <div className="input-group-addon">
                <i className="fa fa-calendar" />
            </div>
            <input type="text" className={`form-control ${classDatePicker}`} defaultValue={defaultValue === false ? "" : defaultValue} ref={ref} data-date-format={classDatePicker === "datepicker month-year" ? "mm-yyyy" : "dd-mm-yyyy"} autoComplete="off" />
        </div>
    </React.Fragment>
});
export { datePicker as DatePicker };