import styles from './../style/ui.scss';
import Border from './border';

export default class SelectBorder extends Border {
  constructor(){
    super('select');

    this.overlay = document.createElement('div');
    this.overlay.classList.add(styles.overlay);
    document.body.appendChild(this.overlay);
  }

  show(){
    super.show();
    this.overlay.classList.add(styles.visible);
  }

  hide(){
    super.hide();
    this.overlay.classList.remove(styles.visible);
  }
}

