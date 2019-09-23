import auth from '../api/auth/auth'
import session from '../api/session'
import {
  LOGIN_BEGIN,
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
  LOGOUT,
  REMOVE_TOKEN,
  SET_TOKEN,
  SET_USER
} from './types'
const camelcaseKeys = require('camelcase-keys')

const TOKEN_STORAGE_KEY = 'TOKEN_STORAGE_KEY'

const initialState = {
  authenticating: false,
  error: false,
  token: null,
  user: { username: '' }
}

const getters = {
  isAuthenticated: state => !!state.token
}

const mutations = {
  [LOGIN_BEGIN](state) {
    state.authenticating = true
    state.error = false
  },
  [LOGIN_FAILURE](state) {
    state.authenticating = false
    state.error = true
  },
  [LOGIN_SUCCESS](state) {
    state.authenticating = false
    state.error = false
  },
  [LOGOUT](state) {
    state.authenticating = false
    state.error = false
  },
  [SET_TOKEN](state, token) {
    state.token = token
    localStorage.setItem(TOKEN_STORAGE_KEY, token)
    session.defaults.headers.Authorization = `Token ${token}`
  },
  [REMOVE_TOKEN](state) {
    state.token = null
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    delete session.defaults.headers.Authorization
  },
  [SET_USER](state, user) {
    state.user = user
  }
}

const actions = {
  login({ commit, dispatch }, { username, password }) {
    commit(LOGIN_BEGIN)
    return auth
      .login(username, password)
      .then(({ data }) => commit(SET_TOKEN, data.key))
      .then(() => dispatch('initialize'))
      .then(() => commit(LOGIN_SUCCESS))
      .catch(() => commit(LOGIN_FAILURE))
  },
  logout({ commit }) {
    return auth
      .logout()
      .then(() => commit(LOGOUT))
      .finally(() => commit(REMOVE_TOKEN))
  },
  initialize({ commit, dispatch }) {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY)

    if (token) {
      commit(SET_TOKEN, token)
      dispatch('getUser')
    } else {
      return
    }
  },
  getUser({ commit }) {
    return auth
      .getAccountDetails()
      .then(({ data }) => camelcaseKeys(data))
      .then(data => commit(SET_USER, data))
  }
}

export default {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations
}
