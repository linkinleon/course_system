# course_system
基于Node的选课系统。
该系统采用Node.js，Express，Bootstrap，jQuery，MongoDB进行实现。
功能有普通用户可以选课，删除已选课程，课程信息统计等（Bootstrap图表插件Chart.js），管理员可以进行课程管理，普通用户管理等。
页面均采用异步的方式发送请求，并由Node路由来进行处理，使用mongoose操作model层来对数据库进行操作，整个系统符合REST API设计规范。
