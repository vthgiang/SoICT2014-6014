import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DataTableSetting, PaginateBar, DeleteNotification } from '../../../../common-components';
import { FieldCreateForm, FieldEditForm } from './combinedContent';

import { FieldsActions } from '../redux/actions';
import { getTableConfiguration } from '../../../../helpers/tableConfiguration';
const FieldManagement = (props) => {
    
    const tableId = "table-field-management";
    const defaultConfig = { limit: 5 }
    const _limit = getTableConfiguration(tableId, defaultConfig).limit;

    const [state, setState] = useState({
        tableId,
        page: 0,
        limit: _limit,
        name: "",
    })

    /**
     * Function bắt sự kiện chỉnh sửa thông tin ngành nghề, lĩnh vực
     * @param {*} value : thông tin ngành nghề, lĩnh vực cần chỉnh sửa
     */
    const handleEdit = async (value) => {
        await setState(state => ({
            ...state,
            currentRow: value
        }))
        window.$(`#modal-edit-field${value._id}`).modal('show');
    }

    useEffect(() => {
        const { getListFields } = props;
        getListFields(state);
    }, []);

    /** Bắt sự kiện thay đổi tên ngành nghề, lĩnh vực tím kiếm */
    const handleChange = (e) => {
        const { value, name } = e.target;
        setState(state => ({
            ...state,
            [name]: value
        }));
    }

    /** Bắt sự kiện tiềm kiếm  */
    const handleSunmitSearch = () => {
        const { getListFields } = props;
        getListFields(state)
    }

    /**
    * Bắt sự kiện setting số dòng hiện thị trên một trang
    * @param {*} number : Số dòng hiện thị
    */
    const setLimit = async (number) => {
        await setState(state => ({
            ...state,
            limit: parseInt(number),
        }));
        
    }

    /**
     * Bắt sự kiện chuyển trang
     * @param {*} pageNumber : Số trạng hiện tại cần hiện thị
     */
    const setPage = async (pageNumber) => {
        let { limit } = state;
        let page = (pageNumber - 1) * limit;
        await setState(state => ({
            ...state,
            page: parseInt(page)
        }))
    }

    useEffect(() => {
        const { getListFields } = props;
        getListFields(state);
    }, [state.limit, state.page]);

    const { translate, field, deleteFields } = props;

    const { limit, page, currentRow } = state;

    let listFields = field.listFields;

    let pageTotal = ((field.totalList % limit) === 0) ?
        parseInt(field.totalList / limit) :
        parseInt((field.totalList / limit) + 1);
    let currentPage = parseInt((page / limit) + 1);

    return (
        <div className="box" >
            <div className="box-body qlcv">
                <FieldCreateForm />
                <div className="form-inline" style={{ marginBottom: 10 }}>
                    {/* Mã số nhân viên */}
                    <div className="form-group">
                        <label style={{ width: 'auto' }}>{translate('human_resource.field.table.name')}</label>
                        <input type="text" className="form-control" name="name" onChange={handleChange} placeholder={translate('human_resource.field.table.name')} autoComplete="off" />
                        <button type="button" className="btn btn-success" title={translate('general.search')} onClick={() => handleSunmitSearch()} >{translate('general.search')}</button>
                    </div>
                </div>

                <table id={tableId} className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>{translate('human_resource.field.table.name')}</th>
                            <th>{translate('human_resource.field.table.description')}</th>
                            <th style={{ width: '120px', textAlign: 'center' }}>{translate('human_resource.annual_leave.table.action')}
                                <DataTableSetting
                                    tableId={tableId}
                                    columnArr={[
                                        translate('human_resource.field.table.name'),
                                        translate('human_resource.field.table.description'),
                                    ]}
                                    setLimit={setLimit}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {listFields && listFields.length !== 0 && listFields.map((x, index) => {
                            return (
                                <tr key={index}>
                                    <td>{x.name}</td>
                                    <td>{x.description}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <a onClick={() => handleEdit(x)} className="edit text-yellow" style={{ width: '5px' }}><i className="material-icons">edit</i></a>
                                        <DeleteNotification
                                            content={translate('human_resource.field.delete_fields')}
                                            data={{
                                                id: x._id,
                                                info: x.name
                                            }}
                                            func={deleteFields}
                                        />
                                    </td>
                                </tr>)
                        })}
                    </tbody>
                </table>
                {field.isLoading ?
                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                    (!listFields || listFields.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                }
                <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={currentPage} func={setPage} />
            </div>
            {currentRow &&
                <FieldEditForm
                    _id={currentRow._id}
                    name={currentRow.name}
                    description={currentRow.description}
                />
            }
        </div>

    )
}

function mapState(state) {
    const { field } = state;
    return { field };
};

const actionCreators = {
    getListFields: FieldsActions.getListFields,
    deleteFields: FieldsActions.deleteFields,
};

const listField = connect(mapState, actionCreators)(withTranslate(FieldManagement));
export { listField as FieldManagement };
