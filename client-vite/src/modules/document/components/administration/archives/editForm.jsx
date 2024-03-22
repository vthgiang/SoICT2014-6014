import React, { Component, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { ErrorLabel, TreeSelect } from '../../../../../common-components'
import { DocumentActions } from '../../../redux/actions'
import ValidationHelper from '../../../../../helpers/validationHelper'

function EditForm(props) {
  const [state, setState] = useState({})
  const handleName = (e) => {
    const { value } = e.target
    const { translate } = props
    const { message } = ValidationHelper.validateName(translate, value, 1, 255)
    setState({
      ...state,
      name: value,
      nameError: message
    })
  }

  const handleDescription = (e) => {
    const { value } = e.target
    setState({
      ...state,
      description: value
    })
  }

  const handleParent = (value) => {
    setState({
      ...state,
      archiveParent: value[0]
    })
  }

  const isValidateForm = () => {
    let { name, description } = state
    let { translate } = props
    if (!ValidationHelper.validateName(translate, name, 1, 255).status) return false
    return true
  }

  const findNode = (element, id) => {
    if (element.id === id) {
      return element
    } else if (element.children) {
      let i
      let result = ''
      for (i = 0; i < element.children.length; i++) {
        result = findNode(element.children[i], id)
      }
      return result
    }
    return null
  }
  // tìm các node con cháu
  const findChildrenNode = (list, node) => {
    let array = []
    let queue_children = [node]
    while (queue_children.length > 0) {
      let tmp = queue_children.shift()
      array = [...array, tmp._id]
      let children = list.filter((child) => child.parent === tmp._id)
      queue_children = queue_children.concat(children)
    }
    return array
  }

  const save = () => {
    const { documents } = props
    const { archiveId, name, description, archiveParent } = state
    const { list } = documents.administration.archives

    let node = ''
    node = list.filter((archive) => archive._id === archiveId)[0]

    // find node child
    let array = []
    if (node) {
      array = findChildrenNode(list, node)
    }

    props.editDocumentArchive(archiveId, {
      name,
      description,
      parent: archiveParent,
      array: array
    })
  }
  useEffect(() => {
    setState({
      ...state,
      archiveId: props.archiveId,
      name: props.archiveName,
      description: props.archiveDescription,
      archiveParent: props.archiveParent,
      path: props.archivePath,
      nameError: undefined,
      descriptionError: undefined
    })
  }, [props.archiveId])
  const { translate, documents, unChooseNode } = props
  const { list } = documents.administration.archives
  const { name, description, archiveParent, path, nameError } = state
  let listArchive = []
  for (let i in list) {
    if (!unChooseNode.includes(list[i].id)) {
      listArchive.push(list[i])
    }
  }
  const disabled = !isValidateForm()
  return (
    <div id='edit-document-archive'>
      <div className={`form-group ${nameError === undefined ? '' : 'has-error'}`}>
        <label>
          {translate('document.administration.archives.name')}
          <span className='text-red'>*</span>
        </label>
        <input type='text' className='form-control' onChange={handleName} value={name || false} />
        <ErrorLabel content={nameError} />
      </div>
      <div className='form-group'>
        <label>{translate('document.administration.archives.parent')}</label>
        <TreeSelect data={listArchive} value={[archiveParent]} handleChange={handleParent} mode='radioSelect' />
      </div>
      <div className='form-group'>
        <strong>{translate('document.administration.archives.path_detail')}&emsp; </strong>
        {path}
      </div>
      <div className='form-group'>
        <label>{translate('document.administration.domains.description')}</label>
        <textarea style={{ minHeight: '120px' }} type='text' className='form-control' onChange={handleDescription} value={description} />
      </div>
      <div className='form-group'>
        <button className='btn btn-success pull-right' style={{ marginLeft: '5px' }} disabled={disabled} onClick={save}>
          {translate('form.save')}
        </button>
        <button
          className='btn btn-danger'
          onClick={() => {
            window.$(`#edit-document-archive`).slideUp()
          }}
        >
          {translate('form.close')}
        </button>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => state

const mapDispatchToProps = {
  editDocumentArchive: DocumentActions.editDocumentArchive,
  getDocumentArchives: DocumentActions.getDocumentArchive
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(EditForm))
