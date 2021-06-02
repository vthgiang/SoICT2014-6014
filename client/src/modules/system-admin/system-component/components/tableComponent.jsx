import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { SystemComponentActions } from '../redux/actions';
import { SystemLinkActions } from '../../system-link/redux/actions';
import { ComponentInfoForm } from './componentInfoForm';
import { ComponentCreateForm } from './componentCreateForm';
import { PaginateBar, DataTableSetting, DeleteNotification, SearchBar, ToolTip } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
function TableComponent(props) {

    const [state, setState] = useState({
        limit: 5,
        page: 1,
        option: 'name', //mặc định tìm kiếm theo tên
        value: ''
    })

    useEffect(() => {
        props.getAllSystemComponents();
        props.getAllSystemComponents({ page: state.page, limit: state.limit });
        props.getAllSystemLinks();
    }, [])

    const handleEdit = async (currentRow) => {
        await setState({
            ...state,
            currentRow
        });
        window.$('#modal-edit-component-default').modal('show');
    }

    const setOption = (title, option) => {
        setState({
            ...state,
            [title]: option
        });
    }

    const searchWithOption = () => {
        let { option, limit, value } = state;
        const data = {
            limit,
            page: 1,
            key: option,
            value
        };
        props.getAllSystemComponents(data);
    }

    const setPage = (page) => {
        setState({
            ...state,
            page
        });
        let { option, limit, value } = state;
        const data = {
            limit,
            page,
            key: option,
            value
        };
        props.getAllSystemComponents(data);
    }

    const setLimit = (number) => {
        setState({
            ...state,
            limit: number
        });
        let { option, value, page } = state;
        const data = {
            limit: number,
            page,
            key: option,
            value
        };
        props.getAllSystemComponents(data);

    }

    const { systemComponents, translate } = props;
    const { currentRow } = state;

    return (
        <React.Fragment>
            <ComponentCreateForm />
            {
                currentRow !== undefined &&
                <ComponentInfoForm
                    componentId={currentRow._id}
                    componentName={currentRow.name}
                    componentDescription={currentRow.description}
                    componentLink={currentRow.links.map(link => link._id)}
                    componentRoles={currentRow.roles.map(role => role._id)}
                />
            }
            <SearchBar
                columns={[
                    { title: translate('system_admin.system_component.table.name'), value: 'name' },
                    { title: translate('system_admin.system_component.table.description'), value: 'description' },
                ]}
                option={state.option}
                setOption={setOption}
                search={searchWithOption}
            />

            <table className="table table-hover table-striped table-bordered">
                <thead>
                    <tr>
                        <th>{translate('system_admin.system_component.table.name')}</th>
                        <th>{translate('system_admin.system_component.table.description')}</th>
                        <th>{translate('system_admin.system_component.table.link')}</th>
                        <th>{translate('system_admin.system_component.table.roles')}</th>
                        <th style={{ width: "120px" }}>
                            {translate('table.action')}
                            <DataTableSetting
                                columnName={translate('table.action')}
                                hideColumn={false}
                                setLimit={setLimit}
                            />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        systemComponents.listPaginate.length > 0 &&
                        systemComponents.listPaginate.map(component =>
                            <tr key={component._id}>
                                <td>{component.name}</td>
                                <td>{component.description}</td>
                                <td><ToolTip dataTooltip={component.links.map(link => link.url)} /></td>
                                <td>{component.roles.map((role, i, arr) => {
                                    if (i !== arr.length - 1)
                                        return <span key={role._id}>{role.name}, </span>
                                    else
                                        return <span key={role._id}>{role.name}</span>
                                })}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <a onClick={() => handleEdit(component)} className="edit" title={translate('system_admin.system_component.edit')}><i className="material-icons">edit</i></a>
                                    <DeleteNotification
                                        content={translate('system_admin.system_component.delete')}
                                        data={{
                                            id: component._id,
                                            info: component.name
                                        }}
                                        func={props.deleteSystemComponent}
                                    />
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
            {
                systemComponents.isLoading ?
                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                    systemComponents.listPaginate && systemComponents.listPaginate.length === 0 && <div className="table-info-panel">{translate('confirm.no_data')}</div>
            }
            {/* PaginateBar */}
            <PaginateBar display={systemComponents.listPaginate.length} total={systemComponents.totalDocs} pageTotal={systemComponents.totalPages} currentPage={systemComponents.page} func={setPage} />
        </React.Fragment>
    );
}

function mapState(state) {
    const { systemComponents } = state;
    return { systemComponents }
}
const actions = {
    getAllSystemComponents: SystemComponentActions.getAllSystemComponents,
    deleteSystemComponent: SystemComponentActions.deleteSystemComponent,
    getAllSystemLinks: SystemLinkActions.getAllSystemLinks,
}

const connectedTableComponent = connect(mapState, actions)(withTranslate(TableComponent))
export { connectedTableComponent as TableComponent }
