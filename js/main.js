var links = [
    {
        name: 'Section 1',
        list: {
            'Google': 'http://www.google.com',
            'Yahoo': 'http://www.yahoo.com'
        }
    },
    {
        name: 'Section 2',
        list: {
            'Facebook': 'http://www.facebook.com',
            'Youtube': 'http://www.youtube.com'
        }
    }
];

var compatibility = '';

if (navigator.userAgent.indexOf('Edge') > -1 || navigator.userAgent.indexOf('Firefox') > -1) {
    compatibility = 'comp';
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
            var title = linksList[i].children[1].children[0].value;
            var link = linksList[i].children[1].children[1].value;
            section.list[title] = link;
        }
        links.push(section);
    }
    console.log(links);
}

function initTables() {
    function generateLinks(object) {
        var linksArray = '';
        for (var i = 0; i < Object.keys(object).length; i++) {
            linksArray += `<li class="ui-state-default"> 
                                <span class="ui-icon ui-icon-arrowthick-2-n-s">
                                    <i class="mdi mdi-drag" aria-hidden="true"></i>
                                </span> 
                                <span class="row">
                                    <a href="${parseUrl(object[Object.keys(object)[i]])}"></a>
                                    <input class="row-title" value="${Object.keys(object)[i]}" onblur="read()">  
                                    <input class="row-link" value="${parseUrl(object[Object.keys(object)[i]])}" onblur="row.changeUrl(this.parentElement)"> 
                                </span> 
                                <span class="edit-row" onclick="row.edit(this.parentElement)" title="Change bookmark"><i class="mdi mdi-link-variant" aria-hidden="true"></i></span> 
                                <span class="delete-row" onclick="row.remove(this.parentElement)" title="Remove bookmark"><i class="mdi mdi-minus" aria-hidden="true"></i></span> 
                            </li>`;
        }
        return linksArray;
    }

    for (var i = 0; i < links.length; i++) {
        var additionalHTML = `
            <div class="section ${compatibility}">
                <input class="section-tops" value="${links[i].name}" onblur="read()">
                <div class="section-tops" onclick="row.add(this.parentElement, 'test', 'http://')" title="Add new bookmark"><i class="mdi mdi-plus" aria-hidden="true"></i></div>
                <div class="section-tops" onclick="section.remove(this.parentElement)" title="Remove section"><i class="mdi mdi-close" aria-hidden="true"></i></div>
                <ul class="sortable connectedSortable">
                    ${generateLinks(links[i].list)}
                </ul>
            </div>
        `;
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

var row = function () {
    function add(section, name, url) {
        var rowHTML = `<li class="ui-state-default"> 
                        <span class="ui-icon ui-icon-arrowthick-2-n-s">
                            <i class="mdi mdi-drag" aria-hidden="true"></i>
                        </span> 
                        <span class="row">
                            <a href="${parseUrl(url)}"></a>
                            <input class="row-title" value="${name}" onblur="read()">  
                            <input class="row-link" value="${parseUrl(url)}" onblur="row.changeUrl(this.parentElement)"> 
                        </span> 
                        <span class="edit-row" onclick="row.edit(this.parentElement)" title="Change bookmark"><i class="mdi mdi-link-variant" aria-hidden="true"></i></span> 
                        <span class="delete-row" onclick="row.remove(this.parentElement)" title="Remove section"><i class="mdi mdi-minus" aria-hidden="true"></i></span> 
                    </li>`;
        section.children[3].innerHTML += rowHTML;
        read();
    }

    function remove(object) {
        var msg = confirm('Remove this link?');
        if (msg === true) {
            $(object).remove();
            read();
        }

    }

    function changeUrl(object) {
        object.children[0].href = parseUrl(object.children[2].value);
        object.children[2].value = parseUrl(object.children[2].value)
        read();
    }

    var editRow = false;
    function edit(object) {
        if (editRow) {
            object.children[1].children[0].style.pointerEvents = 'all';
            object.children[2].className = 'edit-row';
            object.children[2].children[0].className = 'mdi mdi-link-variant';
            object.children[1].children[1].style.background = 'none';
            object.children[1].children[2].style.background = 'none';
            object.children[1].children[1].blur();
            object.children[1].children[2].blur();
        } else {
            object.children[1].children[0].style.pointerEvents = 'none';
            object.children[2].className += ' done';
            object.children[2].children[0].className = 'mdi mdi-check';
            object.children[1].children[1].style.background = 'rgba(0, 84, 6, 0.19)';
            object.children[1].children[2].style.background = 'rgba(0, 84, 6, 0.19)';
        }
        editRow = !editRow;
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
        document.getElementById('sections').innerHTML += `
            <div class="section ${compatibility}">
                <input class="section-tops" value="New Section">
                <div class="section-tops" onclick="row.add(this.parentElement, 'test', 'http://')" title="Add new bookmark"><i class="mdi mdi-plus" aria-hidden="true"></i></div>
                <div class="section-tops" onclick="section.remove(this.parentElement)" title="Remove section"><i class="mdi mdi-close" aria-hidden="true"></i></div>
                <ul class="sortable connectedSortable">
                </ul>
            </div>
        `;
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