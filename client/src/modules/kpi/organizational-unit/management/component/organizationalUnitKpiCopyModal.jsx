import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { createUnitKpiActions } from '../../creation/redux/actions.js';
import { managerActions } from '../redux/actions';

import { ErrorLabel, DatePicker, DialogModal, SelectBox } from '../../../../../common-components';
import { createKpiUnit } from '../../creation/redux/reducers.js';

class ModalCopyKPIUnit extends Component {
    constructor(props) {
        super(props);
        this.TYPE = {
            DEFAULT: 'default',
            COPY_PARENT_KPI_TO_UNIT: 'copy-parent-kpi-to-unit',
            COPY_PARENT_KPI_TO_EMPLOYEE: 'copy-parent-kpi-to-employee'
        }
        this.state = {
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (props.kpiId !== state.kpiId) {
            let listKpiUnit = {};
            if (props.kpiunit?.kpis?.length > 0) {
                props.kpiunit.kpis.map(item => {
                    listKpiUnit[item._id] = true;
                })
            }

            return {
                ...state,
                kpiId: props.kpiId,
                listKpiUnit: listKpiUnit,
                organizationalUnitId: props.kpiunit?.organizationalUnit?._id
            }
        } else {
            return null
        }
    }

    componentDidMount() {
        const { type, kpiunit, monthDefault } = this.props;

        if (type === this.TYPE.COPY_PARENT_KPI_TO_UNIT) {
            this.props.getCurrentKPIUnit(null, kpiunit?.organizationalUnit?._id, monthDefault, 'copy')
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { type } = this.props;
        const { listKpiUnit } = this.state;

        if (nextProps.createKpiUnit?.copyKPILoading && listKpiUnit && type === this.TYPE.COPY_PARENT_KPI_TO_UNIT) {
            this.setState(state => {
                return {
                    ...state,
                    listKpiUnit: null
                }
            })
        }

        if (!nextProps.createKpiUnit?.copyKPILoading && nextProps.createKpiUnit?.copyKPI && !listKpiUnit && type === this.TYPE.COPY_PARENT_KPI_TO_UNIT) {
            let listKpiUnitNew = {};
            if (nextProps.createKpiUnit?.copyKPI?.kpis?.length > 0) {
                nextProps.createKpiUnit.copyKPI.kpis.map(item => {
                    listKpiUnitNew[item._id] = true;
                })
            }

            this.setState(state => {
                return {
                    ...state,
                    listKpiUnit: listKpiUnitNew
                }
            })
        }

        return true;
    }

    componentWillUnmount = () => {
        this.setState(state => {
            return {
                ...state,
                kpiId: null,
            }
        })
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
        const { kpiId, idunit, monthDefault, approverDefault, type = this.TYPE.DEFAULT, kpiunit } = this.props;
        const { month, approver, listKpiUnit, organizationalUnitId } = this.state;
        let arrayKpiUnit = Object.keys(listKpiUnit);
        
        if (type === this.TYPE.DEFAULT) {
            let data = {  
                type: this.TYPE.DEFAULT,
                idunit: idunit,
                datenew: month,
                listKpiUnit: arrayKpiUnit.filter(item => listKpiUnit?.[item])
            }

            this.props.copyKPIUnit(kpiId, data);
        } else if (type === this.TYPE.COPY_PARENT_KPI_TO_UNIT) {
            let data = {  
                type: this.TYPE.COPY_PARENT_KPI_TO_UNIT,
                idunit: idunit,
                organizationalUnitIdCopy: organizationalUnitId,
                datenew: monthDefault,
                listKpiUnit: arrayKpiUnit.filter(item => listKpiUnit?.[item]),
                matchParent: kpiunit?.organizationalUnit?._id === organizationalUnitId
            }

            this.props.copyKPIUnit(kpiId, data);
        } else if (type === this.TYPE.COPY_PARENT_KPI_TO_EMPLOYEE) {
            let data = {  
                type: this.TYPE.COPY_PARENT_KPI_TO_EMPLOYEE,
                idunit: idunit,
                datenew: monthDefault,
                approver: approver ? approver : (approverDefault?.[1]?.value?.[0]?.value ? approverDefault?.[1]?.value?.[0]?.value : approverDefault?.[0]?.value?.[0]?.value),
                listKpiUnit: arrayKpiUnit.filter(item => listKpiUnit?.[item])
            }

            this.props.copyKPIUnit(kpiId, data);
        }
        
    }

    handleKpiUnit = (id) => {
        let listKpiUnit = this.state.listKpiUnit;
        if (listKpiUnit) {
            listKpiUnit[id] = !listKpiUnit[id];
        }

        this.setState(state => {
            return {
                ...state,
                listKpiUnit: listKpiUnit
            }
        })
    }

    handleSelectOrganizationalUnit = (value) => {
        const { monthDefault } = this.props;

        this.setState(state => {
            return {
                ...state,
                organizationalUnitId: value[0]
            }
        })

        this.props.getCurrentKPIUnit(null, value[0], monthDefault, 'copy')
    }

    render() {
        const { translate, createKpiUnit } = this.props;
        const { kpiunit, kpiId, type = this.TYPE.DEFAULT, monthDefault, approverDefault, organizationalUnitSelect } = this.props;
        const { month, errorOnDate, approver, listKpiUnit, organizationalUnitId } = this.state;
        
        let listKpi = type === this.TYPE.COPY_PARENT_KPI_TO_UNIT ? createKpiUnit?.copyKPI : kpiunit;

        return (
            <DialogModal
                modalID={`copy-old-kpi-to-new-time-${kpiId}`}
                title={translate('kpi.organizational_unit.create_organizational_unit_kpi_set.copy_kpi_unit')}
                size={10}
                func={this.handleSubmit}
            >
                {/* Đơn vị */}
                <div className="form-group" style={{ marginLeft: "10px" }}>
                    <label style={{ marginRight: "10px"}}>{translate('kpi.organizational_unit.management.copy_modal.organizational_unit')}</label>
                    { organizationalUnitSelect && type === this.TYPE.COPY_PARENT_KPI_TO_UNIT
                        ? <SelectBox
                            id={`organizationalUnitSelectBoxInOrganizationalUnitKpiCopy`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={organizationalUnitSelect?.length > 0 
                                && organizationalUnitSelect.map(item => { return { value: item.id, text: item.name } })
                            }
                            multiple={false}
                            onChange={this.handleSelectOrganizationalUnit}
                            value={organizationalUnitId}
                        />
                        : <span>{kpiunit?.organizationalUnit?.name}</span>
                    }
                </div>

                {/* Chọn tháng */}
                <div className="form-group" style={{ marginLeft: "10px" }}>
                    <label style={{ marginRight: "10px"}}>{translate('kpi.organizational_unit.management.copy_modal.month')}</label>
                    {type === this.TYPE.DEFAULT
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
                    {listKpi?.kpis?.length > 0 
                        ? <ul style={{ listStyle: "none" }}>
                            { listKpi.kpis.map(item => {
                                    return <li key={item._id}><input type="checkbox" checked={listKpiUnit?.[item?._id]} disabled={item?.type !== 0} onChange={item?.type !== 0 ? null : () => this.handleKpiUnit(item?._id)}></input><span>{item.name + " (" + item.weight + ")"}</span></li>
                                })
                            }
                        </ul>
                        : <div>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.not_initialize')} {this.formatDate(monthDefault)}</div>
                    }
                </div>
            </DialogModal >
        );
    }
}

function mapState(state) {
    const { managerKpiUnit, createKpiUnit } = state;
    return { managerKpiUnit, createKpiUnit };
}

const actionCreators = {
    copyKPIUnit: managerActions.copyKPIUnit,
    getCurrentKPIUnit: createUnitKpiActions.getCurrentKPIUnit
};
const connectedModalCopyKPIUnit = connect(mapState, actionCreators)(withTranslate(ModalCopyKPIUnit));
export { connectedModalCopyKPIUnit as ModalCopyKPIUnit };