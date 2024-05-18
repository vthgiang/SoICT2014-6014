import { Handle, Position } from "reactflow";
import machineImage from "/image/machine.png";
import workerImage from "/image/worker.png";

const OperationNode = ({ data, isConnectable }) => {
    return (
        <div className={`operation-node`}>
            <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
            <Handle type="source" position={Position.Right} isConnectable={isConnectable} />

            <div className="node-wrapper">
                <div className="node-header">{data.operation.name}</div>
                <div className="node-item_list">
                    {data.operation.machines?.map(item => (
                        <div className="node-item" key={item._id}>
                            <div className="node-item-wrapper">
                                <img className="node-item_image" src={machineImage} />
                                <span className="node-item_content">{item.machine.assetName}</span>
                            </div>
                        </div>
                    ))}
                    {data.operation.workers?.map(item => (
                        <div className="node-item" key={item._id}>
                            <div className="node-item-wrapper">
                                <img className="node-item_image" src={workerImage} />
                                <span className="node-item_content">{item.workerRole.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
            <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
        </div>
    )
}

export default OperationNode;
