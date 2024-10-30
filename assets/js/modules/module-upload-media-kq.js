//Photos component
Vue.component('module-upload-media-kq', {
    data: ()=> {
        let pt = CL.library_detail
        let scale_default = 1;
        pt.loading = setting.URL_KQ + CL.loading.sunny
        pt.scale = {min:0,max:5,step:0.01,value: scale_default};
        pt.tags = []
        pt.tags_select = []
        pt.query.types = ""
        pt.query.tags = ""
        return pt
    },
    mounted: async ()=>{
        let pt = CL.library_detail
        pt.query.page = 1
        let res = await KQC.query_data(pt)
        console.log(res.data)
        pt.images.data = res.data
        pt.total = res.total
    },
    methods: {
        display_upload_media: (event)=>{
            let form = document.querySelector('.module-uploads-media-class .form-media')
            form.classList.toggle('d-none')
        },
        set_image: async (event) => {
            let link = event.target.getAttribute('data-image')
            let src = await KQ.getBase64FromUrl(link)
            KQC.open_loading()
            fabric.Image.fromURL(src, function (oImg) {
                let scale = EKQ.canvas.width / oImg.width
                if (scale > 1) scale = 1
                if (scale <= 1) scale = scale + 0, 2
                oImg.set({'left': 10});
                oImg.set({'top': 10});
                oImg.set({'scaleX': scale});
                oImg.set({'scaleY': scale});
                oImg.set('link', link);
                EKQ.canvas.add(oImg);
                KQC.close_loading()
            });
            EKQ.canvas.renderAll();
        },
        remove_image: async (event)=>{
            let index =  event.target.getAttribute('data-index')
            let pt = CL.library_detail
            let image = pt.images.data[index]
            let del = {url: setting.URL_API + CL.library_detail.delete + image.id}
            let check = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            })
            if(!check.isConfirmed)return
            let res = await KQ.delete_media(del)
            let noti = {
                position: 'top-center',
                icon: 'success',
                title: 'Image Deleted.',
                showConfirmButton: false,
                timer: 1500
            }
            if(res){
                Swal.fire(noti)
                pt.query.page = 1
                res = await KQC.query_data(pt)
                pt.images.data = res.data
                pt.total = res.total
            }

        },
        upload_image: async (event)=>{
            if(!KQC.checkLimitFileNumber())return
            if(!KQC.checkEnded())return
            let pt = CL.library_detail
            let image = event.target.files[0]
            if(!KQC.checkLimitFileSize(image))return
            let set = {file:image,maxsize:pt.maxsize}
            let thumbnail  = await KQ.resizeImage(set)
            let data =  {url: setting.URL_API + CL.library_detail.upload, image: {}}
            let noti = {
                position: 'top-center',
                icon: 'success',
                title: 'Image uploaded.',
                showConfirmButton: false,
                timer: 1500
            }
            KQC.open_loading()
            data.image = image
            data.thumb_image = thumbnail
            let res = await KQ.upload_media(data)
            if(!res.result)noti.icon = 'error',noti.title = 'Image is wrong'
            Swal.fire(noti)
            if(res.result){
                pt.query.page = 1
                res = await KQC.query_data(pt)
                pt.images.data = res.data
                pt.total = res.total
            }
            KQC.close_loading()
        },
        load_more: async ()=>{
            let pt = CL.library_detail
            ++pt.query.page
            let res = await KQC.query_data(pt)
            pt.images.data = pt.images.data.concat(res.data)
            pt.total = res.total
        }

    },
    template: '<div class="module-library-kq module-uploads-media-class">' +
        '<label><span v-on:click="display_upload_media">Upload from devices</span></label>' +
        '<form><div class="form-media d-none"><img v-bind:src="setting.URL_KQ + icon_upload"> <span class="title">Drop files or browse</span><input type="file" accept="image/*" data-name="upload_media" v-on:input="upload_image"></div> </form>'+

        '<label>Uploaded files: </label>' +
        '<div class="list_images_grid_user" >' +
        '<img v-if="!images.data" v-bind:src="loading" class="icon-loading-data"> <span  v-if="images.data && !images.data.length">No images.</span> ' +
        '<div class="item-user-media d-inline"  v-for="img,index in images.data"><img v-bind:src="img.thumb_image" class="m-hover m-border-hover animated bounce">' +
        '<span class="action-media add-media fas fa-plus-circle" v-bind:data-image="img.image"  v-on:click="set_image"></span>' +
        '<span class="action-media remove-media far fa-trash-alt" v-bind:data-index="index" v-on:click="remove_image"></span>' +
        '</div>' +
        '</div>' +
        '<div class="text-align-center" v-show="query.page * query.number < total"> <div class="view_more"  v-on:click="load_more">view more</div>  </div>'+

        '</div>'
})