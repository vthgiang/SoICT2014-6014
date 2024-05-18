import { useRef, useEffect } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    useNodesState,
    useEdgesState,
    MarkerType,
    MiniMap,
} from 'reactflow';
import 'reactflow/dist/style.css';

const RoutingFlowDetail = (props) => {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const { operations = [], edgeTypes, nodeTypes } = props

    useEffect(() => {
        operations.forEach((operation, index) => {
            const initOperationNode = {
                id: `dtl-${operation.id}`,
                position: { x: (index % 2) * 120 + 150, y: index * 120 },
                type: "operationNode",
                data: { operation: operation },
            }

            const nextOperationId = operation.nextOperation

            if (operation != null) {
                const initEdge = {
                    id: `dtl-${operation._id}-${nextOperationId}`,
                    source: `dtl-${operation.id}`,
                    target: `dtl-${nextOperationId}`,
                    animated: true,
                    type: 'operationConnection',
                    markerEnd: {
                        type: MarkerType.Arrow
                    }
                }
                setEdges(prev => [...prev, initEdge])
            }
            setNodes(prev => prev.concat(initOperationNode))
        })

    }, [operations])

    return (
        <div className="dndflow">
            <ReactFlowProvider>
                <div className="reactflow-wrapper" ref={reactFlowWrapper}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        edgeTypes={edgeTypes}
                        nodeTypes={nodeTypes}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        snapToGrid={true}
                        snapGrid={[30, 30]}
                    >
                        <MiniMap/>
                    </ReactFlow>
                </div>
            </ReactFlowProvider>
        </div>
    );
};

export default RoutingFlowDetail;
