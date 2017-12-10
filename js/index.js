(async() => {
    let root = 'http://localhost:8804/getdir/';
    // function
    // 获取目录的数据
    async function getDir(path) {
        // 选项参数
        let options = {
            method: "POST",
            // 主体数据
            body: JSON.stringify({
                type: "getdir",
                path: path
            })
        };

        // 获取数据
        let d = await fetch(root, options);
        // let d = await fetch('http://10.211.55.4:8804/getdir/', options);

        // 转换数据
        d = await d.json();

        return d;
    }

    // base
    let container = $('#container');
    let pathEle = $('#path');
    let iconPaths = {
        "js": "img/icon/js.png",
        "css": "img/icon/css.png",
        "html": "img/icon/html.png",
        "htm": "img/icon/html.png",
        "jpg": "img/icon/jpg.png",
        "less": "img/icon/less.png",
        "png": "img/icon/png.png",
        "svg": "img/icon/svg.png",
        "zip": "img/icon/zip.png",
        "md": "img/icon/a_readme.png",
        "php": "img/icon/php.png",
        "gif": "img/icon/gif.png",
        "app": "img/icon/app.png",
        "txt": "img/icon/txt.png",
        "mp3": "img/icon/mp3.png",
        "mp4": "img/icon/mp4.png",
        "tar": "img/icon/tar.png",
        "rar": "img/icon/rar.png",
        "json": "img/icon/json.png",
        "bat": "img/icon/bat.png",
    };

    // 当前目录
    let now_dir = '';

    // 跳转目录的方法
    async function jumpDir(dirpath) {
        // 获取目录
        let d = await getDir(dirpath);

        if (d.stat == 1) {
            // fragment
            let fragEle = $(document.createDocumentFragment());
            d.data.forEach(e => {
                let filename = e.p.split('/').slice(-1)[0];
                let ele = $(`
                <div class="block" data-path="${e.p}" title="${filename}">
                    <div class="icon"></div>
                    <div class="title">${filename}</div>
                </div>
                `);

                if (e.isdir) {
                    ele.addClass('dir_block');
                } else {
                    ele.addClass('file_block');
                }

                // 是否隐藏文件
                if (/^\..+/.test(filename)) {
                    ele.addClass('hide_mode');
                }

                // 判断是否有专属icon
                let houzhui = filename.match(/.+\.(.+)/)
                if (houzhui) {
                    houzhui = houzhui[1];
                    houzhui = houzhui.toLowerCase();
                    if (iconPaths[houzhui]) {
                        ele.find('.icon').css('background-image', `url(${iconPaths[houzhui]})`);
                    }
                }

                // 是否可继续访问
                if (!e.permit) {
                    ele.addClass('no_permission');
                }

                fragEle.append(ele);
            });

            now_dir = dirpath;

            // 设置路径
            pathtool.setPath(now_dir);

            // 记录历史
            localStorage['_jump_dir_path'] = now_dir;

            // 填充选项
            container.empty().append(fragEle);
        } else {
            console.log(d);
        }
    }

    // 初始跳转
    jumpDir(localStorage['_jump_dir_path'] || '/');

    // 双击辅助断定
    let dbc = 0;

    // 选中文件或文件夹
    $('.finder_container').on('mousedown', ".block", function(e) {
        let $this = $(this);
        if (dbc) {
            // 双击则进行跳转链接操作（如果是目录的话）
            if ($this.hasClass('dir_block') && !$this.hasClass('no_permission')) {
                let path = $this.data('path');
                jumpDir(path);
                console.log(path);
            }

        } else {
            $('.select_mode').removeClass('select_mode');
            $this.addClass('select_mode');
            dbc = 1;
            setTimeout(() => {
                dbc = 0;
            }, 300);
        }
        e.stopPropagation();
    });


    // pathtool 主动触发事件绑定
    pathtool.on('driveChange', (e, data) => {
        jumpDir(data.path);
    });

    // 失焦
    $('body').on('mousedown', () => {
        $('.select_mode').removeClass('select_mode');
    })

})();