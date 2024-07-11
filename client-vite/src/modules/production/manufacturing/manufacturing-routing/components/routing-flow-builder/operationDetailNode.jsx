import React, { useState } from 'react'
import { Handle, Position } from 'reactflow'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import machineImage from '/image/machine.png'
import workerImage from '/image/worker.png'

import { Popover } from '@mui/material'

const OperationDetailNode = (props) => {
  const { data, isConnectable, translate } = props
  const [anchorEl, setAnchorEl] = useState(null)
  const { operation } = data
  const open = Boolean(anchorEl)
  const id = open ? 'detail-popover' : undefined
  const tableId = 'table-detail-popover'

  const handleOpenPopover = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
      >
        <div style={{ padding: '2rem', maxWidth: '500px' }}>
          <div style={{ marginBottom: '1rem' }}> Chi tiết tài nguyên </div>
          <table id={tableId} className='table table-striped table-bordered table-hover'>
            <thead>
              <tr>
                <th>{translate('manufacturing.routing.index')}</th>
                <th>{translate('manufacturing.routing.asset_name')}</th>
                <th>{translate('manufacturing.routing.asset_code')}</th>
                <th>{translate('manufacturing.routing.cost')}</th>
                <th>{translate('manufacturing.routing.estimated_hprs')}</th>
                <th>{translate('manufacturing.routing.avail_worker')}</th>
              </tr>
            </thead>
            <tbody>
              {operation.resources?.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.machine?.assetName}</td>
                  <td>{item.machine?.code}</td>
                  <td>{item.machine?.cost}</td>
                  <td>{item.machine?.estimatedTotalProduction}</td>
                  <td>
                    <ul>
                      {item.workers?.map((worker, index) => (
                        <li key={index} className='text-left'>
                          {worker.userId.name}-{worker.userId.email}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Popover>
      <div className='operation-node' aria-describedby={id} variant='contained' onClick={handleOpenPopover}>
        <Handle type='source' id='left' position={Position.Left} isConnectable={isConnectable} />
        <Handle type='source' id='right' position={Position.Right} isConnectable={isConnectable} />

        <div className='node-wrapper'>
          <div className='node-header'>{data.operation.name}</div>
          <div className='node-item_list'>
            {operation.resources?.map((item, index) =>
              item.machine ? (
                <div className='node-item' key={index}>
                  <div className='node-item-wrapper'>
                    <img className='node-item_image' src={machineImage} />
                    <span className='node-item_content'>{item.machine.assetName}</span>
                  </div>
                </div>
              ) : (
                <div className='node-item' key={index}>
                  <div className='node-item-wrapper'>
                    <img className='node-item_image' src={workerImage} />
                    <span className='node-item_content'>{item.workerRole?.name}</span>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        <Handle type='target' id='top' position={Position.Top} isConnectable={isConnectable} />
        <Handle type='target' id='bottom' position={Position.Bottom} isConnectable={isConnectable} />
      </div>
    </>
  )
}

const mapStateToProps = (state) => {
  const { manufacturingWorks, assetsManager } = state
  return { manufacturingWorks, assetsManager }
}

export default connect(mapStateToProps, null)(withTranslate(OperationDetailNode))
