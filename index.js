// icon theme: https://store.kde.org/p/1661983
const ext_map = {
    "7z": "mimetypes/scalable/7zip.svg",
    "apk": "mimetypes/scalable/application-apk.svg",
    "bmp": "mimetypes/scalable/application-image-bmp.svg",
    "bz2": "mimetypes/scalable/application-x-bzip.svg",
    "crt": "mimetypes/scalable/application-certificate.svg",
    "deb": "mimetypes/scalable/deb.svg",
    "docx": "mimetypes/scalable/application-msword.svg",
    "exe": "mimetypes/scalable/application-x-wine-extension-its.svg",
    "gif": "mimetypes/scalable/application-image-gif.svg",
    "gz": "mimetypes/scalable/application-gzip.svg",
    "html": "mimetypes/scalable/html.svg",
    "ico": "mimetypes/scalable/application-image-ico.svg",
    "iso": "mimetypes/scalable/application-x-iso.svg",
    "jpeg": "mimetypes/scalable/application-image-jpg.svg",
    "jpg": "mimetypes/scalable/application-image-jpg.svg",
    "js": "mimetypes/scalable/application-javascript.svg",
    "json": "mimetypes/scalable/application-json.svg",
    "mp3": "mimetypes/scalable/audio-mp3.svg",
    "mp4": "mimetypes/scalable/video-mp4.svg",
    "msi": "mimetypes/scalable/application-install.svg",
    "ogg": "mimetypes/scalable/application-ogg.svg",
    "pdf": "mimetypes/scalable/application-pdf.svg",
    "png": "mimetypes/scalable/application-image-png.svg",
    "ppt": "mimetypes/scalable/application-mspowerpoint.svg",
    "pptx": "mimetypes/scalable/application-mspowerpoint.svg",
    "rar": "mimetypes/scalable/application-vnd-rar.svg",
    "rpm": "mimetypes/scalable/application-x-rpm.svg",
    "sh": "mimetypes/scalable/application-x-shellscript.svg",
    "sql": "mimetypes/scalable/application-sql.svg",
    "srpm": "mimetypes/scalable/application-x-source-rpm.svg",
    "svg": "mimetypes/scalable/application-image-svg.svg",
    "tar": "mimetypes/scalable/application-x-tar.svg",
    "tiff": "mimetypes/scalable/application-image-tiff.svg",
    "torrent": "mimetypes/scalable/application-torrent.svg",
    "ttf": "mimetypes/scalable/application-font.svg",
    "ttf": "mimetypes/scalable/font-ttf.svg",
    "txt": "mimetypes/scalable/application-text.svg",
    "vsdx": "mimetypes/scalable/application-vnd-visio.svg",
    "wav": "mimetypes/scalable/application-audio.svg",
    "xlsx": "mimetypes/scalable/application-msexcel.svg",
    "xml": "mimetypes/scalable/application-xml.svg",
    "xsd": "mimetypes/scalable/application-xsd.svg",
    "xslt": "mimetypes/scalable/application-xslt.svg",
    "yaml": "mimetypes/scalable/application-x-yaml.svg",
    "yml": "mimetypes/scalable/application-x-yaml.svg",
    "zip": "mimetypes/scalable/application-archive-zip.svg",
};

const ext_def = "mimetypes/scalable/application-blank.svg";

const ext_fld = "places/scalable/default-folder.svg";
const ext_dup = "places/scalable/folder-home.svg";

function get_icon(extension) {
    if (extension in ext_map) {
        return ext_map[extension];
    }
    if (extension.length > 0 && extension[extension.length - 1] === "/") {
        if (extension === "../") {
            return ext_dup;
        }
        return ext_fld;
    }
    return ext_def;
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
        return ext_dup;
    }
    return ext_fld;
}

function split(link, text) {
    const re1 = /.*<a.*href="(.*)".*>(.*)<\/a>.*/;
    const ma1 = re1.exec(link);

    const re2 = /^\s*(\S*)\s(\S*)\s+(\S*)\s+(\S*)\s*$/;
    const ma2 = re2.exec(text);

    return {
        "link": ma1 ? ma1[1] : "",
        "name": ma1 ? ma1[2] : "",
        "date": ma2 ? (ma2[1] + " " + ma2[2]) : "",
        "size": ma2 ? ma2[3] : ""
    };
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
            <td><img class="icons" src="icons/${mode}/${image}"></img><a href="${data["link"]}">${data["name"]}</a></td>
            <td>${data["date"]}</td>
            <td>${data["size"]}</td>
        `;
        tbody.appendChild(trow);
    });

    return table;
}

function modify_page() {
    u("hr").remove(); //.each(function(element, index) { element.hidden = true; });
    let div = document.createElement("div");
    div.appendChild(createSearchBox());
    div.appendChild(document.createElement("hr"));
    //div.appendChild(document.createElement("p"));
    div.appendChild(createTable());
    u("pre").replace(div);
}

modify_page();
