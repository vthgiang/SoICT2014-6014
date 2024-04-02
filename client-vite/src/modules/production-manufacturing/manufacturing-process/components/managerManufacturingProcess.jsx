import React, { useState, useEffect } from "react";
import { withTranslate } from "react-redux-multilingual";
import { connect } from 'react-redux';
import { DataTableSetting, DatePicker, PaginateBar, SelectBox, SelectMulti, Tree, TreeTable, DeleteNotification } from '../../../../common-components';

import { getTableConfiguration } from '../../../../helpers/tableConfiguration';

import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { ManagerChainActions } from "../../manage-chain/redux/actions";
import { ManufacturingProcessActions } from './../redux/actions';
import { TaskProcessActions } from './../../../task/task-process/redux/actions';
import { NewManufacturingProcessModal } from "./create-manufacturing-process/newManufacturingProcessModal";
import { EditManufacturingProcessModal } from "./create-manufacturing-process/editManufacturingProcessModal";

const ManagerManufacturingProcess = (props) => {
    const tableId = "manufacturing-process-tableID"
    const defaultConfig = { limit: 10 }
    const limit = getTableConfiguration(tableId, defaultConfig).limit;

    const [state, setState] = useState({
        processName: "",
        processEditId: undefined,
        page: 1,
        perPage: limit,
        tableId
    })

    const { translate, manufacturingProcess } = props
    const { page, perPage, processName } = state

    useEffect(() => {
        props.getAllUsers()
        props.getAllDepartments()
        props.getAllProductionLines()
        props.getAllManufacturingProcess()
        props.getAllXmlDiagramTemplate()
    }, [])

    const setPage = (pageNumber) => {
        setState({
            ...state,
            page: parseInt(pageNumber)
        });

        props.getAllManufacturingProcess({
            processName,
            perPage,
            page: parseInt(pageNumber)
        });
    }

    const handleChangeStartDate = () => {

    }

    const handleChangeEndDate = () => {

    }

    const handleUpdateData = () => {

    }

    const handleShowDetailInfo = (item) => {
        setState({
            ...state,
            currentRow: item
        })
        window.$('#modal-manufacturing-process').modal('show')
    }

    const handleNewManufacturingProcess = () => {
        window.$('#modal-create-new-manufacturing-process').modal('show');
    }

    const handleEditManufacturingProcess = (item) => {
        setState({
            ...state,
            processManufacturingEdit: item
        })
        item._id && props.getManufacturingProcessByID(item._id)
        window.$('#edit-modal-manufacturing-process').modal('show')
    }

    const handleDelete = (id) => {
        props.deleteManufacturingProcess(id);
        props.getAllManufacturingProcess()
    }

    const setLimit = (number) => {
        setState({
            ...state,
            perPage: parseInt(number),
            page: 1
        });
        props.getExamples({
            processName,
            perPage: parseInt(number),
            page: 1
        });
    }

    const listProcess = props.manufacturingProcess.list
    const totalPage = manufacturingProcess && Math.ceil(manufacturingProcess.totalList / perPage);

    return (
        <React.Fragment>

            <div className="box" style={{ minHeight: "450px" }}>
                <div className="box-body qlcv">
                    {/*Create new manufacturing proceess Component*/}
                    {/* <CreateManufacturingProcessModal size="100" width="160"/> */}
                    {/*Edit manufacturing proceess Component. */}
                    {
                        state.processManufacturingEdit &&
                        <EditManufacturingProcessModal processManufacturingEdit={state.processManufacturingEdit} />
                    }
                    <NewManufacturingProcessModal />
                    <div id="tasks-filter" className="form-inline">
                        <div className="form-group">
                            <label>{translate('manufacturing_managerment.manufacturing_process.identification')}</label>
                            <input className="form-control" type="text" placeholder={translate('manufacturing_managerment.manufacturing_process.identification')} name="name" />
                        </div>

                        <div className="form-group">
                            <label>{translate('manufacturing_managerment.manufacturing_process.process_name')}</label>
                            <input className="form-control" type="text" placeholder={translate('manufacturing_managerment.manufacturing_process.process_name')} name="name" />
                        </div>

                        <div className="form-group">
                            <label>{translate('manufacturing_managerment.manufacturing_process.supervisor')}</label>
                            <input className="form-control" type="text" placeholder={translate('manufacturing_managerment.manufacturing_process.supervisor')} name="name" />
                        </div>

                        <div className="form-group">
                            <label>{translate('task.task_management.start_date')}</label>
                            <DatePicker
                                id="start-date"
                                dateFormat="date-month-year"
                                value={""}
                                onChange={handleChangeStartDate}
                                disabled={false}
                            />
                        </div>

                        <div className="form-group">
                            <label>{translate('task.task_management.end_date')}</label>
                            <DatePicker
                                id="end-date"
                                dateFormat="date-month-year"
                                value={""}
                                onChange={handleChangeEndDate}
                                disabled={false}
                            />
                        </div>

                        <div className="form-group">
                            <button type="button" className="btn btn-success" onClick={handleUpdateData}>{translate('task.task_management.search')}</button>
                        </div>
                    </div>

                    {/* <div className="row pull-right" style={{ margin: "10px" }}>
                        <button className="btn btn-success" onClick={() => handleAddManufacturingProcess()}>{translate('manufacturing_managerment.manufacturing_process.add_button')}</button>
                    </div> */}

                    <div className="row pull-right" style={{ margin: "10px" }}>
                        <button className="btn btn-success" onClick={() => handleNewManufacturingProcess()}>{translate('manufacturing_managerment.manufacturing_process.add_button')}</button>
                    </div>
                    <table id={tableId} className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th className="col-fixed" style={{ width: 60 }}>{translate('manufacturing_managerment.manufacturing_process.index')}</th>
                                <th>{translate('manufacturing_managerment.manufacturing_process.identification')}</th>
                                <th>{translate('manufacturing_managerment.manufacturing_process.process_name')}</th>
                                <th>{translate('manufacturing_managerment.manufacturing_process.employee_number')}</th>
                                <th>{translate('manufacturing_managerment.manufacturing_process.progress')}</th>
                                <th>{translate('manufacturing_managerment.manufacturing_process.production_target')}</th>
                                <th>{translate('manufacturing_managerment.manufacturing_process.supervisor')}</th>
                                <th>{translate('manufacturing_managerment.manufacturing_process.process_status')}</th>
                                <th style={{ width: "120px", textAlign: "center" }}>{translate('table.action')}
                                    <DataTableSetting
                                        tableId={tableId}
                                        columnArr={[
                                            translate('manufacturing_managerment.manufacturing_process.index'),
                                            translate('manufacturing_managerment.manufacturing_process.process_name'),
                                            translate('manufacturing_managerment.manufacturing_process.employee_number'),
                                            translate('manufacturing_managerment.manufacturing_process.progress'),
                                            translate('manufacturing_managerment.manufacturing_process.production_target'),
                                            translate('manufacturing_managerment.manufacturing_process.supervisor'),
                                            translate('manufacturing_managerment.manufacturing_process.process_status')
                                        ]}
                                        setLimit={setLimit}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(listProcess && listProcess.length !== 0) &&
                                listProcess.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1 + (page - 1) * perPage}</td>
                                        <td>{item.manfucturingProcessCode}</td>
                                        <td>{item.manufacturingName}</td>
                                        <td>{item.employee_number}</td>
                                        <td>{item.progress}</td>
                                        <td>{item.quantityOfDay}</td>
                                        <td>{item.managerEmployee.map(u => u.name).join(', ')}</td>
                                        <td>{item.processStatus}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a className="edit text-green" style={{ width: '5px' }} title={translate('manage_example.detail_info_example')} onClick={(item) => handleShowDetailInfo(item)}><i className="material-icons">visibility</i></a>
                                            <a className="edit text-yellow" style={{ width: '5px' }} title={translate('manage_example.edit')} onClick={() => handleEditManufacturingProcess(item)}><i className="material-icons">edit</i></a>
                                            <DeleteNotification
                                                content={translate('manage_example.delete')}
                                                data={{
                                                    id: item._id,
                                                    info: item.manufacturingName
                                                }}
                                                func={handleDelete}
                                            />
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    {
                        (typeof listProcess === 'undefined' || listProcess.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                    <PaginateBar
                        pageTotal={totalPage ? totalPage : 0}
                        currentPage={page}
                        display={listProcess && listProcess.length !== 0 && listProcess.length}
                        total={manufacturingProcess && manufacturingProcess.totalList}
                        func={setPage}
                    />
                </div>
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = state => {
    const { user, department, auth, manufacturingLineTemplate, manufacturingProcess, taskProcess } = state;
    return { user, department, auth, manufacturingLineTemplate, manufacturingProcess, taskProcess }
}

const mapDispatchToProps = {
    getManufacturingProcessByID: ManufacturingProcessActions.getManufacturingProcessByID,
    getAllManufacturingProcess: ManufacturingProcessActions.getAllManufacturingProcess,
    deleteManufacturingProcess: ManufacturingProcessActions.deleteManufacturingProcess,
    getAllProductionLines: ManagerChainActions.getChainsList,
    getAllUsers: UserActions.get,
    getAllDepartments: DepartmentActions.get,
    getAllXmlDiagramTemplate: TaskProcessActions.getAllXmlDiagram,
}

const connectManagerManufacturingProcess = connect(mapStateToProps, mapDispatchToProps)(withTranslate(ManagerManufacturingProcess))
export { connectManagerManufacturingProcess as ManagerManufacturingProcess }