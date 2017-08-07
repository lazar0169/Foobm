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


function initTables() {

    function generateLinks(object) {
        var linksArray = '';
        for (var i = 0; i < Object.keys(object).length; i++) {
            linksArray += `<li class="ui-state-default"> 
                                <span class="ui-icon ui-icon-arrowthick-2-n-s">
                                    <a href="${object[Object.keys(object)[i]]}"></a>
                                </span> 
                                <span class="row">
                                    <input class="row-title" value="${Object.keys(object)[i]}">  
                                    <input class="row-link" value="${object[Object.keys(object)[i]]}" onkeyup="changeUrl(this)"> 
                                </span> 
                                <span class="delete-row" onclick="deleteRow(this)">-</span> 
                            </li>`;
        }
        return linksArray;
    }

    for (var i = 0; i < links.length; i++) {
        var additionalHTML = `
            <div class="section">
                <input class="section-tops" value="${links[i].name}">
                <div class="section-tops" onclick="addEmptyRow(this)">+</div>
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
        placeholder: "ui-state-highlight"
    }).disableSelection();
}

function addEmptyRow(object) {
    addRow(object.parentElement, 'test', 'http://');
}

function addRow(section, name, url) {
    var rowHTML = `<li class="ui-state-default"> 
                        <span class="ui-icon ui-icon-arrowthick-2-n-s">
                            <a href="${url}"></a>
                        </span> 
                        <span class="row">
                            <input class="row-title" value="${name}">  
                            <input class="row-link" value="${url}" onkeyup="changeUrl(this)"> 
                        </span> 
                        <span class="delete-row" onclick="deleteRow(this)">-</span> 
                    </li>`;
    section.children[2].innerHTML += rowHTML;
}

function deleteRow(object) {
    $(object).parent().remove();
}

function addSection() {
    document.body.innerHTML += `
            <div class="section">
                <input class="section-tops" value="New Section">
                <div class="section-tops" onclick="addEmptyRow(this)">+</div>
                <ul class="sortable connectedSortable">
                </ul>
            </div>
        `;
    initDrag();
}

function changeUrl(object) {
    object.parentElement.parentElement.children[0].children[0].href = object.value;
}

window.addEventListener("load", function () {
    initTables();
    initDrag();
}, false);