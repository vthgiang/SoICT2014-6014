import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import '../styles/systemApiUpdateModal.css';

import { DialogModal, PaginateBar } from '../../../../../common-components';

import { SystemApiActions } from '../redux/actions'

function SystemApiUpdateModal(props) {
    const { translate, updateApiLog, systemApiManageGetSystemApis } = props;

    const tableId = "table-system-api-update";

    const apiUpdateCategory = {
        ADD: 'add',
        REMOVE: 'remove',
    }

    const [addApiChecked, setAddApiChecked] = useState(updateApiLog.add.apis.map(() => false));
    const [removeApiChecked, setRemoveApiChecked] = useState(updateApiLog.remove.apis.map(() => false));

    useEffect(() => {
        setAddApiChecked(updateApiLog.add.apis.map(() => false));
        setRemoveApiChecked(updateApiLog.remove.apis.map(() => false));
    }, [updateApiLog]);

    const checkedAll = () => {
        let compare = false;
        if (addApiChecked.length > 0) {
            compare = addApiChecked[0]
        } else if (removeApiChecked.length > 0) {
            compare = removeApiChecked[0]
        }

        return addApiChecked.filter(el => el === compare).length === addApiChecked.length ?
            removeApiChecked.filter(el => el === compare).length === removeApiChecked.length ?
                compare
                : false
            : false;
    }

    const checkAll = (e) => {
        const { checked } = e.target;
        setAddApiChecked(prev => prev.map(() => checked));
        setRemoveApiChecked(prev => prev.map(() => checked));
    }

    const handleCheckboxAddApi = (e) => {
        const { value, checked } = e.target;
        setAddApiChecked(prev => prev.map((apiCheck, index) => index === Number(value) ? checked : apiCheck));
    }

    const handleCheckboxRemoveApi = (e) => {
        const { value, checked } = e.target;
        setRemoveApiChecked(prev => prev.map((apiCheck, index) => index === Number(value) ? checked : apiCheck));
    }

    const checkedCategory = (category) => {
        if (category === apiUpdateCategory.ADD) {
            return addApiChecked.filter(el => el === addApiChecked[0]).length === addApiChecked.length ?
                addApiChecked[0]
                : false;
        } else if (category === apiUpdateCategory.REMOVE) {
            return removeApiChecked.filter(el => el === removeApiChecked[0]).length === removeApiChecked.length ?
                removeApiChecked[0]
                : false;
        }
    }

    const handleCheckboxAllCategory = (e, category) => {
        const { checked } = e.target;
        if (category === apiUpdateCategory.ADD) {
            setAddApiChecked(prev => prev.map(() => checked));
        } else if (category === apiUpdateCategory.REMOVE) {
            setRemoveApiChecked(prev => prev.map(() => checked));
        }
    }

    const handleSubmit = () => {
        if (updateApiLog.add.apis.length > 0) {
            updateApiLog.add.apis.map((api, index) => {
                if (addApiChecked[index])
                    props.createSystemApi(api);
            });
        }

        if (updateApiLog.remove.apis.length > 0) {
            updateApiLog.remove.apis.map((api, index) => {
                if (removeApiChecked[index])
                    props.deleteSystemApi(api._id);
            });
        }

        systemApiManageGetSystemApis();
        window.$("#update-system-api-modal").modal("hide");
    }

    const renderSystemApiUpdateTable = () => (
        <table id={tableId} className="table table-hover table-striped table-bordered">
            <thead>
                <tr>
                    <th style={{ width: '32px' }} className="col-fixed">
                        <input
                            type="checkbox"
                            checked={checkedAll()}
                            onChange={checkAll}
                        />
                    </th>
                    <th>{translate('system_admin.system_api.table.path')}</th>
                    <th>{translate('system_admin.system_api.table.method')}</th>
                    <th>{translate('system_admin.system_api.table.description')}</th>
                </tr>
            </thead>
            <tbody>
                {updateApiLog.add.apis.length > 0
                    && (
                        <>
                            <tr>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={checkedCategory(apiUpdateCategory.ADD)}
                                        onChange={(e) => handleCheckboxAllCategory(e, apiUpdateCategory.ADD)}
                                    />
                                </td>
                                <td
                                    colSpan="5"
                                    style={{
                                        textAlign: 'left',
                                        fontWeight: 'bold'
                                    }}>New added apis</td>
                            </tr>
                            {updateApiLog.add.apis.map((api, index) =>
                                <tr
                                    key={index}
                                    className='api-update-add'
                                >
                                    <td>
                                        <input
                                            type="checkbox"
                                            value={index}
                                            checked={addApiChecked[index] ? addApiChecked[index] : false}
                                            onChange={handleCheckboxAddApi}
                                        />
                                    </td>
                                    <td>{api?.path}</td>
                                    <td>{api?.method}</td>
                                    <td>{api?.description}</td>
                                </tr>
                            )}
                        </>)
                }

                {updateApiLog.remove.apis.length > 0
                    && (
                        <>
                            <tr>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={checkedCategory(apiUpdateCategory.REMOVE)}
                                        onChange={(e) => handleCheckboxAllCategory(e, apiUpdateCategory.REMOVE)}
                                    />
                                </td>
                                <td
                                    colSpan="5"
                                    style={{
                                        textAlign: 'left',
                                        fontWeight: 'bold'
                                    }}>Removed apis</td>
                            </tr>
                            {updateApiLog.remove.apis.map((api, index) =>
                                <tr
                                    key={index}
                                    className='api-update-remove'
                                >
                                    <td>
                                        <input
                                            type="checkbox"
                                            value={index}
                                            checked={removeApiChecked[index] ? removeApiChecked[index] : false}
                                            onChange={handleCheckboxRemoveApi}
                                        />
                                    </td>
                                    <td>{api?.path}</td>
                                    <td>{api?.method}</td>
                                    <td>{api?.description}</td>
                                </tr>)}
                        </>)
                }
            </tbody>
        </table>
    )

    return (
        <React.Fragment>
            <DialogModal
                modalID="update-system-api-modal" isLoading={false}
                size="75"
                formID="form-update-system-api"
                title={translate('system_admin.system_api.modal.update_title')}
                msg_success={translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.success')}
                msg_failure={translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.failure')}
                func={handleSubmit}
            >
                {/* Form them phan quyen API */}
                <form id="form-privilege-system-api" onSubmit={() => handleSubmit(translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.success'))}>
                    {/* API */}
                    <fieldset className="scheduler-border" style={{ minHeight: '300px' }}>
                        {updateApiLog && renderSystemApiUpdateTable()}
                    </fieldset>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapState(state) {
    const { } = state;
    return {};
}

const actionCreators = {
    createSystemApi: SystemApiActions.createSystemApi,
    deleteSystemApi: SystemApiActions.deleteSystemApi,
};

const connectedSystemApiUpdateModal = connect(mapState, actionCreators)(withTranslate(SystemApiUpdateModal));
export { connectedSystemApiUpdateModal as SystemApiUpdateModal };
