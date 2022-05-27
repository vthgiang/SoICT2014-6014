import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DatePicker, DialogModal, ErrorLabel, SelectBox } from '../../../../../common-components';
import { createUnitKpiActions } from '../../creation/redux/actions.js';
import { managerActions } from '../redux/actions';



function ModalCopyKPIUnit(props) {
    const TYPE = {
        DEFAULT: 'default',
        COPY_PARENT_KPI_TO_UNIT: 'copy-parent-kpi-to-unit',
        COPY_PARENT_KPI_TO_EMPLOYEE: 'copy-parent-kpi-to-employee'
    };
    const { translate, createKpiUnit } = props;
    const { kpiId, idunit, monthDefault, approverDefault, type = TYPE.DEFAULT, kpiunit, organizationalUnitSelect } = props;

    const [state, setState] = useState({
        kpiId: undefined
    });
    const { month, errorOnDate, approver, listKpiUnit, organizationalUnitId } = state;

    if (props.kpiId !== state.kpiId) {
        let listKpiUnit = {};
        if (props.kpiunit?.kpis?.length > 0) {
            props.kpiunit.kpis.map(item => {
                listKpiUnit[item._id] = true;
            })
        }

        setState({
            ...state,
            kpiId: props.kpiId,
            listKpiUnit: listKpiUnit,
            organizationalUnitId: props.kpiunit?.organizationalUnit?._id ?? organizationalUnitSelect?.[0]?.id,  // trường hợp không có đơn vị cha
            month: props.monthDefault
        })
    }

    useEffect(() => {
        if (type !== TYPE.DEFAULT) {
            props.getCurrentKPIUnit(null, kpiunit?.organizationalUnit?._id, monthDefault, 'copy')
        }
    }, [])

    useEffect(() => {
        const { listKpiUnit } = state;

        if (props.createKpiUnit?.copyKPILoading && listKpiUnit && type !== TYPE.DEFAULT) {
            setState({
                ...state,
                listKpiUnit: null

            })
        }

        if (!props.createKpiUnit?.copyKPILoading && props.createKpiUnit?.copyKPI && !listKpiUnit && type !== TYPE.DEFAULT) {
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

    useEffect(() => {
        let listKpiUnit = {};
        if (props.kpiunit?.kpis?.length > 0) {
            props.kpiunit.kpis.map(item => {
                listKpiUnit[item._id] = true;
            })
        }
        setState({
            ...state,
            kpiId: props.kpiId,
            listKpiUnit: listKpiUnit,
            organizationalUnitId: props.kpiunit?.organizationalUnit?._id ?? organizationalUnitSelect?.[0]?.id   // trường hợp không có đơn vị cha
        })
    }, [props.kpiId])

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

        if (type !== TYPE.DEFAULT) {
            props.getCurrentKPIUnit(null, organizationalUnitId, month, 'copy')
        }
    };

    /** Thay đổi người phê duyệt */
    const handleApproverChange = (value) => {
        setState({
            ...state,
            approver: value[0]
        })
    };

    const handleSubmit = () => {
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

            props.copyKPIUnit(createKpiUnit?.copyKPI?._id, data);
        } else if (type === TYPE.COPY_PARENT_KPI_TO_EMPLOYEE) {
            let data = {
                type: TYPE.COPY_PARENT_KPI_TO_EMPLOYEE,
                idunit: idunit,
                datenew: monthDefault,
                approver: approver ? approver : (approverDefault?.[1]?.value?.[0]?.value ? approverDefault?.[1]?.value?.[0]?.value : approverDefault?.[0]?.value?.[0]?.value),
                listKpiUnit: arrayKpiUnit?.filter(item => listKpiUnit?.[item])
            }

            props.copyKPIUnit(createKpiUnit?.copyKPI?._id, data);
        }

    };

    const handleKpiUnit = (id) => {
        let listKpiUnit = state.listKpiUnit;
        if (listKpiUnit) {
            listKpiUnit[id] = !listKpiUnit[id];
        }

        setState({
            ...state,
            listKpiUnit: listKpiUnit

        })
    };

    const handleSelectOrganizationalUnit = (value) => {
        setState({
            ...state,
            organizationalUnitId: value[0]
        })

        props.getCurrentKPIUnit(null, value[0], monthDefault, 'copy')
    };

    let listKpi = type === TYPE.DEFAULT ? kpiunit : createKpiUnit?.copyKPI;

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
                <label style={{ marginRight: "10px" }}>{translate('kpi.organizational_unit.management.copy_modal.organizational_unit')}</label>
                {organizationalUnitSelect?.length > 0 && type === TYPE.COPY_PARENT_KPI_TO_UNIT
                    ? <SelectBox
                        id={`organizationalUnitSelectBoxInOrganizationalUnitKpiCopy`}
                        className="form-control select2"
                        style={{ width: "100%" }}
                        items={organizationalUnitSelect.map(item => { return { value: item.id, text: item.name } })}
                        multiple={false}
                        onChange={handleSelectOrganizationalUnit}
                        value={organizationalUnitId}
                    />
                    : <span>{kpiunit?.organizationalUnit?.name}</span>
                }
            </div>

            {/* Chọn tháng */}
            <div className="form-group" style={{ marginLeft: "10px" }}>
                <label style={{ marginRight: "10px" }}>{translate('kpi.organizational_unit.management.copy_modal.month')}</label>
                <DatePicker
                    id="new_date"
                    value={formatDate(monthDefault)}
                    onChange={handleNewDateChange}
                    dateFormat="month-year"
                />
                <ErrorLabel content={errorOnDate} />
            </div>

            {/* CHọn người phê duyệt */}
            {approverDefault
                && <div className="form-group" style={{ marginLeft: "10px" }}>
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
                    <br />
                </div>
            }

            <div className="form-group" style={{ margin: "0px 10px" }}>
                <label>{translate('kpi.organizational_unit.management.copy_modal.list_target')}</label>
                {listKpi?.kpis?.length > 0
                    ? <ul style={{ listStyle: "none" }}>
                        {listKpi.kpis.map(item => {
                            return <li key={item._id}><input type="checkbox" checked={listKpiUnit?.[item?._id]} disabled={item?.type !== 0} onChange={item?.type !== 0 ? null : () => handleKpiUnit(item?._id)}></input><span>{item.name + " (" + item.weight + ")"}</span></li>
                        })
                        }
                    </ul>
                    : <div>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.not_initialize')} {formatDate(month)}</div>
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
