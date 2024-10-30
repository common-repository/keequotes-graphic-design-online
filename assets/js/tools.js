'use strict'
class Tools {
    constructor(){
        this.TopClone = 20
    }
    removeObjects() {
        let activeObject = EKQ.canvas.getActiveObject() || EKQ.canvas.getActiveGroup()
        if (!activeObject._objects) {
            EKQ.canvas.remove(activeObject)
            this.close_tools()
            return false
        }

        if(activeObject.getObjects()){
            EKQ.canvas.remove(activeObject)
            let Objects = activeObject.getObjects()
            console.log(Objects)

            Objects.filter(item=>{
                EKQ.canvas.remove(item)
            })
            EKQ.canvas.discardActiveObject()
            EKQ.canvas.renderAll()
            this.close_tools()
            return false
        }
        // let activeGroup = EKQ.canvas.getActiveGroup()
        //
        // if (activeObject) {
        //     let objectsInGroup = activeObject.getObjects();
        //     EKQ.canvas.discardActiveGroup()
        //     objectsInGroup.filter(object => {
        //         EKQ.canvas.remove(object)
        //     })
        // }
        // EKQ.canvas.renderAll()
        // this.close_tools()

    }
    close_tools(){
        CL.controls.tools = false
        CL.controls.tools_extra = false
        CL.controls.module = false
    }
    open_tools() {
        CL.controls.tools = true
    }
    textfont(event){
        CL.controls.tools_extra = false
        CL.controls.module = true
        CL.controls.module_select = event.getAttribute('data-id')
        CL.controls.module_name = 'module-'+event.getAttribute('data-id')+'-kq'
    }

    align(event){
        let activeObj = EKQ.canvas.getActiveObject() || EKQ.canvas.getActiveGroup()
        let type = event.getAttribute('data-id')
        let position = 0
        if (activeObj) {
            switch (type) {
                case 'left':
                    activeObj.set({ left: position })
                    break
                case 'right':
                    position = EKQ.canvas.width
                     activeObj.set({ left: position })
                    break
                case 'top':
                    activeObj.set({ top: position })
                    break
                case 'bottom':
                    position = EKQ.canvas.height
                    activeObj.set({ top: position })
                    break
                case 'center':
                    activeObj.viewportCenterH();
                    break;
                case 'middle':
                    activeObj.viewportCenterV();
                    break;
            }
            activeObj.setCoords();
            EKQ.canvas.renderAll();

        }
    }

    textstyle(event) {
        let type = event.getAttribute('data-id')
        let object = EKQ.canvas.getActiveObject() || EKQ.canvas.getActiveGroup()
        let array_type= ['textbox','i-text']
        if (object && array_type.indexOf( object.get('type') ) > - 1 ) {
            let styleName = ''
            let value = ''
            switch(type) {
                case 'textbold':
                    styleName = 'fontWeight'
                    value = object[styleName]=='bold'?'':'bold'
                    object.set(styleName, value)
                    break;

                case 'textitalic':
                    styleName = 'fontStyle'
                    value = object[styleName]=='italic'?'':'italic'
                    object.set(styleName, value)
                    console.log(object)
                    break;

                case 'textalignleft':
                    styleName = 'textAlign'
                    value = 'left'
                    object.set(styleName, value)
                    break;

                case 'textalignright':
                    styleName = 'textAlign'
                    value = 'right'
                    object.set(styleName, value)
                    break;

                case 'textaligncenter':
                    styleName = 'textAlign'
                    value = 'center'
                    object.set(styleName, value)
                    break;

                case 'textalignjustify':
                    styleName = 'textAlign'
                    value = 'justify'
                    object.set(styleName, value)
                    break;

                case 'underline':
                    value = object[type]?'':true
                    object.set(type, value)
                    break;

                case 'overline':
                    value = object[type]?'':true
                    object.set(type, value)
                    break;

                case 'linethrough':
                    value = object[type]?'':true
                    object.set(type, value)
                    break;
                case 'uppercase':
                    object.text = object.text.toUpperCase();
                    break;

                case 'lowercase':
                    object.text = object.text.toLowerCase();
                    break;
            }
            object.set({dirty: true});
            EKQ.canvas.renderAll()
        }
    }

    textshadow(event)
    {
        let object = EKQ.canvas.getActiveObject()
        console.log(object)
        if (object.get('type') === 'i-text'){
            object.set('shadow',{
                    color: '#000000',
                    blur: 2,
                    offsetX: 3,
                    offsetY: 3
                })
            EKQ.canvas.renderAll()
        }

    }
    layerchange(event){
        let selectedObject = EKQ.canvas.getActiveObject() || EKQ.canvas.getActiveGroup()
        let type = event.getAttribute('data-id')
        if(selectedObject){
            switch (type) {
                case 'layerup':
                    EKQ.canvas.bringForward(selectedObject)
                    break
                case 'layerdown':
                    EKQ.canvas.sendBackwards(selectedObject)
                    break
                case 'layertop':
                    EKQ.canvas.bringToFront(selectedObject)
                    break
                case 'layerbottom':
                    EKQ.canvas.sendToBack(selectedObject)
                    break
            }
        }
        EKQ.canvas.renderAll();
    }

    mergegroup() {
        let activegroup = EKQ.canvas.getActiveObject()
        let objectsInGroup = activegroup.getObjects()
        EKQ.canvas.discardActiveObject()
        objectsInGroup.filter(object => {
            EKQ.canvas.remove(object)
        })
        EKQ.canvas.add(new fabric.Group(objectsInGroup))
        EKQ.canvas.renderAll();
    }
    ungroup(){
        var activeObject = EKQ.canvas.getActiveObject();
        if(activeObject.type=="group"){
            var groups = activeObject._objects;
            activeObject._restoreObjectsState();
            EKQ.canvas.remove(activeObject);
            groups.filter( item=>{
                EKQ.canvas.add(item);
                EKQ.canvas.item(EKQ.canvas.size()-1).hasControls = true;
                EKQ.canvas.setZoom(EKQ.canvas.getZoom() *0.99999);
            })
            EKQ.canvas.discardActiveObject()
            EKQ.canvas.renderAll();
        }
    }

    flip(event){
        let type = event.getAttribute('data-id')
        let activeObject = EKQ.canvas.getActiveObject() || EKQ.canvas.getActiveGroup()
        if (activeObject) {
            activeObject.toggle(type);
            EKQ.canvas.renderAll();
        }
    }
    rotate(event){
        let type = event.getAttribute('data-id')
        let activeObject = EKQ.canvas.getActiveObject() || EKQ.canvas.getActiveGroup()
        let ro = (type == 'flipl45')?45:-45
        let round = 360
        if (activeObject) {
            let angle = activeObject.angle + ro % round
            activeObject.rotate(angle).setCoords()
            EKQ.canvas.renderAll()
        }
    }

    cloneObjects(){
        var activeObject = EKQ.canvas.getActiveObject() || EKQ.canvas.getActiveGroup()
        if (activeObject) {
            activeObject.clone(function (cloned) {
                EKQ.canvas.discardActiveObject();
                cloned.set({
                    top: cloned.top + TKQ.TopClone,
                    evented: true
                });
                EKQ.canvas.add(cloned);
                EKQ.canvas.setActiveObject(cloned);
                EKQ.canvas.requestRenderAll();
            });
        }
    }

    lock(event){
        let update = {lock:true,unlock:false}
        let object = EKQ.canvas.getActiveObject()  || EKQ.canvas.getActiveGroup()
        let id = event.getAttribute('data-id')
        if(!object)return
        object.lockMovementX = object.lockMovementY =  update[id];
        object.lockScalingX = object.lockScalingY = update[id];
        this.UpdateLock()
    }

    UpdateLock(){
        let update = ["lock","unlock"]
        let object = EKQ.canvas.getActiveObject()  || EKQ.canvas.getActiveGroup()
        let id = (object.lockMovementX)?'lock':'unlock'
        object.setControlsVisibility({
            mt: false, // middle top disable
            mb: false, // midle bottom
            ml: false, // middle left
            mr: false, // I think you get it
        })
        update.filter(item=>{
            let status = false
            if(item != id)status = true
            let search = CL.tool_detail.findIndex(tool=>tool.id == item)
            if(search> -1)CL.tool_detail[search].status = status
        })
    }

    CreateHexOpacity(number){
        let abc = ["a","b","c","d","e","f"]
        let num = [1,2,3,4,5,6,7,8,9]
        let start = 1
        let end = 99
        let percent = 100
        let hex = Array(end).fill().map((_, idx) => start + idx)
        abc.filter(text=>{
            let create = num.map(item=>text+item)
            hex = hex.concat(create)
        })
       let stt = Math.round( hex.length/100 * number )
       let resulf = hex[stt]
       if(stt < 9)resulf ='0'+resulf
       if(number==100)resulf =""
        return resulf
    }

    display_module(event){
        CL.controls.tools_extra = false
        CL.controls.module = true
        CL.controls.module_select = event.getAttribute('data-id')
        CL.controls.module_name = 'module-'+event.getAttribute('data-id')+'-kq'
    }

    makeitbackground(event){
        let object = EKQ.canvas.getActiveObject()  || EKQ.canvas.getActiveGroup()
        let scale = EKQ.canvas.backgroundImage ? EKQ.canvas.backgroundImage.scaleX:1
        object.set({'left':0, 'top':0});
        EKQ.canvas.setBackgroundImage(object, EKQ.canvas.renderAll.bind(EKQ.canvas), {
            scaleX: scale,
            scaleY: scale
        });
        EKQ.canvas.remove(object);
    }
}
var TKQ = new Tools()