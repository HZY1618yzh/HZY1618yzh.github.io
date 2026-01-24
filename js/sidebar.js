function initSidebar() {
    document.getElementById("nav").innerHTML = '<nav class="sidebar">\
                    <a class="nav-item" href=\'/\'>\
                        <i class="nav-icon fas fa-home"></i>\
                        <span class="nav-text">首页</span>\
                    </a>\
                    <a class="nav-item" href=\'/game\'>\
                        <i class="nav-icon fas fa-gamepad"></i>\
                        <span class="nav-text">游戏</span>\
                    </a>\
                    <a class="nav-item" href=\'/tools\'>\
                        <i class="nav-icon fas fa-wrench"></i>\
                        <span class="nav-text">实用工具</span>\
                    </a>\
                    <a class="nav-item" href=\'/article\'>\
                        <i class="nav-icon fas fa-newspaper"></i>\
                        <span class="nav-text">文章</span>\
                    </a>\
                    <a class="nav-item" href=\'/articles\'>\
                        <i class="nav-icon fas fa-blog"></i>\
                        <span class="nav-text">静态文章</span>\
                    </a>\
                    <a class="nav-item" href=\'/draw\'>\
                        <i class="nav-icon fas fa-paintbrush"></i>\
                        <span class="nav-text">冬日绘版</span>\
                    </a>\
                    <nav class="nav-divider"></nav>\
                    <a class="nav-item" href=\'https://github.com/HZY1618yzh/home\'>\
                        <i class="nav-icon fab fa-github"></i>\
                        <span class="nav-text">GitHub</span>\
                    </a>\
                    <a class="nav-item" href=\'https://ifdian.net/a/hzy1618yzh/plan\'>\
                        <i class="nav-icon fas fa-hand-holding-usd"></i>\
                        <span class="nav-text">爱发电</span>\
                    </a>\
                    <nav class="nav-divider"></nav>\
                    <div class="nav-mtitle">链接</div>\
                    <a class="nav-mtext" href=\'https://oj.hzy.us.kg\'>HZYOJ</a>\
                    <a class="nav-mtext" href=\'https://oi-wiki.hzy.us.kg\'>OI-wiki</a>\
                    <a class="nav-mtext" href=\'https://download.hzy.us.kg\'>下载</a>\
                    <a class="nav-mtext" href=\'https://www.luogu.com.cn/user/1394471\' target="_blank">洛谷主页</a>\
                    <a class="nav-mtext" href=\'https://github.com/HZY1618yzh\' target="_blank">github主页</a>\
                    <a class="nav-mtext" href=\'https://www.luogu.com.cn/team/99897\' target="_blank">小狗出题组</a>\
                    <a class="nav-mtext" href=\'https://blog.csdn.net/D56795?spm=1000.2115.3001.5343\' target="_blank">我的csdn</a>\
                    <a class="nav-mtext" href=\'mailto: i@hzy.us.kg\'>邮箱</a>\
            </nav>';
}
document.addEventListener('DOMContentLoaded', function () {
    initSidebar();
    const sidebar = document.querySelector('.sidebar');
    sidebar.addEventListener('mouseleave', function() {
        setTimeout(() => {
            this.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }, 300);
    });
    sidebar.addEventListener('mouseleave', function() {
        this.scrollTop = 0;
    });
    
    sidebar.style.overflowY = 'overlay';
});
