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


//使用 WebUploader   上传 文件    以下 都是 webuploader 自己的事件  可以直接用的    除了在 初始化中  需要  配置的 

//　这个是初始化　　配置的　  文件的 
var uploader = WebUploader.create({

    // (如果是新浏览器 可以不用 flash)
    //swf: '/Scripts/webuploader-0.1.5/Uploader.swf',

    // 文件接收服务端。   相当于 ajax 的 url 
    server: '/File/BlockUpload',

    //    如果上传大文件   打开下面这个   调用 BlockUpload 方法  开起分片上传。
    chunked: true,
    //分片大小
    chunkSize: 1000000,
    //上传并发数      指的是  每次上传1片   
    threads: 1,

    // 选择文件的按钮。可选。
    // 内部根据当前运行是创建，可能是input元素，也可能是flash.   选择 按钮的样式 
    pick: '#picker'

    // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
    //resize: false
});


//  初始化 Web Uploader   配置   图片的    这个不可以  配置多个  
//var uploader = WebUploader.create({

//    // 选完文件后，是否自动上传。  如果要改成 手动的  这个可以去掉   默认是false  
//    auto: true,

//    // swf文件路径
//    server: '/File/FileOnDrop',


//    // 选择文件的按钮。可选。
//    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
//    pick: '#filePicker',

//    // 只允许选择图片文件。   
//    accept: {
//        title: 'Images',
//        extensions: 'gif,jpg,jpeg,bmp,png',
//        mimeTypes: 'image/*'
//    }
//});


$("#ctlBtn").click(function () {
    uploader.upload();
});


// 显示 用户所选择    吧用户选择文件 显示出来     监听fileQueued事件
uploader.on('fileQueued', function (file) {
    $("#thelist").append('<div id="' + file.id + '" class="item">' +
        '<h4 class="info">' + file.name + '</h4>' +
        '<p class="state">等待上传...</p>' +
    '</div>');
});


//文件上传的 进度条  对外 派送 uploadProgress  事件
uploader.on('uploadProgress', function (file, percentage) {
    var $li = $('#' + file.id),
        $percent = $li.find('.progress .progress-bar');

    // 避免重复创建
    if (!$percent.length) {
        $percent = $('<div class="progress progress-striped active">' +
          '<div class="progress-bar" role="progressbar" style="width: 0%">' +
          '</div>' +
        '</div>').appendTo($li).find('.progress-bar');
    }

    $li.find('p.state').text('上传中');

    $percent.css('width', percentage * 100 + '%');
});

// 文件成功传送   uploadSuccess事件
uploader.on('uploadSuccess', function (file) {
    $('#' + file.id).find('p.state').text('已上传');   //  会把 给用户显示 状态字样 改变    线面都一样

});

//文件失败 传送 uploadError事件
uploader.on('uploadError', function (file) {
    $('#' + file.id).find('p.state').text('上传出错');
});

//   不管  成功还是 失败 都会  触发一个 uploadComplete事件。  暂时 不知道  这个是 干啥的 
uploader.on('uploadComplete', function (file) {
    $('#' + file.id).find('.progress').fadeOut();
});
