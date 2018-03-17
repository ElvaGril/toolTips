'use static'

 class Tooltip {
	 constructor(el) {
        this.element = el
        this.tipText = el.dataset.tooltip
//    HTMLElement.dataset   HTML或 DOM中的元素上设置的所有自定义数据属性(data-*)集。
        this.elementStyle = {
            top: 0,
            left: 0
        }
        this.events()
    }
	 
	 createDom() {
        this.tooltipEl = document.createElement('div')
        this.tooltipEl.className = 'lx-tooltip'
        this.tooltipEl.innerText = this.tipText
        document.body.appendChild(this.tooltipEl)
    }
	 
 	 offset(el) {
		let _offset = {
		    top: 0,
		    left: 0,
		    right: 0,
		    bottom: 0
		}
		
		let _scroll = {
		    left: document.body.scrollLeft || document.documentElement.scrollLeft, // 水平滚动条
		    top: document.body.scrollTop || document.documentElement.scrollTop  // 垂直滚动条
		}
		
		while (el) {
		    _offset.left += el.offsetLeft
		    _offset.top += el.offsetTop
		    el = el.offsetParent  // 当前元素最近的经过定位(position不等于static)的父级元素(element)
		}

		_offset.top -= _scroll.top
		_offset.left -= _scroll.left
		_offset.right = document.body.clientWidth - _offset.left
		_offset.bottom = window.innerHeight - _offset.top
		return _offset
	}
	  
	  // 默认只支持以键值对的方式设置样式
    css(el, attr) {
        if(typeof attr === 'object') {
            // 传入的第二个参数是对象，则默认为设置样式
            for(let o in attr) {
                el.style[o] = attr[o]
            }
        }else {
            return window.getComputedStyle(el)[attr]
            
		/*getComputedStyle() 是一个可以获取当前元素所有最终使用的CSS属性值  只读
				var style = window.getComputedStyle("元素", "伪类"); 第二个如果不是伪类，设置为null
				var dom = document.getElementById("test"),
				style = window.getComputedStyle(dom , ":after"); */
        }
    }

    // 多个className以单个空格分割
    removeClass(el, className) {
        const _classList = className.split(' ')
        for(let name of _classList) {
            el.classList.remove(name)
        }
    }
    
    show() {
        const _el = this.tooltipEl
//      offset() 方法返回或设置匹配元素相对于文档的偏移（位置）
        const _offset = this.offset(this.element)
        let _className = '' // 提示框方向className
        let _style = {} // 提示框的样式
        console.log(_offset)
        this.css(_el, { display: 'block', top: 'auto', right: 'auto', bottom: 'auto', left: 'auto' })
        this.removeClass(_el, 'top right bottom left')
		
		// 如果el 的横坐标距离窗口最左边的距离 小于80, toolTips就显示在el 的右边
        if (_offset.left < 80) {
            _className = 'right'
            _style = {
                top: `${_offset.top + parseInt(this.css(this.element, 'height')) / 2}px`,
                left: `${_offset.left + 8}px`
            }
        } else if (_offset.right < 80) { // 如果el 的横坐标距离窗口的最右边 的距离  小于80, toolTips就显示在el 的左边
            _className = 'left'
            _style = {
                top: `${_offset.top + parseInt(this.css(this.element, 'height')) / 2}px`,
                right: `${_offset.right + 8}px`
            }
        } else if (_offset.top < 80) { // 如果el 的纵坐标距离窗口的顶部 的距离 小于80 , toolTips 就显示在el 的下边
            _className = 'bottom'
            _style = {
                top: `${_offset.top + 8 + parseInt(this.css(this.element, 'height'))}px`,
                left: `${_offset.left + 8}px`
            }
        }else { // 其余情况就显示在 el 上面
            _className = 'top'
            _style = {
                bottom: `${_offset.bottom + 8}px`,
                left: `${_offset.left + 8}px`
            }
        }
        _el.classList.add(_className)
        this.css(_el, _style)
    }

    hide() {
        this.css(this.tooltipEl, { display: 'none' })
    }

    events() {
        this.element.addEventListener('mouseover', event => {
            if(this.tooltipEl) {
                this.show()
            }else {  // 如果不存在就 先创建dom , 然后再显示
                this.createDom()
                this.show()
            }
        }, false)
        this.element.addEventListener('mouseout', event => {
            if (this.tooltipEl) {
                this.hide()
            }
        }, false)
    }

}

//  js  
const tooltipEles = document.querySelectorAll('[data-tooltip]')

for (const item of tooltipEles) {
    const tooltip = new Tooltip(item)
}
	
	