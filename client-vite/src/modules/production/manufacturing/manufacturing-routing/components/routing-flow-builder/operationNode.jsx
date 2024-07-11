import { Handle, Position } from 'reactflow'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import machineImage from '/image/machine.png'
import workerImage from '/image/worker.png'

const OperationNode = (props) => {
  const { data, isConnectable, manufacturingWorks, assetsManager } = props

  const getMachineNameById = (id) => {
    const machine = assetsManager.listAssets.find((asset) => asset._id === id)
    return machine ? machine.assetName : ''
  }

  const getWorkerRoleNameById = (id) => {
    const { employeeRoles } = manufacturingWorks
    const workerRole = employeeRoles.find((role) => role._id == id)
    return workerRole ? workerRole.name : ''
  }

  return (
    <div className='operation-node'>
      <Handle type='source' id='left' position={Position.Left} isConnectable={isConnectable} />
      <Handle type='source' id='right' position={Position.Right} isConnectable={isConnectable} />

      <div className='node-wrapper'>
        <div className='node-header'>{data.operation.name}</div>
        <div className='node-item_list'>
          {data.operation.resources?.map((item, index) =>
            item.machine ? (
              <div className='node-item' key={index}>
                <div className='node-item-wrapper'>
                  <img className='node-item_image' src={machineImage} />
                  <span className='node-item_content'>
                    {item.machine.assetName || getMachineNameById(item.machine)}
                  </span>
                </div>
              </div>
            ) : (
              <div className='node-item' key={index}>
                <div className='node-item-wrapper'>
                  <img className='node-item_image' src={workerImage} />
                  <span className='node-item_content'>
										{item.workerRole?.name || getWorkerRoleNameById(item.workerRole)}
									</span>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      <Handle type='target' id='top' position={Position.Top} isConnectable={isConnectable} />
      <Handle type='target' id='bottom' position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  )
}

const mapStateToProps = (state) => {
  const { manufacturingWorks, assetsManager } = state
  return { manufacturingWorks, assetsManager }
}

export default connect(mapStateToProps, null)(withTranslate(OperationNode))
