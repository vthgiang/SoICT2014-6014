import React, { useEffect, useRef, useState, memo } from "react"
import { withTranslate } from "react-redux-multilingual";

import { DataTableSetting } from '../data-table-setting/dataTableSetting'

function SmartTable(props) {
    const { tableId, tableHeaderData, tableBodyData = [], dataDependency, columnData, disableCheckbox } = props
    const [checkAll, setCheckAll] = useState(false)
    const lastChecked = useRef()

    useEffect(() => {
        // Cho phép sử dụng shift chọn nhiều check box
        window.$(`#${tableId}`).checkboxes('range', true);

        const checkBoxes = document.querySelectorAll('.smart-table-body input[type="checkbox"]');
        let results = []

        checkBoxes.forEach(checkbox => {
            // Bắt sự kiện click checkbox
            checkbox.addEventListener('click', onChangeCheckBox)
            if (checkbox.checked && checkbox.getAttribute("value")) {
                results.push(checkbox.getAttribute("value"))
            }
        });

        props.onSelectedRowsChange(results)
    }, [JSON.stringify(dataDependency)])

    const handleCheckAll = () => {
        const checkBoxes = document.querySelectorAll('.smart-table-body input[type="checkbox"]');
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

        props.onSelectedRowsChange(results)

        setCheckAll(!checkAll)
    }

    const onChangeCheckBox = (e) => {
        const checkBoxes = document.querySelectorAll('.smart-table-body input[type="checkbox"]');
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

        props.onSelectedRowsChange(results)

        if (results?.length === tableBodyData?.length) {
            setCheckAll(true)
        } else {
            setCheckAll(false)
        }
    }

    let keys = Object.keys(tableHeaderData)

    let columnArr = []
    if (keys?.length > 0) {
        keys.map(item => {
            if (columnData?.[item]) {
                columnArr.push(columnData[item])
            }
        })
    }
    columnArr.unshift('selectAll')

    return (
        <React.Fragment>
            <DataTableSetting
                tableId={tableId}
                columnArr={columnArr}
                setLimit={props.onSetNumberOfRowsPerpage}
            />
            <table id={tableId} className="table table-striped table-bordered table-hover smart-table" data-toggle="checkboxes" data-range="true">
                <thead>
                    <tr key={`smart-table-head-${tableId}`}>
                        {!disableCheckbox &&
                            <th className="col-fixed not-sort" style={{ width: 45 }}>
                                <input type='checkbox' checked={checkAll} onChange={() => handleCheckAll()}></input>
                            </th>
                        }
                        {keys?.length > 0
                            && keys.map(item => tableHeaderData?.[item])
                        }
                    </tr>
                </thead>
                <tbody className={`smart-table-body`}>
                    {tableBodyData?.length > 0 &&
                        tableBodyData.map((data, index) => (
                            <tr key={`smart-table-${tableId}${index}`}>
                                {!disableCheckbox &&
                                    <td><input type='checkbox' defaultChecked={false} value={data?.id}></input></td>
                                }
                                {keys?.length > 0
                                    && keys.map(item => data?.[item])
                                }
                            </tr>
                        )
                        )}
                </tbody>
            </table>
        </React.Fragment>
    )
}

const connectedSmartTable = withTranslate(memo(SmartTable))
export { connectedSmartTable as SmartTable }