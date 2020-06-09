(function() {

    var checkWriteUser = new Vue({
        el:'.write-loading',
        data:{
            postId:0,
            msg:''
        },
        mounted(){
            if(this.$refs.check){
                this.postId = this.$refs.check.getAttribute('data-postId')
                this.checkWriteUser()
            }
        },
        methods:{
            checkWriteUser(){
                this.$http.post(b2_rest_url+'checkWriteUser','post_id='+this.postId).then(res=>{
                    location.href = res.data
                }).catch(err=>{
                    this.msg = err.response.data.message
                })
            }
        }
    })
    
    var writeHead = new Vue({
        el:'#write-head',
        data:{
            postData:{
                thumb:'',
                cats:[],
                collections:[]
            },
            cat:'',
            cats:b2_write_data.cats,
            collection:'',
            collections:b2_write_data.collections,
            locked:false,
            showLib:false
        },
        mounted(){
            let userData = JSON.parse(localStorage.getItem('userData'))
            if(!userData){
                login.show = true
                return
            }
            
            if(b2_write_data.cats_default){
                this.cat = parseInt(b2_write_data.cats_default)
                this.collection = parseInt(b2_write_data.collections_default)
            }
            Vue.nextTick(()=>{
                autosize(this.$refs.writeTitle);
            })
        },
        methods:{
            // addThumb(event){
            //     if(event.target.files.length <= 0) return
            //     if(this.locked == true) return
            //     this.locked = true
    
            //     let formData = new FormData()
            //     formData.append('file',event.target.files[0],event.target.files[0].name)
            //     formData.append("post_id", 1)
    
            //     this.$http.post(b2_rest_url+'imageUpload',formData).then(res=>{
            //         this.postData.thumb = res.data.url
            //         this.locked = false
            //         var img=new Image();
            //         img.src=res.data.url;
            //         img.onload=function(){
            //             new Sticky('#trix-toolbar .trix-button-row');
            //         };
            //     }).catch(err=>{
            //         this.$toasted.show(err.response.data.message, {
            //             theme: 'primary', 
            //             position: 'top-center', 
            //             duration : 4000,
            //             type:'error'
            //         })
            //         this.locked = false
            //     })
            // },
            //字符串转 dom
            allowWrite(){
                return userTools.role.write
            },
            showImgLib(){
                this.showLib = true
                writeEditor.imgTable = 'lib'
                writeEditor.showImageBoxAc('image')
                // writeEditor.thumbPicked = true
                // writeEditor.$refs.imglib.className += ' trix-active'
                // writeEditor.$refs.imglib.setAttribute('data-trix-active',true)
                // writeEditor.getAttachments('image')
            },
            catPicked(id){
                for (let i = 0; i < this.cats.length; i++) {
                    if(this.cats[i].id == id){
                        return this.cats[i].name
                    }
                }
            },
            removeCat(id){
                if(this.postData.cats.length <= 1) return 
                for (let i = 0; i < this.postData.cats.length; i++) {
                    if(this.postData.cats[i] == id){
                        this.postData.cats.splice(i,1);
                    }
                }
            },
            collectionPicked(id){
                for (let i = 0; i < this.collections.length; i++) {
                    if(this.collections[i].id == id){
                        return this.collections[i].name
                    }
                }
            },
            removeCollection(id){
                if(this.postData.collections.length <= 1) return 
                for (let i = 0; i < this.postData.collections.length; i++) {
                    if(this.postData.collections[i] == id){
                        this.postData.collections.splice(i,1);
                    }
                }
            }
        },
        watch:{
            cat(val){
                if(this.postData.cats.length > 3 || this.postData.cats.indexOf(val) !== -1 || val == 0) return
                this.postData.cats.push(val)
            },
            collection(val){
                if(this.postData.collections.length > 3 || this.postData.collections.indexOf(val) !== -1 || val == 0) return
                this.postData.collections.push(val)
            }
        }
    })
    
    var writeEditor = new Vue({
        el:'#b2-editor-box',
        data:{
            imageList:[],
            imgTable:'upload',
            imagePages:'',
            videoList:[],
            videoTable:'upload',
            videoPages:'',
            showImageBox:false,
            showVideoBox:false,
            showPostBox:false,
            showFileBox:false,
            videoPicked:[],
            videoHtml:false,
            paged:1,
            locked:{
                next:false,
                per:false
            },
            imagePicked:[],
            _locked:false,
            thumb:'',
            thumbPicked:false,
            roles:{
              hidden:false,
              video:false,
              file:false
            }
        },
        mounted(){
          tinymce.init({
            selector: '#mytextarea',
            body_class:'entry-content',
            content_css:b2_global.site_info.site_uri+'/Assets/fontend/style.css',
            icons: 'b2',
            content_style: "body {padding: 10px}",
            body_style: '.entry-content {margin:16px}',
            language:'zh_CN',
            base_url: b2_global.site_info.site_uri+'/Assets/fontend/library/tinymce',
            suffix: '.min',
            statusbar: false,
            menubar:false,
            min_height:400,
            toolbar_sticky:true,
            relative_urls: false,
            remove_script_host: false,
            image_advtab:true,
            plugins: 'code,lists,advlist,autoresize,codesample,link,hr,fullscreen,quickbars,image,paste,b2preview',
            toolbar1:'bold italic forecolor backcolor | heading blockquote codesample numlist bullist | link b2imagelibrary b2video hr | insertShotCode | removeformat | code | b2preview | fullscreen',
            image_caption: true,
            content_style: 'img {max-width: 100%;}',
            oninit : "setPlainText",
            quickbars_selection_toolbar: false,
            quickbars_insert_toolbar: false,
            paste_auto_cleanup_on_paste : true,
            paste_remove_styles: true,
            paste_remove_styles_if_webkit: true,
            paste_strip_class_attributes: true,
            setup: (editor)=>{
              //重写标题按钮
              editor.ui.registry.addToggleButton('heading', {
                icon: 'heading',
                tooltip:'Title',
                onAction: function (_) {
                  editor.execCommand('mceToggleFormat', false, 'h2');
                },
                onSetup: function (api) {
                  editor.formatter.formatChanged('h2', function (state) {
                    api.setActive(state);
                  });
                }
              });
    
              editor.ui.registry.addMenuButton('insertShotCode', {
                text: 'insert shot code',
                tooltip:'insert shot code Text',
                fetch:(callback)=>{
                  var items = [
                    {
                      type: 'menuitem',
                      text: 'insert hidden content',
                      onAction: function () {
                        editor.insertContent('<p>[content_hide]</p><p>请在这里编辑您的隐藏内容</p><p>[/content_hide]</p>');
                      }
                    },
                    {
                      type: 'menuitem',
                      text: 'Insert Post',
                      onAction: ()=>{
                        this.showPostBox = true
                      }
                    },
                    {
                      type: 'menuitem',
                      text: 'Insert File',
                      onAction: ()=>{
                        this.showFileBox = true
                      }
                    },
                  ];
                  callback(items);
                }
              });
    
              //图片按钮
              editor.ui.registry.addIcon('b2-image-library', '<svg class="Zi Zi--InsertImage" width="24" height="24"><path d="M21 17.4c0 .9-.9 1.6-2 1.6H5c-1.1 0-2-.7-2-1.6V6.6C3 5.7 3.9 5 5 5h14c1.1 0 2 .7 2 1.6v10.8zm-9.4-3.9a.5.5 0 01-.9 0l-1.3-2a.5.5 0 00-.8 0l-2.2 3.8a.5.5 0 00.5.7h10.3a.5.5 0 00.4-.7l-3-5.5a.5.5 0 00-.9 0l-2.1 3.7z" fill-rule="evenodd"/></svg>');
              editor.ui.registry.addButton('b2imagelibrary', {
                  tooltip: "Insert image",
                  icon: 'b2-image-library',
                  onAction: this.showImageBoxAc
              });
    
              //视频按钮按钮
              editor.ui.registry.addIcon('b2-video', '<svg class="Zi Zi--InsertVideo" width="24" height="24"><path d="M10.5 15c-.4.3-.8 0-.8-.5v-5c0-.6.4-.8.8-.5l4.3 2.5c.5.3.5.7 0 1L10.5 15zM5 5S3 5 3 7v10s0 2 2 2h14c2 0 2-2 2-2V7c0-2-2-2-2-2H5z" fill-rule="evenodd"/></svg>');
              editor.ui.registry.addButton('b2video', {
                  tooltip: "Insert video",
                  icon: 'b2-video',
                  onAction: this.showVideoBoxAc
              });
              
            },
            init_instance_callback(editor){
                if(b2_write_data.edit_content){
                    editor.setContent(b2_write_data.edit_content);
                }
            }
          });
          
          this.checkRole()
        },
        methods:{
            checkRole(){
              this.$http.get(b2_rest_url+'checkUserWriteRole').then(res=>{
                this.roles = res.data
              })
            },
            next(type){
                if(type === 'image'){
                    if(this.paged >= this.imagePages){
                        this.locked.next = true
                        return
                    }
                }else{
                    if(this.paged >= this.videoPages){
                        this.locked.next = true
                        return
                    }
                }
                
                this.paged++
                this.getAttachments(type)
            },
            per(type){
                if(this.paged == 1){
                    this.locked.per = true
                    return
                }
                this.paged--
                this.getAttachments(type)
            },
            fileUpload(event,filetype){
                if(event.target.files.length <= 0) return
                if(this._locked == true) return
                this._locked = true
                
                if(filetype === 'image'){
                    for (let i = 0; i < event.target.files.length; i++) {
                        let file = event.target.files[i]
                        let url = URL.createObjectURL(file)
                        this.imageList.splice(i,0,{
                            'id':'',
                            'att_url':'',
                            'thumb':'',
                            'file':file
                        })
                    }
                    this.imgTable = 'lib'
                    for (let i = 0; i < this.imageList.length; i++) {
                        if(this.imageList[i].file){
                            let formData = new FormData()
                            formData.append('file',event.target.files[i],event.target.files[i].name)
                            formData.append("post_id", 1)
                            formData.append("type", 'post')
                            this.$http.post(b2_rest_url+'fileUpload',formData).then(res=>{
                                this.imageList[i].att_url = res.data.url
                                this.imageList[i].id = res.data.id
                                this.imageList[i].progress = 0
                                this.imageList[i].file = ''
                                this.imageList[i].thumb = res.data.url
                                this.picked('image',res.data.url)
                                this._locked = false
        
                            }).catch(err=>{
                                this.$toasted.show(err.response.data.message, {
                                    theme: 'primary', 
                                    position: 'top-center', 
                                    duration : 0,
                                    type:'error'
                                })
                                this._locked = false
                            })
                        }
                    }
                }else if(filetype === 'video'){
                    for (let i = 0; i < event.target.files.length; i++) {
                        let file = event.target.files[i]
                        this.videoList.splice(i,0,{
                            'id':'',
                            'att_url':'',
                            'thumb':'',
                            'file':file
                        })
                    }

                    this.videoTable = 'lib'
                    for (let i = 0; i < this.videoList.length; i++) {
                        if(this.videoList[i].file){
                            let formData = new FormData()
                            formData.append('file',event.target.files[i],event.target.files[i].name)
                            formData.append("post_id", 1)
                            formData.append("filetype", 'video')
                            formData.append("type", 'post')
                            this.$http.post(b2_rest_url+'fileUpload',formData).then(res=>{
                                this.videoList[i].att_url = res.data.url
                                this.videoList[i].id = res.data.id
                                this.videoList[i].progress = 0
                                this.videoList[i].file = ''
                                this.videoList[i].thumb = res.data.url
                                this.picked('image',res.data.url)
                                this._locked = false

                            }).catch(err=>{
                                this.$toasted.show(err.response.data.message, {
                                    theme: 'primary', 
                                    position: 'top-center', 
                                    duration : 0,
                                    type:'error'
                                })
                                this._locked = false
                            })
                        }
                    }
                }
            },
            videoplay(event,type){
                if(type === 'play'){
                    event.target.play()
                }else{
                    event.target.pause()
                } 
            },
            close(type){
              if(type == 'image'){
                this.showImageBox = false
                writeHead.showLib = false
              }
              if(type === 'video'){
                this.showVideoBox = false
              }
              if(type === 'post'){
                this.showPostBox = false
              }
              if(type === 'file'){
                this.showFileBox = false
              }
              this.paged = 1
            },
            showImageBoxAc(){
              this.showImageBox = true
              this.getAttachments('image')
            },
            showVideoBoxAc(){
              this.showVideoBox = true
              this.getAttachments('video')
            },
            getAttachments(type){
                console.log(type)
                if(this.locked.next || this.locked.per ) return
                this.locked.next = true
                this.locked.per = true
                this.$http.post(b2_rest_url+'getCurrentUserAttachments','paged='+this.paged+'&type='+type).then(res=>{
                    if(type === 'image'){
                        this.imageList = res.data.data
                        this.imagePages = res.data.pages
                    }else{
                        this.videoList = res.data.data
                        this.videoPages = res.data.pages
                    }
                    this.locked.next = false
                    this.locked.per = false
                })
            },
            picked(type,src){
                console.log(src)
                if(type == 'image'){

                    if(writeHead.showLib){
                        this.imagePicked = []
                        this.imagePicked[0] = src
                        return
                    }
    
                    if(this.thumbPicked){
                        this.thumb = src
                    }else{
                        if(this.imagePicked.indexOf(src) !== -1){
                            this.imagePicked.splice(this.imagePicked.findIndex(item => item === src), 1)
                        }else{
                            this.imagePicked.push(src)
                        }
                    }  
                }

                if(type == 'video'){
                    if(this.videoPicked.indexOf(src) !== -1){
                        this.videoPicked.splice(this.videoPicked.findIndex(item => item === src), 1)
                    }else{
                        this.videoPicked.push(src)
                    }
                }
            },
            insert(type){
                let html = '';
                if(type == 'image'){

                    if(writeHead.showLib){
                        writeHead.postData.thumb = this.imagePicked[0]
                        this.imagePicked = []
                        this.showImageBox = false
                        writeHead.showLib = false
                        return
                    }
                    
                    if(this.imgTable == 'link'){
                        let src = document.querySelector('#imageLink').value
                        src = src.split("\n")
                        if(src.length > 0){
                          for (let i = 0; i < src.length; i++) {
                            html += '<p><img src="'+src[i]+'" /></p>';
                          }
                        }
                    }else{
                        for (let i = 0; i < this.imagePicked.length; i++) {
                            html += '<p><img src="'+this.imagePicked[i]+'" /></p>';
                        }
                    }

                    if(html){
                        this.imagePicked = []
                        this.showImageBox = false
                    }
                }

                if(type === 'video'){
                    if(this.videoTable === 'lib'){
                        if(this.videoPicked.length > 0){
                          for (let i = 0; i < this.videoPicked.length; i++) {
                            html += '<p>[b2player src="'+this.videoPicked[i]+'" poster=""]</p>';
                          }
                        }
                    }

                    if(this.videoTable === 'link'){
                        html = '<p>[b2player src="'+document.querySelector('#videoLink').value+'" poster="'+document.querySelector('#videoThumb').value+'"]</p>'
                    }

                    if(this.videoTable === 'html'){
                        html = document.querySelector('#videoHtml').value
                    }

                    if(html){
                        this.videoPicked = []
                        this.showVideoBox = false
                    }
                }

                if(html){
                    console.log(html)
                    tinymce.activeEditor.insertContent(html);
                }
                return
            },
            setThumb(){
                writeHead.postData.thumb = this.thumb

                this.thumbPicked = false
            },
            insertFile(){

                let link = document.querySelector('#fileLink').value
                let name = document.querySelector('#fileTitle').value
                let tq = document.querySelector('#fileTq').value
                let jy = document.querySelector('#fileJy').value

                tinymce.activeEditor.insertContent('<p>[b2_file link="'+link+'" name="'+name+'" pass="'+tq+'" code="'+jy+'"]</p>')

                this.showFileBox =false
                
            },
            insertPost(){
                let url = document.querySelector('#postLink').value
                tinymce.activeEditor.insertContent('<p>[b2_insert_post id="'+url+'"]</p>');
                this.showPostBox = false
            },
            preview(callback){
                let content = tinymce.activeEditor.getContent();

                let data = {
                    'data':content
                }

                this.$https.post(b2_rest_url+'previewPost',Qs.stringify(data)).then(res=>{
                    callback(res.data)
                })
            }
        }
    })
    
    var writeFooter = new Vue({
        el:'#write-footer',
        data:{
            role:{
                key:'none',
                money:'',
                credit:'',
                roles:[],
            },
            tags:[],
            tag:'',
            lengthw:false,
            tagsCount:4,
            excerpt:'',
            custom:[],
            show:{
                'tag':false,
                'role':false,
                'excerpt':false
            },
            customSettings:[],
            locked:false
        },
        mounted(){
            this.custom = b2_write_data.custom_code
            if(this.custom.length > 0){
                for (let i = 0; i < this.custom.length; i++) {
                    this.$set(this.customSettings,this.custom[i].key,this.custom[i].type == 'checkbox' ? [] : '')
                }
            }
    
            if(b2_write_data.edit_content){
                writeHead.postData.thumb = b2_write_data.edit_thumb
                writeHead.postData.cats = b2_write_data.edit_cats
                writeHead.postData.collections = b2_write_data.edit_collections
    
                writeHead.$refs.writeTitle.value = b2_write_data.edit_title
    
                this.tags = b2_write_data.edit_tags
                
                if(b2_write_data.edit_customs.length > 0){
                    for (let i = 0; i < b2_write_data.edit_customs.length; i++) {
                        this.$set(this.customSettings,b2_write_data.edit_customs[i].key,b2_write_data.edit_customs[i].value)
                    }
                }
            
                this.excerpt = b2_write_data.edit_excerpt
    
                this.role = b2_write_data.edit_roles
            }    
        },
        methods:{
            tagChange(e){
                if(this.tags.length > this.tagsCount){
                    this.lengthw = true;
                }
                var val = this.tag.replace(/(，|。)+/g, '');
                if (e.keyCode == 13 || e.keyCode == 32 || e.keyCode == 188 || e.keyCode == 190 || this.tag.indexOf("，")!=-1 || this.tag.indexOf("。")!=-1 || e.type == 'blur') {
                    e.preventDefault();
                    var index = this.tags.indexOf(val);
                    if(index == -1 && val.length > 0 && this.tags.length < this.tagsCount ){
                        this.tags.push(val);
                        this.tag = '';
                    }else{
                        this.tag = '';
                        this.lengthw = false;
                    }
                }
            },
            removeTag(index){
                this.tags.splice(index,1);
            },
            addTag(tag){
                var that = this;
                if(this.tags.length > this.tagsCount) return;
                if(this.tags.indexOf(tag) != -1){
                    this.dubb = tag;
                    setTimeout(function () {
                        that.dubb = '';
                    }, 100);
                    return;
                }else{
                    this.tags.push(tag);
                }
            },
            showSetting(key){
                if(this.show[key] === undefined){
                    this.$set(this.show,key,false)
                }
                this.show[key] = !this.show[key]
            },
            submit(type){
                if(this.locked == true) return
                this.locked = true
                let content = tinymce.activeEditor.getContent();
 
                let data = {
                    title:writeHead.$refs.writeTitle.value,
                    cats:writeHead.postData.cats,
                    collections:writeHead.postData.collections,
                    thumb:writeHead.postData.thumb,
                    content:content,
                    custom:this.customSettings,
                    role:this.role,
                    tags:this.tags,
                    excerpt:this.excerpt,
                    type:type,
                    post_id:b2_write_data.post_id
                }
    
                this.$http.post(b2_rest_url+'insertPost',Qs.stringify(data)).then(res=>{
                    if(type === 'draft'){
                        this.$toasted.show('草稿保存成功！', {
                            theme: 'primary', 
                            position: 'top-center', 
                            duration : 4000,
                            type:'success'
                        })
                        this.locked = false
                        location.href = res.data
                    }else{
                        location.href = res.data
                    }
                    
                    this.locked = false
                }).catch(err=>{
                    this.$toasted.show(err.response.data.message, {
                        theme: 'primary', 
                        position: 'top-center', 
                        duration : 4000,
                        type:'error'
                    })
                    this.locked = false
                })
            }
        }
    }) 
    
    // addEventListener("trix-before-initialize", event => {
    //     event.target.addEventListener("keydown", e => {
    //         if (e.key == "Enter" && e.target.className == 'attachment__caption-editor') {
    //             event.target.editor.insertLineBreak();
    //         }
    //     })
    // })
    
    // addEventListener("trix-toolbar-dialog-show", function(event) {
    //     if(event.dialogName == 'images'){
    //         //获得以往的历史图片
    //         writeEditor.getAttachments('images')
    //     }
    // })
    
    // addEventListener("trix-toolbar-dialog-hide", function(event) {
    //     if(event.dialogName == 'images'){
    //         //获得以往的历史图片
    //         setTimeout(()=>{
    //             writeEditor.thumb = '',
    //             writeEditor.thumbPicked = false
    //         },100)
    //     }
    // })
    
    // addEventListener("trix-initialize", function(event) {
        
    //     //插入分割线
    //     var plain = event.target.toolbarElement.querySelector('.trix-button--icon-plain');
    
    //     plain.addEventListener('click', function() {
    //         const attachment = new Trix.Attachment({ content: "\<hr\>", contentType: "application/vnd.trix.horizontal-rule.html" })
    //         event.target.editor.insertAttachment(attachment)
    //         event.target.editor.insertLineBreak();
    //     })
    
    //     var plain = event.target.toolbarElement.querySelector('.trix-button--icon-hidden');
    //     if(plain){
    //         plain.addEventListener('click', function() {
    //             event.target.editor.insertHTML("[content_hide]<br>请在这里编写您要隐藏内容<br>[/content_hide]<br>")
    //             let currentRange = event.target.editor.getSelectedRange();
    //             event.target.editor.setSelectedRange([currentRange[0]- 16,currentRange[0]- 16])
    //         })
    //     }
    
    //     if(b2_write_data.edit_content){
    //         let str = b2_write_data.edit_content.replace(/data-trix-attributes="/g,'data-trix-attributes=\'')
    //             str = str.replace(/data-trix-attachment="/g,'data-trix-attachment=\'')
    //             str = str.replace(/}"/g,'}\'')
    
    //         event.target.editor.loadHTML(str);
    //     }
    
    //     return;
    
    // })
    window.writeFooter = writeFooter
    window.writeHead = writeHead
    window.writeEditor = writeEditor
    }).call(this);