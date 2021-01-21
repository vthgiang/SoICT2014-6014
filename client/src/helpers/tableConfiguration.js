import { getStorage } from '../config';
import { setStorage } from '../config';

export const getTableConfiguration = (tableId, defaultConfig) => {
    // check xem localStorage đã có tableConfiguration chưa
    const getTableConfiguration = getStorage("tableConfiguration");

    if (!JSON.parse(getTableConfiguration)) // chưa có thì set default ={}
        setStorage("tableConfiguration", JSON.stringify({}));
    
    // Kiểm tra xem bảng hiện tại có cấu hình chưa
    let getConfigCurrentPage = JSON.parse(getStorage("tableConfiguration"));

    if (!getConfigCurrentPage[tableId]) {
        console.log("vao day",getConfigCurrentPage)

        // Chưa có thì set mặc định: limit người dùng tự định nghĩa, hidden columns = []
        const limit = (defaultConfig && defaultConfig.limit) ? defaultConfig.limit : 5;
        const hiddenColumns = (defaultConfig && defaultConfig.hiddenColumns) ? defaultConfig.hiddenColumns : [];

        const data = { ...getConfigCurrentPage, [tableId]: {limit,hiddenColumns } }
        setStorage("tableConfiguration", JSON.stringify(data));
        return JSON.parse(getStorage("tableConfiguration"))[tableId];

    } else {
            return getConfigCurrentPage[tableId];
        }
} 

export const setTableConfiguration = (tableId, config) => { 
    const getConfig = JSON.parse(getStorage("tableConfiguration"));

    const data = { ...getConfig, [tableId]: config}
    setStorage('tableConfiguration', JSON.stringify(data));
}
