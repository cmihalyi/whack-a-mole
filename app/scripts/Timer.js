var Timer = class{
  constructor(element, duration){
    this.ele = element;
    this.duration = duration;
  }

  // window.onload = function () {
  //   var fiveMinutes = 60 * 5, display = document.getElementById('timer');
  //   startTimer(fiveMinutes, display);
  // };

  startTimer() {
    var timer = this.duration, minutes, seconds;

    setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        this.ele.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            timer = this.duration;
        }
    }, 1000);
  }

  stopTimer(){}

  resetTimer(){}
}
