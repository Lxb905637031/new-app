export function setPageData(data, count) {
    const len = data.length

    let pageData = []
    let index = 0

    while (index < len) {
        pageData.push(data.slice(index, index += count))
    }
    return pageData
}

export function scrollToTop() {
    setTimeout(() => {
        window.scrollTo(0, 0)
    }, 0)
}

export function scrollToBottom(callback) {
    if (_getScrollTop() + _getWindowHeight() === _getScrollHeight()) {
        callback()
    }
}

export function tplReplace(template, templateObject) {
    return template().replace(/\{\{(.*?)\}\}/g, (node, key) => {
        return templateObject[key.trim()]
    })
}

export function getUrlQueryValue(key) {
    const reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)', 'i')
    const res = window.location.search.substr(1).match(reg)

    return res !== null ? decodeURIComponent(res[2]) : null
}

export function getItemNode(target) {
    while (target = target.parentNode) {
        if (target.className.split(' ')[0] === 'news-item') {
            return target
        }
    }
}

function _getScrollTop() {
    let scrollTop = 0
    let bodyScrollTop = 0
    let documentScrollTop = 0

    if (document.body) {
        bodyScrollTop = document.body.scrollTop
    }

    if (document.documentElement) {
        documentScrollTop = document.documentElement.scrollTop
    }

    return scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop
}

function _getScrollHeight() {
    let scrollHeight = 0
    let bodyScrollHeight = 0
    let documentScrollHeight = 0

    if (document.body) {
        bodyScrollHeight = document.body.scrollHeight
    }
    if (document.documentElement) {
        documentScrollHeight = document.documentElement.scrollHeight
    }
    return (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight
}

function _getWindowHeight() {
    let windowHeight = 0
    if (document.compatMode == 'CSS1Compat') {
        windowHeight = document.documentElement.clientHeight
    } else {
        windowHeight = document.body.clientHeight
    }
    return windowHeight
}