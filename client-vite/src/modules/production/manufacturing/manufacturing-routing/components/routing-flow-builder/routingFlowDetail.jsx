import { useRef, useEffect } from 'react'
import ReactFlow, { ReactFlowProvider, useNodesState, useEdgesState, MarkerType, MiniMap } from 'reactflow'
import 'reactflow/dist/style.css'

const RoutingFlowDetail = (props) => {
  const reactFlowWrapper = useRef(null)
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const { operations = [], edgeTypes, nodeTypes } = props

  useEffect(() => {
    const operationNodeList = operations.map((operation, index) => {
      return {
        id: `op-${operation.id}`,
        position: { x: (index % 2) * 300 + 400, y: index * 120 + 40 },
        type: 'operationDetailNode',
        data: { operation: operation }
      }
    })

    setNodes(operationNodeList)

    const qualityControlNodeList = operations.map((operation, index) => {
      const qcType = operation.nextOperation.length === 0 ? 2 : 1

      return {
        id: `qc-${operation.id}`,
        position: { x: ((index + 1) % 2) * 300 + 400, y: index * 120 },
        type: 'qualityControlNode',
        data: { qcType }
      }
    })

    setNodes((prev) => [...prev, ...qualityControlNodeList])

    const edgeList = operations.map((operation, index) => {
      const nextOperationIds = operation.nextOperation

      if (nextOperationIds.length === 0) {
        return {
          id: `op-${operation.id}-qc-${operation.id}`,
          source: `op-${operation.id}`,
          target: `qc-${operation.id}`,
          sourceHandle: index % 2 === 0 ? 'right' : 'left',
          targetHandle: index % 2 === 0 ? 'left' : 'right',
          animated: true,
          type: 'smoothstep',
          style: {
            stroke: '#b1b1b7',
            strokeWidth: 1.5
          },
          markerEnd: {
            type: MarkerType.Arrow
          }
        }
      }

      return nextOperationIds.map((nextOperationId) => {
        return [
          {
            id: `op-${operation.id}-qc-${operation.id}`,
            source: `op-${operation.id}`,
            target: `qc-${operation.id}`,
            sourceHandle: index % 2 === 0 ? 'right' : 'left',
            targetHandle: index % 2 === 0 ? 'left' : 'right',
            animated: true,
            type: 'smoothstep',
            style: {
              stroke: '#b1b1b7',
              strokeWidth: 1.5
            },
            markerEnd: {
              type: MarkerType.Arrow
            }
          },
          {
            id: `qc-${operation.id}-op-${nextOperationId}`,
            source: `qc-${operation.id}`,
            target: `op-${nextOperationId}`,
            sourceHandle: index % 2 === 0 ? 'right' : 'left',
            targetHandle: 'top',
            animated: true,
            type: 'smoothstep',
            style: {
              stroke: '#b1b1b7',
              strokeWidth: 1.5
            },
            markerEnd: {
              type: MarkerType.Arrow
            }
          }
        ]
      })
    })

    setEdges([...edgeList.flat(2)])
  }, [operations])

  return (
    <div className='dndflow'>
      <ReactFlowProvider>
        <div className='reactflow-wrapper' ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            edgeTypes={edgeTypes}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView={true}
          >
            <MiniMap />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </div>
  )
}

export default RoutingFlowDetail
