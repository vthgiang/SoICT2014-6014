import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { RootRoleActions } from '../redux/actions';

import { withTranslate } from 'react-redux-multilingual';

function RootRoleTable(props) {

    useEffect(() => {
        props.getAllRootRoles();
    }, [])

    const { rootRoles, translate } = props;

    return (
        <React.Fragment>
            <table className="table table-hover table-striped table-bordered">
                <thead>
                    <tr>
                        <th>{translate('manage_role.name')}</th>
                        <th>{translate('manage_role.description')}</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        rootRoles.list.map(role =>
                            <tr key={`role-default-${role._id}`}>
                                <td> {role.name} </td>
                                <td> {role.description} </td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </React.Fragment>
    );
}

function mapState(state) {
    const { rootRoles } = state;
    return { rootRoles }
}
const actions = {
    getAllRootRoles: RootRoleActions.getAllRootRoles
}

const connectedRootRoleTable = connect(mapState, actions)(withTranslate(RootRoleTable))
export { connectedRootRoleTable as RootRoleTable }
