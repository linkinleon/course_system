/**
 * Created by Administrator on 14-4-26.
 */
$(document).ready(function(){
    $("#courseManagementNav").show();
    $("#studentManagementNav").show();
    $("#headerLoginBtn").hide();
    $("#headerRegistBtn").text("注销");
    $("#headerRegistBtn").attr('id','exitLoginBtn');
    $("#exitLoginBtn").attr('data-target','#exitLoginModal');
    $("#addCourseBtnOK").on("click",function(){
        event.preventDefault();
        if($('#courseTitle').val()===''||$('#teacher').val()===''||$('#courseTime').val()===''||
            $('#totalCount').val()===''||$('#courseContent').val()===''){
            $('#courseForm').prepend($('<div id="courseManagementAlert" class="alert alert-warning alert-dismissable">' +
                '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'+
                '<strong>警告! </strong> 填写信息不完整！</div>').fadeIn(1000));
            $('#courseManagementAlert').fadeOut(2000);
        }else{
            var addCourse = {
                'courseTitle':$('#courseTitle').val(),
                'teacher':$('#teacher').val(),
                'courseTime':$('#courseTime').val(),
                'totalCount':$('#totalCount').val(),
                'courseContent':$('#courseContent').val()
            };
            $.ajax({
                url: "/courseManagement/createOneCourse",
                type: "POST",
                dataType: "json",
                data: addCourse
            }).done(function(data){
                if(data.success){
                    $('#addCourseModal').modal('hide');
                    $('#courseBody').append(
                        '<tr id="'+data.rowId+'"><td style="width: 10%">'+$('#courseTitle').val()+'</td><td style="width: 50%">'+$('#courseContent').val()+'</td><td style="width: 10%">'+$('#teacher').val()+
                        '</td><td style="width: 10%">'+$('#totalCount').val()+'</td><td style="width: 10%">'+$('#courseTime').val()+'</td><td style="width: 10%">'+
                        '<button type="button" class="btn btn-default btn-xs" >'+
                        '<span class="glyphicon glyphicon-edit" style="font-size: 20px"></span></button>'+
                        ' <button type="button" class="btn btn-default btn-xs">'+
                        '<span class="glyphicon glyphicon-remove-circle" style="font-size: 20px"></span>'+
                        '</button></td></tr>'
                    );
                    $('#courseContainer').prepend($('<div id="addCourseAlert" class="alert alert-success alert-dismissable">'+
                        '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'+
                        '<strong> 添加课程成功！</strong></div>').fadeIn(1000));
                    $('#addCourseAlert').fadeOut(2000);
                    $('#courseForm')[0].reset();
                }
            });
        }
    });

    var rowSelector;
    $(document).on('click','.glyphicon.glyphicon-remove-circle',function(){
        rowSelector = $(this).parent().parent().parent();//获取要删除的行
        $('#deleteCourseModal').modal('show');
    });

    $(document).on('click','.glyphicon.glyphicon-edit',function(){
        rowSelector = $(this).parent().parent().parent();//获取要修改的行
        var courseName = rowSelector.find('td').eq(0).text().trim();
        var courseContent = rowSelector.find('td').eq(1).text().trim();
        var teacherName = rowSelector.find('td').eq(2).text().trim();
        var totalCount = rowSelector.find('td').eq(3).text().trim();
        var courseTime = rowSelector.find('td').eq(4).text().trim();
        $('#modifyCourseModal').modal('show');
        $('#courseTitleModify').attr('value',courseName);
        $('#teacherModify').attr('value',teacherName);
        $('#courseTimeModify').attr('value',courseTime);
        $('#totalCountModify').attr('value',totalCount);
        $('#courseContentModify').text(courseContent);
    });

    $('#deleteCourseOK').on('click',function(){
        event.preventDefault();
        $.ajax({
            url: "/courseManagement/delCourse?id="+rowSelector.attr('id'),
            type: "DELETE",
            dataType: "json"
        }).done(function(result){
            $('#deleteCourseModal').modal('hide');
            if(result.delCourseSuccess){
                rowSelector.remove();
                $('#courseContainer').prepend($('<div id="addCourseAlert" class="alert alert-success alert-dismissable">'+
                    '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'+
                    '<strong> 删除课程成功！</strong></div>').fadeIn(1000));
                $('#addCourseAlert').fadeOut(2000);
            }
        });
    });

    $('#modifyCourseBtnOK').on('click',function(){
        event.preventDefault();
        var updateCourseData = {
            'courseTitle':$('#courseTitleModify').val(),
            'teacher':$('#teacherModify').val(),
            'courseTime':$('#courseTimeModify').val(),
            'totalCount':$('#totalCountModify').val(),
            'courseContent':$('#courseContentModify').val()
        };
        $.ajax({
            url: "/courseManagement/updateCourse?id="+rowSelector.attr('id'),
            type: "PUT",
            dataType: "json",
            data: updateCourseData
        }).done(function(result){
            if(result.success){
                $('#modifyCourseModal').modal('hide');
                rowSelector.find('td').eq(0).text(updateCourseData.courseTitle);
                rowSelector.find('td').eq(1).text(updateCourseData.courseContent);
                rowSelector.find('td').eq(2).text(updateCourseData.teacher);
                rowSelector.find('td').eq(3).text(updateCourseData.totalCount);
                rowSelector.find('td').eq(4).text(updateCourseData.courseTime);
                $('#courseContainer').prepend($('<div id="addCourseAlert" class="alert alert-success alert-dismissable">'+
                    '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'+
                    '<strong> 修改课程成功！</strong></div>').fadeIn(1000));
                $('#addCourseAlert').fadeOut(2000);
                $('#courseFormModify')[0].reset();
            }
        });
    });
});