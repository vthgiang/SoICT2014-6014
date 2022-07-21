import { AlignmentType, Document, HeadingLevel, WidthType, VerticalAlign, Table, TableCell, TableRow, LevelFormat, Paragraph, TabStopPosition, TabStopType, BorderStyle, TextRun, convertInchesToTwip } from "docx";

export const contractDocxCreate = (contract) => {
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
                    id: "contract",
                    name: "Contract",
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
                                    // indent: { left: convertInchesToTwip(1), hanging: convertInchesToTwip(0.68) },
                                    indent: { left: convertInchesToTwip(0.5), hanging: convertInchesToTwip(0.2) },
                                },
                            },
                        },
                        {
                            level: 2,
                            format: LevelFormat.LOWER_LETTER,
                            text: "%3.",
                            alignment: AlignmentType.START,
                            style: {
                                paragraph: {
                                    indent: { left: convertInchesToTwip(0.75), hanging: convertInchesToTwip(0.18) },
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
                        children: [
                            new TextRun({
                                text: `CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM`,
                                bold: true,
                                size: 26,
                                // color: "808080"
                            }),
                        ],
                        style: "contract",
                        alignment: AlignmentType.CENTER
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `Độc lập - Tự do - Hạnh phúc`,
                                bold: true,
                                size: 26,
                                // color: "808080"
                            }),
                        ],
                        style: "contract",
                        alignment: AlignmentType.CENTER
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `__________________`,
                                bold: true,
                                size: 26,
                                // color: "808080"
                            }),
                        ],
                        style: "decision",
                        alignment: AlignmentType.CENTER
                    }),
                    createText(``),
                    createText(``),
                    new Paragraph({
                        text: "HỢP ĐỒNG",
                        heading: HeadingLevel.TITLE,
                        alignment: AlignmentType.CENTER,
                    }),
                    createText(``),

                    new Paragraph({
                        text: formatDateToString("Hà Nội", Date.now()),
                        alignment: AlignmentType.RIGHT,
                        style: "contract",
                    }),
                    createText(``),

                    new Paragraph({
                        text: `Hợp đồng số: ${contract?.code}`,
                        style: "contract",
                    }),
                    new Paragraph({
                        text: `Gói thầu: ${contract?.biddingPackage?.name}`,
                        style: "contract",
                    }),
                    new Paragraph({
                        text: `Thuộc dự án: ${contract?.project?.name || "_____________________________"}`,
                        style: "contract",
                    }),
                    createBulletHeader(`Căn cứ Bộ Luật dân sự số 33/2005/QH11 ngày 14/6/2005 của Quốc hội`),
                    createBulletHeader(`Căn cứ Luật đấu thầu số 43/2013/QH13 ngày 26/11/2013 của Quốc hội`),
                    createBulletHeader(`Căn cứ Nghị định số 63/2014/NĐ-CP ngày 26/6/2014 của Chính phủ về quy định chi tiết thi hành một số điều của Luật Đấu thầu về lựa chọn nhà thầu`),
                    createBulletHeader(`Căn cứ Quyết định số _____ ngày ___ tháng ___ năm _____ của ____ về việc phê duyệt kết quả lựa chọn nhà thầu gói thầu ${contract?.biddingPackage.name} và thông báo kết quả lựa chọn nhà thầu số ___ ngày ___ tháng ___ năm _____ của bên mời thầu`),
                    createBulletHeader(`Căn cứ biên bản hoàn thiện hợp đồng đã được chủ đầu tư và nhà thầu trúng thầu ký ngày ___ tháng ___ năm ____`),

                    new Paragraph({
                        text: `Chúng tôi, đại diện cho các bên ký hợp đồng, gồm có:`,
                        style: "contract",
                    }),


                    createHeading("Chủ đầu tư", 3, "l"),
                    new Paragraph({
                        text: `Tên chủ đầu tư: ${contract?.companyA}`,
                        style: "contract",
                    }),
                    new Paragraph({
                        text: `Đại diện là ông/bà: ${contract?.representativeNameA}`,
                        style: "contract",
                    }),
                    new Paragraph({
                        text: `Chức vụ : ${contract?.representativeRoleA}`,
                        style: "contract",
                    }),
                    new Paragraph({
                        text: `Địa chỉ: ${contract?.addressA}`,
                        style: "contract",
                    }),
                    new Paragraph({
                        text: `Điện thoại: ${contract?.phoneA}`,
                        style: "contract",
                    }),
                    new Paragraph({
                        text: `Fax: __________________________`,
                        style: "contract",
                    }),
                    new Paragraph({
                        text: `E-mail: ${contract?.emailA}`,
                        style: "contract",
                    }),
                    new Paragraph({
                        text: `Tài khoản: ${contract?.bankAccountNumberA} - ${contract?.bankNameA}`,
                        style: "contract",
                    }),
                    new Paragraph({
                        text: `Mã số thuế: ${contract?.taxCodeA}`,
                        style: "contract",
                    }),
                    new Paragraph({
                        text: `Giấy ủy quyền số ___ ngày ___ tháng ___ năm ____ (trường hợp được ủy quyền).`,
                        style: "contract",
                    }),

                    createHeading("Nhà thầu", 3, "l"),
                    new Paragraph({
                        text: `Tên nhà thầu : ${contract?.companyB}`,
                        style: "contract",
                    }),
                    new Paragraph({
                        text: `Đại diện là ông/bà: ${contract?.representativeNameB}`,
                        style: "contract",
                    }),
                    new Paragraph({
                        text: `Chức vụ : ${contract?.representativeRoleB}`,
                        style: "contract",
                    }),
                    new Paragraph({
                        text: `Địa chỉ: ${contract?.addressB}`,
                        style: "contract",
                    }),
                    new Paragraph({
                        text: `Điện thoại: ${contract?.phoneB}`,
                        style: "contract",
                    }),
                    new Paragraph({
                        text: `Fax: __________________________`,
                        style: "contract",
                    }),
                    new Paragraph({
                        text: `E-mail: ${contract?.emailB}`,
                        style: "contract",
                    }),
                    new Paragraph({
                        text: `Tài khoản: ${contract?.bankAccountNumberB} - ${contract?.bankNameB}`,
                        style: "contract",
                    }),
                    new Paragraph({
                        text: `Mã số thuế: ${contract?.taxCodeB}`,
                        style: "contract",
                    }),
                    new Paragraph({
                        text: `Giấy ủy quyền số ___ ngày ___ tháng ___ năm ____ (trường hợp được ủy quyền).`,
                        style: "contract",
                    }),
                    new Paragraph({
                        text: `Hai bên thỏa thuận ký kết hợp đồng dịch vụ tư vấn với các nội dung sau:`,
                        style: "contract",
                    }),

                    createHeading(`Điều 1. Đối tượng hợp đồng`, 3, "l"),
                    new Paragraph({
                        text: `Đối tượng hợp đồng là các dịch vụ được nêu chi tiết trong Phụ lục A “Điều khoản tham chiếu”.`,
                        style: "contract",
                    }),

                    createHeading(`Điều 2. Hồ sơ hợp đồng`, 3, "l"),
                    new Paragraph({
                        text: `Hồ sơ hợp đồng bao gồm các tài liệu sau đây:`,
                        style: "contract",
                    }),
                    createBulletNumber(`Văn bản hợp đồng;`),
                    createBulletNumber(`Phụ lục hợp đồng gồm điều khoản tham chiếu, dự toán kinh phí, danh sách nhân sự của nhà thầu, trách nhiệm báo cáo của nhà thầu;`),
                    createBulletNumber(`Biên bản hoàn thiện hợp đồng;`),
                    createBulletNumber(`Quyết định phê duyệt kết quả lựa chọn nhà thầu;`),
                    createBulletNumber(`Văn bản thỏa thuận của các bên về điều kiện của hợp đồng, bao gồm điều kiện chung, điều kiện cụ thể;`),
                    createBulletNumber(`Hồ sơ dự thầu và các tài liệu làm rõ hồ sơ dự thầu của nhà thầu được lựa chọn;`),
                    createBulletNumber(`Hồ sơ mời thầu và các tài liệu sửa đổi, bổ sung hồ sơ mời thầu;`),
                    createBulletNumber(`Các tài liệu có liên quan.`),

                    createHeading(`Điều 3. Trách nhiệm của nhà thầu`, 3, "l"),
                    createBulletHeader(`Thực hiện các nghĩa vụ được nêu tại Điều 1 của hợp đồng này;`),
                    createBulletHeader(`Nộp báo cáo cho chủ đầu tư trong thời hạn và theo các hình thức được nêu trong Phụ lục B “Dự toán kinh phí, danh sách nhân sự của nhà thầu” để thực hiện dịch vụ;`),
                    createBulletHeader(`Đảm bảo huy động và bố trí nhân sự, dự toán kinh phí được liệt kê tại Phụ Lục C “Trách nhiệm báo cáo của nhà thầu”;`),
                    createBulletHeader(`Thực hiện đầy đủ các nghĩa vụ và trách nhiệm khác được nêu trong ĐKC và ĐKCT của hợp đồng.`),

                    createHeading(`Điều 4. Trách nhiệm của chủ đầu tư`, 3, "l"),
                    createBulletHeader(`Chủ đầu tư cam kết thanh toán cho nhà thầu theo giá hợp đồng và phương thức nêu tại Điều 5 của hợp đồng này cũng như thực hiện đầy đủ nghĩa vụ và trách nhiệm khác được quy định tại ĐKC và ĐKCT của hợp đồng.`),
                    createBulletHeader(`Chủ đầu tư chỉ định ông/bà ${contract.representativeNameA} là cán bộ phụ trách của chủ đầu tư để điều phối các hoạt động thuộc phạm vi hợp đồng này.`),
                    createBulletHeader(`Đảm bảo huy động và bố trí nhân sự, dự toán kinh phí được liệt kê tại Phụ Lục C “Trách nhiệm báo cáo của nhà thầu”;`),
                    createBulletHeader(`Thực hiện đầy đủ các nghĩa vụ và trách nhiệm khác được nêu trong ĐKC và ĐKCT của hợp đồng.`),

                    createHeading(`Điều 5. Giá hợp đồng, thời hạn và phương thức thanh toán`, 3, "l"),
                    createBulletHeader(`Giá hợp đồng: ____${contract.budget} (${contract.currenceUnit})_______ [Ghi rõ giá trị bằng số, bằng chữ và đồng tiền ký hợp đồng. Trường hợp giá hợp đồng được ký bằng hai hoặc ba đồng tiền khác nhau thì ghi rõ giá trị bằng số và bằng chữ của từng đồng tiền đó, ví dụ: 3 triệu USD + 7 tỷ VND (ba triệu đôla Mỹ và bảy tỷ đồng Việt Nam)]. Số tiền này bao gồm toàn bộ các chi phí, lãi và bất kỳ khoản thuế nào mà nhà thầu phải trả, chi tiết như sau:`),
                    createText(`  - Thù lao cho chuyên gia:`),
                    createText(`  Chủ đầu tư thanh toán cho nhà thầu thù lao tính theo tháng người hoặc theo tuần, theo ngày, theo giờ (lựa chọn một trong ba nội dung và xóa nội dung còn lại) như đã thống nhất tại Phụ lục C`),
                    createText(`  - Chi phí khác ngoài thù lao:`),
                    createText(`  Chủ đầu tư thanh toán cho nhà thầu các chi phí khác với mức trần là [Ghi giá trị và đồng tiền thanh toán] cho các khoản chi thực tế hoặc khoán gọn dưới đây`),
                    createText(`    + Chi phí công tác (bao gồm chi phí đi lại, phụ cấp công tác và lưu trú), tiền văn phòng phẩm và phôtô, in ấn tài liệu, chi phí liên lạc. Chi phí này sẽ được hoàn trả và cần được chủ đầu tư xác nhận;`),
                    createText(`    + Chi phí khác đã được chủ đầu tư phê duyệt.`),
                    createBulletHeader(`Thời hạn và phương thức thanh toán`),
                    createText(`Thanh toán theo thời hạn và phương thức thanh toán nêu tại Điều 6 ĐKCT.`),

                    createHeading(`Điều 6. Bảng chấm công`, 3, "l"),
                    createText(`Trong quá trình làm việc, kể cả đi công tác, chủ đầu tư điền vào bảng chấm công hoặc giấy tờ hợp lệ khác để xác định thời gian làm việc của nhà thầu.`),

                    createHeading(`Điều 7. Loại hợp đồng:`, 3, "l"),
                    createText(`Hợp đồng này áp dụng loại hợp đồng theo thời gian.`),

                    createHeading(`Điều 8. Thời gian thực hiện hợp đồng`, 3, "l"),
                    createText(`[Nếu thời gian thực hiện hợp đồng phù hợp với Khoản 2 Mục 1 BDL, HSDT và kết quả hoàn thiện hợp đồng giữa hai bên].`),

                    createHeading(`Điều 9. Hiệu lực hợp đồng`, 3, "l"),
                    createBulletHeader(`Hợp đồng có hiệu lực kể từ ${contract.effectiveDate}.`),
                    createBulletHeader(`Hợp đồng hết hiệu lực sau khi hai bên tiến hành thanh lý hợp đồng theo luật định.`),
                    createText(`Hợp đồng được lập thành _____ bộ, chủ đầu tư giữ ______ bộ, nhà thầu giữ _____ bộ, các bộ hợp đồng có giá trị pháp lý như nhau.`),

                    createText(``),
                    createText(``),

                    createSignature(),
                    // createSignatureBottom(),
                ]
            }
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

const createBullet = (text) => {
    return new Paragraph({
        children: [
            new TextRun({
                text: text,
                // italics: true
            })
        ],
        bullet: {
            level: 0,
        },
        style: "contract",
    });
}

const createBulletHeader = (text) => {
    return new Paragraph({
        children: [
            new TextRun({
                text: text,
                // italics: true
            })
        ],
        numbering: {
            reference: "my-unique-bullet-points",
            level: 0,
        },
        style: "contract",
    });
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
            level: 1,
        },
        style: "contract",
    });
}

const createText = (text) => {
    return new Paragraph({
        text: text,
        style: "contract",
    });
}

const createSignature = (
    repA = "Đại diện hợp pháp của nhà thầu ",
    repB = "Đại diện hợp pháp của chủ đầu tư",
    repSA = "[Ghi tên, chức danh, ký tên và đóng dấu]",
    repSB = "[Ghi tên, chức danh, ký tên và đóng dấu]"
) => {
    return new Table({
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: repA,
                                        bold: true,
                                        size: 26,
                                    })
                                ]
                            })
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
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: repB,
                                        bold: true,
                                        size: 26,
                                    })
                                ]
                            })
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
            new TableRow({
                children: [
                    new TableCell({
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: repSA,
                                        italics: true,
                                        size: 26,
                                    })
                                ]
                            })
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
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: repSB,
                                        italics: true,
                                        size: 26,
                                    })
                                ]
                            })
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

const createSignatureBottom = (
    repA = "[Ghi tên, chức danh, ký tên và đóng dấu]",
    repB = "[Ghi tên, chức danh, ký tên và đóng dấu]"
) => {
    return new TableRow({
        children: [
            new TableCell({
                children: [
                    new TextRun({
                        text: repA,
                        italics: true,
                        size: 26,
                    })
                ],
            }),
            new TableCell({
                children: [
                    new TextRun({
                        text: repB,
                        italics: true,
                        size: 26,
                    })
                ],
            }),
        ],
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