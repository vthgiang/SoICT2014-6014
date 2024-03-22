import {
  AlignmentType,
  Document,
  HeadingLevel,
  WidthType,
  VerticalAlign,
  Table,
  TableCell,
  TableRow,
  LevelFormat,
  Paragraph,
  TabStopPosition,
  TabStopType,
  BorderStyle,
  TextRun,
  convertInchesToTwip
} from 'docx'

export const acceptanceRecordDocxCreate = (allTag, contract) => {
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
              after: 120
            }
          }
        }
      },
      paragraphStyles: [
        {
          id: 'report',
          name: 'Report',
          basedOn: 'Normal',
          next: 'Normal',
          run: {
            size: 26
          },
          paragraph: {
            spacing: {
              line: 276,
              before: 20 * 72 * 0.1,
              after: 20 * 72 * 0.05
            }
          }
        },
        {
          id: 'wellSpaced',
          name: 'Well Spaced',
          basedOn: 'Normal',
          quickFormat: true,
          paragraph: {
            spacing: { line: 276, before: 20 * 72 * 0.1, after: 20 * 72 * 0.05 }
          }
        }
      ]
    },
    numbering: {
      config: [
        {
          reference: 'my-crazy-numbering',
          levels: [
            {
              level: 0,
              format: LevelFormat.UPPER_ROMAN,
              text: '%1',
              alignment: AlignmentType.START,
              style: {
                paragraph: {
                  indent: { left: convertInchesToTwip(0.5), hanging: convertInchesToTwip(0.18) }
                }
              }
            },
            {
              level: 1,
              format: LevelFormat.DECIMAL,
              text: '%2.',
              alignment: AlignmentType.START,
              style: {
                paragraph: {
                  indent: { left: convertInchesToTwip(0.5), hanging: convertInchesToTwip(0.2) }
                }
              }
            },
            {
              level: 2,
              format: LevelFormat.LOWER_LETTER,
              text: '%3.',
              alignment: AlignmentType.START,
              style: {
                paragraph: {
                  indent: { left: convertInchesToTwip(0.75), hanging: convertInchesToTwip(0.18) }
                }
              }
            },
            {
              level: 3,
              format: LevelFormat.UPPER_LETTER,
              text: '%4)',
              alignment: AlignmentType.START,
              style: {
                paragraph: {
                  indent: { left: 2880, hanging: 2420 }
                }
              }
            }
          ]
        },
        {
          reference: 'my-unique-bullet-points',
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: '-', // u1F60
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: { left: convertInchesToTwip(0.5), hanging: convertInchesToTwip(0.25) }
                }
              }
            },
            {
              level: 1,
              format: LevelFormat.BULLET,
              text: '+', //"\u00A5",
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: { left: convertInchesToTwip(1), hanging: convertInchesToTwip(0.25) }
                }
              }
            },
            {
              level: 2,
              format: LevelFormat.BULLET,
              text: '\u273F',
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: { left: 2160, hanging: convertInchesToTwip(0.25) }
                }
              }
            },
            {
              level: 3,
              format: LevelFormat.BULLET,
              text: '\u267A',
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: { left: 2880, hanging: convertInchesToTwip(0.25) }
                }
              }
            },
            {
              level: 4,
              format: LevelFormat.BULLET,
              text: '\u2603',
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: { left: 3600, hanging: convertInchesToTwip(0.25) }
                }
              }
            }
          ]
        }
      ]
    },
    sections: [
      {
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: `CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM`,
                bold: true,
                size: 26
                // color: "808080"
              })
            ],
            style: 'report',
            alignment: AlignmentType.CENTER
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Độc lập - Tự do - Hạnh phúc`,
                bold: true,
                size: 26
                // color: "808080"
              })
            ],
            style: 'report',
            alignment: AlignmentType.CENTER
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `----------`,
                bold: true,
                size: 26
                // color: "808080"
              })
            ],
            style: 'report',
            alignment: AlignmentType.CENTER
          }),
          // createText(``),
          new Paragraph({
            children: [
              new TextRun({
                text: 'BIÊN BẢN NGHIỆM THU DỊCH VỤ ĐỢT ___',
                bold: true,
                size: 26
                // color: "808080"
              })
            ],
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            style: 'report'
          }),
          // createText(``),
          new Paragraph({
            children: [
              new TextRun({
                text: `(Cung cấp dịch vụ đợt ___ từ _______________ đến _______________ theo hợp đồng số ${contract?.code} ký kêt ngày ${contract?.effectiveDate} về việc ${contract?.biddingPackage?.name})`,
                bold: true,
                size: 22
              })
            ],
            style: 'report',
            alignment: AlignmentType.CENTER
          }),

          createBulletHeader(
            `Căn cứ Hợp đồng số ${contract?.code} về việc ${contract?.biddingPackage?.name}) giữa ${contract?.companyA} và ${contract?.companyB};`
          ),
          createBulletHeader(`Căn cứ vào báo cáo công việc hàng tháng và kết quả thực hiện dịch vụ`),

          new Paragraph({
            text: `Hôm nay, ${formatDateToString(Date.now())}, tại ${contract?.companyA} - ${contract?.addressA}`,
            style: 'report'
          }),
          createText(``),

          new Paragraph({
            children: [
              new TextRun({
                text: `Chúng tôi gồm:`,
                size: 26,
                allCaps: true
              })
            ],
            style: 'report',
            alignment: AlignmentType.CENTER
          }),

          createHeading(`Bên Thuê dịch vụ: ${contract?.companyA}`, 3, 'l', true),
          createText(`gọi tắt là Bên A`),
          new Paragraph({
            text: `Địa chỉ: ${contract?.addressA}`,
            style: 'report'
          }),
          new Paragraph({
            text: `Điện thoại: ${contract?.phoneA}`,
            style: 'report'
          }),
          new Paragraph({
            text: `Fax: __________________________`,
            style: 'report'
          }),
          new Paragraph({
            text: `Tài khoản số: ${contract?.bankAccountNumberA}`,
            style: 'report'
          }),
          new Paragraph({
            text: `Mở tại: ${contract?.bankNameA}`,
            style: 'report'
          }),
          new Paragraph({
            text: `Mã số thuế: ${contract?.taxCodeA}`,
            style: 'report'
          }),
          createText(`Đại diện là: `),
          createRepresentative(`Ông/bà: ${contract?.representativeNameA}`, `Chức vụ: ${contract?.representativeRoleA}`),

          createText(``),
          createHeading(`Bên cung cấp dịch vụ: ${contract?.companyB}`, 3, 'l', true),
          createText(`gọi tắt là Bên B`),
          new Paragraph({
            text: `Địa chỉ: ${contract?.addressB}`,
            style: 'report'
          }),
          new Paragraph({
            text: `Điện thoại: ${contract?.phoneA}`,
            style: 'report'
          }),
          new Paragraph({
            text: `Fax: __________________________`,
            style: 'report'
          }),
          new Paragraph({
            text: `Tài khoản số: ${contract?.bankAccountNumberB}`,
            style: 'report'
          }),
          new Paragraph({
            text: `Mở tại: ${contract?.bankNameB}`,
            style: 'report'
          }),
          new Paragraph({
            text: `Mã số thuế: ${contract?.taxCodeB}`,
            style: 'report'
          }),
          createText(`Đại diện là: `),
          createRepresentative(`Ông/bà: ${contract?.representativeNameB}`, `Chức vụ: ${contract?.representativeRoleB}`),

          createText(``),
          new Paragraph({
            text: `Sau khi xem xét tình hình thực hiện thực tế. Hai bên thống nhất nghiệm thu cung cấp dịch vụ đợt ___ từ ngày _______________ đến ngày _______________ theo hợp đồng số ${contract?.code} ngày ${contract?.effectiveDate} về việc ${contract?.biddingPackage?.name} (sau đây gọi tắt là Hợp đồng số ${contract?.code}) như sau:`,
            style: 'report'
          }),

          createHeading(`1. Nội dung nghiệm thu`, 3, 'l'),
          new Paragraph({
            text: `Bên B đã cung cấp đầy đủ, đúng tiến độ và đạt yêu cầu các dịch vụ thực hiện an ninh bảo mật theo hợp đồng số ${contract?.code} trong thời gian từ ngày từ ngày _______________ đến ngày _______________ bao gồm các nội dung chính như sau:`,
            style: 'report'
          }),
          ...createTagOfTaskByList(contract?.biddingPackage?.proposals?.tasks ?? [], allTag, 0),
          new Paragraph({
            children: [
              new TextRun({
                text: `(Chi tiết theo phụ lục đính kèm)`,
                size: 26,
                italics: true
              })
            ],
            style: 'report'
          }),

          createHeading(`2. Thời gian thực hiện`, 3, 'l'),
          createBulletList(`Thời gian thực hiện từ ngày _____________ đến ngày _____________ `, 0),

          createHeading(`3. Kết quả và sản phẩm thực hiện`, 3, 'l'),
          createBulletList(`Bên B đã thực hiện đầy đủ các trách nhiệm như trong Hợp đồng`, 0),
          createBulletList(
            `Đã huy động đầy đủ các chuyên gia để thực hiện công việc theo hợp đồng đã đề xuất và trong thời gian thực hiện hợp đồng có: ${contract?.decideToImplement?.projectManager?.length || '01'} quản lý dự án chịu trách nhiệm về các hoạt động của dịch vụ và liên lạc giữa Bên B và Bên A`,
            1
          ),
          createBulletList(`Thực hiện theo đúng tiến độ về thời gian như đã yêu cầu trong hợp đồng`, 1),
          createBulletList(`Trong quá trình thực hiện dự án Bên B báo cáo đầy đủ tiến độ thực hiện công việc`, 1),

          createBulletList(
            `Bên B đã hoàn thành công việc đợt ___ của hợp đồng và bàn giao cho Bên A đầy đủ các sản phẩm theo hợp đồng với các hạng mục sau đây:`,
            0
          ),
          createBulletList(`Cung cấp __________________`, 1),
          createBulletList(`___________________________`, 1),

          new Paragraph({
            children: [
              new TextRun({
                text: `Kết quả chi tiết xem tại phụ lục: _________________ `,
                // size: 26,
                italics: true,
                bold: true
              })
            ],
            style: 'report'
          }),

          createHeading(`4. Kết luận`, 3, 'l'),
          createBulletList(
            `Trong đợt ___ của hợp đồng: Bên B đã thực hiện đầy đủ các nội dung công việc, nghĩa vụ và trách nhiệm đảm bảo khối lượng chất lượng và tiến độ theo yêu cầu trong hợp đồng số: ${contract?.code} ngày ${contract?.effectiveDate}, đủ điều kiện nghiệm thu.`,
            0
          ),
          createBulletList(
            `Chất lượng thực hiện triển khai hợp đồng "${contract?.name}" đáp ứng các yêu cầu kỹ thuật nêu tại nội dung công việc hợp đồng.`,
            0
          ),
          createBulletList(`Biên bản này dùng làm cơ sở để thanh toán đợt ___ của hợp đồng ${contract?.code} giữa hai Bên `, 0),
          createBulletList(
            `Biên bản đã được hai bên nhất trí thông qua và lập thành 04 bản có giá trị như nhau, mỗi bên giữ 02 bản để thực hiện`,
            0
          ),

          createText(``),
          createText(``),
          createText(``),
          createSignature()
        ]
      },
      {
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: `PHỤ LỤC`,
                bold: true,
                size: 26
                // color: "808080"
              })
            ],
            heading: HeadingLevel.HEADING_3,
            alignment: AlignmentType.CENTER
          })
        ]
      }
    ]
  })

  return document
}

const isEqualTagArray = (arr1, arr2) => {
  // trả về mảng các phần tử mảng 1 có trong mảng 2
  const filteredArr = arr1.filter((value) => arr2.includes(value))

  if (arr1.length === arr2.length && filteredArr.length === arr1.length) {
    return true // bằng nhau
  }
  return false
}

const convertTagIdToTagName = (listTag, id) => {
  const tag = listTag?.find((x) => String(x._id) === String(id))
  // return tag?.name;
  return tag?.description
}

const getALlTagOfBiddingTask = (tasks, allTag) => {
  let tagsList = []

  for (let t of tasks) {
    tagsList.push(t.tag)
  }

  let uniqueTagsArr = []

  for (let t of tagsList) {
    let isExist = uniqueTagsArr.find((x) => JSON.stringify(x) === JSON.stringify(t))
    if (!isExist) {
      uniqueTagsArr.push(t)
    }
  }

  let res = []
  for (let u of uniqueTagsArr) {
    let fmItem = u?.map((x) => convertTagIdToTagName(allTag, x)).join(', ')
    res.push(fmItem)
  }

  return res ?? []
}

const createTagOfTaskByList = (tasks, allTag, level = 0) => {
  let listBullet = []
  const listTag = getALlTagOfBiddingTask(tasks, allTag)
  for (let x of listTag) {
    listBullet.push(
      new Paragraph({
        children: [
          new TextRun({
            text: x
          })
        ],
        numbering: {
          reference: 'my-unique-bullet-points',
          level: level
        },
        style: 'report'
      })
    )
  }

  return listBullet
}

/**
 * Function format dữ liệu Date thành string
 * @param {*} date : Ngày muốn format
 * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
 */
const formatDateToString = (date, monthYear = false) => {
  if (date) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    if (monthYear === true) {
      return `Tháng ${month} năm ${year}`
    }
    // else return [day, month, year].join('-');
    else return `ngày ${day} tháng ${month} năm ${year}`
  } else {
    return date
  }
}

const createBulletList = (text, level = 0) => {
  return new Paragraph({
    children: [
      new TextRun({
        text: text
      })
    ],
    numbering: {
      reference: 'my-unique-bullet-points',
      level: level
    },
    style: 'report'
  })
}

const createBulletHeader = (text) => {
  return new Paragraph({
    children: [
      new TextRun({
        text: text,
        italics: true
      })
    ],
    numbering: {
      reference: 'my-unique-bullet-points',
      level: 0
    },
    style: 'report'
  })
}
const createBulletNumber = (text) => {
  return new Paragraph({
    children: [
      new TextRun({
        text: text
        // italics: true
      })
    ],
    numbering: {
      reference: 'my-crazy-numbering',
      level: 1
    },
    style: 'report'
  })
}

const createText = (text) => {
  return new Paragraph({
    text: text,
    style: 'report'
  })
}

const createSignature = (
  repA = 'Đại diện Bên A ',
  repB = 'Đại diện Bên B',
  repSA = '[Ghi tên, ký tên và đóng dấu]',
  repSB = '[Ghi tên, ký tên và đóng dấu]'
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
                    allCaps: true
                  })
                ]
              })
            ],
            verticalAlign: VerticalAlign.CENTER,
            width: { size: 40, type: WidthType.PERCENTAGE },
            borders: {
              top: {
                style: BorderStyle.NONE,
                size: 1
              },
              bottom: {
                style: BorderStyle.NONE,
                size: 1
              },
              left: {
                style: BorderStyle.NONE,
                size: 1
              },
              right: {
                style: BorderStyle.NONE,
                size: 1
              }
            }
          }),
          new TableCell({
            children: [],
            width: { size: 15, type: WidthType.PERCENTAGE },
            borders: {
              top: {
                style: BorderStyle.NONE,
                size: 1
              },
              bottom: {
                style: BorderStyle.NONE,
                size: 1
              },
              left: {
                style: BorderStyle.NONE,
                size: 1
              },
              right: {
                style: BorderStyle.NONE,
                size: 1
              }
            }
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: repB,
                    bold: true,
                    size: 26,
                    allCaps: true
                  })
                ]
              })
            ],
            verticalAlign: VerticalAlign.CENTER,
            width: { size: 45, type: WidthType.PERCENTAGE },
            borders: {
              top: {
                style: BorderStyle.NONE,
                size: 1
              },
              bottom: {
                style: BorderStyle.NONE,
                size: 1
              },
              left: {
                style: BorderStyle.NONE,
                size: 1
              },
              right: {
                style: BorderStyle.NONE,
                size: 1
              }
            }
          })
        ]
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
                    size: 26
                  })
                ]
              })
            ],
            verticalAlign: VerticalAlign.CENTER,
            width: { size: 40, type: WidthType.PERCENTAGE },
            borders: {
              top: {
                style: BorderStyle.NONE,
                size: 1
              },
              bottom: {
                style: BorderStyle.NONE,
                size: 1
              },
              left: {
                style: BorderStyle.NONE,
                size: 1
              },
              right: {
                style: BorderStyle.NONE,
                size: 1
              }
            }
          }),
          new TableCell({
            children: [],
            width: { size: 15, type: WidthType.PERCENTAGE },
            borders: {
              top: {
                style: BorderStyle.NONE,
                size: 1
              },
              bottom: {
                style: BorderStyle.NONE,
                size: 1
              },
              left: {
                style: BorderStyle.NONE,
                size: 1
              },
              right: {
                style: BorderStyle.NONE,
                size: 1
              }
            }
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: repSB,
                    italics: true,
                    size: 26
                  })
                ]
              })
            ],
            verticalAlign: VerticalAlign.CENTER,
            width: { size: 45, type: WidthType.PERCENTAGE },
            borders: {
              top: {
                style: BorderStyle.NONE,
                size: 1
              },
              bottom: {
                style: BorderStyle.NONE,
                size: 1
              },
              left: {
                style: BorderStyle.NONE,
                size: 1
              },
              right: {
                style: BorderStyle.NONE,
                size: 1
              }
            }
          })
        ]
      })
    ]
  })
}

const createRepresentative = (nameCol, roleCol) => {
  return new Table({
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: nameCol,
                    // bold: true,
                    size: 26
                    // allCaps: true,
                  })
                ]
              })
            ],
            verticalAlign: VerticalAlign.CENTER,
            width: { size: 40, type: WidthType.PERCENTAGE },
            borders: {
              top: {
                style: BorderStyle.NONE,
                size: 1
              },
              bottom: {
                style: BorderStyle.NONE,
                size: 1
              },
              left: {
                style: BorderStyle.NONE,
                size: 1
              },
              right: {
                style: BorderStyle.NONE,
                size: 1
              }
            }
          }),
          new TableCell({
            children: [],
            width: { size: 15, type: WidthType.PERCENTAGE },
            borders: {
              top: {
                style: BorderStyle.NONE,
                size: 1
              },
              bottom: {
                style: BorderStyle.NONE,
                size: 1
              },
              left: {
                style: BorderStyle.NONE,
                size: 1
              },
              right: {
                style: BorderStyle.NONE,
                size: 1
              }
            }
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: roleCol,
                    // bold: true,
                    size: 26
                    // allCaps: true,
                  })
                ]
              })
            ],
            verticalAlign: VerticalAlign.CENTER,
            width: { size: 45, type: WidthType.PERCENTAGE },
            borders: {
              top: {
                style: BorderStyle.NONE,
                size: 1
              },
              bottom: {
                style: BorderStyle.NONE,
                size: 1
              },
              left: {
                style: BorderStyle.NONE,
                size: 1
              },
              right: {
                style: BorderStyle.NONE,
                size: 1
              }
            }
          })
        ]
      })
    ]
  })
}

const createHeading = (text, heading = 3, alignment, allCaps = false) => {
  let hd = HeadingLevel.HEADING_3
  let al = AlignmentType.LEFT

  if (alignment === 'c') al = AlignmentType.CENTER
  else if (alignment === 'r') al = AlignmentType.RIGHT
  else if (alignment === 'l') al = AlignmentType.LEFT

  if (heading === 0) hd = HeadingLevel.TITLE
  else if (heading === 1) hd = HeadingLevel.HEADING_1
  else if (heading === 2) hd = HeadingLevel.HEADING_2
  else if (heading === 3) hd = HeadingLevel.HEADING_3
  else if (heading === 4) hd = HeadingLevel.HEADING_4
  else if (heading === 5) hd = HeadingLevel.HEADING_5
  else if (heading === 6) hd = HeadingLevel.HEADING_6

  return new Paragraph({
    children: [
      new TextRun({
        text: text,
        size: 26,
        allCaps: allCaps
        // bold: true
      })
    ],
    // style: "report",
    heading: hd,
    alignment: al
  })
}
