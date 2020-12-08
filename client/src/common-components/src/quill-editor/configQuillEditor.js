export function configQuillEditor(id) {
    return {
        modules: {
            toolbar: `#toolbar${id}`,
            imageDropAndPaste: true,
            table: true,
            tableUI: true,
        },
        placeholder: 'Start typing here...',
        theme: 'snow'
    }
}
