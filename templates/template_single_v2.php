<style>
    /*Loading ripple*/
    .lds-ripple {
        display: inline-block;
        position: relative;
        width: 160px;
        height: 160px;
    }
    .lds-ripple div {
        position: absolute;
        border: 4px solid #fff;
        opacity: 1;
        border-radius: 50%;
        animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
    }
    .lds-ripple div:nth-child(2) {
        animation-delay: -0.5s;
    }
    @keyframes lds-ripple {
        0% {
            top: 75px;
            left: 75px;
            width: 0;
            height: 0;
            opacity: 1;
        }
        100% {
            top: 0px;
            left: 0px;
            width: 150px;
            height: 150px;
            opacity: 0;
        }
    }
    .loading_page{
        position: fixed;
        height: 100vh;
        width: 100%;
        top: 0;
        left: 0;
        z-index: 99999;
        background-color: #1a1c22f2;
        display: none;
    }
    .loading_page.active{
        display: block;
    }
    .loading_page .lds-ripple{
        top: calc(50% - 75px);
        left: calc(50% - 75px);
    }
    #TB_window{
        height: auto !important;
        min-height: 100%;
        width: 100% !important;
        left: 0;
        top: 0 !important;
        padding: 0;
        margin: 0 !important;
    }
    #TB_ajaxContent{
        width: auto !important;
        height: 100vh !important;
    }
    #TB_ajaxContent #keequotes_main .latest-templates{
        padding: 20px;
    }
    .swal2-container{
        z-index: 100070;
    }
</style>
<?php
do_action('CD_enqueue_scripts_v2');
?>
<div id="keequotes_main">
  <div class="menu_main">
      <ul>
          <li v-for="item in menu_main" v-show="item.status">
              <a v-bind:data-id="item.id"  v-bind:class="item.class" v-bind:onclick="item.func"><i v-show="item.icon" v-bind:class="item.icon"></i><span> {{ item.name }}</span></a>
          </li>
      </ul>
      <div class="clearfix"></div>
  </div>
  <div class="latest-templates" v-show="!controls.editor_kq">
      <component v-bind:is="templates_detail.module"></component>
  </div>
  <div v-show="controls.editor_kq" class="editor_control_kq">
    <div class="library_kq">
        <div class="list_library">
            <a class="control_a" onclick="KQ.display_library()" v-if="!controls.add_elements && !controls.resize " v-tooltip.right="buttons.add_element.title"><img v-bind:src="setting.URL_KQ + buttons.add_element.icon"></a>
            <div class="display_library animated fadeInLeft faster" v-if="controls.add_elements">
                <h2>{{ library_detail.name }} <span class="close-library" v-on:click="KQ.close_library"><img v-bind:src="setting.URL_KQ + CL.buttons.close_tool.icon"/></span></h2>
                <div class="list_type">
                    <div class="item-type-kq" v-for="(item, index) in library">
                        <a v-bind:class="library_detail.id == item.id?'active icon_normal':'icon_normal'" v-if="item.status" v-on:click="KQ.display_library(index)"><img v-bind:src="setting.URL_KQ + item.icon"></a>
                    </div>
                </div>
                <div class="content-type-kq">
                    <component v-bind:is="library_detail.module"></component>
                </div>
            </div>
            <component v-bind:is="controls.resize"></component>
        </div>
        <div class="list_tool_basic" v-show="controls.basic">
            <div class="tool_item" v-for="item in tools.basic">
                <a class="control_a" v-tooltip.right="item.name" v-bind:onclick="item.func"><img v-bind:src="setting.URL_KQ + item.icon"></a>
            </div>
        </div>
    </div>
    <div class="editor_kq">
        <div class="kq_editor_content"></div>
        <div class="kq_control"></div>
    </div>
    <div class="tools_kq">
        <transition name="slide-fade" enter-active-class="animated fadeInRight faster" leave-active-class="animated bounceOutRight">
        <div class="tool_main_kq" v-if="controls.tools">
            <div class="tool_item" v-for="item in tools[controls.tools_select]" v-show="item.status">
                <a class="control_a" v-tooltip.left="item.name" v-bind:data-id="item.id" v-bind:onclick="item.func"><img v-bind:src="setting.URL_KQ + item.icon"></a>
            </div>
        </div>
        </transition>
        <transition name="slide-fade" enter-active-class="animated fadeInRight faster" leave-active-class="animated bounceOutRight">
        <div class="tool_sub_kq" v-if="controls.tools_extra.length > 0">
            <div class="tool_item">
                <a class="control_a" v-bind:onclick="buttons.cancel_tool_sub.func" v-tooltip.left="buttons.cancel_tool_sub.title" ><img v-bind:src="setting.URL_KQ + buttons.cancel_tool_sub.icon"></a>
            </div>
          <div class="tool_item" v-for="item in controls.tools_extra">
              <a class="control_a" v-bind:data-id="item.id" v-bind:onclick="item.func" v-tooltip.left="item.name" ><img v-bind:src="setting.URL_KQ + item.icon"></a>
          </div>
        </div>
        </transition>
        <transition name="slide-fade" enter-active-class="animated zoomIn faster" leave-active-class="animated bounceOutRight">
        <div class="tool_module_kq" v-if="controls.module">
                <module-head-kq v-bind:title="CL.modules[CL.controls.module_select].title"></module-head-kq>
                <component v-bind:is="modules[controls.module_select].id"></component>
        </div>
        </transition>
    </div>
  </div>
  <div class="loading_page active"><div class="lds-ripple"><div></div><div></div></div></div>
</div>
<script>
    var ajax_url = '<?php echo KGDO_ajax_url ?>';
    var setting = {
        URL_SITE: '<?= KGDO_URL ?>',
        URL_KQ: '<?= KGDO_CD_URL ?>',
        URL_API: '<?= KGDO_URL_API ?>',
        K_API: '<?= KGDO_K_API ?>',
        json_active: {},
        json_download: {},
        dom_main: '#keequotes_main',
        img_src: '<?php echo KGDO_CD_URL.'/images/8.jpg' ?>',
        fonts: '<?= KGDO_CD_URL.'/assets/library/fonts.json' ?>',
        data: '<?= KGDO_CD_URL.'/assets/library/keequotes.json' ?>',
        style:'<?= KGDO_CD_URL.'/assets/library/style.json' ?>',
        color_img:'<?= KGDO_CD_URL.'/assets/images/backgrounds/colors.jpg' ?>',
        license:'<?= KGDO_URL_API.'/user/license' ?>',
        token_unsplash: '<?= TOKEN_UNSPLASH ?>',
        license_data: {},
        register: '<?= KGDO_K_REGISTER ?>',
    };
</script>
<?php

