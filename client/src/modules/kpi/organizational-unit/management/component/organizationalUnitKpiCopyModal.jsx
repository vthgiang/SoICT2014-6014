import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { managerActions } from '../redux/actions';

import { ErrorLabel, DatePicker, DialogModal, SelectBox } from '../../../../../common-components';

class ModalCopyKPIUnit extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    formatDate(date) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [month, year].join('-');
    }

    /** Thay đổi ngày tháng */
    handleNewDateChange = (value) => {
        let month = value.slice(3, 7) + '-' + value.slice(0, 2);

        this.setState(state => {
            return {
                ...state,
                month: month
            }
        });

    }

    /** Thay đổi người phê duyệt */
    handleApproverChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                approver: value[0]
            }
        })
    }

    handleSubmit = () => {
        const { kpiId, idunit, monthDefault, approverDefault, type = 'default' } = this.props;
        const { month, approver } = this.state;
      
        if (type === 'default') {
            let data = {  
                type: 'default',
                idunit: idunit,
                datenew: month
            }

            this.props.copyKPIUnit(kpiId, data);
        } else if (type === 'copy-parent-kpi-to-unit') {
            let data = {  
                type: 'copy-parent-kpi-to-unit',
                idunit: idunit,
                datenew: monthDefault
            }

            this.props.copyKPIUnit(kpiId, data);
        } else if (type === 'copy-parent-kpi-to-employee') {
            let data = {  
                type: 'copy-parent-kpi-to-employee',
                idunit: idunit,
                datenew: monthDefault,
                approver: approver ? approver : (approverDefault?.[1]?.value?.[0]?.value ? approverDefault?.[1]?.value?.[0]?.value : approverDefault?.[0]?.value?.[0]?.value)
            }

            this.props.copyKPIUnit(kpiId, data);
        }
        
    }

    render() {
        const { kpiunit, translate, kpiId, type = 'default', monthDefault, approverDefault } = this.props;
        const { month, errorOnDate, approver } = this.state;
        
        return (
            <DialogModal
                modalID={`copy-old-kpi-to-new-time-${kpiId}`}
                title={translate('kpi.organizational_unit.management.detail_modal.title_parent') + `${kpiunit && this.formatDate(kpiunit.date)}`}
                size={10}
                func={this.handleSubmit}
            >
                {/* Đơn vị */}
                <div className="form-group">
                    <label style={{ margin: "0px 10px"}}>{translate('kpi.organizational_unit.management.copy_modal.organizational_unit')}</label>
                    <span>{kpiunit && kpiunit.organizationalUnit.name}</span>
                </div>

                {/* Chọn tháng */}
                <div className="form-group" style={{ marginLeft: "10px" }}>
                    <label style={{ marginRight: "10px"}}>{translate('kpi.organizational_unit.management.copy_modal.month')}</label>
                    {type === 'default'
                        ? <DatePicker
                            id="new_date"
                            value={month}
                            onChange={this.handleNewDateChange}
                            dateFormat="month-year"
                        />
                        : <span>{this.formatDate(monthDefault)}</span>
                    }
                    <ErrorLabel content={errorOnDate} />
                </div>
                
                {/* CHọn người phê duyệt */}
                {approverDefault
                    && <div className="form-group" style={{ margin: "0px 10px"}}>
                        <label>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set_modal.approver')}</label>
                        <SelectBox
                            id={`copy-kpi-unit-approver`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={approverDefault}
                            multiple={false}
                            onChange={this.handleApproverChange}
                            value={approver ? approver : approverDefault?.[1]?.value?.[0]?.value}
                        />
                        <br/>
                    </div>
                }

                <div className="form-group"  style={{ margin: "0px 10px"}}>
                    <label>{translate('kpi.organizational_unit.management.copy_modal.list_target')}</label>
                    <ul>
                        {kpiunit && typeof kpiunit && kpiunit.kpis.length &&
                            kpiunit.kpis.map(item => {
                                return <li key={item._id}>{item.name + " (" + item.weight + ")"}</li>
                            })
                        }
                    </ul>
                </div>
            </DialogModal >
        );
    }
}

function mapState(state) {
    const { managerKpiUnit } = state;
    return { managerKpiUnit };
}

const actionCreators = {
    copyKPIUnit: managerActions.copyKPIUnit
};
const connectedModalCopyKPIUnit = connect(mapState, actionCreators)(withTranslate(ModalCopyKPIUnit));
export { connectedModalCopyKPIUnit as ModalCopyKPIUnit };