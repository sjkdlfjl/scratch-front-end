<template>
  <keep-alive>
  <div
    class="jsmind"
  >
    <!-- 右上角菜单 -->
    <div class="toolbar">
      <ul class="toolbar-list">
        <li class="item">
          <span
            size="16"
            class="percent"
            style="font-size: 14px; color: rgb(29, 29, 31)"
            @click="zoom.value = 100"
            >{{ zoom.value }}%
          </span>
          <div class="scale-slide">
            <ul>
              <li class="normal-item" title="Canvas shrink" @click="zoomOut">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.98 11.95l2.91 2.9c.15.15.15.38 0 .53l-.51.51a.37.37 0 01-.52 0L11.95 13a7.32 7.32 0 111.03-1.03zm-5.66 1.22a5.85 5.85 0 100-11.7 5.85 5.85 0 000 11.7zM4.76 6.6h5.12c.2 0 .37.16.37.36v.73c0 .2-.17.37-.37.37H4.76a.37.37 0 01-.37-.37v-.73c0-.2.16-.36.37-.36z"
                    fill="#2B2F36"
                    fill-rule="nonzero"
                  ></path>
                </svg>
              </li>

              <li class="slider">
                <el-slider
                  v-model="zoom.value"
                  :show-tooltip="false"
                  :min="zoom.min"
                  :max="zoom.max"
                ></el-slider>
              </li>

              <li class="normal-item" title="Canvas zoom" @click="zoomIn">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.98 11.95l2.91 2.9c.15.15.15.38 0 .53l-.51.51a.37.37 0 01-.52 0L11.95 13a7.32 7.32 0 111.03-1.03zm-6.4-5.36V4.76c0-.2.17-.37.37-.37h.73c.2 0 .37.16.37.37v1.83h1.83c.2 0 .37.16.37.36v.73c0 .2-.17.37-.37.37H8.05v1.83c0 .2-.16.37-.37.37h-.73a.37.37 0 01-.36-.37V8.05H4.76a.37.37 0 01-.37-.37v-.73c0-.2.16-.36.37-.36h1.83zm.74 6.58a5.85 5.85 0 100-11.7 5.85 5.85 0 000 11.7z"
                    fill="#2B2F36"
                    fill-rule="nonzero"
                  ></path>
                </svg>
              </li>
            </ul>
          </div>
        </li>

        

        <div
          class="reset item normal-item"
          title="Target the central topic"
          @click="reset"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M.77 0h3.46c.21 0 .38.17.38.38v.77c0 .22-.17.39-.38.39h-2.7v2.7c0 .2-.16.38-.38.38H.38A.38.38 0 010 4.23V.77C0 .34.34 0 .77 0zm14.45 16h-3.46a.38.38 0 01-.38-.39v-.76c0-.22.17-.39.38-.39h2.7v-2.7c0-.2.17-.38.38-.38h.77c.21 0 .38.18.38.39v3.46c0 .43-.34.77-.77.77zM0 15.23v-3.46c0-.21.17-.39.38-.39h.77c.22 0 .39.18.39.39v2.7h2.69c.21 0 .38.16.38.38v.77c0 .2-.17.38-.38.38H.77a.77.77 0 01-.77-.77zM16 .78v3.46c0 .21-.17.38-.38.38h-.77a.38.38 0 01-.39-.38v-2.7h-2.69a.38.38 0 01-.38-.38V.4c0-.2.17-.38.38-.38h3.46c.43 0 .77.34.77.77zm-8 9.99a2.77 2.77 0 110-5.54 2.77 2.77 0 010 5.54z"
              fill="#2B2F36"
              fill-rule="nonzero"
            ></path>
          </svg>
        </div>
      </ul>

    </div>
    <div class="chatting">
        <!-- <div>jkl</div> -->
        <Chatting ></Chatting>
    </div>

    <div class="top-bar">
      <ul class="filter">
        <li
          :class="[item.type, item.status && 'active']"
          @click="toggleFilter(item)"
          v-for="item in filterTypes"
          :key="item.value"
        >
          <i></i>
          <span>{{ item.name }}</span>
        </li>
      </ul>

      <span class="export" @click="screen_shot">Export picture</span>
      
    </div>
    
    <div class="jsmind_layout">
      <div
        id="jsmind_container"
        ref="container"
        @click="nodeClick"
        @contextmenu.prevent.stop="nodeClick"
      ></div>

      <el-dialog
        :title="createType === 'node' ? 'add node' : 'add GPT node'"
        :visible.sync="dialogVisible"
        width="600px"
        @closed="form = {}"
        :destroy-on-close="true"
        :lock-scroll="false"
        :append-to-body="true"
        v-if="selectNodeInfo"
      >
      <!-- selectNodeInfo -->
        <el-form label-width="80px" class="form-con">
          <el-form-item label="Content">
            <el-input
              type="textarea"
              :rows="2"
              v-model="selectNodeInfo.Name"
              class="ele-width"
              maxLength="64"
            ></el-input>
          </el-form-item>
        </el-form>
        <template v-slot:footer>
          <div class="right mr-10">
            <el-button
              type="primary"
              class="common-btn"
              style="margin-left:100px"
              @click="voice"
              size="medium"
              >voice</el-button
            >
            <el-button
              type="primary"
              class="common-btn"
              @click="sureEditNode"
              size="medium"
              >OK</el-button
            >
          </div>
        </template>
      </el-dialog>



     <!-- 用来语音和生成图像的描述 -->
      <el-dialog
        
        :visible.sync="sureEditdesc_dialogVisible"
        width="600px"
        @closed="form = {}"
        :destroy-on-close="true"
        :lock-scroll="false"
        :append-to-body="true"
        v-if="selectNodeInfo && sureEditdesc_dialogVisible"
      >
      <!-- selectNodeInfo -->
        <el-form label-width="80px" class="form-con">
          <el-form-item label="Content">
            <el-input
              type="textarea"
              :rows="2"
              v-model="selectNodeInfo.Name"
              class="ele-width"
              maxLength="64"
            ></el-input>
          </el-form-item>
        </el-form>
        <template v-slot:footer>
          <div class="right mr-10">
            <el-button
              type="primary"
              class="common-btn"
              style="margin-left:100px"
              @click="voice"
              size="medium"
              >voice</el-button
            >
            <el-button
              type="primary"
              class="common-btn"
              @click="sureEditdesc"
              size="medium"
              >OK</el-button
            >
          </div>
        </template>
      </el-dialog>
      
    </div>

    <!-- 右键菜单 -->
    <el-menu
      class="context-menu"
      v-show="showMenu"
      :style="{
        left: menuStyle.left,
        top: menuStyle.top,
        bottom: menuStyle.bottom,
        right: menuStyle.right
      }"
      ref="context"
    >
      <slot>
        <el-menu-item v-show="showDescription" @click = "description">description</el-menu-item>
        <el-menu-item v-show="showGenerateCode" @click = "addCode">generate code</el-menu-item>
        <el-menu-item v-show="showImage" @click="draw">draw</el-menu-item>
        <el-menu-item v-show="showImage" @click="text2img">generate</el-menu-item>
        <!-- <el-menu-item v-show="showSound">upload</el-menu-item> -->
        <el-menu-item v-show="showSound" @click="generateSound">generate</el-menu-item>
        <el-menu-item v-show="!showImage & !showSound & !watchImage & !playSound" @click="addnode">add node</el-menu-item>
        <el-menu-item v-show="!showImage & !showSound & !watchImage & !playSound" @click="addGPTnode">add GPT node</el-menu-item>
        <el-menu-item  v-show="watchImage" @click="watch">watch</el-menu-item>
        <!-- v-show="watchImage" -->
        <el-menu-item v-show="playSound" @click="play">play</el-menu-item>
        <el-menu-item @click="delCard">delete</el-menu-item>
      </slot>
    </el-menu>
  </div>
</keep-alive>
</template>

<script>
import { post, ping } from '../function/request.js'
import { code_img } from '../function/img'
import img1 from "../assets/1.png"
import img2 from "../assets/2.png"
// import img from "../assets/img"
import Chatting from './chatting/Chatting.vue'
class node {
  constructor(at) {
    this.type = at

    this.node_list = new Array()
  }
}

export default {
  components: {
    Chatting
  },
  watch: {
    'zoom.value'(val) {
      const zoom = val / 100
      this.jm.view.setZoom(zoom)

    },
    selectTypes(v) {
      this.loopTreeData(this.mind.data.children, (item) => {
        if (v.length) {
          if (v.includes(item.type)) {
            this.jm.set_node_color(item.id, this.bgMap[item.type].original, '#fff')
          } else {
            this.jm.set_node_color(item.id, this.bgMap[item.type].transparent, '#fff')
          }
        } else {
          this.jm.set_node_color(item.id, this.bgMap[item.type].transparent, '#fff')
        }
      })
    }
  },
  computed: {
    pathColor() {
      return function (type) {
        return this.structure.active === type ? this.structure.pathActiveColor : this.structure.pathOrginalColor
      }
    },
    rectColor() {
      return function (type) {
        return this.structure.active === type ? this.structure.rectActiveColor : this.structure.rectOrginalColor
      }
    }
  },
  data() {
    return {
      desc_map: {},
      node_map: {},  //存放node 树
      img_map: {}, //存放图片
      sound_map: {}, //存放声音
      node_id_count: 100,
      root: null,
      mind: {
        meta: {
          name: '思维导图',
          author: 'pc',
          version: '0.2'
        },
        format: 'node_tree',
        data: {
          id: 'root',
          topic: 'input',
          type: '1',
          direction: 'right',
          children: []
        }
      },
      options: {
        container: 'jsmind_container', // [必选] 容器的ID
        editable: true, // [可选] 是否启用编辑
        theme: '', // [可选] 主题
        view: {
          engine: 'canvas', // 思维导图各节点之间线条的绘制引擎
          hmargin: 120, // 思维导图距容器外框的最小水平距离
          vmargin: 50, // 思维导图距容器外框的最小垂直距离
          line_width: 2, // 思维导图线条的粗细
          line_color: '#ddd' // 思维导图线条的颜色
        },
        layout: {
          hspace: 100, // 节点之间的水平间距
          vspace: 20, // 节点之间的垂直间距
          pspace: 20 // 节点与连接线之间的水平间距（用于容纳节点收缩/展开控制器）
        },
        shortcut: { // 禁用快捷键
          enable: false
        }
      },
      zoom: {
        value: 100, // 层级大小
        min: 10, // 最小层级
        max: 400 // 最大层级
      },
      bgMap: {
        1: {
          original: 'rgb(251, 151, 200)',
          transparent: 'rgb(251, 151, 200, 0.2)'

        },
        2: {
          original: 'rgb(100, 201, 53)',
          transparent: 'rgb(100, 201, 53, 0.2)'
        },
        3: {
          original: 'rgb(67, 50, 173)',
          transparent: 'rgb(67, 50, 173, 0.2)'
        },
        4: {
          original: 'rgb(212, 42, 42)',
          transparent: 'rgb(212, 42, 42, 0.2)'
        },
        5: {
          original: 'rgb(25, 144, 255)',
          transparent: 'rgb(25, 144, 255, 0.2)'
        }
      },
      structure: {
        active: 'right',
        pathOrginalColor: '#2B2F36',
        pathActiveColor: '#3370FF',
        rectOrginalColor: '#C3C6CB',
        rectActiveColor: '#BACEFD'
      },
      dialogVisible: false,
      sureEditdesc_dialogVisible: false,
      selectNodeInfo: {
        id: null,
        Name: ''
      }, // 选中节点信息
      tempNodeInfo: null, // 保存修改之前的信息
      createType: '', // 添加node 或 GPT node
      showMenu: false, // 是否显示右键菜单栏
      showDescription: false,
      showGenerateCode: false,
      showImage: false,
      showSound: false,
      watchImage: false,
      playSound: false,
      menuStyle: {
        top: '',
        bottom: '',
        left: '',
        right: ''
      },
      filterTypes: [
        {
          type: 'r',
          value: '1',
          name: 'Root',
          status: true
        },
        {
          type: 'o',
          value: '2',
          name: 'Object',
          status: true
        },
        {
          type: 'ks',
          value: '3',
          name: 'Material',
          status: true
        },
        {
          type: 'p',
          value: '4',
          name: 'Program',
          status: true
        },
        {
          type: 'c',
          value: '5',
          name: 'code',
          status: true
        }
      ],
      typeQueue: new Set(['1', '2', '3', '4', '5']), // 选中types Set
      selectTypes: ['1', '2', '3', '4', '5'] // 选中types Array
    }
  },
  methods: {
    // 筛选树结构
    toggleFilter(item) {
      item.status = !item.status
      item.status ? this.typeQueue.add(item.value) : this.typeQueue.delete(item.value)
      this.selectTypes = [...this.typeQueue]
    },

    // 重置视图
    reset() {
      document.querySelector('.root').scrollIntoView({
        block: 'center',
        behavior: 'smooth'
      })
    },

    // 缩小
    zoomOut() {
      this.jm.view.zoomOut()
      this.zoom.value = parseInt(this.jm.view.actualZoom * 100)
    },
    // 放大
    zoomIn() {
      this.jm.view.zoomIn()
      this.zoom.value = parseInt(this.jm.view.actualZoom * 100)
    },

    // 循环树结构
    loopTreeData(list, callback) {
      (function doOneFloor(list) {
        if (Array.isArray(list)) {
          for (let i = 0; i < list.length; i++) {
            const item = list[i]
            callback(item, i)
            if (item.children && item.children.length > 0) {
              doOneFloor(item.children)
            }
          }
        }
      })(list)
    },

    // 设置背景颜色
    setColor() {
      this.jm.set_node_color('root', this.bgMap[1].original, '#fff')
      this.loopTreeData(this.mind.data.children, (item) => {
        if (this.selectTypes.length) {
          if (this.selectTypes.includes(item.type)) {
            this.jm.set_node_color(item.id, this.bgMap[item.type].original, '#fff')
          } else {
            this.jm.set_node_color(item.id, this.bgMap[item.type].transparent, '#fff')
          }
        } else {
          this.jm.set_node_color(item.id, this.bgMap[item.type].transparent, '#fff')
        }
      })
    },

    // 切换思维导图结构
    toggleStucture(type) {
      // if (this.structure.active === type) return
      this.jm.get_data(node_tree)
      this.structure.active = 'right'
      console.log("toggle")
      type = 'right'
      switch (type) {
        case 'side':
          // 两边分布
          this.loopTreeData(this.mind.data.children, (item, i) => { item.direction = 'right' })
          break

        case 'left':
          // 向左分布
          this.loopTreeData(this.mind.data.children, (item) => { item.direction = 'right' })
          break

        case 'right':
          // 向右分布
          this.loopTreeData(this.jm.get_data('node_tree').data.children, (item) => { item.direction = 'right' })
          break

        default:
          break
      }

      this.jm.show(this.mind)
      this.init()
    },

    // 初始化配置
    init() {

      this.jm.view.minZoom = 0.1
      this.jm.view.maxZoom = 5
      this.jm.expand_all()
      this.setColor()

      // 重写编辑完成事件
      this.jm.view.edit_node_end = () => {
        const node = this.jm.view.get_editing_node()
        const viewData = node._data.view
        const element = viewData.element
        element.style.zIndex = 'auto'
        if (node.topic === this.editor.value) {
          this.jm.update_node(node.id, node.topic)
          return
        }
        node.topic = this.editor.value
        if (!node.topic) {
          this.$message.info('please input content')
        }
        this.jm.update_node(node.id, node.topic)

        // TODO 调接口
      }

      // 右键菜单
      this.jm.view.add_event(this.editor, 'contextmenu', (e) => {
        const selectedNode = this.jm.get_selected_node()
        // console.log("selectNode:" + selectedNode.data.type)
        //&& selectedNode.data.type
        if (selectedNode) {
          e.preventDefault()
          const el = document.querySelector('.context-menu .el-menu-item')
          const width = parseFloat(window.getComputedStyle(el).width)
          const height = parseFloat(window.getComputedStyle(el).height) * 3 + 12
          const windowHeight = window.innerHeight
          const windowWidth = window.innerWidth

          // 极限位置 避免越界
          if (e.clientY + height > windowHeight) {
            this.menuStyle.left = e.clientX + 'px'
            this.menuStyle.top = 'unset'
            this.menuStyle.bottom = 0
          } else if (e.clientX + width > windowWidth) {
            this.menuStyle.top = e.clientY + 'px'
            this.menuStyle.left = 'unset'
            this.menuStyle.right = 0
          } else {
            this.menuStyle.left = e.clientX + 'px'
            this.menuStyle.top = e.clientY + 'px'
            this.menuStyle.bottom = 'unset'
          }
          this.showMenu = true
          let cur_type = this.node_map.get(selectedNode.id).type
          if (cur_type == 2) {
            this.showDescription = true
          }
          if (cur_type == 4 && selectedNode.children.length === 0 && selectedNode.parent.topic !== "声音" && selectedNode.parent.topic !== "图片") {
            this.showGenerateCode = true
          }
          if (cur_type == 4) {
            console.log("1")

            console.log(selectedNode.parent.topic)
            if (selectedNode.parent.topic === "图片")
              this.watchImage = true
            if (selectedNode.parent.topic === "声音") {
              console.log("2")
              this.playSound = true
            }

          }
          if (cur_type == 3) {
            if (selectedNode.topic === "图片")
              this.showImage = true
            if (selectedNode.topic === "声音")
              this.showSound = true
          }
        } else {
          this.showMenu = false
          this.showDescription = false
          this.showGenerateCode = false
          this.showImage = false
          this.showSound = false
          this.watchImage = false
          this.playSound = false
        }
      })
      this.node_map = new Map([[]]);
      this.img_map = new Map([[]]);
      this.sound_map = new Map([[]]);
      this.desc_map = new Map([[]]);
      var root = this.jm.get_root();
      var root_node = new node(1);
      this.node_map.set(root.id, root_node);
      this.root = root
      // // base64编码的图片
      // let baseImg = 'data:image/png;base64,R0lGODlhqASoAfcAAAAAAAAAMwAAZgAAmQAAzAAA/wArAAArMwArZgArmQArzAAr/wBVAABVMwBVZgBVmQBVzABV/wCAAACAMwCAZgCAmQCAzACA/wCqAACqMwCqZgCqmQCqzACq/wDVAADVMwDVZgDVmQDVzADV/wD/AAD/MwD/ZgD/mQD/zAD//zMAADMAMzMAZjMAmTMAzDMA/zMrADMrMzMrZjMrmTMrzDMr/zNVADNVMzNVZjNVmTNVzDNV/zOAADOAMzOAZjOAmTOAzDOA/zOqADOqMzOqZjOqmTOqzDOq/zPVADPVMzPVZjPVmTPVzDPV/zP/ADP/MzP/ZjP/mTP/zDP//2YAAGYAM2YAZmYAmWYAzGYA/2YrAGYrM2YrZmYrmWYrzGYr/2ZVAGZVM2ZVZmZVmWZVzGZV/2aAAGaAM2aAZmaAmWaAzGaA/2aqAGaqM2aqZmaqmWaqzGaq/2bVAGbVM2bVZmbVmWbVzGbV/2b/AGb/M2b/Zmb/mWb/zGb//5kAAJkAM5kAZpkAmZkAzJkA/5krAJkrM5krZpkrmZkrzJkr/5lVAJlVM5lVZplVmZlVzJlV/5mAAJmAM5mAZpmAmZmAzJmA/5mqAJmqM5mqZpmqmZmqzJmq/5nVAJnVM5nVZpnVmZnVzJnV/5n/AJn/M5n/Zpn/mZn/zJn//8wAAMwAM8wAZswAmcwAzMwA/8wrAMwrM8wrZswrmcwrzMwr/8xVAMxVM8xVZsxVmcxVzMxV/8yAAMyAM8yAZsyAmcyAzMyA/8yqAMyqM8yqZsyqmcyqzMyq/8zVAMzVM8zVZszVmczVzMzV/8z/AMz/M8z/Zsz/mcz/zMz///8AAP8AM/8AZv8Amf8AzP8A//8rAP8rM/8rZv8rmf8rzP8r//9VAP9VM/9VZv9Vmf9VzP9V//+AAP+AM/+AZv+Amf+AzP+A//+qAP+qM/+qZv+qmf+qzP+q///VAP/VM//VZv/Vmf/VzP/V////AP//M///Zv//mf//zP///wAAAAAAAAAAAAAAACH5BAEAAPwALAAAAACoBKgBAAitAPcJHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXMmypcuXMGPKnEmzps2bOHPq3Mmzp8+fQIMKHUq0qNGjSJMqXcq0qdOnUKNKnUq1qtWrWLNq3cq1q9evYMOKHUu2rNmzaNOqXcu2rdu3cOPKnUu3rt27ePPq3cu3r9+/gAMLHky4sOHDiBMrXsy4sePHkCNLnky5suXLmDNIa97MubPnz6BDix5NurTp06hTq17NurXr17Bjy55Nu7bt27hz697Nu7fv38CDCx9OvLjx48iTK1/OvLnz59CjS59Ovbr169izOGvfzr279+/gw4sfT768+fPo06tfz769+/fw48ufT7++/fv48+vfz7+///8ABijggAQWaOCBCCaoNeCCDDbo4IMQRijhhBRWaOGFGGao4YYcdujhhyCGKOKIJJZo4okopqjiiiy26OKLMMYo44w0LdZo44045qjjjjz26OOPQAYp5JBEFmnkkUgmqeSSTDbp5JNQRinllFRWaeWVWClmqeWWXHbp5ZdghinmmGSWaeaZaKap5ppstunmm3DGKeecdNZp55145iep55589unnn4AGKuighBZq6KGIJqrooow26uijkEYq6aSUVmrppZgjZqrpppx26umnoIYq6qiklmrqqaimquqqrLbq6quwxirrrLQg1mrrrbjmquuuvPbq66/ABivssMQWa+yxyCar7LLMNusg7LPQRivttNRWa+212Gar7bbcduvtt+CGK+645JZr7rke6Kar7rrstuvuu/DGK++89NZr77345qvvvvz26++/HAAHLPDABBds8MEIJ6zwwgw37PDDEEcs8cQUV2wc8cUYZ6zxxhx37PHHIIcs8sgkl2zyySinrPLKLBq37PLLMMcs88w012zzzTjnrPPOPPfs889ABxkt9NBEF2300UgnrfTSTDft9NNQRy311FRXGW311VhnrfXWXHft9ddghy322GSXbfbZaKcYrfbabLft9ttwxy333HTXbffdeOet9958Fvft99+ABy744IQXbvjhiCeu+OKMN+4X+OOQRy755JRXbvnlmGeu+eacd+7556AWhy766KSXbvrpqKeu+uqst+7667DHLhb77LTXbvvtuOeu++689+7778AHL/zwFMQXb/zxyCev/PLMN+/889BHL/30FNRXb/312Gev/fbcd+/99+CHL/74FOSXb/756Kev/vrst+/++/DHL//8FPTXb//9+Oev//789+///wAMoAAHFUjAAhrwgAhMoAIXyMAGOvCBEIygBBQnSMEKWvCCGMygBjfIwQ568IMgDBWhCEdIwhKa8IQoTKEKV8jCFrrwhTATjKEMZ0jDGtrwhjjMoQ53yMMe+hXwh0AMohCHSMQiGvGISEyiEpfIxCYTOvGJUIyiFKdIxSpa8YpYzKIWtxLIxS568YtgDKMYx0jGMprxjGgTTKMa18jGNrrxjXCMoxznSMc62hLxjnjMox73yMc++vGPgAykIAcSSchCGvKQiEykIhfJyEY68pGQEoykJCdJyUpa8pKYzKQmN8nJThJ68pOgDKUoR0nKUprylKhMpSoSV8nKVrrylbCMpSxnScta2vKWELjMpS53ycte+vKXwAymMIcSScxiGvOYyEymMpfJzGY685nQEIymNKdJzWpa85rYzKY2t8kRzW5685vgDKc4x0nOcprznOgJTKc618lOQQYEADs=';
      // baseImg = img1
      // this.jm.set_node_background_image(root.id, baseImg, 20, 20)

    },
    // 获取选中标签的 ID
    get_selected_nodeid() {
      const selectedNode = this.jm.get_selected_node()
      if (selectedNode) {
        return selectedNode.id
      } else {
        return null
      }
    },


    //voice语音输入
    voice() {
      const reg = new window.webkitSpeechRecognition;
      // const reg = new window.SpeechRecognitionResult()
      reg.lang = 'zh-CN';
      console.log('voice')
      const that = this
      reg.onresult = function (event) {
        const content = event.results[0][0].transcript;
        console.log(`你说的是：${content}`);
        that.selectNodeInfo.Name = content;
      };
      reg.start()
      reg.end(3000)
    },

    //播放description
    description() {
      let selectedNode = this.jm.get_selected_node()
      // if (selectedNode) {
      //   console.log('description')
      //   let msg = new SpeechSynthesisUtterance()
      //   // msg.text = selectedNode.data
      //   msg.text = 'hellow world'
      //   msg.rate = 0.8
      //   msg.pitch = 1
      //   msg.lang = 'en-US'
      //   msg.onstart = function (event) {
      //     console.log('Speech started');
      //   }
      //   msg.onend = function (event) {
      //     console.log('Speech ended');
      //   }
      //   // 'zh-CN'
      //   window.speechSynthesis.speak(msg)
      // }
      // 初次播报使用模拟按钮触发
      let data = this.desc_map.get(selectedNode.id)
      this.virtualClick(this.SpeakVoice, data)
      // this.speakWithDelay('hellow world')


      this.showDescription = false
      this.showMenu = false
    },

    SpeakVoice(msg = 'hellow world') {
      const speech = new SpeechSynthesisUtterance(msg)
      speech.rate = 0.8
      speech.pitch = 1.0
      // 设置兼容中文
      const voices = window.speechSynthesis.getVoices()
      speech.voice = voices.filter(function (voice) {
        return voice.localService == true && voice.lang == 'en-US'
      })[0]
      console.log(window.speechSynthesis)
      window.speechSynthesis.speak(speech)
    },

    /**
     * 语音播报 带延迟 异步
     * 搭配async await
     * @param msg 播报的信息
     */
    speakWithDelay(utterance, delay = 1000) {
      return new Promise(resolve => {
        const speech = new SpeechSynthesisUtterance(utterance)
        // 设置兼容中文
        let voices = window.speechSynthesis.getVoices()
        speech.voice = voices.filter(function (voice) {
          return voice.localService == true && voice.lang == 'en-US'
        })[0]
        speech.onend = () => {
          setTimeout(resolve, delay)
        }
        window.speechSynthesis.speak(speech)
      })
    },

    /**
     * 模拟按钮点击
     * @param callback
     */
    virtualClick(callback, msg) {
      let button = document.createElement('button')
      button.textContent = '点击我'
      // 添加点击事件处理程序
      button.addEventListener('click', function () {
        console.log(callback)
        callback && callback(msg)
      })

      // 模拟用户点击事件
      let event = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
      })
      button.dispatchEvent(event)
    },

    beQuiet() {
      console.log('停止')
      window.speechSynthesis.cancel()
      SpeakVoice('')
    },





    //base64img转图片存前端
    base64ImgtoFile(dataurl, filename) {
      let arr = dataurl.split(',')
      let mime = arr[0].match(/:(.*?);/)[1]
      let suffix = mime.split('/')[1]
      let bstr = atob(arr[1])
      let n = bstr.length
      let u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      let newName = filename
      return new File([u8arr], `${newName}.${suffix}`, {
        type: mime
      })
    },

    //text to image
    async text2img() {
      let selectedNode = this.jm.get_selected_node()
      if (selectedNode) {
        this.sureEditdesc_dialogVisible = true
        this.selectNodeInfo = {
          id: selectedNode.data.num,
          Name: ''
        }
        this.createType = 'node'
      }
      // let res = await post(
      //   "/api/text_to_image",
      //   {
      //     "text": this.selectNodeInfo.Name,
      //   },
      // );
      // this.img_map.set(this.node_id_count + 1, res.data.image)
      // console.log(res.data.image)
      // // let file = this.base64ImgtoFile(res.data.image, this.node_id_count + 1)
      // // this.addImagNode(selectedNode, null, file)
      // //let baseImg = "data:image/gif;base64,R0lGODlhCwALAIAAAAAA3pn/ZiH5BAEAAAEALAAAAAALAAsAAAIUhA+hkcuO4lmNVindo7qyrIXiGBYAOw=="
      // this.addImgNode(selectedNode, null, "data:image/png;base64," + res.data.image)//res.data.image
      this.showMenu = false
    },

    addImgNode(selectedNode, info, baseImg) {
      // console.log(baseImg.startsWith('data'))
      const selectedNode_id = selectedNode.id
      let this_node = this.jm.add_node(selectedNode, ++this.node_id_count, info, null, 1)
      let cur_type = this.node_map.get(selectedNode_id).type
      this.jm.set_node_color(this.node_id_count, this.bgMap[cur_type + 1].original, '#fff')
      this.jm.set_node_background_image(this.node_id_count, baseImg, 30, 30)
      this.img_map.set(this.node_id_count, baseImg)
      console.log('addimg')
      console.log(this.node_id_count)
      var new_node
      new_node = new node(cur_type + 1)
      this.node_map.set(this.node_id_count, new_node)
      this.node_map.get(selectedNode_id).node_list.push(new_node)
    },

    //生成声音
    async generateSound() {
      let selectedNode = this.jm.get_selected_node()
      if (selectedNode) {
        this.sureEditdesc_dialogVisible = true
        this.selectNodeInfo = {
          id: selectedNode.data.num,
          Name: ''
        }
        this.createType = 'node'
      }
      // let res = await post(
      //   "/api/text_to_sound",
      //   {
      //     "prompt": selectedNode.parent.topic,
      //   },
      // );
      // console.log(res.data.sound)
      // this.sound_map.set(this.node_id_count + 1, res.data.sound)
      // this.addSoundNode(selectedNode, null)
    },

    addSoundNode(selectedNode, info) {
      const selectedNode_id = selectedNode.id
      let this_node = this.jm.add_node(selectedNode, ++this.node_id_count, info, null, 1)
      let cur_type = this.node_map.get(selectedNode_id).type
      this.jm.set_node_color(this.node_id_count, this.bgMap[cur_type + 1].original, '#fff')
      this.jm.set_node_background_image(this.node_id_count, img1, 30, 30)
      var new_node
      new_node = new node(cur_type + 1)
      this.node_map.set(this.node_id_count, new_node)
      this.node_map.get(selectedNode_id).node_list.push(new_node)
    },


    //画画 onload
    draw() {
      localStorage.setItem('text', this.jm.get_selected_node().parent.topic)

      this.$router.push('/pad/' + this.jm.get_selected_node().id)
      // this.img_map.set(this.node_id_count + 1, localStorage.getItem('img'))
      // console.log('draw')
      // console.log(localStorage.getItem('img'))
      // this.addImgNode(this.jm.get_selected_node(), null, 'data:image/jpeg;base64,' + localStorage.getItem('img'))
      this.showMenu = true
      this.showImage = false
    },

    //查看图片
    watch() {
      let data = this.img_map.get(this.jm.get_selected_node().id)
      console.log('watch')
      console.log(this.jm.get_selected_node().id)
      localStorage.setItem('img', data)
      this.$router.push('/canvas')// + this.jm.get_selected_node().id
      this.watchImage = false
      this.showMenu = true
    },

    //播放声音
    play() {
      let selectedNode = this.jm.get_selected_node()
      let sound = this.sound_map.get(selectedNode.id)
      let snd = new Audio(`data:audio/wav;base64,${sound}`)
      snd.play();
      this.showMenu = false
      this.showSound = false
    },

    //function dict
    function_dict() {
      let root = this.jm.get_root()
      let dict = '{'
      dict += '"' + root.topic + '": {{'
      const that = this
      if (root.children.length > 0) {
        root.children.forEach(function (child) {  //car
          dict += '"' + child.topic + '": {{'
          child.children.forEach(function (ch) { //Logic
            if (ch.topic == "逻辑") {
              dict += '"' + 'function' + '": ['
              if (ch.children.length > 0) {
                ch.children.forEach(function (c) { //
                  dict += '"' + c.topic + '",'
                })
              }
              dict += ']'
            }
          })
          dict += '}},'
        })
      }
      dict += '}}}'
      return dict
    },


    //给空白logic后添加
    async newLogic() {
      let p, s

      let selectedNode = this.jm.get_selected_node()
      p = selectedNode.parent.topic
      s = new Array()
      s.push(selectedNode.parent.topic)
      console.log(s)
      let dict = this.function_dict()
      console.log(p)
      console.log(dict)
      let res = await post(
        "/api/character_decomposition",
        {
          "question": p,
          "memory_dict": dict,
        },
      );

      console.log(res.data)
      // console.log("res.data.answer")
      const that = this
      this.addOneNode(selectedNode, res.data.answer)
      // res.data.answer.forEach(function (child) {
      //   that.addOneNode(selectedNode, child)
      // })
    },

    //logic dict
    logic_dict(selectedNode) {
      let sn = selectedNode
      while (sn.topic != "逻辑") {
        sn = sn.parent
      }
      const that = this
      let dict = '{"' + sn.parent.parent.topic + '": {{"' + sn.parent.topic + '": {{'
      dict += '"function": {{'
      if (sn.children.length > 0) {
        sn.children.forEach(function (child) {
          dict += '"' + child.topic + '": ['
          if (child.children.length > 0) {
            child.children.forEach(function (c) {
              dict += '"' + c.topic + '",'
            })
          }
          dict += '],'
        })
      }
      dict += '}}}}}}}'
      return dict
    },


    //给已有logic后添加
    async addLogic() {
      let f, p
      let selectedNode = this.jm.get_selected_node()
      f = selectedNode.topic
      if (selectedNode.children.length == 0) {
        p = null
      } else {
        p = new Array()
        selectedNode.children.forEach(function (child) { p.push(child.topic) })
      }
      let dict = this.logic_dict(selectedNode)
      console.log(dict)
      let res = await post(
        "/api/new_logic",
        {
          "question": f,
          "memory_dict": dict,
        },
      );
      console.log(res)
      const that = this
      this.addOneNode(selectedNode, res.data.logic)
      // res.data.logic.forEach(function (child) {
      //   that.addOneNode(selectedNode, child)
      // })
    },

    async addCode() {
      let l, p
      let selectedNode = this.jm.get_selected_node()
      l = selectedNode.topic
      let res = await post(
        "/api/generate_code",
        {
          "logic": l,
        },
      );
      console.log(res)
      const that = this
      res.data.code.forEach(function (child) {
        that.addCodeNode(selectedNode, child)
      })
      this.showMenu = false
    },




    //添加gpt对象节点,有description
    newGptObject_des(selectedNode, info, data) {
      this.desc_map.set(this.node_id_count + 1, data)
      const selectedNode_id = selectedNode.id
      let this_node = this.jm.add_node(selectedNode, ++this.node_id_count, info, null, 1)
      let cur_type = this.node_map.get(selectedNode_id).type
      this.jm.set_node_color(this.node_id_count, this.bgMap[cur_type + 1].original, '#fff')
      var new_node
      new_node = new node(cur_type + 1)
      this.node_map.set(this.node_id_count, new_node)
      this.node_map.get(selectedNode_id).node_list.push(new_node)
    },


    //生成 object dict
    object_dict() {
      let root = this.jm.get_root()
      let dict = '{'
      dict += '"' + root.topic + '": {{'
      const that = this
      if (root.children.length > 0) {
        root.children.forEach(function (child) {
          dict += '"' + child.topic + '": {{'
          if (that.desc_map.get(child.id)) {
            dict += '"' + 'descripition' + '": "' + that.desc_map.get(child.id) + '"'
          }
          dict += '}},'
        })
      }
      dict += '}}}'
      return dict
    },

    //添加gpt对象
    async newGptObject() {
      let p, s
      if (this.root) {
        this.root = this.jm.get_root()
        p = this.root.topic
        if (this.root.children.length > 0) {
          s = new Array()
          this.root.children.forEach(function (child) { s.push(child.topic) })
        } else {
          s = null
        }
      }
      let dict = this.object_dict()
      console.log(dict)
      let res = await post(
        "/api/new_object",
        {
          "project": p,
          "memory_dict": dict,
        },
      );
      // this.addOneNode(this.root, res.data.spriteName) //添加object
      this.newGptObject_des(this.root, res.data.spriteName, res.data.description)
      let new_id = this.node_id_count
      let new_node = this.jm.get_node(new_id)
      //给object后添加Image、logic、sound
      this.addOneNode(new_node, "图片")
      this.addOneNode(new_node, "逻辑")
      this.addOneNode(new_node, "声音")
    },



    //操作jsmind, 向selectedNode中添加一个info节点
    addOneNode(selectedNode, info) {
      // const selectedNode = this.jm.get_selected_node()
      const selectedNode_id = selectedNode.id
      let this_node = this.jm.add_node(selectedNode, ++this.node_id_count, info, null, 1)
      let cur_type = this.node_map.get(selectedNode_id).type
      if (cur_type == 4) {
        this.jm.set_node_color(this.node_id_count, this.bgMap[4].original, '#fff')
      } else {
        this.jm.set_node_color(this.node_id_count, this.bgMap[cur_type + 1].original, '#fff')
      }
      var new_node
      if (cur_type == 4) {
        new_node = new node(cur_type)
      } else {
        new_node = new node(cur_type + 1)
      }

      this.node_map.set(this.node_id_count, new_node)
      this.node_map.get(selectedNode_id).node_list.push(new_node)
      // return this.node_id_count - 1
    },

    //操作jsmind, 向selectedNode中添加一个info节点
    addCodeNode(selectedNode, info) {
      // const selectedNode = this.jm.get_selected_node()
      const selectedNode_id = selectedNode.id
      let this_node = this.jm.add_node(selectedNode, ++this.node_id_count, info, null, 1)
      let cur_type = this.node_map.get(selectedNode_id).type
      this.jm.set_node_color(this.node_id_count, this.bgMap[cur_type + 1].original, '#fff')
      var new_node
      new_node = new node(cur_type + 1)
      this.node_map.set(this.node_id_count, new_node)
      this.node_map.get(selectedNode_id).node_list.push(new_node)
      // return this.node_id_count - 1
    },


    //生成声音和图像的描述
    async sureEditdesc() {
      let selectedNode = this.jm.get_selected_node()
      if (selectedNode.topic == "图片") {
        console.log('surEditdesc')
        let res = await post(
          "/api/text_to_image",
          {
            "text": this.selectNodeInfo.Name,
          },
        );
        // this.img_map.set(this.node_id_count + 1, res.data.image)
        console.log('surEditdesc')
        console.log(selectedNode.id)
        console.log(res.data.image)
        // let file = this.base64ImgtoFile(res.data.image, this.node_id_count + 1)
        // this.addImagNode(selectedNode, null, file)
        //let baseImg = "data:image/gif;base64,R0lGODlhCwALAIAAAAAA3pn/ZiH5BAEAAAEALAAAAAALAAsAAAIUhA+hkcuO4lmNVindo7qyrIXiGBYAOw=="
        this.addImgNode(selectedNode, null, "data:image/png;base64," + res.data.image)//res.data.image
      } else if (selectedNode.topic == "Sound") {
        let res = await post(
          "/api/text_to_sound",
          {
            "prompt": this.selectNodeInfo.Name,
          },
        );
        console.log(res.data.sound)
        this.sound_map.set(this.node_id_count + 1, res.data.sound)
        this.addSoundNode(selectedNode, null)
      }

      this.showMenu = true
      this.sureEditdesc_dialogVisible = false
    },

    // 保存节点
    async sureEditNode() {
      if (!this.selectNodeInfo.Name) {
        this.$message.info('please input content')
        return
      }
      let info = null
      if (this.createType === 'node') {
        // node
        // TODO 
        info = this.selectNodeInfo.Name
      } else if (this.createType === 'GPT node') {
        // GPT node
        // TODO 

      }
      this.addOneNode(this.jm.get_selected_node(), info)
      const selectedNode = this.jm.get_selected_node()
      const selectedNode_id = selectedNode.id
      let cur_type = this.node_map.get(selectedNode_id).type
      if (cur_type == 1) {
        let new_id = this.node_id_count
        let new_node = this.jm.get_node(new_id)
        //给object后添加Image、logic、sound
        this.addOneNode(new_node, "图片")
        this.addOneNode(new_node, "逻辑")
        this.addOneNode(new_node, "声音")
        console.log(this.jm.get_data('node_tree').data)
      }

      this.dialogVisible = false
      this.showMenu = false
      this.showDescription = false
      this.showGenerateCode = false
      this.showImage = false
      this.showSound = false
      this.watchImage = false
      this.playSound = false
    },

    // 拖拽
    handleDrop(draggingNode, dropNode) {
      // 前一个兄弟节点
      const prevNode = this.jm.find_node_before(dropNode)
      // 获取移动后的node
      const dragForm = {
        modelId: '',
        treeNum: !prevNode ? draggingNode : prevNode.id,
        thisTreeNum: dropNode
      }
      console.log('dragForm', dragForm)

      // TODO 调接口
    },
    // 单击重置选中背景颜色
    nodeClick() {
      const selectedId = this.get_selected_nodeid()
      if (!selectedId) return
      const nodeObj = this.jm.get_node(selectedId)
      this.jm.set_node_color(selectedId, nodeObj.data['background-color'], '#fff')
    },

    // 插入卡片
    insertNode() {
      const selectedNode = this.jm.get_selected_node()
      if (selectedNode.data) {
        this.$emit('insert', selectedNode.data)
      } else {
        this.$message.error('please select one node')
      }
      this.showMenu = false
      this.showDescription = false
      this.showGenerateCode = false
      this.showImage = false
      this.showSound = false
      this.watchImage = false
      this.playSound = false
    },

    // 插入node
    addnode() {
      const selectedNode = this.jm.get_selected_node()
      if (selectedNode.data) {
        this.dialogVisible = true
        this.selectNodeInfo = {
          id: selectedNode.data.num,
          Name: ''
        }
        this.createType = 'node'
      } else {
        this.$message.error('please select one node')
      }

      this.showMenu = false
      this.showDescription = false
      this.showGenerateCode = false
      this.showImage = false
      this.showSound = false
      this.watchImage = false
      this.playSound = false
    },

    // 插入GPT node
    async addGPTnode() {
      const selectedNode = this.jm.get_selected_node()
      if (selectedNode) {
        this.dialogVisible = false
        // this.selectNodeInfo = {
        //   id: selectedNode.data.num,
        //   Name: ''
        // }
        this.createType = 'GPT node'
        const selectedNode = this.jm.get_selected_node()
        const selectedNode_id = selectedNode.id
        let cur_type = this.node_map.get(selectedNode_id).type
        // console.log("cutype" + cur_type)
        switch (cur_type) {
          case 1:
            await this.newGptObject()
            break
          case 3:
            if (selectedNode.topic == 'Logic') {
              console.log("logic")
              await this.newLogic()

            }
            break
          case 4:
            // await this.addCode()
            await this.addLogic()
          default:
            break
        }
      } else {
        this.$message.error('please select one node')
      }
      this.showDescription = false
      this.showMenu = false
      this.showGenerateCode = false
      this.showImage = false
      this.showSound = false
      this.watchImage = false
      this.playSound = false
    },

    // 删除卡片
    delCard() {
      const selectedNode = this.jm.get_selected_node()
      if (selectedNode.data) {
        // TODO
        this.jm.remove_node(selectedNode.id)
        // 获取数据
        console.log(this.jm.get_data('node_tree'))
      } else {
        this.$message.error('please select one node')
      }
      this.showMenu = false
      this.showDescription = false
    },

    // 鼠标滚轮放大缩小
    mouseWheel() {
      if (document.addEventListener) {
        document.addEventListener('domMouseScroll', this.scrollFunc, false)
      }
      this.$refs.container.onmousewheel = this.scrollFunc
    },
    // 滚轮缩放
    scrollFunc(e) {
      e = e || window.event
      if (e.wheelDelta) {
        if (e.wheelDelta > 0) {
          this.zoomIn()
        } else {
          this.zoomOut()
        }
      } else if (e.detail) {
        if (e.detail > 0) {
          this.zoomIn()
        } else {
          this.zoomOut()
        }
      }
      e.preventDefault()
      this.jm.resize()
    },

    // 导出图片
    screen_shot() {
      // 去除透明度
      this.loopTreeData(this.mind.data.children, (item) => this.jm.set_node_color(item.id, this.bgMap[item.type].original, '#fff'))
      try {
        this.jm.screenshot.shootDownload()
      } catch (error) {
        console.log(error)
      }
      setTimeout(() => {
        this.setColor()
      }, 1000)
    },
    // 鼠标拖拽
    mouseDrag() {
      // 里层
      const el = document.querySelector('.jsmind-inner')
      // 选中节点
      let selected

      el.onmousedown = (ev) => {
        // 选中节点
        selected = this.jm.get_selected_node()
        // 标识 是否拖拽节点 避免冲突
        this.dragNodeFlag = !!selected

        const disX = ev.clientX
        const disY = ev.clientY
        const originalScrollLeft = el.scrollLeft
        const originalScrollTop = el.scrollTop
        const originalScrollBehavior = el.style['scroll-behavior']
        const originalPointerEvents = el.style['pointer-events']
        // auto: 默认值，表示滚动框立即滚动到指定位置。
        el.style['scroll-behavior'] = 'auto'
        // 鼠标移动事件是监听的整个document，这样可以使鼠标能够在元素外部移动的时候也能实现拖动
        document.onmousemove = (ev) => {
          if (this.dragNodeFlag) return
          this.drag = false
          ev.preventDefault()
          // 计算拖拽的偏移距离
          const distanceX = ev.clientX - disX
          const distanceY = ev.clientY - disY

          el.scrollTo(originalScrollLeft - distanceX, originalScrollTop - distanceY)

          // 在鼠标拖动的时候将点击事件屏蔽掉
          el.style['pointer-events'] = 'none'
          el.style.cursor = 'grabbing'
        }
        document.onmouseup = () => {
          if (!this.dragNodeFlag) {
            el.style['scroll-behavior'] = originalScrollBehavior
            el.style['pointer-events'] = originalPointerEvents
            el.style.cursor = 'grab'
          }
          document.onmousemove = document.onmouseup = null
        }
      }
    }
  },

  //添加图画节点
  activated() {
    console.log('onupdated')
    if (localStorage.getItem('draw_flag') == '1') {
      // this.img_map.set(this.node_id_count + 2, localStorage.getItem('img'))
      // console.log(localStorage.getItem('img'))
      let data = localStorage.getItem('img')
      if (!data.startsWith("data")) {
        data = 'data:image/jpeg;base64,' + data
      }
      this.addImgNode(this.jm.get_selected_node(), null, data)
    }
    localStorage.setItem('draw_flag', '0')
  },

  mounted() {
    this.jm = jsMind.show(this.options, this.mind)

    // 自定义拖拽完成事件
    jsMind.draggable.prototype.handleDrag = (srcNode, targetNode, targetDirect) => {
      const nextParentId = srcNode.parent.id
      this.handleDrop(nextParentId, srcNode.id)
    }
    this.editor = this.jm.view.e_editor
    this.init()
    this.mouseWheel()
    this.mouseDrag()
  },
  beforeDestroy() {
    document.removeEventListener('domMouseScroll', this.scrollFunc, false)
  }
}
</script>

<style lang="less">
@import '../assets/css/style.less';
</style>
