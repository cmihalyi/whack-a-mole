var Mole = class{
  constructor(){
    this.active = false;
  }

  toggleActive(){
    this.active = !this.active;
  }

  getStatus(){
    return this.active;
  }

  addClass(ele, val){
    ele.classList.add(val);
  }

  removeClass(ele, val){
    ele.classList.remove(val);
  }
}
