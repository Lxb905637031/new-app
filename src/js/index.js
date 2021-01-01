import './import'

import Header from '../components/Header'
import NavBar from '../components/NavBar'
import NewsList from '../components/NewList'
import PageLoading from '../components/PageLoading'
import MoreLoading from '../components/MoreLoading'

import { NEWS_TYPE } from '../data'
import service from '../services'
import { scrollToBottom } from '../libs/utils'

;
((doc) => {
    const oApp = doc.querySelector('#app')
    let oListWrapper = null
    let t = null
    const newsData = {}

    const config = {
        type: 'top',
        count: 10,
        pageNum: 0,
        isLoading: false
    }

    const init = async() => {
        render()
        await setNewsList()
        bindEvent()
    }

    function render() {
        const headerTpl = Header.tpl({
            url: '/',
            title: '新闻头条',
            showLeftIcon: false,
            showRightIcon: true
        })
        const navBarTpl = NavBar.tpl(NEWS_TYPE)
        const oListWrapperTpl = NewsList.wrapperTpl(82)
        oApp.innerHTML += (headerTpl + navBarTpl + oListWrapperTpl)
        oListWrapper = oApp.querySelector('.news-list')
    }

    function renderList(data) {
        const { pageNum } = config
        const newsListTpl = NewsList.tpl({
            data,
            pageNum
        })
        MoreLoading.remove(oListWrapper)
        oListWrapper.innerHTML += newsListTpl
        config.isLoading = false
        NewsList.imgShow()
    }

    async function setNewsList() {
        const { type, count, pageNum } = config
        if (newsData[type]) {
            renderList(newsData[type][pageNum])
            return
        }
        oListWrapper.innerHTML = PageLoading.tpl()
        newsData[type] = await service.getNewsList(type, count)
        setTimeout(() => {
            oListWrapper.innerHTML = ''
            renderList(newsData[type][pageNum])
        }, 1500)
    }

    function bindEvent() {
        NavBar.bindEvent(setType)
        NewsList.bindEvent(oListWrapper, setCurrentNews)
        window.addEventListener('scroll', scrollToBottom.bind(null, getMoreList), false)
    }

    function setType(type) {
        config.type = type
        config.pageNum = 0
        config.isLoading = false
        oListWrapper.innerHTML = ''
        setNewsList()
    }

    function setCurrentNews(options) {
        const { idx, pageNum } = options
        const currentNews = newsData[config.type][pageNum][idx]
        localStorage.setItem('currentNews', JSON.stringify(currentNews))
    }

    function getMoreList() {
        if (!config.isLoading) {
            config.pageNum++
                clearTimeout(t)
            const { pageNum, type } = config
            if (pageNum >= newsData[type].length) {
                MoreLoading.add(oListWrapper, false)
            } else {
                config.isLoading = true
                MoreLoading.add(oListWrapper, true)
                t = setTimeout(() => {
                    setNewsList()
                }, 1000)
            }
        }
    }

    init()
})(document)