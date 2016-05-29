import toArray from 'lodash/toArray';
import isEqual from 'lodash/isEqual';
import { Delegate } from 'dom-delegate';
import OriginalContent from './originalContent';
import styles from './style/ui.scss';
import SelectBorder from './border/selectBorder';
import ApplyBorder from './border/applyBorder';
import elementsFromPoint from './utils/elementsFromPoint';
import pasteHtmlAtCaret from './utils/pasteHtmlAtCaret';

class UI{
  constructor() {
    this.selectBorder = new SelectBorder();
    this.applyBorder = new ApplyBorder({
      save: (e) => {
        this.saveElement();
      },
      cancel: (e) => {
        this.cancelElement();
      }
    });
    this.active = false;
    this.hoveredElement = null;
    this.createPanel();
    this.bindEvents();
  }

  createPanel(){
    this.panel = document.createElement('div');
    this.panel.classList.add(styles.panel);

    const btnEdit = document.createElement('button');
    btnEdit.innerHTML = 'Выбрать элемент';
    const $btnEdit = new Delegate(btnEdit);
    $btnEdit.on('click', this.activateEditor.bind(this));
    this.panel.appendChild(btnEdit);

    document.body.appendChild(this.panel);
    return this.panel;
  }

  bindEvents(){
    this.$document = new Delegate(document.body);
    this.$document.on('keydown', e => {
      if(!this.active) return;
      if(e.keyCode == 27){ // esc
        return this.deactivateEditor();
      }
      if(e.keyCode == 13){ // enter
        e.preventDefault();
        e.stopPropagation();
        pasteHtmlAtCaret('<br>');
      }
    });

    this.$document.on('mousedown', e => {
      if(!this.active) return;
      if(this.selectedElement) return;
      this.checkList(this.hoveredElement);
      this.selectElement(this.hoveredElement);
    });

    this.$document.on('mousemove', e => {
      if(!this.active) return;
      const elements = elementsFromPoint(e.clientX, e.clientY);
      this.hoveredElement = elements[1];
      this.selectBorder.positionateBorder(this.hoveredElement);
    });
  }

  activateEditor() {
    this.selectBorder.show();
    this.active = true;
  }

  deactivateEditor(){
    this.selectBorder.hide();
    this.applyBorder.hide();
    this.deselectElement();
    this.active = false;
  }

  selectElement(el){
    this.elementOriginalContent = el.innerHTML;
    this.selectedElement = el;

    this.setEditable(el);
    this.selectBorder.hide();
    this.applyBorder.positionateBorder(el);
    this.applyBorder.show();
    setTimeout(() => el.focus(), 0);
  }

  deselectElement(){
    if(this.selectedElement)
      this.removeEditable(this.selectedElement);
    this.selectedElement = null;
  }

  saveElement(){
    OriginalContent.updateElementContent(this.selectedElement);
    this.deactivateEditor();
  }

  cancelElement(){
    this.selectedElement.innerHTML = this.elementOriginalContent;
    this.deactivateEditor();
  }

  // TODO: replace el.childNodes to el.children and remove nodeType checking
  setEditable(el){
    el.setAttribute('contenteditable', 'true');
    const childs =  Array.prototype.slice.call(el.childNodes);
    childs.forEach(child => {
      if(child.nodeType == document.ELEMENT_NODE){
        child.setAttribute('contenteditable', 'false');
      }
    });
  }

  removeEditable(el){
    el.removeAttribute('contenteditable');
    const childs =  Array.prototype.slice.call(el.childNodes);
    childs.forEach(child => {
      if(child.nodeType == document.ELEMENT_NODE){
        child.removeAttribute('contenteditable');
      }
    });
  }

  checkList(el){
    const parent = el.parentNode;
    const children =  toArray(parent.children);
    const rootTag = elSignature(el);
    const structure = toArray(el.children).map(el => elSignature(el));
    const isListItem = children.every(el => {
      return isEqual(rootTag, elSignature(el))
        && toArray(el.children).every((el, i) => isEqual(elSignature(el), structure[i]));
    });
    console.log(isListItem);
  }
}

function elSignature(el){
  return el.tagName + '.' + toArray(el.classList).sort().join('.');
}

export default new UI;