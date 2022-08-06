import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../../../common-components';
import { UserActions } from '../../../../super-admin/user/redux/actions';
import { DashboardEvaluationEmployeeKpiSetAction } from '../../../evaluation/dashboard/redux/actions';
import { createUnitKpiActions } from '../../../organizational-unit/creation/redux/actions';
import { PreviewKpiEmployee } from '../../../organizational-unit/dashboard/component/previewKpiEmployee';

const formatDate = (date) => {
    var d = new Date(date),
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

/** Thay đổi ngày tháng */
const convertMMYYtoYYMM = (value) => {
    return value.slice(3, 7) + '-' + value.slice(0, 2);
};

const getProgress = (kpis) => {
    let progress = 0;
    let count = 0;
    if (kpis) {
        for (let kpi of kpis) {
            if (typeof (kpi.target) === 'number') {
                let p = kpi.current / kpi.target * 100 > 100 ? 100 : kpi.current / kpi.target * 100;
                progress += p;
                count += 1;
            }
        }
    }
    let res = 0;
    if (count > 0) {
        res = progress / count;
    }

    return res > 100 ? 100 : Math.round(res);
}

const getBalanceKpiInfo = (x) => {
    let kpiSet = [...x];
    let kpiTargetLeft = {};
    let data = {};
    let totalLeft = 0;
    let kpiData = [];

    for (let item of kpiSet) {
        const itemData = { ...item };

        const currentProgress = getProgress(itemData.kpis);
        data[itemData.creator?.id] = {
            name: itemData.creator?.name,
            currentProgress: currentProgress,
            progressLeft: 100 - currentProgress,
        }

        totalLeft += 100 - currentProgress;

        for (let kpi of itemData.kpis) {
            if (typeof (kpi.target) === 'number') {
                if (!kpiTargetLeft[kpi.name]) {
                    kpiTargetLeft[kpi.name] = 0;
                }
                kpiTargetLeft[kpi.name] += kpi.target - kpi.current;
            }
        }
    }

    for (let itemKpi of kpiSet) {
        let kpisArr = [];
        for (let kpi of itemKpi.kpis) {
            let target;
            if (typeof (kpi.target) === 'number') {
                target = kpi.current + kpiTargetLeft[kpi.name] / kpiSet.length;
            }
            kpisArr.push(
                {
                    ...kpi,
                    target: target ?? 0
                })
        }

        kpiData.push({
            ...itemKpi,
            kpis: kpisArr
        })
    }

    let balance = Math.round(totalLeft / kpiData.length);

    for (let employee in data) {
        data[employee].balanceProgress = data[employee].currentProgress + balance;
    }

    return {
        data,
        kpiData,
        kpiTargetLeft
    };
}

function EmployeeBalanceKpiModal(props) {
    const { translate } = props;
    const { employeeKpiSet, organizationalUnitId } = props;

    const [state, setState] = useState({
        balanceData: null,
    });

    const handleSubmit = () => {
        const { balanceData } = state;
        props.balanceEmployeeKpiSetAuto(balanceData.kpiData)
    }

    //Get data employee
    useEffect(() => {
        if (employeeKpiSet && employeeKpiSet.length > 0) {
            const data = getBalanceKpiInfo(employeeKpiSet);
            setState({
                ...state,
                balanceData: data
            })
        }
    }, [employeeKpiSet])

    return (
        <React.Fragment>
            <DialogModal
                modalID="employee-balance-kpi-auto" isLoading={false}
                formID="form-employee-balance-kpi-auto"
                title={`Cân bằng KPI nhân viên`}
                msg_success={translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.success')}
                msg_failure={translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.failure')}
                func={handleSubmit}
                hasNote={false}
                disableSubmit={false}
                size={75}
            >
                {/* Form cân bằng kpi nhân viên */}
                <form id="form-employee-balance-kpi-auto" onSubmit={() => handleSubmit(translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.success'))}>

                    <div style={{ padding: "0px 15px" }}>
                        <label className="control-label" htmlFor="inputFormula" style={{ marginBottom: 10 }}>Tiến độ thực hiện KPI </label>
                        <br />
                        <table className="table table-hover table-bordered">
                            <thead>
                                <tr>
                                    <th title="STT">STT</th>
                                    <th title="Họ tên">Họ và tên</th>
                                    <th title="Tiến độ hiện tại">Tiến độ hiện tại</th>
                                    <th title="Tiến độ còn lại">Tiến độ còn lại</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    state?.balanceData?.data && Object.values(state.balanceData.data).map((item, index) =>
                                        <tr key={organizationalUnitId + index}>
                                            <td style={{ width: '20px' }}>{index + 1}</td>
                                            <td>{item.name}</td>
                                            <td>{item.currentProgress}</td>
                                            <td>{item.progressLeft}</td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    </div>

                    <br />
                    <label className="control-label" style={{ margin: "10px 0px", padding: "0px 15px" }}>KPI nhân viên sau cân bằng </label>
                    <br />

                    <div className='row'>
                        {
                            state?.balanceData?.kpiData.map(item => {
                                return <div className="col-md-4"><PreviewKpiEmployee data={item} disableNotice={true} /></div>
                            })
                        }
                    </div>



                </form>
            </DialogModal>
        </React.Fragment>
    );
}


function mapState(state) {
    const { user, createKpiUnit, department } = state;
    return { user, createKpiUnit, department }
}
const actions = {
    getAllEmployeeOfUnitByIds: UserActions.getAllEmployeeOfUnitByIds,
    balanceEmployeeKpiSetAuto: DashboardEvaluationEmployeeKpiSetAction.balanceEmployeeKpiSetAuto,
    getCurrentKPIUnit: createUnitKpiActions.getCurrentKPIUnit
}

const connectedEmployeeBalanceKpiModal = connect(mapState, actions)(withTranslate(EmployeeBalanceKpiModal));
export { connectedEmployeeBalanceKpiModal as EmployeeBalanceKpiModal };

