const apiURL = 'http://127.0.0.1:8986/';
let oldMeta;

if (location.search.startsWith('?id=')) {
    fetch(apiURL + `meta/${location.search.substring(4)}`)
    .then(response => response.json()).then(meta => {
        if (meta.id == "") location.replace('.');
        
        document.querySelector('#id').textContent                = meta.id;
        document.querySelector('#title').value                   = meta.title;
        document.querySelector('#alternate-titles').value        = meta.alternateTitles;
        document.querySelector('#series').value                  = meta.series;
        document.querySelector('#developer').value               = meta.developer;
        document.querySelector('#publisher').value               = meta.publisher;
        document.querySelector('#tags').value                    = meta.tagsStr;
        document.querySelector('#platform').value                = meta.platform;
        document.querySelector('#play-mode').value               = meta.playMode;
        document.querySelector('#status').value                  = meta.status;
        document.querySelector('#notes').value                   = meta.notes;
        document.querySelector('#source').value                  = meta.source;
        document.querySelector('#release-date').value            = meta.releaseDate;
        document.querySelector('#version').value                 = meta.version;
        document.querySelector('#original-description').value    = meta.originalDescription;
        document.querySelector('#language').value                = meta.language;
        
        oldMeta = meta;
    });
}
else location.replace('.');

function saveEdits() {
    let newMeta = { 
        metas: [{ id: oldMeta.id }],
        launcherVersion: "10.1.7"
    };
    
    if (document.querySelector('#title').value != oldMeta.title)
        newMeta.metas[0].metastitle = document.querySelector('#title').value;
    if (document.querySelector('#alternate-titles').value != oldMeta.alternateTitles)
        newMeta.metas[0].alternateTitles = document.querySelector('#alternate-titles').value;
    if (document.querySelector('#series').value != oldMeta.series)
        newMeta.metas[0].series = document.querySelector('#series').value;
    if (document.querySelector('#developer').value != oldMeta.developer)
        newMeta.metas[0].developer = document.querySelector('#developer').value;
    if (document.querySelector('#publisher').value != oldMeta.publisher)
        newMeta.metas[0].publisher = document.querySelector('#publisher').value;
    if (document.querySelector('#tags').value != oldMeta.tagsStr)
        newMeta.metas[0].tags = document.querySelector('#tags').value.replaceAll('; ', ';').split(';');
    if (document.querySelector('#platform').value != oldMeta.platform)
        newMeta.metas[0].platform = document.querySelector('#platform').value;
    if (document.querySelector('#play-mode').value != oldMeta.playMode)
        newMeta.metas[0].playMode = document.querySelector('#play-mode').value;
    if (document.querySelector('#status').value != oldMeta.status)
        newMeta.metas[0].status = document.querySelector('#status').value;
    if (document.querySelector('#notes').value != oldMeta.notes)
        newMeta.metas[0].notes = document.querySelector('#notes').value;
    if (document.querySelector('#source').value != oldMeta.source)
        newMeta.metas[0].source = document.querySelector('#source').value;
    if (document.querySelector('#release-date').value != oldMeta.releaseDate)
        newMeta.metas[0].releaseDate = document.querySelector('#release-date').value;
    if (document.querySelector('#version').value != oldMeta.version)
        newMeta.metas[0].version = document.querySelector('#version').value;
    if (document.querySelector('#original-description').value != oldMeta.originalDescription)
        newMeta.metas[0].originalDescription = document.querySelector('#original-description').value;
    if (document.querySelector('#language').value != oldMeta.language)
        newMeta.metas[0].language = document.querySelector('#language').value;
    
    let download = document.createElement('a');
    download.setAttribute('download', `${oldMeta.id}.json`);
    download.setAttribute('href', URL.createObjectURL(new Blob([JSON.stringify(newMeta, null, '\t')])));
    download.click();
}

document.querySelector('#save').addEventListener('click', saveEdits);
document.querySelector('#back').addEventListener('click', () => { location.replace('.'); });