import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { DialogModal, TreeSelect } from '../../../../../common-components';
import { ShipperActions } from '../../redux/actions';

const ShipperEditForm = (props) => {
    const { translate, shipperEdit } = props;

    const [state, setState] = useState({
        shipperName: "",
        listLicense: [],
        shipperSalary: "",
    })

    useEffect(() => {
        setState({
            ...state,
            shipperName: shipperEdit ? shipperEdit.name : "",
            listLicense: shipperEdit ? shipperEdit.originalLicenses : [],
            shipperSalary: shipperEdit ? shipperEdit.salary : 0,
        })
    }, [shipperEdit])

    const { listLicense, shipperName, shipperSalary } = state;

    const isFormValidated = () => {
        if (listLicense && listLicense.length > 0) {
            return true;
        }
        return false;
    }

    const changeNameDriver = (e) => {
        setState({
            ...state,
            shipperName: e.target.value
        })
    }

    const handleChangeListLicense = (value) => {
        if (value.length === 0) {
            value = []
        }
        setState(state => {
            return {
                ...state,
                listLicense: value
            }
        })
    }

    const changeShipperSalary = (e) => {
        setState({
            ...state,
            shipperSalary: e.target.value
        })
    }

    const save = () => {
        if (isFormValidated) {
            let data = {
                drivingLicense: listLicense,
                name: shipperName,
                salary: shipperSalary
            }
            props.editDriverInfo(shipperEdit._id, data);
        }
    }

    const defaultDriverLicense = [
        {_id: 'A2', name: "Bằng xe máy A2"},
        {_id: 'B1', name: "Bằng ô tô hạng B1"},
        {_id: 'B2', name: "Bằng ô tô hạng B2"},
        {_id: 'C', name: "Bằng ô tô hạng C"},
        {_id: 'FB1', name: "Bằng ô tô hạng FB1"},
        {_id: 'FB2', name: "Bằng ô tô hạng FB2"},
        {_id: 'FC', name: "Bằng ô tô hạng FC"},
    ]

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-edit-shipper-info`}
                formID={`form-edit-shipper-info`}
                title={translate('manage_transportation.shipper.form_edit_title')}
                disableSubmit={!isFormValidated()}
                func={save}
                size={50}
                maxWidth={500}
            >
                <form id={`form-edit-shipper-info`}>
                    <div className='form-group'>
                        <label htmlFor="edit-shipper-name">{translate('manage_transportation.shipper.shipper_name')}</label>
                        <input type="text" value={shipperName ? shipperName : ""} disabled className='form-control' onChange={(e) => changeNameDriver(e)}/>
                    </div>
                    <div className={`form-group`}>
                        <label>{translate('manage_transportation.shipper.list_license')}</label>
                        <TreeSelect
                            data={defaultDriverLicense}
                            value={listLicense}
                            handleChange={handleChangeListLicense}
                            mode="hierarchical"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="shipper-salary">{translate('manage_transportation.shipper.salary')}</label>
                        <input type="number" value={shipperSalary ? shipperSalary : 0} className="form-control" onChange={(e) => changeShipperSalary(e)}/>
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const shipper = state.shipper;
    return {shipper}
}

const mapDispatchToProps = {
    editDriverInfo: ShipperActions.editDriverInfo,
}

export default React.memo(connect(mapStateToProps, mapDispatchToProps)(withTranslate(ShipperEditForm)));