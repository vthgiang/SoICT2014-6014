import { BaseEdge, getBezierPath, useReactFlow, EdgeLabelRenderer } from "reactflow"

const OperationConnection = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd }
) => {
    const { setEdges } = useReactFlow();

    const [edgePath, labelX, labelY] = (getBezierPath({
        sourceX,
        sourceY,
        sourcePosition, 
        targetX,
        targetY,
        targetPosition
    }))

    const onEdgeClick = () => {
        setEdges((edges) => edges.filter((edge) => edge.id !== id));
    };

    return (
        <>
            <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
                        fontSize: 12,
                        pointerEvents: 'all'
                    }}
                    className="nodrag nopan"
                >
                    <button className="edgebutton" onClick={onEdgeClick}>
                        x
                    </button>
                </div>
            </EdgeLabelRenderer>
        </>
    )
}

export default OperationConnection
