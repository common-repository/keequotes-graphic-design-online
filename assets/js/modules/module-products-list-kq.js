//Products list
Vue.component('module-products-list-kq', {
    data: ()=> {
        let pro = CL.library_detail
        pro.loading = setting.URL_KQ + CL.loading.sunny
        return pro
    },
    mounted: async ()=>{
        let pro = CL.library_detail
        let res = await  KQ.get_data(setting.URL_API+ pro.slug)
        pro.list_types = res.data.map(item=>{
            if(item.products.length > 0)return item
        })
        CL.templates_detail =  CL.templates.latest_template
    },
    methods: {
    },
    template: '<div class="module-library-kq module-products-list-class">' +
        '<img v-if="!list_types" v-bind:src="loading" class="icon-loading-data">'+
        '<div class="list_types" v-for="type in list_types" v-if="list_types && type" >' +
        '<label data-module="products_filter" v-bind:data-type="type.id" onclick="KQ.display_library_product(this)">{{ type.name }}</label>' +
        '<div class="list_products"><img v-for="product in type.products" v-if="product" v-bind:data-product="product.id" v-bind:src="product.cover_image" onclick="KQC.run_product(this)" class="m-hover m-border-hover animated bounce"></div>' +
        '</div>' +
        '</div>'
})