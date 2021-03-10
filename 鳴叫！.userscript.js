// ==UserScript==
// @name			鳴叫！
// @namespace		https://noctis.im
// @version	  		0.1
// @description		把你的 Twitter 頁面上的“发推”按鈕換成“鳴叫！”
// @author			Blair Noctis
// @match			https://twitter.com/*
// @match			https://mobile.twitter.com/*
// @grant			window.onurlchange
// ==/UserScript==

(function() {
	'use strict'

	var text = '鳴叫！'

	var $ = document.querySelector.bind(document)
	var sidebarTweetButtonSelector = 'a[data-testid="SideNav_NewTweet_Button"]'
	var sidebarTweetButtonSpanSelector = sidebarTweetButtonSelector + ' span'
	var inlineTweetButtonSpanSelector = 'div[data-testid="tweetButtonInline"] span'
	var modalTweetButtonSpanSelector = 'div[data-testid="tweetButton"] span'

	var sidebarButtonListener

	var periodicInterval = 500
	var totalRunCount = 0

	var sidebarChanged = false
	var inlineChanged = false
	var modalChanged = false

	function reset() {
		sidebarChanged = inlineChanged = modalChanged = false
	}

	function 鳴叫() {
		console.log('[鳴叫！] replacement run #' + (++totalRunCount).toString())
		/* 行動版 Twitter 網頁只在發推頁面有一個“推文”按鈕 */
		if(window.location.hostname === 'mobile.twitter.com' && window.location.pathname !== '/compose/tweet') return
		var sidebarButton = $(sidebarTweetButtonSelector)
		var sidebarSpan = $(sidebarTweetButtonSpanSelector)
		var inlineSpan = $(inlineTweetButtonSpanSelector)
		var modalSpan = $(modalTweetButtonSpanSelector)
		if(sidebarButton !== null && sidebarSpan.textContent !== text) {
			sidebarSpan.textContent = text
			sidebarChanged = true
			if(!sidebarButtonListener) {
				sidebarButtonListener = sidebarButton.addEventListener('click', function() {
					console.log('[鳴叫！] 侧栏按鈕按下，開始替換過程')
					鳴叫()
				})
			}
		}
		if(inlineSpan !== null && inlineSpan.textContent !== text) {
			inlineSpan.textContent = text
			inlineChanged = true
		}
		if(modalSpan !== null && modalSpan.textContent !== text) {
			modalSpan.textContent = text
			modalChanged = true
		}

		if(window.location.pathname === '/compose/tweet') {
			if(modalChanged) return console.log('[鳴叫！] modal 框按鈕替換完成')
			else return setTimeout(鳴叫, periodicInterval)
		} else if(window.location.pathname === '/home') {
			if(inlineChanged) return console.log('[鳴叫!] inline 框按鈕替換完成')
			else return setTimeout(鳴叫, periodicInterval)
		}
		if(sidebarSpan && sidebarSpan.textContent === text) sidebarChanged = true
		if(sidebarChanged) { return }
		setTimeout(鳴叫, periodicInterval)
	}

	if(window.onurlchange || window.onurlchange === null) {
		window.addEventListener('urlchange', () => {
			console.log('[鳴叫！] URL 變化，開始替換過程')
			reset()
			鳴叫()
		})
	}

	鳴叫()
})()

