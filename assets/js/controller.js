'use strict'
class Controller {
    constructor(){
        document.addEventListener('keyup', this.ActionKey, true);
    }
    open_loading(){
        document.querySelector('.loading_page').classList.add('active')
    }
    close_loading(){
        document.querySelector('.loading_page').classList.remove('active')
    }
    async create_new(event){
        if(CL.product_active.fs){
            let over = await Swal.fire({
                title: 'Are you sure?',
                text: "You want be to overwrite this",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, overwrite it!'
            })
            if(!over.isConfirmed)return
        }
        let menu = KQ.data.menu_main.find(item=>item.id == event.getAttribute('data-id'))
        this.close_open(menu.close,KQ.data.menu_main,false)
        this.close_open(menu.open,KQ.data.menu_main,true)
        CL.menu_main.map(item=>item.class = '')
        CL.controls.editor_kq = true
        EKQ.create_product_new()
    }
    continue_edit(event){
        let menu = KQ.data.menu_main.find(item=>item.id == event.getAttribute('data-id'))
        this.close_open(menu.close,KQ.data.menu_main,false)
        this.close_open(menu.open,KQ.data.menu_main,true)
        CL.menu_main.map(item=>item.class = '')
        CL.controls.editor_kq = true
    }
    loading_product(data){

        let menu = KQ.data.menu_main.find(item=>item.id == 'create_template')
        this.close_open(menu.close,KQ.data.menu_main,false)
        this.close_open(menu.open,KQ.data.menu_main,true)
        CL.menu_main.map(item=>{
            item.class = ''
            if(item.id == 'continue_edit')item.status = false
        })
        CL.controls.editor_kq = true

        EKQ.active_data_json(data)
    }
    templates(event){
        let id = event.getAttribute('data-id')
        let menu = KQ.data.menu_main.find(item=>item.id == id)
        if(KQC.checkGuest() && id == "my_design"){
            KQC.alertAccount()
            return
        }
        this.close_open(menu.close,KQ.data.menu_main,false)
        this.close_open(menu.open,KQ.data.menu_main,true)
        CL.menu_main.map(item=>{
            item.class = ''
            if(item.id == id)item.class = 'active'
            if(item.id == 'continue_edit' && CL.product_active.fs)item.status = true
        })
        CL.controls.editor_kq = false
        CL.templates_detail = CL.templates[id]
    }
    display_tools_extras(event){
        let list = CL.tools[event.getAttribute('data-id')]
        CL.controls.tools_extra = list
        CL.controls.module = false
    }
    cancel_tool_sub(){
        CL.controls.tools_extra = []
    }
    close_open(list,data,status,type='array'){
      data.map(item=>{ if(list.indexOf(item.id)>-1)item.status = status })
    }
    ActionKey(e) {
        let check = window.event? event : e
      switch (check.key) {
          case 'Delete':
              TKQ.removeObjects()
              break
      }
      if(!check.ctrlKey)return
        switch (check.key) {
            case 'x':
                EKQ.kq_zoom(1.1)
                break
            case 'c':
                EKQ.kq_zoom(0.9)
                break
            case 'q':
                EKQ.resize()
                break
            case 'b':
                KQ.display_library()
                break

        }

    }

    async query_data(data){
        let query = ""
        Object.keys(data.query).filter(item=>{
            query +='&'+item+'='+data.query[item]
        })
        let res =  await KQ.get_data(setting.URL_API+data.slug+query)
        let resulf = res.data
        return resulf
    }

    async getTrackingUnsplash(photo){
        var requestOptions = {
            method: 'GET',
            headers: {
                "Authorization": "Bearer "+setting.token_unsplash
            },
            redirect: 'follow'
        };
        let resulf = await fetch(photo, requestOptions)
            .then(response => response.json())
            .then(result => {return result } )
            .catch(error => { return [] })
        return resulf
    }

    async query_data_by(slug,data){
        let query = ""
        Object.keys(data).filter(item=>{
            query +='&'+item+'='+data[item]
        })
        let res =  await KQ.get_data(setting.URL_API+slug+query)
        return res
    }

    async query_data_unsplash(data){
        let query = data.url
        let tags = CL.library_detail.tags_select.filter(item=>item.type=='tag')
        data.query_array.query = tags.map(item=>item.content).join(',')
        if(!tags.length)data.query_array.query = CL.library_detail.keywords.join(',')
        Object.keys(data.query_array).filter(item=>{
            query +='&'+item+'='+data.query_array[item]
        })
        let res =  await KQ.get_data(query)
        if(!res)return
        res.results = res.results.map(item=>{
            let link =  item.urls.full.split("?")[0];
           let data = {
               id:item.id,
               cover_image:item.urls.thumb,
               data:link+'?crop=max&w=4096&h=4096',
               link:item.user.links.html + CL.author_url,
               user:item.user.name,
               download:item.links.download_location
           }
            return data
        })
        return res.results
    }

    insert_product_side(type='insert_media'){
        this.download_product_side(type)
    }

    download_product_side(type='download'){
        let data = null
        if(type == 'download'){
            data = EKQ.canvas.toJSON()
        }
        else {
            //data = EKQ.data.fs
            data = CL.product_active['fs'];
        }
        this.convert_json_image(data,type)
    }

     async convert_json_image(p,type){
        KQC.open_loading()
       //et reset = 0
         console.log('convert_json_image p', p)
        if(p.backgroundImage && !this.isBase64(p.backgroundImage.src) ){
            //++reset
            p.backgroundImage.link = p.backgroundImage.src
            p.backgroundImage.src = await KQ.getBase64FromUrl(p.backgroundImage.src)
            console.log('backgroundImage', p)
        }
         console.log('check...', p)
            KQC.download_img_product(p,type)
        //
        return true
    }

     download_img_product(p,type){
        console.log('ppp', p)
        let count = p.objects.length
        let start = 0
         if(count == 0){
             Swal.fire({
                 icon: 'error',
                 text: 'Layout is empty',
             })
             KQC.close_loading()
             return
         }
        let dowload_warp = document.createElement('div')
        let canvas = document.createElement('canvas')
        canvas.id = 'download_canvas'
         canvas.width = EKQ.data.width
         canvas.height = EKQ.data.height
         dowload_warp.appendChild(canvas)
        document.querySelector('body').appendChild(dowload_warp)
        let canvas_download = new fabric.Canvas('download_canvas')
         if(EKQ.data.zoom){
             canvas_download.setZoom(EKQ.data.zoom)
         }
        canvas_download.loadFromJSON(p, canvas_download.renderAll.bind(canvas_download),(o,ob)=>{
            console.log('ob', ob)
            ++start
          if(start == count){
              setTimeout(async () => {
                  // canvas_download.setZoom(Number(EKQ.widthRatio))
                  if (type == 'download') {
                      let a = document.createElement('a')
                      a.setAttribute('href', canvas_download.toDataURL())
                      a.setAttribute('download', 'dowload design')
                      a.click()
                      KQC.close_loading()
                  }
                  if (type == 'insert_media') {
                      let res = KQC.insert_canvas(canvas_download.toDataURL())
                  }
                  if (type == 'update_product') {
                      let update_image = KQC.dataURLtoFile(canvas_download.toDataURL(), CL.product_active.name);
                      console.log(update_image)
                      await KQC.update_user_product(update_image)
                  }
                  dowload_warp.remove()


              },1000)

          }

        })
    }

// check base64
    isBase64(str) {
        if(typeof str !== 'string')return false
        let check = str.slice(0,4);
        if(check == 'data')return true;
        return false;
    }
// convert base64 to  file
     dataURLtoFile(dataurl, filename='product_image_default',type='.jpg') {
        let arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);

        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new File([u8arr], filename + type, {type:mime});
    }

    overwriteSrc(objects){

        return objects.map(ob => {
            if(ob.link){
                let link = ob.link
                delete ob.link
                ob = {
                    ...ob,
                    src: link
                }
            }
            if(ob.type == 'group' && ob.objects && ob.objects.length){
                ob.objects = [
                    ...this.overwriteSrc(ob.objects)
                ]
            }
            return ob
        })
    }

    async update_user_product(update_image){
        let pro = JSON.stringify(CL.product_active)
        pro = JSON.parse(pro)
        let default_ob = {objects:[]}
        let form = {
            fs:pro.fs,
            width:pro.width,
            height:pro.height,
            zoom: EKQ.data.zoom,
            bs:pro.bs??default_ob,
            list_page:pro.list_page??[],
        }
        if(form.fs.objects.length){
            form.fs.objects = [
                ...this.overwriteSrc(form.fs.objects)
            ]
        }
        if(form.fs.backgroundImage){
            let imgs = this.overwriteSrc([form.fs.backgroundImage])
            form.fs.backgroundImage = imgs[0]
        }
        if(form.bs.objects.length){
            form.bs.objects = [
                ...this.overwriteSrc(form.bs.objects)
            ]
        }
        if(form.bs.backgroundImage){
            let imgs = this.overwriteSrc([form.bs.backgroundImage])
            form.bs.backgroundImage = imgs[0]
        }
        if(pro.list_page && pro.list_page.length)pro.list_page.filter(page=>{
            let add_page = CL.product_active[page]
            if(add_page.objects.length){
                add_page.objects = [
                    ...this.overwriteSrc(add_page.objects)
                ]
            }
            if(page.backgroundImage){
                let imgs = this.overwriteSrc([page.backgroundImage])
                page.backgroundImage = imgs[0]
            }
            form[page] = add_page
        })
        let url = (pro.user_id)?setting.URL_API + CL.templates.my_design.update_product + pro.id: setting.URL_API + CL.templates.my_design.create_product
        let data = {
            url: url,
            form:[
                {name: "name",value:pro.name},
                {name: "cover_image", value: update_image},
                {name: "data",value: JSON.stringify(form)},
                {name: "user_category_id",value: pro.user_category_id},
            ]
        }
        console.log('form', pro)
        let res = await KQ.send_post_data(data)
        CL.product_active.id = res.data.id
        CL.product_active.user_id = res.data.user_id
        Swal.fire({
            position: 'top-center',
            icon: 'success',
            title: 'Product is saved',
            showConfirmButton: false,
            timer: 1500
        })
        KQC.close_loading()
        CL.templates.my_design.display = 'category'
    }

    async insert_canvas(filebase64){
        let form = new FormData();
        let file = KQC.dataURLtoFile( filebase64 );
        console.log(file)
        form.append("upload_image", file, 'immage_product_canvas.jpg');
        form.append("action", 'upload_img_wp');
        let requestOptions = {
            method: "POST",
            body: form,
            redirect: 'follow'
        };
        let div = document.querySelector('#TB_closeWindowButton');
        let alert = {
            position: 'top-center',
            icon: 'success',
            text: 'Image is inserted.',
            showConfirmButton: false,
            timer: 1500
        }
        fetch(ajax_url, requestOptions)
            .then(response => response.json())
            .then(result => {

                if(div){
                    console.log(result)
                    // var img = document.createElement('img');
                    // img.src = result.url;
                    // wp.media.editor.insert(img.outerHTML );
                     div.click();
                    let editedContent = wp.data.select( "core/editor" ).getEditedPostContent()
                    let index = wp.blocks.parse(editedContent).length + 1;
                    let newBlock = window.wp.blocks.createBlock('core/image',{
                        "url": result.url,
                        "alt": "",
                        "caption": "",
                        "id": result.id,
                        "sizeSlug": "large",
                        "linkDestination": "none"
                    })
                    wp.data.dispatch("core/editor").insertBlocks(newBlock,index);
                }else{
                    alert.text = 'Image is inserted to Media Library'
                }
                Swal.fire(alert)
                KQC.close_loading()
            })
            .catch(error => {
                console.log('error', error)
                alert.icon = 'error'
                alert.text = 'You need open editor'
                alert.timer =  5000
                Swal.fire(alert)
                KQC.close_loading()
                div.click();
            } );
    }

    async save_product(){
        if(KQC.checkGuest()){
            KQC.alertAccount()
            return
        }
        if(!KQC.checkEnded())return
        KQC.open_loading()
        let checkProduct = await KQC.checkLimitProduct()
        if(!checkProduct){
            KQC.close_loading()
            return
        }

        let cats = []
        let res =  await KQC.query_data_by(CL.templates.my_design.slug,CL.templates.my_design)
        if(!res.data) return
        if(!res.data.data) return
        if(!res.data.data.length){
            res = await KQC.Create_category_default()
            cats = res.data
        }
        else{
            cats = res.data.data
        }

        KQC.close_loading()
        let product_name = CL.product_active.name??''
        let categories = cats.map(item=> {
            let selected = ''
            if(CL.product_active.user_category_id == item.id)selected = "selected"
           return '<option value="'+item.id+'" '+selected+'>'+item.category+'</option>'
        })
        const { value: formValues } = await Swal.fire({
            title: 'Save product with name',
            html:
                '<input id="product_name" class="swal2-input" placeholder="Type product name here..." value="'+product_name+'" >' +
                '<select id="product_category" class="swal2-select">' + categories.join('') + '</select>',
            focusConfirm: false,
            preConfirm: () => {
                let value =  {
                    product_name: document.getElementById('product_name').value,
                    product_category: document.getElementById('product_category').value,
                }
                if (!value.product_name) {
                    Swal.showValidationMessage('Product name is required.')
                }
                return value
            }
        })
        if (!formValues)return
        CL.product_active.name = formValues.product_name
        CL.product_active.user_category_id = formValues.product_category
        EKQ.updateCanvasDataToCL()
        //console.log('pro[EKQ.type]123', CL.product_active[EKQ.type], EKQ.convertToJson())
        KQC.insert_product_side('update_product')
    }

    async run_product(event){
    let pro = CL.templates_detail
    let id = event.getAttribute('data-product')
    let res = await KQ.get_data(setting.URL_API+pro.detail_product+id)
    if(!res.data){
        Swal.fire({text:'Incorrect format.', icon:'error'})
        return
            }
    if(CL.product_active.fs){
        let over = await Swal.fire({
            title: 'Are you sure?',
            text: "You want be to overwrite this",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, overwrite it!'
        })
        if(!over.isConfirmed)return
    }
    console.log('loading controller', res)
    CL.product_active = Object.assign({id:res.data.id,name:res.data.name,cover_image:res.data.cover_image},res.data.data)
    KQ.close_library()
    EKQ.page = 0
    EKQ.type = 'fs'
    KQC.loading_product(CL.product_active)
    }

    async Create_category_default(){
        let data = {url:setting.URL_API+CL.templates.my_design.add_category,form:[]}
        data.form.push({name:'category',value:'Current'})
        let res = await KQ.send_post_data(data)
        res =  await KQC.query_data_by(CL.templates.my_design.slug,{})
        return res.data
    }

    autoscroll_viewmore(){
        let list = document.querySelector('.module-library-kq')
        if(list){
            list.onscroll = function(option){
                let view_more = list.querySelector('.view_more')
                let top = view_more.offsetTop
                let height = view_more.offsetHeight
                let listHeight = list.offsetHeight
                let scollTop = list.scrollTop
                if(scollTop >= (top + height - listHeight)){
                    view_more.click()
                }
            }
        }
    }

    async checkFileUrl(url) {
        const r = await fetch(url, {method: 'HEAD'});
        return r.headers.get('content-type');
    }

    checkGuest(){
        if(!setting.license_data) return true
        if(setting.license_data.email =='guest@gmail.com') return true
        return false
    }

    alertAccount(t = "You need to upgrade your account to use this feature."){
        let data = {
            icon: 'warning',
            text: t
        }
        let license = setting.license_data.license
        data.footer = '<a href="'+setting.register+'">Upgrade now</a>'
        if(license.name == "Free")data.footer = '<a href="'+setting.register+'">Register now</a>'
        if(license.is_ended)data.footer = '<a href="'+setting.register+'">Renew now</a>'
        Swal.fire(data)
    }

    checkEnded(){
        if(!setting.license_data.license.is_ended) return true
        this.alertAccount('Your account expired. Please renew account.')
        return false
    }
    checkLimitFileNumber(){
        if(setting.license_data.license.limit_file_number > CL.library_detail.total) return true
        this.alertAccount('Limit file uploads.')
        return false
    }

    checkLimitFileSize(file){
        if(setting.license_data.license.limit_file*1024*1024 > file.size) return true
        this.alertAccount('Max size is '+setting.license_data.license.limit_file+'MB')
        return false
    }

    async checkLimitProduct(){
        let res = await KQ.get_data(setting.URL_API + CL.templates.my_design.category)
        if(!res.data)return
        if(setting.license_data.license.product_maximum > res.data.total) return true
        this.alertAccount('Max product is '+setting.license_data.license.product_maximum)
        return false
    }

    async sortMasonry(dom,element,col=3){
        let product = document.querySelector(dom)
        if(!dom)return
        let arrayHeight = [0,0,0]
        let w = product.offsetWidth/col
        product.querySelectorAll('img').forEach((item,i)=>{
            let o = i%col
            let height = item.offsetHeight
            var style = {
                position:'absolute',
                top:arrayHeight[o]+'px',
                left:(w*o) + 'px',
                width: w + 'px',
                height: height + 'px',
            }
            arrayHeight[o] += (height + 5)
            for( let key in style ){
                item.style[key] = style[key]
            }
        })
    }
    async delay(ms=2000) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async startShare(id){
        KQC.open_loading()
        let rs = await KQC.getProductShareInfo(id);
        KQC.close_loading()
        if(!rs.data){
            return
        }
        let data = rs.data
        let emails = '';
        rs.data.share_emails.forEach((email, idx) => {
            if(idx > 0){
                emails += ', '
            }
            emails += email.email
        });
        const { value: formValues } = await Swal.fire({
            title: 'Share your design',
            html: '<select id="share-mode" style="width: 100%" class="swal2-select swal2-input">' +
                '<option '+(data.share_mode === 0 ? 'selected' : '')+' value="0">Do not share this design</option>' +
                '<option '+(data.share_mode === 1 ? 'selected' : '')+' value="1">Anyone in the list bellow can see this design</option>' +
                '<option '+(data.share_mode === 2 ? 'selected' : '')+' value="2">Anyone with the link can see this design</option>' +
                '</select>' +
                '<textarea id="share-emails" class="swal2-textarea" placeholder="Enter email addresses separated by commas">'+emails+'</textarea>' +
                '<div class="copy-share-link"><textarea readonly id="copy-share-link-text" class="swal2-textarea" placeholder="Enter email addresses separated by commas">'+(setting.URL_SITE+'/design/create-from-share/'+id)+'</textarea><button onclick="copyToClipboard(\'http://keeapitest.local/share/'+id+'\')"><i class="fas fa-copy"></i> Copy</button></div>' +
                '<div class="link-copied">Link copied!</div>'
            ,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Save',
            preConfirm: () => {
                let value ={
                    share_mode: document.getElementById('share-mode').value,
                    emails: document.getElementById('share-emails').value
                };
                return value;
            },

        });
        if(formValues){
            let emails = formValues.emails.split(',');
            let data = [
                {name: 'share_mode', value: formValues.share_mode}
            ]
            emails.forEach(email => {
                data.push({
                    name: 'emails[]',
                    value: email.trim()
                })
            })
            KQC.open_loading()
            let rs = await KQC.saveProductShareInfo(id, data);
            KQC.close_loading()
            if(!rs.result){
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: rs.message
                });
            }
            else{
                Swal.fire({
                    position: 'top-center',
                    icon: 'success',
                    title: 'Share Settings Saved!',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        }
    }

    async getProductShareInfo(product_id){
        return await KQ.get_data(setting.URL_API+'/user/product/share/'+product_id);
    }

    async saveProductShareInfo(product_id, data){
        return await KQ.send_post_data({
            url: setting.URL_API+'/user/product/share/'+product_id,
            form: data
        });
    }

    async shareProductFromDetail(){
        if(KQC.checkGuest()){
            KQC.alertAccount()
            return
        }
        let pro = CL.product_active
        if(!pro.user_id){
            Swal.fire({
                icon: 'error',
                text: 'Your design has not been saved, please save before sharing.',
            })
            return
        }
        await KQC.startShare(pro.id)
    }

    async restore_base64_objs(objs){
        return await Promise.all(objs.map(async obj => {
            let link = obj.src
            let src = link
            if (obj.type == 'image' && obj.src.startsWith('http')) {
                src = await KQ.getBase64FromUrl(link)
            }
            if(obj.type == 'group'){
                obj.objects = await this.restore_base64_objs(obj.objects)
            }
            return {
                ...obj,
                src: src,
                link: link
            }
        }))
    }

    async restore_base64(data){
        let rs = {
            ...data
        }
        rs.fs.objects = await this.restore_base64_objs(rs.fs.objects)
        if(rs.list_page && rs.list_page.length){
            for (let i = 0; i<rs.list_page.length; i++){
                rs[rs.list_page[i]].objects = await this.restore_base64_objs(rs[rs.list_page[i]].objects)
            }
        }
        rs.bs.objects = await this.restore_base64_objs(rs.bs.objects)
        return rs
    }
}
var KQC =  new Controller()