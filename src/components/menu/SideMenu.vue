<template>
  <a-layout-sider
    v-model="collapsed"
    :class="['sider', isDesktop() ? null : 'shadow', theme, fixSiderbar ? 'ant-fixed-sidemenu' : null ]"
    width="256px"
    :collapsible="collapsible"
    :trigger="null"
  >
    <logo />
    <s-menu
      :collapsed="collapsed"
      :menu="menus"
      :theme="theme"
      :mode="mode"
      style="padding: 16px 0px;"
      @select="onSelect"
    />
  </a-layout-sider>
</template>

<script>
import ALayoutSider from 'ant-design-vue/es/layout/Sider'
import Logo from '../tools/Logo'
import SMenu from './index'
import { mixin, mixinDevice } from '@/utils/mixin.js'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'SideMenu',
  components: { ALayoutSider, Logo, SMenu },
  mixins: [mixin, mixinDevice],
  props: {
    mode: {
      type: String,
      required: false,
      default: 'inline'
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    },
    collapsible: {
      type: Boolean,
      required: false,
      default: false
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    menus: {
      type: Array,
      required: true
    }
  },
  created(){

    if(this.userInfo.id!=1){
      for(let i=0;i<this.menus.length;i++){
          if(this.menus[i].name=="banner.edit"){
          this.menus.splice(i,1)
        }
        if(this.menus[i].name=="floor"){
          console.log(this.menus[i])
          for(var j=0;j<this.menus[i].children.length;j++){
           
            if(this.menus[i].children[j].name=="banner"){
              this.menus[i].children.splice(j,1)
            }
             if(this.menus[i].children[j].name=="top"){
              this.menus[i].children.splice(j,1)
            }
              if(this.menus[i].children[j].name=="icon"){
              this.menus[i].children.splice(j,1)
            }
            //  if(this.menus[i].children[j].name=="tabbar"){
            //   this.menus[i].children.splice(j,1)
            // }
          }
          console.log(this.menus[i])
        }
      
        if(this.menus[i].name=="settings"){
          this.menus.splice(i,1)
        }
      }
    }
  },
  methods: {
    onSelect(obj) {
      this.$emit('menuSelect', obj)
    }
  },
   computed:{
    ...mapGetters(['userInfo'])
  }
}
</script>
