function initSidebar() {
    document.getElementById("nav").innerHTML = '<nav class="sidebar">\
                <ul class="sidebar-nav">\
                    <li class="nav-item">\
                        <a href="/" class="nav-link">\
                            <i class="nav-icon fas fa-home"></i>\
                            <span class="nav-text">首页</span>\
                        </a>\
                    </li>\
                    <li class="nav-item">\
                        <a href="/game" class="nav-link">\
                            <i class="nav-icon fas fa-gamepad"></i>\
                            <span class="nav-text">游戏</span>\
                        </a>\
                    </li>\
                    <li class="nav-item">\
                        <a href="/tools" class="nav-link">\
                            <i class="nav-icon fas fa-wrench"></i>\
                            <span class="nav-text">实用工具</span>\
                        </a>\
                    </li>\
                    <li class="nav-item">\
                        <a href="/article" class="nav-link">\
                            <i class="nav-icon fas fa-newspaper"></i>\
                            <span class="nav-text">文章</span>\
                        </a>\
                    </li>\
                    <li class="nav-divider"></li>\
                    <li class="nav-item">\
                        <a href="https://github.com/HZY1618yzh/home" class="nav-link" target="_blank">\
                            <i class="nav-icon fab fa-github"></i>\
                            <span class="nav-text">GitHub</span>\
                        </a>\
                    </li>\
                </ul>\
            </nav>';
}
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () {
        initSidebar();
    }, 100);
});
