//Latest template component
Vue.component('module-latest-template-kq', {
    data: ()=> {
        let pro = CL.templates_detail
        pro.tags = []
        pro.tags_select = []
        pro.query.tags = ""
        return pro
    },
    mounted: async ()=>{
        KQC.open_loading()
        let pro = CL.templates_detail
        let res =  await KQ.get_data(setting.URL_API + pro.slug)
        pro.list_types = res.data
        setTimeout(()=>{
            let carousel = document.querySelectorAll('.carousel-type-product')
            carousel.forEach(item=>{
                new Glide(item, pro.glide ).mount()
            })
            KQC.close_loading()
        },1000)
    },
    methods: {
        reLoad: async ()=>{
            KQC.open_loading()
            let pro = CL.templates_detail
            let res =  await KQ.get_data(setting.URL_API + pro.slug)
            pro.list_types = res.data
            setTimeout(()=>{
                let carousel = document.querySelectorAll('.carousel-type-product')
                carousel.forEach(item=>{
                    new Glide(item, pro.glide ).mount()
                })
                KQC.close_loading()
            },1000)
        },
        get_list_types: (event)=>{
            let pro = CL.templates_detail
            pro.display = 'types'
        },
        get_type: async (event)=>{
            KQC.open_loading()
            let pro = CL.templates_detail
            let type = event.target.getAttribute('data-type')
            let type_name = event.target.textContent
            let res =  await KQ.get_data(setting.URL_API + pro.type +type)
            pro.list_categories = res.data
            setTimeout(()=>{
                let carousel = document.querySelector('.carousel-category-product')
                if(carousel){
                    new Glide('.carousel-category-product', pro.glide).mount()
                }
                KQC.close_loading()
            },2500)
            pro.display = 'category'
            pro.breadcrumb.type = {id:type,name:type_name}
        },
        get_category: async (event)=>{
            KQC.open_loading()
            let pro = CL.templates_detail
            let type = event.target.getAttribute('data-type')
            let type_name = event.target.textContent
            pro.query_products.page = 1
            let res =  await KQC.query_data_by(pro.category +type,pro.query_products)
            pro.list_products = res.data
            pro.total = res.total
            KQC.close_loading()
            pro.display = 'category_detail'
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
        show_filter_search: async (event)=>{
            let s = event.target
            let pro = CL.templates_detail
            let r = document.querySelector(s.getAttribute('data-resulf')).style.display = "block"
            let exclude = pro.tags_select.map(item=>item.id).join(',')
            pro.show_filter = true
            let res =  await KQ.get_data(setting.URL_API+pro.tag+s.value+'&number='+pro.number_search+'&exclude_tags='+exclude)
            pro.list_tags = res.data
            pro.loadMore = false
            KQC.sortMasonry('.module-latest-template-class .list_products','img',4)
        },
        select_object: async (event)=> {
            let t = event.target
            let id = t.getAttribute('data-id')
            let type = t.getAttribute('data-type')
            let content = t.textContent
            let pro = CL.templates_detail
            let check = pro.tags_select.filter(item => item.id == id && item.type == type)
            if (!check.length) pro.tags_select.push({id: Number(id), type: type, content: content})
            document.querySelector('input.search-object').value = ""
            pro.show_filter = false
            pro.query.tags = pro.tags_select.filter(item => item.type == 'tag').map(item => item.id).join(',')
            pro.query.categories = pro.tags_select.filter(item => item.type == 'category').map(item => item.id).join(',')
            pro.query.page = 1
            let res = await KQC.query_data_by(pro.product_slug,pro.query)
            pro.list_product_search = res.data.data
            await KQC.delay(3000)
            await KQC.sortMasonry('.module-latest-template-class .list_products','img',4)
        },
        remove_search: async (event)=>{
            let t = event.target
            let id = t.getAttribute('data-id')
            let type = t.getAttribute('data-type')
            let pro = CL.templates_detail
            let remove = pro.tags_select.findIndex(item=>item.id == id && item.type == type)
            if(remove>-1)delete pro.tags_select[remove]
            pro.tags_select = pro.tags_select.filter(item=>item)
            if(!pro.tags_select.length){
                pro.list_product_search = []
                setTimeout(()=>{
                    let carousel = document.querySelectorAll('.carousel-type-product')
                    carousel.forEach(item=>{
                        new Glide(item, pro.glide ).mount()
                    })
                    KQC.close_loading()
                },1000)
                return
            }
            pro.query.tags =  pro.tags_select.filter(item=>item.type=='tag').map(item=>item.id).join(',')
            pro.query.categories =  pro.tags_select.filter(item=>item.type=='category').map(item=>item.id).join(',')
            pro.query.page = 1
            let res = await KQC.query_data_by(pro.product_slug,pro.query)
            pro.list_product_search = res.data.data
            await KQC.delay(3000)
            await KQC.sortMasonry('.module-latest-template-class .list_products','img',4)
        },
    },
    template: '<div class="module-latest-template-kq module-latest-template-class">' +
        '<div class="filter-all-objects" data-toggle-outclick=".resulf-search">' +
        '<div class="filter-tags-object"><div class="item-object" v-for="item in tags_select" ><span v-bind:data-type="item.type">{{ item.content }}</span><img v-bind:data-type="item.type" v-bind:data-id="item.id" v-on:click="remove_search" v-bind:src="setting.URL_KQ + icon"></div><div class="input-search-tags"><i class="fas fa-search" v-show="!tags_select.length"></i><input type="text" data-resulf=".resulf-search" class="search-object" v-on:focus="show_filter_search" v-on:input="show_filter_search" v-bind:placeholder="(!tags_select.length)?`Search library`:``"/></div></div>' +

        '<div class="resulf-search animated " v-show="show_filter && list_tags.length"><div class="item" v-for="tag in list_tags" v-bind:data-id="tag.id" data-type="tag" v-on:click="select_object">{{ tag.name }}</div></div>' +
        '</div>'+

        '<div class="list_products" v-show="list_product_search.length" >' +
        '<img v-for="product in list_product_search"  v-bind:src="product.cover_image"  v-bind:data-product="product.id" onclick="KQC.run_product(this)" class="m-hover animated bounce">' +
        '</div>' +

        '<div class="list-type-products" v-show="display==`types` && !list_product_search.length">' +
        '<div v-show="!list_types"><img v-bind:src="setting.URL_KQ + loading" class="icon-loading-data"></div>'+
        '<div class="item-type-product" v-for="type in list_types" v-if="type.products.length" >' +
        '<label><i class="fas fa-circle"></i><span v-bind:data-type="type.id" v-on:click="get_type">{{ type.name }}</span></label>' +
        '<div class="carousel-type-product animated bounceIn">' +
        '<div class="glide__track" data-glide-el="track">' +
        '<div class="glide__slides">' +
        '<div class="glide__slide" v-for="product in type.products"><img v-bind:data-product="product.id" onclick="KQC.run_product(this)" v-bind:src="product.cover_image"></div>' +
        '</div> ' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>'+

        '<div class="list-category-products" v-show="display==`category`">' +
        '<div v-show="!list_categories"><img v-bind:src="setting.URL_KQ + loading" class="icon-loading-data"></div>'+
        '<label class="breadcrumb-products" v-if="breadcrumb.type">' +
        '<span v-on:click="get_list_types">Latest products</span>' +
        '<i class="fas fa-angle-double-right"></i>' +
        '<span>{{ breadcrumb.type.name }}</span>' +
        '</label>' +
        '<div class="item-type-product animated bounceIn" v-for="category in list_categories" v-if="category.products.length" >' +
        '<label><i class="fas fa-circle"></i><span v-bind:data-type="category.id" v-on:click="get_category">{{ category.name }}</span><span class="size-cat"> ({{ category.with }}x{{ category.height }} px)</span></label>' +
        '<div class="carousel-category-product">' +
        '<div class="glide__track" data-glide-el="track">' +
        '<div class="glide__slides">' +
        '<div class="glide__slide" v-for="product in category.products"><img v-bind:data-product="product.id" onclick="KQC.run_product(this)" v-bind:src="product.cover_image"></div>' +
        '</div> ' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>'+

        '<div class="list-category-detail-products" v-show="display==`category_detail`">' +
        '<div v-show="!list_products"><img v-bind:src="setting.URL_KQ + loading" class="icon-loading-data"></div>'+
        '<label class="breadcrumb-products" v-if="breadcrumb.category">' +
        '<span v-on:click="get_list_types">Latest products</span>' +
        '<i class="fas fa-angle-double-right"></i>' +
        '<span v-bind:data-type="breadcrumb.type.id" v-on:click="get_type">{{ breadcrumb.type.name }}</span>' +
        '<i class="fas fa-angle-double-right"></i>' +
        '<span>{{ breadcrumb.category.name }}</span>' +
        '</label>' +
        '<div class="carousel-category-detail-product animated bounceIn">' +
        '<div class="d-inline" v-for="product in list_products"><img v-bind:data-product="product.id" onclick="KQC.run_product(this)" v-bind:src="product.cover_image"></div>' +
        '</div>'+
        '<div class="text-align-center" v-if="query_products.page * query_products.number < total"> <div class="view_more" v-bind:data-type="breadcrumb.category.id"  v-on:click="load_more">view more</div>  </div>'+
        '</div>'+

        '</div>'
})
