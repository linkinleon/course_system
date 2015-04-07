/**
 * Created by Administrator on 14-5-13.
 */
$(document).ready(function(){
    $("#allCourseNav").show();
    $("#myContentNav").show();
    $("#headerLoginBtn").hide();
    $("#headerRegistBtn").text("注销");
    $("#headerRegistBtn").attr('id','exitLoginBtn');
    $("#exitLoginBtn").attr('data-target','#exitLoginModal');
    $("[name='my-checkbox']").bootstrapSwitch();
    $('input[name="my-checkbox"]').on('switchChange.bootstrapSwitch', function(event, state) {
        var courseSelector = $(this).parent().parent().parent().parent().parent();//获取要注册课程的选择器
        var courseId = courseSelector.attr('id');//获取要注册课程的id
        if(state == true){
            $("#registCourseModal").modal('show');
            $('#registCourseBtnOK').unbind('click');
            $("#registCourseBtnOK").on('click',function(){
                $("#registCourseModal").modal('hide');
                $.ajax({
                    url: "/courseRegist/regist?courseId="+courseId,
                    type: "PUT",
                    dataType: "json"
                }).done(function(result){
                    if(result.success){
                        var count = courseSelector.find("div.pull-right span").text();
                        count = count-1;
                        courseSelector.find("div.pull-right span").text(count);
                    }
                    if(result.error){
                        $('#headerContainer').append($('<div id="courseRegistAlert" class="alert alert-warning alert-dismissable">' +
                            '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'+
                            '<strong>警告! </strong> 课程注册人数已满！</div>').fadeIn(1000));
                        $('#courseRegistAlert').fadeOut(2000);
                        window.location='/courseRegist';
                    }
                });
            });
            $("#registCourseBtnCancel").unbind('click');
            $("#registCourseBtnCancel").on('click',function(){
                event.preventDefault();
                window.location='/courseRegist';
            });
        }
        if(state == false){
            $("#cancelCourseModal").modal('show');
            $("#cancelCourseBtnOK").unbind('click');
            $("#cancelCourseBtnOK").on('click',function(){
                $("#cancelCourseModal").modal('hide');
                $.ajax({
                    url: "/courseRegist/cancel?courseId="+courseId,
                    type: "PUT",
                    dataType: "json"
                }).done(function(result){
                    if(result.success){
                        var count = courseSelector.find("div.pull-right span").text();
                        count = parseInt(count)+1;
                        courseSelector.find("div.pull-right span").text(count);
                    }
                });
            });
            $("#cancelCourseBtnCancel").unbind('click');
            $("#cancelCourseBtnCancel").on('click',function(){
                event.preventDefault();
                window.location='/courseRegist';
            });
        }
    });
});