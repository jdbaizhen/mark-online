import { getSession, setSession } from '@/utils/util.js'
const Login = {
  state: {
    currentPage: 0
  },
  mutations: {
    changeCurrentPage (state, newCurrentPage) {
      if (getSession('currentPage')) {
        state.currentPage = getSession('currentPage')
      }
      state.currentPage = newCurrentPage
      setSession('currentPage', newCurrentPage)
    } 
  }
}

export default Login