// Opacity
Vue.component('module-opacity-kq', {
    data: ()=> {
        let obj = EKQ.canvas.getActiveObject() || EKQ.canvas.getActiveGroup()
        if(!obj.opacity)obj.opacity= 1
        return {opacity:obj.opacity*100}
    },
    methods: {
        change_opacity: (event)=>{
            let obj = EKQ.canvas.getActiveObject() || EKQ.canvas.getActiveGroup()
            if(!obj)return
            let val = event.target.value
            document.querySelector('div.module-content-kq.module-opacity-class label span').textContent = val
            obj.set('opacity', val/100);
            EKQ.canvas.renderAll();
        }
    },
    template: '<div class="module-content-kq module-opacity-class">' +
        '<label>Transparent <span>{{ opacity }}</span></label><div><input type="range" v-bind:value="opacity" min="0" max="100" step="0.1" v-on:input="change_opacity"></div>' +
        '</div>'
})
// Resize
Vue.component('module-resize-kq', {
    data: function (){

        let height = EKQ.canvas.height
        let width = EKQ.canvas.width
        let unit = EKQ.canvas.unit??1
        let inch = 300
        let keepAR = 'false'
        let ar = width * 1.0 / height
        if(unit > 1){
            width = width/inch
            height = height/inch
        }
        return {
            title: "Resize",
            width:width,
            height:height,
            unit:unit,
            keepAR: keepAR,
            ar: ar,
            options:[
                {name:1,value:"Pixels"},
                {name:300,value:"Points"}
            ]}
    },
    methods: {
        close:function(){
            CL.controls.add_elements = false
            CL.controls.basic = true
            CL.controls.resize = ''
        },
        change_unit: function(event){
            let inch = 300
            let int_width = document.querySelector('.module-resize-class [name="resize_width"]')
            let int_height = document.querySelector('.module-resize-class [name="resize_height"]')
            let unit = document.querySelector('.module-resize-class [name="resize_unit"]').value
            if(unit == inch){
                int_width.value = int_width.value/inch
                int_height.value = int_height.value/inch
                return
            }
            int_width.value = int_width.value*inch
            int_height.value = int_height.value*inch
        },
        update_resize: function(event){
            let pro = CL.product_active
            let width = document.querySelector('.module-resize-class [name="resize_width"]').value
            let height = document.querySelector('.module-resize-class [name="resize_height"]').value
            let unit = document.querySelector('.module-resize-class [name="resize_unit"]').value
            width = width*unit
            height = height*unit
            let zoom = width/EKQ.canvas.width
            if(!height)height = EKQ.canvas.height * zoom
            EKQ.canvas.setZoom(EKQ.canvas.getZoom() * zoom);
            EKQ.canvas.setDimensions({
                width: width,
                height: height,
                unit: Number(unit)
            })
            EKQ.canvas.setWidth(width)
            EKQ.canvas.setHeight(height)
            EKQ.canvas.renderAll();
            EKQ.canvas.calcOffset();
            CL.controls.add_elements = false
            CL.controls.basic = true
            CL.controls.resize = ''
            EKQ.data.width = width
            EKQ.data.height = height
            EKQ.data.zoom = zoom
        },
        change_mode: function(event){
        },
        change_width: function (event){
            if(this.keepAR == 'true'){
                this.height = Math.round(this.width / this.ar)
            }
        },
        change_height: function (event){
            if(this.keepAR == 'true'){
                this.width = Math.round(this.height * this.ar)
            }
        }
    },
    template: '<div class="basic_module_kq"><h2>{{ title }} <span v-on:click="close" class="close_tool"><img v-bind:src="setting.URL_KQ + CL.buttons.close_tool.icon"/></span></h2>' +
        '<div class="module-content-kq module-resize-class">' +
        '<div class="item-resize"><span>Width</span> <input type="number" name="resize_width" v-model="width" v-on:keyup="change_width" v-on:change="change_width" min="100" max="2000" step="100"></div>' +
        '<div class="item-resize"><span>Height</span> <input type="number" name="resize_height" v-model="height" v-on:keyup="change_height" v-on:change="change_height" min="100" max="2000" step="100"></div>' +
        '<div class="item-resize"><span>Unit</span> <select name="resize_unit" v-on:change="change_unit"><option v-for="item in options" v-bind:value="item.name" v-bind:selected="unit==item.name?`selected`:``">{{ item.value }}</option></select></div>' +
        '<div><label><input true-value="true" false-value="false" v-model="keepAR" name="resize_mode" v-on:change="change_mode" type="checkbox"/> Keep aspect ratio</label></div>'+
        '<div><button v-on:click="update_resize">Apply</button></div>' +
        '</div>' +
        '</div>'
})

// textsize
Vue.component('module-textsize-kq', {
    data: ()=> {
        let obj = EKQ.canvas.getActiveObject() || EKQ.canvas.getActiveGroup()
        return {
            fontSize:obj.fontSize,
            fontWeight:obj.fontWeight,
            lineHeight:obj.lineHeight,
            charSpacing:obj.charSpacing
        }
    },
    methods: {
        change_size: (event)=>{
            let obj = EKQ.canvas.getActiveObject() || EKQ.canvas.getActiveGroup()
            if(!obj)return
            let val = event.target.value
            let name = event.target.getAttribute('data-name')
            document.querySelector('div.module-content-kq.module-textsize-class label span[data-name="'+name+'"]').textContent = val
            obj.set(name, val);
            EKQ.canvas.renderAll();
        }
    },
    template: '<div class="module-content-kq module-textsize-class">' +
        '<label><span class="title">Size</span> <span data-name="fontSize">{{ fontSize }}</span></label><div><input type="range" data-name="fontSize" v-bind:value="fontSize" min="1" max="100" step="1" v-on:input="change_size"></div>' +
        '<label><span class="title">Weight</span> <span data-name="fontWeight">{{ fontWeight }}</span></label><div><input type="range" data-name="fontWeight" v-bind:value="fontWeight" min="100" max="700" step="100" v-on:input="change_size"></div>' +
        '<label><span class="title">Height</span> <span data-name="lineHeight">{{ lineHeight }}</span></label><div><input type="range" data-name="lineHeight" v-bind:value="lineHeight" min="0" max="5" step="0.1" v-on:input="change_size"></div>' +
        '<label><span class="title">Spacing</span> <span data-name="charSpacing">{{ charSpacing }}</span></label><div><input type="range" data-name="charSpacing" v-bind:value="charSpacing" min="0" max="1000" step="100" v-on:input="change_size"></div>' +
        '</div>'
})

//curved text style
Vue.component('module-curvedtextstyle-kq', {
    data: ()=> {
        let obj = EKQ.canvas.getActiveObject() || EKQ.canvas.getActiveGroup()
        return {
            fontSize:  Math.round(obj.fontSize),
            fontWeight:  Math.round(obj.fontWeight),
            spacing: Math.round(obj.spacing),
            radius: Math.round(obj.radius),
            text:obj.text
        }
    },
    methods: {
        change_size: (event)=>{
            let obj = EKQ.canvas.getActiveObject() || EKQ.canvas.getActiveGroup()
            if(!obj)return
            let name = event.target.getAttribute('data-name')
            let type = event.target.getAttribute('type')
            let val = (type=='range')? Math.round( event.target.value ):event.target.value
            let display = document.querySelector('div.module-content-kq.module-curvedtextstyle-class label span[data-name="'+name+'"]')
            if(display)display.textContent = val
            obj.set(name, val);
            EKQ.canvas.renderAll();
        }
    },
    template: '<div class="module-content-kq module-curvedtextstyle-class">' +
        '<label><span class="title">Size</span> <span data-name="fontSize">{{ fontSize }}</span></label><div><input type="range" data-name="fontSize" v-bind:value="fontSize" min="1" max="100" step="1" v-on:input="change_size"></div>' +
        '<label><span class="title">Weight</span> <span data-name="fontWeight">{{ fontWeight }}</span></label><div><input type="range" data-name="fontWeight" v-bind:value="fontWeight" min="100" max="700" step="100" v-on:input="change_size"></div>' +
        '<label><span class="title">Spacing</span> <span data-name="spacing">{{ spacing }}</span></label><div><input type="range" data-name="spacing" v-bind:value="spacing" min="10" max="30" step="1" v-on:input="change_size"></div>' +
        '<label><span class="title">Circle</span> <span data-name="radius">{{ radius }}</span></label><div><input type="range" data-name="radius" v-bind:value="radius" min="50" max="1000" step="50" v-on:input="change_size"></div>' +
        '<label><span class="title">Content</span></label><div><input type="text" data-name="text" v-bind:value="text" v-on:input="change_size"></div>' +
        '</div>'
})

//textstroke
Vue.component('module-textstroke-kq', {
    data: ()=> {
        let obj = EKQ.canvas.getActiveObject() || EKQ.canvas.getActiveGroup()
        console.log(obj)
        let strokeDashArray = obj.strokeDashArray??[]
        return {
            stroke:  {value:obj.stroke,type:'color', title: 'Color'},
            borders: [
                {id:"strokeDash",value:strokeDashArray.length?strokeDashArray[0]:0 ,min:0,max:5,step:1,type:'range', title: 'Dash'},
                {id:"strokeGap",value:strokeDashArray.length>1?strokeDashArray[1]:0 ,min:0,max:5,step:1,type:'range', title: 'Gap'},
            ],
            width: [{id:"strokeWidth",value:Math.round(obj.strokeWidth), min:0,max:100,step:1,type:'range', title: 'Width',func:'change_width'}],
            opacity: [{id:"strokeOpactity",value:obj.strokeOpactity??100, min:0,max:100,step:1,type:'range', title: 'Opacity'}],
        }
    },
    mounted:()=>{
        let dom  = document.querySelector('div.module-content-kq.module-textstroke-class .select_color')
        let color = document.querySelector('div.module-content-kq.module-textstroke-class [data-name="stroke"]')
        let show = document.querySelector('div.module-content-kq.module-textstroke-class span.display_color')
        let canvas = document.createElement("canvas");
        dom.innerHTML = '';
        canvas.width = 140;
        canvas.height = 91;
        let img = new Image();
        img.setAttribute("src", setting.color_img);
        img.addEventListener("load", function () {
            // The image can be drawn from any source
            canvas.getContext("2d").drawImage(img, 0, 0, img.width,    img.height, 0, 0, canvas.width, canvas.height);
        });
        dom.appendChild(canvas);
        canvas.addEventListener("mousemove",function(e){
            var eventLocation = KQ.getEventLocation(this,e);
            var coord = "x=" + eventLocation.x + ", y=" + eventLocation.y;
            // Get the data of the pixel according to the location generate by the getEventLocation function
            var context = this.getContext('2d');
            var pixelData = context.getImageData(eventLocation.x, eventLocation.y, 1, 1).data;
            // If transparency on the image
            if((pixelData[0] == 0) && (pixelData[1] == 0) && (pixelData[2] == 0) && (pixelData[3] == 0)){
                coord += " (Transparent color detected, cannot be converted to HEX)";
            }
            var hex = "#" + ("000000" + KQ.rgbToHex(pixelData[0], pixelData[1], pixelData[2])).slice(-6);
            // Draw the color and coordinates.
            show.style.backgroundColor = hex;
            show.setAttribute('data-color',hex)
        },false);
        canvas.addEventListener("click",function(e){
            color.value = show.getAttribute('data-color')
            let activeObject = EKQ.canvas.getActiveObject() || EKQ.canvas.getActiveGroup();
            if (activeObject) {
                let opc = document.querySelector('div.module-content-kq.module-textstroke-class input[data-name="strokeOpactity"]').value
                opc = TKQ.CreateHexOpacity( Number(opc) )
                activeObject.set('stroke',color.value + opc);
                activeObject.set('strokeLineCap',"butt");
                activeObject.set('strokeLineJoin',"miter");
                EKQ.canvas.renderAll();
            }

        })
    },
    methods: {
        change_width: (event)=>{
            let obj = EKQ.canvas.getActiveObject() || EKQ.canvas.getActiveGroup()
            if(!obj)return
            let name = event.target.getAttribute('data-name')
            let type = event.target.getAttribute('type')
            let val = Number(event.target.value)
            let display = document.querySelector('div.module-content-kq.module-textstroke-class label span[data-name="'+name+'"]')
            if(display)display.textContent = val
            obj.set(name, val);
            EKQ.canvas.renderAll();
        },
        change_dash:()=>{
            let obj = EKQ.canvas.getActiveObject() || EKQ.canvas.getActiveGroup()
            if(!obj)return
            let name = 'strokeDashArray'
            let dashArray = ['strokeDash','strokeGap']
            dashArray = dashArray.map(item=>{
                let val = document.querySelector('div.module-content-kq.module-textstroke-class input[data-name="'+item+'"]').value
                let display = document.querySelector('div.module-content-kq.module-textstroke-class label span[data-name="'+item+'"]').textContent = val
                return Number(val)
            })
            obj.set(name, dashArray);
            EKQ.canvas.renderAll();
        },
        change_opacity: (event)=>{
            let obj = EKQ.canvas.getActiveObject() || EKQ.canvas.getActiveGroup()
            if(!obj)return
            let name = event.target.getAttribute('data-name')
            let type = event.target.getAttribute('type')
            let opc = TKQ.CreateHexOpacity(Number(event.target.value))
            let color = document.querySelector('.module-textstroke-class [data-name="stroke"]')
            let display = document.querySelector('div.module-content-kq.module-textstroke-class label span[data-name="'+name+'"]')
            if(display)display.textContent = event.target.value
            obj.set('stroke', color.value + opc);
            EKQ.canvas.renderAll();
        },
        change_color: (event)=>{
            let obj = EKQ.canvas.getActiveObject() || EKQ.canvas.getActiveGroup()
            if(!obj)return
            let name = event.target.getAttribute('data-name')
            let type = event.target.getAttribute('type')
            let val = event.target.value
            let opc = document.querySelector('div.module-content-kq.module-textstroke-class input[data-name="strokeOpactity"]').value
            opc = TKQ.CreateHexOpacity( Number(opc) )
            obj.set(name, val + opc)
            EKQ.canvas.renderAll();
        }
    },
    template: '<div class="module-content-kq module-textstroke-class">' +
        '<div v-for="item in width"><label><span class="title">{{ item.title }}</span> <span v-bind:data-name="item.id">{{ item.value }}</span></label><div><input v-bind:type="item.type" v-bind:data-name="item.id" v-bind:value="item.value" v-bind:min="item.min" v-bind:max="item.max" v-bind:step="item.step" v-on:input="change_width"></div>  </div>' +
        '<div v-for="item in borders"><label><span class="title">{{ item.title }}</span> <span v-bind:data-name="item.id">{{ item.value }}</span></label><div><input v-bind:type="item.type" v-bind:data-name="item.id" v-bind:value="item.value" v-bind:min="item.min" v-bind:max="item.max" v-bind:step="item.step" v-on:input="change_dash"></div>  </div>' +
        '<div><label><span class="title">{{ stroke.title }}</span></label>' +
        '<div class="select_color"></div>' +
        '<div><input type="text" data-name="stroke" v-bind:value="stroke.value" v-on:input="change_color"> <span class="display_color"></span></div></div>' +
        '<div v-for="item in opacity"><label><span class="title">{{ item.title }}</span> <span v-bind:data-name="item.id">{{ item.value }}</span></label><div><input v-bind:type="item.type" v-bind:data-name="item.id" v-bind:value="item.value" v-bind:min="item.min" v-bind:max="item.max" v-bind:step="item.step" v-on:input="change_opacity"></div>  </div>' +
        '</div>'
})

//textshadow
Vue.component('module-textshadow-kq', {
    data: ()=> {
        let obj = EKQ.canvas.getActiveObject() || EKQ.canvas.getActiveGroup()
        let shadow = {
            blur: 0,
            color: "transparent",
            offsetX: 0,
            offsetY: 0,
            opacity: 100
        }
        if(obj.shadow)shadow = Object.assign(shadow,obj.shadow)
        obj.set('shadow',shadow)
        EKQ.canvas.renderAll()
        if(shadow.color != 'transparent')shadow.color = shadow.color.substr(0,7)
        return {
            color:  {value: shadow.color,type:'color', title: 'Color'},
            controls: [
                {id:"blur",value:Math.round(shadow.blur), min:0,max:30,step:1,type:'range', title: 'Blur',func:'change_blur'},
                {id:"offsetX",value:Math.round(shadow.offsetX), min:0,max:20,step:1,type:'range', title: 'Position X',func:'change_offsetX'},
                {id:"offsetY",value:Math.round(shadow.offsetY), min:0,max:20,step:1,type:'range', title: 'Position Y',func:'change_offsetY'}],
            opacity: [{id:"opacity",value:shadow.opacity??100, min:0,max:100,step:1,type:'range', title: 'Opacity'}],
        }
    },
    mounted:()=>{
        let dom  = document.querySelector('div.module-content-kq.module-textshadow-class .select_color')
        let color = document.querySelector('div.module-content-kq.module-textshadow-class [data-name="color"]')
        let show = document.querySelector('div.module-content-kq.module-textshadow-class span.display_color')
        let canvas = document.createElement("canvas");
        dom.innerHTML = '';
        canvas.width = 140;
        canvas.height = 91;
        let img = new Image();
        img.setAttribute("src", setting.color_img);
        img.addEventListener("load", function () {
            // The image can be drawn from any source
            canvas.getContext("2d").drawImage(img, 0, 0, img.width,    img.height, 0, 0, canvas.width, canvas.height);
        });
        dom.appendChild(canvas);
        canvas.addEventListener("mousemove",function(e){
            var eventLocation = KQ.getEventLocation(this,e);
            var coord = "x=" + eventLocation.x + ", y=" + eventLocation.y;
            // Get the data of the pixel according to the location generate by the getEventLocation function
            var context = this.getContext('2d');
            var pixelData = context.getImageData(eventLocation.x, eventLocation.y, 1, 1).data;
            // If transparency on the image
            if((pixelData[0] == 0) && (pixelData[1] == 0) && (pixelData[2] == 0) && (pixelData[3] == 0)){
                coord += " (Transparent color detected, cannot be converted to HEX)";
            }
            var hex = "#" + ("000000" + KQ.rgbToHex(pixelData[0], pixelData[1], pixelData[2])).slice(-6);
            // Draw the color and coordinates.
            show.style.backgroundColor = hex;
            show.setAttribute('data-color',hex)
        },false);
        canvas.addEventListener("click",function(e){
            color.value = show.getAttribute('data-color')
            let activeObject = EKQ.canvas.getActiveObject() || EKQ.canvas.getActiveGroup();
            if (activeObject) {
                let shadow = activeObject.shadow
                let opc = document.querySelector('div.module-content-kq.module-textshadow-class input[data-name="opacity"]').value
                opc = TKQ.CreateHexOpacity( Number(opc) )
                shadow.color = color.value + opc
                activeObject.set('shadow',shadow)
                EKQ.canvas.renderAll()
            }
        })
    },
    methods: {
        change_size: (event)=>{
            let obj = EKQ.canvas.getActiveObject() || EKQ.canvas.getActiveGroup()
            if(!obj)return
            let shadow = obj.shadow
            let name = event.target.getAttribute('data-name')
            let type = event.target.getAttribute('type')
            let val = Number(event.target.value)
            let display = document.querySelector('div.module-content-kq.module-textshadow-class label span[data-name="'+name+'"]')
            if(display)display.textContent = val
            shadow[name] = val
            obj.set('shadow', shadow);
            EKQ.canvas.renderAll();
        },
        change_opacity: (event)=>{
            let obj = EKQ.canvas.getActiveObject() || EKQ.canvas.getActiveGroup()
            if(!obj)return
            let shadow = obj.shadow
            let name = event.target.getAttribute('data-name')
            let type = event.target.getAttribute('type')
            let opc = TKQ.CreateHexOpacity(Number(event.target.value))
            let color = document.querySelector('.module-textshadow-class [data-name="color"]')
            let display = document.querySelector('div.module-content-kq.module-textshadow-class label span[data-name="'+name+'"]')
            if(display)display.textContent = event.target.value
            shadow[name] = event.target.value
            shadow['color'] = color.value + opc
            obj.set('shadow', shadow);
            EKQ.canvas.renderAll();
        },
        change_color: (event)=>{
            let obj = EKQ.canvas.getActiveObject() || EKQ.canvas.getActiveGroup()
            if(!obj)return
            let shadow = obj.shadow
            let name = event.target.getAttribute('data-name')
            let type = event.target.getAttribute('type')
            let val = event.target.value
            if(val.length < 7)return
            console.log(val)
            let opc = document.querySelector('div.module-content-kq.module-textshadow-class input[data-name="opacity"]').value
            opc = TKQ.CreateHexOpacity( Number(opc) )
            shadow[name] = val + opc
            obj.set('shadow', shadow);
            EKQ.canvas.renderAll();
        }
    },
    template: '<div class="module-content-kq module-textshadow-class">' +
        '<div v-for="item in controls"><label><span class="title">{{ item.title }}</span> <span v-bind:data-name="item.id">{{ item.value }}</span></label><div><input v-bind:type="item.type" v-bind:data-name="item.id" v-bind:value="item.value" v-bind:min="item.min" v-bind:max="item.max" v-bind:step="item.step" v-on:input="change_size"></div>  </div>' +
        '<div><label><span class="title">{{ color.title }}</span></label>' +
        '<div class="select_color"></div>' +
        '<div><input type="text" data-name="color" v-bind:value="color.value" v-on:input="change_color"> <span class="display_color"></span></div></div>' +
        '<div v-for="item in opacity"><label><span class="title">{{ item.title }}</span> <span v-bind:data-name="item.id">{{ item.value }}</span></label><div><input v-bind:type="item.type" v-bind:data-name="item.id" v-bind:value="item.value" v-bind:min="item.min" v-bind:max="item.max" v-bind:step="item.step" v-on:input="change_opacity"></div>  </div>' +
        '</div>'
})

//Color Tool
Vue.component('module-color-kq', {
    data: ()=> {
        let obj = EKQ.canvas.getActiveObject() || EKQ.canvas.getActiveGroup();
        let module = KQ.data.modules.color
        let color = obj.fill?obj.fill.substr(0,7):'#000000'
        module.loading = setting.URL_KQ + CL.loading.sunny
        module.color = {value: color,type:'color', title: module.title}
        module.opacity = {id:"opacity",value:obj.fill_opacity??100, min:0,max:100,step:1,type:'range', title: 'Opacity'}
        return module
    },
    mounted: async ()=>{
        let module = KQ.data.modules.color
        let res = await KQ.get_data(setting.URL_API+module.slug)
        module.solid.data = res.data.data
        if(module.solid.data.length)module.solid.detail = module.solid.data[0].data
        let dom  = document.querySelector('div.module-content-kq.module-color-class .select_color')
        let color = document.querySelector('div.module-content-kq.module-color-class [data-name="color"]')
        let show = document.querySelector('div.module-content-kq.module-color-class span.display_color')
        let canvas = document.createElement("canvas");
        dom.innerHTML = '';
        canvas.width = 140;
        canvas.height = 91;
        let img = new Image();
        img.setAttribute("src", setting.color_img);
        img.addEventListener("load", function () {
            // The image can be drawn from any source
            canvas.getContext("2d").drawImage(img, 0, 0, img.width,    img.height, 0, 0, canvas.width, canvas.height);
        });
        dom.appendChild(canvas);
        canvas.addEventListener("mousemove",function(e){
            var eventLocation = KQ.getEventLocation(this,e);
            var coord = "x=" + eventLocation.x + ", y=" + eventLocation.y;
            // Get the data of the pixel according to the location generate by the getEventLocation function
            var context = this.getContext('2d');
            var pixelData = context.getImageData(eventLocation.x, eventLocation.y, 1, 1).data;
            // If transparency on the image
            if((pixelData[0] == 0) && (pixelData[1] == 0) && (pixelData[2] == 0) && (pixelData[3] == 0)){
                coord += " (Transparent color detected, cannot be converted to HEX)";
            }
            var hex = "#" + ("000000" + KQ.rgbToHex(pixelData[0], pixelData[1], pixelData[2])).slice(-6);
            // Draw the color and coordinates.
            show.style.backgroundColor = hex;
            show.setAttribute('data-color',hex)
        },false);
        canvas.addEventListener("click",function(e){
            color.value = show.getAttribute('data-color')
            let opc = document.querySelector('div.module-content-kq.module-color-class input[data-name="opacity"]').value
            let hex_opc = TKQ.CreateHexOpacity( Number(opc) )
            EKQ.set_fill_group(color.value + hex_opc,opc)
        })
    },
    methods: {
        change_opacity: (event)=>{
            let name = event.target.getAttribute('data-name')
            let opc = TKQ.CreateHexOpacity(Number(event.target.value))
            let color = document.querySelector('.module-color-class [data-name="color"]')
            let display = document.querySelector('div.module-content-kq.module-color-class label span[data-name="'+name+'"]')
            if(display)display.textContent = event.target.value
            EKQ.set_fill_group(color.value + opc,event.target.value)
        },
        change_color: (event)=>{
            let obj = EKQ.canvas.getActiveObject() || EKQ.canvas.getActiveGroup()
            if(!obj)return
            let name = event.target.getAttribute('data-name')
            let val = event.target.value
            if(val.length < 7)return
            let opc = document.querySelector('div.module-content-kq.module-color-class input[data-name="opacity"]').value
            let hex_opc = TKQ.CreateHexOpacity( Number(opc) )
            EKQ.set_fill_group(val + hex_opc,opc)
        },
        set_colorsolid: (event)=>{
            let color = event.target.getAttribute('data-color')
            let opc = document.querySelector('div.module-content-kq.module-color-class input[data-name="opacity"]').value
            document.querySelector('.module-color-class [data-name="color"]').value = color
            let hex_opc = TKQ.CreateHexOpacity( Number(opc) )
            EKQ.set_fill_group(color + hex_opc,opc)
        },
        set_changesolid: (event)=>{
            let c = event.target.value
            let module = KQ.data.modules.color
            module.solid.detail = module.solid.data[c].data
        }
    },
    template: '<div class="module-content-kq module-color-class module-textshadow-class">' +
        '<div class="list_color_solid list_images" ><img v-if="!solid.detail.length" v-bind:src="loading" class="icon-loading-data">' +
        '<select v-on:change="set_changesolid"><option v-for="color,index in solid.data" v-bind:value="index">{{ color.name }}</option></select>' +
        ' <div v-for="color in solid.detail" v-bind:style="{ background: color }" v-bind:data-color="color" v-on:click="set_colorsolid"  class="color_solid m-hover m-border-hover animated bounce"></div> </div>' +
        '<div>' +
        '<div class="select_color"></div>' +
        '<div><input type="text" data-name="color" v-bind:value="color.value" v-on:input="change_color"> <span class="display_color"></span></div></div>' +
        '<div><label><span class="title">{{ opacity.title }}</span> <span v-bind:data-name="opacity.id">{{ opacity.value }}</span></label><div><input v-bind:type="opacity.type" v-bind:data-name="opacity.id" v-bind:value="opacity.value" v-bind:min="opacity.min" v-bind:max="opacity.max" v-bind:step="opacity.step" v-on:input="change_opacity"></div>  </div>' +
        '</div>'
})

//backgrounds list
Vue.component('module-backgrounds-list-kq', {
    data: ()=> {
        CL.library_detail = Object.assign(CL.library_detail,CL.library_modules[CL.library_detail.id])
        let bg = CL.library_detail
        let list_type = CL.library_detail.list_type
        let scale_default = 1;
        bg.loading = setting.URL_KQ + CL.loading.sunny
        Object.values(bg.list_type).map(item=>{
            bg.list_type[item.id].data = []
            KQ.get_data(setting.URL_API+bg.slug+'?type_data='+item.id+'&number='+item.number).then(res=>{
                bg.list_type[item.id].data = res.data.data
                if(item.id == 'solid' && res.data.data[0]){
                    if(res.data.data[0].data)bg.list_type[item.id].data = res.data.data[0].data.slice(0,5)
                }
            })
        })
        bg.scale = {min:0,max:10,step:0.01,value: scale_default};
        return bg
    },
    mounted:()=>{
    },
    methods: {
        set_backgroundsolid: (event)=>{
            document.querySelector('.control-range-class').classList.add('d-none')
            let color = event.target.getAttribute('data-color')
            EKQ.canvas.setBackgroundImage(null);
            EKQ.canvas.setBackgroundColor('');
            EKQ.canvas.setBackgroundColor(color, EKQ.canvas.renderAll.bind(EKQ.canvas))
        },
        set_backgroundrepeat: (event)=>{
            document.querySelector('.control-range-class').classList.add('d-none')
            let src =  event.target.getAttribute('data-image')
            EKQ.canvas.setBackgroundImage(null);
            EKQ.canvas.setBackgroundColor('');
            KQC.open_loading()
            EKQ.canvas.setBackgroundColor({source: src, repeat: "repeat"}, function () {EKQ.canvas.renderAll();KQC.close_loading()
            });
        },
        set_backgroundimage: (event)=>{
            EKQ.canvas.setBackgroundImage(null);
            EKQ.canvas.setBackgroundColor('');
            document.querySelector('.control-range-class').classList.remove('d-none')
            let src =  event.target.getAttribute('data-image')
            let scale = document.querySelector('.control-range-class input[type="range"]').value
            KQC.open_loading()
            fabric.Image.fromURL(src, (img)=>{
                EKQ.canvas.setBackgroundImage(img, EKQ.canvas.renderAll.bind(EKQ.canvas),{
                    originX: 'left',
                    originY: 'top',
                    scaleX: scale,
                    scaleY: scale
                });
                KQC.close_loading()
            })
            EKQ.canvas.renderAll();
            CL.$set(CL,'library_detail.scale.status',true)
        },
        set_backgroundscale:(event)=>{
            let scale =  event.target.value
            EKQ.canvas.backgroundImage.scaleX = scale
            EKQ.canvas.backgroundImage.scaleY = scale
            EKQ.canvas.renderAll()
            document.querySelector('.control-range-class label span').textContent = Math.round(scale*100)
        }
    },
    template: '<div class="module-library-kq module-backgrounds-list-class">' +
        '<div class="list_images list_gradients"><label>{{ transparent.label }}</label> <img v-bind:src="setting.URL_KQ + transparent.img" class="m-hover m-border-hover animated bounce" v-bind:data-color="transparent.color" v-on:click="set_backgroundsolid"> </div>' +

        '<div class="list_color_solid list_images" ><label data-module="backgrounds_solid" onclick="KQ.display_library_detail(this)">{{ list_type.solid.name }}</label> <img v-if="!list_type.solid.data.length" v-bind:src="loading" class="icon-loading-data"> <div v-for="color in list_type.solid.data" v-bind:style="{ background: color }" v-bind:data-color="color" v-on:click="set_backgroundsolid"  class="color_solid m-hover m-border-hover animated bounce"></div> </div>' +

        '<div class="list_images list_gradients" ><label data-module="backgrounds_gradient" onclick="KQ.display_library_detail(this)">{{ list_type.gradient.name }}</label> <img v-if="!list_type.gradient.data.length" v-bind:src="loading" class="icon-loading-data"> <img v-for="img in list_type.gradient.data" v-if="img"  v-bind:src="img.cover_image"  v-bind:data-image="img.data" v-on:click="set_backgroundimage" class="m-hover m-border-hover animated bounce"></div>' +

        '<div class="list_images list_repeat" ><label data-module="backgrounds_repeat" onclick="KQ.display_library_detail(this)">{{ list_type.repeat.name }}</label> <img v-if="!list_type.repeat.data.length" v-bind:src="loading" class="icon-loading-data"> <img v-for="img in list_type.repeat.data" v-if="img"  v-bind:src="img.cover_image" v-bind:data-image="img.data" v-on:click="set_backgroundrepeat" class="m-hover m-border-hover animated bounce"></div>' +

        '<div class="list_images" ><label data-module="backgrounds_normal" onclick="KQ.display_library_detail(this)">{{ list_type.normal.name }}</label> <img v-if="!list_type.normal.data.length" v-bind:src="loading" class="icon-loading-data"> <img v-for="img in list_type.normal.data" v-if="img" v-bind:data-image="img.data" v-bind:src="img.cover_image" v-on:click="set_backgroundimage" class="m-hover m-border-hover animated bounce"></div>' +

        '<div class="control-range-class animated bounceIn d-none"><label>Scale: <span>{{ scale.value*100}}</span></label><div><input type="range" v-bind:min="scale.min" v-bind:max="scale.max" v-bind:step="scale.step" v-bind:value="scale.value" v-on:input="set_backgroundscale"></div></div>'+
        '</div>'
})

//backgrounds solid
Vue.component('module-backgrounds-solid-kq', {
    data: ()=> {
        let bg = CL.library_detail
        bg.loading = setting.URL_KQ + CL.loading.sunny
        bg.color = {value: "",type:'color', title: "Color"}
        KQ.get_data(setting.URL_API+bg.slug).then(res=>{
            bg.solid.data = res.data.data
            if(bg.solid.data.length)bg.solid.detail = bg.solid.data[0].data
            console.log(bg)
        })
        return bg
    },
    mounted:()=>{
        let bg = CL.library_detail
        let dom  = document.querySelector('div.module-backgrounds-solid-class .select_color')
        let color = document.querySelector('div.module-backgrounds-solid-class [data-name="color"]')
        let show = document.querySelector('div.module-backgrounds-solid-class span.display_color')
        let canvas = document.createElement("canvas");
        dom.innerHTML = '';
        canvas.width = 300;
        canvas.height = 194;
        let img = new Image();
        img.setAttribute("src", setting.color_img);
        img.addEventListener("load", function () {
            // The image can be drawn from any source
            canvas.getContext("2d").drawImage(img, 0, 0, img.width,    img.height, 0, 0, canvas.width, canvas.height);
        });
        dom.appendChild(canvas);
        canvas.addEventListener("mousemove",function(e){
            var eventLocation = KQ.getEventLocation(this,e);
            var coord = "x=" + eventLocation.x + ", y=" + eventLocation.y;
            // Get the data of the pixel according to the location generate by the getEventLocation function
            var context = this.getContext('2d');
            var pixelData = context.getImageData(eventLocation.x, eventLocation.y, 1, 1).data;
            // If transparency on the image
            if((pixelData[0] == 0) && (pixelData[1] == 0) && (pixelData[2] == 0) && (pixelData[3] == 0)){
                coord += " (Transparent color detected, cannot be converted to HEX)";
            }
            var hex = "#" + ("000000" + KQ.rgbToHex(pixelData[0], pixelData[1], pixelData[2])).slice(-6);
            // Draw the color and coordinates.
            show.setAttribute('data-color',hex)
        },false);
        canvas.addEventListener("click",function(e){
            let color =  show.getAttribute('data-color')
            show.style.backgroundColor = color
            bg.color.value = color
            show.setAttribute('data-color',color)
            EKQ.canvas.backgroundImage = 0
            EKQ.canvas.setBackgroundColor(color, EKQ.canvas.renderAll.bind(EKQ.canvas))
        })
    },
    methods: {
        set_backgroundsolid: (event)=>{
            document.querySelector('.control-range-class').classList.add('d-none')
            let bg = CL.library_detail
            let color = event.target.getAttribute('data-color')
            bg.color.value = color
            EKQ.canvas.setBackgroundImage(null);
            EKQ.canvas.setBackgroundColor('');
            EKQ.canvas.setBackgroundColor(color, EKQ.canvas.renderAll.bind(EKQ.canvas))
        },
        set_changesolid: (event)=>{
            document.querySelector('.control-range-class').classList.add('d-none')
            let c = event.target.value
            CL.library_detail.solid.detail = CL.library_detail.solid.data[c].data
            console.log(c,CL.library_detail.solid.detail)
        },
        set_inputsolid: (event)=>{
            document.querySelector('.control-range-class').classList.add('d-none')
            let color = event.target.value
            EKQ.canvas.setBackgroundImage(null);
            EKQ.canvas.setBackgroundColor('');
            EKQ.canvas.setBackgroundColor(color, EKQ.canvas.renderAll.bind(EKQ.canvas))
        }
    },
    template: '<div class="module-library-kq module-backgrounds-list-class module-backgrounds-solid-class">' +
        '<div class="list_color_solid list_images" ><label>{{ name }}</label> <img v-if="!solid.detail.length" v-bind:src="loading" class="icon-loading-data">' +
        '<select v-on:change="set_changesolid"><option v-for="color,index in solid.data" v-bind:value="index">{{ color.name }}</option></select>' +
        ' <div v-for="color in solid.detail" v-bind:style="{ background: color }" v-bind:data-color="color" v-on:click="set_backgroundsolid"  class="color_solid m-hover m-border-hover animated bounce"></div> </div>' +
        '<div class="select_color"><span class="show"></span></div>' +
        '<div><input type="text" data-name="color" v-bind:value="color.value" v-on:input="set_inputsolid"> <span class="display_color"></span></div></div>' +
        '</div>'
})

//backgrounds normal
Vue.component('module-backgrounds-normal-kq', {
    data: ()=> {
        let bg = CL.library_detail
        let scale_default = 1;
        bg.loading = setting.URL_KQ + CL.loading.sunny
        bg.scale = {min:0,max:10,step:0.01,value: scale_default};
        bg.tags = []
        bg.tags_select = []
        bg.query.types = ""
        bg.query.tags = ""
        return bg
    },
    mounted: async ()=>{
        let bg = CL.library_detail
        bg.query.page = 1
        let res = await KQC.query_data(bg)
        bg.images.data = res.data
        console.log(bg)
        bg.total = res.total
        res = await KQ.get_data(setting.URL_API+bg.hot_topic)
        bg.hot_topics = res.data.data
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

    },
    methods: {
        set_backgroundimage: (event)=>{
            EKQ.canvas.setBackgroundImage(null);
            EKQ.canvas.setBackgroundColor('');
            document.querySelector('.control-range-class').classList.remove('d-none')
            let src =  event.target.getAttribute('data-image')
            let scale = document.querySelector('.control-range-class input[type="range"]').value
            KQC.open_loading()
            fabric.Image.fromURL(src, (img)=>{
                EKQ.canvas.setBackgroundImage(img, EKQ.canvas.renderAll.bind(EKQ.canvas),{
                    originX: 'left',
                    originY: 'top',
                    scaleX: scale,
                    scaleY: scale
                });
                KQC.close_loading()
            })
            EKQ.canvas.renderAll();
        },
        set_backgroundrepeat: (event)=>{
            console.log('repeat')
            document.querySelector('.control-range-class').classList.add('d-none')
            let src =  event.target.getAttribute('data-image')
            EKQ.canvas.setBackgroundImage(null);
            EKQ.canvas.setBackgroundColor('');
            EKQ.canvas.setBackgroundColor({source: src, repeat: "repeat"}, function () {EKQ.canvas.renderAll();
            });
        },
        set_backgroundscale:(event)=>{
            let scale =  event.target.value
            EKQ.canvas.backgroundImage.scaleX = scale
            EKQ.canvas.backgroundImage.scaleY = scale
            EKQ.canvas.renderAll()
            document.querySelector('.control-range-class label span').textContent = Math.round(scale*100)
        },
        select_object:(event)=>{
            console.log('select bg')
            let t = event.target
            let id = t.getAttribute('data-id')
            let type = t.getAttribute('data-type')
            let content = t.textContent
            let bg = CL.library_detail
            let check = bg.tags_select.filter(item=>item.id == id && item.type == type)
            if(!check.length)bg.tags_select.push({id:Number(id),type:type,content:content})
            document.querySelector('input.search-object').value= ""
            bg.show_filter = false
            bg.query.tags =  bg.tags_select.filter(item=>item.type=='tag').map(item=>item.id).join(',')
            bg.query.types =  bg.tags_select.filter(item=>item.type=='types').map(item=>item.id).join(',')
            bg.query.page = 1
            KQC.open_loading()
            KQC.query_data(bg).then(res=>{
                bg.images.data = res.data
                bg.total = res.total
                KQC.close_loading()
            })
        },
        remove_search:(event)=>{
            let t = event.target
            let id = t.getAttribute('data-id')
            let type = t.getAttribute('data-type')
            let bg = CL.library_detail
            let remove = bg.tags_select.findIndex(item=>item.id == id && item.type == type)
            if(remove>-1)delete bg.tags_select[remove]
            bg.tags_select = bg.tags_select.filter(item=>item)
            bg.query.tags =  bg.tags_select.filter(item=>item.type=='tag').map(item=>item.id).join(',')
            bg.query.types =  bg.tags_select.filter(item=>item.type=='types').map(item=>item.id).join(',')
            bg.query.page = 1
            KQC.query_data(bg).then(res=>{
                bg.images.data = res.data
            })
        },
        show_filter_search:(event)=>{
            let s = event.target
            let bg = CL.library_detail
            let r = document.querySelector(s.getAttribute('data-resulf')).style.display = "block"
            let exclude = bg.tags_select.map(item=>item.id).join(',')
            bg.show_filter = true
            KQ.get_data(setting.URL_API+bg.tag+s.value+'&number='+bg.number_search+'&exclude_tags='+exclude).then(res=>{
            bg.tags = res.data.data
            })
        },
        load_more: async ()=>{
            let bg = CL.library_detail
            ++bg.query.page
            let res = await KQC.query_data(bg)
            bg.images.data = bg.images.data.concat(res.data)
            bg.total = res.total
        }


    },
    template: '<div class="module-library-kq module-backgrounds-list-class module-backgrounds-gradient-class">' +
        '<div class="filter-all-objects" data-toggle-outclick=".resulf-search">' +
        '<div class="filter-tags-object"><div class="item-object" v-for="item in tags_select" ><span v-bind:data-type="item.type">{{ item.content }}</span><img v-bind:data-type="item.type" v-bind:data-id="item.id" v-on:click="remove_search" v-bind:src="setting.URL_KQ + icon"></div><div class="input-search-tags"><i class="fas fa-search" v-show="!tags_select.length"></i><input type="text" data-resulf=".resulf-search" class="search-object" v-on:focus="show_filter_search" v-on:input="show_filter_search" v-bind:placeholder="(!tags_select.length)?`Search library`:``"/></div></div>' +

        '<div class="resulf-search animated " v-show="show_filter && tags.length"><div class="item" v-for="tag in tags" v-bind:data-id="tag.id" data-type="tag" v-on:click="select_object">{{ tag.name }}</div></div>' +
        ' </div>' +

        '<div class="filter-hot-topic" v-if="hot_topics.length"><label>Hot topics: </label>' +
        '<div class="carousel-hot-topic"><div class="glide__track" data-glide-el="track"><div class="glide__slides">' +
            '<div class="glide__slide" v-for="item in hot_topics"><span v-bind:data-id="item.id" data-type="types" v-on:click="select_object">{{ item.name}}</span></div>' +
        '</div> ' +
        '<div class="glide__arrows" data-glide-el="controls"><button class="glide__arrow glide__arrow--left" data-glide-dir="<"><i class="fas fa-chevron-left"></i></button><button class="glide__arrow glide__arrow--right" data-glide-dir=">"><i class="fas fa-chevron-right"></i></button></div>' +
        '</div></div>' +
        '</div>'+

        '<div class="list_images" >' +
        '<img v-if="!images.data" v-bind:src="loading" class="icon-loading-data"> <span  v-if="images.data && !images.data.length">Not found.</span> ' +
        '<img v-for="img in images.data" v-if="img && query.type_data == `repeat`"  v-bind:src="img.cover_image"  v-bind:data-image="img.data" v-on:click="set_backgroundrepeat" class="m-hover m-border-hover animated bounce">' +
        '<img v-for="img in images.data" v-if="img && query.type_data != `repeat`"  v-bind:src="img.cover_image"  v-bind:data-image="img.data" v-on:click="set_backgroundimage" class="m-hover m-border-hover animated bounce">' +
        '<div class="text-align-center" v-show="query.page * query.number < total"> <div class="view_more"  v-on:click="load_more">view more</div>  </div>'+
        '</div>' +

        '<div class="control-range-class animated bounceIn d-none"><label>Scale: <span>{{ scale.value*100}}</span></label><div><input type="range" v-bind:min="scale.min" v-bind:max="scale.max" v-bind:step="scale.step" v-bind:value="scale.value" v-on:input="set_backgroundscale"></div></div>'+
        '</div>'
})

//Photos component
Vue.component('module-photos-list-kq', {
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
        pt.images.data = res.data
        pt.total = res.total
        res = await KQ.get_data(setting.URL_API+pt.hot_topic)
        pt.hot_topics = res.data.data
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
        pt.keywords = pt.images.data.map(item=>item.tags.substr(1))
        pt.unsplash.query_array.query = pt.keywords.join(',')
        res =  await KQC.query_data_unsplash(pt.unsplash)
        pt.unsplash.images = res
        console.log(res)
        KQC.autoscroll_viewmore()
    },
    methods: {
        set_image: async (event)=>{
            KQC.open_loading()
            let link =  event.target.getAttribute('data-image')
            let src = await KQ.getBase64FromUrl(link)
            let download =  event.target.getAttribute('data-download')
            if(download)await KQC.getTrackingUnsplash(download)
            fabric.Image.fromURL(src, function(oImg) {
                let scale = EKQ.canvas.width/oImg.width
                if(scale>1)scale = 1
                if(scale<=1)scale = scale+0,2
                oImg.set({'left':10});
                oImg.set({'top':10});
                oImg.set({'scaleX':scale});
                oImg.set({'scaleY':scale});
                oImg.set('link', link);
                EKQ.canvas.add(oImg);
                KQC.close_loading()
            });
            EKQ.canvas.renderAll();
        },
        select_object:(event)=>{
            let t = event.target
            let id = t.getAttribute('data-id')
            let type = t.getAttribute('data-type')
            let content = t.textContent
            let pt = CL.library_detail
            let check = pt.tags_select.filter(item=>item.id == id && item.type == type)
            if(!check.length)pt.tags_select.push({id:Number(id),type:type,content:content})
            document.querySelector('input.search-object').value= ""
            pt.show_filter = false
            pt.query.tags =  pt.tags_select.filter(item=>item.type=='tag').map(item=>item.id).join(',')
            pt.query.types =  pt.tags_select.filter(item=>item.type=='types').map(item=>item.id).join(',')
            pt.query.page = pt.unsplash.query_array.page= 1
            KQC.query_data(pt).then(res=>{
                pt.images.data = res.data
                pt.total = res.data
            })
            KQC.query_data_unsplash(pt.unsplash).then(res=>{
                pt.unsplash.images = res
            })
        },
        remove_search:(event)=>{
            let t = event.target
            let id = t.getAttribute('data-id')
            let type = t.getAttribute('data-type')
            let pt = CL.library_detail
            let remove = pt.tags_select.findIndex(item=>item.id == id && item.type == type)
            if(remove>-1)delete pt.tags_select[remove]
            pt.tags_select = pt.tags_select.filter(item=>item)
            pt.query.tags =  pt.tags_select.filter(item=>item.type=='tag').map(item=>item.id).join(',')
            pt.query.types =  pt.tags_select.filter(item=>item.type=='types').map(item=>item.id).join(',')
            pt.query.page = pt.unsplash.query_array.page= 1
            KQC.query_data(pt).then(res=>{
                pt.images.data = res.data
            })
            KQC.query_data_unsplash(pt.unsplash).then(res=>{
                pt.unsplash.images = res
            })
        },
        show_filter_search:(event)=>{
            let s = event.target
            let pt = CL.library_detail
            let r = document.querySelector(s.getAttribute('data-resulf')).style.display = "block"
            let exclude = pt.tags_select.map(item=>item.id).join(',')
            pt.show_filter = true
            KQ.get_data(setting.URL_API+pt.tag+s.value+'&number='+pt.number_search+'&exclude_tags='+exclude).then(res=>{
                pt.tags = res.data.data
            })
        },
        load_more: async ()=>{
            let pt = CL.library_detail
            ++pt.query.page
            let res = (pt.query.page < 20)? await KQC.query_data(pt):null
            if(!res)return
            pt.images.data = pt.images.data.concat(res.data)
            pt.total = res.total
            ++pt.unsplash.query_array.page
            res = await KQC.query_data_unsplash(pt.unsplash)
            if(!res)return
            pt.unsplash.images = pt.unsplash.images.concat(res)
        }


    },
    template: '<div class="module-library-kq module-photos-list-class">' +
        '<div class="filter-all-objects" data-toggle-outclick=".resulf-search">' +
        '<div class="filter-tags-object"><div class="item-object" v-for="item in tags_select" ><span v-bind:data-type="item.type">{{ item.content }}</span><img v-bind:data-type="item.type" v-bind:data-id="item.id" v-on:click="remove_search" v-bind:src="setting.URL_KQ + icon"></div><div class="input-search-tags"><i class="fas fa-search" v-show="!tags_select.length"></i><input type="text" data-resulf=".resulf-search" class="search-object" v-on:focus="show_filter_search" v-on:input="show_filter_search" v-bind:placeholder="(!tags_select.length)?`Search library`:``"/></div></div>' +

        '<div class="resulf-search animated " v-show="show_filter && tags.length"><div class="item" v-for="tag in tags" v-bind:data-id="tag.id" data-type="tag" v-on:click="select_object">{{ tag.name }}</div></div>' +
        ' </div>' +

        '<div class="filter-hot-topic" v-if="hot_topics.length"><label>Hot topics: </label>' +
        '<div class="carousel-hot-topic"><div class="glide__track" data-glide-el="track"><div class="glide__slides">' +
        '<div class="glide__slide" v-for="item in hot_topics"><span v-bind:data-id="item.id" data-type="types" v-on:click="select_object">{{ item.name}}</span></div>' +
        '</div> ' +
        '<div class="glide__arrows" data-glide-el="controls"><button class="glide__arrow glide__arrow--left" data-glide-dir="<"><i class="fas fa-chevron-left"></i></button><button class="glide__arrow glide__arrow--right" data-glide-dir=">"><i class="fas fa-chevron-right"></i></button></div>' +
        '</div></div>' +
        '</div>'+

        '<div class="list_images_grid_user" >' +
        '<img v-if="!images.data" v-bind:src="loading" class="icon-loading-data"> <span  v-if="images.data && !images.data.length && !unsplash.images.length">Not found.</span> ' +
        '<div v-for="img in images.data" class="item-user-media d-inline"><img v-bind:src="img.cover_image"  v-bind:data-image="img.data" v-on:click="set_image" class="m-hover m-border-hover animated bounce"></div>' +
        '<img v-if="!unsplash.images" v-bind:src="loading" class="icon-loading-data">' +
        '<div v-for="img,index in unsplash.images" class="show-link-unsplash item-user-media d-inline">' +
        '<img v-bind:src="img.cover_image" v-bind:data-index="index"  v-bind:data-image="img.data"  v-bind:data-download="img.download" v-on:click="set_image" class="m-hover m-border-hover animated bounce">' +
        '<a v-bind:href="img.link" target="_blank">{{ img.user }}</a>' +
        '</div>' +
        '</div>' +
        '<div class="text-align-center" v-show="query.page * query.number < total"> <div class="view_more"  v-on:click="load_more">view more</div>  </div>'+

        '</div>'
})


//Elements List
Vue.component('module-elements-list-kq', {
    data: ()=> {
        let el = CL.library_detail
        let scale_default = 1;
        el.loading = setting.URL_KQ + CL.loading.sunny
        el.scale = {min:0,max:5,step:0.01,value: scale_default};
        el.tags = []
        el.tags_select = []
        el.query.types = ""
        el.query.category = ""
        return el
    },
    mounted: async ()=>{
        let el = CL.library_detail
        el.query.page = 1
        let res = await KQC.query_data(el)
        el.images.data = res.data
        el.total = res.total
        res = await KQ.get_data(setting.URL_API+el.hot_topic)
        el.hot_topics = res.data.data
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

    },
    methods: {
        set_element: async (event)=>{
            KQC.open_loading()
            let link =  event.target.getAttribute('data-image')
            let check = await KQC.checkFileUrl(link)
            if(check !='image/svg+xml'){
                let src = await KQ.getBase64FromUrl(link)
                fabric.Image.fromURL(src, function(oImg) {
                    let scale = EKQ.canvas.width/oImg.width
                    if(scale>1)scale = 1
                    if(scale<=1)scale = scale+0,2
                    oImg.set({'left':10})
                    oImg.set({'top':10})
                    oImg.set({'scaleX':scale})
                    oImg.set({'scaleY':scale})
                    oImg.set('link', link);
                    EKQ.canvas.add(oImg)
                    KQC.close_loading()
                });
                EKQ.canvas.renderAll();
                return
            }
            KQC.open_loading()
            fabric.loadSVGFromURL(link, function(objects, options) {
                let obj = fabric.util.groupSVGElements(objects, options);
                obj.set({left:10,top:10,'active':true});
                EKQ.canvas.add(obj);
            });
            EKQ.canvas.renderAll();
            KQC.close_loading()
        },
        select_object:(event)=>{
            let t = event.target
            let id = t.getAttribute('data-id')
            let type = t.getAttribute('data-type')
            let content = t.textContent
            let el = CL.library_detail
            let check = el.tags_select.filter(item=>item.id == id && item.type == type)
            if(!check.length)el.tags_select.push({id:Number(id),type:type,content:content})
            document.querySelector('input.search-object').value= ""
            el.show_filter = false
            el.query.category =  el.tags_select.filter(item=>item.type=='tag').map(item=>item.id).join(',')
            el.query.types =  el.tags_select.filter(item=>item.type=='types').map(item=>item.id).join(',')
            el.query.page = 1
            KQC.query_data(el).then(res=>{
                el.images.data = res.data
                el.total = res.data
            })
        },
        remove_search:(event)=>{
            let t = event.target
            let id = t.getAttribute('data-id')
            let type = t.getAttribute('data-type')
            let el = CL.library_detail
            let remove = el.tags_select.findIndex(item=>item.id == id && item.type == type)
            if(remove>-1)delete el.tags_select[remove]
            el.tags_select = el.tags_select.filter(item=>item)
            el.query.category =  el.tags_select.filter(item=>item.type=='tag').map(item=>item.id).join(',')
            el.query.types =  el.tags_select.filter(item=>item.type=='types').map(item=>item.id).join(',')
            el.query.page = 1
            KQC.query_data(el).then(res=>{
                el.images.data = res.data
                el.total = res.total
            })
        },
        show_filter_search:(event)=>{
            let s = event.target
            let el = CL.library_detail
            let r = document.querySelector(s.getAttribute('data-resulf')).style.display = "block"
            let exclude = el.tags_select.map(item=>item.id).join(',')
            el.show_filter = true
            KQ.get_data(setting.URL_API+el.tag+s.value+'&number='+el.number_search+'&exclude_tags='+exclude).then(res=>{
                el.tags = res.data.data
            })
        },
        load_more: async ()=>{
            let el = CL.library_detail
            if(el.query.page > 20)return
            ++el.query.page
            let res = await KQC.query_data(el)
            if(!res)return
            if(!res.data)return
            el.images.data = el.images.data.concat(res.data)
            el.total = res.total
        }


    },
    template: '<div class="module-library-kq module-backgrounds-list-class module-backgrounds-gradient-class">' +
        '<div class="filter-all-objects" data-toggle-outclick=".resulf-search">' +
        '<div class="filter-tags-object"><div class="item-object" v-for="item in tags_select" ><span v-bind:data-type="item.type">{{ item.content }}</span><img v-bind:data-type="item.type" v-bind:data-id="item.id" v-on:click="remove_search" v-bind:src="setting.URL_KQ + icon"></div><div class="input-search-tags"><i class="fas fa-search" v-show="!tags_select.length"></i><input type="text" data-resulf=".resulf-search" class="search-object" v-on:focus="show_filter_search" v-on:input="show_filter_search" v-bind:placeholder="(!tags_select.length)?`Search library`:``"/></div></div>' +

        '<div class="resulf-search animated " v-show="show_filter && tags.length"><div class="item" v-for="tag in tags" v-bind:data-id="tag.id" data-type="tag" v-on:click="select_object">{{ tag.name }}</div></div>' +
        ' </div>' +

        '<div class="filter-hot-topic" v-if="hot_topics.length"><label>Hot topics: </label>' +
        '<div class="carousel-hot-topic"><div class="glide__track" data-glide-el="track"><div class="glide__slides">' +
        '<div class="glide__slide" v-for="item in hot_topics"><span v-bind:data-id="item.id" data-type="types" v-on:click="select_object">{{ item.name}}</span></div>' +
        '</div> ' +
        '<div class="glide__arrows" data-glide-el="controls"><button class="glide__arrow glide__arrow--left" data-glide-dir="<"><i class="fas fa-chevron-left"></i></button><button class="glide__arrow glide__arrow--right" data-glide-dir=">"><i class="fas fa-chevron-right"></i></button></div>' +
        '</div></div>' +
        '</div>'+

        '<div class="list_images_svg" >' +
        '<img v-if="!images.data" v-bind:src="loading" class="icon-loading-data"> <span  v-if="images.data && !images.data.length">Not found.</span> ' +
        '<div v-for="img in images.data" class="item-object m-hover m-border-hover"><img v-bind:src="img.cover_image"  v-bind:data-image="img.data" v-on:click="set_element" class="animated bounce"></div>' +
        '<div class="text-align-center" v-show="query.page * query.number < total"> <div class="view_more"  v-on:click="load_more">view more</div>  </div>'+
        '</div>' +

        '</div>'
})


//Text List
Vue.component('module-texts-list-kq', {
    data: ()=> {
        let tex = CL.library_detail
        let scale_default = 1;
        tex.loading = setting.URL_KQ + CL.loading.sunny
        tex.scale = {min:0,max:5,step:0.01,value: scale_default};
        tex.tags = []
        tex.tags_select = []
        tex.query.types = ""
        tex.query.tags = ""
        return tex
    },
    mounted: async ()=>{
        let tex = CL.library_detail
        tex.query.page = 1
        let res = await KQC.query_data(tex)
        tex.images.data = res.data
        tex.total = res.total
        res = await KQ.get_data(setting.URL_API+tex.hot_topic)
        tex.hot_topics = res.data.data
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
    },
    methods: {
        add_text: (event)=>{
            let index =  event.target.getAttribute('data-index')
            let tex = CL.library_detail.add_texts[index]
            let t1
            if(tex.id == 'curved-text'){
                 t1 = new fabric.CurvedText(tex.style);
            }else{
                 t1 = new fabric.Textbox(tex.content, tex.style);
            }
            EKQ.canvas.add(t1);
            EKQ.canvas.renderAll();
        },
        set_text: async (event)=>{
            let index =  event.target.getAttribute('data-index')
            let tex = CL.library_detail.images.data[index]
            let data = tex.data
            console.log(tex)
            KQC.open_loading()
            if(data !== null && !Array.isArray(data) && typeof data !== 'object')fabric.loadSVGFromURL(data, function(objects, options) {
                if(objects.length < 4){
                    objects.forEach( (svg)=>{
                        svg.set({'active':true,});
                        EKQ.canvas.add(svg).renderAll()
                    });
                }else{
                    let obj = fabric.util.groupSVGElements(objects, options);
                    obj.set({left:10,top:10,'active':true});
                    EKQ.canvas.add(obj).renderAll()
                }
                KQC.close_loading()
            });
            if(Array.isArray(data))fabric.util.enlivenObjects(data, function(objects) {
                EKQ.canvas.add(...objects).renderAll();
                KQC.close_loading()
            });
           setTimeout(()=>{
               EKQ.canvas.renderAll();
           },1000)
            if(data === null){
                KQC.close_loading()
                Swal.fire({
                    text:'Invalid data format.',
                    icon:'error'
                })
                return
            }
        },
        select_object:(event)=>{
            let t = event.target
            let id = t.getAttribute('data-id')
            let type = t.getAttribute('data-type')
            let content = t.textContent
            let tex = CL.library_detail
            let check = tex.tags_select.filter(item=>item.id == id && item.type == type)
            if(!check.length)tex.tags_select.push({id:Number(id),type:type,content:content})
            document.querySelector('input.search-object').value= ""
            tex.show_filter = false
            tex.query.tags =  tex.tags_select.filter(item=>item.type=='tag').map(item=>item.id).join(',')
            tex.query.types =  tex.tags_select.filter(item=>item.type=='types').map(item=>item.id).join(',')
            tex.query.page = 1
            KQC.query_data(tex).then(res=>{
                tex.images.data = res.data
                tex.total = res.data
            })
        },
        remove_search:(event)=>{
            let t = event.target
            let id = t.getAttribute('data-id')
            let type = t.getAttribute('data-type')
            let tex = CL.library_detail
            let remove = tex.tags_select.findIndex(item=>item.id == id && item.type == type)
            if(remove>-1)delete tex.tags_select[remove]
            tex.tags_select = tex.tags_select.filter(item=>item)
            tex.query.tags =  tex.tags_select.filter(item=>item.type=='tag').map(item=>item.id).join(',')
            tex.query.types =  tex.tags_select.filter(item=>item.type=='types').map(item=>item.id).join(',')
            tex.query.page = 1
            KQC.query_data(tex).then(res=>{
                tex.images.data = res.data
                tex.total = res.total
            })
        },
        show_filter_search:(event)=>{
            let s = event.target
            let tex = CL.library_detail
            let r = document.querySelector(s.getAttribute('data-resulf')).style.display = "block"
            let exclude = tex.tags_select.map(item=>item.id).join(',')
            tex.show_filter = true
            KQ.get_data(setting.URL_API+tex.tag+s.value+'&number='+tex.number_search+'&exclude_tags='+exclude).then(res=>{
                tex.tags = res.data.data
            })
        },
        load_more: async ()=>{
            let tex = CL.library_detail
            ++tex.query.page
            let res = await KQC.query_data(tex)
            tex.images.data = tex.images.data.concat(res.data)
            tex.total = res.total
        }


    },
    template: '<div class="module-library-kq module-backgrounds-list-class module-backgrounds-gradient-class">' +
        '<div class="filter-all-objects" data-toggle-outclick=".resulf-search">' +
        '<div class="filter-tags-object"><div class="item-object" v-for="item in tags_select" ><span v-bind:data-type="item.type">{{ item.content }}</span><img v-bind:data-type="item.type" v-bind:data-id="item.id" v-on:click="remove_search" v-bind:src="setting.URL_KQ + icon"></div><div class="input-search-tags"><i class="fas fa-search" v-show="!tags_select.length"></i><input type="text" data-resulf=".resulf-search" class="search-object" v-on:focus="show_filter_search" v-on:input="show_filter_search" v-bind:placeholder="(!tags_select.length)?`Search library`:``"/></div></div>' +

        '<div class="resulf-search animated " v-show="show_filter && tags.length"><div class="item" v-for="tag in tags" v-bind:data-id="tag.id" data-type="tag" v-on:click="select_object">{{ tag.name }}</div></div>' +
        ' </div>' +

        '<div class="add-text-content">' +
        '<div v-for="text,index in add_texts" v-bind:class="text.class"><span v-bind:data-index="index" v-on:click="add_text">{{ text.content }}</span></div>' +
        '</div>'+

        '<div class="filter-hot-topic" v-if="hot_topics.length"><label>Hot topics: </label>' +
        '<div class="carousel-hot-topic"><div class="glide__track" data-glide-el="track"><div class="glide__slides">' +
        '<div class="glide__slide" v-for="item in hot_topics"><span v-bind:data-id="item.id" data-type="types" v-on:click="select_object">{{ item.name}}</span></div>' +
        '</div> ' +
        '<div class="glide__arrows" data-glide-el="controls"><button class="glide__arrow glide__arrow--left" data-glide-dir="<"><i class="fas fa-chevron-left"></i></button><button class="glide__arrow glide__arrow--right" data-glide-dir=">"><i class="fas fa-chevron-right"></i></button></div>' +
        '</div></div>' +
        '</div>'+

        '<div class="list_images_svg" >' +
        '<img v-if="!images.data" v-bind:src="loading" class="icon-loading-data"> <span  v-if="images.data && !images.data.length">Not found.</span> ' +
        '<div v-for="img,index in images.data" class="item-object m-hover m-border-hover"><img v-bind:src="img.cover_image" v-bind:data-index="index" v-on:click="set_text" class="animated bounce"></div>' +
        '<div class="text-align-center" v-show="query.page * query.number < total"> <div class="view_more"  v-on:click="load_more">view more</div>  </div>'+
        '</div>' +

        '</div>'
})

//Symbol List
Vue.component('module-symbols-list-kq', {
    data: ()=> {
        let el = CL.library_detail
        let scale_default = 1;
        el.loading = setting.URL_KQ + CL.loading.sunny
        el.scale = {min:0,max:5,step:0.01,value: scale_default};
        el.tags = []
        el.tags_select = []
        el.query.types = ""
        el.query.tags = ""
        return el
    },
    mounted: async ()=>{
        let el = CL.library_detail
        el.query.page = 1
        let res = await KQC.query_data(el)
        el.images.data = res.data
        console.log(el)
        el.total = res.total
        res = await KQ.get_data(setting.URL_API+el.hot_topic)
        el.hot_topics = res.data.data
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
    },
    methods: {
        set_element: (event)=>{
            let src =  event.target.getAttribute('data-image')
            fabric.loadSVGFromURL(src, function(objects, options) {
                if(objects.length < 4){
                    objects.forEach( (svg)=>{
                        svg.set({'active':true,});
                        EKQ.canvas.add(svg).renderAll();
                    });
                }else{
                    let obj = fabric.util.groupSVGElements(objects, options);
                    obj.set({left:10,top:10,'active':true});
                    EKQ.canvas.add(obj);
                }

            });
            EKQ.canvas.renderAll();
        },
        select_object:(event)=>{
            let t = event.target
            let id = t.getAttribute('data-id')
            let type = t.getAttribute('data-type')
            let content = t.textContent
            let el = CL.library_detail
            let check = el.tags_select.filter(item=>item.id == id && item.type == type)
            if(!check.length)el.tags_select.push({id:Number(id),type:type,content:content})
            document.querySelector('input.search-object').value= ""
            el.show_filter = false
            el.query.tags =  el.tags_select.filter(item=>item.type=='tag').map(item=>item.id).join(',')
            el.query.types =  el.tags_select.filter(item=>item.type=='types').map(item=>item.id).join(',')
            el.query.page = 1
            KQC.query_data(el).then(res=>{
                el.images.data = res.data
                el.total = res.total
            })
        },
        remove_search:(event)=>{
            let t = event.target
            let id = t.getAttribute('data-id')
            let type = t.getAttribute('data-type')
            let el = CL.library_detail
            let remove = el.tags_select.findIndex(item=>item.id == id && item.type == type)
            if(remove>-1)delete el.tags_select[remove]
            el.tags_select = el.tags_select.filter(item=>item)
            el.query.tags =  el.tags_select.filter(item=>item.type=='tag').map(item=>item.id).join(',')
            el.query.types =  el.tags_select.filter(item=>item.type=='types').map(item=>item.id).join(',')
            el.query.page = 1
            KQC.query_data(el).then(res=>{
                el.images.data = res.data
                el.total = res.total
            })
        },
        show_filter_search:(event)=>{
            let s = event.target
            let el = CL.library_detail
            let r = document.querySelector(s.getAttribute('data-resulf')).style.display = "block"
            let exclude = el.tags_select.map(item=>item.id).join(',')
            el.show_filter = true
            KQ.get_data(setting.URL_API+el.tag+s.value+'&number='+el.number_search+'&exclude_tags='+exclude).then(res=>{
                el.tags = res.data.data
            })
        },
        load_more: async ()=>{
            let el = CL.library_detail
            ++el.query.page
            let res = await KQC.query_data(el)
            el.images.data = el.images.data.concat(res.data)
            el.total = res.total
        }


    },
    template: '<div class="module-library-kq module-backgrounds-list-class module-backgrounds-gradient-class">' +
        '<div class="filter-all-objects" data-toggle-outclick=".resulf-search">' +
        '<div class="filter-tags-object"><div class="item-object" v-for="item in tags_select" ><span v-bind:data-type="item.type">{{ item.content }}</span><img v-bind:data-type="item.type" v-bind:data-id="item.id" v-on:click="remove_search" v-bind:src="setting.URL_KQ + icon"></div><div class="input-search-tags"><i class="fas fa-search" v-show="!tags_select.length"></i><input type="text" data-resulf=".resulf-search" class="search-object" v-on:focus="show_filter_search" v-on:input="show_filter_search" v-bind:placeholder="(!tags_select.length)?`Search library`:``"/></div></div>' +

        '<div class="resulf-search animated " v-show="show_filter && tags.length"><div class="item" v-for="tag in tags" v-bind:data-id="tag.id" data-type="tag" v-on:click="select_object">{{ tag.name }}</div></div>' +
        ' </div>' +

        '<div class="filter-hot-topic" v-if="hot_topics.length"><label>Hot topics: </label>' +
        '<div class="carousel-hot-topic"><div class="glide__track" data-glide-el="track"><div class="glide__slides">' +
        '<div class="glide__slide" v-for="item in hot_topics"><span v-bind:data-id="item.id" data-type="types" v-on:click="select_object">{{ item.name}}</span></div>' +
        '</div> ' +
        '<div class="glide__arrows" data-glide-el="controls"><button class="glide__arrow glide__arrow--left" data-glide-dir="<"><i class="fas fa-chevron-left"></i></button><button class="glide__arrow glide__arrow--right" data-glide-dir=">"><i class="fas fa-chevron-right"></i></button></div>' +
        '</div></div>' +
        '</div>'+

        '<div class="list_images_svg" >' +
        '<img v-if="!images.data" v-bind:src="loading" class="icon-loading-data"> <span  v-if="images.data && !images.data.length">Not found.</span> ' +
        '<div v-for="img in images.data" class="item-object m-hover m-border-hover"><img v-bind:src="img.data"  v-bind:data-image="img.data" v-on:click="set_element" class="animated bounce"></div>' +
        '<div class="text-align-center" v-show="query.page * query.number < total"> <div class="view_more"  v-on:click="load_more">view more</div>  </div>'+
        '</div>' +

        '</div>'
})




//Pages list
Vue.component('module-pages-list-kq', {
    data: ()=> {
        let pa = CL.product_active
        pa.loading = setting.URL_KQ + CL.loading.sunny
        if(!pa.list_page)pa.list_page = []
        if(pa.cover_image && EKQ.type =='fs')pa['cover_image_'+EKQ.type] = pa.cover_image.slice(0)
        return pa
    },
    mounted: async ()=>{
        let pa = CL.library_detail
    },
    methods: {
        loadside:(event)=>{
            let pa = CL.product_active
            let type = event.target.getAttribute('data-type')
            pa[EKQ.type] = EKQ.canvas.toJSON()
            EKQ.type = type
            KQC.loading_product(pa)
        },
        add_new_page:(event)=>{
            let pa = CL.product_active
            let page = {objects:[]}
            let name = KQ.makeid()
            pa.list_page.push(name)
            pa[name] = page
            pa[EKQ.type] = EKQ.canvas.toJSON()
        },
        remove_page:(event)=>{
            let pa = CL.product_active
            let index = event.target.getAttribute('data-index')
            let name = pa.list_page[index]
            delete pa[name]
            delete pa.list_page[index]
            pa.list_page = pa.list_page.filter(item=>item)
            pa[EKQ.type] = EKQ.canvas.toJSON()
        }
    },
    template: '<div class="module-library-kq module-pages-list-class">' +

        '<div class="front-side">' +
        '<img v-if="cover_image_fs" v-bind:src="cover_image_fs" data-type="fs" v-on:click="loadside">' +
        '<div v-if="fs.cover_image || !cover_image_fs" class="thumbnail" data-type="fs" v-on:click="loadside">Front side</div> ' +
        '<div class="controls"><span>Front Side</span></div>' +
        '</div>'+

        '<div class="pages-side" v-for="page,index in list_page" v-if="list_page.length">' +
        '<div class="thumbnail" v-bind:data-type="page" v-on:click="loadside">Page {{ index + 1 }}</div> ' +
        '<div class="controls"><span>Page {{ index + 1 }}</span><span v-bind:data-index="index" v-on:click="remove_page" class="remove far fa-trash-alt"></span></div>' +
        '</div>'+

        '<div class="add-page-side"><span v-on:click="add_new_page">Add new page</span></div>'+

        '<div class="back-side">' +
        '<div class="thumbnail" data-type="bs" v-on:click="loadside">Back side</div> ' +
        '<div class="controls"><span>Back side</span></div>' +
        '</div>'+
        '</div>'
})

Vue.component('module-applyfilters-kq', {
    data: function() {
        return {
            filters: EKQ.get_object_filters()
        }
    },
    methods: {
        apply: async function (event) {
            let obj = EKQ.canvas.getActiveObject() || EKQ.canvas.getActiveGroup()
            console.log('obj', {
                ...obj
            })
            if (!obj) return
            EKQ.apply_filters(this.filters, obj)
        },
        reset: async function(){
            EKQ.clear_filters()
            this.filters = EKQ.get_init_filters()
        }
    },
    template: '<div class="module-content-kq module-applyfilters-class">' +
            '<div class="module-filter-section"><label><input true-value="true" false-value="false" v-model="filters.invert" @change="apply" type="checkbox"> Invert</label></div>' +
        '<div class="module-filter-section"><label><input true-value="true" false-value="false" v-model="filters.sharpen" @change="apply" type="checkbox"> Sharpen</label></div>' +
        '<div class="module-filter-section"><label><input true-value="true" false-value="false" v-model="filters.emboss" @change="apply" type="checkbox"> Emboss</label></div>' +
        '<div class="module-filter-section"><label>Grayscale</label><select v-model="filters.grayscale" @change="apply"><option value="none">None</option><option value="average">Average</option><option value="lightness">Lightness</option><option value="luminosity">Luminosity</option></select></div>' +
        '<div class="module-filter-section"><div>Colormaxtrix</div>' +
            '<label><input data-filter="sepia" true-value="true" false-value="false" v-model="filters.sepia" @change="apply" type="checkbox"> Sepia</label>'+
        '<label><input data-filter="blackwhite" true-value="true" false-value="false" v-model="filters.blackwhite" @change="apply" type="checkbox"> Black/white</label>'+
        '<label><input data-filter="brownie" true-value="true" false-value="false" v-model="filters.brownie" @change="apply" type="checkbox"> Brownie</label>'+
        '<label><input data-filter="vintage" true-value="true" false-value="false" v-model="filters.vintage" @change="apply" type="checkbox"> Vintage</label>'+
        '<label><input data-filter="kodachrome" true-value="true" false-value="false" v-model="filters.kodachrome" @change="apply" type="checkbox"> Kodachrome</label>'+
        '<label><input data-filter="technicolor" true-value="true" false-value="false" v-model="filters.technicolor" @change="apply" type="checkbox"> Technicolor</label>'+
        '<label><input data-filter="polaroid" true-value="true" false-value="false" v-model="filters.polaroid" @change="apply" type="checkbox"> Polaroid</label>'+
        '</div>' +
        '<div class="module-filter-section"><div>Brightness</div><input v-model="filters.brightness" type="range" min="-1" max="1" step="0.003921" @change="apply"></div>' +
        '<div class="module-filter-section"><div>Contrast</div><input v-model="filters.contrast" type="range" min="-1" max="1" step="0.003921" @change="apply"></div>' +
        '<div class="module-filter-section"><div>Saturation</div><input v-model="filters.saturation" type="range" min="-1" max="1" step="0.003921" @change="apply"></div>' +
        '<div class="module-filter-section"><div>Hue</div><input v-model="filters.hue" type="range" min="-2" max="2" step="0.002" @change="apply"></div>' +
        '<div class="module-filter-section"><div>Noise</div><input v-model="filters.noise" type="range" min="0" max="100" step="1" @change="apply"></div>' +
        '<div class="module-filter-section"><div>Pixelate</div><input v-model="filters.pixelate" type="range" min="1" max="200" step="1" @change="apply"></div>' +
        '<div class="module-filter-section"><div>Blur</div><input v-model="filters.blur" type="range" min="0" max="1" step="0.01" @change="apply"></div>' +
        '<div class="module-filter-btn"><button @click="reset">Clear Filters</button></div>'+
        '</div>'
});



