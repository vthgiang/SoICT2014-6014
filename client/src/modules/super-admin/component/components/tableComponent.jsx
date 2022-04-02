import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { PaginateBar, DataTableSetting, SearchBar, ToolTip } from '../../../../common-components';

import { ComponentActions } from '../redux/actions';
import { LinkActions } from '../../link/redux/actions';
import { RoleActions } from '../../role/redux/actions';
import { AttributeActions } from '../../attribute/redux/actions';

import ComponentInfoForm from './componentInfoForm';
import ComponentAttributeCreateForm from './componentAttributeCreateForm'

import { getTableConfiguration } from '../../../../helpers/tableConfiguration';

function TableComponent(props) {
    const tableId_constructor = "table-manage-component";
    const defaultConfig = { limit: 10 }
    const limit = getTableConfiguration(tableId_constructor, defaultConfig).limit;

    const [state, setState] = useState({
        tableId: tableId_constructor,
        limit: limit,
        page: 1,
        option: 'name', // Mặc định tìm kiếm theo tên
        value: '',
        i: 0
    })

    useEffect(() => {
        let { page, limit } = state;
        props.getLinks({ type: "active" });
        props.get({ type: "active" });
        props.get({ type: "active", page, limit });
        props.getRoles();
        props.getAttribute();
    }, [])

    const setOption = (title, option) => {
        setState({
            ...state,
            [title]: option
        });
    }

    const searchWithOption = () => {
        let { option, limit, value } = state;
        const params = {
            type: "active",
            limit,
            page: 1,
            key: option,
            value
        };
        props.get(params);
    }

    const setPage = (page) => {
        setState({
            ...state,
            page
        });
        let { option, limit, value } = state;
        const params = {
            type: "active",
            limit,
            page,
            key: option,
            value
        };
        props.get(params);
    }

    const setLimit = (number) => {
        setState({
            ...state,
            limit: number
        });
        let { option, value, page } = state;
        const params = {
            type: "active",
            limit: number,
            page,
            key: option,
            value
        };
        props.get(params);
    }

    const handleChange = (name, value) => {
        setState({
            ...state,
            [name]: value
        });
    }

    const handleChangeAddRowAttribute = (name, value) => {
        setState({
            ...state,
            [name]: value
        });
    }

    // Cac ham xu ly du lieu voi modal
    const handleEdit = async (component) => {
        await setState({
            ...state,
            currentRow: component
        });
        window.$('#modal-edit-component').modal('show');
    }

    const { component, translate } = props;
    const { currentRow, tableId } = state;

    return (
        <React.Fragment>
            {/* Form chỉnh sửa thông tin về component */}
            {
                currentRow &&
                <ComponentInfoForm
                    componentId={currentRow._id}
                    componentName={currentRow.name}
                    componentLink={currentRow.links.map(link => link._id)}
                    componentDescription={currentRow.description}
                    componentRoles={currentRow.roles.map(role => role && role.roleId ? role.roleId._id : null)}
                    componentAttributes={currentRow.attributes}
                    handleChange={handleChange}
                    handleChangeAddRowAttribute={handleChangeAddRowAttribute}
                    i={state.i}
                />
            }

            {/* Form thêm thuộc tính cho trang */}
            <ComponentAttributeCreateForm handleChange={handleChange} handleChangeAddRowAttribute={handleChangeAddRowAttribute} i={state.i} />

            {/* Thanh tìm kiếm */}
            <SearchBar
                columns={[
                    { title: translate('manage_component.name'), value: 'name' },
                    { title: translate('manage_component.description'), value: 'description' },
                ]}
                option={state.option}
                setOption={setOption}
                search={searchWithOption}
            />

            {/* Bảng dữ liệu các components */}
            <table className="table table-hover table-striped table-bordered" id={tableId}>
                <thead>
                    <tr>
                        <th>{translate('manage_component.name')}</th>
                        <th>{translate('manage_component.link')}</th>
                        <th>{translate('manage_component.description')}</th>
                        <th>{translate('manage_component.roles')}</th>
                        <th style={{ width: "120px" }}>
                            {translate('table.action')}
                            <DataTableSetting
                                columnArr={[
                                    translate('manage_component.name'),
                                    translate('manage_component.link'),
                                    translate('manage_component.description'),
                                    translate('manage_component.roles')
                                ]}
                                setLimit={setLimit}
                                tableId={tableId}
                            />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        component.listPaginate && component.listPaginate.length > 0 &&
                        component.listPaginate.map(component =>
                            <tr key={component._id}>
                                <td>{component.name}</td>
                                <td>{component.links.map(link => `${link.url} `)}</td>
                                <td>{component.description}</td>
                                <td><ToolTip dataTooltip={component.roles.map(role => role && role.roleId ? role.roleId.name : "")} /></td>
                                <td style={{ textAlign: 'center' }}>
                                    <a className="edit" onClick={() => handleEdit(component)}><i className="material-icons">edit</i></a>
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
            {
                component.isLoading ?
                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                    component.listPaginate && component.listPaginate.length === 0 && <div className="table-info-panel">{translate('confirm.no_data')}</div>
            }
            {/* PaginateBar */}
            <PaginateBar display={component.listPaginate.length} total={component.totalDocs} pageTotal={component.totalPages} currentPage={component.page} func={setPage} />

        </React.Fragment>
    );
}

function mapState(state) {
    const { component } = state;
    return { component };
}

const getState = {
    get: ComponentActions.get,
    destroy: ComponentActions.destroy,
    getLinks: LinkActions.get,
    getRoles: RoleActions.get,
    getAttribute: AttributeActions.getAttributes
}

export default connect(mapState, getState)(withTranslate(TableComponent));
