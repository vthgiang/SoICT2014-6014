import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { treeTableShowChildren, treeTableHideChildren } from './tree-table';
import './TreeTable.css';

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
    dataTreetable = (column, data) => {
        var keyColumn = column.map(col => col.key);
        var newarr = [];
        // function chuyển đổi list thành tree 
        let listToTree = (items, parent_id = null, link = 'parent') =>
            items.filter(item => item[link] === parent_id).map(item => ({ ...item, children: listToTree(items, item._id) }));

        // Chuyển đổi dữ liệu truyền vào thành dạng tree trước khi gọi đệ quy
        data = listToTree(data);

        // function đệ quy để thêm level tương ứng cho dữ liệu truyền vào đã được chuyển thành dạnh tree
        // trả vể mảng là dữ liệu trước khi thực hiện function listToTree và dữ liệu này đã được sắp xếp
        let convertData = (arr, level = 1) => {
            arr.map(item => {
                newarr.push({ ...item, "level": level });
                convertData(item.children, level + 1);
                return true;
            });
            return newarr;
        }
        // Gọi đệ quy để thêm level cho dữ liệu truyền vào
        data = convertData(data);

        // Xoá bỏ dữ liệu dư thừa, sắp xếp dữ liệu của data truyền vào theo thứ tự các cột 
        // Gộp nội dung cần hiện thị ở mỗi dòng của bảng thành 1 array với tên là row
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
const treeTable = connect(null, null)(withTranslate(TreeTable));

export { treeTable as TreeTable }