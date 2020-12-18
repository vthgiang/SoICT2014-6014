import React, { Component } from 'react';
import SelectTree from "react-dropdown-tree-select";
import "./tree-select.css";
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { convertArrayToTree } from '../../../helpers/arrayToTree';
class TreeSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id || nextProps.data !== prevState.data) {
            return {
                id: nextProps.id,
                value: nextProps.value, // Lưu value ban đầu vào state
                data: nextProps.data,
            }
        } else {
            return null;
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.data !== this.props.data || nextProps.id !== this.state.id || nextProps.value !== nextState.value) // Chỉ render 1 lần, trừ khi id, value, data thay đổi
            return true;
        return false;  // Tự chủ động update (do đã lưu value vào state)
    }

    onChange = (currentNode, selectedNodes) => {
        const value = selectedNodes.map(node => node._id);

        this.setState(state => {
            return {
                ...state,
                value
            }
        });

        this.props.handleChange(value);
    };

    convertData = (array = [], value = []) => {
        let data = [];
        for (let i = 0; i < array.length; i++) {
            let index = array[i].id ? array[i].id : array[i]._id;
            if (value.indexOf(index) > -1) {
                data.push({
                    ...array[i],
                    checked: true
                })
            } else {
                data.push({
                    ...array[i],
                    checked: false
                })
            }
        }

        return data;
    }

    isFreshArray = (arr) => {
        if (!Array.isArray(arr)) return false;
        if (arr.length = 0) return false;
        let fresh = arr.some(node => !node);
        return !fresh;
    }

    render() {
        /**
         * mode có 4 tùy chọn là 
         * 1. multiSelect - chọn phần tử cha mặc định đánh dấu luôn phần tử con
         * 2. hierarchical - chọn phần tử cha không đánh dấu phần tử con
         * 3. simpleSelect - chọn một node trong list - không có dạng cây
         * 4. radioSelect - chọn một node trong cây
         */
        let { mode, data = [], value = [], placeholder = ' ', action, actionIcon } = this.props;
        let getData = this.convertData(data, value);
        let tree = convertArrayToTree(getData);
        let c = this.isFreshArray(value);

        placeholder = this.isFreshArray(value) ? placeholder : ' ';

        if (!action) {
            return (
                <React.Fragment>
                    <SelectTree
                        data={tree}
                        onChange={this.onChange}
                        texts={{ placeholder }}
                        mode={mode}
                        className="qlcv"
                    />
                </React.Fragment>
            )
        }
        else
            return (
                <div>
                    <SelectTree
                        data={tree}
                        onChange={this.onChange}
                        texts={{ placeholder }}
                        mode={mode}
                        className="qlcv"
                    />
                    <span style={{
                        padding: '5px',
                        cursor: 'pointer',
                        height: '34px',
                        width: '34px',
                        backgroundColor: '#f1f1f1',
                        position: 'absolute',
                        right: '34px',
                        border: '1px solid #D2D6DE',
                        justifyContent: 'center',
                    }} onClick={action}>
                        <a className="tree-select-action" title="Thêm dự án mới"><i style={{ fontSize: '24px' }} className="material-icons">post_add</i></a>
                    </span>
                </div>
            )
    }
}

const mapState = state => state;
const TreeSelectExport = connect(mapState, null)(withTranslate(TreeSelect));

export { TreeSelectExport as TreeSelect }