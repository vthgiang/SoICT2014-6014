Component này dùng để hiện thị table có dang cây (tre)
Để sử dụng Componett này ta thực hiện các bước sau:
(Ví dụ minh hoạ như Componett DepartmentManage.jsx trong modules/employees-manager/department-manager/component)

<--- Import component -->
...
import { TreeTable } from '../../../../common-components';

<-- thêm nội dung sau vào nơi cần dùng tree-table --> 
<TreeTable
    nameClass="show-children"      // hiện thị các <td></td> con, khi muốn ẩn các <td></td> sử dụng nameClass="hide-children" 
    column={column}                // dữ liệu tên cột của table, có kiểu dữu liệu như bên dưới
    data={data}                    // dữ liệu của table, có kiểu dữ liệu như bên dưới
    
    /* Đây là các title của các action ở cột cuối cùng của table
     * bảng có các action: edit, view, save, add, delete, startTimer
     * Ta có thể thay đổi title action như sau: delete:"Xoá dữ liệu"
     * Sử dụng action nào thi thêm title tương ứng vào 
    */
    titleAction={[{                
        edit: "chỉnh sửa",         
        view: "Xem thông tin",      
        save: "lưu thông tin",
        add: "Thêm thông tin",
    }]}

    /*
     * Đây là các function bắt sự kiện onclick cho các action tương ứng
     * có các function: funcEdit, funcStartTimer, funcView, funcSave, funcDelete, funcAdd
     * Sử dụng action nào thì thêm function tương ứng vào
    */
    funcEdit={this.handleShowEdit}
    // funcStartTimer={this.handleShowStart}
    
/>
<------------------------------------------------->
<-- kiểu dữ liệu của column có dạng:--->
    /*
     * name : là tên các cột của table
     * các Key là các khoá tương ướng với tên trường dữ liệu truyền vào ở data
     * chú ý: các json trong column tương ứng với tên cột được hiện thị
    */
    column = [
        { name: "Tên đơn vị", key: "name" },
        { name: "Mô tả đơn vị", key: "description" }
        ];

<-- kiểu dữ liệu của data có dạng:-->
    /* 
     * action array chứa các action tương ứng cho các <div class="row">
     * Với trường hợp nhiều action ta có thể dùng collapse để gộp các action lại, khi đó
     * ta truyền các action muốn gộp vào array và nên để cuối của array action. ví dụ:  
     * action: ["edit", "view", ["delete","save"]]
    */
    data = [
        {
            _id: "1",
            name: "Phong hanh chinh",
            description: "mô tả phong hanh chinh",
            action: ["edit", "view", "delete"],
            parent: null,
        }, {
            _id: "2",
            description: "mo ta ban giam doc",
            name: "ban gia doc",
            action: ["edit", "view", "delete"],
            parent: 1,
        }, {
            _id: "3",
            description: "mo ta phong kinh doanh",
            name: " phong kinh doanh",
            action: ["edit", "view", "delete"],
            parent: null,
        }
    ];
