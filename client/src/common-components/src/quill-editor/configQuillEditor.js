export const configQuillEditor = {
    modules: {
        toolbar: [
            [{ 'font': [] }],
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['image', 'code-block', 'list']
        ],
        imageDropAndPaste: true,
        table: true,
        tableUI: true,
    },
    placeholder: 'Start typing here...',
    theme: 'snow'
}