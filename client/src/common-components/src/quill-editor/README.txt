# Các props và cách dùng trong component QuillEditor

1. this.props.getTextData(data, imgs)
    Trong đó:   data là text html của QuillEditor
                imgs là mảng các file ảnh dạng element

2. QuillEditor.convertImageBase64ToFile(imgs)
    Function này có tác dụng convert mảng imgs dạng element sang File(). Sau khi convert mới upload được
    ảnh lên server

3. this.props.quillValueDefault
    Giá trị khởi tạo ban đầu cho text trong QuillEditor
    ** Lưu ý: component sẽ render lại khi quillValueDefault thay đổi, sau khi render. Do đó chỉ thay đổi 
    cần reset giá trị text mới cho QuillEditor

4. this.props.fileUrls (sử dụng khi this.props.quillValueDefault có thẻ <img/>)
    Mảng url của ảnh download từ server. Trong text html, thẻ <img/> khi lưu trên server ko có src ảnh,
    do vậy cần url để chèn ảnh vào text khi render 

5. { font, header, typography, fontColor, alignAndList, embeds, table } = this.props
    Các công cụ trên thanh toolbar (mặc định = true)
    Cái nào không sử dụng set = false
    Ví dụ: 
        <QuillEditor
            font={false}
            ...
        />