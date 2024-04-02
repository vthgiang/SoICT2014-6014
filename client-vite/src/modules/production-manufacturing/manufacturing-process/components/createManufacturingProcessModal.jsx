import React, { useState, useEffect } from "react";
import { withTranslate } from "react-redux-multilingual";
import { connect } from 'react-redux';

import { DialogModal } from "../../../../common-components";
import { InfoProcessTab } from "./infoProcessTab";
import { ListEmployeeUnitTab } from "./listEmployeeUnitTab";
import { AssetProcessUnitTab } from "./assetProcessUnitTab";
import { ManufacturingProcessActions } from '../redux/actions';
import { EditProcessUnitTab } from "./editProcessUnitTab";

const CreateManufacturingProcessModal = (props) => {

    const [state, setState] = useState({
        infoProcess: undefined,
        listTaskEmployee: [],
        processAsset: [],
        xmlDiagram: undefined,
    })

    const { translate, user, department } = props

    const handleChangeInfoProcess = (item) => {
        console.log("itemmmmm: ", item)
        setState({
            ...state,
            infoProcess: item,
            xmlDiagram: item.xmlDiagram ? item.xmlDiagram : undefined,
        })
    }

    const handleChangeListEmployee = (item) => {
        console.log("list employeee: ", item);
        setState({
            ...state,
            listTaskEmployee: item
        })
    }

    const isFormValidate = () => {

    }

    const save = () => {
        props.createManufacturingProcess({
            infoProcess: state.infoProcess,
            listTaskEmployee: state.listTaskEmployee
        });
        props.getAllManufacturingProcess()
    }

    let xmlDiagramTemplate = state.xmlDiagram
    let listOrganizationalUnit = department?.list

    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-manufacturing-process"
                isLoading={false}
                formID={`form-create-manufacture-process`}
                title="Thông tin quy trình sản xuất"
                disableSubmit={isFormValidate()}
                func={save}
                size={props.size}
                width={props.width}
            >
                <div className="nav-tabs-custom" style={{ marginTop: '-15px' }}>
                    <ul className="nav nav-tabs">
                        <li className="active">
                            <a title={translate('manufacturing_managerment.manufacturing_process.tab_information')} data-toggle="tab" href="#general-information">{translate('manufacturing_managerment.manufacturing_process.tab_information')}</a>
                        </li>
                        <li>
                            <a title="Quy trình công việc" data-toggle="tab" href="#process-template">Quy trình công việc</a>
                        </li>
                        <li>
                            <a title={translate('manufacturing_managerment.manufacturing_process.tab_employee')} data-toggle="tab" href="#employee-list">{translate('manufacturing_managerment.manufacturing_process.tab_employee')}</a>
                        </li>
                        <li>
                            <a title={translate('manufacturing_managerment.manufacturing_process.tab_asset')} data-toggle="tab" href="#asset-list">{translate('manufacturing_managerment.manufacturing_process.tab_asset')}</a>
                        </li>
                    </ul>
                    <div className="tab-content">
                        <InfoProcessTab id="general-information"
                            updateInfoProcessData={(item) => handleChangeInfoProcess(item)} />
                        <ListEmployeeUnitTab id="employee-list"
                            updateListEmployee={(item) => handleChangeListEmployee(item)} />
                        <EditProcessUnitTab
                            id="process-template"
                            xmlDiagramTemplate={xmlDiagramTemplate}/>
                        <AssetProcessUnitTab id="asset-list" />
                    </div>
                </div>
            </DialogModal>
        </React.Fragment>
    )
}

const mapStateToProps = state => {
    const { user, department, manufacturingLineTemplate, taskProcess } = state;
    return { user, department, manufacturingLineTemplate, taskProcess }
}

const mapDispatchToProps = {
    createManufacturingProcess: ManufacturingProcessActions.createManufacturingProcess,
    getAllManufacturingProcess: ManufacturingProcessActions.getAllManufacturingProcess
}

const connectManufacturingProcessModal = connect(mapStateToProps, mapDispatchToProps)(withTranslate(CreateManufacturingProcessModal))
export { connectManufacturingProcessModal as CreateManufacturingProcessModal }