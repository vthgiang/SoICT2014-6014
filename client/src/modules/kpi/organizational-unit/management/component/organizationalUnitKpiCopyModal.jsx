import React, { Component } from 'react';
import { connect } from 'react-redux';
import { managerActions } from '../redux/actions';
import { withTranslate } from 'react-redux-multilingual';
import Swal from 'sweetalert2';
import { ErrorLabel, DatePicker, DialogModal } from '../../../../../common-components';
import {
    getStorage
} from '../../../../../config';


class ModalCopyKPIUnit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            kpiunit: {
                unit: "",
                date: this.formatDate(Date.now()),
                creator: "",
            }
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
        const { kpiId, kpiunit, idunit } = this.props;

        this.setState(state => {
            return {
                ...state,
                kpiunit: {
                    ...state.kpiunit,
                    unit: kpiunit.organizationalUnit._id,
                    kpis: kpiunit.kpis
                }
            }
        })

        let data = {  
            idunit: idunit,
            datenew: this.state.month
        }
        console.log(data)
        this.props.copyKPIUnit(kpiId, data);
    }

    render() {
        const { kpiunit, listkpi, idunit, translate, kpiId } = this.props;
        const { month, errorOnDate } = this.state;
        
        return (
            <DialogModal
                modalID={`copy-old-kpi-to-new-time-${kpiunit._id}`}
                title={translate('kpi.organizational_unit.management.copy_modal.create')+ `${this.formatDate(kpiunit.date)}`}
                size={10}
                func={this.handleSubmit}
            >
                <div className="form-group">
                    <label className="col-sm-4">{translate('kpi.organizational_unit.management.copy_modal.organizational_unit')}</label>
                    <label className="col-sm-9" style={{ fontWeight: "400", marginLeft: "-14.5%" }}>{kpiunit && kpiunit.organizationalUnit.name}</label>
                </div>
                <br/>
                <div className="form-group">
                    <label className="col-sm-2">{translate('kpi.organizational_unit.management.copy_modal.month')}</label>
                    <DatePicker
                        id="new_date"
                        value={month}
                        onChange={this.handleNewDateChange}
                        dateFormat="month-year"
                    />
                    <ErrorLabel content={errorOnDate} />
                </div>
                <div className="form-group" >
                    <label className="col-sm-12">{translate('kpi.organizational_unit.management.copy_modal.list_target')}</label>
                    <ul>
                        {typeof kpiunit && kpiunit.kpis.length &&
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