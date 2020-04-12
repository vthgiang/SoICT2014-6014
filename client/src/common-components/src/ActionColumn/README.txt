Component dùng để thiết lập cài đạt cho table 
Để sử dụng Componett này ta thực hiện các bước sau:
(Xem ví dụ minh hoạ trong Componett SalaryEmpoyee.jsx trong modules/employees-manager/salary-employee/component)

<--- Import component -->
...
import { ActionColumn } from '../../../../common-components';

<-- thêm nội dung sau vào class --> 
    ...
    componentDidUpdate() {
        this.hideColumn(); // thực hiện việc ẩn các cột khi load lại dữ liệu

    }

    // function thực hiện việc ẩn các cột được chọn
    hideColumn = () => {
        if (this.state.hideColumn.length !== 0) {
            var hideColumn = this.state.hideColumn;
            for (var j = 0, len = hideColumn.length; j < len; j++) {
                window.$(`#salary-table td:nth-child(` + hideColumn[j] + `)`).hide();
            }
        }
    }
    ...
    /* function setting table 
     * number là số dòng hiện thị trong một trang
     * hideColumn mảng các cột được ẩn ví dụ [1, 2]
     */
    setLimit = async (number, hideColumn) => {
        await this.setState({
            limit: parseInt(number),
            hideColumn: hideColumn
        });
        this.props.getListSalary(this.state); // function lấy dữ liệu 
    }

<-- với table ta cần áp dụng component này cần có một id  ví dụ như sau--> 
...
<div id="scroll-table">     // thêm vào khi muốn Scroll table
    <table id="salary-table">
        <thead>
            <tr>
            ...
                <th>
                <ActionColumn
                    tableId="salary-table"              // id của table
                    tableContainerId = "scroll-table"   // id của thể <div> (vùng chứa table)
                                                        // thêm vào khi muốn Scroll table 
                    tableWidth = "1300px"               // Độ rộng của bảng - dùng khi muốn Scroll table
                    columnArr={[                        // tên các cột của table
                        tên nhân viên,
                        mã nhân viên,
                    ]}
                    limit={this.state.limit}           // số dòng hiện thị trên 1 trang
                    setLimit={this.setLimit}           // function setting table 
                    hideColumnOption={true}             
                />
                </th>
            </tr>
        </thead>
        <tbody>
            <tr>
                /* nội dung của bảng 
                 * để thông báo bẳng không có dữ liệu dùng:
                 * <tr><th colSpan={7 - this.state.hideColumn.length}>
                 * <center> không có dữ liệu</center>
                 * </th></tr>
                 */ 7 trong colSpan={7 - this.state.hideColumn.length} là số cột của table
            </tr>
        </tbody>
    </table>
</div>