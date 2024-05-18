import { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    useNodesState,
    useEdgesState,
    MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import OperationStack from "./operationStack"

const RoutingFlowCreate = (props) => {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [operationStackNodes, setOperationStackNodes] = useState([]);

    const { operations, connectOperation, edgeTypes, nodeTypes } = props

    // covert operations theo đúng format của routing trong API detail routing
    const modifiedOperations = operations.map(operation => {
        const workers = operation.workers.map(worker => ({
            workerRole: {
                name: worker.name
            },
            expYear: worker.expYear,
            number: worker.quantity

        }))
        const machines = operation.machines.map(machine => ({
            machine: {
                assetName: machine.name
            },
            operatingCost: machine.cost,
            number: machine.quantity
        }))
        return ({
            ...operation,
            workers: workers,
            machines: machines
        })
    })

    const onConnect = useCallback(
        (params) => {
            const newEdge = {
                id: `${params.source}-${params.target}`,
                source: params.source,
                target: params.target,
                animated: true,
                type: 'operationConnection',
                markerEnd: {
                    type: MarkerType.ArrowClosed
                }
            }
            setEdges((eds) => addEdge(newEdge, eds))

            connectOperation(params.source, params.target)
            
        }, [setEdges]
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            const operationId = event.dataTransfer.getData("operationId")
            const operation = modifiedOperations.find(item => item.id == operationId)

            const position = reactFlowInstance.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });
            const newOperationNode = {
                id: `${operation.id}`,
                position,
                type: "operationNode",
                data: { operation: operation },
            };

            setNodes((nds) => nds.concat(newOperationNode));
            setOperationStackNodes((nds) => nds.filter(nd => nd.id != operation.id))
        },
        [reactFlowInstance, setNodes],
    );

    useEffect(() => {
        const initStackNode = modifiedOperations.map(operation => {
            return ({
                id: `${operation.id}`,
                type: 'operationNode',
                data: { operation: operation }
            })
        }, [])
        setOperationStackNodes(initStackNode)
    }, [])

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
                        onConnect={onConnect}
                        onInit={setReactFlowInstance}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        fitView
                    />
                </div>
                <OperationStack nodes={operationStackNodes} />
            </ReactFlowProvider>
        </div>
    );
};

export default RoutingFlowCreate;
