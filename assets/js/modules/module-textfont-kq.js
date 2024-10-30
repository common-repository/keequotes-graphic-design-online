// Define component TextFonts
Vue.component('module-textfont-kq', {
    data: function () {
        let module = CL.modules[CL.controls.module_select]
        return module
    },
    methods: {
        choose_font: (event)=>{
            let objtext = EKQ.canvas.getActiveObject();
            objtext.set('fontFamily', event.target.attributes['data-font'].value);
            EKQ.canvas.renderAll();
        },
        setfont:(font)=>{
            return 'font-family:"'+font+'"'
        }
    },
    template: '<div class="module-content-kq"><div class="item-textfont" v-on:click="choose_font" v-for="font in data" v-bind:data-font="font.name" v-bind:style="setfont(font.name)">{{ font.value }}</div></div>'
})
