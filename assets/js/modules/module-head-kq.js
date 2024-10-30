// Define component Head
Vue.component('module-head-kq', {
    data: function () {
        let module = CL.modules[CL.controls.module_select]
        return module
    },
    props: ['title'],
    methods: {
        close:()=>{
            CL.controls.module = false
        }
    },
    template: '<h2>{{ title }} <span v-on:click="close" class="close_tool"><img v-bind:src="setting.URL_KQ + CL.buttons.close_tool.icon"/></span></h2>'
})