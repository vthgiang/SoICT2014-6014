export function configQuillEditor(id, toolbar, enableEdit, placeholder) {
    if (!placeholder) {
        placeholder = 'Start typing here...';
    }
    return {
        modules: {
            toolbar: toolbar ? `#toolbar${id}` : toolbar,
            table: true,
            tableUI: true,
        },
        placeholder: enableEdit ? placeholder : null,
        theme: 'snow',
        imageDrop: false,
    }
}
