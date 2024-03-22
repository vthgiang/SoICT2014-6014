export function configQuillEditor(id, toolbar, enableEdit, placeholder, enableDropImage) {
  if (!placeholder) {
    placeholder = 'Start typing here...'
  }
  return {
    modules: {
      toolbar: toolbar ? `#toolbar${id}` : toolbar,
      uploader: enableDropImage
        ? true
        : {
            handler: () => {}
          },
      table: true,
      tableUI: true
    },
    placeholder: enableEdit ? placeholder : null,
    theme: 'snow'
  }
}

/**
 * Chuyển đổi dữ liệu ảnh base64 sang FIle để upload lên server
 * @imgs mảng hình ảnh dạng base64
 * @names mảng tên các ảnh tương ứng
 * */
export function convertImageBase64ToFile(imgs, sliceSize = 512) {
  let imageFile
  if (imgs && imgs.length !== 0) {
    imageFile = imgs.map((item) => {
      let block, contentType, realData
      // Split the base64 string in data and contentType
      block = item?.url?.split(';')
      if (block && block.length !== 0) {
        contentType = block[0].split(':')[1]
        realData = block[1].split(',')[1]
      }
      contentType = contentType || ''

      let byteCharacters = atob(realData)
      let byteArrays = []

      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize)

        const byteNumbers = new Array(slice.length)
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i)
        }

        const byteArray = new Uint8Array(byteNumbers)
        byteArrays.push(byteArray)
      }

      const blob = new Blob(byteArrays, { type: '' })
      return new File([blob], item?.originalName + '.png')
    })
  }
  return imageFile
}
