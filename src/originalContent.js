import fetch from 'isomorphic-fetch';

class OriginalContent {
  constructor(){
    this.field = "admin";
    this.fieldName = 'data-' + this.field;
    this.needReload = false;
    this.searchIndex = {};

    fetch(window.location)
      .then(res => res.text())
      .then(res => {
        var parser = new DOMParser();
        this.doctype = this.getDoctype(res);
        this.doc = parser.parseFromString(res, "text/html");

        this.buildSearchIndex();

        if(this.needReload) {
          this.processElements(this.doc);
          this.saveContent();
          location.reload();
        }
      });
  }

  buildSearchIndex(){
    const elements = this.doc.getElementsByTagName('*'),
      eLength = elements.length;
    for(let i = 0; i < eLength; i ++){
      const elem = elements[i],
        index = elem.getAttribute(this.fieldName);
      if(!index){
        this.needReload = true;
        return this.index;
      }
      this.searchIndex[index] = elem;
    }
    return this.index;
  }

  processElements(elements, startIndex = ''){
    const childCount = elements.children.length;
    for(let i = 0; i < childCount; i++ ){
      const index = startIndex + i,
        elem = elements.children[i];
      elem.setAttribute( this.fieldName, index );
      if(elem.childElementCount){
        this.processElements(elem, index);
      }
    }
  }

  getDoctype(data){
    const doctypeRegex = /^\s*(<!DOCTYPE.*?>)?([\S\s]*)/i;
    const [, doctype] = doctypeRegex.exec(data);
    return doctype;
  };

  saveContent(){
    var html = this.doctype + "\n" + this.doc.documentElement.outerHTML;
    $.post('save.php', { html });
  }

  updateElementContent(el){
    const id = el.getAttribute(this.fieldName);
    this.searchIndex[id].innerHTML = el.innerHTML;
    this.saveContent();
  }
  //findSimilarNodeByContent(content){
  //  const elems = [];
  //  this.elements.forEach(elem => {
  //    if(elem.innerHTML.indexOf(content) === 0){
  //      elems.push(elem);
  //    }
  //
  //  });
  //  return elems;
  //}
}

export default new OriginalContent();

