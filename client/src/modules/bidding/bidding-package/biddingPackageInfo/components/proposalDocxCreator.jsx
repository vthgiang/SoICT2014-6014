import { AlignmentType, Document, HeadingLevel, WidthType, VerticalAlign, Table, TableCell, TableRow, LevelFormat, Paragraph, TabStopPosition, TabStopType, BorderStyle, TextRun, convertInchesToTwip } from "docx";

export const proposalDocxCreate = (proposal, listUsers) => {
    let document = new Document({
        styles: {
            default: {
                heading3: {
                    run: {
                        size: 28,
                        bold: true
                    },
                    paragraph: {
                        spacing: {
                            before: 240,
                            after: 120,
                        },
                    },
                },
                heading4: {
                    run: {
                        size: 26,
                        bold: true
                    },
                    paragraph: {
                        spacing: {
                            before: 220,
                            after: 100,
                        },
                    },
                },
            },
            paragraphStyles: [
                {
                    id: "decision",
                    name: "decision",
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
                            line: 276,
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
                            format: LevelFormat.LOWER_LETTER,
                            text: "%1)",
                            alignment: AlignmentType.LEFT,
                        },
                    ],
                },
            ],
        },
        sections: [
            {
                children: [
                    createHeading(`3. ĐỀ XUẤT KỸ THUẬT CHI TIẾT`, 3, "l"),
                    createHeading(`3.1. Phương pháp và nội dung thực hiện`, 4, "l"),
                    createText(``),
                    createText(``),
                    createText(``),
                    createText(``),

                    renderTask(proposal, listUsers),
                ]
            }
        ]
    });

    return document;
}

const renderTask = (proposal, listUsers) => {
    const tasks = proposal?.tasks ?? [];
    let rows = [
        new TableRow({
            children: [
                new TableCell({
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: `STT`,
                                    bold: true,
                                    size: 26,
                                })
                            ],
                            style: "decision",
                            alignment: AlignmentType.CENTER,
                        }),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 10, type: WidthType.PERCENTAGE },
                }),
                new TableCell({
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: `Nội dung`,
                                    bold: true,
                                    size: 26,
                                })
                            ],
                            style: "decision",
                            alignment: AlignmentType.CENTER,
                        }),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 45, type: WidthType.PERCENTAGE },
                }),
                new TableCell({
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: `Mô tả`,
                                    bold: true,
                                    size: 26,
                                })
                            ],
                            style: "decision",
                            alignment: AlignmentType.CENTER,
                        }),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 45, type: WidthType.PERCENTAGE },
                }),
            ],
        }),
    ];

    const fmTaskArr = tasks?.map((x, idx) => {
        return new TableRow({
            children: [
                new TableCell({
                    children: [
                        createText(`${idx + 1}`)
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 10, type: WidthType.PERCENTAGE },
                }),
                new TableCell({
                    children: [
                        createText(`${x.taskName}`),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 45, type: WidthType.PERCENTAGE },
                }),
                new TableCell({
                    children: [
                        createText(`${x.taskDescription}`),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 45, type: WidthType.PERCENTAGE },
                }),
            ],
        })
    });
    rows = [...rows, ...fmTaskArr];

    return new Table({
        rows: rows
    })
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
const createBullet = (text) => {
    return new Paragraph({
        text: text,
        bullet: {
            level: 0
        },
        style: "decision",
    });
}

const createText = (text) => {
    return new Paragraph({
        text: text,
        style: "decision",
    });
}


const createHeading = (text, heading = 3, alignment) => {
    let hd = HeadingLevel.HEADING_3;
    let al = AlignmentType.LEFT;

    if (alignment === "c") al = AlignmentType.CENTER;
    else if (alignment === "r") al = AlignmentType.RIGHT;
    else if (alignment === "l") al = AlignmentType.LEFT;

    if (heading === 0) hd = HeadingLevel.TITLE;
    else if (heading === 1) hd = HeadingLevel.HEADING_1;
    else if (heading === 2) hd = HeadingLevel.HEADING_2;
    else if (heading === 3) hd = HeadingLevel.HEADING_3;
    else if (heading === 4) hd = HeadingLevel.HEADING_4;
    else if (heading === 5) hd = HeadingLevel.HEADING_5;
    else if (heading === 6) hd = HeadingLevel.HEADING_6;

    return new Paragraph({
        text: text,
        heading: hd,
        alignment: al,
    });
}