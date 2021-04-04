import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual';

import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions';

import { OrganizationalUnitKpiCreate } from './organizationalUnitKpiCreate';

function OrganizationalUnitKpiCreateForAdmin (props) {
    const { department } = props

    useEffect(() => {
        props.getAllUnit()
    }, [])

    let list
    if (department?.list?.length > 0) {
        list = department.list;
    }
    return (
        <OrganizationalUnitKpiCreate
            type="for-admin"
            selectBoxAllUnit={list?.map(item => {
                return {
                    ...item,
                    id: item?._id,
                    parent_id: item?.parent
                }
            })}
        />
    )
}

function mapState(state) {
    const { department } = state;
    return { department }
}
const actions = {
    getAllUnit: DepartmentActions.get
}

const connectedOrganizationalUnitKpiCreateForAdmin = connect(mapState, actions)(withTranslate(OrganizationalUnitKpiCreateForAdmin))
export { connectedOrganizationalUnitKpiCreateForAdmin as OrganizationalUnitKpiCreateForAdmin}