<template>
    <div class="chatting">
        <div class="ltk">聊天框</div>
        <div class="srk">
            <el-input placeholder="请输入内容"  v-model="input" class="input">
                <el-button slot="append" @click="voice" >语音</el-button> 
                <el-button slot="append"  @click="send" >发送</el-button>
            </el-input>
                <!--    -->
        </div>
    </div>
</template>

<script>
console.log('test')
export default {
    mounted() {
        console.log(this)
    },
    data() {
        return {
            input: '',
        }
    },
    methods: {
        voice() {
            const reg = new window.webkitSpeechRecognition;
            // const reg = new window.SpeechRecognitionResult()
            reg.lang = 'zh-CN';
            console.log('voice')
            const that = this
            reg.onresult = function (event) {
                const content = event.results[0][0].transcript;
                console.log(`你说的是：${content}`);
                that.input += content;
            };
            reg.start()
            reg.end(3000)
        },
        send() {
            this.input = '';
        },
    }
}
</script>

<style lang="less" scoped>
.ltk {
    text-align: center;
    border: 1px solid #dee0e3;
}

.input {
    width: 100%;

}

.srk {
    width: 100%;
    border: 1px solid #dee0e3;
    position: absolute;
    bottom: 0px;
}

.mic {
    background-image: url(../../assets/micro.png);
    background-size: 100% 100%;
}

.chatting {
    position: relative;
    float: right;
    height: 560px;
    width: 400px;
    top: 0px;
    right: 0px;
    overflow: auto;
    // background-color: #fff;
    background-color: #eef1f8;
}

.m-chat-wrap {
    overflow: hidden;
    box-sizing: content-box;
    display: flex;
    flex-direction: column;

    // height: 100vh;
    // padding: 5vw 0px 5vw 0px;
    .m-chat-msg-wrap {
        display: block;
        overflow: hidden;
        box-sizing: content-box;
    }
}
</style>

<script>
export default {
    name: 'Chatting',
}
</script>