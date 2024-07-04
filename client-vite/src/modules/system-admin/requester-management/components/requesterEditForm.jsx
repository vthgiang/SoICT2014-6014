import React, { useEffect, useState } from 'react'
import { connect, useSelector } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { RequesterActions } from '../redux/actions'
import { AttributeActions } from '../../../super-admin/attribute/redux/actions'
import { DialogModal, AttributeTable } from '../../../../common-components'
import ValidationHelper from '../../../../helpers/validationHelper'

function RequesterEditForm(props) {
  const [state, setState] = useState({
    oldPolicies: []
  })

  const { requester, translate, editRequester, getAttribute, i } = props
  const { id, name, type, attributes } = state

  const allPolicies = useSelector((x) => x.policyAuthorization.list)

  useEffect(() => {
    if (requester.id !== state.id) {
      const oldPolicies = allPolicies.filter(
        (x) => ruleCheck([requester], x.requesterRequirements.attributes, x.requesterRequirements.rule).length > 0
      )
      setState({
        ...state,
        id: requester.id,
        name: requester.name,
        type: requester.type,
        attributes: requester.attributes.map((a, index) => (a = { ...a, addOrder: index })),
        oldPolicies
      })
    }
  }, [requester.id])

  const attributeList = useSelector((x) => x.attribute.lists.filter((x) => ['Mixed', 'Authorization'].includes(x.type)))
  const attributeIdList = attributeList.map((x) => x._id)

  const ruleCheck = (objects, policyAttributes, policyRule) => {
    let satisfied = []
    let count = 0
    if (!policyAttributes || policyAttributes.length === 0 || !policyRule) {
      return satisfied
    }

    // Kiểm tra rule EQUALS
    // 1. Nếu rule là EQUALS
    if (policyRule === 'EQUALS') {
      // 2. Với mỗi user lấy ra những element có tập thuộc tính giống hệt trong chính sách (số lượng thuộc tính == và giá trị giống)
      objects.forEach((element) => {
        const attributes = element.attributes.filter((x) => attributeIdList.includes(x.attributeId.toString()))
        // Kiểm tra length
        if (attributes.length > 0 && attributes.length === policyAttributes.length) {
          attributes.forEach((uAttr) => {
            policyAttributes.forEach((pAttr) => {
              // Kiểm tra id thuộc tính và value
              if (pAttr.attributeId === uAttr.attributeId && pAttr.value === uAttr.value) {
                count++
              }
            })
          })
          if (count === policyAttributes.length) {
            // Nếu count bằng với length policy attribute thì add element vào array
            satisfied = [...satisfied, element]
          }
          // Reset count
          count = 0
        }
      })
    }

    // Kiểm tra rule BELONGS
    // 1. Nếu rule là BELONGS
    if (policyRule === 'BELONGS') {
      // 2. Với mỗi element lấy ra những element mà thuộc tính là tập con thuộc tính trong chính sách (số lượng thuộc tính <= và giá trị giống)
      objects.forEach((element) => {
        const attributes = element.attributes.filter((x) => attributeIdList.includes(x.attributeId.toString()))
        // Kiểm tra length
        if (attributes.length > 0 && attributes.length <= policyAttributes.length) {
          attributes.forEach((uAttr) => {
            policyAttributes.forEach((pAttr) => {
              // Kiểm tra id thuộc tính và value
              if (pAttr.attributeId === uAttr.attributeId && pAttr.value === uAttr.value) {
                count++
              }
            })
          })
          if (count === attributes.length) {
            // Nếu count == với length element attribute thì add element vào array
            satisfied = [...satisfied, element]
          }
          // Reset count
          count = 0
        }
      })
    }

    // Kiểm tra rule CONTAINS
    // 1. Nếu rule là CONTAINS
    if (policyRule === 'CONTAINS') {
      // 2. Với mỗi element lấy ra những element mà thuộc tính là tập cha thuộc tính trong chính sách (số lượng thuộc tính >= và giá trị giống)
      objects.forEach((element) => {
        const attributes = element.attributes.filter((x) => attributeIdList.includes(x.attributeId.toString()))
        // Kiểm tra length
        if (attributes.length > 0 && attributes.length >= policyAttributes.length) {
          attributes.forEach((uAttr) => {
            policyAttributes.forEach((pAttr) => {
              // Kiểm tra id thuộc tính và value
              if (pAttr.attributeId === uAttr.attributeId && pAttr.value === uAttr.value) {
                count++
              }
            })
          })
          if (count === policyAttributes.length) {
            // Nếu count == với length policy attribute thì add element vào array
            satisfied = [...satisfied, element]
          }
          // Reset count
          count = 0
        }
      })
    }

    return satisfied
  }

  const newRequester = {
    attributes: state.attributes ?? []
  }
  const newPolicies = allPolicies.filter(
    (x) => ruleCheck([newRequester], x.requesterRequirements.attributes, x.requesterRequirements.rule).length > 0
  )
  // const newSatifiedPolicies = newPolicies.filter((x) => !state.oldPolicies.includes(x))
  // const removedPolicies = state.oldPolicies.filter((x) => !newPolicies.includes(x))

  // Function lưu các trường thông tin vào state
  const handleChange = (name, value) => {
    setState({
      ...state,
      [name]: value
    })
  }

  const handleChangeAddRowAttribute = (name, value) => {
    props.handleChangeAddRowAttribute(name, value)
  }

  useEffect(() => {
    getAttribute()
  }, [])

  const validateAttributes = () => {
    if (!attributes) return true

    if (attributes.length !== 0) {
      for (let i = 0; i < attributes.length; i++) {
        if (
          !ValidationHelper.validateEmpty(translate, attributes[i].attributeId).status ||
          !ValidationHelper.validateEmpty(translate, attributes[i].value).status
        ) {
          return false
        }
      }
    }
    return true
  }

  const isFormValidated = () => {
    if (!validateAttributes()) return false
    return true
  }

  const save = () => {
    const newRequester = {
      attributes: attributes.map((x) => ({
        attributeId: x.attributeId,
        value: x.value,
        description: x.description
      }))
    }

    if (isFormValidated()) {
      return editRequester(id, newRequester)
    }
  }

  return (
    <DialogModal
      isLoading={requester.isLoading}
      func={save}
      modalID='modal-edit-requester'
      formID='form-edit-requester'
      title={translate('manage_requester.edit')}
      disableSubmit={!isFormValidated()}
    >
      {/* Form hỉnh sửa thông tin   */}
      <form id='form-edit-link'>
        {/* Tên của Requester */}
        <div className='form-group'>
          <label>
            {translate('manage_requester.name')}
            <span className='text-red'> * </span>
          </label>
          <input type='text' className='form-control' value={name} disabled />
        </div>

        {/* Type của Requester */}
        <div className='form-group'>
          <label>
            {translate('manage_requester.type')}
            <span className='text-red'> * </span>
          </label>
          <input type='text' className='form-control' value={type} disabled />
        </div>

        {/* Các thuộc tính của Requester */}
        <AttributeTable
          attributes={attributes}
          handleChange={handleChange}
          attributeOwner='attributes'
          translation='manage_requester'
          handleChangeAddRowAttribute={handleChangeAddRowAttribute}
          i={i}
        />

        <div className='form-group'>
          <label>Satified authorization policies (before editing):</label>
          {state.oldPolicies.map((x) => x.name).toString()}
        </div>

        <div className='form-group'>
          <label>Satified authorization policies (after editing):</label>
          {newPolicies.map((x) => x.name).toString()}
        </div>
        {/* <div className='form-group'>
          <label>
            New policies applied: 
          </label>
          {newSatifiedPolicies.map(x => x.name).toString()}
        </div>
        <div className='form-group'>
          <label>
            Policies removed:
          </label>
          {removedPolicies.map(x => x.name).toString()}
        </div> */}
      </form>
    </DialogModal>
  )
}

function mapState(state) {
  return {}
}

const dispatchStateToProps = {
  editRequester: RequesterActions.edit,
  getAttribute: AttributeActions.getAttributes
}

export default connect(mapState, dispatchStateToProps)(withTranslate(RequesterEditForm))
