var currentAudio = null;
var timerInterval = null;
var timerTime = 0;
var isTimerRunning = false;
var songList = [];
var missions = [];
var currentEditElement = null;

document.addEventListener("DOMContentLoaded", function() {
    loadState();
    renderSongList();
    renderMissions();
});

function showModal(id) {
    var modal = document.getElementById(id);
    if (modal.style.display === 'block') {
        modal.style.display = 'none';
        if (id === 'missionModal') {
            toggleDeleteButtons(false);
        }
    } else {
        modal.style.display = 'block';
        if (id === 'missionModal') {
            toggleDeleteButtons(true);
        }
    }
}

function showReactionModal() {
    var reactionButton = document.querySelector('.reaction-button');
    var modal = document.getElementById('reactionModal');
    var rect = reactionButton.getBoundingClientRect();

    modal.style.display = 'block'; // 먼저 모달을 표시

    var buttonWidth = document.querySelector('.button-reaction').offsetWidth; // 내부 버튼의 너비 가져오기
    modal.style.width = `${buttonWidth}px`; // 내부 버튼의 너비에 맞춤
    modal.style.top = `${rect.top + window.scrollY - modal.offsetHeight - 10}px`; // 버튼 위로 이동
    modal.style.left = `${rect.left - buttonWidth - 10}px`; // 버튼 왼쪽으로 이동
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
    if (id === 'missionModal') {
        toggleDeleteButtons(false);
    }
}

function playAudio(url) {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    currentAudio = new Audio(url);
    currentAudio.volume = 0.8; // Set volume to 80%
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

function addMission() {
    var konCell = document.querySelector(".kon-cell");
    var missionCell = document.querySelector(".mission-cell");

    var kon = konCell.innerText.trim() || '&nbsp;';
    var mission = missionCell.innerText.trim() || '&nbsp;';
    var colorKon = konCell.style.color || 'yellow';
    var colorMission = missionCell.style.color || 'white';

    missions.push({ kon, mission, colorKon, colorMission });
    konCell.innerText = '';
    missionCell.innerText = '';
    renderMissions();
}

function deleteMissionRow(index) {
    missions.splice(index, 1);
    renderMissions();
}

function clearMissions() {
    missions = [];
    renderMissions();
}

function saveMissions() {
    saveState();
    closeModal('missionModal');
}

function renderMissions() {
    var container = document.querySelector('#missionContainer');
    container.innerHTML = '';

    missions.forEach((mission, index) => {
        var missionRow = document.createElement('div');
        missionRow.classList.add('mission-row');

        missionRow.innerHTML = `
            <span ondblclick="editMission(${index}, 'kon')" style="color: ${mission.colorKon}; -webkit-text-stroke: 1px black;">${mission.kon}</span>
            <span ondblclick="editMission(${index}, 'mission')" style="color: ${mission.colorMission}; -webkit-text-stroke: 1px black;">${mission.mission}</span>
            <button class="delete-button" onclick="deleteMissionRow(${index})">-</button>
        `;

        container.appendChild(missionRow);
    });
}

function toggleDeleteButtons(show) {
    var deleteButtons = document.querySelectorAll('#missionContainer .delete-button');
    deleteButtons.forEach(button => {
        button.style.display = show ? 'inline-block' : 'none';
    });
}

function editColor(element) {
    currentEditColorElement = element;
    showModal('colorPickerModal');
}

function applyColor() {
    var colorPicker = document.getElementById('colorPicker');
    if (currentEditColorElement) {
        currentEditColorElement.style.color = colorPicker.value;
    }
    closeModal('colorPickerModal');
}

function editMission(index, field) {
    currentEditElement = { index, field };
    var mission = missions[index];
    var value = field === 'kon' ? mission.kon : mission.mission;
    var color = field === 'kon' ? mission.colorKon : mission.colorMission;

    document.getElementById('editInput').value = value;
    document.getElementById('editColorPicker').value = rgbToHex(color);
    showModal('editModal');
}

function applyEdit() {
    var newValue = document.getElementById('editInput').value;
    var newColor = document.getElementById('editColorPicker').value;

    if (currentEditElement) {
        if (currentEditElement.field === 'kon') {
            missions[currentEditElement.index].kon = newValue;
            missions[currentEditElement.index].colorKon = newColor;
        } else {
            missions[currentEditElement.index].mission = newValue;
            missions[currentEditElement.index].colorMission = newColor;
        }
        renderMissions();
        saveState();
        closeModal('editModal');
    }
}

function rgbToHex(color) {
    if (color.indexOf('#') === 0) {
        return color;
    }

    var rgb = color.match(/\d+/g);
    return '#' + rgb.map(function(x) {
        return ('0' + parseInt(x).toString(16)).slice(-2);
    }).join('');
}

function startDance() {
    var elementsToHide = document.querySelectorAll('.container, .bottom-left, .buttons, .modal, .modal-header, .modal-header .title, .modal-header .button, .button-bg-music, .stop-button-bg-music, .button-reaction');
    elementsToHide.forEach(element => element.style.display = 'none');

    var danceScreen = document.getElementById('danceScreen');
    var leftImage = document.getElementById('leftImage');
    var rightImage = document.getElementById('rightImage');

    leftImage.src = "https://raw.githubusercontent.com/yunrang2/upload/master/우유춤.gif";
    rightImage.src = "https://raw.githubusercontent.com/yunrang2/upload/master/우유춤.gif";

    danceScreen.style.display = 'flex';
    leftImage.style.display = 'block';
    rightImage.style.display = 'block';

    playAudio('https://raw.githubusercontent.com/yunrang2/upload/master/우유댄스.mp3');
    currentAudio.volume = 0.8; // Set volume to 80%
    startDiscoEffect();

    currentAudio.onended = function() {
        leftImage.style.display = 'none';
        rightImage.style.display = 'none';
        showDanceButtons();
    };
}

function startDanceAnka() {
    var elementsToHide = document.querySelectorAll('.container, .bottom-left, .buttons, .modal, .modal-header, .modal-header .title, .modal-header .button, .button-bg-music, .stop-button-bg-music, .button-reaction');
    elementsToHide.forEach(element => element.style.display = 'none');

    var danceScreen = document.getElementById('danceScreen');
    var leftImage = document.getElementById('leftImage');
    var rightImage = document.getElementById('rightImage');

    leftImage.src = "https://raw.githubusercontent.com/yunrang2/upload/master/앙카.gif";
    rightImage.src = "https://raw.githubusercontent.com/yunrang2/upload/master/앙카.gif";

    danceScreen.style.display = 'flex';
    leftImage.style.display = 'block';
    rightImage.style.display = 'block';

    playAudio('https://raw.githubusercontent.com/yunrang2/upload/master/앙카댄스.mp3');
    currentAudio.volume = 0.8; // Set volume to 80%
    startDiscoEffect();

    currentAudio.onended = function() {
        leftImage.style.display = 'none';
        rightImage.style.display = 'none';
        showDanceButtons();
    };
}

function showDanceButtons() {
    var buttonsContainer = document.querySelector('.buttons-container');
    buttonsContainer.style.display = 'flex';
}

function hideDanceButtons() {
    var buttonsContainer = document.querySelector('.buttons-container');
    buttonsContainer.style.display = 'none';
}

function repeatDance() {
    hideDanceButtons();
    startDance();
}

function repeatDanceAnka() {
    hideDanceButtons();
    startDanceAnka();
}

function returnToMain() {
    location.reload();
}

function startDiscoEffect() {
    var body = document.body;
    body.style.animation = 'disco 0.5s infinite';
}

function stopDiscoEffect() {
    var body = document.body;
    body.style.animation = '';
}

function saveState() {
    localStorage.setItem('songList', JSON.stringify(songList));
    localStorage.setItem('timerTime', timerTime);
    localStorage.setItem('isTimerRunning', isTimerRunning);
    localStorage.setItem('missions', JSON.stringify(missions));
}

function loadState() {
    const savedSongList = localStorage.getItem('songList');
    const savedTimerTime = localStorage.getItem('timerTime');
    const savedIsTimerRunning = localStorage.getItem('isTimerRunning');
    const savedMissions = localStorage.getItem('missions');

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

    if (savedMissions) {
        missions = JSON.parse(savedMissions);
        renderMissions();
    }
}
