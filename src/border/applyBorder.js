import { Delegate } from 'dom-delegate';
import styles from './../style/ui.scss';
import Border from './border';

export default class ApplyBorder extends Border {
  constructor(options){
    super('apply');

    options = options || {};
    const saveAction = options.save || function(){};
    const cancelAction = options.cancel || function(){};

    this.btnContaier = document.createElement('div');
    this.btnContaier.classList.add(styles.button_container);

    const btnSave = document.createElement('button');
    btnSave.innerHTML = 'Сохранить';
    const $btnSave = new Delegate(btnSave);
    $btnSave.on('click', saveAction);

    const btnCancel = document.createElement('button');
    btnCancel.innerHTML = 'Отменить';
    const $btnCancel = new Delegate(btnCancel);
    $btnCancel.on('click', cancelAction);


    this.btnContaier.appendChild(btnSave);
    this.btnContaier.appendChild(btnCancel);
    document.body.appendChild(this.btnContaier);
  }

  positionateBorder(el){
    super.positionateBorder(el);
    this.btnContaier.style.left = this.position[0] + 'px';
    this.btnContaier.style.top = this.position[1] - 20 + 'px';
  }

  show(){
    super.show();
    this.btnContaier.classList.add(styles.visible);
  }

  hide(){
    super.hide();
    this.btnContaier.classList.remove(styles.visible);
  }
}

