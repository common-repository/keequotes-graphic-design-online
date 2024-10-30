<div class="wrap" id="keequotes_seting">
<?php settings_errors( 'setting_plugin_error' );  ?>
<form method="post" id="form_license" action="options.php" >
<?php
    do_action('CD_enqueue_styles');
    settings_fields( 'setting_plugin' );
    do_settings_sections( 'setting_plugin' );
$license = get_option('data_license_keequote');
$license = $license?json_decode($license):[];
?>
<h2>Account Setting</h2>
    <div class="form-setting">
        <div class="form-group">
            <label>License</label>
            <input name="key_keequotes" type="text" value="<?php echo get_option('key_keequotes') ?>" placeholder="Enter key license" class="regular-text">
        </div>
        <div class="form-group">
            <p><?= sprintf('To find the license, please login on <a href="%s">%s</a> and click to <a href="%s">%s</a>','https://u-print.online','u-print.online','https://u-print.online','license') ?></p>
            <?php submit_button( __( 'Save', 'textdomain' ), 'primary', 'wpdocs-save-settings' ); ?>
        </div>
    </div>

</form>
    <div class="form-group">
    <?php if(KGDO_K_API): ?>
        <?php if($license->data->email == 'guest@gmail.com' || $license->data->license->limit_file == null): ?>
            <h2>Upgrade Premium Account</h2>
            <ul>
                <li>Fee: <strong class="red">$0.00</strong> or $1.00 per month or $10.00 per year</li>
                <li>Removed Ads</li>
                <li>Unlimited design templates and resources</li>
                <li>01 GB storage for design template and uploads</li>
            </ul>
            <a class="button button-primary" href="http://u-print.online"><?=  ($license->data->email == 'guest@gmail.com')?'Register now':'Upgrade now' ?></a>
        <?php elseif( $license->data->license->limit_file ): ?>
            <h2><?= $license->data->license->name ?></h2>
            <ul>
                <li><strong>Removed Ads</strong></li>
                <li><strong>Unlimited design templates and resources</strong></li>
                <li>Exprired: <strong><?= $license->data->license->ended_in ?> </strong></li>
                <li>Maximum number of products: <?= $license->data->license->product_maximum ?></li>
                <li>Maximum number of file uploads: <?= $license->data->license->limit_file_number  ?></li>
                <li>Maximum size/file: <?= formatBytes($license->data->license->limit_file *1024*1024) ?></li>
                <li>Maximum file size: <?= formatBytes($license->data->license->maximum_file_size *1024*1024) ?></li>
            </ul>
            <a class="button button-primary" href="http://u-print.online"><?=  _e($license->data->license->name == 'Free'?'Upgrade now':'Renew now') ?></a>
    <?php endif; endif; ?>

    <?php if(!KGDO_K_API): ?>
        <h2>Register free or Premium Account</h2>
        <ul>
            <li>Fee: <span class="red">$0.00</span> or $1.00 per month or $10.00 per year</li>
            <li>Removed Ads</li>
            <li>Unlimited design templates and resources</li>
            <li>01 GB storage for design template and uploads</li>
        </ul>
        <a class="button button-primary" href="http://u-print.online">Register now</a>
        <a class="button button-info button-primary" onclick="setup_guest(this)" data-email="guest@gmail.com" data-license="9fd1176b-d388-4163-9b9a-619f0ecf3d70">Try demo account</a>
    <?php endif; ?>
    </div>
    <p><em>if your current license is valid, you will be added the number of usage days corresponding to the purchased license!</em></p>
<script>
    var setup_guest = (event)=> {
    let form = document.getElementById('form_license')
    let license = event.getAttribute('data-license')
    document.querySelector('[ name="key_keequotes"]').value = license
    form.submit()
    }
</script>

</div>