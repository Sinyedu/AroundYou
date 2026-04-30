import vue from 'eslint-plugin-vue'
import ts from '@vue/eslint-config-typescript'

export default [...vue.configs['flat/recommended'], ...ts()]
