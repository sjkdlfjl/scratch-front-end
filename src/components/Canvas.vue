<template>
    <keep-alive>
	<div class="container">
        <!-- <image id="Image" :src="imageSrc" show="false"></image> -->
        <canvas id="myCanvas" width="600" height="600"></canvas>
        <div><button class="myButton" type="button" @click="back">back</button></div>
        <!-- <span><input type="button" onclick="back" value="back"></input></span> -->
        
    </div>
    
    
    <!-- <el-button
              type="primary"
              class="common-btn"
              @click="sureEditNode"
              size="medium"
              >OK</el-button
            > -->
    </keep-alive>
</template>

<script>
export default {
    name: 'HelloWorld',
    data() {
        return {
            imageSrc: null
        };
    },
    activated() {

        // var imgbase64 =
        //     'data:image/jpeg;base64,/******';
        let imgbase64 = localStorage.getItem('img')
        if (!imgbase64.startsWith("data")) {
            imgbase64 = 'data:image/jpeg;base64,' + imgbase64
        }
        console.log('canvas')
        //let imgbase64 = "data:image/gif;base64,R0lGODlhCwALAIAAAAAA3pn/ZiH5BAEAAAEALAAAAAALAAsAAAIUhA+hkcuO4lmNVindo7qyrIXiGBYAOw=="
        this.imageSrc = imgbase64
        let img = new Image();

        let myCanvas = document.getElementById('myCanvas').getContext('2d');
        console.log(myCanvas)
        img.onload = () => {
            console.log('canvas')

            myCanvas.clearRect(0, 0, 600, 600);
            myCanvas.drawImage(img, 200, 200, 200, 200);
        };
        img.src = imgbase64;
    },
    methods: {
        back() {
            console.log('bbbbb')
            this.$router.back()
        },
    }
};
</script>

<style>
.container {
    flex-direction: column;
    justify-content: center;
    align-content: center;
    align-items: center;
}

.myButton {
    position: relative;
    z-index: 2;
}

#myCanvas {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
}
</style>
