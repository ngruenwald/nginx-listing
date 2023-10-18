const basename = "/nginx-listing";
const themeName = "colloid"
const colorMode = "light"

const icon_base_path = `${basename}/icons/${themeName}/${colorMode}`
const mimetypes_path = "mimetypes/scalable"

const default_icon = "mimetypes/scalable/application-blank.svg";
const folder_icon = "places/scalable/default-folder.svg";
const parent_folder_icon = "places/scalable/folder-home.svg";


function get_icon(extension) {
    if (extension in ext_map) {
        return `${mimetypes_path}/${ext_map[extension]}`;
    }
    if (extension.length > 0 && extension[extension.length - 1] === "/") {
        if (extension === "../") {
            return parent_folder_icon;
        }
        return folder_icon;
    }
    return default_icon;
}

function get_extension(path) {
    const parts = path.split(".");
    return parts[parts.length - 1];
}

function get_image(path) {
    const ext = get_extension(path);
    if (ext) {
        return get_icon(ext.toLowerCase());
    }
    if (ext === ".." || ext === "../") {
        return parent_folder_icon;
    }
    return folder_icon;
}

function split(href, text) {
    const re1 = /.*<a.*href="(.*)".*>(.*)<\/a>.*/;
    const ma1 = re1.exec(href);

    const re2 = /^\s*(\S*)\s(\S*)\s+(\S*)\s+(\S*)\s*$/;
    const ma2 = re2.exec(text);

    const link = ma1 ? ma1[1] : "";
    // const name = ma1 ? ma1[2] : "";
    const name = link;
    const date = ma2 ? (ma2[1] + " " + ma2[2]) : "";
    const size = ma2 ? ma2[3] : "";

    return {"link": link, "name": name, "date": date, "size": size};
}

function filterTable() {
    const caseSensitive = document.getElementById("caseSensitive").checked;
    const regexSearch = document.getElementById("regexSearch").checked;
    const searchText = document.getElementById("search").value;

    let searchFn = null;

    if (regexSearch) {
        searchFn = (pattern, name) => !RegExp(pattern).test(name);
    } else if (caseSensitive) {
        searchFn = (search, name) => !name.includes(search);
    } else {
        searchFn = (search, name) => !name.toLowerCase().includes(search.toLowerCase());
    }

    u('#tableContent tr').each(function(row, index) {
        if (searchText.length > 0) {
            const td = row.getElementsByTagName("td")[0];
            const a = td.getElementsByTagName("a")[0];
            const name = a.innerText;

            row.hidden = searchFn(searchText, name);
        } else {
            row.hidden = false;
        }
    });
}

function uncheckCaseSensitive() {
    if (document.getElementById("regexSearch").checked) {
        document.getElementById("caseSensitive").checked = false;
    }
}

function createSearchBox() {
    const cbCaseSensitive = `
        <div class="cat action">
            <label>
                <input id="caseSensitive" type="checkbox"></input>
                <span>Aa</span>
            </label>
        </div>
    `;

    const cbRegexSearch = `
        <div class="cat action">
            <label>
                <input id="regexSearch" type="checkbox" onchange="uncheckCaseSensitive()"></input>
                <span>.*</span>
            </label>
        </div>
    `;

    const txtSearch = '<input id="search" type="search" oninput="filterTable()"></input>';

    let div = document.createElement("span");
    div.classList.add("searchbox");
    div.innerHTML = cbCaseSensitive + cbRegexSearch + txtSearch;
    return div;
}

function convertSize(sizeStr) {
    let size = parseInt(sizeStr);
    if (isNaN(size)) {
        return sizeStr;
    }

    const sq = ["B", "K", "M", "G", "T"];
    let sqi = 0;
    while (size > 1024 && sqi < sq.length) {
        size /= 1024;
        sqi += 1;
    }

    if (sqi === 0) {
        return `${size} ${sq[sqi]}`;
    }

    size = size.toFixed(2);
//    size = Math.round(size * 100) / 100;
    return `${size} ${sq[sqi]}`;
}

function createTable() {
    const mode = "light";

    let table = document.createElement("table");
    table.innerHTML = `
        <thead>
            <tr>
                <th>Name</th>
                <th class="time">Time</th>
                <th class="size">Size</th>
            </tr>
        </thead>
    `;
    let tbody = document.createElement("tbody");
    tbody.id = "tableContent";
    table.appendChild(tbody);

    u('pre a').each(function(element, index) {
        const image = get_image(element.href);
        const content = element.innerText;
        const data = split(element.outerHTML, element.nextSibling.textContent);

        let trow = document.createElement("tr");
        trow.innerHTML = `
            <td>
                <img class="icons" src="${icon_base_path}/${image}"></img>
                <a href="${data["link"]}">${data["name"]}</a>
            </td>
            <td>${data["date"]}</td>
            <td>${convertSize(data["size"])}</td>
        `;
        tbody.appendChild(trow);
    });

    return table;
}

function modify_page() {
    u("hr").remove();
    let div = document.createElement("div");
    div.appendChild(createSearchBox());
    div.appendChild(document.createElement("hr"));
    div.appendChild(createTable());
    u("pre").replace(div);
}

modify_page();
