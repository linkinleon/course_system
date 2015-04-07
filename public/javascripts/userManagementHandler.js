/**
 * Created by Administrator on 14-6-7.
 */
$(document).ready(function(){
    $("#courseManagementNav").show();
    $("#studentManagementNav").show();
    $("#headerLoginBtn").hide();
    $("#headerRegistBtn").text("注销");
    $("#headerRegistBtn").attr('id','exitLoginBtn');
    $("#exitLoginBtn").attr('data-target','#exitLoginModal');
    var rowSelector;
    $(document).on('click','.glyphicon.glyphicon-remove-circle',function(){
        rowSelector = $(this).parent().parent().parent();//获取要删除的行
        $('#deleteUserModal').modal('show');
    });
    $(document).on('click','.glyphicon.glyphicon-user',function(){
        rowSelector = $(this).parent().parent().parent();//获取要授权的行
        $('#authUserModal').modal('show');
    });

    $('#deleteUserOK').on('click',function(){
        event.preventDefault();
        $.ajax({
            url: "/userManagement/delOneUser?id="+rowSelector.attr('id'),
            type: "DELETE",
            dataType: "json"
        }).done(function(result){
                $('#deleteUserModal').modal('hide');
                if(result.delUserSuccess){
                    rowSelector.remove();
                    $('#userContainer').prepend($('<div id="delUserAlert" class="alert alert-success alert-dismissable">'+
                        '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'+
                        '<strong> 删除用户成功！</strong></div>').fadeIn(1000));
                    $('#delUserAlert').fadeOut(2000);
                }
            });
    });
    $('#authUserOK').on('click',function(){
        event.preventDefault();
        var userRole;
        var currentUserRole = rowSelector.children('td').eq(3).html();
        if(currentUserRole == "普通用户"){
            var userRole = 1;
        }
        if(currentUserRole == "管理员"){
            var userRole = 0;
        }
        $.ajax({
            url: "/userManagement/authOneUser?id="+rowSelector.attr('id')+"&&role="+userRole,
            type: "PUT",
            dataType: "json"
        }).done(function(result){
                if(currentUserRole == "普通用户"){
                    rowSelector.children().eq(3).text("管理员");
                }
                if(currentUserRole == "管理员"){
                    rowSelector.children().eq(3).text("普通用户");
                }
                $('#authUserModal').modal('hide');
                if(result.authUserSuccess){
                    $('#userContainer').prepend($('<div id="authUserAlert" class="alert alert-success alert-dismissable">'+
                        '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'+
                        '<strong> 用户授权成功！</strong></div>').fadeIn(1000));
                    $('#authUserAlert').fadeOut(2000);
                }
            });
    });
});