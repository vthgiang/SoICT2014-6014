import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import arrayToTree from 'array-to-tree';
import { withTranslate } from 'react-redux-multilingual';

import { managerActions } from '../../management/redux/actions';

import { ToolTip } from '../../../../../common-components'

import './kpiUnit.css';

const StatisticsKpiUnits = (props) => {
    const { translate, managerKpiUnit, auth } = props;
    const KIND_OF_POINT = { AUTOMATIC: 1, EMPLOYEE: 2, APPROVED: 3 };
    const [state, setState] = useState(() => {
        let d = new Date(),
            month = d.getMonth() + 1,
            year = d.getFullYear();
        let endMonth;
        if (month < 10) {
            endMonth = '0' + month;
        } else {
            endMonth = month;
        }

        return {
            role: localStorage.getItem('currentRole'),
        }
    });
    const { role } = state;
    const [kindOfPoint, setKindOfPoint] = useState(KIND_OF_POINT.AUTOMATIC)

    useEffect(() => {
        let infoSearch = {
            organizationalUnit: props.organizationalUnitIds,
            role: role,
            status: -1,
            perPage: 10000,
            page: 1,
            startDate: props.month,
            endDate: props.month,
        };

        props.getAllKPIUnit(infoSearch);
    }, [JSON.stringify(props.organizationalUnitIds), JSON.stringify(props.month)])

    const showNodeContent = (translate, data, kindOfPoint) => {
        let pointShow, titleShow;

        switch (kindOfPoint) {
            case KIND_OF_POINT.AUTOMATIC:
                pointShow = data?.kpi?.automaticPoint
                titleShow = translate('kpi.evaluation.dashboard.auto_point')
                break
            case KIND_OF_POINT.EMPLOYEE:
                pointShow = data?.kpi?.employeePoint
                titleShow = translate('kpi.evaluation.dashboard.employee_point')
                break
            case KIND_OF_POINT.APPROVED:
                pointShow = data?.kpi?.approvedPoint
                titleShow = translate('kpi.evaluation.dashboard.approve_point')
                break
        }

        return (
            <div className={`tf-nc ${!data.parent_id && "bg bg-primary"}`} style={{
                minWidth: '120px',
                border: 'none',
                padding: '9px 12px',
                textAlign: 'center',
                boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                borderRadius: '5px',
                backgroundColor: data.parent_id ? "fff" : "#4797b9"

            }}>
                <div>
                    <h5 style={{ fontWeight: '700', marginBottom: '15px' }}>{`${data.organizationalUnitName}`}</h5>
                    <div className="progress-weigth-kpi" style={{ backgroundColor: data.parent_id ? "#8a8a8a" : "#676767" }}>
                        <div className="fillmult" data-width={`${data.kpi.approvedPoint}%`} style={{ width: `${data.kpi.approvedPoint}%`, backgroundColor: data.kpi.approvedPoint < 50 ? "#dc0000" : "rgb(76 179 99)" }}></div>
                        <a title={titleShow} className="perc">{`${!pointShow && pointShow !== 0 ? translate('kpi.evaluation.employee_evaluation.not_avaiable') : pointShow + '/100'}`}</a>
                    </div>
                    <p className="kpi-number-target"><span style={{ marginRight: '5px' }}>số mục tiêu:</span> <span style={{ fontWeight: 'bold' }}>{data.kpi?.kpis?.length}</span></p>
                </div>
            </div>
        )
    }

    const displayTreeView = (translate, data, kindOfPoint) => {
        if (data) {
            if (!data.children) {
                return (
                    <li key={data.id}>
                        {showNodeContent(translate, data, kindOfPoint)}
                    </li>
                )
            }

            return (
                <li key={data.id}>
                    {showNodeContent(translate, data, kindOfPoint)}
                    <ul>
                        {
                            data.children.map(tag => displayTreeView(translate, tag, kindOfPoint))
                        }
                    </ul>
                </li>
            )
        } else {
            return null
        }
    }

    const handleSelectKindOfPoint = (value) => {
        setKindOfPoint(Number(value))
    };

    const handleRefreshKpiUnits = () => {
        let kpiUnitSet = managerKpiUnit?.kpis?.map(item => item?._id)

        props.calculateKPIUnit(kpiUnitSet, props.month);
    };

    const checkHasComponent = (name) => {
        let result = false;
        auth.components.forEach(component => {
            if (component.name === name) result = true;
        });
        return result;
    }

    let result = [], treeKpiUnits = null;
    if (managerKpiUnit && managerKpiUnit.kpis && managerKpiUnit.kpis.length > 0) {
        managerKpiUnit.kpis.forEach(o => {
            result = [
                ...result,
                {
                    organizationalUnitName: o.organizationalUnit.name,
                    parent_id: o.organizationalUnit.parent,
                    id: o.organizationalUnit._id,
                    kpi: {
                        ...o,
                    }
                }
            ]
        })
        treeKpiUnits = arrayToTree(result);
    }

    return (
        <div className="box-body">
            <section className="box-body" style={{ textAlign: "right" }}>
                <div className="btn-group">
                    <button type="button"
                        className={`btn btn-xs ${kindOfPoint === KIND_OF_POINT.AUTOMATIC ? 'btn-danger' : null}`}
                        onClick={() => handleSelectKindOfPoint(KIND_OF_POINT.AUTOMATIC)}>{translate('kpi.evaluation.dashboard.auto_point')}</button>
                    <button type="button"
                        className={`btn btn-xs ${kindOfPoint === KIND_OF_POINT.EMPLOYEE ? 'btn-danger' : null}`}
                        onClick={() => handleSelectKindOfPoint(KIND_OF_POINT.EMPLOYEE)}>{translate('kpi.evaluation.dashboard.employee_point')}</button>
                    <button type="button"
                        className={`btn btn-xs ${kindOfPoint === KIND_OF_POINT.APPROVED ? 'btn-danger' : null}`}
                        onClick={() => handleSelectKindOfPoint(KIND_OF_POINT.APPROVED)}>{translate('kpi.evaluation.dashboard.approve_point')}</button>
                </div>
                { checkHasComponent('refresh-kpi-unit-in-dashboard') 
                    && <ToolTip
                        type="text_tooltip"
                        dataTooltip={[
                            ` ${translate('kpi.evaluation.employee_evaluation.refresh_all_kpis')}`,
                        ]}
                    >
                        <a onClick={() => handleRefreshKpiUnits()}>
                            <i className="fa fa-refresh" style={{ fontSize: "22px", verticalAlign: "top", color: '#06c', cursor: 'pointer', marginLeft: '10px' }} />
                        </a>
                    </ToolTip>
                }
            </section>

            {
                managerKpiUnit?.isLoading
                    ? <div>{translate('general.loading')}</div>
                    : treeKpiUnits
                        ? treeKpiUnits.map((tree, index) =>
                            <div key={index} className="tf-tree example" style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '20px', paddingTop: '10px', paddingBottom: '10px' }}>
                                <ul>
                                    {
                                        displayTreeView(translate, tree, kindOfPoint)
                                    }
                                </ul>
                            </div>
                        )
                        : <div>{translate('kpi.organizational_unit.dashboard.no_data')}</div>
            }
        </div>
    )
}


function mapStateToProps(state) {
    const { auth, managerKpiUnit } = state;
    return { auth, managerKpiUnit }
}

const mapDispatchToProps = {
    getAllKPIUnit: managerActions.getAllKPIUnit,
    calculateKPIUnit: managerActions.calculateKPIUnit,
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(StatisticsKpiUnits));