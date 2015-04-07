/**
 * Created by Administrator on 14-5-28.
 */
$(document).ready(function(){
        $("#allCourseNav").show();
        $("#myContentNav").show();
        $("#headerLoginBtn").hide();
        $("#headerRegistBtn").text("注销");
        $("#headerRegistBtn").attr('id','exitLoginBtn');
        $("#exitLoginBtn").attr('data-target','#exitLoginModal');
});