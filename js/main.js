// 1. kolaps sekcije

var links = [{ name: "Section 1", list: { Google: "http://www.google.com", Yahoo: "http://www.yahoo.com" } }, { name: "Section 2", list: { Facebook: "http://www.facebook.com", Youtube: "http://www.youtube.com" } }];
var compatibility = '', iosStyle = '';

if (navigator.userAgent.indexOf('Edge') > -1 || navigator.userAgent.indexOf('Firefox') > -1) {
    compatibility = 'comp';
}

if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
    iosStyle = 'overflow-x: scroll;'
}

function parseUrl(url) {
    if (url.indexOf('http://') !== -1 || url.indexOf('https://') !== -1) {
        return url;
    } else {
        return `http://${url}`;
    }
}

function read() {
    links = [];
    var sections = document.querySelectorAll('.section');
    for (let i = 0; i < sections.length; i++) {
        var section = {
            name: sections[i].children[0].value,
            list: {}
        }
        var linksList = sections[i].children[3].querySelectorAll('li');
        for (let i = 0; i < linksList.length; i++) {
            var title = linksList[i].children[1].children[1].value;
            var link = linksList[i].children[1].children[2].value;
            section.list[title] = link;
        }
        links.push(section);
    }
    console.log(links);
}

function rowTemplate(title, url) {
    return `<li class="ui-state-default"> 
                <span class="ui-icon ui-icon-arrowthick-2-n-s">
                    <i class="mdi mdi-drag" aria-hidden="true"></i>
                </span> 
                <span class="row" data-row="||false">
                    <a href="${url}" target="_blank"></a>
                    <textarea type="text" class="row-title" readonly="readonly" cols="10" rows="1" style="${iosStyle}">${title}</textarea>  
                    <textarea type="text" class="row-link" readonly="readonly" cols="10" rows="1" style="${iosStyle}">${url}</textarea> 
                </span> 
                <span class="edit-row" onclick="row.edit(this.parentElement)" title="Change bookmark"><i class="mdi mdi-link-variant" aria-hidden="true"></i></span> 
                <span class="delete-row" onclick="row.remove(this.parentElement)" title="Remove bookmark"><i class="mdi mdi-minus" aria-hidden="true"></i></span> 
            </li>`
}

function sectionTemplate(name, bookmarks) {
    return `
            <div class="section ${compatibility}">
                <textarea type="text" class="section-tops" cols="10" rows="1" style="${iosStyle}">${name}</textarea>
                <div class="section-tops" onclick="row.add(this.parentElement, 'blank', 'http://')" title="Add new bookmark"><i class="mdi mdi-plus" aria-hidden="true"></i></div>
                <div class="section-tops" onclick="section.remove(this.parentElement)" title="Remove section"><i class="mdi mdi-close" aria-hidden="true"></i></div>
                <ul class="sortable connectedSortable">
                    ${bookmarks}
                </ul>
            </div>
        `
}

function initTables() {
    function generateLinks(object) {
        var linksArray = '';
        for (var i = 0; i < Object.keys(object).length; i++) {
            linksArray += rowTemplate(Object.keys(object)[i], parseUrl(object[Object.keys(object)[i]]));
        }
        return linksArray;
    }

    for (var i = 0; i < links.length; i++) {
        var additionalHTML = sectionTemplate(links[i].name, generateLinks(links[i].list));
        document.getElementById('sections').innerHTML += additionalHTML;
    }
}

function initDrag() {
    $('.sortable').sortable({
        connectWith: '.connectedSortable',
        placeholder: 'ui-state-highlight',
        cursor: 'move',
        delay: 150,
        opacity: 0.5,
        update: function (e) {
            read();
        }
    }).disableSelection();
}

//  MODULES

var row = function () {
    function add(section, name, url) {
        rowHTML = rowTemplate(name, parseUrl(url));
        $(section.children[3]).append(rowHTML);
        read();
    }

    function remove(object) {
        if (JSON.parse(object.children[1].dataset.row.split('|')[2])) {
            object.children[1].children[0].href = parseUrl(object.children[1].dataset.row.split('|')[1]);
            object.children[1].children[2].value = parseUrl(object.children[1].dataset.row.split('|')[1]);
            object.children[1].children[1].value = object.children[1].dataset.row.split('|')[0];
            object.children[1].children[0].style.pointerEvents = 'all';
            object.children[2].className = 'edit-row';
            object.children[2].children[0].className = 'mdi mdi-link-variant';
            object.children[3].children[0].className = 'mdi mdi-minus';
            object.children[3].title = 'Remove bookmark';
            object.children[1].children[1].style.background = 'none';
            object.children[1].children[2].style.background = 'none';
            object.children[1].children[1].blur();
            object.children[1].children[2].blur();
            object.children[1].dataset.row = '||false';
        } else {
            var msg = confirm('Remove this link?');
            if (msg === true) {
                $(object).remove();
                read();
            }
        }

    }

    function changeUrl(object) {
        object.children[0].href = parseUrl(object.children[2].value);
        object.children[2].value = parseUrl(object.children[2].value);
        read();
    }

    function edit(object) {
        var row = object.children[1];
        var link = object.children[1].children[0];
        var nameField = object.children[1].children[1];
        var urlField = object.children[1].children[2];
        var removeBtn = object.children[3];
        var editBtn = object.children[2];

        function changeAvailable(state) {
            if (state) {
                row.dataset.row = `${nameField.value}|${urlField.value}|true`;
                link.style.pointerEvents = 'none';
                editBtn.className += ' done';
                editBtn.children[0].className = 'mdi mdi-check';
                removeBtn.children[0].className = 'mdi mdi-close';
                removeBtn.title = 'Discard changes';
                nameField.style.background = 'rgba(0, 255, 57, 0.26)';
                urlField.style.background = 'rgba(0, 255, 57, 0.26)';
                nameField.readOnly = false;
                urlField.readOnly = false;
            } else {
                row.dataset.row = '||false';
                link.style.pointerEvents = 'all';
                editBtn.className = 'edit-row';
                editBtn.children[0].className = 'mdi mdi-link-variant';
                removeBtn.children[0].className = 'mdi mdi-minus';
                removeBtn.title = 'Remove bookmark';
                nameField.style.background = 'none';
                urlField.style.background = 'none';
                nameField.blur();
                urlField.blur();
                nameField.readOnly = true;
                urlField.readOnly = true;
                changeUrl(row);
            }
        }

        nameField.addEventListener("keyup", function (event) {
            event.preventDefault();
            if (event.keyCode == 13) changeAvailable(false);
        });

        urlField.addEventListener("keyup", function (event) {
            event.preventDefault();
            if (event.keyCode == 13) changeAvailable(false);
        });

        changeAvailable(!JSON.parse(row.dataset.row.split('|')[2]))
    }

    return {
        add,
        remove,
        changeUrl,
        edit
    }
}();

var section = function () {
    function add() {
        $('#sections').append(sectionTemplate('New section', ''));
        initDrag();
        read();
    }

    function remove(object) {
        var msg = confirm('Remove this section?');
        if (msg === true) {
            $(object).remove();
            read();
        }
    }

    return {
        add,
        remove
    }
}();

window.addEventListener('load', function () {
    initTables();
    initDrag();
}, false);