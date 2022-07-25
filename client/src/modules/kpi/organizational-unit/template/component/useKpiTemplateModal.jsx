import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DatePicker, DialogModal, SelectBox } from '../../../../../common-components';
import { createUnitKpiActions } from '../../creation/redux/actions.js';
import { managerActions } from '../../management/redux/actions';

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

function formatDate2(date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month].join('-');
}

function UseKpiTemplateModal(props) {
    const TYPE = {
        TEMPLATE: 'use-template'
    };
    const { translate, createKpiUnit } = props;
    const { kpiTemplate, unit } = props;
    const [state, setState] = useState({
        organizationalUnitId: null,
        month: new Date()
    });
    const { organizationalUnitId, month } = state;

    const handleSelectOrganizationalUnit = (value) => {
        setState({
            ...state,
            organizationalUnitId: value[0]
        })
    };

    /** Thay đổi ngày tháng */
    const handleNewDateChange = (value) => {
        let month = value.slice(3, 7) + '-' + value.slice(0, 2);
        setState({
            ...state,
            month: month
        });
    };

    const handleSubmit = () => {
        let arrayKpiUnit = kpiTemplate?.kpis?.map(x => x._id);
        let data = {
            type: TYPE.TEMPLATE,
            idunit: organizationalUnitId,
            datenew: formatDate2(month),
            listKpiUnit: arrayKpiUnit
        }

        props.copyKPIUnit(kpiTemplate?._id, data);

    };


    return (
        <DialogModal
            modalID={`modal-use-kpi-template`}
            title={"Sử dụng mẫu KPI"}
            size={10}
            func={handleSubmit}
            disableSubmit={!organizationalUnitId}
        >
            {/* Đơn vị */}
            <div className="form-group" style={{ marginLeft: "10px" }}>
                <label style={{ marginRight: "10px" }}>Đơn vị áp dụng</label>
                <SelectBox
                    id={`unitBoxInOrganizationalUnitKpiCopy`}
                    className="form-control select2"
                    style={{ width: "100%" }}
                    items={unit.map(item => { return { value: item._id, text: item.name } })}
                    multiple={false}
                    onChange={handleSelectOrganizationalUnit}
                    value={organizationalUnitId}
                    defaultValue={null}
                />
            </div>

            {/* Chọn tháng */}
            <div className="form-group" style={{ marginLeft: "10px" }}>
                <label style={{ marginRight: "10px" }}>{"Tháng áp dụng"}</label>
                <DatePicker
                    id="new_date"
                    value={formatDate(month)}
                    onChange={handleNewDateChange}
                    dateFormat="month-year"
                />
            </div>

            <div className="form-group" style={{ margin: "0px 10px" }}>
                <label>{translate('kpi.organizational_unit.management.copy_modal.list_target')}</label>
                {kpiTemplate?.kpis?.length > 0
                    ? <ul style={{ marginLeft: -10 }}>
                        {kpiTemplate.kpis.map(item => {
                            return <li key={item._id}>
                                <span>{item.name + " (" + item.weight + ")"}</span>
                            </li>
                        })
                        }
                    </ul>
                    : <div>Không có mục tiêu</div>
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
const connectedUseKpiTemplateModal = connect(mapState, actionCreators)(withTranslate(UseKpiTemplateModal));
export { connectedUseKpiTemplateModal as UseKpiTemplateModal };
