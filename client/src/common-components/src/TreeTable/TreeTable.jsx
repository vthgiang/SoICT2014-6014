import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { treeTableShowChildren, treeTableHideChildren } from './tree-table';
import { DeleteNotification } from '../../../common-components';
import './TreeTable.css';
const arrayToTree = require('array-to-tree');

class TreeTable extends Component {
    constructor(props) {
        super(props);
    }

    componentDidUpdate() {
        if (this.props.data !== null && this.props.nameClass === "show-children") {
            window.$("#script-tree-table-show-children").remove();
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.id = "script-tree-table-show-children";
            script.innerHTML = treeTableShowChildren
            document.body.appendChild(script);
        }
        if (this.props.data !== null && this.props.nameClass === "hide-children") {
            window.$("#script-tree-table-show-children").remove();
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.id = "script-tree-table-hide-children";
            script.innerHTML = treeTableHideChildren
            document.body.appendChild(script);
        }
    }

    // function thực hiện format dữ liệu truyền vào
    dataTreetable = (column, setData) => {
        var keyColumn = column.map(col => col.key);
        var i = 0, data = [];

        // Đệ quy để thêm level tương ứng cho dữ liệu truyền vào
        let converData = (row, i) => {
            let newArr = [];
            i = i + 1;
            if (row !== undefined && row.length !== 0) {
                if (row.children === undefined || row.children === null) {
                    newArr = [...newArr, {
                        ...row,
                        "level": i,
                    }];
                    return newArr;
                } else {
                    newArr = [...newArr, {
                        ...row,
                        "level": i,
                    }];
                    for (let n in row.children) {
                        newArr = newArr.concat(converData(row.children[n], i));
                    }
                    return newArr
                }
            } else return null
        }
        // Chuyển đổi dữ liệu truyền vào thành dạng tree trước khi gọi đệ quy
        setData = arrayToTree(setData, {
            parentProperty: 'parent',
            customID: '_id'
        });
        // Gọi đệ quy để thêm level cho dữ liệu truyền vào
        for (let n in setData) {
            data = data.concat(converData(setData[n], i));
        }

        /* Xoá bỏ dữ liệu dư thừa, sắp xếp dữ liệu của data truyền vào theo thứ tự các cột 
         * Gộp nội dung cần hiện thị ở mỗi dòng của bảng thành 1 array với tên là row
        */
        for (let x in data) {
            let node = data[x], row = [];
            row = keyColumn.map(x => {
                for (let n in node) {
                    if (n === x) return node[n];
                }
            })
            data[x] = {
                "_id": node._id,
                "parent": node.parent,
                "action": node.action,
                "level": node.level,
                "row": row
            }
        }
        return data;
    }

    // function hiện thị các action tương ứng cho các dòng 
    showActionColumn = (data, id) => {
        var { titleAction } = this.props;
        switch (data) {
            case "edit":
                return <a href="#abc" onClick={() => this.props.funcEdit(id)} className="edit" data-toggle="modal" title={titleAction[0].edit}>
                    <i className="material-icons"></i>
                </a>
            case "view":
                return <a href="#abc" onClick={() => this.props.funcView(id)} data-toggle="modal" title={titleAction[0].view}>
                    <i className="material-icons">view_list</i>
                </a>
            case "delete":
                return <a href="#abc" onClick={() => this.props.funcDelete(id)} className="delete" title={titleAction[0].delete}>
                    <i className="material-icons"></i>
                </a>
            case "add":
                return <a href="#abc" onClick={() => this.props.funcAdđ(id)} className="add_circle" data-toggle="modal" title={titleAction[0].add}>
                    <i className="material-icons">add_circle</i>
                </a>
            case "save":
                return <a href="#abc" onClick={() => this.props.funcSave(id)} className="all_inbox" title={titleAction[0].save}>
                    <i className="material-icons">all_inbox</i>
                </a>
            case "startTimer":
                return <a href="#abc" onClick={() => this.props.funcStartTimer(id)} className="timer" title={titleAction[0].startTimer}>
                    <i className="material-icons">timer</i>
                </a>
            default:
                return null
        }
    }

    render() {
        var { translate, column, data } = this.props;
        return (
            <table id="tree-table" className="table table-striped table-hover table-bordered">
                <thead>
                    <tr id="task">
                        {column.length !== 0 && column.map((col, index) => <th key={index}>{col.name}</th>)}
                        <th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}</th>
                    </tr>
                </thead>
                <tbody id="taskTable" className="task-table">
                    {
                        this.dataTreetable(column, data).map((rows, index) => (
                            <tr key={index} data-id={rows._id} data-parent={rows.parent} data-level={rows.level}>
                                {
                                    rows.row.map((x, index) => index === 0 ?
                                        <td key={index} data-column="name">{x}</td> :
                                        <td key={index}>{x}</td>
                                    )
                                }
                                <td>
                                    {
                                        rows.action.map((x, index) => Array.isArray(x) ?
                                            <React.Fragment key={index}>
                                                <button type="button" data-toggle="collapse" data-target={`#actionTask${rows._id}`} style={{ border: "none", background: "none" }}><i className="fa fa-ellipsis-v"></i></button>
                                                <div id={`actionTask${rows._id}`} className="collapse">
                                                    {x.map((y, index) => (
                                                        <React.Fragment key={index}>
                                                            {this.showActionColumn(y, rows._id)}
                                                        </React.Fragment>
                                                    ))}
                                                </div>
                                            </React.Fragment> :
                                            <React.Fragment key={index}>
                                                {this.showActionColumn(x, rows._id)}
                                            </React.Fragment>
                                        )
                                    }
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table >
        );
    }
}

const mapState = state => state;
const treeTable = connect(mapState, null)(withTranslate(TreeTable));

export { treeTable as TreeTable }