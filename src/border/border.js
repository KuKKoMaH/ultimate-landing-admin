import styles from './../style/ui.scss';

export default class Border{
  constructor(colorClass){
    this.element = document.createElement('div');
    this.element.classList.add(styles.border);
    if(colorClass) this.element.classList.add(styles[colorClass]);
    document.body.appendChild(this.element);

  }

  positionateBorder(el){
    const coordinates = el.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.scrollTop || body.scrollTop;
    const scrollLeft = window.pageXOffset || document.scrollLeft || body.scrollLeft;
    const clientTop = document.clientTop || body.clientTop || 0;
    const clientLeft = document.clientLeft || body.clientLeft || 0;
    const top  = coordinates.top +  scrollTop - clientTop;
    const left = coordinates.left + scrollLeft - clientLeft;

    this.position = [left, top];
    this.dimension = [coordinates.width, coordinates.height];
    this.element.style.top = top + 'px';
    this.element.style.left = left + 'px';
    this.element.style.width = coordinates.width + 'px';
    this.element.style.height = coordinates.height + 'px';
  }

  show(){
    this.element.classList.add(styles.visible);
  }

  hide(){
    this.element.classList.remove(styles.visible);
  }


}