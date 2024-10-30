'use strict'
// CL =  controler
class KeeQuotes {
 constructor(){
  this.delay = 2000
  this.data = {}
  // setup fonts
  this.get_data(setting.fonts).then(fonts=>{
   this.setup_stylesheet(fonts)
  })
  // setup style
  this.get_data(setting.style).then(style=>{
   style.map(item=>{item.href = setting.URL_KQ + item.href})
   this.setup_stylesheet(style)
  })

  // get license
  this.get_data(setting.license).then(license=>{
   setting.license_data = license.data
  })

  // setup Vue
  this.get_data(setting.data).then(data=>{
   this.data = Object.assign(data)
   // setup data tool
   Object.keys(this.data.tools).map(item=>{
    let tool = this.data.tools[item]
    tool = tool.map(details=> {return this.data.tool_detail.find(d=>d.id == details)})
    this.data.tools[item] = tool.filter(e=>e)
   })
   CL = new Vue({ el: setting.dom_main,  data: this.data })
   CL.$set(CL,'setting',setting)
   let modal = document.querySelector('#modal-window-card')
   if(!modal)setTimeout(()=>{
    let latest_template = document.querySelector('[data-id="latest_template"]')
    if(latest_template)latest_template.click()
    KQC.close_loading()
   },this.delay)
  })

  document.addEventListener('click', (event)=>{
   document.querySelectorAll('[data-toggle-outclick]').forEach(element=>{
    let q = element.getAttribute('data-toggle-outclick')
    let e = element.querySelector(q)
     if(!element.contains(event.target) && e) { // or use: event.target.closest(selector) === null
      e.style.display = 'none'
     }else if(e){
      //e.setAttribute('style','')
     }
   })

  })

 }
 async get_data(url){
  let requestOptions = {
   method: 'GET',
   headers: {
    "Set-Cookie": "promo_shown=1; Max-Age=2600000; Secure",
    "key-license":setting.K_API
   },
   redirect: 'follow'
  };
  let resulf = await fetch(url, requestOptions)
      .then(response => response.json())
      .then(result => {return result } )
      .catch(error => { return [] })
  return resulf
 }

 async send_post_data(data){
  let formdata = new FormData()
  data.form.map(item=>{
   formdata.append(item.name, item.value);
  })
  let requestOptions = {
   method: 'POST',
   headers: {
    "Set-Cookie": "promo_shown=1; Max-Age=2600000; Secure",
    "key-license":setting.K_API
   },
   body: formdata,
   redirect: 'follow'
  }
  return await fetch(data.url, requestOptions)
      .then(response => response.json())
      .then(result => {return result})
      .catch(error => console.log('error', error));
 }

 async upload_media(data){
  let myHeaders = new Headers();
  myHeaders.append("key-license", setting.K_API)
  let formdata = new FormData()
  formdata.append("image", data.image, data.image.name)
  formdata.append("thumb_image", data.thumb_image, 'thumbnai_'+data.image.name)

  let requestOptions = {
   method: 'POST',
   headers: myHeaders,
   body: formdata,
   redirect: 'follow'
  }
  return await fetch(data.url, requestOptions)
      .then(response => response.json())
      .then(result => {return result } )
      .catch(error => console.log('error', error))

 }
 async delete_media(data){
  let myHeaders = new Headers();
  myHeaders.append("key-license", setting.K_API);
  let requestOptions = {
   method: 'GET',
   headers: myHeaders,
   redirect: 'follow'
  };
  return await fetch(data.url, requestOptions)
      .then(response => response.json())
      .then(result => {return result})
      .catch(error => console.log('error', error));
 }
 setup_stylesheet(data){
  let head = document.querySelector('head')
  data.filter(item=>{
   let link =  document.createElement('link')
   link.setAttribute('rel','stylesheet')
   link.setAttribute('id',item.id)
   link.setAttribute('href',item.href)
   head.appendChild(link)
  })
 }

 display_library(library=1){
  let lib = this.data.library[library]
  if(KQC.checkGuest() && lib.id == "upload_media"){
   KQC.alertAccount()
   return
  }
  this.data.controls.add_elements = true
  this.data.controls.basic = false
  this.data.controls.library_display = library
  this.data.library_detail = this.data.library_modules[lib.id]??this.data.library[library]
 }


 display_library_detail(event){
  let name = event.getAttribute('data-module')
  this.data.controls.add_elements = true
  this.data.controls.basic = false
  this.data.library_detail = this.data.library_modules[name]
 }

 diplay_pages(){
  this.data.controls.add_elements = true
  this.data.controls.basic = false
  this.data.library_detail = this.data.library_modules.pages
 }

 display_library_product(event){
  let name = event.getAttribute('data-module')
  let type = event.getAttribute('data-type')
  this.data.controls.add_elements = true
  this.data.controls.basic = false
  this.data.library_detail = this.data.library_modules[name]
  this.data.library_detail.query.types = type
 }

 close_library(library=0){
  CL.controls.tools = false
  CL.controls.module = false
  CL.controls.tools_extra = []
  CL.controls.add_elements = false
  CL.controls.basic = true
  CL.controls.resize = ""
 }

 products(){
  let id = 'products'
  this.data.controls.library_display = this.library.findIndex(item=>item.id == id)
 }
 backgrounds(){
  let id = 'backgrounds'
  this.data.controls.library_display = this.library.findIndex(item=>item.id == id)
 }

 getElementPosition(obj) {
  var curleft = 0, curtop = 0;
  if (obj.offsetParent) {
   do {
    curleft += obj.offsetLeft;
    curtop += obj.offsetTop;
   } while (obj = obj.offsetParent);
   return { x: curleft, y: curtop };
  }
  return undefined;
 }

 getEventLocation(element,event){
  let curleft = 0, curtop = 0, pos;
  if (element.offsetParent) {
   do {
    curleft += element.offsetLeft;
    curtop += element.offsetTop;
   } while (element = element.offsetParent);
   pos =  { x: curleft, y: curtop };
   return {
    x: (event.pageX - pos.x),
    y: (event.pageY - pos.y)
   };

  }
 }

 rgbToHex(r, g, b) {
  if (r > 255 || g > 255 || b > 255)
   throw "Invalid color component";
  return ((r << 16) | (g << 8) | b).toString(16);
 }

 resizeImage (settings) {
  var file = settings.file;
  var maxSize = settings.maxsize;
  var reader = new FileReader();
  var image = new Image();
  var canvas = document.createElement('canvas');
  var dataURItoBlob = function (dataURI) {
   var bytes = dataURI.split(',')[0].indexOf('base64') >= 0 ?
       atob(dataURI.split(',')[1]) :
       unescape(dataURI.split(',')[1]);
   var mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
   var max = bytes.length;
   var ia = new Uint8Array(max);
   for (var i = 0; i < max; i++)
    ia[i] = bytes.charCodeAt(i);
   return new Blob([ia], { type: mime });
  };
  var resize = function () {
   var width = image.width;
   var height = image.height;
   if (width > height) {
    if (width > maxSize) {
     height *= maxSize / width;
     width = maxSize;
    }
   } else {
    if (height > maxSize) {
     width *= maxSize / height;
     height = maxSize;
    }
   }
   canvas.width = width;
   canvas.height = height;
   canvas.getContext('2d').drawImage(image, 0, 0, width, height);
   var dataUrl = canvas.toDataURL('image/jpeg');
   return dataURItoBlob(dataUrl);
  };
  return new Promise(function (ok, no) {
   if (!file.type.match(/image.*/)) {
    no(new Error("Not an image"));
    return;
   }
   reader.onload = function (readerEvent) {
    image.onload = function () { return ok(resize()); };
    image.src = readerEvent.target.result;
   };
   reader.readAsDataURL(file);
  });
 }

 async getBase64FromUrl(url){
  return await fetch(url)
      .then(response => response.blob())
      .then(blob => new Promise((resolve, reject) => {
       const reader = new FileReader()
       reader.onloadend = () => resolve(reader.result)
       reader.onerror = reject
       return  reader.readAsDataURL(blob)
      }));
 }

  makeid() {
  let length = Math.random() * 100
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
   result += characters.charAt(Math.floor(Math.random() *
       charactersLength));
  }
  return result;
 }

 // end class
}
Vue.use(VTooltip)
var CL,KQ = new KeeQuotes()

let modal = document.getElementById('modal-window-card');
if(modal){
 ( function ( blocks, element ) {
  var el = element.createElement;

  blocks.registerBlockType( 'keequotes-graphic-design-online/my-design-graphic', {
   edit: function () {
    let check =  document.querySelector('.editor-block-list-item-keequotes-graphic-design-online-my-design-graphic')
    if(check){
     let button = document.getElementById('add-design-editor')
     button.click();
     let latest_template = document.querySelector('[data-id="latest_template"]')
     if(latest_template)latest_template.click()
    }

    return null
   },
   // save: function () {
   //  let button = document.getElementById('add-design-editor')
   //  button.click();
   //  return null
   // },
  } );
 } )( window.wp.blocks, window.wp.element );

}

