//   元素拖动 时触发  事件 ondrop
$(".divFile7")[0].ondrop = function (event) {
    event.preventDefault();//   不要执行与事件关联的默认动作  防止浏览器的默认处理数据
    var files = event.dataTransfer.files;//获取拖上来的文件
    $(".divFile7").html(files[0].name)
    var formData = new FormData(); //  初始化 对象
    //for (var i = 0; i < files.length; i++) {   //  如果上传多个    循环 取到的 file 文件    依次  上传
    //    files[i]
    //}
    formData.append("files", files[0]);//将文件塞入FormData

    $.ajax({
        url: "/File/FileOnDrop",
        type: "POST",
        data: formData,
        processData: false,  // 告诉jQuery不要去处理发送的数据
        contentType: false,   // 告诉jQuery不要去设置Content-Type请求头
        success: function (responseText) {
            alert(responseText);

        }
    });
};

//   粘贴文件时触发 事件 onpaste    
$(".divFile7")[0].onpaste = function (event) {
    event.preventDefault();//不要执行与事件关联的默认动作
    var clipboard = event.clipboardData.items[0];//剪贴板数据
    if (clipboard.kind == 'file' || clipboard.type.indexOf('image') > -1) {//判断是图片格式
        var imageFile = clipboard.getAsFile();//获取文件

        var formData = new FormData();
        formData.append('files', imageFile);
        formData.append('fileName', imageFile.name);//这里给文件命个名（或者直接在后台保存的时候命名）
        $.ajax({
            url: "/File/FileOnPaste",
            type: "POST",
            data: formData,
            processData: false,  // 告诉jQuery不要去处理发送的数据
            contentType: false,   // 告诉jQuery不要去设置Content-Type请求头
            success: function (responseText) {
                alert(responseText);
            }
        });
    }
};