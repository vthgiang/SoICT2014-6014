import React from 'react'

import { withTranslate } from 'react-redux-multilingual'

import { AttributeTable } from './attributeTable'

function ManageAttribute() {
  return (
    <div className='box' style={{ minHeight: '450px' }}>
      <div className='box-body'>
        <AttributeTable />
      </div>
    </div>
  )
}

export default withTranslate(ManageAttribute)
