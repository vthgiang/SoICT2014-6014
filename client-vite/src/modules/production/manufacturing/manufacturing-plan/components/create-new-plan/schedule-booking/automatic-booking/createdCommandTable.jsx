import React, { useState } from 'react'
import { Collapse, IconButton } from '@mui/material'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

const CreatedCommandItem = (props) => {
  const { translate, command } = props
  const [open, setOpen] = useState(false)

  return (
    <>
      <tr>
        <td style={{ textAlign: 'center' }}>
          <IconButton onClick={() => setOpen(!open)}>
            {open ? <i className='material-icons'>expand_less</i> : <i className='material-icons'>expand_more</i>}
          </IconButton>
        </td>
        <td>{command.code}</td>
        <td>{command.good.code}</td>
        <td>{command.good.name}</td>
        <td>{command.good.baseUnit}</td>
        <td>{command.quantity}</td>
      </tr>
      <tr>
        <td colSpan={8}>
          <Collapse in={open}>
            <table className='table table-striped table-bordered table-hover'>
              <tbody>
                <tr>
                  <td>{translate('manufacturing.plan.index')}</td>
                  <td className='text-left'>{translate('manufacturing.plan.operation')}</td>
                  <td className='text-left'>{translate('manufacturing.plan.mill')}</td>
                  <td>{translate('manufacturing.plan.resources')}</td>
                </tr>
                {command.routing.operations.map((operation, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td className='text-left'>{operation.name}</td>
                    <td className='text-left'>{operation.manufacturingMill.name}</td>
                    <td>
                      <ul className='text-left'>
                        {operation.resources.map((resource, index) => {
                          return <li key={index}>{resource.machine ? resource.machine.assetName : resource.workerRole.name}</li>
                        })}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Collapse>
        </td>
      </tr>
    </>
  )
}

const CreatedCommandTable = (props) => {
  const { translate, manufacturingCommands } = props
  return (
    <fieldset className='scheduler-border'>
      <legend className='scheduler-border'>{translate('manufacturing.plan.list_commands')}</legend>
      <table className='table table-striped table-bordered' style={{ marginTop: '1rem' }}>
        <thead>
          <tr>
            <th></th>
            <th>{translate('manufacturing.plan.command_code')}</th>
            <th>{translate('manufacturing.plan.good_code')}</th>
            <th>{translate('manufacturing.plan.good_name')}</th>
            <th>{translate('manufacturing.plan.base_unit')}</th>
            <th>{translate('manufacturing.plan.quantity')}</th>
          </tr>
        </thead>
        <tbody>
          {manufacturingCommands.map((command, index) => (
            <CreatedCommandItem key={index} translate={translate} command={command} />
          ))}
        </tbody>
      </table>
    </fieldset>
  )
}

export default connect(null, null)(withTranslate(CreatedCommandTable))
