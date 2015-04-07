/**
 * Created by Administrator on 14-4-12.
 */
$(document).ready(function(){
    $("#loginBtn").on("click",function(){
        event.preventDefault();
        if($('#loginUsername').val()===''||$('#loginPassword').val()===''){
            $('#loginForm').prepend($('<div id="loginAlert" class="alert alert-warning alert-dismissable">' +
            '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'+
                '<strong>警告!</strong> 用户名和密码不能为空！</div>').fadeIn(1000));
        $('#loginAlert').fadeOut(2000);
        }else{
            var loginUser = {
                'username':$('#loginUsername').val(),
                'password':$('#loginPassword').val()
            };
            $.ajax({
                url: "/user/login",
                type: "POST",
                dataType: "json",
                data: loginUser
            }).done(function(data){
                    if(data.error){
                        $('#loginForm').prepend($('<div id="loginAlert" class="alert alert-warning alert-dismissable">' +
                            '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'+
                            '<strong>警告!</strong> 用户名或密码不正确！</div>').fadeIn(1000));
                        $('#loginAlert').fadeOut(2000);
                    }else if(data.role === 1){
                        $('#myLoginModal').modal('hide');
                        window.location='/courseManagement';
                    }else{
                        $('#myLoginModal').modal('hide');
                        window.location='/courseRegist';
                    }
            });
        }
    });
});