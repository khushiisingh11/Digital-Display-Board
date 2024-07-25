document.addEventListener('DOMContentLoaded', () => {
    // Music player functionality
    let currentSongIndex = 0;
    const songs = [
        { url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", title: "SoundHelix Song 1", artist: "John Doe" },
        { url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", title: "SoundHelix Song 2", artist: "Jane Smith" },
        { url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", title: "SoundHelix Song 3", artist: "Dave Johnson" }
    ];
  
    function updateSongInfo() {
        const audio = document.getElementById('audio');
        const songInfo = document.getElementById('currentSong');
        audio.src = songs[currentSongIndex].url;
        songInfo.textContent = `${songs[currentSongIndex].title} - ${songs[currentSongIndex].artist}`;
    }
  
    function playAudio() {
        const audio = document.getElementById('audio');
        audio.play();
    }
  
    function stopAudio() {
        const audio = document.getElementById('audio');
        audio.pause();
        audio.currentTime = 0;
    }
  
    function nextSong() {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        updateSongInfo();
        playAudio();
    }
  
    function prevSong() {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        updateSongInfo();
        playAudio();
    }
  
    document.getElementById('start').addEventListener('click', playAudio);
    document.getElementById('stop').addEventListener('click', stopAudio);
    document.getElementById('next').addEventListener('click', nextSong);
    document.getElementById('prev').addEventListener('click', prevSong);
  
    updateSongInfo();
  });
  
  
    // Scribble Note functionality
    let canvas = document.getElementById('scribble-canvas');
    let ctx = canvas.getContext('2d');
    let scribbleContainer = document.getElementById('scribble-container');
    let noteTextarea = document.getElementById('note-textarea');
    let scribbleHeadingInput = document.getElementById('scribble-heading');
    let savedScribblesContainer = document.getElementById('saved-scribbles-container');
    let isDrawing = false;
    let editingIndex = -1;
  
    canvas.width = scribbleContainer.clientWidth;
    canvas.height = scribbleContainer.clientHeight;
  
    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
    });
  
    canvas.addEventListener('mousemove', (e) => {
        if (isDrawing) {
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
        }
    });
  
    canvas.addEventListener('mouseup', () => {
        isDrawing = false;
    });
  
    canvas.addEventListener('mouseleave', () => {
        isDrawing = false;
    });
  
    document.getElementById('clear-canvas').addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        noteTextarea.value = '';
        scribbleHeadingInput.value = '';
        editingIndex = -1;
    });

    document.getElementById('joinMeetButton').addEventListener('click', function() {
        const meetLink = document.getElementById('meetLink').value;
        document.getElementById('googleMeetFrame').src = meetLink;
      });
  
    document.getElementById('save-canvas').addEventListener('click', () => {
        let scribbleData = {
            heading: scribbleHeadingInput.value,
            note: noteTextarea.value,
            image: canvas.toDataURL()
        };
  
        saveScribble(scribbleData);
  
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        noteTextarea.value = '';
        scribbleHeadingInput.value = '';
        editingIndex = -1;
    });
  
    function saveScribble(scribbleData) {
        let savedScribbles = JSON.parse(localStorage.getItem('savedScribbles')) || [];
  
        if (editingIndex !== -1) {
            savedScribbles[editingIndex] = scribbleData;
            editingIndex = -1;
        } else {
            savedScribbles.push(scribbleData);
        }
  
        localStorage.setItem('savedScribbles', JSON.stringify(savedScribbles));
        displaySavedScribbles();
    }
  
    function displaySavedScribbles() {
        let savedScribbles = JSON.parse(localStorage.getItem('savedScribbles')) || [];
        savedScribblesContainer.innerHTML = '';
  
        savedScribbles.forEach((scribble, index) => {
            let savedScribbleDiv = document.createElement('div');
            savedScribbleDiv.classList.add('saved-scribble');
  
            let headingDiv = document.createElement('div');
            headingDiv.textContent = scribble.heading;
  
            let img = new Image();
            img.src = scribble.image;
            img.onload = function () {
                savedScribbleDiv.appendChild(img);
            };
  
            let editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', function () {
                loadScribbleForEdit(index);
            });
  
            let deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', function () {
                deleteScribble(index);
            });
  
            savedScribbleDiv.appendChild(headingDiv);
            savedScribbleDiv.appendChild(editButton);
            savedScribbleDiv.appendChild(deleteButton);
  
            savedScribblesContainer.appendChild(savedScribbleDiv);
        });
    }
  
    function deleteScribble(index) {
        let savedScribbles = JSON.parse(localStorage.getItem('savedScribbles')) || [];
        savedScribbles.splice(index, 1);
        localStorage.setItem('savedScribbles', JSON.stringify(savedScribbles));
        displaySavedScribbles();
    }
  
    function loadScribbleForEdit(index) {
        let savedScribbles = JSON.parse(localStorage.getItem('savedScribbles')) || [];
        let scribble = savedScribbles[index];
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let img = new Image();
        img.src = scribble.image;
        img.onload = function () {
            ctx.drawImage(img, 0, 0);
        };
        noteTextarea.value = scribble.note;
        scribbleHeadingInput.value = scribble.heading;
        editingIndex = index;
    }
  
    displaySavedScribbles();
  
    // Pomodoro Timer functionality
    let pomodoroMinutesInput = document.getElementById('pomodoroMinutes');
    let setTimeButton = document.getElementById('setTimeButton');
    let startButton = document.getElementById('startButton');
    let pauseButton = document.getElementById('pauseButton');
    let resetButton = document.getElementById('resetButton');
    let timerDisplay = document.getElementById('timer');
    let interval;
    let pomodoroTime = 25 * 60;
  
    setTimeButton.addEventListener('click', setPomodoroTime);
    startButton.addEventListener('click', startTimer);
    pauseButton.addEventListener('click', pauseTimer);
    resetButton.addEventListener('click', resetTimer);
  
    function setPomodoroTime() {
        let minutes = parseInt(pomodoroMinutesInput.value);
        if (!isNaN(minutes) && minutes > 0) {
            pomodoroTime = minutes * 60;
            timerDisplay.textContent = formatTime(pomodoroTime);
        }
    }
  
    function startTimer() {
        interval = setInterval(() => {
            pomodoroTime--;
            timerDisplay.textContent = formatTime(pomodoroTime);
            if (pomodoroTime <= 0) {
                clearInterval(interval);
                pomodoroTime = 0;
                timerDisplay.textContent = formatTime(pomodoroTime);
                alert('Pomodoro session ended!');
            }
        }, 1000);
  
        startButton.disabled = true;
        pauseButton.disabled = false;
    }
  
    function pauseTimer() {
        clearInterval(interval);
        startButton.disabled = false;
        pauseButton.disabled = true;
    }
  
    function resetTimer() {
        clearInterval(interval);
        pomodoroTime = 25 * 60;
        timerDisplay.textContent = formatTime(pomodoroTime);
        startButton.disabled = false;
        pauseButton.disabled = true;
    }
  
    function formatTime(seconds) {
        let mins = Math.floor(seconds / 60);
        let secs = seconds % 60;
        return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
  
    // Daily Checklist functionality
    let taskList = document.getElementById('task-list');
    let addTaskInput = document.getElementById('add-task-input');
    let addTaskButton = document.getElementById('add-task-button');
  
    addTaskButton.addEventListener('click', addNewTask);
  
    taskList.addEventListener('click', function (event) {
        if (event.target.classList.contains('delete-task')) {
            deleteTask(event.target.parentElement);
        } else if (event.target.type === 'radio') {
            updateRating(event.target);
        }
    });
  
    function addNewTask() {
        let taskName = addTaskInput.value.trim();
        if (taskName !== '') {
            addTask(taskName);
            addTaskInput.value = '';
        }
    }
  
    function addTask(taskName) {
        let li = document.createElement('li');
        li.classList.add('task-item');
        li.innerHTML = `
          <span>${taskName}</span>
          <div class="star-rating">
            <input type="radio" id="${taskName}-star5" name="${taskName}-rating" value="5" />
            <label for="${taskName}-star5">&#9733;</label>
            <input type="radio" id="${taskName}-star4" name="${taskName}-rating" value="4" />
            <label for="${taskName}-star4">&#9733;</label>
            <input type="radio" id="${taskName}-star3" name="${taskName}-rating" value="3" />
            <label for="${taskName}-star3">&#9733;</label>
            <input type="radio" id="${taskName}-star2" name="${taskName}-rating" value="2" />
            <label for="${taskName}-star2">&#9733;</label>
            <input type="radio" id="${taskName}-star1" name="${taskName}-rating" value="1" />
            <label for="${taskName}-star1">&#9733;</label>
          </div>
          <button class="delete-task">Delete</button>
        `;
        taskList.appendChild(li);
    }
  
    function deleteTask(taskElement) {
        taskElement.remove();
    }
  
    function updateRating(radioInput) {
        let starLabels = radioInput.parentElement.querySelectorAll('label');
        starLabels.forEach(label => {
            label.style.color = '#ccc';
        });
        let currentLabel = radioInput.nextElementSibling;
        while (currentLabel) {
            currentLabel.style.color = '#ffa500';
            currentLabel = currentLabel.nextElementSibling;
        }
    }
    document.addEventListener('DOMContentLoaded', () => {
        // Existing functionality
        
        // TIL (Today I Learned) functionality
        const tilInput = document.getElementById('til-input');
        const addTilButton = document.getElementById('add-til-button');
        const tilList = document.getElementById('til-list');
        
        addTilButton.addEventListener('click', addTil);
        
        function addTil() {
            const tilText = tilInput.value.trim();
            if (tilText !== '') {
                const tilItem = createTilItem(tilText);
                tilList.appendChild(tilItem);
                saveTil(tilText);
                tilInput.value = '';
            }
        }
        
        function createTilItem(text) {
            const li = document.createElement('li');
            li.textContent = text;
            
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => {
                li.remove();
                removeTil(text);
            });
            
            li.appendChild(deleteButton);
            return li;
        }
        
        function saveTil(text) {
            const tilData = {
                text: text,
                timestamp: Date.now()
            };
            let tilItems = JSON.parse(localStorage.getItem('tilItems')) || [];
            tilItems.push(tilData);
            localStorage.setItem('tilItems', JSON.stringify(tilItems));
        }
        
        function removeTil(text) {
            let tilItems = JSON.parse(localStorage.getItem('tilItems')) || [];
            tilItems = tilItems.filter(item => item.text !== text);
            localStorage.setItem('tilItems', JSON.stringify(tilItems));
        }
        
        function loadTils() {
            let tilItems = JSON.parse(localStorage.getItem('tilItems')) || [];
            const now = Date.now();
            tilItems = tilItems.filter(item => now - item.timestamp < 24 * 60 * 60 * 1000); // Filter out items older than 24 hours
            localStorage.setItem('tilItems', JSON.stringify(tilItems));
            tilItems.forEach(item => {
                const tilItem = createTilItem(item.text);
                tilList.appendChild(tilItem);
            });
        }
        
        loadTils();
        
            // Floating emoji functionality
            const floatingEmoji = document.getElementById('floating-emoji');
        
            floatingEmoji.addEventListener('click', () => {
                alert('You clicked the emoji!');
            });

            const announcementBoard = document.getElementById('announcement-board');

    const announcements = [
        '🚨 Get ready for the HyperVerge Hackathon 2024!',
        '📝 New Product Launch: HyperVerge V4',
        "🌍 HyperVerge's Expansion into New Markets 🌍",
        '📅 Upcoming Webinar: The Future of AI in Financial Services'
    ];

    function addAnnouncement(message) {
        const announcementDiv = document.createElement('div');
        announcementDiv.classList.add('announcement-item');
        announcementDiv.textContent = message;
        announcementBoard.appendChild(announcementDiv);
    }

    // Add initial announcements
    announcements.forEach(addAnnouncement);

    // Function to scroll announcements
    function scrollAnnouncements() {
        const firstChild = announcementBoard.firstElementChild;
        announcementBoard.appendChild(firstChild.cloneNode(true));
        firstChild.style.marginTop = `-${firstChild.offsetHeight}px`;
        setTimeout(() => {
            firstChild.remove();
        }, 1000);
    }

    // Scroll announcements every 5 seconds
    setInterval(scrollAnnouncements, 100000);
    const opportunityForm = document.getElementById('opportunity-form');
    const opportunityList = document.getElementById('opportunity-list');

    opportunityForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const teamName = document.getElementById('team-name').value;
        const problemDescription = document.getElementById('problem-description').value;

        if (teamName && problemDescription) {
            const opportunityItem = document.createElement('div');
            opportunityItem.classList.add('opportunity-item');
            opportunityItem.innerHTML = `
                <h3>Opportunity by ${teamName}</h3>
                <p>${problemDescription}</p>
            `;

            opportunityList.appendChild(opportunityItem);

            // Clear the form
            opportunityForm.reset();
        } else {
            alert('Please fill out both fields.');
        }
    });

        const issueForm = document.getElementById('issue-form');
        const issueList = document.getElementById('issue-list');
    
        issueForm.addEventListener('submit', function(event) {
            event.preventDefault();
    
            const issueTitle = document.getElementById('issue-title').value;
            const issueDescription = document.getElementById('issue-description').value;
    
            if (issueTitle && issueDescription) {
                const issueItem = document.createElement('div');
                issueItem.classList.add('issue-item');
                issueItem.innerHTML = `
                    <div>
                        <h3>${issueTitle}</h3>
                        <p>${issueDescription}</p>
                    </div>
                    <div class="issue-status">
                        <button class="status-button red" onclick="changeStatus(this, 'red')"></button>
                        <button class="status-button yellow" onclick="changeStatus(this, 'yellow')"></button>
                        <button class="status-button green" onclick="changeStatus(this, 'green')"></button>
                    </div>
                `;
    
                issueList.appendChild(issueItem);
    
                // Clear the form
                issueForm.reset();
            } else {
                alert('Please fill out both fields.');
            }
        });
    });
    
    function changeStatus(button, status) {
        const statusButtons = button.parentElement.querySelectorAll('.status-button');
        statusButtons.forEach(btn => {
            btn.classList.remove('selected');
        });
        button.classList.add('selected');
    
        const issueItem = button.closest('.issue-item');
        issueItem.classList.remove('red', 'yellow', 'green');
        issueItem.classList.add(status);
    }
    
        

