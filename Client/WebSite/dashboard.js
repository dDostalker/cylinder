// 仪表盘交互逻辑
class Dashboard {
    constructor() {
        this.currentPage = 'index';
        this.init();
    }

    init() {
        this.bindNavEvents();
        this.loadInitialPage();
    }

    // 绑定导航事件
    bindNavEvents() {
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const page = e.currentTarget.getAttribute('data-page');
                this.switchPage(page);
            });
        });
    }

    // 切换页面
    switchPage(pageName) {
        // 如果点击的是当前页面，不执行切换
        if (pageName === this.currentPage) {
            return;
        }

        // 更新导航状态
        this.updateNavState(pageName);

        // 执行页面切换动画
        this.animatePageTransition(pageName);
    }

    // 更新导航按钮状态
    updateNavState(pageName) {
        // 移除所有活动状态
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // 添加当前活动状态
        const activeNav = document.querySelector(`[data-page="${pageName}"]`);
        if (activeNav) {
            activeNav.classList.add('active');
        }

        this.currentPage = pageName;
    }

    // 页面切换动画
    animatePageTransition(pageName) {
        const currentPageElement = document.querySelector('.page-content.active');
        const targetPageElement = document.getElementById(`page-${pageName}`);

        if (!targetPageElement) {
            console.warn(`页面 ${pageName} 不存在`);
            return;
        }

        // 如果当前页面存在，执行淡出动画
        if (currentPageElement) {
            currentPageElement.style.opacity = '0';
            currentPageElement.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                currentPageElement.classList.remove('active');
                currentPageElement.style.opacity = '';
                currentPageElement.style.transform = '';
                
                // 显示新页面
                this.showPage(targetPageElement);
            }, 200);
        } else {
            // 直接显示新页面
            this.showPage(targetPageElement);
        }
    }

    // 显示页面
    showPage(pageElement) {
        pageElement.style.opacity = '0';
        pageElement.style.transform = 'translateX(20px)';
        pageElement.classList.add('active');
        
        // 触发重排以应用初始状态
        pageElement.offsetHeight;
        
        // 执行淡入动画
        requestAnimationFrame(() => {
            pageElement.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
            pageElement.style.opacity = '1';
            pageElement.style.transform = 'translateX(0)';
            
            // 动画结束后清除内联样式，让CSS控制
            setTimeout(() => {
                pageElement.style.transition = '';
                pageElement.style.opacity = '';
                pageElement.style.transform = '';
            }, 400);
        });
    }

    // 加载初始页面
    loadInitialPage() {
        // 默认显示首页
        const initialPage = document.getElementById('page-index');
        if (initialPage) {
            initialPage.classList.add('active');
            this.currentPage = 'index';
        }
    }

    // 工具方法：加载外部内容（如果需要从其他HTML文件加载）
    async loadPageContent(pageName) {
        try {
            // 这里可以根据需要加载外部HTML内容
            // 例如：从 Index/index.html, Tasks/task.html 等加载
            const pageMap = {
                'index': 'Index/index.html',
                'tasks': 'Tasks/task.html',
                'history': 'History/history.html',
                'global-config': 'GlobalConfig/global_config.html'
            };

            const pagePath = pageMap[pageName];
            if (pagePath) {
                // 如果需要动态加载，可以在这里实现
                // const response = await fetch(pagePath);
                // const html = await response.text();
                // return html;
            }
        } catch (error) {
            console.error(`加载页面 ${pageName} 失败:`, error);
        }
    }
}

// SVG 图标替换功能
class IconManager {
    constructor() {
        this.iconMap = new Map();
        this.init();
    }

    init() {
        // 监听所有 SVG 图标的点击事件，允许替换
        this.setupIconReplacement();
    }

    // 设置图标替换功能
    setupIconReplacement() {
        // 为所有包含 SVG 的元素添加 data-icon-src 属性支持
        document.querySelectorAll('.nav-icon, .stat-icon').forEach(iconContainer => {
            const svgElement = iconContainer.querySelector('svg');
            if (svgElement) {
                // 检查是否有 data-icon-src 属性
                const iconSrc = iconContainer.getAttribute('data-icon-src') || 
                               iconContainer.closest('.nav-item, .stat-card')?.getAttribute('data-icon-src');
                
                if (iconSrc) {
                    this.loadIcon(iconContainer, iconSrc);
                }
            }
        });
    }

    // 加载外部 SVG 图标
    async loadIcon(container, iconSrc) {
        try {
            const response = await fetch(iconSrc);
            if (!response.ok) throw new Error('Failed to load icon');
            
            const svgText = await response.text();
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
            const newSvg = svgDoc.querySelector('svg');
            
            if (newSvg && container) {
                const oldSvg = container.querySelector('svg');
                if (oldSvg) {
                    // 保持原有的尺寸和样式
                    newSvg.setAttribute('width', oldSvg.getAttribute('width') || '20');
                    newSvg.setAttribute('height', oldSvg.getAttribute('height') || '20');
                    newSvg.setAttribute('viewBox', oldSvg.getAttribute('viewBox') || '0 0 24 24');
                    newSvg.setAttribute('fill', oldSvg.getAttribute('fill') || 'none');
                    newSvg.setAttribute('stroke', oldSvg.getAttribute('stroke') || 'currentColor');
                    newSvg.setAttribute('stroke-width', oldSvg.getAttribute('stroke-width') || '2');
                    
                    oldSvg.replaceWith(newSvg);
                }
            }
        } catch (error) {
            console.warn(`无法加载图标 ${iconSrc}:`, error);
        }
    }

    // 替换图标的方法（供外部调用）
    replaceIcon(selector, iconSrc) {
        const container = document.querySelector(selector);
        if (container) {
            this.loadIcon(container, iconSrc);
        }
    }
}

// 初始化仪表盘
document.addEventListener('DOMContentLoaded', () => {
    // 创建仪表盘实例
    window.dashboard = new Dashboard();
    
    // 创建图标管理器实例
    window.iconManager = new IconManager();
    
    // 添加键盘快捷键支持
    document.addEventListener('keydown', (e) => {
        // Alt + 数字键快速切换页面
        if (e.altKey) {
            const keyMap = {
                '1': 'index',
                '2': 'tasks',
                '3': 'history',
                '4': 'global-config'
            };
            
            const page = keyMap[e.key];
            if (page && window.dashboard) {
                window.dashboard.switchPage(page);
                e.preventDefault();
            }
        }
    });
    
    console.log('Cylinder 仪表盘已初始化');
});

// 导出供外部使用的 API
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Dashboard, IconManager };
}

