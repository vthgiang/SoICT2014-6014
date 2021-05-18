import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DataTableSetting, DeleteNotification, PaginateBar, SearchBar } from '../../../../common-components';
import { SystemLinkActions } from '../redux/actions';
import { CreateLinkForm } from './linkCreateForm';
import { LinkInfoForm } from './linkInfoForm';
function ManageLinkSystem(props) {

    const [state, setState] = useState({
        limit: 10,
        page: 1,
        option: 'url', //mặc định tìm kiếm theo tên
        value: ''
    })

    useEffect(() => {
        props.getAllSystemLinks();
        props.getAllSystemLinks({ page: state.page, limit: state.limit });
        props.getAllSystemLinkCategories();
    }, [])

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
        props.getAllSystemLinks(data);

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
        props.getAllSystemLinks(data)
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
        props.getAllSystemLinks(data);
    }

    // Cac ham xu ly du lieu voi modal
    const handleEdit = async (link) => {
        await setState({
            ...state,
            currentRow: link
        });
        window.$('#modal-edit-link-default').modal('show');
    }

    const { translate, systemLinks } = props;
    const { currentRow } = state;

    return (
        <div className="box" style={{ minHeight: '450px' }}>
            <div className="box-body">
                <React.Fragment>
                    <CreateLinkForm />
                    {
                        currentRow &&
                        <LinkInfoForm
                            linkId={currentRow._id}
                            linkUrl={currentRow.url}
                            linkCategory={currentRow.category}
                            linkDescription={currentRow.description}
                            linkRoles={currentRow.roles.map(role => role._id)}
                        />
                    }
                    <SearchBar
                        columns={[
                            { title: translate('system_admin.system_link.table.url'), value: 'url' },
                            { title: translate('system_admin.system_link.table.category'), value: 'category' },
                            { title: translate('system_admin.system_link.table.description'), value: 'description' },
                        ]}
                        option={state.option}
                        setOption={setOption}
                        search={searchWithOption}
                    />

                    <table className="table table-hover table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>{translate('system_admin.system_link.table.url')}</th>
                                <th>{translate('system_admin.system_link.table.category')}</th>
                                <th>{translate('system_admin.system_link.table.description')}</th>
                                <th>{translate('system_admin.system_link.table.roles')}</th>
                                <th>Components</th>
                                <th style={{ width: "120px" }}>
                                    {translate('table.action')}
                                    <DataTableSetting
                                        columnName={translate('table.action')}
                                        columnArr={[
                                            translate('system_admin.system_link.table.url'),
                                            translate('system_admin.system_link.table.category'),
                                            translate('system_admin.system_link.table.description'),
                                            translate('system_admin.system_link.table.roles')
                                        ]}
                                        setLimit={setLimit}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                systemLinks.listPaginate.length > 0 && systemLinks.listPaginate.map(link =>
                                    <tr key={link._id}>
                                        <td>{link.url}</td>
                                        <td>{link.category}</td>
                                        <td>{link.description}</td>
                                        <td>{link.roles.map((role, index, arr) => {
                                            if (index !== arr.length - 1)
                                                return <span key={role._id}>{role.name}, </span>
                                            else
                                                return <span key={role._id}>{role.name}</span>
                                        })}</td>
                                        <td>{link.components.map(component => component.name)}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <a onClick={() => handleEdit(link)} className="edit" title={translate('system_admin.system_link.edit')}><i className="material-icons">edit</i></a>
                                            <DeleteNotification
                                                content={translate('system_admin.system_link.delete')}
                                                data={{
                                                    id: link._id,
                                                    info: link.url
                                                }}
                                                func={props.deleteSystemLink}
                                            />
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                    {
                        systemLinks.isLoading ?
                            <div className="table-info-panel">{translate('confirm.loading')}</div> :
                            systemLinks.listPaginate && systemLinks.listPaginate.length === 0 && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                    {/* PaginateBar */}
                    <PaginateBar display={systemLinks.listPaginate.length} total={systemLinks.totalDocs} pageTotal={systemLinks.totalPages} currentPage={systemLinks.page} func={setPage} />
                </React.Fragment>
            </div>
        </div>
    );
}

function mapState(state) {
    const { systemLinks } = state;
    return { systemLinks }
}
const actions = {
    getAllSystemLinks: SystemLinkActions.getAllSystemLinks,
    getAllSystemLinkCategories: SystemLinkActions.getAllSystemLinkCategories,
    deleteSystemLink: SystemLinkActions.deleteSystemLink
}

export default connect(mapState, actions)(withTranslate(ManageLinkSystem));

