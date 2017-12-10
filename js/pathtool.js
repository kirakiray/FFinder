(($, glo) => {
    let pathEle = $('#path');

    // 真实路径
    let pathVal = "";

    // 主体工具
    let pathtool = glo.pathtool = Object.assign($({}), {
        // 设置路径
        setPath: (path) => {
            pathtool.toViewMode();

            // 去掉最后的 /
            pathVal = path.replace(/\/$/, "");

            pathtool.toViewMode();
        },
        // 转换到 viewMode
        toViewMode: () => {
            pathEle.addClass('view_mode');
            pathEle.removeAttr('contenteditable');

            // 生成路径元素
            let pathDirArr = pathVal.split('/');

            // 组元素
            let pathFragment = $(document.createDocumentFragment());

            pathDirArr.forEach((e, i) => {
                let ele = $(`
                <div class="finder_path_dir">
                    <div class="path_dir_name">${ e || "<span class='iconfont'>&#xe614;</span>"}</div>
                    <div class="path_dir_mark iconfont">&#xe608;</div>
                </div>
                `);

                if (pathDirArr.length == 2 && i == 1 && !e) {
                    return;
                }

                pathFragment.append(ele);
            });

            // 填充元素
            pathEle.empty().append(pathFragment);
        },
        // 转换到editMode
        toEditMode: () => {
            pathEle.empty().text(pathVal);
            pathEle.removeClass('view_mode');
            pathEle.attr('contenteditable', true);
        }
    });

    // 初始状态是 view_mode
    pathtool.toViewMode();

    // 输入回车
    pathEle.on('keypress', (e) => {
        if (e.keyCode == 13) {
            e.preventDefault();
            let path = pathEle.text();

            // 触发主动路径变更事件
            pathtool.trigger('driveChange', { path });
        }
    });

    // 点击目录按钮
    pathEle.on('click', '.path_dir_name', function() {
        let $this = $(this).parent();

        // 获取位置
        let len = $this.index() + 1;
        let back_arr = pathVal.split('/');
        let back_path = "";

        // 分解路径
        for (let i = 0; i < len; i++) {
            back_path += back_arr[i] + "/";
        }

        // 去掉最后的 /
        back_path = back_path.replace(/\/$/, "");

        if (back_path == pathVal) {
            return;
        }

        pathtool.trigger('driveChange', { path: back_path });
    });

    // 禁止冒泡选项
    pathEle.click(() => {
        if (!pathEle.hasClass('view_mode')) {
            return;
        }
        pathtool.toEditMode();
        pathEle.focus();
    });
    pathEle.on('click', '.finder_path_dir', (e) => {
        e.stopPropagation();
    });
    pathEle.on('focusout', () => {
        pathtool.toViewMode();
    });

    // 点击 跳转上一级目录
    $('#back_btn').click(() => {
        // 获取前一个地址
        let back_path = pathVal.match(/(.+)\/.+/);
        if (back_path) {
            back_path = back_path[1];
        } else {
            back_path = "/";
        }

        pathtool.trigger('driveChange', { path: back_path });
    });
})($, window);