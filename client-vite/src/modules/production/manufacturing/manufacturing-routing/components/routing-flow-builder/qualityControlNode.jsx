import { Handle, Position } from 'reactflow'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

const QualityControlNode = (props) => {
  const { data, isConnectable, translate } = props

  return (
    <div className='quality-control-node'>
      <Handle type='target' id='left' position={Position.Left} isConnectable={isConnectable} />
      <Handle type='target' id='right' position={Position.Right} isConnectable={isConnectable} />

      <div className='node-wrapper'>
        <span>{translate(`manufacturing.routing.qcType.${data.qcType}`)}</span>
      </div>

      <Handle type='target' id='top' position={Position.Top} isConnectable={isConnectable} />
      <Handle type='source' id='bottom' position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  )
}

export default connect(null, null)(withTranslate(QualityControlNode))
