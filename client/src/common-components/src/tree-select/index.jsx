import React, { Component } from 'react';
import SelectTree from "react-dropdown-tree-select";
import "./tree-select.css";
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import {convertArrayToTree} from '../../../helpers/arrayToTree';
class TreeSelect extends Component {
    constructor(props) {
        super(props);
        this.state = { 
         }
    }

    onChange = (currentNode, selectedNodes) => {
        console.log("selected: ", selectedNodes)
        const data = selectedNodes.map(node=>node._id);
        this.props.handleChange(data);
    };

    convertData = (array, value) => {
        let data = [];
        for (let i = 0; i < array.length; i++) {
            if(value.indexOf(array[i].id) > -1){
                data.push({
                    ...array[i],
                    checked: true
                })
            }else{
                data.push({
                    ...array[i],
                    checked: false
                })
            } 
        }

        return data;
    }

    render() { 
        /**
         * mode có 4 tùy chọn là 
         * 1. multiSelect - chọn phần tử cha mặc định đánh dấu luôn phần tử con
         * 2. hierarchical - chọn phần tử cha không đánh dấu phần tử con
         * 3. simpleSelect - chọn một node trong list - không có dạng cây
         * 4. radioSelect - chọn một node trong cây
         */
        const {mode, data=[], value=[]} = this.props;
        const getData = this.convertData(data, value);
        const tree = convertArrayToTree(getData);
        return ( <React.Fragment>
            <SelectTree
                data={tree}
                onChange={this.onChange}
                texts={{ placeholder: ' ' }}
                mode={mode}
                className="qlcv"
            />
        </React.Fragment> );
    }
}
 
const mapState = state => state;
const TreeSelectExport = connect(mapState, null)(withTranslate(TreeSelect));

export { TreeSelectExport as TreeSelect }