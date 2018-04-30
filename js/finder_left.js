finderLeft = {
    add(text) {
        let ele = $(`<div class="finder_left_line" title="${text}">${text}</div>`);
        $('.finder_left').prepend(ele);
    },
    // 进入成功
    loadSucceed(path) {
        let ele = $(`<div class="finder_left_line" title="${path}"><span style="color:green;">进入成功:</span>${path}</div>`);
        $('.finder_left').prepend(ele);
    },
    // 进入失败
    loadError(path, tips) {
        let ele = $(`<div class="finder_left_line" title="${tips}"><span style="color:red;">失败:</span>${path} ${tips}</div>`);
        $('.finder_left').prepend(ele);
    }
};