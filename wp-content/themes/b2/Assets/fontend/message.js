var b2MessagePage = new Vue({
    el:'#message-page',
    data:{
        data:'',
        opt:{
            type:'all',
        },
        selecter:'.message-list ul',
        paged:1,
        api:'getGoldList',
        pages:1,
        url:'',
        avatar:'',
        count:0
    },
    mounted(){
        this.opt.paged = this.$refs.goldData.getAttribute('data-paged')
        this.opt.user_id = this.$refs.goldData.getAttribute('data-user')
        this.avatar = this.$refs.goldData.getAttribute('data-avatar')
        this.$refs.goldNav.go(this.opt.paged,'comment',true)
    },
    methods:{
        get(data){
            this.data = data.data
            this.pages = data.pages
            this.count = data.read_count
            Vue.nextTick(()=>{
                b2Timeago.render(this.$refs.goldData.querySelectorAll('.b2timeago'), 'zh_CN');
                b2SidebarSticky()
            })
        },
        users(users){
            let str = ''
            let leng = users.length
            for (let i = 0; i < leng; i++) {
                if(i == 3 && leng > 3){
                    str = str.slice(0,-1)
                    str += '<span class="gold-and"> 和</span> ' 
                }

                if(users[i] instanceof Object){
                    str += '<a href="'+users[i].link+'" target="_blank">'+users[i].name+'</a>，'
                }else{
                    str += users[i]+'，'
                }
            }

            if(leng > 3){
                return str.slice(0,-1)+' 等人 ';
            }else{
                return str.slice(0,-1)+' ';
            }
        },
        getAvatar(users){
            let avatar = this.avatar;
            for (let i = 0; i < users.length; i++) {
                if(users[i].avatar){
                    avatar = users[i].avatar;
                    break
                }
            }

            return avatar;
        }
    }
})