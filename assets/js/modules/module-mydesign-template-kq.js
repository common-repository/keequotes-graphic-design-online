//My Design component
Vue.component('module-mydesign-template-kq', {
    data: ()=> {
        let pro = CL.templates_detail
        return pro
    },
    mounted: async ()=>{
        KQC.open_loading()
        let pro = CL.templates_detail
        let res =  await KQC.query_data_by(pro.slug,{})
        if(res.data.data)pro.categories = res.data.data
        pro.display = 'category'
        KQC.close_loading()

    },
    methods: {
        add_category_new: async ()=>{
            let pro = CL.templates_detail
            const { value: text } = await Swal.fire({
                input: 'text',
                inputLabel: 'Message',
                inputPlaceholder: 'Add new category...',
                inputAttributes: {
                    'aria-label': 'Add new category here...'
                },
                showCancelButton: true
            })
            if(!text)return
            let data = {url:setting.URL_API+pro.add_category,form:[]}
            data.form.push({name:'category',value:text})
            let res = await KQ.send_post_data(data)
            if(res.result)Swal.fire({
                icon: 'success',
                text: 'Category was created.',
            })
            res =  await KQC.query_data_by(pro.slug,{})
            if(res.data.data)pro.categories = res.data.data
        },
        edit_category: async (event)=>{
            let pro = CL.templates_detail
            let id = event.target.getAttribute('data-category')
            let name = event.target.getAttribute('data-name')
            const { value: text } = await Swal.fire({
                input: 'text',
                inputLabel: 'Message',
                inputValue: name,
                inputPlaceholder: 'Add new category...',
                inputAttributes: {
                    'aria-label': 'Add new category here...'
                },
                showCancelButton: true,
                confirmButtonText:"Update"
            })
            if(!text)return
            let data = {url:setting.URL_API+pro.update_category+id,form:[]}
            data.form.push({name:'category',value:text})
            let res = await KQ.send_post_data(data)
            if(res.result)Swal.fire({
                icon: 'success',
                text: 'Category was Updated.',
            })
            res =  await KQC.query_data_by(pro.slug,{})
            if(res.data.data)pro.categories = res.data.data
        },
        delete_category: async (event)=>{
            let pro = CL.templates_detail
            let id = event.target.getAttribute('data-category')
            let check = await Swal.fire({
                title: 'Do you want to delete?',
                showCancelButton: true,
                confirmButtonText: 'Delete',
            })
            if(!check.isConfirmed)return
            KQC.open_loading()
            let res  = await KQ.get_data(setting.URL_API+pro.delete_cat+id)
            if(res.result)Swal.fire({
                icon: 'success',
                text: 'Category was deleted.',
            })
            res =  await KQC.query_data_by(pro.slug,{})
            if(res.data.data)pro.categories = res.data.data
            KQC.close_loading()
        },
        get_list_categories:()=>{
            let pro = CL.templates_detail
            pro.display = 'category'
        },
        get_category: async (event)=>{
            KQC.open_loading()
            let pro = CL.templates_detail
            let type = event.target.getAttribute('data-type')
            let type_name = event.target.getAttribute('data-name')
            pro.query_products.page = 1
            let res =  await KQC.query_data_by(pro.category +type,pro.query_products)
            pro.list_products = res.data.data
            pro.total = res.total
            KQC.close_loading()
            pro.display = 'products'
            pro.breadcrumb.category = {id:type,name:type_name}
        },
        load_more: async (event)=>{
            KQC.open_loading()
            let pro = CL.templates_detail
            let type = event.target.getAttribute('data-type')
            ++pro.query_products.page
            let res =  await KQC.query_data_by(pro.category +type,pro.query_products)
            pro.list_products = pro.list_products.concat(res.data)
            pro.total = res.total
            KQC.close_loading()
        },
        run_product: async (event)=>{
            KQC.open_loading()
            let pro = CL.templates_detail
            let id = event.target.getAttribute('data-product')
            let res = await KQ.get_data(setting.URL_API+pro.detail_product+id)
            if(res.data.data && !res.data.data.fs){
                KQC.close_loading()
                Swal.fire({
                    text:'Incorrect format.',
                    icon:'error'
                })
                return
            }
            let data = res.data
            let restore_data = await KQC.restore_base64(data.data)
            data.data = {
                ...restore_data
            }
            KQC.close_loading()
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
            CL.product_active = {
                ...data.data,
                id:data.id,
                name:data.name,
                cover_image:data.cover_image,
                user_category_id: Number(data.user_category_id),
                user_id:data.user_id
            }
            EKQ.type = 'fs'
            console.log('loading module design', CL.product_active)
            KQC.loading_product(CL.product_active)
            KQ.close_library()

        },
        delete_product: async (event)=>{
            let pro = CL.templates_detail
            let id = event.target.getAttribute('data-product')
            let check = await Swal.fire({
                title: 'Do you want to delete?',
                showCancelButton: true,
                confirmButtonText: 'Delete',
            })
            if(!check.isConfirmed)return
            KQC.open_loading()
            let res  = await KQ.get_data(setting.URL_API+pro.del_product+id)
            if(res.result)Swal.fire({
                icon: 'success',
                text: 'product was deleted.',
            })
            pro.list_products = pro.list_products.filter(item=>item.id != id)
            KQC.close_loading()
        },
        share_product: async function (event){
            let id = event.target.getAttribute('data-product')
            await KQC.startShare(id)
        },

    },
    template: '<div class="module-latest-template-kq module-latest-template-class">' +

        '<div class="list-categories-user" v-show="display==`category`">' +
        '<div class="controls-user-products"><i class="fas fa-circle"></i> <span v-on:click="add_category_new">Add new category</span></div>' +
        '<div class="item-category" v-for="category in categories" v-if="categories.length">' +
        '<span class="category">{{ category.category }}</span>' +
        '<span class="action"  v-bind:data-type="category.id" v-bind:data-name="category.category" v-on:click="get_category" v-bind:src="setting.URL_KQ + button.view" alt="View">View</span>'+
        '<span class="action delete-category" v-bind:data-category="category.id" v-on:click="delete_category" v-bind:src="setting.URL_KQ + button.delete" alt="Remove">Delete</span>'+
        '<span class="action edit-category" v-bind:data-category="category.id" v-bind:data-name="category.category" v-on:click="edit_category" v-bind:src="setting.URL_KQ + button.update" alt="Update">Rename</span>'+
        '</div>' +
        '</div>'+

        '<div class="list-category-detail-products" v-if="display==`products`">' +
        '<div v-show="!list_products"><img v-bind:src="setting.URL_KQ + loading" class="icon-loading-data"></div>'+
        '<label class="breadcrumb-products" v-if="breadcrumb.category">' +
        '<span v-on:click="get_list_categories">Latest categories</span>' +
        '<i class="fas fa-angle-double-right"></i>' +
        '<span>{{ breadcrumb.category.name }}</span>' +
        '</label>' +
        '<div class="carousel-category-detail-product animated bounceIn">' +
        '<div class="d-inline" v-for="product in list_products">' +
        '<img v-bind:src="product.cover_image">' +
        '<span class="action view-product" v-bind:data-product="product.id" v-on:click="run_product" v-bind:src="setting.URL_KQ + button.view" alt="View">View</span>'+
        '<span class="action delete-product" v-bind:data-product="product.id" v-on:click="delete_product" v-bind:src="setting.URL_KQ + button.delete" alt="Remove">Delete</span>'+
        '<span class="action share-product" v-bind:data-product="product.id" v-on:click="share_product" alt="View">Share</span>'+
        '</div>' +
        '</div>'+
        '<div class="text-align-center" v-if="query_products.page * query_products.number < total"> <div class="view_more" v-bind:data-type="breadcrumb.category.id"  v-on:click="load_more">view more</div>  </div>'+
        '</div>'+
        '</div>'
})

function copyToClipboard(){
    let text = document.getElementById('copy-share-link-text');
    text.focus();
    text.select();
    let successful = document.execCommand('copy');
    if(successful){
        document.getElementsByClassName('link-copied')[0].classList.add('active');
    }
}