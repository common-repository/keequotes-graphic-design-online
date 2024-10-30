(function() {
	tinymce.PluginManager.add( 'custom_link_class', function( editor, url ) {
		// Add Button to Visual Editor Toolbar
		editor.addButton('custom_link_class', {
			title: 'Add Design',
			image: url + '/design-service.png',
			cmd: 'custom_link_class',
			class:'asfdsafsaf'
		});	

		// Add Command when Button Clicked
		editor.addCommand('custom_link_class', function() {
			var a = document.querySelector('#add-design-editor');
			for(var i in tinymce.editors){
				if(editor.id == tinymce.editors[i]['id'] && !isNaN(i))a.setAttribute('data-number',i);
			}
			a.click();
		});
	});
})();