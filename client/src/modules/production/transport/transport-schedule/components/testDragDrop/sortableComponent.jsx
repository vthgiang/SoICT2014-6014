import React, {useState, useEffect} from 'react';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
import './styleDragDrop.css';
const SortableItem = SortableElement(({value}) =>
    <div style={{margin: "10px"}}>{value}</div>

);

const SortableList = SortableContainer(({items}) => {
  return (
    <div className={"test1"}>
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} />
      ))}
    </div>
  );
});

function SortableComponent(prop) {
    const [state, setState] = useState({
        items: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6'],
    })
    const onSortEnd = ({oldIndex, newIndex}) => {
        setState({
        items: arrayMove(state.items, oldIndex, newIndex),
        });
    };
  
    return (<SortableList items={state.items} onSortEnd={onSortEnd} axis={"x"}/> );

}

export {SortableComponent}