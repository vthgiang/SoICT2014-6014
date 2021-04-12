import { sendRequest } from '../../../../../helpers/requestHelper';
// tùy vào cấp độ thư mục mà chỉnh lại đường dẫn tương đối cho đúng
export const exampleServices = {
    getExamples,
}

function getExamples(queryData) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/examples`,
            method: "GET",
            params: {
                exampleName: queryData !== undefined ?
                                       queryData.exampleName : "",
                page: queryData !== undefined ? queryData.page : null,
                limit: queryData !== undefined ? queryData.limit : null
            }
        },
         false, // Nếu có truy vấn thành công thì không hiện thông báo
         true, // Nếu có truy vấn thất bại thì hiện thông báo
         "manage_example"
    );
}
