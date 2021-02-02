import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { managerActions } from '../redux/actions';

import { ErrorLabel, DatePicker, DialogModal } from '../../../../../common-components';

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

    handleNewDateChange = (value) => {
        let month = value.slice(3, 7) + '-' + value.slice(0, 2);

        this.setState(state => {
            return {
                ...state,
                month: month
            }
        });

    }

    handleSubmit = () => {
        const { kpiId, idunit, monthDefault, type = 'default' } = this.props;
        const { month } = this.state;

        if (type === 'default') {
            let data = {  
                idunit: idunit,
                datenew: month
            }

            this.props.copyKPIUnit(kpiId, data);
        } else if (type === 'copy-parent-kpi-to-unit') {
            let data = {  
                idunit: idunit,
                datenew: monthDefault
            }

            this.props.copyKPIUnit(kpiId, data);
        } else if (type === 'copy-parent-kpi-to-employee') {

        }
        
    }

    render() {
        const { kpiunit, translate, kpiId, type = 'default', monthDefault } = this.props;
        const { month, errorOnDate } = this.state;
        
        return (
            <DialogModal
                modalID={`copy-old-kpi-to-new-time-${kpiId}`}
                title={translate('kpi.organizational_unit.management.detail_modal.title_parent') + `${kpiunit && this.formatDate(kpiunit.date)}`}
                size={10}
                func={this.handleSubmit}
            >
                <div className="form-group">
                    <label className="col-sm-3">{translate('kpi.organizational_unit.management.copy_modal.organizational_unit')}</label>
                    <label className="col-sm-9" style={{ fontWeight: "400", marginLeft: "-14.5%" }}>{kpiunit && kpiunit.organizationalUnit.name}</label>
                </div>
                <br/>
                <div className="form-group">
                    <label className="col-sm-3">{translate('kpi.organizational_unit.management.copy_modal.month')}</label>
                    {type === 'default'
                        ? <DatePicker
                            id="new_date"
                            value={month}
                            onChange={this.handleNewDateChange}
                            dateFormat="month-year"
                        />
                        : <label className="col-sm-9" style={{ fontWeight: "400", marginLeft: "-14.5%" }}>{this.formatDate(monthDefault)}</label>
                }
                    <ErrorLabel content={errorOnDate} />
                </div>
                <div className="form-group" >
                    <label className="col-sm-12">{translate('kpi.organizational_unit.management.copy_modal.list_target')}</label>
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