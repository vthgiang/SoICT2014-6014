import React, { useState, useRef } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import './treeTable.css';
import _isEqual from 'lodash/isEqual';
import { DataTableSetting } from '../data-table-setting/dataTableSetting';

function TreeTable(props) {
    const { translate, column, data, actions = true, tableId = 'tree-table', tableSetting = false, rowPerPage = true, allowSelectAll = false, viewWhenClickName = false, funcEdit, funcView, titleAction, performtasks } = props;
    const lastChecked = useRef();
    const [state, setState] = useState({
        checkAll: false,
        selectedRows: []
    })
    const { checkAll, selectedRows } = state;

    let columnArr = column?.map(col => col.name);
    if (allowSelectAll) columnArr.unshift('selectAll');

    useDeepCompareEffect(() => {
        if (allowSelectAll) {
            // Cho phép sử dụng shift chọn nhiều check box
            window.$(`#${tableId}`).checkboxes('range', true);
            const checkBoxes = document.querySelectorAll('.tree-table-body input[type="checkbox"]');
            let results = []

            checkBoxes.forEach(checkbox => {
                // Bắt sự kiện click checkbox
                checkbox.addEventListener('click', onChangeCheckBox)
                if (checkbox.checked && checkbox.getAttribute("value")) {
                    results.push(checkbox.getAttribute("value"))
                }
            });

            if (!_isEqual(selectedRows, results)) {
                setState(state => {
                    return {
                        ...state,
                        selectedRows: results
                    }
                })
                props.onSelectedRowsChange(results)
            }
        }

        if (props.data !== null && props.behaviour === "show-children") {
            addScriptTreeTable(true);
        }

        if (props.data !== null && props.behaviour === "hide-children") {
            addScriptTreeTable(false);
        }
    }, [data.map(o => o.rawData)]);

    /**
     * Function thêm script cho tree table
     * @showChildren = true : hiện thị nút con
     * @showChildren = false : Ẩn nút con
     */
    const addScriptTreeTable = (showChildren = true) => {
        window.$(function () {
            let
                $table = window.$(`#${tableId}`),
                rows = $table.find('tr');

            rows.each(function (index, row) {
                let
                    $row = window.$(row),
                    level = parseInt($row[0].getAttribute('data-level')),
                    id = $row[0].getAttribute('data-id'),
                    $columnName = $row.find('td[data-column="name"]'),
                    children = $table.find('tr[data-parent="' + id + '"]')

                //  var tagSpan = $columnName.find("span").length;
                let div = window.$("<div/>").removeAttr("style").attr({
                    "style": "display: inline-block; margin-left: " + (15 + 30 * (level - 1)) + "px"
                })

                // Chức năng mở form view/edit khi bấm vào tên
                // Tắt chức năng này nếu viewWhenClickName khác true
                if (viewWhenClickName) {
                    if (funcEdit || funcView) {
                        let a = window.$("<a/>").text(`${$columnName.text()}`).click(() => {
                            funcEdit ? funcEdit(id) : funcView(id);
                        })
                        div.append(a);
                    }
                }
                else div.html($columnName.text());

                if (children.length) {
                    let expander = window.$('<span />').attr('class', `treegrid-expander glyphicon ${showChildren ? "glyphicon-chevron-down" : "glyphicon-chevron-right"}`).html('');
                    div.prepend(expander);

                    { showChildren ? children.show() : children.hide() }
                    expander.on('click', function (e) {
                        let $target = window.$(e.target);
                        if ($target.hasClass('glyphicon-chevron-right')) {
                            $target
                                .removeClass('glyphicon-chevron-right')
                                .addClass('glyphicon-chevron-down');

                            children.show();
                            reverseShow($table, $row);
                        } else {
                            $target
                                .removeClass('glyphicon-chevron-down')
                                .addClass('glyphicon-chevron-right');

                            reverseHide($table, $row);
                        }
                    });
                }
                $columnName.html('');
                $columnName.append(div);
            });

            // Reverse hide all elements
            const reverseHide = (table, element) => {
                let
                    $element = window.$(element),
                    id = $element.data('id'),
                    children = table.find('tr[data-parent="' + id + '"]');

                if (children.length) {
                    children.each(function (i, e) {
                        reverseHide(table, e);
                    });

                    $element
                        .find('glyphicon-chevron-down')
                        .removeClass('glyphicon-chevron-down')
                        .addClass('glyphicon-chevron-right');

                    children.hide();
                }
            };

            // Reverse show all elements
            const reverseShow = (table, element) => {
                let
                    $element = window.$(element),
                    id = $element.data('id'),
                    children = table.find('tr[data-parent="' + id + '"]');

                if (children.length) {
                    children.each(function (i, e) {
                        reverseShow(table, e);
                    });

                    $element
                        .find('.glyphicon-chevron-right')
                        .removeClass('glyphicon-chevron-right')
                        .addClass('glyphicon-chevron-down');

                    children.show();
                }
            };
        });
    }

    /**
     * Function thực hiện format dữ liệu truyền vào
     * @param {*} column : Dữ liệu cột của bảng
     * @param {*} data : Dữ liệu hiện thị trong bảng
     */
    const dataTreeTable = (column, data) => {
        let keyColumn = column.map(col => col.key);
        let newarr = [];

        let map = {};

        for (let i = 0; i < data.length; i++) {
            map[data[i]._id] = i + 1; // khởi tạo map
        }

        for (let i = 0; i < data.length; i++) {
            if (data[i].parent) {
                if (!map[data[i].parent]) data[i].parent = null; // nếu không tìm được cha trong danh sách thì coi như là null
            }
        }

        // Function chuyển đổi list thành tree 
        let listToTree = (items, parent_id = null, link = 'parent') =>
            items.filter(item => item[link] === parent_id).map(item => ({ ...item, children: listToTree(items, item._id) }));

        // Chuyển đổi dữ liệu truyền vào thành dạng tree trước khi gọi đệ quy
        let list1 = data;
        data = listToTree(data);

        let findData = (root, id) => {
            let queue = [];
            queue.push(root);

            while (queue.length !== 0) {
                let item = queue.pop();

                if (item._id === id) {
                    return true;
                }

                for (let k in item.children) {
                    queue.push(item.children[k]);
                }
            }
            return false;
        }

        // Thêm các công việc không tìm được cha vào mảng data
        let concatArray = [];
        for (let i in list1) {
            let flag = true;
            for (let j in data) {
                if (findData(data[j], list1[i]._id)) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                concatArray.push(list1[i]);
            }
        }
        data = data.concat(concatArray);

        // Function đệ quy để thêm level tương ứng cho dữ liệu truyền vào đã được chuyển thành dạnh tree
        // Trả vể mảng là dữ liệu trước khi thực hiện function listToTree và dữ liệu này đã được sắp xếp
        let convertData = (arr, level = 1) => {
            if (arr !== undefined) {
                arr.map(item => {
                    newarr.push({ ...item, "level": level });
                    convertData(item.children, level + 1);
                    return true;
                });
            }

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

    /**
     * Function hiển thị các action tương ứng cho các dòng
     * @param {*} data : Array tên các action của từng dòng
     * @param {*} id : Id dữ liệu tương ứng từng dòng, dùng để gọi server lấy dữ liệu
     */
    const showActionColumn = (data, id) => {
        switch (data) {
            case "edit":
                return <a style={{ cursor: 'pointer' }} onClick={() => props.funcEdit(id)} className="edit" data-toggle="modal" title={titleAction.edit}>
                    <i className="material-icons"></i>
                </a>
            case "view":
                return <a style={{ cursor: 'pointer' }} onClick={() => props.funcView(id)} data-toggle="modal" title={titleAction.view}>
                    <i className="material-icons">view_list</i>
                </a>
            case "delete":
                return <a style={{ cursor: 'pointer' }} onClick={() => props.funcDelete(id)} className="delete" title={titleAction.delete}>
                    <i className="material-icons"></i>
                </a>
            case "add":
                return <a style={{ cursor: 'pointer' }} onClick={() => props.funcAdd(id)} className="add_circle" data-toggle="modal" title={titleAction.add}>
                    <i className="material-icons">add_circle</i>
                </a>
            case "store":
                return <a style={{ cursor: 'pointer' }} onClick={() => props.funcStore(id)} className="all_inbox" title={titleAction.store}>
                    <i className="material-icons">all_inbox</i>
                </a>
            case "restore":
                return <a style={{ cursor: 'pointer' }} onClick={() => props.funcStore(id)} className="all_inbox" title={titleAction.restore}>
                    <i className="material-icons">restore_page</i>
                </a>
            case "startTimer":
                return <a
                    style={{ cursor: 'pointer' }}
                    onClick={() => !performtasks.currentTimer && props.funcStartTimer(id)}
                    className={`timer ${performtasks.currentTimer ? performtasks.currentTimer._id === id ? 'text-orange' : 'text-gray' : 'text-black'}`}
                    title={titleAction.startTimer}
                >
                    <i className="material-icons">timer</i>
                </a>
            default:
                return null
        }
    }

    const handleCheckAll = () => {
        const checkBoxes = document.querySelectorAll('.tree-table-body input[type="checkbox"]');
        let results = []

        checkBoxes.forEach(checkbox => {
            if (!checkAll) {
                checkbox.checked = true
                if (checkbox.checked && checkbox.getAttribute("value")) {
                    results.push(checkbox.getAttribute("value"))
                }
            } else {
                checkbox.checked = false
            }
        })

        setState(state => {
            return {
                ...state,
                checkAll: !checkAll,
                selectedRows: results
            }
        })
        props.onSelectedRowsChange(results)
    }

    const onChangeCheckBox = (e) => {
        const checkBoxes = document.querySelectorAll('.tree-table-body input[type="checkbox"]');
        let userChecksFlag = false;
        let userUnchecksFlag = false;

        if (e.shiftKey && e.target.checked) {   // Dùng shift chọn nhiều check box
            checkBoxes.forEach(checkbox => {
                if (checkbox === e.target || checkbox === lastChecked.current) {
                    userChecksFlag = !userChecksFlag;
                }
                if (userChecksFlag) {
                    checkbox.checked = true;
                }
            })
        } else if (e.shiftKey && !e.target.checked) {   // Dùng shift bỏ nhiều check box
            checkBoxes.forEach(checkbox => {
                if (checkbox === e.target || checkbox === lastChecked.current) {
                    userUnchecksFlag = !userUnchecksFlag;
                }
                if (userUnchecksFlag) {
                    checkbox.checked = false;
                }
            })
            lastChecked.current.checked = false;
        }
        lastChecked.current = e.target;

        let results = []

        // Cập nhật checked
        if (checkBoxes?.length > 0) {
            checkBoxes.forEach(checkbox => {
                if (checkbox.checked && checkbox.getAttribute("value")) {
                    results.push(checkbox.getAttribute("value"))
                }
            })

        }

        if (results?.length === props.data?.length && results?.length > 0) {
            setState(state => {
                return {
                    ...state,
                    checkAll: true,
                    selectedRows: results
                }
            })
        } else {
            setState(state => {
                return {
                    ...state,
                    checkAll: false,
                    selectedRows: results
                }
            })
        }

        props.onSelectedRowsChange(results)
    }

    return (
        <React.Fragment>
            {tableSetting ?
                rowPerPage ?
                    <DataTableSetting
                        tableId={tableId}
                        tableContainerId="tree-table-container"
                        tableWidth="1300px"
                        columnArr={columnArr}
                        setLimit={props.onSetNumberOfRowsPerPage}
                    /> :
                    <DataTableSetting
                        className="pull-right"
                        tableId={tableId}
                        tableContainerId="tree-table-container"
                        tableWidth="1300px"
                        columnArr={columnArr}
                        linePerPageOption={false}
                    /> : <div />
            }
            <table id={tableId} className="table table-striped table-hover table-bordered" style={{ marginBottom: 0 }}>
                <thead>
                    <tr id="tree" key={`tree-table-head-${tableId}`}>
                        {allowSelectAll &&
                            <th className="col-fixed not-sort" style={{ width: 45 }}>
                                <input type='checkbox' checked={checkAll && data.length > 0} onChange={() => handleCheckAll()}></input>
                            </th>
                        }
                        {column.length !== 0 && column.map((col, index) => <th key={index}>{col.name}</th>)}
                        {actions && <th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}</th>}
                    </tr>
                </thead>
                <tbody id="treeTable" className="tree-table-body">
                    {dataTreeTable(column, data).length > 0 ?
                        dataTreeTable(column, data).map((rows, index) => (
                            <tr key={index} data-id={rows._id} data-parent={rows.parent} data-level={rows.level}>
                                {allowSelectAll &&
                                    <td >
                                        <input type='checkbox' defaultChecked={false} value={rows._id}></input>
                                    </td>
                                }
                                {
                                    rows.row.map((x, index) => index === 0 ?
                                        <td key={index} data-column="name">{x}</td> :
                                        <td key={index}>{x}</td>
                                    )
                                }
                                {actions &&
                                    <td>
                                        {
                                            rows.action && rows.action.map((x, index) => Array.isArray(x) ?
                                                <React.Fragment key={index}>
                                                    <button type="button" data-toggle="collapse" data-target={`#actionTask${rows._id}`} style={{ border: "none", background: "none" }}><i className="fa fa-ellipsis-v"></i></button>
                                                    <div id={`actionTask${rows._id}`} className="collapse">
                                                        {x.map((y, index) => (
                                                            <React.Fragment key={index}>
                                                                {showActionColumn(y, rows._id)}
                                                            </React.Fragment>
                                                        ))}
                                                    </div>
                                                </React.Fragment> :
                                                <React.Fragment key={index}>
                                                    {showActionColumn(x, rows._id)}
                                                </React.Fragment>
                                            )
                                        }
                                    </td>
                                }
                            </tr>
                        )) : null
                    }
                </tbody>
            </table >
            {
                dataTreeTable(column, data).length === 0 && <div className="table-info-panel">{translate('confirm.no_data')}</div>
            }
        </React.Fragment>
    );
}

function mapState(state) {
    const { performtasks } = state;
    return { performtasks };
}

function areEqual(prevProps, nextProps) {
    let prevData = prevProps.data.map(o => o.rawData);
    let nextData = nextProps.data.map(o => o.rawData);
    return _isEqual(prevData, nextData);
}

const treeTable = React.memo(connect(mapState, null)(withTranslate(TreeTable)), areEqual);

export { treeTable as TreeTable }