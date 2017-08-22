var Timer = class{
  constructor(element, duration){
    this.ele = element;
    this.duration = duration;
    this.timer = this.duration;
    this.minutes;
    this.seconds;
    this.timeDone = new Event('timeDone', {detail: {timer: 'done'}});
    this.timeWarning = new Event('timeWarning');
    this.interval;
  }

  intializeInterval(){
    this.minutes = parseInt(this.timer / 60, 10)
    this.seconds = parseInt(this.timer % 60, 10);

    this.minutes = this.minutes < 10 ? '0' + this.minutes : this.minutes;
    this.seconds = this.seconds < 10 ? '0' + this.seconds : this.seconds;
    this.ele.textContent = this.minutes + ':' + this.seconds;

    if(this.timer < 5){
      window.dispatchEvent(this.timeWarning);
    }

    if (--this.timer < 0) {
      //dispatch time up event
      this.stopTimer();
      window.dispatchEvent(this.timeDone);
    }
  }

  startTimer(){
    this.interval = setInterval(this.intializeInterval.bind(this), 1000);
  }

  stopTimer(){
    clearInterval(this.interval);
  }

  resetTimer(){}
}

var Game = class{
  constructor(){
    this.items;
    this.itemIdx;
    this.gameTimer;
    this.gameState;
    this.moleInterval;
    this.moleFrequency;
    this.moleTimeoutPeriod;
    this.playerName;
    this.difficulty;
    this.score = 0;
    this.scoreMultiplier;
    this.hiScores = [];
    this.progressBlock = document.getElementById('progress-block');
    this.startButton = document.getElementById('start-button');
    this.resetButton = document.getElementById('reset-button');
    this.prePanel = document.getElementById('pre-panel');
    this.infoPanel = document.querySelector('.info-block');
    this.runPanel = document.getElementById('run-panel');
    this.endPanel = document.getElementById('end-panel');
    this.hiScoreList = document.getElementById('hi-scores');
    this.preGameEvent = new CustomEvent('preGame', {detail: {gameState: 'pre'}});
    this.loadGameEvent = new CustomEvent('loadGame', {detail: {gameState: 'load'}});
    this.runGameEvent = new CustomEvent('runGame', {detail: {gameState: 'run'}});
    this.endGameEvent = new CustomEvent('endGame', {detail: {gameState: 'end'}});
    this.resetGameEvent = new CustomEvent('resetGame', {detail: {gameState: 'reset'}});
    this.moleHitHandler = this.moleHit.bind(this);
    this.updateProgressBar = this.updateProgressBar.bind(this, this.progressBlock.querySelector('.progress'), this.progressBlock.querySelector('.progress-bar'));
    this.progressInterval;

    window.dispatchEvent(this.preGameEvent);
    this.manageGameState();
  }

  startButtonPressed(e){
    window.dispatchEvent(this.loadGameEvent);
    this.startButton.classList.add('d-none');
    this.progressBlock.classList.remove('d-none');
    this.progressInterval = setInterval(this.updateProgressBar, 10);
  }

  resetButtonPressed(e){
    window.dispatchEvent(this.resetGameEvent);
  }

  generateRandomNumber(){
    return Math.floor(Math.random() * this.items.length);
  }

  getItems(){
    return this.runPanel;
  }

  initializeMoles(){
    this.items = Array.from(this.runPanel.children);
  }

  getItemIndex(){
    return this.itemIdx;
  }

  setItemIndex(val){
    this.itemIdx = val;
  }

  getGameState(){
    return this.gameState;
  }

  setGameState(val){
    this.gameState = val;
  }

  resetScore(){
    this.score = document.getElementById('score').textContent = 0;
  }

  getScore(){
    return this.score;
  }

  setScore(val){
    this.score = document.getElementById('score').textContent = parseInt(val) + (1 * this.scoreMultiplier);
  }

  removeAllChildElements(ele){
    while (ele.firstChild) {
        ele.removeChild(ele.firstChild);
    }
  }

  getPlayerName(){
    return this.playerName;
  }

  setPlayerName(val){
    if(val){
      this.playerName = val;
    }else{
      this.playerName = "MoleKillah";
    }
  }

  resetPlayerName(){
    document.getElementById('player-name').value = '';
  }

  getDifficulty(){
    return this.difficulty;
  }

  setDifficulty(val){
    this.difficulty = val;
  }

  getScoreMultiplier(){
    return this.scoreMultiplier;
  }

  setScoreMultiplier(val){
    this.scoreMultiplier = val;
  }

  setDifficultyValues(){
    switch(this.getDifficulty()){
      case 'novice':
        this.setMoleFrequency(1000);
        this.setMoleTimeoutPeriod(1500);
        this.setScoreMultiplier(1);
        break;
      case 'master':
        this.setMoleFrequency(300);
        this.setMoleTimeoutPeriod(500);
        this.setScoreMultiplier(3);
        break;
      default:
        this.setMoleFrequency(700);
        this.setMoleTimeoutPeriod(1000);
        this.setScoreMultiplier(2);
        break;
    }
  }

  getMoleFrequency(){
    return this.moleFrequency;
  }

  setMoleFrequency(val){
    this.moleFrequency = val
  }

  getMoleTimeoutPeriod(){
    return this.moleTimeoutPeriod;
  }

  setMoleTimeoutPeriod(val){
    this.moleTimeoutPeriod = val;
  }

  //happens when on landing page
  preGame(){
    this.startButton.classList.remove('d-none'); //show start button
    this.progressBlock.classList.add('d-none'); //hide the progressbar
    this.prePanel.classList.remove('d-none'); //shows pre panel
    this.removeAllChildElements(this.hiScoreList); //reset the hi score table
    this.resetScore(); //reset the game score
    this.startButton.addEventListener('click', this.startButtonPressed.bind(this), {once: true});
  }
  //happens when loading bar is running
  loadGame(){
    this.initializeMoles(); //initalize all the mole data
    this.setPlayerName(document.getElementById('player-name').value); //set players name
    this.setDifficulty(document.querySelector('[name="difficulty"]:checked').id); //set game difficulty value
    this.setDifficultyValues(); //set the game difficulty values
    this.gameTimer = new Timer(document.getElementById('timer'), 5);  //instatiate a new game timer
  }
  //happens while game is running
  runGame(){
    console.log('start game');
    this.prePanel.classList.add('d-none'); //hides pre panel
    this.runPanel.classList.remove('d-none'); //shows run panel
    this.infoPanel.classList.remove('d-none'); //shows info panel
    this.gameTimer.startTimer();
    this.moleInterval = setInterval(this.activateMole.bind(this), this.moleFrequency);
  }
  //happens at the end page
  endGame(){
    console.log('end game');
    document.getElementById('final-score').textContent = this.getScore();
    this.setHiScores();
    this.displayHiScores();
    this.runPanel.classList.add('d-none'); //hide run panel
    this.infoPanel.classList.add('d-none'); //shows info panel
    this.endPanel.classList.remove('d-none'); //show end panel
    clearInterval(this.moleInterval); //stops timers
    this.resetButton.addEventListener('click', this.resetButtonPressed.bind(this), {once: true});
    console.log(this);
  }
  //happens between reset button and landing page appearing
  resetGame(){
    console.log('resetting game');
    this.resetPlayerName();
    this.toggleTimerColor();
    this.progressBlock.querySelector('.progress-bar').setAttribute('style', 'width: 0%');
    this.endPanel.classList.add('d-none'); //hide end panel
    this.setGameState('pre');
    this.manageGameState();
  }

  setHiScores(){
    //need to see if we actually scored at least a point
    if(this.getScore() > 0){
      //needs to be greater than the score at the end of the array (assuming array is sorted)
      //check to see if hi scores exist
      if(this.hiScores.length > 0){

        //if array is at max size then looping through should only replace if you find a higer score
        if(this.hiScores.length >= 5){
          //loop through high scores and only add when you have a score that beats out another
          for (var i = 0; i < this.hiScores.length; i++){
          	if(this.getScore() >= this.hiScores[i].score){
              this.hiScores.splice(i, 0, {
                "name" : this.getPlayerName(),
                "difficulty": this.getDifficulty(),
                "score": this.getScore()
              });
              //break loop
              break;
            }
          }
        }else{
          //loop through high scores and if score isn't higher than those posted add to bottom of array
          for (var i = 0; i < this.hiScores.length; i++){
          	if(this.getScore() >= this.hiScores[i].score){
              this.hiScores.splice(i, 0, {
                "name" : this.getPlayerName(),
                "difficulty": this.getDifficulty(),
                "score": this.getScore()
              });
              //break loop
              break;
            }
            else{
              console.log('score didnt beat.  add to bottom of array. array isnt full');
              this.hiScores.splice(this.hiScores.length -1, 0, {
                "name" : this.getPlayerName(),
                "difficulty": this.getDifficulty(),
                "score": this.getScore()
              });
              //break loop
              break;
            }
          }
        }

        //keep array at top 5 highest scores
        if(this.hiScores.length > 5){
          this.hiScores.pop();
        }
      }else{
        console.log('array is empty first item in');
        this.hiScores.splice(0, 0, {
          "name" : this.getPlayerName(),
          "difficulty": this.getDifficulty(),
          "score": this.getScore()
        });
      }
    }
  }

  displayHiScores(){
    console.log('display length: ' + this.hiScores.length);
    for (var i = 0; i < this.hiScores.length; i++){
      var row = document.createElement('tr');
      var pos = document.createElement('td');
      var name = document.createElement('td');
      var dif = document.createElement('td');
      var score = document.createElement('td');

      pos.textContent = i + 1;
      name.textContent = this.hiScores[i].name;
      dif.textContent = this.hiScores[i].difficulty;
      score.textContent = this.hiScores[i].score;

      row.appendChild(pos);
      row.appendChild(name);
      row.appendChild(dif);
      row.appendChild(score);
      this.hiScoreList.appendChild(row);
    }
  }

  manageGameState(){
    switch (this.getGameState()) {
      case 'reset':
        this.resetGame();
        break;
      case 'load':
        this.loadGame();
        break;
      case 'run':
        this.runGame();
        break;
      case 'end':
        this.endGame();
        break;
      default:
        this.preGame();
        break;
    }
  }

  activateMole(){
    if(this.gameState === 'run'){
      do{
        this.setItemIndex(this.generateRandomNumber());
      }while(this.items[this.getItemIndex()].classList.contains === 'active');
      //set selected mole to active
      // this.getMole(this.getItemIndex()).toggleActive();
      // this.items[this.getItemIndex()].className = 'active';
      //add active class
      // this.items[(this.getItemIndex()].addClass(this.items[this.getItemIndex()], 'active');
      this.items[this.getItemIndex()].classList.add('active');
      //add click event listener
      // this.getMoleDOMEle(this.getItemIndex()).addEventListener('click', this.moleHitHandler, {once: true})
      this.items[this.getItemIndex()].addEventListener('click', this.moleHitHandler, {once: true})
      //set mole active state to timeout
      setTimeout(this.moleTimeout.bind(this, this.items[this.getItemIndex()]), this.moleTimeoutPeriod);
    }else{
      this.manageGameState();
    }
  }

  moleTimeout(item){
    //if the mole is active
    if(item.classList.contains('active')){
      //remove event listener
      item.removeEventListener('click', this.moleHitHandler);
      //remove active class
      item.classList.remove('active');
    }
  }

  moleHit(evt){
    //remove active class
    evt.currentTarget.classList.remove('active');
    //update score
    this.setScore(this.getScore());
  }

  toggleTimerColor(){
    this.gameTimer.ele.classList.toggle('warning');
  }

  updateProgressBar(parent, bar){
    var pct = bar.offsetWidth/parent.offsetWidth * 100;

    if(pct >= 100){
      clearInterval(this.progressInterval);
      window.dispatchEvent(this.runGameEvent);
    }else{
      pct+= 20;
      pct = pct + '%';
      bar.setAttribute('style', 'width: ' + pct);
    }
  }
}

var whackamole = new Game();
window.addEventListener('timeWarning', (e) => {whackamole.toggleTimerColor()});
window.addEventListener('timeDone', (e) => whackamole.gameState = 'end');
window.addEventListener('preGame', (e) => {whackamole.setGameState(e.detail.gameState); whackamole.manageGameState()});
window.addEventListener('loadGame', (e) => {whackamole.setGameState(e.detail.gameState); whackamole.manageGameState()});
window.addEventListener('runGame', (e) => {whackamole.setGameState(e.detail.gameState); whackamole.manageGameState()});
window.addEventListener('endGame', (e) => {whackamole.setGameState(e.detail.gameState); whackamole.manageGameState()});
window.addEventListener('resetGame', (e) => {whackamole.setGameState(e.detail.gameState); whackamole.manageGameState()});
