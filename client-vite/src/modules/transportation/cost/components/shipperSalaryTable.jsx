import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { DialogModal } from '../../../../common-components';

const ShipperSalaryTable = (props) => {

    const { translate } = props;

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-shipper-salary-table`} isLoading={false}
                title={translate('manage_transportation.cost_management.shipper_salary_table')}
                formID={`modal-shipper-salary-table`}
                size={50}
                maxWidth={500}
                hasSaveButton={true}
                hasNote={false}
            >
                <table id="calculated-salary" className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th className="col-fixed" style={{ width: 60 }}>{translate('manage_example.index')}</th>
                            <th>{translate('manage_transportation.cost_management.shipper_name')}</th>
                            <th>{translate('manage_transportation.cost_management.shipper_cost')}</th>
                        </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </table>
            </DialogModal>
        </React.Fragment>
    );
}

// function mapStateToProps(state) {
// }

// const mapDispatchToProps = {
// }

export default React.memo(connect(null, null)(withTranslate(ShipperSalaryTable)));