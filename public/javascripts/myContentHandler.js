/**
 * Created by Administrator on 14-6-8.
 */
$(document).ready(function(){
    $("#allCourseNav").show();
    $("#myContentNav").show();
    $("#headerLoginBtn").hide();
    $("#headerRegistBtn").text("注销");
    $("#headerRegistBtn").attr('id','exitLoginBtn');
    $("#exitLoginBtn").attr('data-target','#exitLoginModal');
    $("#modifyPasswordBtn").on("click",function(){
        event.preventDefault();
        $("#modifyPassModal").modal('show');
    });
    $("#modifyPassOKBtn").on("click",function(){
        if($('#oldPassword').val()===''||$('#newPassword').val()===''){
            $('#modifyPassForm').prepend($('<div id="modifyFormAlert" class="alert alert-warning alert-dismissable">' +
                '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'+
                '<strong>警告!</strong> 任何字段不能为空！</div>').fadeIn(1000));
            $('#modifyFormAlert').fadeOut(2000);
        }else{
        var updateData = {
            'modifyUser' : $('#modifyPassUser').val(),
            'oldPass' : $('#oldPassword').val(),
            'newPass' : $('#newPassword').val()
        }
        $.ajax({
            url: "/user/modifyPassword",
            type: "PUT",
            dataType: "json",
            data: updateData
        }).done(function(data){
                if(data.modifyPassSuccess){
                    $("#modifyPassModal").modal('hide');
                    $('#headerContainer').append($('<div id="modifyPassAlert" class="alert alert-success alert-dismissable">'+
                        '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'+
                        '<strong> 修改密码成功！</strong></div>').fadeIn(1000));
                    $('#modifyPassAlert').fadeOut(2000);
                    $('#modifyPassForm')[0].reset();
                }
                if(data.modifyPassError){
                    $('#modifyPassForm').prepend($('<div id="verifyUserAlert" class="alert alert-warning alert-dismissable">'+
                        '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'+
                        '<strong>验证用户名和旧密码失败！</strong></div>').fadeIn(1000));
                    $('#verifyUserAlert').fadeOut(2000);
                    $('#modifyPassForm')[0].reset();
                }
        });
        }
    });
});