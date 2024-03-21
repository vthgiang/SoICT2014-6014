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

export const proposalDocxCreate = (proposal, allEmployee) => {
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
              before: 220,
              after: 100
            }
          }
        }
      },
      paragraphStyles: [
        {
          id: 'decision',
          name: 'decision',
          basedOn: 'Normal',
          next: 'Normal',
          run: {
            size: 26
          },
          paragraph: {
            // indent: {
            //     left: convertInchesToTwip(0.5),
            // },
            spacing: {
              // line: 276,
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
                  indent: { left: convertInchesToTwip(1), hanging: convertInchesToTwip(0.68) }
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
                  // indent: { left: convertInchesToTwip(1.5), hanging: convertInchesToTwip(1.18) },
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
              text: '\u00A5',
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
          createHeading(`3. ĐỀ XUẤT KỸ THUẬT CHI TIẾT`, 3, 'l'),
          createHeading(`3.1. Phương pháp và nội dung thực hiện`, 4, 'l'),
          createText(``),
          createText(``),
          createText(``),
          createText(``),

          renderTask(proposal, allEmployee)
        ]
      }
    ]
  })

  return document
}

// Trình độ chuyên môn: intermediate_degree - Trung cấp, colleges - Cao đẳng, university - Đại học, bachelor - cử nhân, engineer - kỹ sư, master_degree - Thạc sỹ, phd- Tiến sỹ, unavailable - Không có
const formatProfessionalSkill = (skill) => {
  switch (skill) {
    case 'intermediate_degree':
    case 'colleges':
    case 'university':
    case 'unavailable':
      return ''
    case 'bachelor':
      return 'Cử nhân. '
    case 'engineer':
      return 'Kỹ sư. '
    case 'master_degree':
      return 'Thạc sĩ. '
    case 'phd':
      return 'Tiến sĩ. '

    default:
      return ''
  }
}

const formatUnitTime = (unitTime) => {
  switch (unitTime) {
    case 'days':
      return 'Ngày'
    case 'hours':
      return 'Giờ'
    case 'months':
      return 'Tháng'
    default:
      return 'Ngày'
  }
}

const renderTask = (proposal, allEmployee) => {
  const tasks = proposal?.tasks ?? []
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
                  size: 26
                })
              ],
              style: 'decision',
              alignment: AlignmentType.CENTER
            })
          ],
          verticalAlign: VerticalAlign.CENTER,
          width: { size: 4, type: WidthType.PERCENTAGE }
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `Nội dung`,
                  bold: true,
                  size: 26
                })
              ],
              style: 'decision',
              alignment: AlignmentType.CENTER
            })
          ],
          verticalAlign: VerticalAlign.CENTER,
          width: { size: 30, type: WidthType.PERCENTAGE }
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `Mô tả`,
                  bold: true,
                  size: 26
                })
              ],
              style: 'decision',
              alignment: AlignmentType.CENTER
            })
          ],
          verticalAlign: VerticalAlign.CENTER,
          width: { size: 30, type: WidthType.PERCENTAGE }
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `Thời gian (${formatUnitTime(proposal?.unitOfTime)})`,
                  bold: true,
                  size: 26
                })
              ],
              style: 'decision',
              alignment: AlignmentType.CENTER
            })
          ],
          verticalAlign: VerticalAlign.CENTER,
          width: { size: 6, type: WidthType.PERCENTAGE }
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `Nhân sự`,
                  bold: true,
                  size: 26
                })
              ],
              style: 'decision',
              alignment: AlignmentType.CENTER
            })
          ],
          verticalAlign: VerticalAlign.CENTER,
          width: { size: 30, type: WidthType.PERCENTAGE }
        })
      ]
    })
  ]

  const fmTaskArr = tasks?.map((x, idx) => {
    return new TableRow({
      children: [
        new TableCell({
          children: [createText(`${idx + 1}`)],
          verticalAlign: VerticalAlign.CENTER,
          width: { size: 4, type: WidthType.PERCENTAGE }
        }),
        new TableCell({
          children: [createText(`${x.taskName}`)],
          verticalAlign: VerticalAlign.CENTER,
          width: { size: 30, type: WidthType.PERCENTAGE }
        }),
        new TableCell({
          children: [createText(`${x.taskDescription}`)],
          verticalAlign: VerticalAlign.CENTER,
          width: { size: 30, type: WidthType.PERCENTAGE }
        }),
        new TableCell({
          children: [createText(`${x.estimateTime}`)],
          verticalAlign: VerticalAlign.CENTER,
          width: { size: 6, type: WidthType.PERCENTAGE }
        }),
        new TableCell({
          children: [
            createText(
              `- Trực tiếp: ${x.directEmployees.map((e) => `${formatProfessionalSkill(e.professionalSkill)}${e.fullName}`).join(', ')}`
            ),
            createText(
              `- Dự phòng: ${x.backupEmployees.map((e) => `${formatProfessionalSkill(e.professionalSkill)}${e.fullName}`).join(', ')}`
            )
          ],
          verticalAlign: VerticalAlign.CENTER,
          width: { size: 30, type: WidthType.PERCENTAGE }
        })
      ]
    })
  })
  rows = [...rows, ...fmTaskArr]

  return new Table({
    rows: rows,
    alignment: AlignmentType.CENTER
  })
}

/**
 * Function format dữ liệu Date thành string
 * @param {*} date : Ngày muốn format
 * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
 */
const formatDateToString = (address = 'Hà Nội', date, monthYear = false) => {
  if (date) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    if (monthYear === true) {
      return `${address}, tháng ${month} năm ${year}`
    }
    // else return [day, month, year].join('-');
    else return `${address}, ngày ${day} tháng ${month} năm ${year}`
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
    style: 'decision'
  })
}

const createText = (text) => {
  return new Paragraph({
    text: text,
    style: 'decision'
  })
}

const createHeading = (text, heading = 3, alignment) => {
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
    text: text,
    heading: hd,
    alignment: al
  })
}
