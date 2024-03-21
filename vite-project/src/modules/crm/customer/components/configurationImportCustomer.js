export const configurationCustomer = {
  configurationImport,
  templateImport
}

function configurationImport(translate) {
  let config = {
    rowHeader: {
      // Số dòng tiêu đề của bảng
      description: translate('human_resource.rowHeader'),
      value: 2
    },
    sheets: {
      // Tên các sheet
      description: translate('human_resource.sheets_name'),
      value: ['Sheet1']
    },
    code: {
      columnName: translate('crm.customer.code'),
      description: translate('crm.customer.code'),
      value: translate('crm.customer.code')
    },
    name: {
      columnName: translate('crm.customer.name'),
      description: translate('crm.customer.name'),
      value: translate('crm.customer.name')
    },
    owner: {
      columnName: translate('crm.customer.owner'),
      description: translate('crm.customer.owner'),
      value: translate('crm.customer.owner')
    },
    gender: {
      columnName: translate('crm.customer.gender'),
      description: translate('crm.customer.gender'),
      value: translate('crm.customer.gender')
    },
    customerType: {
      columnName: translate('crm.customer.customerType'),
      description: translate('crm.customer.customerType'),
      value: translate('crm.customer.customerType')
    },
    represent: {
      columnName: translate('crm.customer.represent'),
      description: translate('crm.customer.represent'),
      value: translate('crm.customer.represent')
    },
    taxNumber: {
      columnName: translate('crm.customer.taxNumber'),
      description: translate('crm.customer.taxNumber'),
      value: translate('crm.customer.taxNumber')
    },
    customerSource: {
      columnName: translate('crm.customer.source'),
      description: translate('crm.customer.source'),
      value: translate('crm.customer.source')
    },
    companyEstablishmentDate: {
      columnName: translate('crm.customer.companyEstablishmentDate'),
      description: translate('crm.customer.companyEstablishmentDate'),
      value: translate('crm.customer.companyEstablishmentDate')
    },
    birthDate: {
      columnName: translate('crm.customer.birth'),
      description: translate('crm.customer.birth'),
      value: translate('crm.customer.birth')
    },
    telephoneNumber: {
      columnName: translate('crm.customer.telephoneNumber'),
      description: translate('crm.customer.telephoneNumber'),
      value: translate('crm.customer.telephoneNumber')
    },
    mobilephoneNumber: {
      columnName: translate('crm.customer.mobilephoneNumber'),
      description: translate('crm.customer.mobilephoneNumber'),
      value: translate('crm.customer.mobilephoneNumber')
    },
    email: {
      columnName: translate('crm.customer.email'),
      description: translate('crm.customer.email'),
      value: translate('crm.customer.email')
    },
    email2: {
      columnName: translate('crm.customer.secondaryEmail'),
      description: translate('crm.customer.secondaryEmail'),
      value: translate('crm.customer.secondaryEmail')
    },
    address: {
      columnName: translate('crm.customer.address'),
      description: translate('crm.customer.address'),
      value: translate('crm.customer.address')
    },
    address2: {
      columnName: translate('crm.customer.address2'),
      description: translate('crm.customer.address2'),
      value: translate('crm.customer.address2')
    },
    location: {
      columnName: translate('crm.customer.location'),
      description: translate('crm.customer.location'),
      value: translate('crm.customer.location')
    },
    website: {
      columnName: translate('crm.customer.website'),
      description: translate('crm.customer.website'),
      value: translate('crm.customer.website')
    },
    linkedIn: {
      columnName: translate('crm.customer.linkedIn'),
      description: translate('crm.customer.linkedIn'),
      value: translate('crm.customer.linkedIn')
    },
    group: {
      columnName: translate('crm.customer.group'),
      description: translate('crm.customer.group'),
      value: translate('crm.customer.group')
    },
    status: {
      columnName: translate('crm.customer.status'),
      description: translate('crm.customer.status'),
      value: translate('crm.customer.status')
    }
  }
  return config
}

function templateImport(translate, listGroups, listStatus) {
  let templateImport = {
    fileName: 'Thông tin khách hàng',
    dataSheets: [
      {
        sheetName: 'sheet1',
        sheetTitle: 'Thông tin khách hàng',
        tables: [
          {
            // 4. Giới tính phải đúng định dạng, chấp nhận 1 trong các tên sau:
            //        +) Nam, nam.
            //        +) Nữ, nữ.
            //     5. Loại khách hàng phải đúng định dạng, chấp nhận một trong các tên sau:
            //        +) Cá nhân, cá nhân.
            //        +) Công ty, công ty, Tổ chức, tổ chức
            //     6. Vùng khách hàng phải đúng định dạng, chấp nhận một trong các tên sau:
            //        +) Miền bắc, miền bắc, Miền Bắc.
            //        +) Miền trung, miền trung, Miền Trung.
            //        +) Miền nam, miền nam, Miền Nam.
            note: `Chú ý:
                            1. Mã khách hàng không được trùng nhau.
                            2. Tên nhóm khách hàng phải đúng định dạng, chấp nhận 1 trong các tên sau: ${listGroups.map((o) => o.text).join(', ')}.
                            3. Tên trạng thái khách hang phải đúng định dạng, chấp nhận 1 trong các tên sau: ${listStatus.map((o) => o.text).join(', ')}.`,
            noteHeight: 60,
            columns: [
              { key: 'code', value: translate('crm.customer.code') },
              { key: 'name', value: translate('crm.customer.name'), width: 20 },
              { key: 'owner', value: translate('crm.customer.owner'), width: 25 },
              { key: 'status', value: translate('crm.customer.status') },
              { key: 'customerSource', value: translate('crm.customer.source') },
              { key: 'customerType', value: translate('crm.customer.customerType') },
              { key: 'group', value: translate('crm.customer.group'), width: 25 },
              { key: 'represent', value: translate('crm.customer.represent'), width: 25 },
              { key: 'mobilephoneNumber', value: translate('crm.customer.mobilephoneNumber'), width: 25 },
              { key: 'email', value: translate('crm.customer.email'), width: 25 },
              { key: 'email2', value: translate('crm.customer.secondaryEmail'), width: 25 },
              { key: 'address', value: translate('crm.customer.address'), width: 25 },
              { key: 'gender', value: translate('crm.customer.gender'), width: 25 },
              { key: 'birthDate', value: translate('crm.customer.birth'), width: 25 },
              { key: 'companyEstablishmentDate', value: translate('crm.customer.companyEstablishmentDate'), width: 25 },
              { key: 'taxNumber', value: translate('crm.customer.taxNumber'), width: 25 },
              { key: 'address2', value: translate('crm.customer.address2'), width: 25 },
              { key: 'telephoneNumber', value: translate('crm.customer.telephoneNumber'), width: 25 },
              { key: 'location', value: translate('crm.customer.location'), width: 25 },
              { key: 'website', value: translate('crm.customer.website'), width: 25 },
              { key: 'linkedIn', value: translate('crm.customer.linkedIn'), width: 25 }
            ],
            data: [
              {
                code: 'KH008',
                name: 'Nguyễn Văn A',
                owner: 'tvb.vnist@gmail.com',
                status: 'Quan tâm sản phẩm',
                customerSource: 'mạng xã hội',
                customerType: 'Cá nhân',
                group: 'Khách bán buôn',
                represent: 'Nguyễn Thị Thủy',
                mobilephoneNumber: '09119893837',
                email: 'thuynt.vnist@gmail.com',
                email2: 'thuynt2.vnist@gmail.com',
                address: '30 Tạ quang bửu, hà nội',
                gender: 'Nữ',
                birthDate: '11-11-1111',
                companyEstablishmentDate: '29-06-2019',
                taxNumber: '34ewr3434',
                address2: '',
                telephoneNumber: '',
                location: 'Miền bắc',
                website: 'thuynt.com',
                linkedIn: ''
              },
              {
                code: '',
                name: '',
                owner: 'nvd.vnist@gmail.com',
                status: '',
                customerSource: '',
                customerType: '',
                group: '',
                represent: '',
                mobilephoneNumber: '',
                email: '',
                email2: '',
                address: '',
                gender: '',
                birthDate: null,
                companyEstablishmentDate: null,
                taxNumber: '',
                address2: '',
                telephoneNumber: '',
                location: '',
                website: '',
                linkedIn: ''
              }
            ]
          }
        ]
      }
    ]
  }
  return templateImport
}
