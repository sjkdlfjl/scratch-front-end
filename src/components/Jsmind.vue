<template>
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
        :title="createType === 'bro' ? 'add node' : 'add node'"
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
              @click="sureEditNode"
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
        <el-menu-item @click="addChild">add node</el-menu-item>
        <el-menu-item @click="addChild">add GPT node</el-menu-item>
        <el-menu-item @click="delCard">delete</el-menu-item>
      </slot>
    </el-menu>
  </div>
</template>

<script>
class node {
  constructor(at) {
    this.type = at
    this.node_list = new Array()
  }
}
export default {
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
      node_map: {},  //存放node 树
      node_id_count: 100,
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
          children: [
            {
              id: 'easy', // [必选] ID, 所有节点的ID不应有重复，否则ID重复的结节将被忽略
              topic: 'Easy', // [必选] 节点上显示的内容
              direction: 'right', // [可选] 节点的方向，此数据仅在第一层节点上有效，目前仅支持 left 和 right 两种，默认为 right
              expanded: true, // [可选] 该节点是否是展开状态，默认为 true
              type: '2', // [可选]自定义节点类型
              children: [
                { id: 'easy1', topic: 'Easy to show', type: '3' },
                { id: 'easy2', topic: 'Easy to edit', type: '3' },
                { id: 'easy3', topic: 'Easy to store', type: '3' },
                { id: 'easy4', topic: 'Easy to embed', type: '3' }
              ]
            },
            {
              id: 'open',
              topic: 'Open Source',
              direction: 'right',
              expanded: true,
              type: '2',
              children: [
                { id: 'open1', topic: 'on GitHub', type: '3' },
                { id: 'open2', topic: 'BSD License', type: '3' }
              ]
            },
            {
              id: 'powerful',
              topic: 'Powerful',
              direction: 'right',
              type: '2',
              children: [
                { id: 'powerful1', topic: 'Base on Javascript', type: '3' },
                { id: 'powerful2', topic: 'Base on HTML5', type: '3' },
                { id: 'powerful3', topic: 'Depends on you', type: '3' }
              ]
            },
            {
              id: 'other',
              topic: 'test node',
              direction: 'right',
              type: '2',
              children: [
                { id: 'other1', topic: "I'm from local variable", type: '3' },
                { id: 'other2', topic: 'I can do everything', type: '3' }
              ]
            }
          ]
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
          original: 'rgb(25, 144, 255)',
          transparent: 'rgb(25, 144, 255, 0.2)'
        },
        5: {
          original: 'rgb(212, 42, 42)',
          transparent: 'rgb(212, 42, 42, 0.2)'
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
      selectNodeInfo: {
        id: null,
        Name: ''
      }, // 选中节点信息
      tempNodeInfo: null, // 保存修改之前的信息
      createType: '', // 添加平级or子级
      showMenu: false, // 是否显示右键菜单栏
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
          name: 'Key Steps',
          status: true
        },
        {
          type: 'p',
          value: '4',
          name: 'Programming',
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
      if (this.structure.active === type) return
      this.structure.active = 'right'
      switch (type) {
        case 'side':
          // 两边分布
          this.loopTreeData(this.mind.data.children, (item, i) => { item.direction = i % 2 ? 'left' : 'right' })
          break

        case 'left':
          // 向左分布
          this.loopTreeData(this.mind.data.children, (item) => { item.direction = 'left' })
          break

        case 'right':
          // 向右分布
          this.loopTreeData(this.mind.data.children, (item) => { item.direction = 'right' })
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
        console.log("selectNode:" + selectedNode.data.type)
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
        } else {
          this.showMenu = false
        }
      })
      this.node_map = new Map([[]]);
      var root = this.jm.get_root();
      var root_node = new node(1);
      this.node_map.set(root.id, root_node);
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

    // 保存节点
    sureEditNode() {
      if (!this.selectNodeInfo.Name) {
        this.$message.info('please input content')
        return
      }

      if (this.createType === 'bro') {
        // 平级
        // TODO 
        // const selectedNode = this.jm.get_selected_node()
        // const selectedNode_id = selectedNode.id
        // this.jm.add_node(selectedNode, ++this.node_id_count, this.selectNodeInfo.Name)
        // // var cur_type = this.node_map.get(selectedNode_id).type
        // var cur_type = 3
        // this.jm.set_node_color(this.node_id_count, this.bgMap[cur_type + 1].original, '#fff')
        // var new_node = new node(cur_type + 1)
        // this.map.add(this.node_id_count, new_node)
      } else {
        // 子级
        // TODO 
        const selectedNode = this.jm.get_selected_node()
        const selectedNode_id = selectedNode.id
        this.jm.add_node(selectedNode, ++this.node_id_count, this.selectNodeInfo.Name, null, 'right')
        if (this.node_map.get(selectedNode_id)) {
          let cur_type = this.node_map.get(selectedNode_id).type
          // var cur_type = 3
          console.log("curtype:" + this.node_map.get(selectedNode_id))
        }
        // let cur_type = this.node_map.get(selectedNode_id).type
        cur_type = 3
        this.jm.set_node_color(this.node_id_count, this.bgMap[cur_type + 1].original, '#fff')
        var new_node = new node(cur_type + 1)
        this.node_map.set(this.node_id_count, new_node)
      }
      this.dialogVisible = false
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
    },
    // 插入平级
    addBrother() {
      const selectedNode = this.jm.get_selected_node()
      if (selectedNode.data) {
        this.dialogVisible = true
        this.selectNodeInfo = {
          id: selectedNode.data.num,
          Name: ''
        }
        this.createType = 'bro'
      } else {
        this.$message.error('please select one node')
      }

      this.showMenu = false
    },

    // 插入子级
    addChild() {
      const selectedNode = this.jm.get_selected_node()
      if (selectedNode.data) {
        this.dialogVisible = true
        this.selectNodeInfo = {
          id: selectedNode.data.num,
          Name: ''
        }
        this.createType = 'child'
      } else {
        this.$message.error('please select one node')
      }

      this.showMenu = false
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
