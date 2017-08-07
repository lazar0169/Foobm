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
                                    <a href="${object[Object.keys(object)[i]]}"></a>
                                </span> 
                                <span class="row">
                                    <input class="row-title" value="${Object.keys(object)[i]}" onkeyup="read()">  
                                    <input class="row-link" value="${object[Object.keys(object)[i]]}" onkeyup="row.changeUrl(this)"> 
                                </span> 
                                <span class="delete-row" onclick="row.remove(this.parentElement)">-</span> 
                            </li>`;
        }
        return linksArray;
    }

    for (var i = 0; i < links.length; i++) {
        var additionalHTML = `
            <div class="section">
                <input class="section-tops" value="${links[i].name}" onkeyup="read()">
                <div class="section-tops" onclick="row.add(this.parentElement, 'test', 'http://')">+</div>
                <div class="section-tops" onclick="section.remove(this.parentElement)">-</div>
                <ul class="sortable connectedSortable">
                    ${generateLinks(links[i].list)}
                </ul>
            </div>
        `;
        document.body.innerHTML += additionalHTML;
    }
}

function initDrag() {
    $(".sortable").sortable({
        connectWith: ".connectedSortable",
        placeholder: "ui-state-highlight",
        cursor: "move",
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
                            <a href="${url}"></a>
                        </span> 
                        <span class="row">
                            <input class="row-title" value="${name}">  
                            <input class="row-link" value="${url}" onkeyup="row.changeUrl(this)"> 
                        </span> 
                        <span class="delete-row" onclick="row.remove(this.parentElement)">-</span> 
                    </li>`;
        section.children[3].innerHTML += rowHTML;
        read();
    }

    function remove(object) {
        var msg = confirm("Remove this link?");
        if (msg === true) {
            $(object).remove();
            read();
        }

    }

    function changeUrl(object) {
        object.parentElement.parentElement.children[0].children[0].href = object.value;
        read();
    }

    return {
        add,
        remove,
        changeUrl
    }
}();

var section = function () {
    function add() {
        document.body.innerHTML += `
            <div class="section">
                <input class="section-tops" value="New Section">
                <div class="section-tops" onclick="row.add(this.parentElement, 'test', 'http://')">+</div>
                <div class="section-tops" onclick="section.remove(this.parentElement)">-</div>
                <ul class="sortable connectedSortable">
                </ul>
            </div>
        `;
        initDrag();
        read();
    }

    function remove(object) {
        var msg = confirm("Remove this section?");
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

window.addEventListener("load", function () {
    initTables();
    initDrag();
}, false);