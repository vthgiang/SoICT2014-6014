import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { CompanyActions } from '../redux/actions'
import { DialogModal } from '../../../../common-components'

import { CompanyManageLinks } from './companyManageLink'
import { CompanyManageComponent } from './companyManageComponent'
import { CompanyManageApi } from './companyManageApi'

const CompanyServicesForm = (props) => {
  const [state, setState] = useState({})
  const [tabPanel, setTabPanel] = useState('company_manage_link')

  useEffect(() => {
    if (props.companyId !== state.companyId) {
      setState({
        ...state,
        companyId: props.companyId,
        companyShortName: props.companyShortName
      })
    }
  }, [props.companyId])

  const { translate, systemLinks, systemComponents, company } = props
  const { companyId, companyShortName } = state

  return (
    <React.Fragment>
      <DialogModal
        modalID='modal-edit-services-company'
        size='75'
        formID='form-edit-services-company'
        isLoading={company.isLoading}
        title={translate('manage_company.service')}
        hasSaveButton={false}
      >
        <div role='tabpanel'>
          {/* Nav tabs */}
          <ul className='nav nav-tabs' role='tablist'>
            <li role='presentation' className='active' onClick={() => setTabPanel('company_manage_link')}>
              <a href='#company_manage_link' aria-controls='home' role='tab' data-toggle='tab'>
                <b>Links</b>
                {`(${company.item.links.list.filter((link) => link.deleteSoft === false).length}/${systemLinks.list.length})`}
              </a>
            </li>
            <li role='presentation' onClick={() => setTabPanel('company_manage_component')}>
              <a href='#company_manage_component' aria-controls='tab' role='tab' data-toggle='tab'>
                <b>Component</b>
                {`(${company.item.components.list.length}/${systemComponents.list.length})`}
              </a>
            </li>
            <li role='presentation' onClick={() => setTabPanel('company_manage_api')}>
              <a href='#company_manage_api' aria-controls='tab' role='tab' data-toggle='tab'>
                <b>Apis</b>
              </a>
            </li>
          </ul>

          {/* Tab panes */}
          <div className='tab-content'>
            <div role='tabpanel' className='tab-pane active' id='company_manage_link'>
              {tabPanel === 'company_manage_link' && <CompanyManageLinks companyId={companyId} companyShortName={companyShortName} />}
            </div>

            <div role='tabpanel' className='tab-pane' id='company_manage_component'>
              {tabPanel === 'company_manage_component' && (
                <CompanyManageComponent companyId={companyId} companyShortName={companyShortName} />
              )}
            </div>

            <div role='tabpanel' className='tab-pane' id='company_manage_api'>
              {tabPanel === 'company_manage_api' && <CompanyManageApi companyId={companyId} companyShortName={companyShortName} />}
            </div>
          </div>
        </div>
      </DialogModal>
    </React.Fragment>
  )
}

function mapState(state) {
  const { systemLinks, systemComponents, company } = state
  return { systemLinks, systemComponents, company }
}
const action = {
  editCompany: CompanyActions.editCompany
}

const connectedCompanyServicesForm = connect(mapState, action)(withTranslate(CompanyServicesForm))
export { connectedCompanyServicesForm as CompanyServicesForm }
