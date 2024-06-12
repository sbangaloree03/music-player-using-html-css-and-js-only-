const songs = [
    { id: 1, name: 'Sad But True', artist: 'Metallica', img: 'media/sadbuttrue.jpeg', genre: 'Rock', source: 'media/sadbuttrue.mp3' },
    { id: 2, name: 'Bank Account', artist: '21 Savage', img: 'media/bankaccount.jpeg', genre: 'Hip-Hop', source: 'media/bankaccount.mp3' },
    { id: 3, name: 'goosebumps', artist: 'Travis Scott', img: 'media/goosebumps.jpeg', genre: 'Hip-Hop', source: 'media/goosebumps.mp3' },
    { id: 4, name: 'Not Like Us', artist: 'Kendrick Lamar', img: 'media/download.jpeg', genre: 'Hip-Hop', source: 'media/download.mp3' },
    { id: 5, name: 'COME THROUGH', artist: 'Umair, Abdullah Maharvi, Talha Anjum', img: 'media/comethrough.jpeg', genre: 'Hip-Hop', source: 'media/comethrough.mp3' },
    { id: 6, name: 'Shape of You', artist: 'Ed Sheeran', img: 'media/shapeofyou.jpeg', genre: 'Pop', source: 'media/shapeofyou.mp3' },
    { id: 7, name: 'All of Me', artist: 'John Legend', img: 'media/allofme.jpeg', genre: 'Pop', source: 'media/allofme.mp3' },
    { id: 8, name: 'Clair de Lune', artist: 'Claude Debussy', img: 'media/clairdelune.jpeg', genre: 'Classical', source: 'media/clairdelune.mp3' },
    { id: 9, name: 'Nocturne in E-flat major', artist: 'Frederic Chopin', img: 'media/nocturne.jpeg', genre: 'Classical', source: 'media/nocturne.mp3' },
    { id: 10, name: 'So What', artist: 'Miles Davis', img: 'media/sowhat.jpeg', genre: 'Jazz', source: 'media/sowhat.mp3' },
    { id: 11, name: 'Take Five', artist: 'Dave Brubeck', img: 'media/takefive.jpeg', genre: 'Jazz', source: 'media/takefive.mp3' }
    // Add more songs as needed
];

const playlists = [];
let currentSongIndex = null;
let currentPlaylist = null;
let audio = new Audio();
let isPlaying = false;

document.addEventListener('DOMContentLoaded', () => {
    renderSongs();
    renderPlaylists();
    document.getElementById('toggleTheme').addEventListener('click', toggleTheme);
    document.getElementById('genreFilter').addEventListener('change', renderSongs);
    document.getElementById('createPlaylist').addEventListener('click', createPlaylist);
    document.getElementById('addToPlaylist').addEventListener('click', addToCurrentPlaylist);
    document.getElementById('prevSong').addEventListener('click', playPreviousSong);
    document.getElementById('playPauseSong').addEventListener('click', togglePlayPause);
    document.getElementById('nextSong').addEventListener('click', playNextSong);
    audio.addEventListener('timeupdate', updateProgressBar);
    audio.addEventListener('ended', playNextSong);
    document.getElementById('progressBar').addEventListener('input', seek);
});

function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    document.body.setAttribute('data-theme', currentTheme === 'light' ? 'dark' : 'light');
}

function renderSongs() {
    const genre = document.getElementById('genreFilter').value;
    const songList = document.getElementById('songList');
    songList.innerHTML = '';
    const filteredSongs = genre === 'all' ? songs : songs.filter(song => song.genre === genre);
    filteredSongs.forEach(song => {
        const li = document.createElement('li');
        li.innerHTML = `<img src="${song.img}" alt="${song.name}" class="song-img">
                        <div class="song-info">
                            <span class="song-title">${song.name}</span>
                            <span class="song-artist">${song.artist}</span>
                        </div>`;
        li.addEventListener('click', () => selectSong(song));
        songList.appendChild(li);
    });
}

function selectSong(song) {
    currentSongIndex = songs.indexOf(song);
    document.getElementById('songImage').src = song.img;
    document.getElementById('songName').textContent = song.name;
    document.getElementById('artistName').textContent = song.artist;
    document.getElementById('playPauseSong').classList.remove('fa-pause');
    document.getElementById('playPauseSong').classList.add('fa-play');
    audio.src = song.source;
    isPlaying = false;
    resetProgressBar();
}

function createPlaylist() {
    const playlistName = document.getElementById('playlistName').value;
    if (playlistName) {
        const newPlaylist = { id: Date.now(), name: playlistName, songs: [] };
        playlists.push(newPlaylist);
        renderPlaylists();
    }
}

function renderPlaylists() {
    const playlistList = document.getElementById('playlistList');
    playlistList.innerHTML = '';
    playlists.forEach(playlist => {
        const li = document.createElement('li');
        li.textContent = playlist.name;
        li.addEventListener('click', () => selectPlaylist(playlist));
        playlistList.appendChild(li);
    });
}

function selectPlaylist(playlist) {
    currentPlaylist = playlist;
    renderPlaylistSongs();
}

function renderPlaylistSongs() {
    const playlistSongsList = document.getElementById('playlistSongsList');
    playlistSongsList.innerHTML = '';
    currentPlaylist.songs.forEach(song => {
        const li = document.createElement('li');
        li.innerHTML = `<img src="${song.img}" alt="${song.name}" class="song-img">
                        <div class="song-info">
                            <span class="song-title">${song.name}</span>
                            <span class="song-artist">${song.artist}</span>
                        </div>`;
        playlistSongsList.appendChild(li);
    });
}

function addToCurrentPlaylist() {
    if (currentSongIndex !== null && currentPlaylist !== null) {
        const song = songs[currentSongIndex];
        if (!currentPlaylist.songs.includes(song)) {
            currentPlaylist.songs.push(song);
            renderPlaylistSongs();
        } else {
            alert('Song is already in the playlist');
        }
    } else {
        alert('Select a song and a playlist first');
    }
}

function togglePlayPause() {
    if (isPlaying) {
        audio.pause();
        document.getElementById('playPauseSong').classList.remove('fa-pause');
        document.getElementById('playPauseSong').classList.add('fa-play');
    } else {
        audio.play();
        document.getElementById('playPauseSong').classList.remove('fa-play');
        document.getElementById('playPauseSong').classList.add('fa-pause');
    }
    isPlaying = !isPlaying;
}

function playNextSong() {
    if (currentSongIndex !== null) {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        selectSong(songs[currentSongIndex]);
        togglePlayPause();
    }
}

function playPreviousSong() {
    if (currentSongIndex !== null) {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        selectSong(songs[currentSongIndex]);
        togglePlayPause();
    }
}

function updateProgressBar() {
    const progressBar = document.getElementById('progressBar');
    progressBar.value = (audio.currentTime / audio.duration) * 100;
}

function seek(event) {
    const progressBar = event.target;
    audio.currentTime = (progressBar.value / 100) * audio.duration;
}

function resetProgressBar() {
    const progressBar = document.getElementById('progressBar');
    progressBar.value = 0;
}
