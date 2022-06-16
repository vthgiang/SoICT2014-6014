import { AlignmentType, Document, HeadingLevel, WidthType, VerticalAlign, Table, TableCell, TableRow, LevelFormat, Paragraph, TabStopPosition, TabStopType, BorderStyle, TextRun, convertInchesToTwip } from "docx";
import { convertUserIdToUserName } from "../../../project/projects/components/functionHelper";

export const decisionDocxCreate = (contract, listUsers) => {
    console.log(55555555555555, contract);
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
                            // line: 276,
                            line: 276, before: 20 * 72 * 0.1, after: 20 * 72 * 0.05
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
                    renderHeaderTitle(contract),
                    createText(``),
                    createText(``),
                    new Paragraph({
                        text: "QUYẾT ĐỊNH",
                        heading: HeadingLevel.TITLE,
                        alignment: AlignmentType.CENTER,
                    }),
                    new Paragraph({
                        text: `V/v: Giao nhiệm vụ triển khai thực hiện Hợp đồng số ${contract?.code}`,
                        style: "decision",
                        alignment: AlignmentType.CENTER,
                    }),
                    new Paragraph({
                        text: `Gói thầu: "${contract?.biddingPackage?.name}"`,
                        style: "decision",
                        alignment: AlignmentType.CENTER,
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `${contract?.representativeRoleB} ${contract?.companyB}`,
                                allCaps: true,
                            })
                        ],
                        style: "decision",
                        alignment: AlignmentType.CENTER,
                    }),

                    // new Paragraph({
                    //     text: formatDateToString("Hà Nội", Date.now()),
                    //     alignment: AlignmentType.RIGHT,
                    //     style: "decision",
                    // }),
                    createText(``),
                    createText(``),

                    createBullet(`Căn cứ vào Điều lệ tổ chức và hoạt động của ${contract.companyB};`),
                    createBullet(`Căn cứ vào yêu cầu hoạt động kinh doanh; `),
                    createBullet(`Căn cứ vào nội dung Hợp đồng số ${contract?.code}`),
                    createBullet(`Căn cứ Quyết định số _____ ngày ___ tháng ___ năm _____ của ____ về việc phê duyệt kết quả lựa chọn nhà thầu gói thầu ${contract?.biddingPackage.name} và thông báo kết quả lựa chọn nhà thầu số ___ ngày ___ tháng ___ năm _____ của bên mời thầu`),
                    createBullet(`Xét năng lực và phẩm chất cán bộ.`),
                    createText(``),
                    createText(``),

                    new Paragraph({
                        text: "QUYẾT ĐỊNH",
                        style: "decision",
                        alignment: AlignmentType.CENTER,
                    }), ,


                    createHeading("Điều 1.", 3, "l"),
                    createText(`Giao cho Ông/Bà ${contract?.decideToImplement.projectManager?.map(userItem => convertUserIdToUserName(listUsers, userItem)).join(', ')} phụ trách triển khai thực hiện hợp đồng "${contract?.name}" số ${contract?.code} ký ngày ${contract?.createdDate} giữa ${contract?.companyB} và ${contract?.companyA}.`),
                    createText(`(1) Ông/Bà ${contract?.decideToImplement.projectManager?.map(userItem => convertUserIdToUserName(listUsers, userItem)).join(', ')} có trách nhiệm thực hiện đầy đủ các công việc sau: `),
                    createBullet(`Lập kế hoạch và phân công công việc chi tiết cho từng thành viên trong nhóm để đảm bảo chất lượng và tiến độ dự án theo đúng hợp đồng ký kết; đề xuất và thực hiện phương án thuê chuyên gia, thiết bị chuyên dùng thực hiện hợp đồng, đảm bảo hiệu quả, đúng quy định pháp luật.`),
                    createBullet(`Chủ trì theo dõi, cùng với các thành viên thực hiện và hoàn thành các nhiệm vụ theo đúng yêu cầu hợp đồng, phù hợp với kế hoạch, tiến độ hợp đồng ký kết với khách hàng.`),
                    createBullet(`Giám sát chất lượng, kiểm tra đánh giá chất lượng sản phẩm trước khi bàn giao, chịu trách nhiệm về chất lượng sản phẩm bàn giao cho khách hàng.`),
                    createText(`(2)	Báo cáo Giám đốc khi có các vấn đề phát sinh ảnh hưởng đến chất lượng, tiến độ của việc thực hiện hợp đồng. Đề xuất và thực hiện các điều chỉnh cần thiết phù hợp với thực tế triển khai. `),

                    createHeading(`Điều 2.`, 3, "l"),
                    createText(`Các thành viên tham gia thực hiện và chức danh tham gia dự án chi tiết tại Phụ lục đính kèm.`),

                    createHeading(`Điều 3.`, 3, "l"),
                    createText(`Quyết định có hiệu lực từ ngày ký. Ban Giám đốc, Ông/Bà ${contract?.decideToImplement.projectManager?.map(userItem => convertUserIdToUserName(listUsers, userItem)).join(', ')} và các thành viên có tên trong danh sách tham gia thực hiện dự án có trách nhiệm thi hành Quyết định này`),


                    createText(``),
                    createText(``),

                    createSignature(contract, listUsers),
                ]
            },
            {
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `PHỤ LỤC 01: DANH SÁCH THÀNH VIÊN THAM GIA TRIỂN KHAI ${contract?.name}`,
                                allCaps: true,
                            })
                        ],
                        style: "decision",
                        alignment: AlignmentType.CENTER,
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `(Kèm theo quyết định số _______________ ngày ____ tháng ____ năm ______ )`,
                            })
                        ],
                        style: "decision",
                        alignment: AlignmentType.CENTER,
                    }),
                    createText(``),
                    // new Paragraph({
                    //     children: [
                    //         renderTableMember(contract, listUsers),
                    //     ],
                    //     style: "decision",
                    //     alignment: AlignmentType.CENTER,
                    // }),
                    renderTableMember(contract, listUsers),
                ]
            }
        ]
    });

    return document;
}

const renderHeaderTitle = (contract) => {
    return new Table({
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: `${contract?.companyB}`,
                                        bold: true,
                                        size: 26,
                                        color: "808080"
                                    }),
                                ],
                                style: "decision",
                                alignment: AlignmentType.CENTER
                            }),
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: `__________________`,
                                        bold: true,
                                        size: 26,
                                        color: "808080"
                                    }),
                                ],
                                style: "decision",
                                alignment: AlignmentType.CENTER
                            }),
                            // createText(``),
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: `Số: _____________`,
                                        size: 26,
                                        color: "808080"
                                    }),
                                ],
                                style: "decision",
                                alignment: AlignmentType.CENTER
                            }),
                        ],
                        verticalAlign: VerticalAlign.CENTER,
                        width: { size: 45, type: WidthType.PERCENTAGE },
                        borders: {
                            top: {
                                style: BorderStyle.NONE,
                                size: 1,
                            },
                            bottom: {
                                style: BorderStyle.NONE,
                                size: 1,
                            },
                            left: {
                                style: BorderStyle.NONE,
                                size: 1,
                            },
                            right: {
                                style: BorderStyle.NONE,
                                size: 1,
                            }
                        },
                    }),
                    new TableCell({
                        children: [],
                        width: { size: 10, type: WidthType.PERCENTAGE },
                        borders: {
                            top: {
                                style: BorderStyle.NONE,
                                size: 1,
                            },
                            bottom: {
                                style: BorderStyle.NONE,
                                size: 1,
                            },
                            left: {
                                style: BorderStyle.NONE,
                                size: 1,
                            },
                            right: {
                                style: BorderStyle.NONE,
                                size: 1,
                            }
                        },
                    }),
                    new TableCell({
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: `CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM`,
                                        bold: true,
                                        size: 26,
                                        color: "808080"
                                    }),
                                ],
                                style: "decision",
                                alignment: AlignmentType.CENTER
                            }),
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: `Độc lập - Tự do - Hạnh phúc`,
                                        bold: true,
                                        size: 26,
                                        color: "808080"
                                    }),
                                ],
                                style: "decision",
                                alignment: AlignmentType.CENTER
                            }),
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: `__________________`,
                                        bold: true,
                                        size: 26,
                                        color: "808080"
                                    }),
                                ],
                                style: "decision",
                                alignment: AlignmentType.CENTER
                            }),
                            // createText(``),
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: `${formatDateToString("Hà Nội", Date.now())}`,
                                        bold: true,
                                        size: 26,
                                        color: "808080"
                                    }),
                                ],
                                style: "decision",
                                alignment: AlignmentType.CENTER
                            }),
                        ],
                        verticalAlign: VerticalAlign.CENTER,
                        width: { size: 45, type: WidthType.PERCENTAGE },
                        borders: {
                            top: {
                                style: BorderStyle.NONE,
                                size: 1,
                            },
                            bottom: {
                                style: BorderStyle.NONE,
                                size: 1,
                            },
                            left: {
                                style: BorderStyle.NONE,
                                size: 1,
                            },
                            right: {
                                style: BorderStyle.NONE,
                                size: 1,
                            }
                        },
                    }),
                ],
            }),
        ]
    })
}

const renderTableMember = (contract, listUsers) => {
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
                                    text: `Họ và tên`,
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
                                    text: `Chức vụ`,
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

    const pmArr = contract?.decideToImplement?.projectManager?.map((x, idx) => {
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
                        createText(`${convertUserIdToUserName(listUsers, x)}`),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 45, type: WidthType.PERCENTAGE },
                }),
                new TableCell({
                    children: [
                        createText(`Quản lý dự án`),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 45, type: WidthType.PERCENTAGE },
                }),
            ],
        })
    });
    rows = [...rows, ...pmArr];

    const resArr = contract?.decideToImplement?.responsibleEmployees?.map((x, idx) => {
        const numOfManager = contract?.decideToImplement?.projectManager?.length;
        return new TableRow({
            children: [
                new TableCell({
                    children: [
                        createText(`${numOfManager + idx + 1}`)
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 10, type: WidthType.PERCENTAGE },
                }),
                new TableCell({
                    children: [
                        createText(`${convertUserIdToUserName(listUsers, x)}`),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 45, type: WidthType.PERCENTAGE },
                }),
                new TableCell({
                    children: [
                        createText(`Thành viên dự án`),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 45, type: WidthType.PERCENTAGE },
                }),
            ],
        })
    });
    rows = [...rows, ...resArr];

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

const createSignature = (contract, listUsers) => {
    // console.log(161, contract);
    return new Table({
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: `Nơi nhận:`,
                                        italics: true,
                                        size: 26,
                                    })
                                ]
                            }),
                            createBullet(`Như điều 3`),
                            createBullet(`Lưu: Văn thư.`),
                        ],
                        verticalAlign: VerticalAlign.CENTER,
                        width: { size: 45, type: WidthType.PERCENTAGE },
                        borders: {
                            top: {
                                style: BorderStyle.NONE,
                                size: 1,
                            },
                            bottom: {
                                style: BorderStyle.NONE,
                                size: 1,
                            },
                            left: {
                                style: BorderStyle.NONE,
                                size: 1,
                            },
                            right: {
                                style: BorderStyle.NONE,
                                size: 1,
                            }
                        },
                    }),
                    new TableCell({
                        children: [],
                        width: { size: 15, type: WidthType.PERCENTAGE },
                        borders: {
                            top: {
                                style: BorderStyle.NONE,
                                size: 1,
                            },
                            bottom: {
                                style: BorderStyle.NONE,
                                size: 1,
                            },
                            left: {
                                style: BorderStyle.NONE,
                                size: 1,
                            },
                            right: {
                                style: BorderStyle.NONE,
                                size: 1,
                            }
                        },
                    }),
                    new TableCell({
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: `GIÁM ĐỐC`,
                                        bold: true,
                                        size: 26,
                                    })
                                ],
                                alignment: AlignmentType.CENTER
                            }),
                            createText(``),
                            createText(``),
                            createText(``),
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: `${contract?.representativeNameB}`,
                                        bold: true,
                                        size: 26,
                                        allCaps: true,
                                    })
                                ],
                                alignment: AlignmentType.CENTER
                            }),
                        ],
                        verticalAlign: VerticalAlign.CENTER,
                        width: { size: 40, type: WidthType.PERCENTAGE },
                        borders: {
                            top: {
                                style: BorderStyle.NONE,
                                size: 1,
                            },
                            bottom: {
                                style: BorderStyle.NONE,
                                size: 1,
                            },
                            left: {
                                style: BorderStyle.NONE,
                                size: 1,
                            },
                            right: {
                                style: BorderStyle.NONE,
                                size: 1,
                            }
                        },
                    }),
                ],
            }),
            emptyRow(),
            emptyRow(),
            emptyRow(),
            new TableRow({
                children: [
                    new TableCell({
                        children: [
                            new Paragraph({
                                text: formatDateToString("Hà Nội", Date.now()),
                                // alignment: AlignmentType.RIGHT,
                                style: "decision",
                            }),
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: `Người nhận nhiệm vụ`,
                                        bold: true,
                                        size: 26,
                                    })
                                ],
                                alignment: AlignmentType.CENTER
                            }),
                            createText(``),
                            createText(``),
                            createText(``),

                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: `${contract?.decideToImplement.projectManager?.map(userItem => convertUserIdToUserName(listUsers, userItem)).join(', ')}`,
                                        bold: true,
                                        size: 26,
                                    })
                                ],
                                alignment: AlignmentType.CENTER
                            }),

                        ],
                        verticalAlign: VerticalAlign.CENTER,
                        width: { size: 40, type: WidthType.PERCENTAGE },
                        borders: {
                            top: {
                                style: BorderStyle.NONE,
                                size: 1,
                            },
                            bottom: {
                                style: BorderStyle.NONE,
                                size: 1,
                            },
                            left: {
                                style: BorderStyle.NONE,
                                size: 1,
                            },
                            right: {
                                style: BorderStyle.NONE,
                                size: 1,
                            }
                        },
                    }),
                    new TableCell({
                        children: [],
                        width: { size: 15, type: WidthType.PERCENTAGE },
                        borders: {
                            top: {
                                style: BorderStyle.NONE,
                                size: 1,
                            },
                            bottom: {
                                style: BorderStyle.NONE,
                                size: 1,
                            },
                            left: {
                                style: BorderStyle.NONE,
                                size: 1,
                            },
                            right: {
                                style: BorderStyle.NONE,
                                size: 1,
                            }
                        },
                    }),
                    new TableCell({
                        children: [],
                        verticalAlign: VerticalAlign.CENTER,
                        width: { size: 45, type: WidthType.PERCENTAGE },
                        borders: {
                            top: {
                                style: BorderStyle.NONE,
                                size: 1,
                            },
                            bottom: {
                                style: BorderStyle.NONE,
                                size: 1,
                            },
                            left: {
                                style: BorderStyle.NONE,
                                size: 1,
                            },
                            right: {
                                style: BorderStyle.NONE,
                                size: 1,
                            }
                        },
                    }),
                ],
            }),
        ]
    })
}

const emptyRow = () => {
    return new TableRow({
        children: [
            new TableCell({
                children: [],
                verticalAlign: VerticalAlign.CENTER,
                width: { size: 45, type: WidthType.PERCENTAGE },
                borders: {
                    top: {
                        style: BorderStyle.NONE,
                        size: 1,
                    },
                    bottom: {
                        style: BorderStyle.NONE,
                        size: 1,
                    },
                    left: {
                        style: BorderStyle.NONE,
                        size: 1,
                    },
                    right: {
                        style: BorderStyle.NONE,
                        size: 1,
                    }
                },
            }),
            new TableCell({
                children: [],
                width: { size: 15, type: WidthType.PERCENTAGE },
                borders: {
                    top: {
                        style: BorderStyle.NONE,
                        size: 1,
                    },
                    bottom: {
                        style: BorderStyle.NONE,
                        size: 1,
                    },
                    left: {
                        style: BorderStyle.NONE,
                        size: 1,
                    },
                    right: {
                        style: BorderStyle.NONE,
                        size: 1,
                    }
                },
            }),
            new TableCell({
                children: [],
                verticalAlign: VerticalAlign.CENTER,
                width: { size: 40, type: WidthType.PERCENTAGE },
                borders: {
                    top: {
                        style: BorderStyle.NONE,
                        size: 1,
                    },
                    bottom: {
                        style: BorderStyle.NONE,
                        size: 1,
                    },
                    left: {
                        style: BorderStyle.NONE,
                        size: 1,
                    },
                    right: {
                        style: BorderStyle.NONE,
                        size: 1,
                    }
                },
            }),
        ],
    })
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