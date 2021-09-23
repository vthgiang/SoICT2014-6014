import React, {Component, useEffect, useState} from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal } from '../../../../../common-components';

import { createUnitKpiActions } from '../redux/actions';

function OrganizationalUnitKpiCreateModal(props) {

    const [state, setState] = useState({
        organizationalUnitId: null,
        organizationalUnit: "",
        month: "",
    });

    const { translate, createKpiUnit } = props;
    const { organizationalUnit, month } = state;
    let parentKpi;

    useEffect(()=>{
        if (props.organizationalUnitId !== state.organizationalUnitId
            || props.month !== state.month
        ) {
            setState( {
                ...state,
                organizationalUnitId: props.organizationalUnitId,
                organizationalUnit: props.organizationalUnit,
                month: props.month
            })
        }
    },[props.organizationalUnitId, props.month])

    function formatDate(date) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) {
            month = '0' + month;
        }

        if (day.length < 2) {
            day = '0' + day;
        }

        return [month, year].join('-');
    }

    const handleSubmit = () => {
        const { organizationalUnit, month } = state;

        if (organizationalUnit && month) {
            props.addKPIUnit({
                organizationalUnitId: organizationalUnit.id,
                month: month
            });

            window.$("#startKPIUnit").modal("hide");
        }

    }

    if (createKpiUnit) {
        parentKpi = createKpiUnit?.parent?.kpis;
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID="startKPIUnit" isLoading={false}
                formID="formStartKPIUnit"
                title={translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.initialize_kpi_set')}
                msg_success={translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.success')}
                msg_failure={translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.failure')}
                func={handleSubmit}
            >
                {/* Form khởi tạo KPI đơn vị */}
                <form id="formStartKPIUnit" onSubmit={() => handleSubmit(translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.success'))}>

                    {/* Đơn vị */}
                    <div className="form-group">
                        <label className="col-sm-2">{translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.organizational_unit')}</label>
                        <label className="col-sm-10" style={{ fontWeight: "400", marginLeft: "-2.5%" }}>{organizationalUnit && organizationalUnit.name}</label>
                    </div>

                    {/* Tháng */}
                    <div className="form-group">
                        <label className="col-sm-2">{translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.month')}</label>
                        {formatDate(month)}
                    </div>

                    {/* Mục tiêu mặc định */}
                    <div className="form-group">
                        <label className="col-sm-12">{translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.default_target')}</label>
                        <ul>
                            {parentKpi?.length > 0
                                ? parentKpi.filter(item => item?.type !== 0)
                                    .map(
                                        item => <li key={item?._id}>{item?.name} (5)</li>
                                    )
                                : <>
                                    <li key={"default1"}>{"Phê duyệt công việc"} (5)</li>
                                    <li key={"default2"}>{"Hỗ trợ thực hiện công việc"} (5)</li>
                                </>
                            }
                        </ul>
                    </div>

                </form>
            </DialogModal>
        </React.Fragment>
    );

}

function mapState(state) {
    const { createKpiUnit } = state;
    return { createKpiUnit };
}

const actionCreators = {
    addKPIUnit: createUnitKpiActions.addKPIUnit
};
const connectedOrganizationalUnitKpiCreateModal = connect(mapState, actionCreators)(withTranslate(OrganizationalUnitKpiCreateModal));
export { connectedOrganizationalUnitKpiCreateModal as OrganizationalUnitKpiCreateModal };
