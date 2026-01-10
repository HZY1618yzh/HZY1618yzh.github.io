var SUPABASE_URL = 'https://idfnubsvhqdmsiycjgof.supabase.co';
var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkZm51YnN2aHFkbXNpeWNqZ29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5NjE0NjUsImV4cCI6MjA4MzUzNzQ2NX0.a6X9e_rnOv33JMN7g7OIm5TlGIXQLWlO5hR0BjOuVYU';

var supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
var currentUser = null;
var currentEditKey = null;
var showAllAds = false;
var editModalActive = false;

function escapeHtml(text) {
    if (!text) return '';
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

async function checkAuth() {
    var savedToken = localStorage.getItem('supabase.auth.token');
    var savedUser = localStorage.getItem('supabase.auth.user');

    if (savedToken && savedUser) {
        currentUser = JSON.parse(savedUser);
    }

    var result = await supabase.auth.getSession();

    if (result.error) {
        console.error('获取会话失败:', result.error);
    } else if (result.data.session) {
        currentUser = result.data.session.user;
        localStorage.setItem('supabase.auth.token', JSON.stringify({
            access_token: result.data.session.access_token,
            refresh_token: result.data.session.refresh_token,
            expires_at: result.data.session.expires_at
        }));
        localStorage.setItem('supabase.auth.user', JSON.stringify(result.data.session.user));
    } else {
        currentUser = null;
    }

    return result.data.session;
}

function showLoginPopup() {
    var overlay = document.createElement('div');
    overlay.className = 'modal';
    overlay.innerHTML = `
                <div class="modal-container">
                    <h2 class="modal-title">管理员登录</h2>
                    <p style="color: #666; margin-bottom: 20px;">需要登录才能管理广告</p>
                    
                    <div class="form-group">
                        <label for="login-email" class="form-label">邮箱</label>
                        <input type="email" id="login-email" class="form-input" placeholder="请输入邮箱" value="3883244539@qq.com">
                    </div>
                    
                    <div class="form-group">
                        <label for="login-password" class="form-label">密码</label>
                        <input type="password" id="login-password" class="form-input" placeholder="请输入密码">
                    </div>
                    
                    <div style="display: flex; gap: 10px; margin-top: 20px;">
                        <button id="login-submit" class="btn btn-success" style="flex: 1;">登录</button>
                        <button id="login-cancel" class="btn btn-secondary" style="flex: 1;">取消</button>
                    </div>
                </div>
            `;

    document.body.appendChild(overlay);

    document.getElementById('login-submit').onclick = async function () {
        var email = document.getElementById('login-email').value;
        var password = document.getElementById('login-password').value;

        var result = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (result.error) {
            alert('登录失败: ' + result.error.message);
        } else {
            currentUser = result.data.user;
            localStorage.setItem('supabase.auth.token', JSON.stringify({
                access_token: result.data.session.access_token,
                refresh_token: result.data.session.refresh_token,
                expires_at: result.data.session.expires_at
            }));
            localStorage.setItem('supabase.auth.user', JSON.stringify(result.data.user));

            alert('登录成功！');
            overlay.remove();
            currentEditKey = null;
            showEditModal('', '', false);
        }
    };

    document.getElementById('login-cancel').onclick = function () {
        overlay.remove();
    };

    overlay.onclick = function (e) {
        if (e.target === overlay) {
            overlay.remove();
        }
    };
}

async function logout() {
    var result = await supabase.auth.signOut();
    if (result.error) {
        alert('登出失败: ' + result.error.message);
    } else {
        localStorage.removeItem('supabase.auth.token');
        localStorage.removeItem('supabase.auth.user');
        currentUser = null;
        alert('已登出');
        closeEditModal();
    }
}

function closeEditModal() {
    var overlay = document.querySelector('.modal');
    if (overlay) {
        overlay.remove();
    }
    currentEditKey = null;
    editModalActive = false;

    if (window.location.hash === '#edit') {
        history.replaceState(null, null, window.location.pathname + window.location.search);
    }
}

async function getAllAds() {
    try {
        var result = await supabase
            .from('ads')
            .select('*')
            .order('priority', { ascending: false });

        if (result.error) {
            console.error('获取广告失败:', result.error);
            return [];
        }

        return result.data || [];
    } catch (error) {
        console.error('获取广告失败:', error);
        return [];
    }
}

async function saveAdToDB(priority, content) {
    try {
        var result;

        if (currentEditKey) {
            result = await supabase
                .from('ads')
                .update({
                    priority: Number(priority),
                    content: content
                })
                .eq('priority', currentEditKey);
        } else {
            result = await supabase
                .from('ads')
                .upsert({
                    priority: Number(priority),
                    content: content
                }, {
                    onConflict: 'priority'
                });
        }

        if (result.error) {
            console.error('保存失败:', result.error);
            throw new Error(result.error.message);
        }

        return true;
    } catch (error) {
        console.error('保存失败:', error);
        throw error;
    }
}

async function deleteAdFromDB(priority) {
    try {
        var result = await supabase
            .from('ads')
            .delete()
            .eq('priority', Number(priority));

        if (result.error) {
            console.error('删除失败:', result.error);
            throw new Error(result.error.message);
        }

        return true;
    } catch (error) {
        console.error('删除失败:', error);
        throw error;
    }
}

async function loadAds() {
    var ads = await getAllAds();
    var container = document.getElementById('ads-container');
    var proContainer = document.getElementById('pro');

    container.innerHTML = '';

    if (ads.length === 0) {
        container.innerHTML = `
                    <div class="center" style="color: #666; padding: 2rem;">
                        <i class="fas fa-ad" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                        <p>暂无广告</p>
                    </div>
                `;
        proContainer.innerHTML = '';
        return;
    }

    var adsToShow = showAllAds ? ads : ads.slice(0, 3);
    adsToShow.forEach(function (ad) {
        var div = document.createElement('div');
        div.className = 'pro';

        var fragment = document.createDocumentFragment();
        var tempDiv = document.createElement('div');
        tempDiv.innerHTML = ad.content;

        while (tempDiv.firstChild) {
            fragment.appendChild(tempDiv.firstChild);
        }

        div.appendChild(fragment);
        container.appendChild(div);

        setTimeout(function () {
            var scripts = div.getElementsByTagName('script');
            for (var i = 0; i < scripts.length; i++) {
                try {
                    var newScript = document.createElement('script');
                    if (scripts[i].src) {
                        newScript.src = scripts[i].src;
                    } else {
                        newScript.textContent = scripts[i].textContent;
                    }
                    document.body.appendChild(newScript);
                } catch (e) {
                    console.error('执行脚本失败:', e);
                }
            }
        }, 0);
    });

    if (!showAllAds && ads.length > 3) {
        proContainer.innerHTML = '<button onclick="loadMoreAds()">查看更多</button>';
    } else {
        proContainer.innerHTML = '<div class="center"><p>没有更多了</p></div>';
    }
}

function loadMoreAds() {
    showAllAds = true;
    loadAds();
}

async function loadAdsList() {
    var ads = await getAllAds();
    var list = document.getElementById('ads-list');

    if (ads.length === 0) {
        list.innerHTML = '<div style="color: #666; text-align: center;">暂无广告</div>';
        return;
    }

    list.innerHTML = '';
    ads.forEach(function (ad) {
        var div = document.createElement('div');
        div.className = 'ad-item';
        div.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <strong>优先级: ${ad.priority}</strong>
                        <button onclick="editAd(${ad.priority})" style="background: #4CAF50; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
                            编辑
                        </button>
                    </div>
                    <div style="margin: 5px 0; background: white; padding: 5px; border-radius: 3px; font-size: 12px; max-height: 100px; overflow-y: auto;">
                        ${escapeHtml(ad.content.substring(0, 200))}${ad.content.length > 200 ? '...' : ''}
                    </div>
                `;
        list.appendChild(div);
    });
}

async function editAd(priority) {
    if (!currentUser) {
        showLoginPopup();
        return;
    }

    var ads = await getAllAds();
    var ad = ads.find(function (a) { return a.priority == priority; });

    if (ad) {
        currentEditKey = priority;
        showEditModal(priority, ad.content, true);
    }
}

async function saveAd() {
    if (!currentUser) {
        alert('请先登录！');
        showLoginPopup();
        return;
    }

    var priority = document.getElementById('ad-priority').value;
    var content = document.getElementById('ad-content').value;

    try {
        await saveAdToDB(priority, content);
        await loadAds();
        await loadAdsList();
        alert('保存成功！');

        if (window.location.hash === '#edit') {
            history.replaceState(null, null, window.location.pathname + window.location.search);
        }

        if (currentEditKey) {
            closeEditModal();
        } else {
            document.getElementById('ad-priority').value = '';
            document.getElementById('ad-content').value = '';
        }
    } catch (error) {
        alert('保存失败: ' + error.message);
    }
}

async function deleteAd() {
    if (!currentUser) {
        alert('请先登录！');
        return;
    }

    if (!currentEditKey) {
        return;
    }

    try {
        await deleteAdFromDB(currentEditKey);
        await loadAds();
        await loadAdsList();
        alert('删除成功！');

        closeEditModal();
    } catch (error) {
        alert('删除失败: ' + error.message);
    }
}

function showEditModal(priority, content, isEditing) {
    var existingModal = document.querySelector('.modal');
    if (existingModal) {
        existingModal.remove();
    }

    editModalActive = true;

    var overlay = document.createElement('div');
    overlay.className = 'modal';

    var showDeleteButton = isEditing === true;

    overlay.innerHTML = `
                <div class="modal-container">
                    <h2 class="modal-title">广告管理</h2>
                    
                    <div style="background: #f8f9fa; padding: 10px; border-radius: 6px; margin-bottom: 15px; text-align: center;">
                        <strong>当前用户:</strong> ${currentUser ? currentUser.email : '未登录'}
                        <button onclick="logout()" style="background: #f39c12; color: white; border: none; padding: 5px 10px; border-radius: 3px; font-size: 12px; margin-left: 10px; cursor: pointer;">
                            登出
                        </button>
                    </div>
                    
                    <div class="form-group">
                        <label for="ad-priority" class="form-label">优先级（数字越大越靠前）</label>
                        <input type="number" id="ad-priority" class="form-input" value="${priority || ''}" placeholder="请输入优先级数字">
                    </div>
                    
                    <div class="form-group">
                        <label for="ad-content" class="form-label">广告HTML代码</label>
                        <textarea id="ad-content" class="form-textarea" placeholder="请输入广告HTML代码">${escapeHtml(content || '')}</textarea>
                    </div>
                    
                    <div style="display: flex; gap: 10px; margin-top: 20px;">
                        <button onclick="saveAd()" class="btn btn-success" style="flex: 1;">保存广告</button>
                        <button onclick="closeEditModal()" class="btn btn-secondary" style="flex: 1;">取消</button>
                        ${showDeleteButton ? '<button onclick="deleteAd()" class="btn btn-danger" style="flex: 1;">删除</button>' : ''}
                    </div>
                    
                    <hr style="margin: 20px 0;">
                    
                    <h3 style="margin-bottom: 10px;">现有广告</h3>
                    <div id="ads-list">
                        正在加载...
                    </div>
                </div>
            `;

    document.body.appendChild(overlay);
    loadAdsList();

    overlay.onclick = function (e) {
        if (e.target === overlay) {
            closeEditModal();
        }
    };
}

document.addEventListener('DOMContentLoaded', async function () {
    await checkAuth();
    await loadAds();

    window.addEventListener('hashchange', function () {
        if (window.location.hash === '#edit') {
            if (!currentUser) {
                showLoginPopup();
            } else {
                currentEditKey = null;
                showEditModal('', '', false);
            }
        }
    });

    if (window.location.hash === '#edit') {
        if (!currentUser) {
            showLoginPopup();
        } else {
            currentEditKey = null;
            showEditModal('', '', false);
        }
    }
});
window.closeEditModal = closeEditModal;
window.logout = logout;
window.saveAd = saveAd;
window.deleteAd = deleteAd;
window.editAd = editAd;
window.loadMoreAds = loadMoreAds;