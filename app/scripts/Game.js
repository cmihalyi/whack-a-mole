var Game = class{
  constructor(){
    this.score = 0;
    this.interval;
    this.items;
    this.itemIdx;
    this.activeMole;
    this.moleFrequency = 700;
    this.moleTimeoutPeriod = 1000;
    this.numOfMoles = 3;
    this.moleArray = document.getElementById('test-main');
    this.start = document.getElementById('start-button');
    this.moleHitHandler = this.moleHitHandler.bind(this);
    this.startGame = this.startGame.bind(this);
    this.start.addEventListener('click', this.startGame);
    this.gameTimer = new Timer;
  }

  startGame(){
    this.gameRunning = true;
    console.log('starting');
    this.initializeMoles();
    // this.gameTimer.startTimer(60, document.getElementById('timer'));
    setInterval(this.activateMole.bind(this), this.moleFrequency);
  }

  generateRandomNumber(){
    return Math.floor(Math.random() * this.items.length);
  }

  getItems(){
    return this.moleArray;
  }

  initializeMoles(){
    for(var n = 0; n < this.numOfMoles; n ++){
      var div = document.createElement("div");
      div.mole = new Mole();
      this.moleArray.appendChild(div);
    }
    this.items = Array.from(this.moleArray.children);
  }

  //debug purposes
  getItemIndex(){
    return this.itemIdx;
  }

  setItemIndex(val){
    this.itemIdx = val;
  }

  getMoleDOMEle(val){
    return this.items[val]
  }

  getMole(val){
    return this.items[val].mole
  }

  activateMole(){
    this.setItemIndex(this.generateRandomNumber());
    do{
      this.setItemIndex(this.generateRandomNumber());
    }while(this.getMole(this.getItemIndex()).getStatus());

    //set selected mole to active
    this.getMole(this.getItemIndex()).toggleActive();
    //add click event listener
    this.getMoleDOMEle(this.getItemIndex()).addEventListener('click', this.moleHitHandler, {once: true})
    //add active class
    this.getMole(this.getItemIndex()).addClass(this.items[this.getItemIndex()], 'active');
    //set mole active state to timeout
    setTimeout(this.moleTimeout.bind(this, this.items[this.getItemIndex()]), this.moleTimeoutPeriod);
  }

  moleTimeout(ele){
    //set mole to inactive
    ele.mole.toggleActive();
    //if the mole is inactive
    if(!ele.mole.getStatus()){
      //remove event listener
      ele.removeEventListener('click', this.moleHitHandler);
      //remove active class
      ele.mole.removeClass(ele, 'active');
    }
  }

  getActiveMole(){
    return this.activeMole
  }

  moleHitHandler(evt){
    console.log(evt.currentTarget.mole);
    //set mole clicked on to inactive
    evt.currentTarget.mole.toggleActive();
    //if the mole is inactive
    if(!evt.currentTarget.mole.getStatus()){
      //remove active class
      evt.currentTarget.mole.removeClass(evt.currentTarget, 'active')
      //update score
      this.setScore();
    }
  }

  getScore(){
    //return document.getElementById('score').textContent;
  }

  setScore(){
    //document.getElementById('score').textContent = parseInt(this.getScore()) + 1;
  }
};
