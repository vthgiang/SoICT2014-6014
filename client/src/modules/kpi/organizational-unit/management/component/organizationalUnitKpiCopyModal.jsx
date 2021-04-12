import React, { useEffect, useState} from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { createUnitKpiActions } from '../../creation/redux/actions.js';
import { managerActions } from '../redux/actions';

import { ErrorLabel, DatePicker, DialogModal, SelectBox } from '../../../../../common-components';
import { createKpiUnit } from '../../creation/redux/reducers.js';

function ModalCopyKPIUnit(props){
    const TYPE = {
        DEFAULT: 'default',
        COPY_PARENT_KPI_TO_UNIT: 'copy-parent-kpi-to-unit',
        COPY_PARENT_KPI_TO_EMPLOYEE: 'copy-parent-kpi-to-employee'
    };

    const [state, setState] = useState({

    });

    useEffect(()=>{
        if (props.kpiId !== state.kpiId) {
            let listKpiUnit = {};
            if (props.kpiunit?.kpis?.length > 0) {
                props.kpiunit.kpis.map(item => {
                    listKpiUnit[item._id] = true;
                })
            }
            setState ({
                ...state,
                kpiId: props.kpiId,
                listKpiUnit: listKpiUnit,
                organizationalUnitId: props.kpiunit?.organizationalUnit?._id
            })
        }
    },[props.kpiId])

    useEffect(() => {
        const { type, kpiunit, monthDefault } = props;

        if (type === TYPE.COPY_PARENT_KPI_TO_UNIT) {
            props.getCurrentKPIUnit(null, kpiunit?.organizationalUnit?._id, monthDefault, 'copy')
        }
    },[])

    useEffect(() => {
        const { type } = props;
        const { listKpiUnit } = state;

        if (props.createKpiUnit?.copyKPILoading && listKpiUnit && type === TYPE.COPY_PARENT_KPI_TO_UNIT) {
            setState({
                ...state,
                listKpiUnit: null

            })
        }

        if (!props.createKpiUnit?.copyKPILoading && props.createKpiUnit?.copyKPI && !listKpiUnit && type === TYPE.COPY_PARENT_KPI_TO_UNIT) {
            let listKpiUnitNew = {};
            if (props.createKpiUnit?.copyKPI?.kpis?.length > 0) {
                props.createKpiUnit.copyKPI.kpis.map(item => {
                    listKpiUnitNew[item._id] = true;
                })
            }
            setState({
                ...state,
                listKpiUnit: listKpiUnitNew
            })
        }

    });
    useEffect(() =>{
        setState( {
            ...state,
            kpiId: null,
        })
    },[]);
    useEffect(() =>{
        let listKpiUnit = {};
        if (props.kpiunit?.kpis?.length > 0) {
            props.kpiunit.kpis.map(item => {
                listKpiUnit[item._id] = true;
            })
        }
        setState( {
            ...state,
            kpiId: props.kpiId,
            listKpiUnit: listKpiUnit,
            organizationalUnitId: props.kpiunit?.organizationalUnit?._id
        })
    },[props.kpiId])
    function formatDate(date) {
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
    const handleNewDateChange = (value) => {
        let month = value.slice(3, 7) + '-' + value.slice(0, 2);

        setState({
            ...state,
            month: month
        });

    };

    /** Thay đổi người phê duyệt */
    const handleApproverChange = (value) => {
        setState(  {
            ...state,
            approver: value[0]
        })
    };

    const handleSubmit = () => {
        const { kpiId, idunit, monthDefault, approverDefault, type = TYPE.DEFAULT, kpiunit } = props;
        const { month, approver, listKpiUnit, organizationalUnitId } = state;
        let arrayKpiUnit = listKpiUnit && Object.keys(listKpiUnit);

        if (type === TYPE.DEFAULT) {
            let data = {
                type: TYPE.DEFAULT,
                idunit: idunit,
                datenew: month,
                listKpiUnit: arrayKpiUnit?.filter(item => listKpiUnit?.[item])
            }

            props.copyKPIUnit(kpiId, data);
        } else if (type === TYPE.COPY_PARENT_KPI_TO_UNIT) {
            let data = {
                type: TYPE.COPY_PARENT_KPI_TO_UNIT,
                idunit: idunit,
                organizationalUnitIdCopy: organizationalUnitId,
                datenew: monthDefault,
                listKpiUnit: arrayKpiUnit?.filter(item => listKpiUnit?.[item]),
                matchParent: kpiunit?.organizationalUnit?._id === organizationalUnitId
            }

            props.copyKPIUnit(kpiId, data);
        } else if (type === TYPE.COPY_PARENT_KPI_TO_EMPLOYEE) {
            let data = {
                type: TYPE.COPY_PARENT_KPI_TO_EMPLOYEE,
                idunit: idunit,
                datenew: monthDefault,
                approver: approver ? approver : (approverDefault?.[1]?.value?.[0]?.value ? approverDefault?.[1]?.value?.[0]?.value : approverDefault?.[0]?.value?.[0]?.value),
                listKpiUnit: arrayKpiUnit?.filter(item => listKpiUnit?.[item])
            }

            props.copyKPIUnit(kpiId, data);
        }

    };

    const handleKpiUnit = (id) => {
        let listKpiUnit = state.listKpiUnit;
        if (listKpiUnit) {
            listKpiUnit[id] = !listKpiUnit[id];
        }

        setState( {
            ...state,
            listKpiUnit: listKpiUnit

        })
    };

    const handleSelectOrganizationalUnit = (value) => {
        const { monthDefault } = props;

        setState({
            ...state,
            organizationalUnitId: value[0]
        })

        props.getCurrentKPIUnit(null, value[0], monthDefault, 'copy')
    };

    const { translate, createKpiUnit } = props;
    const { kpiunit, kpiId, type = TYPE.DEFAULT, monthDefault, approverDefault, organizationalUnitSelect } = props;
    const { month, errorOnDate, approver, listKpiUnit, organizationalUnitId } = state;

    let listKpi = type === TYPE.COPY_PARENT_KPI_TO_UNIT ? createKpiUnit?.copyKPI : kpiunit;

    return (
        <DialogModal
            modalID={`copy-old-kpi-to-new-time-${kpiId}`}
            title={translate('kpi.organizational_unit.create_organizational_unit_kpi_set.copy_kpi_unit')}
            size={10}
            func={handleSubmit}
            disableSubmit={!listKpi?.kpis?.length}
        >
            {/* Đơn vị */}
            <div className="form-group" style={{ marginLeft: "10px" }}>
                <label style={{ marginRight: "10px"}}>{translate('kpi.organizational_unit.management.copy_modal.organizational_unit')}</label>
                { organizationalUnitSelect && type === TYPE.COPY_PARENT_KPI_TO_UNIT
                    ? <SelectBox
                        id={`organizationalUnitSelectBoxInOrganizationalUnitKpiCopy`}
                        className="form-control select2"
                        style={{ width: "100%" }}
                        items={organizationalUnitSelect?.length > 0
                        && organizationalUnitSelect.map(item => { return { value: item.id, text: item.name } })
                        }
                        multiple={false}
                        onChange={handleSelectOrganizationalUnit}
                        value={organizationalUnitId}
                    />
                    : <span>{kpiunit?.organizationalUnit?.name}</span>
                }
            </div>

            {/* Chọn tháng */}
            <div className="form-group" style={{ marginLeft: "10px" }}>
                <label style={{ marginRight: "10px"}}>{translate('kpi.organizational_unit.management.copy_modal.month')}</label>
                {type === TYPE.DEFAULT
                    ? <DatePicker
                        id="new_date"
                        value={month}
                        onChange={handleNewDateChange}
                        dateFormat="month-year"
                    />
                    : <span>{formatDate(monthDefault)}</span>
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
                    onChange={handleApproverChange}
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
                            return <li key={item._id}><input type="checkbox" checked={listKpiUnit?.[item?._id]} disabled={item?.type !== 0} onChange={item?.type !== 0 ? null : () => handleKpiUnit(item?._id)}></input><span>{item.name + " (" + item.weight + ")"}</span></li>
                        })
                        }
                    </ul>
                    : <div>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.not_initialize')} {formatDate(monthDefault)}</div>
                }
            </div>
        </DialogModal >
    );
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
