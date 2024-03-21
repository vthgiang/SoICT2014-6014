import React, { Component, useEffect, useState } from 'react'
import { connect } from 'react-redux'

import { CompanyActions } from '../redux/actions'

import { PaginateBar, DataTableSetting, SearchBar } from '../../../../common-components'

import { withTranslate } from 'react-redux-multilingual'
function CompanyManageComponent(props) {
  const [state, setState] = useState({
    limit: 5,
    page: 1,
    option: 'name',
    value: ''
  })

  useEffect(() => {
    if (
      props.companyId !== state.companyId ||
      props.company.item.components.listPaginate !== state.componentPaginate ||
      props.company.item.components.limit !== state.componentLimit ||
      props.company.item.components.page !== state.componentPage
    ) {
      setState({
        ...state,
        checkedAll: false,
        companyId: props.companyId,
        companyShortName: props.companyShortName,
        componentPaginate: props.company.item.components.listPaginate,
        componentPage: props.company.item.components.page,
        componentLimit: props.company.item.components.limit
      })
    }
  }, [props.companyId, props.company.item.components.listPaginate, props.company.item.components.limit, props.company.item.components.page])

  const companyHasComponent = (componentName, companyComponents) => {
    let result = false

    for (let i = 0; i < companyComponents.length; i++) {
      const component = companyComponents[i]
      if (componentName === component.name) {
        result = true
        break
      }
    }

    return result
  }

  // Kiem tra thong tin da validated het chua?
  const isFormCreateLinkValidated = () => {
    const { componentName } = state

    if (componentName !== undefined) {
      return true
    } else {
      return false
    }
  }

  const showCreateComponentForm = () => {
    window.$('#add-new-component-default').slideDown()
  }

  const closeCreateComponentForm = () => {
    window.$('#add-new-component-default').slideUp()
  }

  const saveAndCloseComponentForm = () => {
    const { companyId, componentName, componentLink, componentDescription } = state

    window.$('#add-new-component-default').slideUp()
    return props.addCompanyComponent(companyId, {
      name: componentName,
      link: componentLink,
      description: componentDescription
    })
  }

  const deleteCompanyComponent = (companyId, componentId) => {
    return props.deleteCompanyComponent(companyId, componentId)
  }

  const handleName = (e, systemComponents) => {
    const value = e.target.value

    for (let index = 0; index < systemComponents.list.length; index++) {
      const systemComponent = systemComponents.list[index]

      if (value === systemComponent.name) {
        setState({
          ...state,
          componentName: systemComponent.name,
          componentLink: systemComponent.url,
          componentDescription: systemComponent.description
        })
      }
    }
  }

  const setOption = (title, option) => {
    setState({
      ...state,
      [title]: option
    })
  }

  const searchWithOption = (state) => {
    const params = {
      company: state?.companyId,
      portal: state?.companyShortName,
      limit: state?.limit,
      page: 1,
      key: state?.option,
      value: state?.value
    }

    props.getCompanyComponents(params)
  }

  const setPage = (page) => {
    setState({
      ...state,
      page
    })
    const { companyId } = state
    const params = {
      company: companyId,
      portal: state.companyShortName,
      limit: state.limit,
      page: page,
      key: state.option,
      value: state.value
    }

    props.getCompanyComponents(params)
  }

  const setLimit = (number) => {
    setState({
      ...state,
      limit: number
    })
    const { companyId } = state
    const params = {
      company: companyId,
      portal: state.companyShortName,
      limit: number,
      page: state.page,
      key: state.option,
      value: state.value
    }

    props.getCompanyComponents(params)
  }

  const checkAll = (e) => {
    let { componentPaginate } = state
    let { checked } = e.target

    const componentArr = componentPaginate.map((component) => {
      return {
        ...component,
        deleteSoft: !checked
      }
    })
    setState({
      ...state,
      checkedAll: checked,
      componentPaginate: componentArr
    })
  }

  const handleCheckbox = (e) => {
    const { componentPaginate } = state
    const { value, checked } = e.target
    for (let i = 0; i < componentPaginate.length; i++) {
      if (value === componentPaginate[i]._id) {
        componentPaginate[i].deleteSoft = !checked
        setState({
          ...state,
          componentPaginate
        })
        break
      }
    }
  }

  const updateCompanyComponents = (portal) => {
    let { componentPaginate } = state
    let data = componentPaginate.map((component) => {
      return {
        _id: component._id,
        deleteSoft: component.deleteSoft
      }
    })

    props.updateCompanyComponents(data, { portal })
  }
  const { translate, company } = props
  const { companyShortName, componentPaginate, checkedAll } = state

  return (
    <div style={{ padding: '10px 0px 10px 0px' }}>
      <a className='btn btn-primary pull-right' onClick={() => updateCompanyComponents(companyShortName)}>
        <i className='material-icons'>save</i>
      </a>
      <SearchBar
        id={`search-component`}
        columns={[
          { title: translate('manage_component.name'), value: 'name' },
          { title: translate('manage_component.description'), value: 'description' }
        ]}
        option={state.option}
        setOption={setOption}
        search={searchWithOption}
        parentState={state}
      />
      <DataTableSetting tableId='company-manage-component-table' setLimit={setLimit} />
      <table className='table table-hover table-striped table-bordered' id='company-manage-component-table'>
        <thead>
          <tr>
            <th style={{ width: '32px' }} className='col-fixed'>
              <input type='checkbox' value='checkall' onChange={checkAll} checked={checkedAll} />
            </th>
            <th>{translate('manage_component.name')}</th>
            <th>{translate('manage_component.link')}</th>
            <th>{translate('manage_component.description')}</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(componentPaginate) && componentPaginate.length > 0 ? (
            componentPaginate.map((component) => (
              <tr key={component._id}>
                <td>
                  <input type='checkbox' value={component._id} onChange={handleCheckbox} checked={!component.deleteSoft} />
                </td>
                <td>{component.name}</td>
                <td>{component.link ? component.link.url : null}</td>
                <td>{component.description}</td>
              </tr>
            ))
          ) : company.item.components.isLoading ? (
            <tr>
              <td colSpan='4'>{translate('confirm.loading')}</td>
            </tr>
          ) : (
            <tr>
              <td colSpan='4'>{translate('confirm.no_data')}</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Paginate Bar */}
      <PaginateBar pageTotal={company.item.components.totalPages} currentPage={company.item.components.page} func={setPage} />
    </div>
  )
}

function mapState(state) {
  const { company, systemComponents } = state
  return { company, systemComponents }
}
const action = {
  getCompanyComponents: CompanyActions.getCompanyComponents,
  updateCompanyComponents: CompanyActions.updateCompanyComponents
}

const connectedCompanyManageComponent = connect(mapState, action)(withTranslate(CompanyManageComponent))
export { connectedCompanyManageComponent as CompanyManageComponent }
