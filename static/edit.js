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
        document.querySelector('#notes').value                   = meta.notes;
        document.querySelector('#source').value                  = meta.source;
        document.querySelector('#release-date').value            = meta.releaseDate;
        document.querySelector('#version').value                 = meta.version;
        document.querySelector('#original-description').value    = meta.originalDescription;
        document.querySelector('#language').value                = meta.language;
        
        fetch('selection.json').then(response => response.json()).then(json => {
            for (let category of json.tags) {
                let categoryGroup = document.createElement('optgroup');
                
                categoryGroup.nsfw  = category.nsfw;
                categoryGroup.label = category.title;
                
                if (category.nsfw || category.title == 'Franchises')
                    categoryGroup.hidden = true;
                
                addToSelect(category.tags, categoryGroup);
                
                document.querySelector('#tags-select').append(categoryGroup);
            }
            
            document.querySelector('#tags-show-franchises').addEventListener('change', e => {
                document.querySelector('#tags-select optgroup[label="Franchises"]').hidden = !e.target.checked;
            });
            document.querySelector('#tags-show-nsfw').addEventListener('change', e => {
                for (let group of document.querySelectorAll('#tags-select optgroup'))
                    if (group.nsfw) group.hidden = !e.target.checked;
            });
            
            addToSelect(json.platforms, document.querySelector('#platform-select'), meta.platform);
            addToSelect(json.playModes, document.querySelector('#play-mode-select'));
            addToSelect(json.status,    document.querySelector('#status-select'));
        });
        
        addToList( meta.tagsStr.replaceAll('; ', ';').split(';'), document.querySelector('#tags-list'));
        addToList(meta.playMode.replaceAll('; ', ';').split(';'), document.querySelector('#play-mode-list'));
        addToList(  meta.status.replaceAll('; ', ';').split(';'), document.querySelector('#status-list'));
        
        document.querySelector('#tags-select-add'     ).addEventListener('click', addButtonClick);
        document.querySelector('#play-mode-select-add').addEventListener('click', addButtonClick);
        document.querySelector('#status-select-add'   ).addEventListener('click', addButtonClick);
        
        oldMeta = meta;
    });
}
else location.replace('.');

function addToList(array, target) {
    for (let value of array) {
        let container    = document.createElement('div'),
            deleteButton = document.createElement('button'),
            valueElement = document.createElement('span');
        
        deleteButton.style.marginRight = '4px';
        deleteButton.innerText = 'X';
        deleteButton.addEventListener('click', e => event.target.parentNode.remove());
        
        valueElement.innerText = value;
        
        container.append(deleteButton);
        container.append(valueElement);
        
        target.append(container);
    }
}
function addToSelect(array, target, selection = "") {
    for (let value of array) {
        let valueOption = document.createElement('option');
        
        valueOption.value = value;
        valueOption.innerText = value;
        
        target.append(valueOption);
        
        if (selection != "" && value == selection)
            target.selectedIndex = valueOption.index;
    }
}
function addButtonClick(e) {
    if (e.target.id == 'tags-select-add')
        addToList([document.querySelector('#tags-select').value], document.querySelector('#tags-list'));
    if (e.target.id == 'play-mode-select-add')
        addToList([document.querySelector('#play-mode-select').value], document.querySelector('#play-mode-list'));
    if (e.target.id == 'status-select-add')
        addToList([document.querySelector('#status-select').value], document.querySelector('#status-list'));
}

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
    { let tags = Array.from(document.querySelectorAll('#tags-list span'), elem => elem.textContent).sort();
      if (tags.join('; ') != oldMeta.tagsStr) newMeta.metas[0].tags = tags; }
    if (document.querySelector('#platform-select').value != oldMeta.platform)
        newMeta.metas[0].platform = document.querySelector('#platform-select').value;
    { let playMode = Array.from(document.querySelectorAll('#play-mode-list span'), elem => elem.textContent).sort().join('; ');
      if (playMode != oldMeta.playMode) newMeta.metas[0].playMode = playMode; }
    { let status = Array.from(document.querySelectorAll('#status-list span'), elem => elem.textContent).sort().join('; ');
      if (status != oldMeta.status) newMeta.metas[0].status = status; }
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