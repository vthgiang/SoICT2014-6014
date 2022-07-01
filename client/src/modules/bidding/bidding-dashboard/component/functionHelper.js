export const genStepAuto = (bid, contracts) => {
    const { status, hasContract, _id } = bid;
    const ct = contracts.find(x => x.biddingPackage?._id === _id);
    const prj = ct?.project;

    // 1: hoạt động, 0: ngưng hoạt động, 2: đang chờ kết quả dự thầu, 3: Đang thực hiện gói thầu, 4:hoàn thành
    let stepState = { // 0: ngưng hoạt động,
        currentStep: -1,
        steps: [
            {
                label: "Tìm kiếm HSMT",
                active: false,
            },
            {
                label: "Tạo HSDT",
                active: false,
            },
            {
                label: "Tạo hợp đồng",
                active: false,
            },
            {
                label: "Thực hiện dự án",
                active: false,
            },
            {
                label: "Kết Tthúc DA - TLHĐ",
                active: false,
            },
        ]
    }

    if (status === 1) { // hoạt động: gói thầu đã tìm kiếm, chuẩn bị làm HSDT
        return {
            currentStep: 0,
            steps: [
                {
                    label: "Tìm kiếm HSMT",
                    active: true,
                },
                {
                    label: "Tạo HSDT",
                    active: false,
                },
                {
                    label: "Tạo hợp đồng",
                    active: false,
                },
                {
                    label: "Thực hiện dự án",
                    active: false,
                },
                {
                    label: "Kết Tthúc DA - TLHĐ",
                    active: false,
                },
            ]
        }
    }
    else if (status === 2) { // chờ kết quả dự thầu: gói thầu đã tìm kiếm, đã nộp HSDT, đang chờ kq dự thầu
        return {
            currentStep: 1,
            steps: [
                {
                    label: "Tìm kiếm HSMT",
                    active: true,
                },
                {
                    label: "Tạo HSDT",
                    active: true,
                },
                {
                    label: "Tạo hợp đồng",
                    active: false,
                },
                {
                    label: "Thực hiện dự án",
                    active: false,
                },
                {
                    label: "Kết Tthúc DA - TLHĐ",
                    active: false,
                },
            ]
        }
    }
    else if (status === 3) { // gói thầu đang thực hiện: chia làm 2 bước: tạo hợp đồng - thực hiện dự án
        if (hasContract || prj) {
            return { // đã tạo dự án -> bắt đầu thực hiện dự án || chưa tạo dự án, nhưng đã có hợp đồng => cbi tạo dự án
                currentStep: 3,
                steps: [
                    {
                        label: "Tìm kiếm HSMT",
                        active: true,
                    },
                    {
                        label: "Tạo HSDT",
                        active: true,
                    },
                    {
                        label: "Tạo hợp đồng",
                        active: true,
                    },
                    {
                        label: "Thực hiện dự án",
                        active: true,
                    },
                    {
                        label: "Kết Tthúc DA - TLHĐ",
                        active: false,
                    },
                ]
            }
        }
        else return { // chưa có hợp đồng -> cần tạo hợp đồng
            currentStep: 2,
            steps: [
                {
                    label: "Tìm kiếm HSMT",
                    active: true,
                },
                {
                    label: "Tạo HSDT",
                    active: true,
                },
                {
                    label: "Tạo hợp đồng",
                    active: true,
                },
                {
                    label: "Thực hiện dự án",
                    active: false,
                },
                {
                    label: "Kết Tthúc DA - TLHĐ",
                    active: false,
                },
            ]
        }
    }
    else if (status === 4) { // hoàn thành => kết thúc dự án, thanh lý hợp đồng
        return {
            currentStep: 4,
            steps: [
                {
                    label: "Tìm kiếm HSMT",
                    active: true,
                },
                {
                    label: "Tạo HSDT",
                    active: false,
                },
                {
                    label: "Tạo hợp đồng",
                    active: true,
                },
                {
                    label: "Thực hiện dự án",
                    active: true,
                },
                {
                    label: "Kết Tthúc DA - TLHĐ",
                    active: true,
                },
            ]
        }
    }
    return stepState
}