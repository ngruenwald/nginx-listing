import json
import logging

from xml.dom import minidom

ext_map = {
    "config": "text-x-generic",
    "ini": "text-x-generic",
    "mib": "text-x-generic",
    "msi": "application-install",
}

root = minidom.parse("freedesktop.org.xml.in")

for mime_type in root.getElementsByTagName("mime-type"):
    type = mime_type.attributes["type"].value

    try:
        icon_name = (
            mime_type.getElementsByTagName("generic-icon")[0].attributes["name"].value
        )
    except Exception:
        logging.warn(f"{type} as no icon")
        # continue
        icon_name = type.replace("/", "-")

    try:
        extensions = [
            glob.attributes["pattern"].value.split(".")[-1]
            for glob in mime_type.getElementsByTagName("glob")
        ]
        for extension in extensions:
            ext_map.update({extension.lower(): icon_name})
            ext_map.update({extension.upper(): icon_name})
    except Exception as error:
        logging.error(f"{type}: {error}")

with open("../extensions.js", "w") as stream:
    stream.writelines(f"ext_map = {json.dumps(ext_map, sort_keys=True, indent=4)};")
