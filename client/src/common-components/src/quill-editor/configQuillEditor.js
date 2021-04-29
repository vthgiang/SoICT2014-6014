export function configQuillEditor(id, toolbar, enableEdit, placeholder, enableDropImage) {
    if (!placeholder) {
        placeholder = 'Start typing here...';
    }
    return {
        modules: {
            toolbar: toolbar ? `#toolbar${id}` : toolbar,
            uploader: enableDropImage ? true : {
                handler: () => {}
            },
            table: true,
            tableUI: true,
        },
        placeholder: enableEdit ? placeholder : null,
        theme: 'snow',
    }
}
