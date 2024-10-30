<?php
add_action( 'login_enqueue_scripts', 'my_login_stylesheet' );
//upload dir
function KGDO_upload_dir_filter($uploads){
    $day = date('d');
    $uploads['path'] .= '/' . $day;
    $uploads['url']  .= '/' . $day;
    return $uploads;
}
add_filter('upload_dir', 'KGDO_upload_dir_filter');
add_theme_support( 'post-thumbnails' );
add_action('wp_ajax_upload_img_wp', 'kgdo_f_upload_img_wp');
add_action('wp_ajax_nopriv_upload_img_wp', 'kgdo_f_upload_img_wp');
function kgdo_f_upload_img_wp()
    {
        if(isset($_FILES['upload_image']) && is_uploaded_file($_FILES['upload_image']['tmp_name'])){
            $file = $_FILES['upload_image'];
            require_once(ABSPATH . 'wp-admin/includes/admin.php');
            $file_return = wp_handle_upload($file, array('test_form' => false));
            if (isset($file_return['error']) || isset($file_return['upload_error_handler'])) {
                return false;
            } else {
                $filename = $file_return['file'];
                $attachment = array(
                    'post_mime_type' => $file_return['type'],
                    'post_title' => preg_replace('/\.[^.]+$/', '', basename($filename)),
                    'post_content' => '',
                    'post_status' => 'inherit',
                    'guid' => $file_return['url']
                );
                $attachment_id = wp_insert_attachment($attachment, $file_return['url']);
                require_once(ABSPATH . 'wp-admin/includes/image.php');
                $attachment_data = wp_generate_attachment_metadata($attachment_id, $filename);
                wp_update_attachment_metadata($attachment_id, $attachment_data);
                wp_send_json(['resulf'=>true,'url'=>wp_get_attachment_url($attachment_id, 'full'),'id'=>$attachment_id]);

            }
        }

        die();
    }
/// get info license
function kgdo_check_license_plugin($key)
    {

    }

/// check info license
function kgdo_check_license($key)
    {
        $response = wp_remote_get(KGDO_URL_API . '/user/license', ["headers"=>[ 'key-license' => $key]] );
        $response     = wp_remote_retrieve_body( $response );
        $response = json_decode($response);
        update_option('data_license_keequote',json_encode($response));
        if ($response->result) {
            add_settings_error('setting_plugin_error', esc_attr('settings_updated'), __('License is active.'), 'success');
            define('KGDO_K_API',$key,true);
            return $key;
        }else{
            add_settings_error('setting_plugin_error', esc_attr('settings_updated'), __('License key invalid.'), 'error');
            define('KGDO_K_API','');
        }
        return '';
    }


function kgdo_CD_styles_scripts_v2() {
    $dir = KGDO_CD_PATH.'assets/js/modules/';
    // Add custom fonts, used in the main stylesheet.
    wp_enqueue_script( 'sweetalert2', KGDO_CD_URL.'/assets/plugins/sweetalert2/dist/sweetalert2.all.min.js', array(), '20141028', true );
    wp_enqueue_script( 'fabric.min', KGDO_CD_URL.'/assets/js/fabric.min.js', array(), '20141028', true );
    wp_enqueue_script( 'fabric.centering_guidelines',KGDO_CD_URL.'/assets/js/centerLine/centering_guidelines.js', array(), '20141028', true );
    wp_enqueue_script( 'fabric.aligning_guidelines',KGDO_CD_URL.'/assets/js/centerLine/aligning_guidelines.js', array(), '20141028', true );

    wp_enqueue_script( 'glide.min', KGDO_CD_URL.'/assets/js/glide.min.js', array(), '20141028', true );
    wp_enqueue_script( 'fabric.curvedText', KGDO_CD_URL.'/assets/js/fabric.curvedText.js', array(), '20141028', true );
    wp_enqueue_script( 'Vue.min', KGDO_CD_URL.'/assets/js/vue.min.js', array(), '20141028', true );
    wp_enqueue_script( 'v-tooltip.min', KGDO_CD_URL.'/assets/js/v-tooltip.min.js', array(), '20141028', true );
    wp_enqueue_script( 'keequotes.controller', KGDO_CD_URL.'/assets/js/controller.js', array(), '20141028', true );
    wp_enqueue_script( 'keequotes.editor', KGDO_CD_URL.'/assets/js/editor.js', array(), '20141028', true );
    wp_enqueue_script( 'keequotes.tools', KGDO_CD_URL.'/assets/js/tools.js', array(), '20141028', true );
    wp_enqueue_script( 'keequotes.modules', KGDO_CD_URL.'/assets/js/modules.js', array(), '20141028', true );
    if (is_dir($dir)) {
        if ($dh = opendir($dir)) {
            while (($file = readdir($dh)) !== false ) {
                if($file != '.' && $file != '..')wp_enqueue_script( $file, KGDO_CD_URL.'/assets/js/modules/'.$file, array(), '20141029', true );
            }
            closedir($dh);
        }
    }
    wp_enqueue_script( 'keequotes.main', KGDO_CD_URL.'/assets/js/keequotes.js', array(), '20141028', true );
}
add_action( 'CD_enqueue_scripts_v2', 'kgdo_CD_styles_scripts_v2' );
function kgdo_CD_styles() {
    wp_enqueue_style( 'fonts-Roboto', 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap', array(), null );
    wp_enqueue_style( 'CD-style-layout', KGDO_CD_URL.'/assets/css/layout.css', array(), null );
}
add_action( 'CD_enqueue_styles', 'kgdo_CD_styles' );

function formatBytes($bytes) {
    if ($bytes >= 1073741824)
    {
        $bytes = number_format($bytes / 1073741824, 2) . ' GB';
    }
    elseif ($bytes >= 1048576)
    {
        $bytes = number_format($bytes / 1048576, 0) . ' MB';
    }
    elseif ($bytes >= 1024)
    {
        $bytes = number_format($bytes / 1024, 2) . ' KB';
    }
    elseif ($bytes > 1)
    {
        $bytes = $bytes . ' bytes';
    }
    elseif ($bytes == 1)
    {
        $bytes = $bytes . ' byte';
    }
    else
    {
        $bytes = '0 bytes';
    }

    return $bytes;
}

