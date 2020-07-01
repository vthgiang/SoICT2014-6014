import React, { Component } from 'react';
import SelectTree from "react-dropdown-tree-select";
import "./tree-select.css";
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class TreeSelect extends Component {
    constructor(props) {
        super(props);
        this.state = { 
         }
    }

    onChange = (currentNode, selectedNodes) => {
        const data = selectedNodes.map(node=>node._id);
        this.props.handleChange(data);
    };

    render() { 
        const {dataTree, } = this.props;
        return ( <React.Fragment>
            <SelectTree
                data={dataTree}
                onChange={this.onChange}
                texts={{ placeholder: ' ' }}
                className="search"
                simpleSelect={true}
            />
        </React.Fragment> );
    }
}
 
const mapState = state => state;
const TreeSelectExport = connect(mapState, null)(withTranslate(TreeSelect));

export { TreeSelectExport as TreeSelect }