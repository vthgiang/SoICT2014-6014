import React, { Component } from 'react';
const loadJS = () => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = `
    $(function () {
        $('.datepicker.month-year').datepicker({
          autoclose: true,
          startView: 1,
          minViewMode: "months"
        })
        $('.datepicker.day-year').datepicker({
          autoclose: true
        })
    })`;
    document.body.appendChild(script);
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
            <input type="text" className={`form-control ${classDatePicker}`} defaultValue={defaultValue === false ? "" : defaultValue} ref={ref} data-date-format="mm-yyyy" autoComplete="off" />
        </div>
    </React.Fragment>
});
export { datePicker as DatePicker };