import React, { useState } from 'react';
import { withTranslate } from "react-redux-multilingual";
import { connect } from 'react-redux';

import { DetailTaskPerformModal } from './detailTaskPerformModal'

import { getTableConfiguration } from '../../../../helpers/tableConfiguration';
import { DataTableSetting, PaginateBar } from '../../../../common-components';

const TaskManufacturingManager = (props) => {
    const tableId = "task-manufacturing-manager-tableID";
    const defaultConfig = { limit: 10 };
    const limit = getTableConfiguration(tableId, defaultConfig).limit;

    const [state, setState] = useState({
        page: 1,
        perPage: limit,
        tableId,
    })

    const setPage = () => {

    }

    const setLimit = () => {

    }

    const handleEditTaskPerform = (item) => {
        window.$(`#detail-task-perform-manufacturing`).modal("show")
    }

    const handleStartTimer = (item) => {

    }

    const { translate } = props;
    const { page, perPage } = state;
    const taskActionManagerList = [{}, {}];
    const totalPage = 10;

    return (
        <React.Fragment>
            <div className="box" style={{ minHeight: "450px" }}>
                <div className="box-body qlcv">
                    <div id="tasks-filter" className="form-inline">
                    </div>
                    <table id={tableId} className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th className="col-fixed" style={{ width: 60 }}>{translate('manufacturing_managerment.management_task_action.index')}</th>
                                <th>{translate('manufacturing_managerment.management_task_action.unitOrganizational')}</th>
                                <th>{translate('manufacturing_managerment.management_task_action.processManufacturingName')}</th>
                                <th>{translate('manufacturing_managerment.management_task_action.taskProcessName')}</th>
                                <th>{translate('manufacturing_managerment.management_task_action.productDone')}</th>
                                <th>{translate('manufacturing_managerment.management_task_action.progress')}</th>
                                <th>{translate('manufacturing_managerment.management_task_action.date')}</th>
                                <th>{translate('manufacturing_managerment.management_task_action.performer')}</th>
                                <th>{translate('manufacturing_managerment.management_task_action.reporter')}</th>
                                <th style={{ width: "120px", textAlign: "center" }}>{translate('table.action')}
                                    <DataTableSetting
                                        tableId={tableId}
                                        columnArr={[
                                            translate('manufacturing_managerment.management_task_action.index'),
                                            translate('manufacturing_managerment.management_task_action.unitOrganizational'),
                                            translate('manufacturing_managerment.management_task_action.processManufacturingName'),
                                            translate('manufacturing_managerment.management_task_action.taskProcessName'),
                                            translate('manufacturing_managerment.management_task_action.productDone'),
                                            translate('manufacturing_managerment.management_task_action.progress'),
                                            translate('manufacturing_managerment.management_task_action.date'),
                                            translate('manufacturing_managerment.management_task_action.performer'),
                                            translate('manufacturing_managerment.management_task_action.reporter'),
                                        ]}
                                        setLimit={setLimit}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(taskActionManagerList && taskActionManagerList.length !== 0) &&
                                taskActionManagerList.map((item, index) => (
                                    <tr key={index}>
                                        <td></td>
                                        <td>Đơn vị sản xuất may mặc</td>
                                        <td>Sản xuất áo sơ mi nam</td>
                                        <td>May cổ áo</td>
                                        <td></td>
                                        <td>30%</td>
                                        <td>20/3/2020</td>
                                        <td>Nguyễn Hiêu</td>
                                        <td></td>
                                        <td style={{ textAlign: "center" }}>
                                            <a className="edit text-yellow" style={{ width: '5px' }} title={translate('general.edit')} onClick={(item) => handleEditTaskPerform(item)}><i className="material-icons">edit</i></a>
                                            <a className="timer text-black" style={{ width: '5px' }} title={translate('general.edit')} onClick={(item) => handleStartTimer(item)}><i className="material-icons">timer</i></a>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    {
                        (typeof taskActionManagerList === 'undefined' || taskActionManagerList.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                    <PaginateBar
                        pageTotal={totalPage ? totalPage : 0}
                        currentPage={page}
                        display={taskActionManagerList && taskActionManagerList.length !== 0 && taskActionManagerList.length}
                        total={10}
                        func={setPage}
                    />
                </div>
                <DetailTaskPerformModal/>
            </div>
        </React.Fragment>
    )
}

const connectTaskManufacturingManager = connect()(withTranslate(TaskManufacturingManager))
export { connectTaskManufacturingManager as TaskManufacturingManager }
