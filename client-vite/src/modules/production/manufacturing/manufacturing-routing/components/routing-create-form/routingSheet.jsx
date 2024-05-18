import React, { useEffect } from "react"
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { ConfirmNotification } from "../../../../../../common-components";
import OperationCreateForm from "./operationCreateForm";
import { worksActions } from "../../../manufacturing-works/redux/actions";
import { AssetManagerActions } from "../../../../../asset/admin/asset-information/redux/actions";

const RoutingSheet = (props) => {
    const {
        translate,
        works,
        operations,
        organizationalUnit,
        validateField,
        errorMsg,
        updateOperations,
        manufacturingWorks,
    } = props

    const getMillNameById = (id) => {
        const selectedWorks = manufacturingWorks.listWorks.find(work => work._id === works)
        const mill = selectedWorks?.manufacturingMills.find(mill => mill._id === id)
        return mill ? mill.name : ""
    }

    useEffect(() => {
        const getData = async () => {
            await props.getAllManufacturingWorks();
        }
        getData();
    }, [])

    return (
        <>
            <OperationCreateForm works={works} organizationalUnit={organizationalUnit} updateOperations={updateOperations} validateField={validateField} errorMsg={errorMsg} />
            <table id='routing-sheet' className='table table-striped table-bordered table-hover'>
                <thead>
                    <tr>
                        <th>{translate('manufacturing.routing.index')}</th>
                        <th>{translate('manufacturing.routing.operation_name')}</th>
                        <th>{translate('manufacturing.routing.implementation_mill')}</th>
                        <th>{translate('manufacturing.routing.setup_time')}</th>
                        <th>{translate('manufacturing.routing.resource')}</th>

                        <th>{translate('manufacturing.routing.hour_production')}</th>
                        <th style={{ width: '120px', textAlign: 'center' }}>{translate('general.action')}</th>
                    </tr>
                </thead>
                <tbody>
                    {operations.map((operation, index) => (
                        <tr key={index}>
                            <td key={index}>inde</td>
                            <td>{operation.name}</td>
                            <td>{getMillNameById(operation.mill)}</td>
                            <td className="text-center">{operation.setupTime}</td>
                            <td>
                                <ul>
                                    {operation.machines?.map((machine, index) => (
                                        <li key={index}>{machine.name}, SL: {machine.quantity}</li>
                                    ))}
                                </ul>
                                <ul>
                                    {operation.workers?.map((worker, index) => (
                                        <li key={operation.machines?.length + index}>{worker.name}, SL: {worker.quantity}</li>
                                    ))}
                                </ul>
                            </td>
                            <td className="text-center">{operation.hourProduction}</td>
                            <td>
                                <a
                                    className='edit text-yellow'
                                    style={{ width: '5px' }}
                                    title={translate('manufacturing.routing.edit_operation')}
                                >
                                    <i className='material-icons'>edit</i>
                                </a>
                                <ConfirmNotification
                                    icon='question'
                                    title={translate('manufacturing.routing.delete_operation')}
                                    name='delete'
                                    className='text-red'
                                    content={`<h4>${translate('manufacturing.routing.delete_operation')} ${"Ép khuôn thân xe"}</h4>`}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </>
    )
}

const mapStateToProps = (state) => {
    const { manufacturingWorks } = state
    return { manufacturingWorks }
}

const mapDispatchToProps = {
    getAllManufacturingWorks: worksActions.getAllManufacturingWorks,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(RoutingSheet));
