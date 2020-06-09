var B2VerifyPage = new Vue({
    el:"#verify",
    data:{
        users:'',
        step:1,
        mp:[],
        show:false,
        time:null,
        seconds:60,
        locked:false,
        fileLocked:false,
        data:{
            money:false,
            title:'',
            name:'',
            identification:'',
            phone:'',
            card:'',
            status:1
        },
        status:0
    },
    mounted(){
        if(this.$refs.verify){
            this.getUsers()
            let userData = JSON.parse(localStorage.getItem('userData'))
            if(userData){
                this.getMpQrcode()
            }
        }
    },
    methods:{
        goStep(step){
            let userData = JSON.parse(localStorage.getItem('userData'))
            if(userData){
                this.step = step
            }else{
                login.show = 1
                login.type = 1
            }
        },
        getUsers(){
            this.$http.post(b2_rest_url+'getVerifyUsers').then(res=>{
                this.users = res.data
            })
        },
        getMpQrcode(){
            this.$http.post(b2_rest_url+'getVerifyInfo').then(res=>{
                this.mp = res.data
                this.data.money = res.data.data.money
                this.status = res.data.status
                this.data = res.data.data
                this.mp.status = res.data.data.mp
                if(res.data.data.status == 2 || res.data.data.status == 4){
                    this.step = 3
                }
            })
        },
        checkSubscribe(){
            if(this.locked == true) return
            this.locked = true
            this.$http.post(b2_rest_url+'checkSubscribe').then(res=>{
                if(res.data){
                    this.mp.status = 1
                    this.seconds =0
                    this.time = null
                    this.show = false
                }
                this.locked = false
            })
        },
        showQrcode(){
            if(this.mp.status == 1 || this.mp.status == 2) return
            this.show = !this.show
            this.seconds = 60
        },
        timeOut(){
            if(this.seconds <= 0){
                this.time = null
                this.show = false
                return
            }
            this.time = setTimeout(()=>{
                this.seconds--
                this.timeOut()
                this.checkSubscribe()
            },1000)
        },
        pay(price){
            let userData = JSON.parse(localStorage.getItem('userData'))
            if(!userData){
                login.show = true
            }else{
                b2DsBox.data = {
                    'title':'认证服务',
                    'order_type':'verify',
                    'order_price':price
                }
                b2DsBox.show = true
            }
        },
        getFile(event){
            if(event.target.files.length <= 0) return
            if(this.fileLocked == true) return
            this.fileLocked = true

            this.data.card = ''

            this.progress = 0

            let file = event.target.files[0]

            this.show.image = true

            let formData = new FormData()

            formData.append('file',file,file.name)
            formData.append("post_id", 1)
            formData.append("type", 'verify')

            let config = {
                onUploadProgress: progressEvent=>{
                    this.progress = progressEvent.loaded / progressEvent.total * 100 | 0
                }
            }

            this.$http.post(b2_rest_url+'fileUpload',formData,config).then(res=>{
                this.data.card = res.data.url
                this.$refs.fileInput.value = null
                this.fileLocked = false;
            }).catch(err=>{
                this.$toasted.show(err.response.data.message, {
                    theme: 'primary', 
                    position: 'top-center', 
                    duration : 4000,
                    type:'error'
                })
                this.fileLocked = false
                this.progress = 0
                this.$refs.fileInput.value = null
            })
        },
        submitVerify(){
            if(this.locked == true) return
            this.locked = true
            this.$http.post(b2_rest_url+'submitVerify',Qs.stringify(this.data)).then(res=>{
                if(res.data){
                    location.reload()
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
    },
    watch:{
        show(val){
            if(val){
                this.seconds = 60
                this.timeOut()
            }
        }
    }
})