//Products filter
Vue.component('module-products-filter-kq', {
    data: ()=> {
        let pro = CL.library_detail
        pro.loading = setting.URL_KQ + CL.loading.sunny
        pro.tags = []
        pro.tags_select = []
        pro.query.categories = ""
        pro.query.tags = ""
        return pro
    },
    mounted: async ()=>{
        let pro = CL.library_detail
        pro.query.page = 1
        let res = await KQC.query_data(pro)
        pro.list_products = res.data
        pro.total = res.total
        res = await KQ.get_data(setting.URL_API+pro.category+pro.query.types)
        pro.list_categories = res.data
        setTimeout(()=>{
            let carousel = document.querySelector('.carousel-hot-topic')
            if(carousel){
                new Glide('.carousel-hot-topic', {
                    type: 'carousel',
                    startAt: 0,
                    perView: 2
                }).mount()
            }
        },1000)
        KQC.autoscroll_viewmore()
        KQC.sortMasonry('.module-products-filter-class .list_products','img')
    },
    methods: {
        select_object: async (event)=> {
            let t = event.target
            let id = t.getAttribute('data-id')
            let type = t.getAttribute('data-type')
            let content = t.textContent
            let pro = CL.library_detail
            let check = pro.tags_select.filter(item => item.id == id && item.type == type)
            if (!check.length) pro.tags_select.push({id: Number(id), type: type, content: content})
            document.querySelector('input.search-object').value = ""
            pro.show_filter = false
            pro.query.tags = pro.tags_select.filter(item => item.type == 'tag').map(item => item.id).join(',')
            pro.query.categories = pro.tags_select.filter(item => item.type == 'category').map(item => item.id).join(',')
            pro.query.page = 1
            let res = await KQC.query_data(pro)
            pro.list_products = res.data
            pro.total = res.total
            pro.loadMore = false
            KQC.sortMasonry('.module-products-filter-class .list_products','img')
        },
        remove_search: async (event)=>{
            let t = event.target
            let id = t.getAttribute('data-id')
            let type = t.getAttribute('data-type')
            let pro = CL.library_detail
            let remove = pro.tags_select.findIndex(item=>item.id == id && item.type == type)
            if(remove>-1)delete pro.tags_select[remove]
            pro.tags_select = pro.tags_select.filter(item=>item)
            pro.query.tags =  pro.tags_select.filter(item=>item.type=='tag').map(item=>item.id).join(',')
            pro.query.categories =  pro.tags_select.filter(item=>item.type=='category').map(item=>item.id).join(',')
            pro.query.page = 1
            let res = await KQC.query_data(pro)
            pro.list_products = res.data
            pro.total = res.total
            pro.loadMore = false
            KQC.sortMasonry('.module-products-filter-class .list_products','img')
        },
        show_filter_search: async (event)=>{
            let s = event.target
            let pro = CL.library_detail
            let r = document.querySelector(s.getAttribute('data-resulf')).style.display = "block"
            let exclude = pro.tags_select.map(item=>item.id).join(',')
            pro.show_filter = true
            let res =  await KQ.get_data(setting.URL_API+pro.tag+s.value+'&number='+pro.number_search+'&exclude_tags='+exclude)
            pro.list_tags = res.data
            pro.loadMore = false
            KQC.sortMasonry('.module-products-filter-class .list_products','img')
        },
        load_more: async ()=>{
            let pro = CL.library_detail
            KQC.sortMasonry('.module-products-filter-class .list_products','img')
            if(pro.loadMore)return
            pro.loadMore = true
            if(pro.query.page > 20)return
            ++pro.query.page
            let res = await KQC.query_data(pro)
            if(!res.data.length)return
            pro.list_products = pro.list_products.concat(res.data)
            pro.total = res.total
            await KQC.delay()
            KQC.sortMasonry('.module-products-filter-class .list_products','img')
            pro.loadMore = false
        }


    },
    template: '<div class="module-library-kq module-products-list-class module-products-filter-class">' +
        '<div class="filter-all-objects" data-toggle-outclick=".resulf-search">' +
        '<div class="filter-tags-object"><div class="item-object" v-for="item in tags_select" ><span v-bind:data-type="item.type">{{ item.content }}</span><img v-bind:data-type="item.type" v-bind:data-id="item.id" v-on:click="remove_search" v-bind:src="setting.URL_KQ + icon"></div><div class="input-search-tags"><i class="fas fa-search" v-show="!tags_select.length"></i><input type="text" data-resulf=".resulf-search" class="search-object" v-on:focus="show_filter_search" v-on:input="show_filter_search" v-bind:placeholder="(!tags_select.length)?`Search library`:``"/></div></div>' +

        '<div class="resulf-search animated " v-show="show_filter && list_tags.length"><div class="item" v-for="tag in list_tags" v-bind:data-id="tag.id" data-type="tag" v-on:click="select_object">{{ tag.name }}</div></div>' +
        ' </div>' +

        '<div class="filter-hot-topic" v-if="list_categories && list_categories.length"><label>Categories: </label>' +
        '<div class="carousel-hot-topic"><div class="glide__track" data-glide-el="track"><div class="glide__slides">' +
        '<div class="glide__slide" v-for="item in list_categories"><span v-bind:data-id="item.id" data-type="category" v-on:click="select_object">{{ item.name}}</span></div>' +
        '</div> ' +
        '<div class="glide__arrows" data-glide-el="controls"><button class="glide__arrow glide__arrow--left" data-glide-dir="<"><i class="fas fa-chevron-left"></i></button><button class="glide__arrow glide__arrow--right" data-glide-dir=">"><i class="fas fa-chevron-right"></i></button></div>' +
        '</div></div>' +
        '</div>'+

        '<div class="list_products" >' +
        '<img v-if="!list_products" v-bind:src="loading" class="icon-loading-data"> <span  v-if="list_products && !list_products.length">Not found.</span> ' +
        '<img v-for="product in list_products"  v-bind:src="product.cover_image"  v-bind:data-product="product.id" onclick="KQC.run_product(this)" class="m-hover m-border-hover animated bounce">' +
        '</div>' +

        '<div class="text-align-center" v-show="query.page * query.number < total"> <div class="view_more"  v-on:click="load_more">view more</div>  </div>'+

        '</div>'
})