import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DataTableSetting, PaginateBar, DeleteNotification } from '../../../../common-components';
import { FieldCreateForm, FieldEditForm } from './combinedContent';

import { FieldsActions } from '../redux/actions';
import { getTableConfiguration } from '../../../../helpers/tableConfiguration';
const FieldManagement = (props) => {

    const _tableId = "table-field-management";
    const defaultConfig = { limit: 5 }
    const _limit = getTableConfiguration(_tableId, defaultConfig).limit;
    let currentPage = 1, pageTotal = 1;

    const [state, setState] = useState({
        tableId: _tableId,
        page: 0,
        limit: _limit,
        name: "",
    })

    const { translate, field } = props;

    const { limit, page, currentRow, tableId } = state;

    let listFields = field.listFields;

    console.log(listFields);

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
        props.getListFields({ page: 0, limit: 1000 });
    }, []);

    useEffect(() => {
        props.getListFields(state);
    }, [limit, page]);

    /** Bắt sự kiện thay đổi tên ngành nghề, lĩnh vực tím kiếm */
    const handleChange = (e) => {
        const { value, name } = e.target;
        setState(state => ({
            ...state,
            [name]: value
        }));
    }

    /** Bắt sự kiện tiềm kiếm  */
    const handleSunmitSearch = async () => {
        props.getListFields(state)
    }

    /**
    * Bắt sự kiện setting số dòng hiện thị trên một trang
    * @param {*} number : Số dòng hiện thị
    */
    const setLimit = async (number) => {

        setState(state => ({
            ...state,
            limit: parseInt(number),
        }));
        props.getListFields({
            ...state,
            limit: parseInt(number),
        })
    }

    /**
     * Bắt sự kiện chuyển trang
     * @param {*} pageNumber : Số trang hiện tại cần hiện thị
     */
    const setPage = async (pageNumber) => {
        await setState(state => ({
            ...state,
            page: (pageNumber - 1) * limit
        }))
        props.getListFields({
            ...state,
            page: (pageNumber - 1) * limit
        })
    }

    pageTotal = ((field.totalList % limit) === 0) ?
        parseInt(field.totalList / limit) :
        parseInt((field.totalList / limit) + 1);
    currentPage = parseInt((page / limit) + 1);
    console.log(currentPage);
    console.log(page);

    return (
        <div className="box" >
            <div className="box-body qlcv">
                <FieldCreateForm />
                <div className="form-inline" style={{ marginBottom: 10 }}>
                    {/* Tên ngành nghề/lĩnh vực */}
                    <div className="form-group">
                        <label style={{ width: 'auto' }}>{translate('human_resource.field.table.name')}</label>
                        <input type="text" className="form-control" name="name" onChange={handleChange} placeholder={translate('human_resource.field.table.name')} autoComplete="off" />
                        <button type="submit" className="btn btn-success" title={translate('general.search')} onClick={() => handleSunmitSearch()} >{translate('general.search')}</button>
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
                                            func={props.deleteFields}
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
                <PaginateBar
                    pageTotal={pageTotal ? pageTotal : 0}
                    currentPage={currentPage}
                    display={listField && listFields.length !== 0 && listFields.length}
                    total={field && field.totalList}
                    func={setPage} />
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
