const OperationStack = ({ nodes }) => {
  const onDragStart = (event, operationId) => {
    event.dataTransfer.setData('operationId', operationId)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <aside>
      <div className='description'>Danh sách công đoạn</div>
      {nodes.map((node) => (
        <div 
          key={node.id} 
          className='dndnode' id={node.id} 
          onDragStart={(event) => onDragStart(event, node.data.operation.id)} 
          draggable
        >
          {node.data.operation.name}
        </div>
      ))}
    </aside>
  )
}

export default OperationStack
