import React, { useEffect, useRef, useState, memo } from "react"
import { withTranslate } from "react-redux-multilingual";

import { DataTableSetting } from '../data-table-setting/dataTableSetting'

function SmartTable (props) {
    const { tableId, headTableData, bodyTableData = [], dataDependencies, columnArr } = props
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

        props.getDataCheck(results)
    }, [JSON.stringify(dataDependencies)])
    
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

        props.getDataCheck(results)

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

        props.getDataCheck(results)

        if (results?.length === bodyTableData?.length) {
            setCheckAll(true)
        } else {
            setCheckAll(false)
        }
    }

    let keys = Object.keys(headTableData)

    let columnArrData = []
    if (keys?.length > 0) {
        keys.map(item => {
            if (columnArr?.[item]) {
                columnArrData.push(columnArr[item])
            }
        })
    }
    columnArrData.unshift('selectAll')

    return (
        <React.Fragment>
            <DataTableSetting
                tableId={tableId}
                columnArr={columnArrData}
                setLimit={props.setLimit}
            />
            <table id={tableId} className="table table-striped table-bordered table-hover smart-table" data-toggle="checkboxes" data-range="true">
                <thead>
                    <tr key={`smart-table-head-${tableId}`}>
                        <th className="col-fixed" style={{ width: 60 }}>
                            <input type='checkbox' checked={checkAll} onChange={() => handleCheckAll()}></input>
                        </th>
                        { keys?.length > 0
                            && keys.map(item => headTableData?.[item])
                        }
                    </tr>
                </thead>
                <tbody className={`smart-table-body`}>
                    { bodyTableData?.length > 0 &&
                        bodyTableData.map((data, index) => (
                            <tr key={`smart-table-${tableId}${index}`}>
                                <td><input type='checkbox' defaultChecked={false} value={data?.id}></input></td>
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
export { connectedSmartTable as SmartTable}