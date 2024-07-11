import { BaseEdge, getSmoothStepPath, useReactFlow, EdgeLabelRenderer } from 'reactflow'

const OperationConnection = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {
    stroke: '#b1b1b7',
    strokeWidth: 2
  },
  markerEnd = {
    width: 20,
    height: 20
  }
}) => {
  const { setEdges } = useReactFlow()

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  })

  const onEdgeClick = () => {
    setEdges((edges) => edges.filter((edge) => edge.id !== id))
  }

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} type='step' />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            fontSize: 12,
            pointerEvents: 'all'
          }}
          className='nodrag nopan'
        >
          <button className='edgebutton' onClick={onEdgeClick}>
            x
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  )
}

export default OperationConnection
