import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { UserActions } from '../../../super-admin/user/redux/actions'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import LoyalCustomerHomePage from './homePage'
import { CrmCustomerActions } from '../../customer/redux/actions'
import { CrmCustomerRankPointActions } from '../../customerRankPoint/redux/action'
import { RoleActions } from '../../../super-admin/role/redux/actions'
import { getStorage } from '../../../../config'

function CrmLoyalCustomer(props) {
  useEffect(() => {
    props.getDepartment()
    props.getCustomerRankPonits()
    props.showRole(getStorage('currentRole'))
  }, [])
  const { user, crm, role } = props
  return <div>{role && crm && crm.customerRankPoints && user && user.organizationalUnitsOfUser && <LoyalCustomerHomePage />}</div>
}

function mapStateToProps(state) {
  const { crm, user, role } = state
  return { crm, user, role }
}

const mapDispatchToProps = {
  getDepartment: UserActions.getDepartmentOfUser,
  getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
  addPromotion: CrmCustomerActions.addPromotion,
  getCustomerRankPonits: CrmCustomerRankPointActions.getCustomerRankPoints,
  showRole: RoleActions.show
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CrmLoyalCustomer))
