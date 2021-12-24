import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { SelectMulti, PaginateBar, DataTableSetting, DeleteNotification } from '../../../../../common-components';
import { sendRequest } from '../../../../../helpers/requestHelper';
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration'
import '../styles/systemApiManagement.css';

import { SystemApiActions } from '../redux/actions'

import { SystemApiCreateModal } from './systemApiCreateModal'
import { SystemApiEditModal } from './systemApiEditModal'

const SystemApiManagement = (props) => {
    const { translate, systemApis } = props

    const [updateApiLog, setUpdateApiLog] = useState(null);

    const tableId = "table-management-system-api";
    const updateApiLogTableId = "table-management-system-api-update-api-log";
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

    useEffect(() => {
        props.getSystemApis({
            page: page,
            perPage: perPage
        })

        const getSystemApiUpdateLog = async () => {
            try {
                const res = await sendRequest({
                    url: `${process.env.REACT_APP_SERVER}/system-admin/system-api/system-apis/update-log`,
                    method: 'GET',
                }, false, true, 'system_admin.system_api');

                // res.data.content.add.apis.map((api) => {
                //     const index = listPaginateApi.findIndex(systemAapi => systemAapi.path === api.path && systemAapi.method === api.method);
                //     if (index >= 0) listPaginateApi.splice(index, 1);
                // })

                setUpdateApiLog(res.data.content);
            } catch (error) { }
        }

        getSystemApiUpdateLog();
    }, [])

    const deleteSystemApiUpdateLog = async () => {
        try {
            const res = await sendRequest({
                url: `${process.env.REACT_APP_SERVER}/system-admin/system-api/system-apis/update-log`,
                method: 'DELETE',
            }, true, true, 'system_admin.system_api');

            setUpdateApiLog(null);
        } catch (error) { }
    }

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
        console.log(value)
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

        // updateLog.add.apis.map((api) => {
        //     const index = listPaginateApi.findIndex(systemAapi => systemAapi.path === api.path && systemAapi.method === api.method);
        //     if (index >= 0) listPaginateApi.splice(index, 1);
        // })

        setUpdateApiLog(updateLog);
    }

    let listPaginateApi = systemApis?.listPaginateApi

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

    const renderApiUpdateTable = () => (
        <table
            id={updateApiLogTableId}
            className="table table-hover table-striped table-bordered update-log-table"
        >
            <thead>
                <tr>
                    <th style={{ width: '40px' }}>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.no_')}</th>
                    <th>{translate('system_admin.system_api.table.path')}</th>
                    <th>{translate('system_admin.system_api.table.method')}</th>
                    <th>{translate('system_admin.system_api.table.description')}</th>
                    <th style={{ width: "120px" }}>
                        {translate('table.action')}
                    </th>
                </tr>
            </thead>
            <tbody>
                {updateApiLog.add.apis.length > 0 &&
                    (
                        <>
                            <tr
                                key="new-apis"
                            >
                                <td
                                    colSpan={10}
                                    style={{
                                        fontWeight: 'bold',
                                        textTransform: 'uppercase',
                                        textAlign: 'left'
                                    }}
                                >New apis</td>
                            </tr>
                            {updateApiLog.add.apis.map((api, index) =>
                                <tr
                                    key={api?._id}
                                    className="api-update-add"
                                >
                                    <td>{index + 1}</td>
                                    <td>{api?.path}</td>
                                    <td>{api?.method}</td>
                                    <td>{api?.description}</td>
                                    <td style={{ textAlign: 'center' }}>

                                    </td>
                                </tr>
                            )
                            }
                        </>)}

                {updateApiLog.remove.apis.length > 0 && (
                    <>
                        <tr
                            key="removed-apis"
                        >
                            <td
                                colSpan={10}
                                style={{
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                    textAlign: 'left'
                                }}
                            >Removed apis</td>
                        </tr>
                        {updateApiLog.remove.apis.map((api, index) =>
                            <tr
                                key={api?._id}
                                className="api-update-remove"
                            >
                                <td>{index + 1}</td>
                                <td>{api?.path}</td>
                                <td>{api?.method}</td>
                                <td>{api?.description}</td>
                                <td style={{ textAlign: 'center' }}>

                                </td>
                            </tr>

                        )
                        }
                    </>)}
            </tbody>
        </table>
    )

    return (
        <React.Fragment>
            <SystemApiCreateModal />
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

                    {updateApiLog &&
                        (updateApiLog.add.apis.length > 0 || updateApiLog.remove.apis.length > 0) &&
                        <>
                            <div
                                style={{
                                    marginBottom: 10,
                                    marginTop: 50,
                                    fontSize: '150%',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase'
                                }}>
                                Api update log
                                <button
                                    type="button"
                                    onClick={deleteSystemApiUpdateLog}
                                    className="btn delete-update-log-btn"
                                >
                                    {translate('system_admin.system_api.deleteUpdateLog')}
                                </button>
                            </div>
                            {renderApiUpdateTable()}
                        </>}

                    <div
                        style={{
                            marginBottom: 10,
                            fontSize: '150%',
                            fontWeight: 'bold',
                            textTransform: 'uppercase'
                        }}
                    >System api</div>
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