import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DialogModal, ButtonModal, SelectBox, ErrorLabel, AttributeTable } from '../../../../common-components'
import { POLICY_ATTRIBUTE_RULE_CHECK } from '../../../../helpers/constants'
import ValidationHelper from '../../../../helpers/validationHelper'

function AttributeAddForm(props) {
  const [state, setState] = useState({
    rule: '',
    attributes: []
  })

  useEffect(() => {
    if (props.policyID !== state.policyID) {
      setState({
        ...state,
        attributes: props.attributes,
        rule: props.rule
      })
    }
  }, [props.policyID])

  const handleChangeAttributeRule = (e) => {
    validateAttributeRule(e[0])
  }

  const validateAttributeRule = (value, willUpdateState = true) => {
    let msg = undefined
    const { translate } = props
    if (!value) {
      msg = translate('manage_delegation_policy.rule_not_selected')
    }
    if (willUpdateState) {
      var { rule } = state
      rule = value
      setState((state) => {
        return {
          ...state,
          errorOnRuleField: msg,
          rule: rule
        }
      })
      props.handleChange(props.ruleOwner, rule)
    }
    return msg === undefined
  }

  // const validateAttributeDuplicate = (willUpdateState = true) => {
  //     let msg = undefined;
  //     const { translate } = props;
  //     let uniqueChosenAttribute = state.userAttributes.map(a => a.attributeId).filter((x, i, a) => a.indexOf(x) == i);

  //     if (uniqueChosenAttribute.length != state.userAttributes.length) {
  //         msg = translate('manage_delegation_policy.duplicate_attribute');
  //     }
  //     if (willUpdateState) {
  //         setState(state => {
  //             return {
  //                 ...state,
  //                 errorDuplicate: msg,
  //             }
  //         });
  //     }
  //     return msg === undefined;
  // }

  const handleChange = (name, value) => {
    setState({
      ...state,
      attributes: value
    })
  }
  console.log(state)

  const handleChangeAddRowAttribute = (name, value) => {
    props.handleChangeAddRowAttribute(name, value)
  }

  const validateAttributes = () => {
    var attributes = state.attributes
    let result = true

    if (attributes.length !== 0) {
      for (let n in attributes) {
        if (
          !ValidationHelper.validateEmpty(props.translate, attributes[n].attributeId).status ||
          !ValidationHelper.validateEmpty(props.translate, attributes[n].value).status
        ) {
          result = false
          break
        }
      }
    }
    return result
  }

  const isFormValidated = () => {
    let { translate } = props
    if (!ValidationHelper.validateEmpty(translate, rule).status || !validateAttributes()) return false
    return true
  }

  const save = () => {
    if (isFormValidated()) {
      return props.handleChange(props.attributeOwner, state.attributes)
    }
  }

  const { translate } = props
  const { errorOnRuleField, attributes, rule, errorDuplicate } = state

  return (
    <React.Fragment>
      <DialogModal
        modalID={`modal-add-attribute-${props.id}`}
        isLoading={attributes.isLoading}
        formID={`form-add-attribute-${props.id}`}
        title={translate(props.translation + '.add_attribute_title')}
        func={save}
        disableSubmit={!isFormValidated()}
        size={75}
      >
        {/* Form thêm phân quyền mới */}
        <form id={`form-add-attribute-${props.id}`}>
          {/* Những người dùng có phân quyền */}
          <div className={`form-group ${errorOnRuleField ? 'has-error' : ''}`}>
            {errorDuplicate ? <span style={{ float: 'right', color: 'orangered' }}>{errorDuplicate}</span> : null}
            <label>{translate('manage_delegation_policy.add_rule')}</label>
            <SelectBox
              id={`modal-add-rule-${props.id}`}
              className='form-control select2'
              style={{ width: '100%' }}
              value={rule}
              items={POLICY_ATTRIBUTE_RULE_CHECK.map((rule) => {
                return { value: rule.name, text: rule.value + ' (' + translate('manage_delegation_policy.rule' + '.' + rule.name) + ')' }
              })}
              onChange={(e) => handleChangeAttributeRule(e)}
              multiple={false}
              options={{ placeholder: translate('manage_delegation_policy.rule_select') }}
            />
            {errorDuplicate && <ErrorLabel content={errorOnRuleField} />}
          </div>

          {/* Các thuộc tính của user */}
          <AttributeTable
            attributes={attributes}
            handleChange={handleChange}
            attributeOwner={props.attributeOwner}
            translation={props.translation}
            noDescription={true}
            handleChangeAddRowAttribute={handleChangeAddRowAttribute}
            i={props.i}
            attributeType={['Delegation', 'Mixed']}
          />
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

function mapStateToProps(state) {
  const { policyDelegation } = state
  return { policyDelegation }
}

const attributeAddForm = connect(mapStateToProps)(withTranslate(AttributeAddForm))

export { attributeAddForm as AttributeAddForm }
