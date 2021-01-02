export function configQuillEditor(id, toolbar, enableEdit) {
    return {
        modules: {
            toolbar: toolbar ? `#toolbar${id}` : toolbar,
            imageDropAndPaste: true,
            table: true,
            tableUI: true,
        },
        placeholder: enableEdit ? 'Start typing here...' : null,
        theme: 'snow'
    }
}
