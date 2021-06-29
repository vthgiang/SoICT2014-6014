import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { CrmGroupActions } from '../redux/actions';
import { SearchBar, PaginateBar, DataTableSetting, ConfirmNotification } from '../../../../common-components';
import CreateGroupForm from './createForm';
import EditGroupForm from './editForm';
import { getTableConfiguration } from '../../../../helpers/tableConfiguration'
import CreateCareCommonForm from '../../common/createCareCommonForm';
import GroupInfoForm from './groupInfoForm';
import { getStorage } from '../../../../config';

function CrmGroup(props) {

    const tableIdDefault = "table-manage-crm-group";
    const defaultConfig = { limit: 5 }
    const limitInit = getTableConfiguration(tableIdDefault, defaultConfig).limit;
    const [groupEditId, setGroupEditId] = useState();
    const [groupCreateCareACtionId, setGroupCreateCareACtionId] = useState();
    const [groupInfoId, setGroupInfoId] = useState();
    const [searchState, setSearchState] = useState({
        limit: limitInit,
        page: 0,
        option: 'name',
        value: '',
        tableId: tableIdDefault,
        roleId:getStorage('currentRole'),
    });
    useEffect(() => props.getGroups(searchState), []
    )

    const { crm, translate } = props;
    const { list } = crm.groups;
    const { option, limit, page, groupIdEdit, tableId, groupIdCreateCareACtion } = searchState;

    let pageTotal = (crm.groups.totalDocs % limit === 0) ?
        parseInt(crm.groups.totalDocs / limit) :
        parseInt((crm.groups.totalDocs / limit) + 1);
    let cr_page = parseInt((page / limit) + 1);

    // Cac ham thiet lap va tim kiem gia tri



    const setPage = async (pageNumber) => {
        let { limit } = searchState;
        let page = (pageNumber - 1) * (limit);
        let newState = { ...searchState, page: parseInt(page), }

        await setSearchState(newState);
        props.getGroups(searchState);
    }

    const setLimit = async (number) => {
        let newState = { ...searchState, limit: number, }

        await setSearchState(newState)
        props.getGroups(searchState);
    }

    const deleteGroup = async (id) => {
        if (id) {
            await props.deleteGroup(id);
        }
    }

    const handleEditGroup = async (id) => {
        await setGroupEditId(id);
        window.$('#modal-edit-group').modal('show');
    }
    const handleCreateCareAction = async (id) => {
        await setGroupCreateCareACtionId(id);
        window.$('#modal-crm-care-common-create').modal('show');
    }
    const handleInfoGroup = async (id) => {
        await setGroupInfoId(id);
        window.$(`#modal-info-group`).modal('show');
    }

    //xu ly tim kiem
    /**
     * ham xu ly tim kiem theo ma nhom
     */
    const handleSearchByCode = async (e) => {
        const value = e.target.value;
        let newState = { ...searchState, code: value }
        await setSearchState(newState);
    }
    const search = () => {
        props.getGroups(searchState);
    }
    return (
        <div className="box">
            <div className="box-body qlcv">
                <CreateGroupForm />
                {groupInfoId && <GroupInfoForm groupInfoId={groupInfoId} />}
                {groupCreateCareACtionId && <CreateCareCommonForm type={2} />}
                {groupEditId && <EditGroupForm groupIdEdit={groupEditId} />}
                {/*  tim kiem theo ma nhom */}
                <div className="form-inline" style={{marginLeft:'10px'}}>
                    <div className="form-group">
                        <label className="form-control-static">Mã nhóm khách hàng</label>
                        <input className="form-control" type="text"
                            name="customerCode" onChange={handleSearchByCode}
                            placeholder={`Mã nhóm khách hàng`}
                        />
                    </div>
                    <div className="form-group" >
                        <label></label>
                        <button type="button" className="btn btn-success" onClick={search} title={translate('form.search')}>{translate('form.search')}</button>
                    </div>
                </div>

                <table className="table table-hover table-striped table-bordered" id={tableId} style={{ marginTop: '10px' }}>
                    <thead>
                        <tr>
                            <th>{translate('crm.group.code')}</th>
                            <th>{translate('crm.group.name')}</th>
                            <th>{translate('crm.group.description')}</th>
                            <th style={{ width: "120px" }}>
                                {translate('table.action')}
                                <DataTableSetting
                                    columnArr={[
                                        translate('crm.group.code'),
                                        translate('crm.group.name'),
                                        translate('crm.group.description'),
                                        'Số lượng khách hàng'
                                    ]}
                                    setLimit={setLimit}
                                    tableId={tableId}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            list && list.length > 0 ?
                                list.map(gr =>
                                    <tr key={gr._id}>
                                        <td>{gr.code}</td>
                                        <td>{gr.name}</td>
                                        <td>{gr.description}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <a className="text-green" onClick={() => handleInfoGroup(gr._id)}><i className="material-icons">visibility</i></a>
                                            <a className="text-yellow" onClick={() => handleEditGroup(gr._id)}><i className="material-icons">edit</i></a>
                                            <ConfirmNotification
                                                icon="question"
                                                title="Xóa thông tin về khách hàng"
                                                content="<h3>Xóa thông tin khách hàng</h3>"
                                                name="delete"
                                                className="text-red"
                                                func={() => deleteGroup(gr._id)}
                                            />
                                        </td>
                                    </tr>
                                ) : crm.groups.isLoading ?
                                    <tr><td colSpan={4}>{translate('general.loading')}</td></tr> :
                                    <tr><td colSpan={4}>{translate('general.no_data')}</td></tr>
                        }
                    </tbody>
                </table>

                {/* PaginateBar */}
                <PaginateBar pageTotal={pageTotal} currentPage={cr_page} func={setPage} />
            </div>
        </div>
    );
}






function mapStateToProps(state) {
    const { crm } = state;
    return { crm };
}

const mapDispatchToProps = {
    getGroups: CrmGroupActions.getGroups,
    deleteGroup: CrmGroupActions.deleteGroup
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CrmGroup));