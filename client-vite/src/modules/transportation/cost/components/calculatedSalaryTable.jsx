import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { DialogModal} from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import { ShipperActions } from '../../shipper/redux/actions';
import moment from 'moment';

const CalculatedShipperSalary = (props) => {
    const { translate, shipper, shipperSalaryList, monthYear } = props;

    const [state, setState] = useState({
        shippersSalary: [],
        tableId: "calculated-salary-table"
    })
    const { shippersSalary, tableId } = state;

    useEffect(() => {
        if (shipperSalaryList) {
            setState({
                shippersSalary: shipperSalaryList
            })
        }
    }, [shipperSalaryList])

    const save = async () => {
        let dataSalary = {};
        dataSalary.date = moment().format("DD-MM-YYYY");
        dataSalary.salary = shippersSalary;

        await props.saveShipperSalary(dataSalary);

        let monthYear = props.monthYear;
        let firstDateInMonth = new Date(monthYear + '-01');
        let lastDateInMonth = new Date(firstDateInMonth.getFullYear(), firstDateInMonth.getMonth() + 1, 0);
        props.getAllShipperSalaryByCondition({
            firstDateInMonth: moment(firstDateInMonth).format('DD-MM-YYYY'),
            lastDateInMonth: moment(lastDateInMonth).format('DD-MM-YYYY')
        });
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-calculate-shipper-salary" isLoading={shippersSalary.length > 0 ? false : true}
                formID="form-calculate-shipper-salary"
                title={translate('manage_transportation.shipper_management.calculated_salary_table')}
                msg_success={translate('manage_transportation.shipper_management.save_salary_success')}
                msg_failure={translate('manage_transportation.shipper_management.save_salary_fail')}
                func={save}
                size={65}
                maxWidth={700}
            >
                <form id="form-calculate-shipper-salary" onSubmit={() => save(translate('manage_transportation.cost_management.save_salary'))}>
                    <table id={tableId} className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th className="col-fixed" style={{ width: 60 }}>{translate('manage_example.index')}</th>
                                <th>{translate('manage_transportation.shipper.shipper_name')}</th>
                                <th>{translate('manage_transportation.cost_management.fixed_salary')}</th>
                                <th>{translate('manage_transportation.cost_management.bonus_salary')}</th>
                                <th>{translate('manage_transportation.cost_management.total_salary')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(shippersSalary && shippersSalary.length !== 0) &&
                                shippersSalary.map((shipperSalary, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{shipperSalary.name}</td>
                                        <td>{shipperSalary.fixedSalary}</td>
                                        <td>{shipperSalary.bonusSalary}</td>
                                        <td>{shipperSalary.totalSalary}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const shipper = state.shipper;
    return { shipper }
}

const mapDispatchToProps = {
    saveShipperSalary: ShipperActions.saveShipperSalary,
    getAllShipperSalaryByCondition: ShipperActions.getAllShipperSalaryByCondition
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CalculatedShipperSalary));