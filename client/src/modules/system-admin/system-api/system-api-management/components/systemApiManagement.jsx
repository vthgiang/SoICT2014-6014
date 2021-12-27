import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { SelectMulti, PaginateBar, DataTableSetting, DeleteNotification } from '../../../../../common-components';
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration'

import { SystemApiActions } from '../redux/actions'

import { SystemApiCreateModal } from './systemApiCreateModal'
import { SystemApiEditModal } from './systemApiEditModal'
import { SystemApiUpdateModal } from './systemApiUpdateModal';

const SystemApiManagement = (props) => {
    const { translate, systemApis } = props
    const [listPaginateApi, setListPaginateApi] = useState();
    const [updateApiLog, setUpdateApiLog] = useState(null);

    const tableId = "table-management-system-api";
    const defaultConfig = { limit: 20 }
    const limit = getTableConfiguration(tableId, defaultConfig).limit;

    const [state, setState] = useState({
        path: null,
        method: [],
        description: null,
        page: 1,
        perPage: limit
    })
    const [systemApiEdit, setSystemApiEdit] = useState({})

    const { path, method, description, page, perPage } = state;

    const systemApiManageGetSystemApis = () => {
        props.getSystemApis({
            page: page,
            perPage: perPage
        })
    };

    useEffect(() => {
        systemApiManageGetSystemApis();
    }, [])

    useEffect(() => {
        if (systemApis) setListPaginateApi(systemApis.listPaginateApi)
    }, [systemApis]);

    const handleChangePath = (e) => {
        setState({
            ...state,
            path: e.target.value
        })
    }

    const handleChangeDescription = (e) => {
        setState({
            ...state,
            description: e.target.value
        })
    }

    const handleChangeMethod = (value) => {
        setState({
            ...state,
            method: value
        })
    }

    const handleSunmitSearch = () => {
        props.getSystemApis({
            path: path,
            method: method,
            description: description,
            page: page,
            perPage: perPage
        })
    }

    const setLimit = (value) => {
        if (Number(value) !== perPage) {
            setState({
                ...state,
                page: 1,
                perPage: Number(value)
            })
            props.getSystemApis({
                path: path,
                method: method,
                description: description,
                page: 1,
                perPage: Number(value)
            })
        }
    }

    const handleGetDataPagination = (value) => {
        setState({
            ...state,
            page: value
        })
        props.getSystemApis({
            path: path,
            method: method,
            description: description,
            page: value,
            perPage: perPage
        })
    }

    const handleAddApi = () => {
        window.$("#create-system-api-modal").modal("show");
    }

    const handleEdit = (api) => {
        setSystemApiEdit(api)

        window.$("#edit-system-api-modal").modal("show");
    }

    const handleUpdateSystemApi = async () => {
        const updateLog = await props.updateSystemApi();
        setUpdateApiLog(updateLog);
        window.$("#update-system-api-modal").modal("show");
    }

    const renderSystemApiTable = () => (
        <table id={tableId} className="table table-hover table-striped table-bordered">
            <thead>
                <tr>
                    <th style={{ width: '40px' }}>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.no_')}</th>
                    <th>{translate('system_admin.system_api.table.path')}</th>
                    <th>{translate('system_admin.system_api.table.method')}</th>
                    <th>{translate('system_admin.system_api.table.description')}</th>
                    <th style={{ width: "120px" }}>
                        {translate('table.action')}
                        <DataTableSetting
                            tableId={tableId}
                            hideColumn={false}
                            setLimit={setLimit}
                        />
                    </th>
                </tr>
            </thead>
            <tbody>
                {listPaginateApi?.length > 0
                    && listPaginateApi.map((api, index) =>
                        <tr key={api?._id}>
                            <td>{index + 1}</td>
                            <td>{api?.path}</td>
                            <td>{api?.method}</td>
                            <td>{api?.description}</td>
                            <td style={{ textAlign: 'center' }}>
                                <a onClick={() => handleEdit(api)} className="edit" title={translate('system_admin.system_api.modal.edit_title')}><i className="material-icons">edit</i></a>
                                <DeleteNotification
                                    content={translate('system_admin.system_api.modal.delete_title')}
                                    data={{
                                        id: api?._id,
                                        info: api?.path
                                    }}
                                    func={props.deleteSystemApi}
                                />
                            </td>
                        </tr>
                    )
                }
            </tbody>
        </table>
    )

    return (
        <React.Fragment>
            <SystemApiCreateModal />
            {updateApiLog &&
                <SystemApiUpdateModal
                    updateApiLog={updateApiLog}
                    systemApiManageGetSystemApis={systemApiManageGetSystemApis}
                />
            }
            <SystemApiEditModal
                _id={systemApiEdit?._id}
                systemApi={systemApiEdit}
            />
            <div className="box" >
                <div className="box-body qlcv">
                    <div className="form-inline">
                        {/* Path */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('system_admin.system_api.table.path')}</label>
                            <input className="form-control" type="text" placeholder={translate('system_admin.system_api.placeholder.input_path')} name="name" onChange={(e) => handleChangePath(e)} />
                        </div>

                        {/* Description */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('system_admin.system_api.table.description')}</label>
                            <input className="form-control" type="text" placeholder={translate('system_admin.system_api.placeholder.input_description')} name="name" onChange={(e) => handleChangeDescription(e)} />
                        </div>

                        <button
                            type="button"
                            onClick={handleUpdateSystemApi}
                            className="btn btn-success pull-right"
                            title={translate('system_admin.system_api.modal.create_title')}
                        >
                            {translate('system_admin.system_api.update')}
                        </button>

                        <button
                            type="button"
                            onClick={() => handleAddApi()}
                            className="btn btn-success pull-right"
                            title={translate('task.task_management.add_title')}
                        >
                            {translate('task.task_management.add_task')}
                        </button>
                    </div>

                    <div className="form-inline" style={{ marginBottom: 15 }}>
                        {/* Method */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('system_admin.system_api.table.method')}</label>
                            <SelectMulti
                                id={`method-management-system-api`}
                                items={[
                                    {
                                        text: 'GET',
                                        value: 'GET'
                                    },
                                    {
                                        text: 'PUT',
                                        value: 'PUT'
                                    },
                                    {
                                        text: 'PATCH',
                                        value: 'PATCH'
                                    },
                                    {
                                        text: 'POST',
                                        value: 'POST'
                                    },
                                    {
                                        text: 'DELETE',
                                        value: 'DELETE'
                                    }
                                ]}
                                options={{
                                    allSelectedText: translate('system_admin.system_api.select_all_method'),
                                    nonSelectedText: translate('system_admin.system_api.non_select_method'),
                                }}
                                onChange={handleChangeMethod}
                            />
                        </div>

                        {/* Button tìm kiếm */}
                        <div className="form-group">
                            <label></label>
                            <button type="button" className="btn btn-success" title={translate('general.search')} onClick={() => handleSunmitSearch()} >{translate('general.search')}</button>
                        </div>
                    </div>

                    {renderSystemApiTable()}

                    <PaginateBar
                        display={systemApis?.listPaginateApi?.length}
                        total={systemApis?.totalSystemApis}
                        pageTotal={systemApis?.totalPages}
                        currentPage={page}
                        func={handleGetDataPagination}
                    />
                </div>
            </div>
        </React.Fragment>
    )
}

function mapState(state) {
    const { systemApis } = state
    return { systemApis }
}
const actions = {
    getSystemApis: SystemApiActions.getSystemApis,
    updateSystemApi: SystemApiActions.updateSystemApi,
    deleteSystemApi: SystemApiActions.deleteSystemApi
}

export default connect(mapState, actions)(withTranslate(SystemApiManagement))