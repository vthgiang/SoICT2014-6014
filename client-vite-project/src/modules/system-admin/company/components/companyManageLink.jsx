import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { CompanyActions } from '../redux/actions'
import { PaginateBar, DataTableSetting, SearchBar } from '../../../../common-components'
import { withTranslate } from 'react-redux-multilingual'

function CompanyManageLinks(props) {
  const [state, setState] = useState({
    limit: 5,
    page: 1,
    option: 'url',
    value: ''
  })

  useEffect(() => {
    if (
      props.companyId !== state.companyId ||
      props.company.item.links.listPaginate !== state.linkPaginate ||
      props.company.item.links.limit !== state.linkLimit ||
      props.company.item.links.page !== state.linkPage
    ) {
      setState({
        ...state,
        checkedAll: false,
        companyId: props.companyId,
        companyShortName: props.companyShortName,
        linkPaginate: props.company.item.links.listPaginate,
        linkPage: props.company.item.links.page,
        linkLimit: props.company.item.links.limit
      })
    }
  }, [props.companyId, props.company.item.links.listPaginate, props.company.item.links.limit, props.company.item.links.page])

  const companyHasLink = (linkUrl, companyLinks) => {
    let result = false

    for (let i = 0; i < companyLinks.length; i++) {
      const link = companyLinks[i]

      if (linkUrl === link.url) {
        result = true
        break
      }
    }

    return result
  }

  // Kiem tra thong tin da validated het chua?
  const isFormCreateLinkValidated = () => {
    const { linkUrl, linkDescription, linkDescriptionError } = state

    if (!linkDescriptionError && linkUrl && linkDescription) {
      if (linkUrl !== 'noturl') {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }

  const setOption = (title, option) => {
    setState({
      ...state,
      [title]: option
    })
  }

  const searchWithOption = () => {
    const { companyId } = state
    const params = {
      company: companyId,
      portal: state.companyShortName,
      limit: state.limit,
      page: 1,
      key: state.option,
      value: state.value
    }

    props.getCompanyLinks(params)
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
    props.getCompanyLinks(params)
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

    props.getCompanyLinks(params)
  }

  const checkAll = (e) => {
    let { linkPaginate } = state
    let { checked } = e.target
    const linkArr = linkPaginate.map((link) => {
      return {
        ...link,
        deleteSoft: !checked
      }
    })
    setState({
      ...state,
      checkedAll: checked,
      linkPaginate: linkArr
    })
  }

  const handleCheckbox = (e) => {
    const { linkPaginate } = state
    const { value, checked } = e.target
    for (let i = 0; i < linkPaginate.length; i++) {
      if (value === linkPaginate[i]._id) {
        linkPaginate[i].deleteSoft = !checked
        setState({
          ...state,
          linkPaginate
        })
        break
      }
    }
  }

  const updateCompanyLinks = (portal) => {
    let { linkPaginate } = state
    let data = linkPaginate.map((link) => {
      return {
        _id: link._id,
        deleteSoft: link.deleteSoft
      }
    })

    props.updateCompanyLinks(data, { portal })
  }

  const { translate, company } = props
  const { linkPaginate, checkedAll, companyShortName } = state

  return (
    <div style={{ padding: '10px 0px 10px 0px' }}>
      <a className='btn btn-primary pull-right' onClick={() => updateCompanyLinks(companyShortName)}>
        <i className='material-icons'>save</i>
      </a>
      <SearchBar
        columns={[
          { title: translate('manage_link.url'), value: 'url' },
          { title: translate('manage_link.category'), value: 'category' },
          { title: translate('manage_link.description'), value: 'description' }
        ]}
        option={state.option}
        setOption={setOption}
        search={searchWithOption}
      />
      <DataTableSetting tableId='company-manage-link-table' setLimit={setLimit} />
      <table className='table table-hover table-striped table-bordered' id='company-manage-link-table'>
        <thead>
          <tr>
            <th style={{ width: '32px' }} className='col-fixed'>
              <input type='checkbox' value='checkall' onChange={checkAll} checked={checkedAll} />
            </th>
            <th>{translate('manage_link.url')}</th>
            <th>{translate('manage_link.category')}</th>
            <th>{translate('manage_link.description')}</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(linkPaginate) && linkPaginate.length > 0 ? (
            linkPaginate.map((link) => (
              <tr key={link._id}>
                <td>
                  <input type='checkbox' value={link._id} onChange={handleCheckbox} checked={!link.deleteSoft} />
                </td>
                <td>{link.url}</td>
                <td>{link.category}</td>
                <td>{link.description}</td>
              </tr>
            ))
          ) : company.item.links.isLoading ? (
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
      <PaginateBar pageTotal={company.item.links.totalPages} currentPage={company.item.links.page} func={setPage} />
    </div>
  )
}

function mapState(state) {
  const { company, systemLinks } = state
  return { company, systemLinks }
}
const action = {
  getCompanyLinks: CompanyActions.getCompanyLinks,
  updateCompanyLinks: CompanyActions.updateCompanyLinks
}

const connectedCompanyManageLinks = connect(mapState, action)(withTranslate(CompanyManageLinks))
export { connectedCompanyManageLinks as CompanyManageLinks }
