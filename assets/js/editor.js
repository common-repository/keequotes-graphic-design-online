'use strict'
class EditorKQ {
    constructor(){
    this.timeoutLoading = 50
    this.originalWidth = 800
    this.widthRatio = 1
    this.zoomout = 0.9
    this.zoomoin = 1.1
    this.id_editor = 'kq_editor'
    this.id_loading = 'loading_canvas'
    this.dom = '.kq_editor_content'
    this.data
    this.canvas
    this.type = 'fs'
    this.canvas1Config = {
            canvasState             : [],
            currentStateIndex       : 0,
            undoStatus              : false,
            redoStatus              : false
        }
    this.webglBackend = new fabric.WebglFilterBackend();
    this.filters = fabric.Image.filters;
    fabric.textureSize = 2048*2
    }
    create_product_new(){
    let data = CL.product_new
    CL.product_active = Object.assign({}, data);
    this.active_data_json(data)
    }
    loading(){
        let dom = document.querySelector(this.dom)
        dom.innerHTML = ""
        let img =  document.createElement("img")
        img.id= 'loading_canvas'
        img.src = setting.URL_KQ + CL.loading.sunny
        img.setAttribute('style','margin: 0 auto; display: block')
        dom.appendChild(img)
    }
    active_data_json(data){
        this.loading()
        this.data =data
        let dom = document.querySelector(this.dom)
        let editor = document.createElement('canvas')
        let dataload = this.data[this.type]
        let width = window.innerWidth - 150
        if(width < this.data.width)this.widthRatio = parseFloat(width/this.data.width).toFixed(2)
        editor.id = this.id_editor
        editor.width = this.data.width*this.widthRatio
        editor.height = this.data.height*this.widthRatio
        dom.appendChild(editor)
        this.canvas = new fabric.Canvas(this.id_editor,{ preserveObjectStacking: true})
        this.canvas.mementoConfig = this.canvas1Config
        this.canvas.on('selection:created', this.onObjectSelected )
        this.canvas.on('selection:updated', this.onObjectSelected )
        this.canvas.on('selection:cleared', this.onObjectCleared )
        this.canvas.on('object:modified', this.onObjectUpdated )
        this.loadRenderAll(dataload)
        this.canvas.setZoom(this.widthRatio)
        if(EKQ.data.zoom){
            EKQ.canvas.setZoom(EKQ.data.zoom)
        }
        EKQ.discardActiveObjectAll()
        initCenteringGuidelines(this.canvas);
        initAligningGuidelines(this.canvas);
    }

    discardActiveObjectAll(){
        let element = document.querySelector('.editor_kq  div.kq_editor_content .upper-canvas')
        document.addEventListener('click',(event)=>{
            if(!element.contains(event.target)) { // or use: event.target.closest(selector) === null
                let outclass = event.target.className
                if(outclass == 'editor_control_kq' || outclass == 'kq_editor_content' ){
                    CL.controls.tools = false
                    CL.controls.module = false
                    CL.controls.tools_extra = []
                    CL.controls.resize = ""
                    EKQ.canvas.discardActiveObject()
                    EKQ.canvas.renderAll()
                }

            }
        })
    }

   loadRenderAll(data) {
       if(!data || !data.objects)return
       this.canvas.loadFromJSON(data, this.canvas.renderAll.bind(this.canvas))
       var loading =  setInterval(()=>{
           if(this.canvas._objects.length == data.objects.length){
               if(this.id_loading)document.getElementById(this.id_loading).remove()
               clearInterval(loading)
           }
       },this.timeoutLoading)

    }
   kq_zoom (zoom) {
        this.canvas.setZoom(this.canvas.getZoom() *zoom);
        this.canvas.setDimensions({
            width: this.canvas.width * zoom,
            height: this.canvas.height * zoom
        })
    }
    async resize(){
        CL.controls.add_elements = false
        CL.controls.basic = false
        CL.controls.resize = 'module-resize-kq'
    }

    onObjectSelected(Ob){
        console.log(Ob.target.get('type'))
        let type = Ob.target.get('type')
        CL.controls.tools_select = type
        CL.controls.tools = true
        CL.controls.module = false
        CL.controls.tools_extra = []
        TKQ.UpdateLock()
    }

    onObjectCleared(Ob){
        CL.controls.tools = false
        CL.controls.module = false
        CL.controls.tools_extra = []
        CL.controls.resize = ""
    }

    onObjectUpdated(){
        let data = EKQ.canvas.toJSON()
        EKQ.canvas.mementoConfig.canvasState.push(data)
        EKQ.canvas.mementoConfig.currentStateIndex = EKQ.canvas.mementoConfig.canvasState.length - 1
    }
    close_tool(){
      let element = document.querySelector('.editor_control_kq')
        element.addEventListener('click',(event)=>{
            let e = document.querySelector('.editor_kq  div.kq_editor_content #kq_editor')
            if(!element.contains(event.target) && e) { // or use: event.target.closest(selector) === null
                console.log(event)
            }
        })

        // CL.controls.tools = false
        // CL.controls.module = false
        // CL.controls.tools_extra = []
        // CL.controls.resize = ""
    }

    loadJsonIntoCanvas(data) {
        this.canvas.loadFromJSON(data, this.canvas.renderAll.bind(this.canvas))
        console.log(EKQ.canvas.mementoConfig.currentStateIndex)
    }

    undo(){
        let index =  EKQ.canvas.mementoConfig.currentStateIndex
        if(index < 1)return
        EKQ.canvas.mementoConfig.currentStateIndex = index - 1
        let data = EKQ.canvas.mementoConfig.canvasState[index - 1]
        console.log(data)
        this.loadJsonIntoCanvas(data)
    }

    redo(){
        let length =  EKQ.canvas.mementoConfig.canvasState.length - 1
        let index = EKQ.canvas.mementoConfig.currentStateIndex
        if(index >= length )return
        EKQ.canvas.mementoConfig.currentStateIndex = index + 1
        let data = EKQ.canvas.mementoConfig.canvasState[index + 1]
        this.loadJsonIntoCanvas(data)
    }

    set_fill_group(color,opac=100){
        let obj = EKQ.canvas.getActiveObject() || EKQ.canvas.getActiveGroup()
        if(!obj)return
        let type = obj.get('type')
        if(type=='group'){
            obj.getObjects().forEach(function (object) {
                object.set('fill',color);
                object.set('fill_opacity',opac);
                EKQ.canvas.renderAll();
            });
            return
        }
        obj.set('fill',color);
        obj.set('fill_opacity',opac);
        EKQ.canvas.renderAll();
    }

    get_init_filters(){
        return {
            invert: "false",
            sharpen: "false",
            emboss: "false",
            grayscale: "none",
            sepia: "false",
            blackwhite: 'false',
            brownie: "false",
            vintage: "false",
            kodachrome: "false",
            technicolor: "false",
            polaroid: "false",
            brightness: 0,
            contrast: 0,
            saturation: 0,
            hue: 0,
            noise: 0,
            pixelate: 1,
            blur: 0
        }
    }

    clear_filters(){
        let init = this.get_init_filters()
        let active = EKQ.canvas.getActiveObject()
        this.apply_filters(init, active)
    }

    get_object_filters(){
        let init = this.get_init_filters()
        let active = EKQ.canvas.getActiveObject()
        if(active){
            let filters = active.filters
            if(filters && filters.length){
                filters.forEach(f => {
                    if(f && f.type){
                        switch (f.type.toLowerCase()){
                            case 'invert':
                                init.invert = 'true'
                                break
                            case 'convolute':
                                if(f.matrix[0] === 0){
                                    init.sharpen = 'true'
                                }
                                if(f.matrix[0] === 1){
                                    init.emboss = 'true'
                                }
                                break
                            case 'grayscale':
                                init.grayscale = f.mode
                                break
                            case 'sepia':
                                init.sepia = 'true'
                                break
                            case 'blackwhite':
                                init.blackwhite = 'true'
                                break
                            case 'brownie':
                                init.brownie = 'true'
                                break
                            case 'vintage':
                                init.vintage = 'true'
                                break
                            case 'kodachrome':
                                init.kodachrome = 'true'
                                break
                            case 'technicolor':
                                init.technicolor = 'true'
                                break
                            case 'polaroid':
                                init.polaroid = 'true'
                                break
                            case 'brightness':
                                init.brightness = f.brightness
                                break
                            case 'contrast':
                                init.contrast = f.contrast
                                break
                            case 'saturation':
                                init.saturation = f.saturation
                                break
                            case 'huerotation':
                                init.hue = f.rotation
                                break
                            case 'noise':
                                init.noise = f.noise
                                break
                            case 'pixelate':
                                init.pixelate = f.blocksize
                                break
                            case 'blur':
                                init.blur = f.blur
                                break
                        }
                    }
                })
            }
        }
        return init
    }

    apply_filters(filters, obj){
        Object.keys(filters).forEach(function (f, i){
            obj.filters[i] = false;
            switch (f){
                case 'invert':
                    if(filters[f] == "true"){
                        obj.filters[i] = new EKQ.filters.Invert()
                    }
                    break;
                case 'sharpen':
                    if(filters[f] == "true"){
                        obj.filters[i] = new EKQ.filters.Convolute({
                            matrix: [  0, -1,  0,
                                -1,  5, -1,
                                0, -1,  0 ]
                        })
                    }
                    break;
                case 'emboss':
                    if(filters[f] == "true"){
                        obj.filters[i] = new EKQ.filters.Convolute({
                            matrix: [ 1,   1,  1,
                                1, 0.7, -1,
                                -1,  -1, -1 ]
                        })
                    }
                    break;
                case 'grayscale':
                    if(filters[f] != 'none'){
                        obj.filters[i] = new EKQ.filters.Grayscale()
                        obj.filters[i]['mode'] = filters[f]
                    }
                    break;
                case 'sepia':
                    if(filters[f] == "true"){
                        obj.filters[i] = new EKQ.filters.Sepia()
                    }
                    break;
                case 'blackwhite':
                    if(filters[f] == "true"){
                        obj.filters[i] = new EKQ.filters.BlackWhite()
                    }
                    break;
                case 'brownie':
                    if(filters[f] == "true"){
                        obj.filters[i] = new EKQ.filters.Brownie()
                    }
                    break;
                case 'vintage':
                    if(filters[f] == "true"){
                        obj.filters[i] = new EKQ.filters.Vintage()
                    }
                    break;
                case 'kodachrome':
                    if(filters[f] == "true"){
                        obj.filters[i] = new EKQ.filters.Kodachrome()
                    }
                    break;
                case 'technicolor':
                    if(filters[f] == "true"){
                        obj.filters[i] = new EKQ.filters.Technicolor()
                    }
                    break;
                case 'polaroid':
                    if(filters[f] == "true"){
                        obj.filters[i] = new EKQ.filters.Polaroid()
                    }
                    break;
                case 'brightness':
                    if(filters[f] != 0){
                        obj.filters[i] = new EKQ.filters.Brightness({brightness: parseFloat(filters[f])})
                    }
                    break;
                case 'contrast':
                    if(filters[f] != 0){
                        obj.filters[i] = new EKQ.filters.Contrast({contrast: parseFloat(filters[f])})
                    }
                    break;
                case 'saturation':
                    if(filters[f] != 0){
                        obj.filters[i] = new EKQ.filters.Saturation({saturation: parseFloat(filters[f])})
                    }
                    break;
                case 'hue':
                    if(filters[f] != 0){
                        obj.filters[i] = new EKQ.filters.HueRotation({rotation: parseFloat(filters[f])})
                    }
                    break;
                case 'noise':
                    if(filters[f] != 0){
                        obj.filters[i] = new EKQ.filters.Noise({noise: parseFloat(filters[f])})
                    }
                    break;
                case 'pixelate':
                    if(filters[f] != 1){
                        obj.filters[i] = new EKQ.filters.Pixelate({blocksize: parseFloat(filters[f])})
                    }
                    break;
                case 'blur':
                    if(filters[f] != 0){
                        obj.filters[i] = new EKQ.filters.Blur({blur: parseFloat(filters[f])})
                    }
                    break;
            }
        })
        obj.applyFilters();
        EKQ.canvas.renderAll();
    }

    combineObjLinks(objss, objst){
        let self = this
        return objst.map((obj, idx) => {
            let rs = {
                ...obj
            }
            if(rs.type == 'image'){
                rs.link = objss[idx].link
            }
            if(rs.type == 'group'){
                rs.objects = self.combineObjLinks(objss[idx].getObjects(), rs.objects)
            }
            console.log('combineObjLinks', rs)
            return {
                ...rs
            }
        })
    }

    updateCanvasDataToCL(){
        let objs = EKQ.canvas.getObjects()
        let rs = EKQ.canvas.toJSON()
        rs.objects = this.combineObjLinks(objs, rs.objects)
        console.log('rs-->', rs)
        CL.product_active[EKQ.type] = {...rs}
        //return rs
    }



    // end class
}
var canvas,EKQ = new EditorKQ()
function onObjectSelected(O){
    console.log(O)
}
//Set Control Canvas
fabric.Object.prototype.objectCaching = false;
fabric.Object.prototype.set(
    {
        borderColor: '#ff3207',
        cornerColor: '#ffffff',
        cornerSize: 17,
        padding: 0,
        transparentCorners: false,
        borderDashArray: [2, 2],
        rotatingPointOffset: 20,
        cornerStyle: 'circle',
        lockUniScaling: true,
        cornerStrokeColor: '#ccc',
    });