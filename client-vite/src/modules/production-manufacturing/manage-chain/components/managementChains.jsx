import React, { useState, useEffect } from "react";
import { withTranslate } from "react-redux-multilingual";
import { connect } from 'react-redux';
import { DataTableSetting, DatePicker, PaginateBar, SelectBox, SelectMulti, Tree, TreeTable, DeleteNotification } from '../../../../common-components';
import { getStorage } from '../../../../config';

import { DepartmentActions } from '../../../../modules/super-admin/organizational-unit/redux/actions';
import { UserActions } from '../../../../modules/super-admin/user/redux/actions';
import { CreateChainsUnitModal } from "./createChainsUnitModal";
import { getTableConfiguration } from '../../../../helpers/tableConfiguration';
import { ManagerChainActions } from './../redux/actions';
import { TaskProcessActions } from './../../../task/task-process/redux/actions';
import { EditChainsUnitModal } from "./editChainsUnitModal";

const ManagementChains = (props) => {
    const tableId = "process-chain-tableID";
    const defaultConfig = { limit: 10 };
    const limit = getTableConfiguration(tableId, defaultConfig).limit;

    const [state, setState] = useState({
        processName: "",
        page: 1,
        perPage: limit,
        tableId,
        templateEdit: null
    })

    const { page, perPage, processName, user } = state
    const { translate, manufacturingLineTemplate } = props;

    useEffect(() => {
        props.getUsers()
        props.getAllDepartments()
        props.getAllChainsList()
        props.getAllXmlDiagram()
    }, [])

    const setLimit = (number) => {
        setState({
            ...state,
            perPage: parseInt(number),
            page: 1,
        })

        props.getAllChainsList({
            processName,
            perPage: parseInt(number),
            page: 1
        })
    }

    const setPage = (pageNumber) => {
        setState({
            ...state,
            page: parseInt(pageNumber)
        });
        props.getAllChainsList({
            processName,
            perPage,
            page: parseInt(pageNumber)
        })
    }

    const handleShowDetailTemplate = (item) => {

    }

    const handleEditTemplate = (id, item) => {
        setState({
            ...state,
            templateEdit: item
        })
        window.$(`#modal-edit-chain-unit`).modal("show")
    }

    const handleProcessTemplateDelete = (id) => {
        props.deleteChainProcess(id)
        props.getAllChainsList()
    }

    function handleTask() {

    }

    const handleChangeNameChain = () => {

    }

    const handleChangeAssistantEmployees = () => {

    }

    const handleUpdateData = () => {

    }

    const handleAddForm = () => {
        window.$('#modal-create-chain-unit').modal('show')
    }

    const listProcessChains = manufacturingLineTemplate.lists;
    let templateEdit = state.templateEdit ? state.templateEdit : "";

    const totalPage = manufacturingLineTemplate && Math.ceil(manufacturingLineTemplate.totalList / perPage);
    let units = [];
    let userId = getStorage("userId");

    if (user) units = user.organizationalUnitsOfUser;

    return (
        <React.Fragment>
            <div className="box" style={{ minHeight: "450px" }}>
                <div className="box-body qlcv">
                    <div id="tasks-filter" className="form-inline">
                        <div className="form-group">
                            <label>{translate('manufacturing_managerment.management_chain.unit_production')}</label>
                            {units &&
                                <SelectMulti id="multiSelectUnit1"
                                    defaultValue={units.map(item => item._id)}
                                    items={units.map(item => { return { value: item._id, text: item.name } })}
                                    onChange={handleTask()}
                                    options={{ nonSelectedText: translate('task.task_management.select_department'), allSelectedText: translate(`task.task_management.select_all_department`) }}>
                                </SelectMulti>
                            }
                        </div>

                        {/* Tên dây chuyền */}
                        <div className="form-group">
                            <label>{translate('manufacturing_managerment.management_chain.chain_name')}</label>
                            <input className="form-control" type="text" placeholder={translate('task.task_management.search_by_employees')} name="name" onChange={(e) => handleChangeNameChain(e)} />
                        </div>

                        {/* Người phê duyệt */}
                        <div className="form-group">
                            <label>{translate('manufacturing_managerment.management_chain.employee_approver')}</label>
                            <input className="form-control" type="text" placeholder={translate('task.task_management.search_by_employees')} name="name" onChange={(e) => handleChangeAssistantEmployees(e)} />
                        </div>
                        
                        {/* Người được xem */}
                        <div className="form-group">
                            <label>{translate('manufacturing_managerment.management_chain.employee_watcher')}</label>
                            <input className="form-control" type="text" placeholder={translate('task.task_management.search_by_employees')} name="name" onChange={(e) => handleChangeAssistantEmployees(e)} />
                        </div>

                        <div className="form-group" style={{marginLeft: "30px"}}>
                            <button type="button" className="btn btn-success" onClick={() => handleUpdateData()}>{translate('task.task_management.search')}</button>
                        </div>
                    </div>


                    <div style={{ height: "40px" }}>
                        <CreateChainsUnitModal size="100" width="160" />
                        <EditChainsUnitModal size="100" width="160" id={templateEdit._id} templateEdit={templateEdit}/>
                        <button type="button"
                            className="btn btn-success pull-right"
                            title={translate('task.task_management.add_title')}
                            onClick={handleAddForm}
                        >
                            {translate('task.task_management.add_task')}
                        </button>
                    </div>
                    <table id={tableId} className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th className="col-fixed" style={{ width: 60 }}>{translate('manufacturing_managerment.management_chain.index')}</th>
                                <th>{translate('manufacturing_managerment.management_chain.unit_production')}</th>
                                <th>{translate('manufacturing_managerment.management_chain.chain_name')}</th>
                                <th>{translate('manufacturing_managerment.management_chain.employee_approver')}</th>
                                <th style={{ width: "120px", textAlign: "center" }}>{translate('table.action')}
                                    <DataTableSetting
                                        tableId={tableId}
                                        columnArr={[
                                            translate('manufacturing_managerment.management_chain.index'),
                                            translate('manufacturing_managerment.management_chain.unit_production'),
                                            translate('manufacturing_managerment.management_chain.chain_name'),
                                            translate('manufacturing_managerment.management_chain.employee_approver'),
                                        ]}
                                        setLimit={setLimit}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(listProcessChains && listProcessChains.length !== 0) &&
                                listProcessChains.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1 + (page - 1) * perPage}</td>
                                        <td>{item.organizationalUnit ? item.organizationalUnit.name : ""}</td>
                                        <td>{item.manufacturingLineName ?  item.manufacturingLineName : ""}</td>
                                        <td>{item.approverEmployee.map(u => u.name).join(', ')}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a className="edit text-green" style={{ width: '5px' }} title={translate('manage_example.detail_info_example')} onClick={handleShowDetailTemplate(item)}><i className="material-icons">visibility</i></a>
                                            <a className="edit text-yellow" style={{ width: '5px' }} title={translate('manage_example.edit')} onClick={() => handleEditTemplate(index, item)}><i className="material-icons">edit</i></a>
                                            <DeleteNotification
                                                content={translate('manage_example.delete')}
                                                data={{
                                                    id: item._id,
                                                    info: item.manufacturingLineName
                                                }}
                                                func={handleProcessTemplateDelete}
                                            />
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    {
                        (typeof listProcessChains === 'undefined' || listProcessChains.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                    <PaginateBar
                        pageTotal={totalPage ? totalPage : 0}
                        currentPage={page}
                        display={listProcessChains && listProcessChains.length !== 0 && listProcessChains.length}
                        total={manufacturingLineTemplate && manufacturingLineTemplate.totalList}
                        func={setPage}
                    />
                </div>
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = state => {
    const { assetsManager, assetType, user, department, auth, manufacturingLineTemplate } = state;
    return { assetsManager, assetType, user, department, auth, manufacturingLineTemplate }
}

const mapDispatchToProps = {
    getUsers: UserActions.get,
    getAllDepartments: DepartmentActions.get,
    getAllChainsList: ManagerChainActions.getChainsList,
    getAllXmlDiagram: TaskProcessActions.getAllXmlDiagram,
    deleteChainProcess: ManagerChainActions.deleteChainTemplate
}

const connectManageChains = connect(mapStateToProps, mapDispatchToProps)(withTranslate(ManagementChains))
export { connectManageChains as ManagementChains }