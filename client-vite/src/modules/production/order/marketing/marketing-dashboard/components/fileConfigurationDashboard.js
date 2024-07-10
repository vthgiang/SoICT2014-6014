// Config import example
export const configurationExampleTemplate = {
    sheets: {
        description: 'Tên các sheet',
        value: ['Thông tin ví dụ']
    },
    rowHeader: {
        description: 'Số dòng tiêu đề của bảng',
        value: 1
    },
    date: {
        columnName: 'date',
        description: 'date',
        value: 'date'
    },
    code: {
        columnName: 'code',
        description: 'code',
        value: 'code'
    },
    click: {
        columnName: 'click',
        description: 'click',
        value: 'click'
    },
    impression: {
        columnName: 'impression',
        description: 'impression',
        value: 'impression'
    },
    session: {
        columnName: 'session',
        description: 'session',
        value: 'session'
    },
    transaction: {
        columnName: 'transaction',
        description: 'transaction',
        value: 'transaction'
    },
    revenue: {
        columnName: 'revenue',
        description: 'revenue',
        value: 'revenue'
    },
    positiveRes: {
        columnName: 'positiveRes',
        description: 'positiveRes',
        value: 'positiveRes'
    },
    negativeRes: {
        columnName: 'negativeRes',
        description: 'negativeRes',
        value: 'negativeRes'
    },
    conversion: {
        columnName: 'conversion',
        description: 'conversion',
        value: 'conversion'
    },
    cost: {
        columnName: 'cost',
        description: 'cost',
        value: 'cost'
    },
}

// Dữliệu file export mẫu
export const importExampleTemplate = {
    fileName: 'campaign_effect_example',
    dataSheets: [
        {
            sheetName: 'Thông tin ví dụ',
            sheetTitle: 'Thông tin khách hàng thông qua tiếp thị',
            tables: [
                {
                    rowHeader: 1,
                    columns: [
                        { key: 'date', value: 'date' },
                        { key: 'code', value: 'code' },
                        { key: 'click', value: 'click' },
                        { key: 'impression', value: 'impression' },
                        { key: 'session', value: 'session' },
                        { key: 'transaction', value: 'transaction' },
                        { key: 'revenue', value: 'revenue' },
                        { key: 'positiveRes', value: 'positiveRes' },
                        { key: 'negativeRes', value: 'negativeRes' },
                        { key: 'conversion', value: 'conversion' },
                        { key: 'cost', value: 'cost' },
                    ],
                    data: [
                        {
                            date: "2021/01/06",
                            code: "001",
                            click: "1",
                            impression: "1",
                            session: "1",
                            transaction: "1",
                            revenue: "3",
                            positiveRes: "1200",
                            negativeRes: "0",
                            conversion: "0",
                            cost: "10",
                        },
                    ]
                }
            ]
        }
    ]
}
