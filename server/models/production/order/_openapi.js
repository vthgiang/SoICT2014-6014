const BankAccount = {
    type: "object",
    properties: {
        account: {//Số tài khoản
            type: 'string',
            required: true
        },
        owner: {//Chủ tài khoản
            type: 'string',
            required: true
        },
        bankName: {//Ngân hàng
            type: 'string',
            required: true
        },
        bankAcronym: {//Tên viết tắt ngân hàng
            type: 'string',
        },
        status: {//Trạng thái sử dụng
            type: 'boolean',
            required: true,
            default: false
        },
        creator: {//Người tạo
            type: 'string',
        },
    }
}

module.exports = {
    BankAccount
}