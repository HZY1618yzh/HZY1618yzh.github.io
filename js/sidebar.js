function initSidebar() {
    document.getElementById("nav").innerHTML = '<nav class="sidebar">\
                <ul class="sidebar-nav">\
                    <li class="nav-item" onclick="window.location=\'/\'">\
                        <i class="nav-icon fas fa-home"></i>\
                        <span class="nav-text">首页</span>\
                    </li>\
                    <li class="nav-item" onclick="window.location=\'/game\'">\
                        <i class="nav-icon fas fa-gamepad"></i>\
                        <span class="nav-text">游戏</span>\
                    </li>\
                    <li class="nav-item" onclick="window.location=\'/tools\'">\
                        <i class="nav-icon fas fa-wrench"></i>\
                        <span class="nav-text">实用工具</span>\
                    </li>\
                    <li class="nav-item" onclick="window.location=\'/article\'">\
                        <i class="nav-icon fas fa-newspaper"></i>\
                        <span class="nav-text">文章</span>\
                    </li>\
                    <li class="nav-item" onclick="window.location=\'/draw\'">\
                        <i class="nav-icon fas fa-paintbrush"></i>\
                        <span class="nav-text">冬日绘版</span>\
                    </li>\
                    <li class="nav-divider"></li>\
                    <li class="nav-item" onclick="window.location=\'https://github.com/HZY1618yzh/home\'">\
                        <i class="nav-icon fab fa-github"></i>\
                        <span class="nav-text">GitHub</span>\
                    </li>\
                    <li class="nav-item" onclick="window.location=\'https://ifdian.net/a/hzy1618yzh/plan\'">\
                        <i class="nav-icon fas fa-hand-holding-usd"></i>\
                        <span class="nav-text">爱发电</span>\
                    </li>\
                </ul>\
            </nav>';
}
document.addEventListener('DOMContentLoaded', function () {
    initSidebar();
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.setAttribute('tabindex', '0');
        item.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                this.click();
            }
        });
    });
});
