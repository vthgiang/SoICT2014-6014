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

export const taskReportDocxCreate = (tasksOfTag, contract) => {
  // taskOfTag: {tag: String, tasks: []}
  // let tagName = `${convertTagIdToTagName(allTag, tasksOfTag?.tag)}`
  let tagName = `${tasksOfTag?.tag}`
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
        },
        heading4: {
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
              text: '+', // "\u00A5",
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
          renderHeaderTitle(contract),
          createText(``),

          new Paragraph({
            children: [
              new TextRun({
                text: `*****`,
                bold: true,
                size: 26
              })
            ],
            style: 'report',
            alignment: AlignmentType.CENTER
          }),
          createText(``),
          new Paragraph({
            children: [
              new TextRun({
                text: `Báo Cáo tháng ${formatDateToString(Date.now(), true)}`
              })
            ],
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Dịch vụ ${tagName}`,
                bold: true,
                size: 26
              })
            ],
            style: 'report',
            alignment: AlignmentType.CENTER
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Hợp đồng: (${contract?.code})`,
                // bold: true,
                size: 26
              })
            ],
            style: 'report',
            alignment: AlignmentType.CENTER
          }),
          createText(``),

          createHeading(`1. Tổng quan thực hiện dịch vụ`, 3, 'l'),
          createHeading(`1.1. Tổng quan công việc thực hiện ${tagName}`, 4, 'l'),
          createText(
            `Trong thời gian từ ngày _____ đến ngày _____ chuyên gia thực hiện dịch vụ ${tagName} cho ${contract?.companyA}. Các công việc đã thực hiện bao gồm:`
          ),
          createBulletList(`Thực hiện ...`, 0),
          createText(``),
          createText(``),
          createText(``),

          createHeading(`1.2. Công việc thực hiện hỗ trợ công tác ${tagName}`, 4, 'l'),
          createText(`Chuyên gia hỗ trợ công tác ${tagName} thời gian từ ngày _____ đến ngày _____ thực hiện các công việc như sau:`),
          createBulletList(`Thực hiện ...`, 0),
          createText(``),
          createText(``),
          createText(``),

          createHeading(`1.3. Các nhận định, đánh giá và đề xuất, kiến nghị`, 4, 'l'),
          createText(`Trong tháng ${formatDateToString(Date.now(), true)}, ...`),
          createText(``),
          createText(``),
          createText(``),

          createHeading(`2. Chi tiết kết quả thực hiện`, 3, 'l'),
          ...createTaskReportHeading(tasksOfTag?.tasks, 2),

          createText(``),
          createText(``),
          createText(``),
          createText(``),

          createSignature()
        ]
      }
    ]
  })

  return document
}

const createTaskReportHeading = (tasks, headingIndex = 2) => {
  let res = []

  for (let x = 0; x < tasks?.length; x++) {
    let taskItem = tasks[x]
    res.push(createHeading(`${headingIndex}.${x + 1}. Công việc ${taskItem.taskName}`, 4, 'l'))
    res.push(createText(``))
    res.push(createText(``))
    res.push(createText(``))
  }
  return res
}

const convertTagIdToTagName = (listTag, id) => {
  const tag = listTag?.find((x) => String(x._id) === String(id))
  // return tag?.name;
  return tag?.description
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
      return `${month}/${year}`
    }
    // else return [day, month, year].join('-');
    else return `${day}/${month}/${year}`
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
        text: text
        // italics: true
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
  repA = 'Cán bộ Bên A',
  repB = 'Cán bộ Bên B',
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
                    text: repB,
                    bold: true,
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
                    text: `${contract?.companyA}`,
                    bold: true,
                    size: 26,
                    allCaps: true,
                    color: '808080'
                  })
                ],
                style: 'report',
                alignment: AlignmentType.CENTER
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
          }),
          new TableCell({
            children: [],
            width: { size: 10, type: WidthType.PERCENTAGE },
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
                    text: `${contract?.companyB}`,
                    bold: true,
                    size: 26,
                    allCaps: true,
                    color: '808080'
                  })
                ],
                style: 'decision',
                alignment: AlignmentType.CENTER
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
