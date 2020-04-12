Component dùng để hiện thị datePicker của bootstrap-datePicker
Để sử dụng Componett này ta thực hiện các bước sau:
( Xem ví dụ minh hoạ trong Component SalaryEmpoyee.jsx trong modules/employees-manager/salary-employee/component)

<--- Import component -->
...
import { DatePicker } from '../../../../common-components';

<-- thêm nội dung sau vào class --> 
    ...
    // function khởi tạo state
    constructor(props) {
        super(props);
        this.state = {
            month: "",
        }
    }

    // function lưu giá trị datePicker vào state.month
    handleChange = (value) => {
        this.setState({
            ...this.state,
            month: value
        });
    }

<-- thêm nội dung sau vào nơi cần dùng datePicker --> 
    <DatePicker
        id="month"      
        dateFormat="month-year"             // sử dụng khi muốn hiện thị tháng - năm, mặc định là ngày-tháng-năm 
        value={}                            // giá trị mặc định cho datePicker    
        onChange={this.handleMonthChange}
        disabled={true}                     // sử dụng khi muốn disabled, mặc định là false
    />