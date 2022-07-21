import { AlignmentType, Document, HeadingLevel, WidthType, VerticalAlign, Table, TableCell, TableRow, LevelFormat, Paragraph, TabStopPosition, TabStopType, BorderStyle, TextRun, convertInchesToTwip } from "docx";

export const bidsDocxCreate = (bid, biddingConfig) => {
    let document = new Document({
        styles: {
            default: {
                heading3: {
                    run: {
                        size: 26,
                        bold: true
                    },
                    paragraph: {
                        spacing: {
                            before: 240,
                            after: 120,
                        },
                    },
                },
            },
            paragraphStyles: [
                {
                    id: "bid",
                    name: "bid",
                    basedOn: "Normal",
                    next: "Normal",
                    run: {
                        size: 26,
                    },
                    paragraph: {
                        // indent: {
                        //     left: convertInchesToTwip(0.5),
                        // },
                        spacing: {
                            // line: 276,
                            line: 276, before: 20 * 72 * 0.1, after: 20 * 72 * 0.05,
                        },
                    },
                },
                {
                    id: "wellSpaced",
                    name: "Well Spaced",
                    basedOn: "Normal",
                    quickFormat: true,
                    paragraph: {
                        spacing: { line: 276, before: 20 * 72 * 0.1, after: 20 * 72 * 0.05 },
                    },
                },
            ],
        },
        numbering: {
            config: [
                {
                    reference: "my-crazy-numbering",
                    levels: [
                        {
                            level: 0,
                            format: LevelFormat.UPPER_ROMAN,
                            text: "%1",
                            alignment: AlignmentType.START,
                            style: {
                                paragraph: {
                                    indent: { left: convertInchesToTwip(0.5), hanging: convertInchesToTwip(0.18) },
                                },
                            },
                        },
                        {
                            level: 1,
                            format: LevelFormat.DECIMAL,
                            text: "%2.",
                            alignment: AlignmentType.START,
                            style: {
                                paragraph: {
                                    indent: { left: convertInchesToTwip(1), hanging: convertInchesToTwip(0.68) },
                                },
                            },
                        },
                        {
                            level: 2,
                            format: LevelFormat.DECIMAL,
                            text: "%3.",
                            alignment: AlignmentType.START,
                            style: {
                                paragraph: {
                                    indent: { left: convertInchesToTwip(0.5), hanging: convertInchesToTwip(0.18) },
                                    // indent: { left: convertInchesToTwip(1.5), hanging: convertInchesToTwip(1.18) },
                                },
                            },
                        },
                        {
                            level: 3,
                            format: LevelFormat.UPPER_LETTER,
                            text: "%4)",
                            alignment: AlignmentType.START,
                            style: {
                                paragraph: {
                                    indent: { left: 2880, hanging: 2420 },
                                },
                            },
                        },
                    ],
                },
                {
                    reference: "my-unique-bullet-points",
                    levels: [
                        {
                            level: 0,
                            format: LevelFormat.BULLET,
                            text: "-", // u1F60
                            alignment: AlignmentType.LEFT,
                            style: {
                                paragraph: {
                                    indent: { left: convertInchesToTwip(0.5), hanging: convertInchesToTwip(0.25) },
                                },
                            },
                        },
                        {
                            level: 1,
                            format: LevelFormat.BULLET,
                            text: "\u00A5",
                            alignment: AlignmentType.LEFT,
                            style: {
                                paragraph: {
                                    indent: { left: convertInchesToTwip(1), hanging: convertInchesToTwip(0.25) },
                                },
                            },
                        },
                        {
                            level: 2,
                            format: LevelFormat.BULLET,
                            text: "\u273F",
                            alignment: AlignmentType.LEFT,
                            style: {
                                paragraph: {
                                    indent: { left: 2160, hanging: convertInchesToTwip(0.25) },
                                },
                            },
                        },
                        {
                            level: 3,
                            format: LevelFormat.BULLET,
                            text: "\u267A",
                            alignment: AlignmentType.LEFT,
                            style: {
                                paragraph: {
                                    indent: { left: 2880, hanging: convertInchesToTwip(0.25) },
                                },
                            },
                        },
                        {
                            level: 4,
                            format: LevelFormat.BULLET,
                            text: "\u2603",
                            alignment: AlignmentType.LEFT,
                            style: {
                                paragraph: {
                                    indent: { left: 3600, hanging: convertInchesToTwip(0.25) },
                                },
                            },
                        },
                    ],
                },
            ],
        },
        sections: [
            {
                children: [
                    new Paragraph({
                        text: "ĐƠN DỰ THẦU (1)",
                        heading: HeadingLevel.TITLE,
                        alignment: AlignmentType.CENTER,
                    }),

                    createText(``),
                    createText(``),
                    renderCustomTextInline(`Ngày: `, `${formatDate(Date.now())}`),
                    renderCustomTextInline(`Tên gói thầu: `, `${bid.name}`),
                    renderCustomTextInline(`Kính gửi: `, `${bid.customer}`),
                    createText(`Sau khi nghiên cứu E-HSMT, chúng tôi:`),
                    renderCustomTextInline(`- Tên nhà thầu: `, `${biddingConfig.company}`),
                    renderCustomTextInline(`- Số đăng ký kinh doanh: `, `${biddingConfig.taxCode}`),
                    renderCustomTextInline(`cam kết thực hiện gói thầu `, `${bid.name}`, ` với các thông tin như sau:`),
                    renderCustomTextInline(`- Số E-TBMT: `, `${bid.code}`),
                    renderCustomTextInline(`- Thời điểm đóng thầu: `, `${formatDate(bid.endDate)}`),

                    createText(`theo đúng yêu cầu nêu trong E-HSMT với tổng số tiền là cùng với các bảng tổng hợp giá dự thầu kèm theo. Ngoài ra, chúng tôi tự nguyện giảm giá dự thầu với tỷ lệ phần trăm giảm giá là %.`),
                    createText(`Giá dự thầu sau khi trừ đi giá trị giảm giá là: (Giảm đều cho tất cả các hạng mục chính theo tỷ lệ giảm giá đã chào (bao gồm chi phí dự phòng và các khoản tạm tính, nếu có)).`),

                    createText(`Thời gian thực hiện hợp đồng là ___.`),
                    createText(`Hiệu lực của E-HSDT: ___.`),

                    createText(`Chúng tôi cam kết: `),
                    createBulletNumber(`Chỉ tham gia trong một E-HSDT này với tư cách là nhà thầu chính hoặc đại diện liên danh trong trường hợp nhà thầu có liên danh.`),
                    createBulletNumber(`Không đang trong quá trình giải thể; không bị kết luận đang lâm vào tình trạng phá sản hoặc nợ không có khả năng chi trả theo quy định của pháp luật.`),
                    createBulletNumber(`Không vi phạm quy định về bảo đảm cạnh tranh trong đấu thầu.`),
                    createBulletNumber(`Không thực hiện các hành vi tham nhũng, hối lộ, thông thầu, cản trở và các hành vi vi phạm quy định khác của pháp luật đấu thầu khi tham dự gói thầu này.`),
                    createBulletNumber(`Những thông tin kê khai trong E-HSDT là trung thực. Nếu E-HSDT của chúng tôi được chấp nhận, chúng tôi sẽ thực hiện biện pháp bảo đảm thực hiện hợp đồng theo quy định tại Mục 37 E-CDNT của E-HSMT`),

                    createText(`Ghi chú:`),
                    createText(`(1) Đơn dự thầu đã được ký bằng chữ ký số của đại diện hợp pháp của nhà thầu khi nhà thầu nộp thầu qua mạng.`),

                    createText(``),
                    createText(``),

                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `Đại diện hợp pháp của nhà thầu`,
                                bold: true,
                                size: 26,
                            })
                        ],
                        style: "bid",
                        alignment: AlignmentType.RIGHT,
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `[Ghi tên, chức danh, ký tên và đóng dấu]`,
                                italics: true,
                                size: 26,
                            })
                        ],
                        style: "bid",
                        alignment: AlignmentType.RIGHT,
                    }),
                    createText(``),
                    createText(``),
                ]
            },
        ]
    });

    return document;
}

/**
 * Function format dữ liệu Date thành string
 * @param {*} date : Ngày muốn format
 * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
 */
const formatDateToString = (address = "Hà Nội", date, monthYear = false) => {
    if (date) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        if (monthYear === true) {
            return `${address}, tháng ${month} năm ${year}`;
        }
        // else return [day, month, year].join('-');
        else return `${address}, ngày ${day} tháng ${month} năm ${year}`;
    } else {
        return date
    }
}
const createBulletNumber = (text) => {
    return new Paragraph({
        children: [
            new TextRun({
                text: text,
                // italics: true
            })
        ],
        numbering: {
            reference: "my-crazy-numbering",
            level: 2,
        },
        style: "bid",
    });
}

const createText = (text) => {
    return new Paragraph({
        text: text,
        style: "bid",
    });
}

const renderCustomTextInline = (title, content, end = "") => {
    return new Paragraph({
        children: [
            new TextRun({
                text: `${title}`,
                size: 26
            }),
            new TextRun({
                text: content,
                bold: true,
                size: 26
            }),
            new TextRun({
                text: `${end}`,
                size: 26
            }),
        ],
        style: "bid",
    })
}

const formatDate = (date, monthYear = false) => {
    if (date) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        if (monthYear === true) {
            return [month, year].join('-');
        } else return [day, month, year].join('-');
    } else {
        return date;
    }
}