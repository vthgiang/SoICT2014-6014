import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import Swal from 'sweetalert2';

import { dashboardOrganizationalUnitKpiActions } from '../../organizational-unit/dashboard/redux/actions';
import { createUnitKpiActions } from '../../organizational-unit/creation/redux/actions';
import { DashboardEvaluationEmployeeKpiSetAction } from '../../evaluation/dashboard/redux/actions';

import { DetailsOfOrganizationalUnitKpiForm } from './detailsOfOrganizationalUnitKpiForm';
import { DistributionOfEmployeeKpiChart } from './distributionOfEmployeeKpiChart';
import { DistributionOfOrganizationalUnitKpiChart } from './distributionOfOrganizationalUnitKpiChart';
import { FunctionHelperStatisticKpi } from './functionHelperStatisticKpi';

import { SelectBox, DatePicker, Tree, SlimScroll } from '../../../../common-components';
import { showListInSwal } from '../../../../helpers/showListInSwal';

function StatisticsOfOrganizationalUnitKpi(props) {
    const { translate } = props;
    const DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };
    const TREE_INDEX = useRef(0);            // Dùng làm id cho những phàn tử trong tree nếu phần tử đó k có kpi con
    const today = new Date();

    const INFO_SEARCH = {
        organizationalUnitId: null,
        month: today.getFullYear() + '-' + (today.getMonth() + 1)
    };

    const [state, setState] = useState({
        currentRole: localStorage.getItem("currentRole"),
        dataStatus: DATA_STATUS.QUERYING,

        organizationalUnitId: INFO_SEARCH.organizationalUnitId,
        month: INFO_SEARCH.month
    });

    const { dashboardEvaluationEmployeeKpiSet, createKpiUnit, dashboardOrganizationalUnitKpi } = props;
    const { details, month } = state;
    let childrenOrganizationalUnit, childrenOrganizationalUnitLoading, currentKPI, organizationalUnitKpiLoading, listChildTarget;

    useEffect(() => {
        const { currentRole, month, organizationalUnitId } = state;

        props.getCurrentKPIUnit(currentRole, organizationalUnitId, month);

        props.getAllEmployeeKpiInChildrenOrganizationalUnit(currentRole, month, organizationalUnitId);
        props.getAllTaskOfChildrenOrganizationalUnit(currentRole, month, organizationalUnitId);

        props.getChildrenOfOrganizationalUnitsAsTree(currentRole);

        setState({
            ...state,
            dataStatus: DATA_STATUS.QUERYING
        })
    }, [])

    useEffect(() => {
        const { details } = state;

        if (state.details !== details) {
            return false;
        }

        props.getCurrentKPIUnit(state.currentRole, state.organizationalUnitId, state.month);
        props.getAllEmployeeKpiInChildrenOrganizationalUnit(state.currentRole, state.month, state.organizationalUnitId);
        props.getAllTaskOfChildrenOrganizationalUnit(state.currentRole, state.month, state.organizationalUnitId)

        setState({
            ...state,
            dataStatus: DATA_STATUS.QUERYING,
        });

        if (state.dataStatus === DATA_STATUS.QUERYING) {
            if (!props.createKpiUnit.currentKPI) {
            }

            if (!props.dashboardOrganizationalUnitKpi.employeeKpisOfChildUnit) {
            }

            if (!props.dashboardOrganizationalUnitKpi.tasksOfChildrenOrganizationalUnit) {
            }

            setState({
                ...state,
                dataStatus: DATA_STATUS.AVAILABLE,
            });

        } else if (state.dataStatus === DATA_STATUS.AVAILABLE) {
            setState({
                ...state,
                dataStatus: DATA_STATUS.FINISHED,
            });
        }
    }, [state.organizationalUnitId, state.month])

    /**
     * Duyệt các kpi con của cùng 1 kpi, mỗi phần tử trả về object gồm tên, đơn vị, số lượng kpi con,... (config dùng trong Tree)
     * @listChildTargetSameParent mảng nhiều chiều
     * @listChildTarget  mảng gồm các dữ liệu phụ(null vẫn chạy ok)
     * @organizationalUnit xác định gốc trong tree
     */
    const traversesListChildTargetSameParent = (listChildTargetSameParent, listChildTarget, listTaskSameParent, organizationalUnit) => {
        let treeData = [];
        if (listChildTargetSameParent.length !== 0) {
            listChildTargetSameParent.map(unit => {
                if (unit.length !== 0) {
                    unit.map(kpi => {
                        if (kpi._id) {
                            let listEmployeeKpi = [], listTask = [], listChildTask = [], listParticipant = [], listChildParticipant = [];

                            // Công số kpi đơn vị con, lấy task, participant của kpi con
                            if (listChildTarget && listChildTarget.length !== 0) {
                                listChildTarget.filter(item => item.parent === kpi.employeeKpi[0].parent)
                                    .map(item => {
                                        listChildTask = item.listTask;
                                        listChildParticipant = item.listParticipant;
                                        listEmployeeKpi = item.listEmployeeKpi;
                                    })
                            }

                            // Lọc child Kpi hiện tại
                            if (kpi.employeeKpi.length !== 0) {
                                if (kpi.employeeKpi[0].creator.length !== 0) {
                                    kpi.employeeKpi.map(item => {
                                        listEmployeeKpi = listEmployeeKpi.concat(item);
                                    })
                                }
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
                                    if (item.creatorInfo._id.length !== 0) {
                                        listParticipant = listParticipant.concat({
                                            '_id': item.creatorInfo._id.length !== 0 && item.creatorInfo._id[0],
                                            'name': item.creatorInfo.name.length !== 0 && item.creatorInfo.name[0],
                                            'email': item.creatorInfo.email.length !== 0 && item.creatorInfo.email[0]
                                        });
                                    }
                                })
                            }
                            if (listTask.length !== 0) {
                                listTask.map(task => {
                                    if (task.accountableEmployeesInfo.length !== 0) {
                                        task.accountableEmployeesInfo.map(item => {
                                            listParticipant = listParticipant.concat(item)
                                        })
                                    }
                                    if (task.consultedEmployeesInfo.length !== 0) {
                                        task.consultedEmployeesInfo.map(item => {
                                            listParticipant = listParticipant.concat(item)
                                        })
                                    }
                                    if (task.informedEmployeesInfo.length !== 0) {
                                        task.informedEmployeesInfo.map(item => {
                                            listParticipant = listParticipant.concat(item)
                                        })
                                    }
                                    if (task.responsibleEmployeesInfo.length !== 0) {
                                        task.responsibleEmployeesInfo.map(item => {
                                            listParticipant = listParticipant.concat(item)
                                        })
                                    }
                                })
                            }
                            // Concat mảng participant kpi hiện tại và kpi con
                            listParticipant = listParticipant.concat(listChildParticipant);
                            // Lọc các phần tử trùng lặp
                            let idArray = listParticipant.map(item => item && item._id);
                            idArray = idArray.map((item, index, array) => {
                                if (array.indexOf(item) === index) {
                                    return index;
                                } else {
                                    return false
                                }
                            })
                            idArray = idArray.filter(item => listParticipant[item]);
                            let listParticipantFilter = idArray.map(item => {
                                return listParticipant[item]
                            })

                            // Phần tử tree
                            treeData.push({
                                id: kpi?.employeeKpi?.[0]?.parent ? kpi?.employeeKpi?.[0]?.parent : TREE_INDEX.current,
                                text: kpi?.organizationalUnit + ' - ' + kpi?._id,
                                name: kpi?._id,
                                state: { "opened": true },
                                parent: kpi?.employeeKpi?.[0]?.parentOfUnitKpi && organizationalUnit && organizationalUnit.text !== kpi.organizationalUnit ? kpi.employeeKpi[0].parentOfUnitKpi.toString() : "#",
                                organizationalUnit: kpi?.organizationalUnit,
                                weight: kpi?.employeeKpi?.[0]?.parentWeight,
                                listEmployeeKpi: listEmployeeKpi,
                                listTask: listTask,
                                listParticipant: listParticipantFilter,
                                deg: kpi?.deg,
                                organizationalUnitId: kpi?.organizationalUnitId
                            })

                            TREE_INDEX.current++;
                        }
                    })
                }

            })
        }

        return treeData;
    };

    const setTreeData = () => {
        const { createKpiUnit, dashboardOrganizationalUnitKpi } = props;
        const { organizationalUnitId } = state;

        let listOrganizationalUnitKpi, listChildTarget, listTask;
        /* Sử dụng JSON để deep copy array and object
        *   Mục đích: Khi thay đổi giá trị sâu trong array và object, không ảnh hưởng đế giá trị gốc lưu trong redux
        */
        if (createKpiUnit?.currentKPI?.kpis) {
            listOrganizationalUnitKpi = JSON.parse(JSON.stringify(createKpiUnit.currentKPI.kpis));
        }
        if (dashboardOrganizationalUnitKpi?.employeeKpisOfChildUnit && dashboardOrganizationalUnitKpi.employeeKpisOfChildUnit !== []) {
            listChildTarget = JSON.parse(JSON.stringify(dashboardOrganizationalUnitKpi.employeeKpisOfChildUnit));
        }
        if (dashboardOrganizationalUnitKpi?.tasksOfChildrenOrganizationalUnit && dashboardOrganizationalUnitKpi.tasksOfChildrenOrganizationalUnit !== []) {
            listTask = JSON.parse(JSON.stringify(dashboardOrganizationalUnitKpi.tasksOfChildrenOrganizationalUnit));
        }

        let organizationalUnitSelectBox = setSelectBox();
        let arrayListChildTargetSameOrganizationUnitKpi = FunctionHelperStatisticKpi.getArrayListChildTargetOrganizationUnitKpi(listOrganizationalUnitKpi, listChildTarget);
        let arrayListTaskSameOrganizationUnitKpi = FunctionHelperStatisticKpi.getArrayListTaskSameOrganizationUnitKpi(listOrganizationalUnitKpi, listTask, listChildTarget);
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
                let listTaskSameParent = arrayListTaskSameOrganizationUnitKpi.filter(item => arrayListChildTargetSameOrganizationUnitKpi?.[i]?.[0]?.[0]?.[0] && item?.[0]?.name === arrayListChildTargetSameOrganizationUnitKpi?.[i]?.[0]?.[0]?.[0]?._id);
                let treeData = [];

                if (arrayListChildTargetSameOrganizationUnitKpi[i]) {
                    for (let j = (arrayListChildTargetSameOrganizationUnitKpi[i].length - 1); j >= 0; j--) {
                        treeData[j] = [];
                        treeData[j] = traversesListChildTargetSameParent(arrayListChildTargetSameOrganizationUnitKpi?.[i]?.[j], treeData?.[j + 1], listTaskSameParent, organizationalUnit?.[0]);
                        treeDatas = treeData?.[j]?.concat(treeDatas);
                    }
                }
            }
        }

        return treeDatas;
    }

    const setSelectBox = () => {
        const { dashboardEvaluationEmployeeKpiSet } = props;

        let childOrganizationalUnit, childrenOrganizationalUnit, organizationalUnitSelectBox;

        if (dashboardEvaluationEmployeeKpiSet) {
            childrenOrganizationalUnit = dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit;
        }

        if (childrenOrganizationalUnit) {
            let temporaryChild;

            childOrganizationalUnit = [{
                'name': childrenOrganizationalUnit.name,
                'id': childrenOrganizationalUnit.id,
                'deputyManager': childrenOrganizationalUnit.deputyManager
            }]

            temporaryChild = childrenOrganizationalUnit.children;

            while (temporaryChild) {
                temporaryChild.map(x => {
                    childOrganizationalUnit = childOrganizationalUnit.concat({
                        'name': x.name,
                        'id': x.id,
                        'deputyManager': x.deputyManager
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
    };

    const onChanged = async (e, data) => {
        TREE_INDEX.current = 0;

        setState({
            ...state,
            details: data.node && data.node.original,
        })

        window.$(`#details-of-organizational-unit-kpi-form`).slideDown();
    };

    const handleSelectOrganizationalUnitId = (value) => {
        INFO_SEARCH.organizationalUnitId = value[0];
    }

    const handleSelectMonth = async (value) => {
        INFO_SEARCH.month = value.slice(3, 7) + '-' + value.slice(0, 2);
    }

    const handleSearchData = () => {
        console.log("hello", INFO_SEARCH)
        if (INFO_SEARCH.month === '-') {
            Swal.fire({
                title: translate('task.task_management.date_not_empty'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
            })
        } else {
            setState({
                ...state,
                organizationalUnitId: INFO_SEARCH.organizationalUnitId,
                month: INFO_SEARCH.month
            })
        }
    }

    const showDistributionOfEmployeeKpiDoc = () => {
        Swal.fire({
            icon: "question",
            html: `<h3 style="color: red"><div>Tính hợp lý khi phân bố mục tiêu (KPI) đơn vị cho các nhân viên trong đơn vị</div> </h3>
            <div style="font-size: 1.3em; text-align: left; margin-top: 15px; line-height: 1.7">
            <p>Biểu đồ này cho biết tính hợp lý khi phân bố  mục tiêu (KPI) đơn vị cho các nhân viên trực thuộc đơn vị (không tính nhân viên trong các đơn vị con).</p>
            <p>Biểu đồ có 2 đường: (1) trọng số các mục tiêu đang được thiết lập của đơn vị, và (2) trọng số các mục tiêu của đơn vị tính theo thiết lập KPI hiện tại của các nhân viên trực thuộc đơn vị. <b>Hai đường càng gần nhau thì mục tiêu của đơn vị đã được phân bổ phù hợp cho các nhân viên.</b></p>
            <p>Cách trọng số các mục tiêu đơn vị được tính theo KPI thiết lập của nhân viên như sau:</p>
            <ul>
                <li>Với mỗi một mục tiêu đơn vị trong tháng, lấy tất cả các mục tiêu của nhân viên hướng tới mục tiêu chung này</li>
                <li>Tính tổng S của các tích (Trọng số mục tiêu nhân viên x Độ quan trọng của nhân viên)</li>
                <li>Trọng số mục tiêu đơn vị theo phân tích = S / (Tổng độ quan trọng nhân viên)</li>
            </ul>
            </div>`,

            width: "50%",
        })
    }

    const showDistributionOfOrganizationalUnitKpiDoc = () => {
        Swal.fire({
            icon: "question",

            html: `<h3 style="color: red"><div>Tính hợp lý khi phân bố mục tiêu (KPI) đơn vị cho các đơn vị con</div> </h3>
            <div style="font-size: 1.3em; text-align: left; margin-top: 15px; line-height: 1.7">
            <p>Biểu đồ này cho biết tính hợp lý khi phân bố  mục tiêu (KPI) đơn vị cho các đơn vị con. Biểu đồ có 3 đường: (1) trọng số các mục tiêu đang được thiết lập của đơn vị, (2) trọng số các mục tiêu của đơn vị tính theo thiết lập KPI hiện tại của các đơn vị con trực thuộc đơn vị, (3) trọng số các mục tiêu của đơn vị tính theo thiết lập KPI hiện tại của tất cả các đơn vị con trực tiếp và gián tiếp. <b>Ba đường càng gần nhau thì mục tiêu của đơn vị đã được phân bổ phù hợp cho các đơn vị con. </b></p>
            <p>Lưu ý: nếu đường số (2) cách xa đường số (3), các đơn vị con trực thuộc đang chưa phân bổ mục tiêu phù hợp cho các đơn vị con của các đơn vị đó.</p>
            <p>Cách trọng số các mục tiêu đơn vị được tính theo KPI thiết lập của các đơn vị con trực thuộc đơn vị như sau</p>
            <ul>
                <li>Với mỗi một mục tiêu đơn vị trong tháng, lấy tất cả các mục tiêu của đơn vị con trực thuộc hướng tới mục tiêu chung này</li>
                <li>Tính tổng S của các tích (Trọng số mục tiêu đơn vị con trực thuộc x Độ quan trọng của đơn vị con)</li>
                <li>Trọng số mục tiêu đơn vị theo phân tích = S / (Tổng độ quan trọng các đơn vị con trực thuộc)</li>
            </ul>
            <p>Trọng số các mục tiêu đơn vị tính theo KPI thiết lập của tất cả các đơn vị con trực tiếp và gián tiếp được tính tương tự như trên. Nhưng "Trọng số mục tiêu đơn vị con trực thuộc" không lấy trực tiếp từ trọng số đang được thiết lập của đơn vị con trực thuộc nữa, mà được tính đệ quy từ trọng số đang được thiết lập của các đơn vị con trực tiếp và gián tiếp của nó.</p>
            </div>`,
            width: "50%",
        })
    }

    let dataTree = setTreeData()
    let organizationalUnitSelectBox = setSelectBox()
    let organizationalUnitNotInitialKpi

    if (dashboardEvaluationEmployeeKpiSet) {
        childrenOrganizationalUnit = dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit;
        childrenOrganizationalUnitLoading = dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnitLoading;
    }
    if (createKpiUnit) {
        currentKPI = createKpiUnit.currentKPI;
        organizationalUnitKpiLoading = createKpiUnit.organizationalUnitKpiLoading;
    }
    if (dashboardOrganizationalUnitKpi) {
        listChildTarget = dashboardOrganizationalUnitKpi.employeeKpisOfChildUnit;
    }

    // Lọc các đơn vị chưa khởi tạo KPI
    if (listChildTarget?.length > 0) {
        organizationalUnitNotInitialKpi = listChildTarget.filter(item => item?.length <= 1)
    }

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

    if (!details) {
        window.$(`#${dataTree?.[0]?.id}_anchor`).addClass('jstree-clicked')
    }

    return (
        <React.Fragment>
            <div className="box">
                {childrenOrganizationalUnit
                    ? <div className="box-body qlcv">
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
                                        onChange={handleSelectOrganizationalUnitId}
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
                                    onChange={handleSelectMonth}
                                    disabled={false}
                                />
                            </div>
                            <div className="form-group">
                                <button type="button" className="btn btn-success" onClick={handleSearchData}>{translate('kpi.evaluation.employee_evaluation.search')}</button>
                            </div>
                        </div>


                        <div className="row row-equal-height">
                            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6" style={{ padding: 10, maxHeight: "400px" }}>
                                <div id="details-tree" className="description-box" style={{ height: "100%" }}>
                                    {currentKPI
                                        ? <React.Fragment>
                                            <h4 className="box-title">
                                                <span>Cây KPI đơn vị tháng {month.slice(5, 7) + "-" + month.slice(0, 4)}</span>
                                                <a className="text-red" title={translate('kpi.organizational_unit.statistics.unit_not_initial_kpi')} onClick={() => showListInSwal(organizationalUnitNotInitialKpi?.map(item => item?.[0]?.name), translate('kpi.organizational_unit.statistics.unit_not_initial_kpi'))}>
                                                    <i className="fa fa-question-circle" style={{ color: '#dd4b39', cursor: 'pointer', marginLeft: '5px' }} />
                                                </a>
                                            </h4>
                                            
                                            <Tree
                                                id="tree-qlcv-document"
                                                onChanged={onChanged}
                                                data={dataTree}
                                                plugins={false}
                                            />
                                        </React.Fragment>
                                        : organizationalUnitKpiLoading
                                        && <h4>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.not_initialize')} {month.slice(5, 7) + "-" + month.slice(0, 4)}</h4>
                                    }
                                    <SlimScroll outerComponentId="details-tree" innerComponentId="tree-qlcv-document" innerComponentWidth={"100%"} activate={true} />
                                </div>
                            </div>

                            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6" style={{ padding: 10, maxHeight: "400px" }}>
                                <DetailsOfOrganizationalUnitKpiForm
                                    details={details ? details : dataTree?.[0]}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-xs-12" style={{ padding: 10 }}>
                                <div className="description-box" style={{ height: "100%" }}>
                                    <h4 className="box-title">
                                        <span>Tính hợp lý khi phân bố mục tiêu (KPI) đơn vị cho các nhân viên trong đơn vị, tháng {month.slice(5, 7) + "-" + month.slice(0, 4)}</span>
                                        <a className="text-red" title={translate('task.task_management.explain')} onClick={() => showDistributionOfEmployeeKpiDoc()}>
                                            <i className="fa fa-question-circle" style={{ color: '#dd4b39', cursor: 'pointer', marginLeft: '5px' }} />
                                        </a>
                                    </h4>

                                    <DistributionOfEmployeeKpiChart
                                        organizationalUnitKPI={dataTree.filter(item => item.parent === '#')}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-xs-12" style={{ padding: 10 }}>
                                <div className="description-box" style={{ height: "100%" }}>
                                    <h4 className="box-title">
                                        <span>Tính hợp lý khi phân bố mục tiêu (KPI) đơn vị cho các đơn vị con, tháng {month.slice(5, 7) + "-" + month.slice(0, 4)}</span>
                                        <a className="text-red" title={translate('task.task_management.explain')} onClick={() => showDistributionOfOrganizationalUnitKpiDoc()}>
                                            <i className="fa fa-question-circle" style={{ color: '#dd4b39', cursor: 'pointer', marginLeft: '5px' }} />
                                        </a>
                                    </h4>

                                    <DistributionOfOrganizationalUnitKpiChart
                                        organizationalUnitKPI={dataTree.filter(item => item.parent === '#')}
                                        dataTreeUnitKpi={dataTree}
                                        maxDeg={listChildTarget?.[listChildTarget.length - 1]?.[0]?.deg}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    : childrenOrganizationalUnitLoading
                    && <div className="box-body">
                        <h4>Bạn chưa có đơn vị</h4>
                    </div>
                }
            </div>
        </React.Fragment>
    )
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

export default connect(mapState, actions)(withTranslate(StatisticsOfOrganizationalUnitKpi));
