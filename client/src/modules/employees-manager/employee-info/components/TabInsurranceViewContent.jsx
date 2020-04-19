import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class TabInsurranceViewContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                BHXH: nextProps.BHXH,
                numberBHYT: nextProps.employee.numberBHYT,
                startDateBHYT: nextProps.employee.startDateBHYT,
                endDateBHYT: nextProps.employee.endDateBHYT,
                numberBHXH: nextProps.employee.numberBHXH,
            }
        } else {
            return null;
        }
    }


    render() {
        const { id, translate } = this.props;
        const { numberBHYT, startDateBHYT, endDateBHYT, numberBHXH, BHXH } = this.state;
        return (
            <div id={id} className="tab-pane">
                <div className="box-body">
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('manage_employee.bhyt')}</h4></legend>
                        <div className="row">
                            <div className="form-group col-md-4" >
                                <strong>{translate('manage_employee.number_BHYT')}&emsp; </strong>
                                {numberBHYT}
                            </div>
                            <div className="form-group col-md-4" >
                                <strong>{translate('manage_employee.start_date')}&emsp; </strong>
                                {startDateBHYT}
                            </div>
                            <div className="form-group col-md-4" >
                                <strong>{translate('manage_employee.end_date_certificate')}&emsp; </strong>
                                {endDateBHYT}
                            </div>
                        </div>
                    </fieldset>
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('manage_employee.bhxh')}</h4></legend>
                        <div className="form-group">
                            <strong>{translate('manage_employee.number_BHXH')}&emsp; </strong>
                            {numberBHXH}
                        </div>
                        <h4 className="col-md-6" style={{ paddingLeft: 0, fontSize: 16 }}>{translate('manage_employee.bhxh_process')}:</h4>
                        <table className="table table-striped table-bordered table-hover " style={{ marginBottom: 0 }} >
                            <thead>
                                <tr>
                                    <th>{translate('manage_employee.from_month_year')}</th>
                                    <th>{translate('manage_employee.to_month_year')}</th>
                                    <th>{translate('manage_employee.unit')}</th>
                                    <th>{translate('table.position')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    (typeof BHXH === 'undefined' || BHXH.length === 0) ? <tr><td colSpan={4}><center> Không có dữ liệu</center></td></tr> :
                                        BHXH.map((x, index) => (
                                            <tr key={index}>
                                                <td>{x.startDate}</td>
                                                <td>{x.endDate}</td>
                                                <td>{x.position}</td>
                                                <td>{x.unit}</td>
                                            </tr>
                                        ))
                                }
                            </tbody>
                        </table>
                        {
                            (typeof BHXH === 'undefined' || BHXH === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </fieldset>
                </div>
            </div>
        );
    }
};

const tabInsurrance = connect(null, null)(withTranslate(TabInsurranceViewContent));
export { tabInsurrance as TabInsurranceViewContent };