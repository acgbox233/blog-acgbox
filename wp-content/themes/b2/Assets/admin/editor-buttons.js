(function($) {
    tinymce.create('tinymce.plugins.b2_button', {
        init : function(ed, url) {
            
            var url = b2_admin_global.theme_url+'/Assets/admin/images/';
            ed.addButton( 'hidden_start', {
                image:url+'ed-left-kh.png',
                title : b2_admin_global.text.start_hidden_desc,
                onclick : function() {
                    ed.selection.setContent('[content_hide]');
                }
            });
            ed.addButton( 'hidden_end', {
                image:url+'ed-right-kh.png',
                title : b2_admin_global.text.end_hidden_desc,
                onclick : function() {
                    ed.selection.setContent('[/content_hide]');
                }
            });
            ed.addButton('b2_video',{
                image:url+'ed-video.png',
                title : b2_admin_global.text.b2_video_desc,
                onclick: function() { tinyMCE.activeEditor.execCommand('b2_video'); }
            });
            ed.addButton('b2_file',{
                image:url+'ed-file.png',
                title : b2_admin_global.text.b2_file_desc,
                onclick: function() { tinyMCE.activeEditor.execCommand('b2_file'); }
            });
            ed.addButton('b2_post',{
                image:url+'ed-post.png',
                title : b2_admin_global.text.b2_post_desc,
                onclick: function() { tinyMCE.activeEditor.execCommand('b2_post'); }
            });
            ed.addButton('b2_inv',{
                image:url+'ed-inv.png',
                title : b2_admin_global.text.b2_inv_desc,
                onclick: function() { tinyMCE.activeEditor.execCommand('b2_inv'); }
            });
            // ed.addButton('b2_video',{
            //     image:url+'ed-video.png',
            //     title : b2_admin_global.text.b2_video_desc,
            //     onclick: function() { tinyMCE.activeEditor.execCommand('b2_video'); }
            // })
            // /**
            //  * Adds HTML tag to selected content
            //  */
            // ed.addButton( 'button_green', {
            //     title : 'Add span',
            //     image : '../wp-includes/images/smilies/icon_mrgreen.gif',
            //     cmd: 'button_green_cmd'
            // });
            // ed.addCommand( 'button_green_cmd', function() {
            //     var selected_text = ed.selection.getContent();
            //     var return_text = '';
            //     return_text = '<h1>' + selected_text + '</h1>';
            //     ed.execCommand('mceInsertContent', 0, return_text);
            // });
            ed.addCommand('b2_inv',function(){
                var data = {
                    start: '',
                    end:''
                }
                ed.windowManager.open({
                    title: b2_admin_global.text.b2_inv_desc,
                    data: data,
                    width: 320,
                    height: 280,
                    //wpDialog: true,
                    body: [
                        {
                            name: 'start',
                            type: 'textbox',
                            label: b2_admin_global.text.b2_inv_start,
                            value: data.start,
                            onchange: function() { data.src = this.value(); }
                        },
                        {
                            name: 'end',
                            type: 'textbox',
                            label: b2_admin_global.text.b2_inv_end,
                            value: data.end,
                            onchange: function() { data.src = this.value(); }
                        },
                        {
                            type   : 'container',
                            html   : '<p class="b2_video_box_desc">'+b2_admin_global.text.b2_inv_box_desc+'</p>'
                        }
                    ],
                    onSubmit: function(e) {
                        var shortcode = '[zrz_inv';
                        data = tinymce.extend(data, e.data);
            
                        shortcode += ' start="' + data.start + '"';
                        shortcode += ' end="' + data.end + '"';
            
                        shortcode += ']';
            
                        tinymce.execCommand('mceInsertContent', false, shortcode);
                    }
                });
            })
            ed.addCommand('b2_post',function(){
                var data = {
                    id: '',
                }
                ed.windowManager.open({
                    title: b2_admin_global.text.b2_post_desc,
                    data: data,
                    width: 320,
                    height: 280,
                    //wpDialog: true,
                    body: [
                        {
                            name: 'id',
                            type: 'textbox',
                            label: b2_admin_global.text.b2_file_title,
                            value: data.src,
                            onchange: function() { data.src = this.value(); }
                        },
                        {
                            type   : 'container',
                            html   : '<p class="b2_video_box_desc">'+b2_admin_global.text.b2_post_box_desc+'</p>'
                        }
                    ],
                    onSubmit: function(e) {
                        var shortcode = '[b2_insert_post';
                        data = tinymce.extend(data, e.data);
            
                        shortcode += ' id="' + data.id + '"';
            
                        shortcode += ']';
            
                        tinymce.execCommand('mceInsertContent', false, shortcode);
                    }
                });
            })
            ed.addCommand('b2_file',function(){
                var data = {
                    title: '',
                    url: '',
                    tiqu:'',
                    jieya:''
                }
                ed.windowManager.open({
                    title: b2_admin_global.text.b2_file_desc,
                    data: data,
                    width: 320,
                    height: 280,
                    //wpDialog: true,
                    body: [
                        {
                            name: 'title',
                            type: 'textbox',
                            label: b2_admin_global.text.b2_file_title,
                            value: data.src,
                            onchange: function() { data.src = this.value(); }
                        },
                        {
                            name: 'url',
                            type: 'textbox',
                            label: b2_admin_global.text.b2_file_url,
                            value: data.url,
                            onchange: function() { data.src = this.value(); }
                        },
                        {
                            name: 'tiqu',
                            type: 'textbox',
                            label: b2_admin_global.text.b2_file_tiqu,
                            value: data.tiqu,
                            onchange: function() { data.poster = this.value(); }
                        },
                        {
                            name: 'jieya',
                            type: 'textbox',
                            label: b2_admin_global.text.b2_file_jieya,
                            value: data.jieya,
                            onchange: function() { data.poster = this.value(); }
                        },
                        {
                            type   : 'container',
                            html   : '<p class="b2_video_box_desc">'+b2_admin_global.text.b2_file_box_desc+'</p>'
                        }
                    ],
                    onSubmit: function(e) {
                        var shortcode = '[b2_file';
                        data = tinymce.extend(data, e.data);
            
                        shortcode += ' link="' + data.url + '"';
                        shortcode += ' name="' + data.title + '"';
                        shortcode += ' pass="' + data.tiqu + '"';
                        shortcode += ' code="' + data.jieya + '"';
            
                        shortcode += ']';
            
                        tinymce.execCommand('mceInsertContent', false, shortcode);
                    }
                });
            })
            ed.addCommand('b2_video', function() {
                var data = {
                    src: '',
                    poster: ''
                }
                ed.windowManager.open({
                    title: b2_admin_global.text.b2_video_box_title,
                    data: data,
                    width: 320,
                    height: 280,
                    //wpDialog: true,
                    body: [
                        {
                            name: 'src',
                            type: 'textbox',
                            label: b2_admin_global.text.b2_video_box_src,
                            value: data.src,
                            onchange: function() { data.src = this.value(); }
                        },
                        {
                            name: 'poster',
                            type: 'textbox',
                            label: b2_admin_global.text.b2_video_box_poster,
                            value: data.poster,
                            onchange: function() { data.poster = this.value(); }
                        },
                        {
                            type   : 'container',
                            html   : '<p class="b2_video_box_desc">'+b2_admin_global.text.b2_video_box_desc+'</p>'
                        }
                    ],
                    onSubmit: function(e) {
                        var shortcode = '[b2player';
                        data = tinymce.extend(data, e.data);
            
                        shortcode += ' src="' + data.src + '"';
                        shortcode += ' poster="' + data.poster + '"';
            
                        shortcode += ']';
            
                        tinymce.execCommand('mceInsertContent', false, shortcode);
                    }
                });
            });
        },
        createControl : function(n, cm) {
            return null;
        },
    });
    /* Start the buttons */
    tinymce.PluginManager.add( 'b2_editor_button', tinymce.plugins.b2_button );
})(jQuery);