import React from 'react'
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { managerActions } from '../../management/redux/actions';
import arrayToTree from 'array-to-tree';
import './kpiUnit.css';

const StatisticsKpiUnits = (props) => {
    const [state, setState] = React.useState(() => {
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
            date: new Date([year, endMonth].join('-'))
        }
    });

    if (props.monthStatistics) {

    }

    React.useEffect(() => {
        const { role, date } = state;
        if (props && props.organizationalUnitIds) {
            let infoSearch = {
                organizationalUnit: props.organizationalUnitIds,
                role: role,
                status: -1,
                perPage: 10000,
                page: 1,
            };
            if (props.monthStatistics) {
                infoSearch = {
                    ...infoSearch,
                    startDate: props.monthStatistics,
                    endDate: props.monthStatistics,
                }
            } else {
                infoSearch = {
                    ...infoSearch,
                    startDate: date,
                    endDate: date,
                }
            }

            console.log('infoSearch', infoSearch)
            props.getAllKPIUnit(infoSearch);
        }
    }, [props.monthStatistics])

    const { translate, managerKpiUnit } = props;

    let result = [], treeKpiUnits;
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

    const showNodeContent = (data, translate) => {
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
                        <a title="điểm của người phê duyệt" className="perc">{`${data.kpi.approvedPoint === null ? 'chưa đánh giá' : data.kpi.approvedPoint + '/100'}`}</a>
                    </div>
                    <p className="kpi-number-target"><span style={{ marginRight: '5px' }}>số mục tiêu:</span> <span>{data.kpi?.kpis?.length}</span></p>
                </div>
            </div>
        )
    }

    const displayTreeView = (data, translate) => {
        if (data) {
            if (!data.children) {
                return (
                    <li key={data.id}>
                        {showNodeContent(data, translate)}
                    </li>
                )
            }

            return (
                <li key={data.id}>
                    {showNodeContent(data, translate)}
                    <ul>
                        {
                            data.children.map(tag => displayTreeView(tag, translate))
                        }
                    </ul>
                </li>
            )
        } else {
            return null
        }
    }

    return (
        <div>
            {
                treeKpiUnits &&
                treeKpiUnits.map((tree, index) =>
                    <div key={index} className="tf-tree example" style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '50px' }}>
                        <ul>
                            {
                                displayTreeView(tree, translate)
                            }
                        </ul>
                    </div>
                )
            }
        </div>
    )
}


function mapStateToProps(state) {
    const { user, managerKpiUnit } = state;
    return { user, managerKpiUnit }
}

const mapDispatchToProps = {
    getAllKPIUnit: managerActions.getAllKPIUnit,
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(StatisticsKpiUnits));