//get id
const getId = id => document.getElementById(id);

//button click when press enter
getId('search-input').addEventListener('keyup', (event) => {
    if (event.key == 'Enter') {
        getId('search-songs').click();
    }
});

//button event click handler
getId('search-songs').addEventListener('click', () => {
    const songsName = getId('search-input').value;
    const regexp = /[a-zA-Z]/;
    if (songsName.match(regexp)) {
        getSongs(songsName);//call getSongs function
    } else {
        errorMessage('Search by a name.')
    }
    getId('search-input').value = '';//clear input value 
});

//get all songs form api
const getSongs = async songs => {
    const url = `https://api.lyrics.ovh/suggest/${songs}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        getId('error-message').innerText = '';//clear error message
        //check data is empty or not
        if (data.data.length === 0) {
            getId('songs-container').innerText = ''; //clear old song list
            errorMessage(`Sorry! The ${songs} related songs is not found in our database! Try another songs.`);
        } else {
            displaySongs(data.data);//call display songs function
        }
    } catch (err) {
        errorMessage('Something is wrong! Please try again later.');
    }
};

//display songs data 
const displaySongs = songs => {
    getId('songs-container').innerText = ''; //clear old song list
    getId('song-lyrics').innerText = ''; //clear old song lyrics
    //loop for catch every song and display
    songs.forEach(song => {
        const songDiv = document.createElement('div');//create song container
        songDiv.classList = 'single-result row align-items-center my-3 p-3';//add class container div
        //set inner HTML for song div
        songDiv.innerHTML = `        
            <div class="col-md-9">
                <h3 class="lyrics-name">${song.title}</h3>
                <p class="author lead">Album by <span>${song.artist.name}</span></p>
                <audio class='audioPlayer' controls loop>
                    <source src="${song.preview}">
                </audio>    
            </div>
            <div class="col-md-3 text-md-right text-center">
                <a href="#main" onclick="getLyrics('${song.artist.name}', '${song.title}')" class="btn text-white btn-info">Get Lyrics</a>
            </div>              
        `;
        getId('songs-container').appendChild(songDiv);// add song div in songs container 
    });
};

//get song lyrics
const getLyrics = async (artist, title) => {
    const url = `https://api.lyrics.ovh/v1/${artist}/${title}`;
    try {
        getId('error-message').innerText = '';//clear error message
        const response = await fetch(url);
        const data = await response.json();
        console.log(data.lyrics);
        if (data.lyrics) {
            getId('song-lyrics').innerText = data.lyrics;// display song lyrics 
        } else {
            getId('song-lyrics').innerText = '';//clear old song lyrics
            errorMessage(`Sorry! The ${title} song lyrics not found! Try another song.`);
        }
    } catch (err) {
        errorMessage('Something is wrong! Please try again later.');
    }

};


// display error message 
const errorMessage = err => {
    getId('error-message').innerText = err;
}