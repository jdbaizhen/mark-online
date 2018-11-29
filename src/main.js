import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import { Button, Menu, MenuItem, MenuGroup, Icon, Radio, RadioGroup, Checkbox, CheckboxGroup,  Switch, Drawer, Input, Select, Option, Form, FormItem, ColorPicker, DatePicker, Message, Steps, Step, Card } from 'iview'
import 'iview/dist/styles/iview.css';

Vue.component(Button.name, Button)
Vue.component(Menu.name, Menu)
Vue.component(MenuItem.name, MenuItem)
Vue.component(MenuGroup.name, MenuGroup)
Vue.component(Icon.name, Icon)
Vue.component(Radio.name, Radio)
Vue.component(RadioGroup.name, RadioGroup)
Vue.component(Checkbox.name, Checkbox)
Vue.component(CheckboxGroup.name, CheckboxGroup)
Vue.component(Switch.name, Switch)
Vue.component(Drawer.name, Drawer)
Vue.component(Input.name, Input)
Vue.component(Select.name, Select)
Vue.component(Option.name, Option)
Vue.component(Form.name, Form)
Vue.component(FormItem.name, FormItem)
Vue.component(ColorPicker.name, ColorPicker)
Vue.component(DatePicker.name, DatePicker)
Vue.component(Steps.name, Steps)
Vue.component(Step.name, Step)
Vue.component(Card.name, Card)

Vue.prototype.$Message = Message
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
