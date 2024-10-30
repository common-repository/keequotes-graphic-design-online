<?php
/*
Plugin Name: Keequotes U-Print – Graphic Design Online
Description: Create beautiful designs with 10000+ templates and stock elements. Download or insert your designs into Wordpress Editor.
Version: 2.1.7
Author: U-Print
Author URI: https://u-print.online/
License: GPLv2 or later
Text Domain: kgdo
*/

define('KGDO_CD_PATH',plugin_dir_path(__FILE__));
define('KGDO_CD_URL',plugins_url('keequotes-graphic-design-online'));
define('KGDO_ajax_url',admin_url( 'admin-ajax.php' ));
define('KGDO_K_API',get_option('key_keequotes'));
define('KGDO_K_REGISTER','https://u-print.online/profile');
define('KGDO_URL_API','https://u-print.online/api');
define('KGDO_URL','https://u-print.online');
define('KEY_UNSPLASH','UXLXuYSobDmQYY6OCg8CYxV2YVFAReE2j5bRmDkR7LU');
define('TOKEN_UNSPLASH','74GuU6ZzgKdwp1c7TWyFvGr3CAO4vPDMxV1miQweMlM');
include_once ('functions.php');
add_shortcode('cardonline_v2','f_kgdo_cardonline_v2');
function f_kgdo_cardonline_v2($alt,$content){
    include_once ('templates/template_single_v2.php');
}
// create custom plugin settings menu
add_action('admin_menu', 'kgdo_plugin_create_menu');

function kgdo_plugin_create_menu() {
    //create new top-level menu
    if(KGDO_K_API){
    add_menu_page('U-Print', 'U-Print', 'publish_posts', 'template_keequotes_v2', 'kgdo_plugin_settings_page_v2' , 'dashicons-tickets-alt',10 );
    add_submenu_page( 'template_keequotes_v2', 'Templates', 'Templates', 'manage_options', 'template_keequotes_v2','kgdo_plugin_settings_page_v2');
    add_submenu_page( 'template_keequotes_v2', 'Setting', 'Setting', 'manage_options', 'setting_plugin','kgdo_license_plugin_menu');
    }
    else {
    add_menu_page('U-Print', 'U-Print', 'publish_posts', 'setting_plugin', 'kgdo_license_plugin_menu' , 'dashicons-tickets-alt',10 );
    add_submenu_page( 'template_keequotes', 'Setting', 'Setting', 'manage_options', 'setting_plugin','kgdo_license_plugin_menu');
    }

}
function kgdo_plugin_settings_page_v2() {
    echo sprintf('<div class="wrap">%s</div>',do_shortcode('[cardonline_v2]'));
}
function kgdo_license_plugin_menu($option){
    global $option;
   include_once ('setting.php');
}
function kgdo_r_set(){
    register_setting( 'setting_plugin', 'key_keequotes', 'kgdo_check_license' );
}
add_action('admin_init','kgdo_r_set');
add_action('enqueue_block_editor_assets', 'kgdo_block_editor_text_highlight_button');
function kgdo_block_editor_text_highlight_button() {
    ob_start();
    add_thickbox();
    ?>
    <a title="Design Keequotes" href="#TB_inline?width=800&height=550&inlineId=modal-window-card" class="button thickbox" id="add-design-editor"  style="display:none;">
        <span class="dashicons dashicons-format-image" style="vertical-align: middle;"></span> Add Design</a>
    <div id="modal-window-card" style="display:none;">
        <?php include_once('templates/template_single_v2.php') ?>
    </div>
    <script>

    </script>
    <?php
    $resulf = ob_get_contents();
    return $resulf;
    ob_end_clean();
}
function gutenberg_KDO_register_block() {
    register_block_type( __DIR__ );
}
add_action( 'init', 'gutenberg_KDO_register_block' );