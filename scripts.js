var currentAudio = null;
var timerInterval = null;
var timerTime = 0;
var isTimerRunning = false;
var songList = [];

document.addEventListener("DOMContentLoaded", function() {
    loadState();
    renderSongList();
});

function showModal(id) {
    var modal = document.getElementById(id);
    modal.style.display = 'block';
}

function closeModal(id) {
    var modal = document.getElementById(id);
    modal.style.display = 'none';
}

function playAudio(url) {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    currentAudio = new Audio(url);
    currentAudio.volume = 0.8; // 노래 소리 80%
    currentAudio.play();
}

function stopAudio() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
}

function startTimer() {
    if (!isTimerRunning) {
        isTimerRunning = true;
        timerInterval = setInterval(decrementTimer, 1000);
    }
}

function decrementTimer() {
    if (timerTime > 0) {
        timerTime--;
        updateTimerDisplay();
        saveState();
    } else {
        stopTimer();
        hideTimer();
    }
}

function updateTimerDisplay() {
    document.getElementById('timerDisplay').innerText = timerTime + " 초";
}

function stopTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
}

function addTime() {
    if (isTimerRunning) {
        timerTime += 30;
    } else {
        timerTime = 30;
        startTimer();
    }
    updateTimerDisplay();
    document.getElementById('timerModal').style.display = 'block';
    document.getElementById('pauseResumeBtn').style.display = 'inline-block';
    document.getElementById('pauseResumeBtn').classList.add('pause-button');
    document.getElementById('pauseResumeBtn').classList.remove('resume-button');
    document.getElementById('pauseResumeBtn').innerText = '중지';
    saveState();
}

function pauseOrResumeTimer() {
    if (isTimerRunning) {
        stopTimer();
        document.getElementById('pauseResumeBtn').classList.remove('pause-button');
        document.getElementById('pauseResumeBtn').classList.add('resume-button');
        document.getElementById('pauseResumeBtn').innerText = '다시';
    } else {
        startTimer();
        document.getElementById('pauseResumeBtn').classList.add('pause-button');
        document.getElementById('pauseResumeBtn').classList.remove('resume-button');
        document.getElementById('pauseResumeBtn').innerText = '중지';
    }
    saveState();
}

function hideTimer() {
    stopTimer();
    document.getElementById('timerModal').style.display = 'none';
    document.getElementById('pauseResumeBtn').style.display = 'none';
    saveState();
}

function showInputModal() {
    showModal('inputModal');
}

function addSong() {
    var input = document.getElementById('songInput').value;
    closeModal('inputModal');
    if (!input) return;

    var artist, title;

    if (input.includes("-")) {
        [artist, title] = input.split("-").map(item => item.trim());
    } else if (input.includes("의")) {
        [artist, title] = input.split("의").map(item => item.trim().replace(/^'|'$/g, ""));
    } else {
        alert("올바른 형식으로 입력하세요.");
        return;
    }

    if (songList.length >= 5) {
        songList.shift();
    }

    songList.push({ artist, title });
    renderSongList();
    saveState();
}

function renderSongList() {
    var table = document.querySelector("#songList tbody");
    table.innerHTML = "";

    songList.forEach((song, index) => {
        var row = document.createElement("tr");
        row.classList.add("table-row");

        row.innerHTML = `
            <td>${index + 1}</td>
            <td ondblclick="editSong(${index}, 'artist')">${song.artist}</td>
            <td ondblclick="editSong(${index}, 'title')">${song.title}</td>
            <td><button class="delete-button" onclick="deleteSong(${index})">삭제</button></td>
        `;

        table.appendChild(row);
    });
}

function editSong(index, field) {
    var newValue = prompt("새로운 값을 입력하세요:", songList[index][field]);
    if (newValue) {
        songList[index][field] = newValue;
        renderSongList();
        saveState();
    }
}

function deleteSong(index) {
    songList.splice(index, 1);
    renderSongList();
    saveState();
}

function clearSongList() {
    songList = [];
    renderSongList();
    saveState();
}

function handleEnterKey(event) {
    if (event.key === 'Enter') {
        addSong();
    }
}

function saveState() {
    localStorage.setItem('songList', JSON.stringify(songList));
    localStorage.setItem('timerTime', timerTime);
    localStorage.setItem('isTimerRunning', isTimerRunning);
}

function loadState() {
    const savedSongList = localStorage.getItem('songList');
    const savedTimerTime = localStorage.getItem('timerTime');
    const savedIsTimerRunning = localStorage.getItem('isTimerRunning');

    if (savedSongList) {
        songList = JSON.parse(savedSongList);
    }

    if (savedTimerTime) {
        timerTime = parseInt(savedTimerTime, 10);
        if (timerTime > 0) {
            document.getElementById('timerModal').style.display = 'block';
            document.getElementById('pauseResumeBtn').style.display = 'inline-block';
            updateTimerDisplay();
        }
    }

    if (savedIsTimerRunning === 'true') {
        startTimer();
        document.getElementById('pauseResumeBtn').classList.add('pause-button');
        document.getElementById('pauseResumeBtn').classList.remove('resume-button');
        document.getElementById('pauseResumeBtn').innerText = '중지';
    } else {
        document.getElementById('pauseResumeBtn').classList.remove('pause-button');
        document.getElementById('pauseResumeBtn').classList.add('resume-button');
        document.getElementById('pauseResumeBtn').innerText = '다시';
    }
}

function showReactionModal() {
    showModal('reactionModal');
}

function startDance() {
    var leftImage = document.getElementById('leftImage');
    var rightImage = document.getElementById('rightImage');

    leftImage.src = "https://raw.githubusercontent.com/yunrang2/upload/master/우유춤.gif";
    rightImage.src = "https://raw.githubusercontent.com/yunrang2/upload/master/우유춤.gif";

    document.getElementById('danceScreen').style.display = 'flex';
    document.body.style.animation = 'disco 1s infinite'; // 디스코 효과 추가
    playAudio('https://raw.githubusercontent.com/yunrang2/upload/master/우유댄스.mp3');
}

function startDanceAnka() {
    var leftImage = document.getElementById('leftImage');
    var rightImage = document.getElementById('rightImage');

    leftImage.src = "https://raw.githubusercontent.com/yunrang2/upload/master/앙카.gif";
    rightImage.src = "https://raw.githubusercontent.com/yunrang2/upload/master/앙카.gif";

    document.getElementById('danceScreen').style.display = 'flex';
    document.body.style.animation = 'disco 1s infinite'; // 디스코 효과 추가
    playAudio('https://raw.githubusercontent.com/yunrang2/upload/master/앙카댄스.mp3');
}

function repeatDance() {
    document.getElementById('danceScreen').style.display = 'none';
    document.body.style.animation = ''; // 디스코 효과 제거
    startDance(); // 우유댄스의 경우
}

function returnToMain() {
    location.reload(); // 새로 고침
}
