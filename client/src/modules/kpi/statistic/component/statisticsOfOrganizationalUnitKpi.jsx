import React, { Component } from 'react';
import { connect } from 'react-redux';

import { dashboardOrganizationalUnitKpiActions } from '../../organizational-unit/dashboard/redux/actions';
import { createUnitKpiActions } from '../../organizational-unit/creation/redux/actions';
import { DashboardEvaluationEmployeeKpiSetAction } from '../../evaluation/dashboard/redux/actions';

import { DetailsOfOrganizationalUnitKpiForm } from './detailsOfOrganizationalUnitKpiForm';

import { SelectBox, DatePicker, Tree, SlimScroll } from '../../../../common-components';

import { withTranslate } from 'react-redux-multilingual';

class StatisticsOfOrganizationalUnitKpi extends Component {

    constructor(props) {
        super(props);
        
        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };
        this.TREE_INDEX = 0;            // Dùng làm id cho những phàn tử trong tree nếu phần tử đó k có kpi con
        this.today = new Date();

        this.INFO_SEARCH = {
            organizationalUnitId: null,
            month: this.today.getFullYear() + '-' + (this.today.getMonth() + 1)
        }
                 
        this.TREE_INDEX = 0;        // Dùng làm id cho những phàn tử trong tree nếu phần tử đó k có kpi con

        this.state = {
            currentRole: localStorage.getItem("currentRole"),
            dataStatus: this.DATA_STATUS.QUERYING,

            organizationalUnitId: this.INFO_SEARCH.organizationalUnitId,
            month: this.INFO_SEARCH.month
        }
    }

    componentDidMount() {
        const { currentRole, month, organizationalUnitId } = this.state;

        this.props.getCurrentKPIUnit(currentRole, organizationalUnitId, month);

        this.props.getAllEmployeeKpiInChildrenOrganizationalUnit(currentRole, month, organizationalUnitId);
        this.props.getAllTaskOfChildrenOrganizationalUnit(currentRole, month, organizationalUnitId);

        this.props.getChildrenOfOrganizationalUnitsAsTree(currentRole);

        this.setState(state => {
            return {
                ...state,
                dataStatus: this.DATA_STATUS.QUERYING
            }
        })
    }

    shouldComponentUpdate = async (nextProps, nextState) => {
        if (nextState.details !== this.state.details) {
            return false;
        }

        if (nextState.organizationalUnitId !== this.state.organizationalUnitId || nextState.month !== this.state.month) {
            await this.props.getCurrentKPIUnit(this.state.currentRole, nextState.organizationalUnitId, nextState.month);
            await this.props.getAllEmployeeKpiInChildrenOrganizationalUnit(this.state.currentRole, nextState.month, nextState.organizationalUnitId);
            await this.props.getAllTaskOfChildrenOrganizationalUnit(this.state.currentRole, nextState.month, nextState.organizationalUnitId)

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.QUERYING,
                }
            });

            return false;
        }

        if (nextState.dataStatus === this.DATA_STATUS.QUERYING) {
            if(!nextProps.createKpiUnit.currentKPI) {
                return false            
            }

            if(!nextProps.dashboardOrganizationalUnitKpi.employeeKpisOfChildUnit) {
                return false           
            }

            if (!nextProps.dashboardOrganizationalUnitKpi.tasksOfChildrenOrganizationalUnit) {
                return false           
            }
            
            this.setState(state =>{
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.AVAILABLE,
                };
            });

            return false;
        } else if (nextState.dataStatus === this.DATA_STATUS.AVAILABLE) {
            this.setState(state =>{
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.FINISHED,
                };
            });
        }

        return false;
    }

    /** Hàm tiện ích lấy các KPI con có cùng parent */
    getArrayListChildTargetOrganizationUnitKpi = () => {
        const { createKpiUnit, dashboardOrganizationalUnitKpi, translate } = this.props;

        let listOrganizationalUnitKpi, listChildTarget, arrayListChildTargetSameParent;

        if (createKpiUnit.currentKPI && createKpiUnit.currentKPI.kpis) {
            listOrganizationalUnitKpi = createKpiUnit.currentKPI.kpis
        }
        if (dashboardOrganizationalUnitKpi.employeeKpisOfChildUnit !== []) {
            listChildTarget = dashboardOrganizationalUnitKpi.employeeKpisOfChildUnit
        }

        if (listOrganizationalUnitKpi && listChildTarget) {
            arrayListChildTargetSameParent = listOrganizationalUnitKpi.map(parent => {

                let index = 0;
                let maxDeg = listChildTarget[listChildTarget.length - 1][0].deg;

                let listChildTargetSameParent = [];

                while (index <= maxDeg) {
                    
                    let listChildTargetSameDeg = listChildTarget.filter(item => item[0].deg === index);

                    if (listChildTargetSameDeg) {
                        if (index === 0) {
                            listChildTargetSameParent[index] = listChildTargetSameDeg.map(item => {
                                let organizationalUnit = {
                                    organizationalUnit: item[0].name
                                }
                                let kpis = item.filter(kpi => kpi._id === parent.name).map(kpi => {
                                    return Object.assign(kpi, organizationalUnit);
                                })

                                return kpis
                            });
                        } else {
                            let parentNameOfUnitKpi = listChildTargetSameParent[index - 1].map(kpi => {
                                if (kpi[0]) {
                                    return kpi[0]._id;
                                }
                            })
                            
                            listChildTargetSameParent[index] = listChildTargetSameDeg.map(item => {
                                let organizationalUnit = {
                                    organizationalUnit: item[0].name
                                }
                                let kpis = item.filter(kpi => {
                                    if (kpi.employeeKpi && kpi.employeeKpi[0].parentNameOfUnitKpi[0]) {
                                        return parentNameOfUnitKpi.includes(kpi.employeeKpi[0].parentNameOfUnitKpi[0]);
                                    }
                                }).map(kpi => {
                                    return Object.assign(kpi, organizationalUnit);
                                })

                                return kpis;
                            });
                        }
                    }

                    index++;
                };

                return listChildTargetSameParent;
            })
        }

        return arrayListChildTargetSameParent;
    }

    /** Hàm tiện ích lấy các công việc cùng KPI */
    getArrayListTaskSameOrganizationUnitKpi = () => {
        const { createKpiUnit, dashboardOrganizationalUnitKpi } = this.props;

        let listOrganizationalUnitKpi, listTask, arrayListTaskSameOrganizationUnitKpi;
        let arrayListChildTargetSameParent = this.getArrayListChildTargetOrganizationUnitKpi();

        if (createKpiUnit.currentKPI && createKpiUnit.currentKPI.kpis) {
            listOrganizationalUnitKpi = createKpiUnit.currentKPI.kpis;
        }
        if (dashboardOrganizationalUnitKpi.tasksOfChildrenOrganizationalUnit !== []) {
            listTask = dashboardOrganizationalUnitKpi.tasksOfChildrenOrganizationalUnit;
        }

        if(listOrganizationalUnitKpi && listTask) {
            arrayListTaskSameOrganizationUnitKpi = listOrganizationalUnitKpi.map(parent => {
                let temporaryArrayListTaskSameOrganizationUnitKpi = [];

                if (arrayListChildTargetSameParent !== [] && arrayListChildTargetSameParent && listTask) {
                    let listChildTargetSameParent;

                    if (arrayListChildTargetSameParent) {
                        listChildTargetSameParent = arrayListChildTargetSameParent.filter(item => {
                            if (item[0][0][0]) {
                                return item[0][0][0]._id === parent.name;
                            }
                        });
                    }

                    if (listChildTargetSameParent.length !== 0) {
                        listChildTargetSameParent = [...listChildTargetSameParent[0]];

                        listChildTargetSameParent.map(deg => {
                            if (deg.length !== 0) {
                                deg.map(unit => {
                                    if (unit.length !== 0) {
                                        unit.map(kpi => {
                                            if (kpi.employeeKpi[0].creator.length !== 0) {
                                                kpi.employeeKpi.map(employeeKpi => {
                                                    if (listTask) {
                                                        listTask.map(task => {
                                                            let list = task.filter(item => {
                                                                let kpi, length = 0;

                                                                if (item.evaluations) {
                                                                    item.evaluations.results.map(item => {
                                                                        kpi = item.kpis.filter(kpi => kpi === employeeKpi._id);
                                                                        length = length + kpi.length;
                                                                    });
                                                                    return length !== 0 && length !== undefined;
                                                                } else {
                                                                    return false
                                                                }
                                                            })

                                                            temporaryArrayListTaskSameOrganizationUnitKpi = temporaryArrayListTaskSameOrganizationUnitKpi.concat(list);
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })    
                    }
                }

                temporaryArrayListTaskSameOrganizationUnitKpi = Array.from(new Set(temporaryArrayListTaskSameOrganizationUnitKpi));
                temporaryArrayListTaskSameOrganizationUnitKpi.unshift({ name: parent.name });

                return temporaryArrayListTaskSameOrganizationUnitKpi;
            })
        }

        return arrayListTaskSameOrganizationUnitKpi;
    }


    /** 
     * Duyệt các kpi con của cùng 1 kpi, mỗi phần tử trả về object gồm tên, đơn vị, số lượng kpi con,... (config dùng trong Tree)
     * @listChildTargetSameParent mảng nhiều chiều
     * @listChildTarget  mảng gồm các dữ liệu phụ(null có vẫn chạy ok)
     * @organizationalUnit xác định gốc trong tree
    */
    traversesListChildTargetSameParent = (listChildTargetSameParent, listChildTarget, listTaskSameParent, organizationalUnit) => {
        let treeData = [];
        if (listChildTargetSameParent.length !== 0) {
            listChildTargetSameParent.map(unit => {
                if (unit.length !== 0) {
                    unit.map(kpi => {
                        if (kpi._id) {
                            let numberOfChildKpi = 0;
                            let listTask = [], listChildTask = [], listParticipant = [], listChildParticipant = [];

                            // Công số kpi đơn vị con, lấy task, participant của kpi con
                            if (listChildTarget && listChildTarget.length !== 0) {
                                listChildTarget.filter(item => item.parent === kpi.employeeKpi[0].parent)
                                    .map(item => {
                                        numberOfChildKpi = numberOfChildKpi + item.numberOfChildKpi;
                                        listChildTask = item.listTask;
                                        listChildParticipant = item.listParticipant;
                                    })
                            }

                            // Lọc task có kpi hiện tại
                            if (listTaskSameParent && listTaskSameParent.length !== 0) {
                                if (kpi.employeeKpi.length !== 0) {
                                    kpi.employeeKpi.map(employeeKpi => {
                                        let listTaskTemporary = listTaskSameParent[0].filter(task => {
                                            let kpi, length = 0;

                                            if (task.evaluations) {
                                                task.evaluations.results.map(item => {
                                                    kpi = item.kpis.filter(x => x === employeeKpi._id);
                                                    length = length + kpi.length;
                                                });
                                                return length !== 0 && length !== undefined;
                                            } else {
                                                return false;
                                            }
                                        })

                                        listTask = listTask.concat(listTaskTemporary);
                                    })
                                }
                            }
                            // Concat mảng task kpi hiện tại và task kpi con
                            listTask = listTask.concat(listChildTask);
                            listTask = Array.from(new Set(listTask));


                            // Lọc participant của kpi hiện tại
                            if (kpi.employeeKpi.length !== 0) {
                                kpi.employeeKpi.map(item => {
                                    listParticipant = listParticipant.concat(item.creator);
                                })
                            }
                            if (listTask.length !== 0) {
                                listTask.map(task => {
                                    listParticipant = listParticipant.concat(task.informedEmployees).concat(task.consultedEmployees).concat(task.informedEmployees)
                                })
                            }
                            // Concat mảng participant kpi hiện tại và kpi con
                            listParticipant = listParticipant.concat(listChildParticipant);
                            listParticipant = Array.from(new Set(listParticipant));


                            // Phần tử tree
                            treeData.push({
                                id: kpi.employeeKpi[0].parent ? kpi.employeeKpi[0].parent : this.TREE_INDEX,
                                text: kpi._id,
                                state: { "opened": true },
                                parent: kpi.employeeKpi[0].parentOfUnitKpi && organizationalUnit && organizationalUnit.text !== kpi.organizationalUnit ? kpi.employeeKpi[0].parentOfUnitKpi.toString() : "#",
                                numberOfChildKpi: numberOfChildKpi + (kpi.employeeKpi[0].creator.length !== 0 ? kpi.employeeKpi.length : 0),
                                organizationalUnit: kpi.organizationalUnit,
                                weight: kpi.employeeKpi[0].parentWeight,
                                listTask: listTask,
                                listParticipant: listParticipant
                            })

                            this.TREE_INDEX++;
                        }
                    })
                }
                
            })
        }

        return treeData;
    }

    setTreeData = () => {
        const { organizationalUnitId } = this.state;

        let organizationalUnitSelectBox = this.setSelectBox();
        let arrayListChildTargetSameOrganizationUnitKpi = this.getArrayListChildTargetOrganizationUnitKpi();
        let arrayListTaskSameOrganizationUnitKpi = this.getArrayListTaskSameOrganizationUnitKpi();
        let organizationalUnit, treeDatas = [];

        if (organizationalUnitId && organizationalUnitSelectBox) {
            organizationalUnit = organizationalUnitSelectBox.filter(item => item.value === organizationalUnitId);
        } else {
            if (organizationalUnitSelectBox) {
                organizationalUnit = organizationalUnitSelectBox;
            }
        }


        if (arrayListChildTargetSameOrganizationUnitKpi && arrayListChildTargetSameOrganizationUnitKpi.length !== 0 && organizationalUnit && arrayListTaskSameOrganizationUnitKpi) {
            for (let i = (arrayListChildTargetSameOrganizationUnitKpi.length - 1); i >= 0; i--) {
                let listTaskSameParent = arrayListTaskSameOrganizationUnitKpi.filter(item => item[0].name === arrayListChildTargetSameOrganizationUnitKpi[i][0][0][0]._id);
                let treeData = [];

                if (arrayListChildTargetSameOrganizationUnitKpi[i]) {
                    for (let j = (arrayListChildTargetSameOrganizationUnitKpi[i].length - 1); j >= 0; j--) {
                        treeData[j] = [];
                        treeData[j] = this.traversesListChildTargetSameParent(arrayListChildTargetSameOrganizationUnitKpi[i][j], treeData[j + 1], listTaskSameParent, organizationalUnit[0]);
                        treeDatas = treeData[j].concat(treeDatas);
                    }
                }
            }
        }

        return treeDatas;
    }

    setSelectBox = () => {
        const { dashboardEvaluationEmployeeKpiSet } = this.props;

        let childOrganizationalUnit, childrenOrganizationalUnit, organizationalUnitSelectBox;

        if (dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit) {
            childrenOrganizationalUnit = dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit;
        }

        if (childrenOrganizationalUnit) {
            let temporaryChild;

            childOrganizationalUnit = [{
                'name': childrenOrganizationalUnit.name,
                'id': childrenOrganizationalUnit.id,
                'viceDean': childrenOrganizationalUnit.viceDean
            }]

            temporaryChild = childrenOrganizationalUnit.children;

            while (temporaryChild) {
                temporaryChild.map(x => {
                    childOrganizationalUnit = childOrganizationalUnit.concat({
                        'name': x.name,
                        'id': x.id,
                        'viceDean': x.viceDean
                    });
                })

                let hasNodeChild = [];
                temporaryChild.filter(x => x.hasOwnProperty("children")).map(x => {
                    x.children.map(x => {
                        hasNodeChild = hasNodeChild.concat(x)
                    })
                });

                if (hasNodeChild.length === 0) {
                    temporaryChild = undefined;
                } else {
                    temporaryChild = hasNodeChild
                }
            }
        }
        if (childOrganizationalUnit) {
            organizationalUnitSelectBox = childOrganizationalUnit.map(x => { return { 'text': x.name, 'value': x.id } });
        }

        return organizationalUnitSelectBox;
    }

    onChanged = async (e, data) => {
        this.TREE_INDEX = 0;
        await this.setState(state => {
            return {
                ...state,
                details: data.node && data.node.original,
            }
        })
        
        window.$(`#details-of-organizational-unit-kpi-form`).slideDown();
    }

    handleSelectOrganizationalUnitId = (value) => {
        this.INFO_SEARCH.organizationalUnitId = value[0];
    }

    handleSelectMonth = async (value) => {
        this.INFO_SEARCH.month = value.slice(3, 7) + '-' + value.slice(0, 2);
    }

    handleSearchData = () => {
        this.setState(state => {
            return {
                ...state,
                organizationalUnitId: this.INFO_SEARCH.organizationalUnitId,
                month: this.INFO_SEARCH.month
            }
        })
    }

    render() {
        const { translate } = this.props;
        const { details } = this.state;

        let dataTree = this.setTreeData();;
        let organizationalUnitSelectBox = this.setSelectBox();

        // Config select time
        let d = new Date(),
            monthDate = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (monthDate.length < 2)
            monthDate = '0' + monthDate;
        if (day.length < 2)
            day = '0' + day;
        let defaultDate = [monthDate, year].join('-');
        
        return (
            <React.Fragment>
                <div className="box">
                    <div className="box-body qlcv">
                        {organizationalUnitSelectBox &&
                            <div className="form-inline">
                                <div className="form-group">
                                    <label>{translate('kpi.organizational_unit.dashboard.organizational_unit')}</label>
                                    <SelectBox
                                        id={`organizationalUnitSelectBoxInOrganizationalUnitKpiDashboard`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={organizationalUnitSelectBox}
                                        multiple={false}
                                        onChange={this.handleSelectOrganizationalUnitId}
                                        value={organizationalUnitSelectBox[0].value}
                                    />
                                </div>
                            </div>
                        }

                        <div className="form-inline">
                            <div className="form-group">
                                <label>{translate('kpi.organizational_unit.dashboard.month')}</label>
                                <DatePicker
                                    id="monthInOrganizationalUnitKpiDashboard"
                                    dateFormat="month-year"             
                                    value={defaultDate}                     
                                    onChange={this.handleSelectMonth}
                                    disabled={false}                   
                                />
                            </div>
                            <div className="form-group">
                                <button type="button" className="btn btn-success" onClick={this.handleSearchData}>{translate('kpi.evaluation.employee_evaluation.search')}</button>
                            </div>
                        </div>


                        <div className="row">
                            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                            <fieldset className="scheduler-border qlcv">
                                <legend class="scheduler-border">
                                    <h4 class="box-title">Cây KPI đơn vị</h4>
                                </legend>
                                    <div className="details-tree" id="details-tree">
                                        <Tree 
                                            id="tree-qlcv-document"
                                            onChanged={this.onChanged} 
                                            data={dataTree}
                                        />
                                    </div>
                                    <SlimScroll outerComponentId="details-tree" innerComponentId="tree-qlcv-document" innerComponentWidth={"100%"} activate={true} />
                            </fieldset>
                            </div>

                            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                {
                                    details &&
                                    <DetailsOfOrganizationalUnitKpiForm
                                        details={details}
                                    />
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

function mapState(state) {
    const { createKpiUnit, dashboardOrganizationalUnitKpi, dashboardEvaluationEmployeeKpiSet } = state;
    return { createKpiUnit, dashboardOrganizationalUnitKpi, dashboardEvaluationEmployeeKpiSet };
}
const actions = {
    getCurrentKPIUnit: createUnitKpiActions.getCurrentKPIUnit,
    
    getAllEmployeeKpiInChildrenOrganizationalUnit: dashboardOrganizationalUnitKpiActions.getAllEmployeeKpiInChildrenOrganizationalUnit,
    getAllTaskOfChildrenOrganizationalUnit: dashboardOrganizationalUnitKpiActions.getAllTaskOfChildrenOrganizationalUnit,

    getChildrenOfOrganizationalUnitsAsTree: DashboardEvaluationEmployeeKpiSetAction.getChildrenOfOrganizationalUnitsAsTree,
}

const connectedStatisticsOfOrganizationalUnitKpi = connect(mapState, actions)(withTranslate(StatisticsOfOrganizationalUnitKpi));
export { connectedStatisticsOfOrganizationalUnitKpi as StatisticsOfOrganizationalUnitKpi };