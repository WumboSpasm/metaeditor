const apiURL = 'http://127.0.0.1:8986/';

function searchTitle() {
    fetch(apiURL + `search/${document.querySelector('#search #title-input').value}`)
    .then(response => response.json()).then(data => {
        document.querySelector('#results').textContent = '';
        
        if (data != null) {
            for (let entry of data) {
                let result = document.createElement('a');
                result.innerText = entry.title;
                result.href = `edit.html?id=${entry.id}`;
                
                document.querySelector('#results').append(result);
                document.querySelector('#results').append(document.createElement('br'));
            }
        }
        else
            document.querySelector('#results').textContent = 'No results';
    });
}

function searchID() {
    fetch(apiURL + `meta/${document.querySelector('#search #id-input').value}`)
    .then(response => response.json()).then(data => {
        if (data.id == "")
            document.querySelector('#results').textContent = 'The specified ID does not exist';
        else
            location.replace(`edit.html?id=${data.id}`);
    });
}

document.querySelector('#title-input').addEventListener('keyup', e => { if (e.key == 'Enter') searchTitle() });
document.querySelector('#title-submit').addEventListener('click', searchTitle);

document.querySelector('#id-input').addEventListener('keyup', e => { if (e.key == 'Enter') searchID() });
document.querySelector('#id-submit').addEventListener('click', searchID);