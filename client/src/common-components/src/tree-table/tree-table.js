//  js cho table-tree cần hiện thị các node con
export const treeTableShowChildren = `
$(function () {
    var
        $table = $('#tree-table'),
        rows = $table.find('tr');

    rows.each(function (index, row) {
        var
            $row = $(row),
            level = $row.data('level'),
            id = $row.data('id'),
            $columnName = $row.find('td[data-column="name"]'),
            children = $table.find('tr[data-parent="' + id + '"]')
        tagSpan = $columnName.find("span").length;


        var div = $("<div/>").attr({
            "style": "display: inline-block; margin-left: " + (15 + 30 * (level - 1)) + "px"
        }).html($columnName.text());
        if (children.length) {
            var expander = $('<span />').attr('class', 'treegrid-expander glyphicon glyphicon-chevron-down').html('');
            div.prepend(expander);

            children.show();
            expander.on('click', function (e) {
                var $target = $(e.target);
                if ($target.hasClass('glyphicon-chevron-right')) {
                    $target
                        .removeClass('glyphicon-chevron-right')
                        .addClass('glyphicon-chevron-down');

                    children.show();
                    reverseShow($table, $row);
                } else {
                    $target
                        .removeClass('glyphicon-chevron-down')
                        .addClass('glyphicon-chevron-right');

                    reverseHide($table, $row);
                }
            });
        }
        $columnName.html('');
        $columnName.append(div);
    });

    // Reverse hide all elements
    reverseHide = function (table, element) {
        var
            $element = $(element),
            id = $element.data('id'),
            children = table.find('tr[data-parent="' + id + '"]');

        if (children.length) {
            children.each(function (i, e) {
                reverseHide(table, e);
            });

            $element
                .find('.glyphicon-chevron-down')
                .removeClass('glyphicon-chevron-down')
                .addClass('glyphicon-chevron-right');

            children.hide();
        }
    };

    // Reverse show all elements
    reverseShow = function (table, element) {
        var
            $element = $(element),
            id = $element.data('id'),
            children = table.find('tr[data-parent="' + id + '"]');

        if (children.length) {
            children.each(function (i, e) {
                reverseShow(table, e);
            });

            $element
                .find('.glyphicon-chevron-right')
                .removeClass('glyphicon-chevron-right')
                .addClass('glyphicon-chevron-down');

            children.show();
        }
    };
});
`

//  js cho table-tree cần ẩn các node con
export const treeTableHideChildren = `
$(function () {
    var
        $table = $('#tree-table'),
        rows = $table.find('tr');
    rows.each(function (index, row) {
        var
            $row = $(row),
            level = $row.data('level'),
            id = $row.data('id'),
            $columnName = $row.find('td[data-column="name"]'),
            children = $table.find('tr[data-parent="' + id + '"]')
            tagSpan = $columnName.find("span").length;
        var div = $("<div/>").attr({"style": "display: inline-block; margin-left: " +  (15 + 30 * (level-1)) + "px"}).html($columnName.text());
        if (children.length){
            var expander = $('<span />').attr('class', 'treegrid-expander glyphicon glyphicon-chevron-right').html('');
            div.prepend(expander);
            children.hide();
            expander.on('click', function (e) {
                var $target = $(e.target);
                if ($target.hasClass('glyphicon-chevron-right')) {
                    $target
                        .removeClass('glyphicon-chevron-right')
                        .addClass('glyphicon-chevron-down');

                    children.show();
                    reverseShow($table, $row);
                } else {
                    $target
                        .removeClass('glyphicon-chevron-down')
                        .addClass('glyphicon-chevron-right');

                    reverseHide($table, $row);
                }
            });
        }
        $columnName.html('');
        $columnName.append(div);
    });

    // Reverse hide all elements
    reverseHide = function (table, element) {
        var
            $element = $(element),
            id = $element.data('id'),
            children = table.find('tr[data-parent="' + id + '"]');
        if (children.length) {
            children.each(function (i, e) {
                reverseHide(table, e);
            });

            $element
                .find('.glyphicon-chevron-down')
                .removeClass('glyphicon-chevron-down')
                .addClass('glyphicon-chevron-right');

            children.hide();
        }
    };
    
    // Reverse show all elements
    reverseShow = function (table, element) {
        var
            $element = $(element),
            id = $element.data('id'),
            children = table.find('tr[data-parent="' + id + '"]');
        if (children.length) {
            children.each(function (i, e) {
                reverseShow(table, e);
            });
            $element
                .find('.glyphicon-chevron-right')
                .removeClass('glyphicon-chevron-right')
                .addClass('glyphicon-chevron-down');

            children.show();
        }
    };
});

`