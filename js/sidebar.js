function initSidebar() {
    document.getElementById("nav").innerHTML = '<nav class="sidebar">\
                <ul class="sidebar-nav">\
                    <li class="nav-item">\
                        <a href="https://hzy.us.kg/" class="nav-link" title="首页">\
                            <i class="nav-icon fas fa-home"></i>\
                            <span class="nav-text">首页</span>\
                        </a>\
                    </li>\
                    <li class="nav-item">\
                        <a href="https://hzy.us.kg/game" class="nav-link" title="游戏">\
                            <i class="nav-icon fas fa-gamepad"></i>\
                            <span class="nav-text">游戏</span>\
                        </a>\
                    </li>\
                    <li class="nav-item">\
                        <a href="https://hzy.us.kg/tools" class="nav-link" title="实用工具">\
                            <i class="nav-icon fas fa-wrench"></i>\
                            <span class="nav-text">实用工具</span>\
                        </a>\
                    </li>\
                    <li class="nav-item">\
                        <a href="#" class="nav-link" title="文章" onclick="event.preventDefault(); router.navigate(\'/article\')">\
                            <i class="nav-icon fas fa-newspaper"></i>\
                            <span class="nav-text">文章</span>\
                        </a>\
                    </li>\
                    <li class="nav-divider"></li>\
                    <li class="nav-item">\
                        <a href="https://github.com/HZY1618yzh/home" class="nav-link" title="GitHub" target="_blank" rel="noopener">\
                            <i class="nav-icon fab fa-github"></i>\
                            <span class="nav-text">GitHub</span>\
                        </a>\
                    </li>\
                </ul>\
            </nav>';
}
