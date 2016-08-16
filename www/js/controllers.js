angular.module('starter.controllers', ['WifiServices'])

////////////////////////////////////////////////////////////////////////////////////////////////////////
//数据
.controller('MainCtrl', function($scope, $ionicSideMenuDelegate, $ionicPopover, $state, $timeout) {

    $scope.global = { cust_id : 0 };
    $scope.user = { Id: 1, Name: 'Admin', Email: 'admin@test.domain', Phone: '13609876543', Tel: '02129807893', 
        EmergMan1: 'AdminEmerg1', EmergMan1Phone: '13609876542',EmergMan2: 'AdminEmerg2', 
        EmergMan2Phone: '13609876541', address: '浦东新区耀华路120弄121号102' };


    //当前使用主机
    $scope.UsingDeviceViewModel = { device: null };
    //当前使用主机的节点
    $scope.UsingNodesViewModel = {
        nodeTypeId:null,
        nodeType: null,
        nodes: null,
        nodeList: [
                        { id: '0', name: '电子钥匙', icon: 'ion-locked', nodeType: '0' },
                        { id: '1', name: '门磁', icon: 'ion-magnet', nodeType: '1' },
                        { id: '2', name: '红外感应 ', icon: 'ion-wifi', nodeType: '2' },
                        { id: '3', name: '烟雾报警器', icon: 'ion-flame', nodeType: '3' },
                        { id: '4', name: '温度传感器', icon: 'ion-bonfire', nodeType: '4' }
        ]
    };
    
    //$scope.nodeViewModel = {
    //  node:""
    // };
    //OverView帮助用VM
    $scope.OverViewViewModel = {
        OverStatus:"normal",
        JustLogin:false
    };
    //$scope.ArmViewModel = { checked: true };

    //该账号所有主机
    $scope.DevicesViewModel = {
        devices:null
    };
    //当前使用主机的节点(与上重复？)
    $scope.NodesViewModel ={
        nodeType:"",
        nodes:null,
        nodeList:[
                        { id: '0', name: '电子钥匙', icon: 'ion-locked',  nodeType: '0'},
                        { id: '1', name: '门磁', icon: 'ion-magnet', nodeType: '1'},
                        { id: '2', name: '红外感应 ', icon: 'ion-wifi', nodeType: '2'},
                        { id: '3', name: '烟雾报警器', icon: 'ion-flame',  nodeType: '3'},
                        { id: '4', name: '温度传感器', icon: 'ion-bonfire',  nodeType: '4'}
        ]
    
    }

    //报警节点
    $scope.AlarmsViewModel = {
        nodes: null,
        desc:null
    };
    //正在编辑主机、节点类
    $scope.Temp = {
        EditingDevice: null,
        EditingNode:null
    };
    //提醒toggle
    $scope.TempToggle = {
        notifyVersion: false,
        notifyVib: false,
        notifyPush :false
    };
    //正在编辑用户类
    $scope.UserViewModel = { user: null };
    //支付类
    $scope.PurchasingDevice = {device:{}};


    $scope.toggleLeft = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };
    $scope.deviceTap = function(route, device) {
        $scope.device = device;
        $state.go(route);
    };
    $scope.pageJump = function(route) {
        $state.go(route);
    };    
    $ionicPopover.fromTemplateUrl('templates/alerts.html', {
        scope: $scope,
    }).then(function(popover) {
        $scope.popover = popover;
    });
    $scope.openAlerts = function($event) {
        $scope.popover.show($event);
    };
    $scope.closeAlerts = function() {
        $scope.popover.hide();
    };
    $scope.$on('$destroy', function() {
        $scope.popover.remove();
    });
    $timeout(function () {
        ionic.EventController.trigger("resize", "", true, false);
    }, 1500);
})
////////////////////////////////////////////////////////////////////////////////////////////////////////
///
////////////////////////////////////////////////////////////////////////////////////////////////////////


//首页 app.overview overview.html
.controller('OverViewCtrl', function ($q, $scope, $ionicSideMenuDelegate, $ionicPopup, $ionicPopover, $state, $timeout, $http, $ionicLoading, locals) {

    //页面初始化方法
    $scope.DataReq = function () {
        startLoading($ionicLoading);
        console.log(locals.get("cust_id","0"));
        if (locals.get("cust_id","0") == "0")
            $state.go("app.login"); 
       


        //首次登录overview是加载默认主机，之后使用UsingDevice仅加载节点信息
        if ($scope.OverViewViewModel.JustLogin) {
            var devicelisturl = '/device/list';
            var devicelistreqd = { "cust_id": $scope.global.cust_id };
            var devicelistreq = httpReqGen(devicelisturl, devicelistreqd);

            $http(devicelistreq).success(function (data) {
                //取返回值有效data
                var resdata = resResult(data);
                //DevicesViewModel.devices 用户下所有主机
                $scope.DevicesViewModel.devices = null;
                $scope.DevicesViewModel.devices = resdata;
                //UsingDeviceViewModel.device 当前使用主机
                $scope.UsingDeviceViewModel.device = resdata[0];
                //布防状态alert_status 1布防 0撤防
                if (resdata[0].alert_status == 0) {
                    $scope.UsingDeviceViewModel.device.status = false;
                    $scope.UsingDeviceViewModel.device.titleText = "撤防";
                    $scope.UsingDeviceViewModel.device.icon = "ion-unlocked";
                }
                else {
                    $scope.UsingDeviceViewModel.device.status = true;
                    $scope.UsingDeviceViewModel.device.titleText = "布防";
                    $scope.UsingDeviceViewModel.device.icon = "ion-locked";
                }

                //状态status 1在线 0掉线
                if (resdata[0].alertStatus == 1) {
                    $scope.UsingDeviceViewModel.device.deviceStatus = "您当前的主机正在正常运行";
                    $('#cubicCore').css("background-color", "#57a595");
                }
                else {
                    $scope.UsingDeviceViewModel.device.deviceStatus = "您当前的主机已掉线";
                    $('#cubicCore').css("background-color", "#d43838");
                }


                //主机信息返回后请求节点信息
                var nodelisturl = '/node/list';
                var dvcid = $scope.UsingDeviceViewModel.device.device_id;
                var nodelistreqd = { "cust_id": $scope.global.cust_id, "device_id": dvcid };
                var nodelistreq = httpReqGen(nodelisturl, nodelistreqd);

                $http(nodelistreq).success(function (data) {
                    //取返回值有效data
                    var nodesdata = resResult(data);
                    //NodesViewModel.nodes 当前主机下所有节点
                    $scope.NodesViewModel.nodes = nodesdata;
                    //UsingNodesViewModel.nodes 正在使用的当前主机下所有节点
                    $scope.UsingNodesViewModel.nodes = nodesdata;


                    //节点信息返回后请求报警信息
                    var alarmurl = '/device/alert';
                    var dvid = $scope.UsingDeviceViewModel.device.device_id;
                    var alarmreqd = { "cust_id": $scope.global.cust_id, "device_id": dvid };
                    var alarmreq = httpReqGen(alarmurl, alarmreqd);

                    $http(alarmreq).success(function (data) {
                        //取返回值有效data
                        var alarmsdata = resResult(data);
                        //AlarmsViewModel.nodes 当前主机下所有报警节点
                        $scope.AlarmsViewModel.nodes = alarmsdata;

                        //首页设备报警颜色
                        alarmCoreJudge(alarmsdata);

                        //报警概要
                        alarmDescGen(alarmsdata);

                    }).error(function () {
                        alert("节点报警信息Error，服务器请求故障");
                    });
                }).error(function () {
                    alert("服务器请求故障");
                });
            }).error(function () {
                alert("服务器请求故障");
            });


            //加载TempToggle配置文件
            var n_versionStr = locals.get("n_version", "false");
            if (n_versionStr == "false")
                $scope.TempToggle.notifyVersion = false;
            else
                $scope.TempToggle.notifyVersion = true;

            var n_vibStr = locals.get("n_vib", "false");
            if (n_vibStr == "false")
                $scope.TempToggle.notifyVib = false;
            else
                $scope.TempToggle.notifyVib = true;

            var n_pushStr = locals.get("n_push", "false");
            if (n_pushStr == "false")
                $scope.TempToggle.notifyPush = false;
            else
                $scope.TempToggle.notifyPush = true;
            //
            $scope.OverViewViewModel.JustLogin = false;
        }
            //其他出跳转overview 不加载默认主机，当前主机已在其他出更新、只更新当前主机下的节点
        else {
            //主机信息返回后请求节点信息
            var nodelisturl = '/node/list';
            var dvcid = $scope.UsingDeviceViewModel.device.device_id;
            var nodelistreqd = { "cust_id": $scope.global.cust_id, "device_id": dvcid };
            var nodelistreq = httpReqGen(nodelisturl, nodelistreqd);

            $http(nodelistreq).success(function (data) {
                //取返回值有效data
                var nodesdata = resResult(data);
                //NodesViewModel.nodes 当前主机下所有节点
                $scope.NodesViewModel.nodes = nodesdata;
                //UsingNodesViewModel.nodes 正在使用的当前主机下所有节点
                $scope.UsingNodesViewModel.nodes = nodesdata;


                //节点信息返回后请求报警信息
                var alarmurl = '/device/alert';
                var dvid = $scope.UsingDeviceViewModel.device.device_id;
                var alarmreqd = { "cust_id": $scope.global.cust_id, "device_id": dvid };
                var alarmreq = httpReqGen(alarmurl, alarmreqd);

                $http(alarmreq).success(function (data) {
                    //取返回值有效data
                    var alarmsdata = resResult(data);
                    //AlarmsViewModel.nodes 当前主机下所有报警节点
                    $scope.AlarmsViewModel.nodes = alarmsdata;

                    //首页设备报警颜色
                    alarmCoreJudge(alarmsdata);

                    //报警概要
                    alarmDescGen(alarmsdata);
                    
                }).error(function () {
                    alert("节点报警信息Error，服务器请求故障");
                });
            }).error(function () {
                alert("服务器请求故障");
            });
        }

    

        //九宫格css
        //circleCss();
        //DataReq end
    }
    $timeout(function () {
        $ionicLoading.hide();
    }, 1000);
    //布防撤防方法
    $scope.armStatusBtnChange = function () {
        //若当前撤防状态则布防
        if (!$scope.UsingDeviceViewModel.device.status) {
            var armurl = '/device/arming';
            var armreqd = { "cust_id": $scope.global.cust_id, "device_id": $scope.UsingDeviceViewModel.device.device_id };
            var armreq = httpReqGen(armurl, armreqd);

            $http(armreq).success(function (data) {
                //返回0000
                if (data.result.code == "0000") {
                    //再次请求主机信息
                    var devicelisturl = '/device/list';
                    var devicelistreqd = { "cust_id": $scope.global.cust_id };
                    var devicelistreq = httpReqGen(devicelisturl, devicelistreqd);

                    $http(devicelistreq).success(function (data) {
                        //取返回值有效data
                        var resdata = resResult(data);
                        //DevicesViewModel.devices 用户下所有主机
                        $scope.DevicesViewModel.devices = null;
                        $scope.DevicesViewModel.devices = resdata;
                        //UsingDeviceViewModel.device 当前使用主机
                        $scope.UsingDeviceViewModel.device = resdata[0];
                        //布防状态alert_status 1布防 0撤防
                        if (resdata[0].alert_status == 0) {
                            $scope.UsingDeviceViewModel.device.status = false;
                            $scope.UsingDeviceViewModel.device.titleText = "撤防";
                            $scope.UsingDeviceViewModel.device.icon = "ion-unlocked";
                        }
                        else {
                            $scope.UsingDeviceViewModel.device.status = true;
                            $scope.UsingDeviceViewModel.device.titleText = "布防";
                            $scope.UsingDeviceViewModel.device.icon = "ion-locked";
                        }

                        //状态status 1在线 0掉线
                        if (resdata[0].alertStatus == 1) {
                            $scope.UsingDeviceViewModel.device.deviceStatus = "您当前的主机正在正常运行";
                        }
                        else {
                            $scope.UsingDeviceViewModel.device.deviceStatus = "您当前的主机已掉线";
                        }
                    }).error(function () { });
                }
                    //布防失败
                else {
                    alert("布防请求失败");
                }
                //显示文字和锁图标
                $scope.UsingDeviceViewModel.device.titleText = $scope.UsingDeviceViewModel.device.status ? "布防" : "撤防";
                $scope.UsingDeviceViewModel.device.icon = $scope.UsingDeviceViewModel.device.status ? "ion-locked" : "ion-unlocked";
            }).error(function () {
                alert("布防撤防服务器请求故障");
            });
        }
            //若当前布防状态则撤防
        else {
            var armurl = '/device/unarming';
            var armreqd = { "cust_id": $scope.global.cust_id, "device_id": $scope.UsingDeviceViewModel.device.device_id };
            var armreq = httpReqGen(armurl, armreqd);

            $http(armreq).success(function (data) {
                //返回0000
                if (data.result.code == "0000") {
                    //再次请求主机信息
                    var devicelisturl = '/device/list';
                    var devicelistreqd = { "cust_id": $scope.global.cust_id };
                    var devicelistreq = httpReqGen(devicelisturl, devicelistreqd);

                    $http(devicelistreq).success(function (data) {
                        //取返回值有效data
                        var resdata = resResult(data);
                        //DevicesViewModel.devices 用户下所有主机
                        $scope.DevicesViewModel.devices = null;
                        $scope.DevicesViewModel.devices = resdata;
                        //UsingDeviceViewModel.device 当前使用主机
                        $scope.UsingDeviceViewModel.device = resdata[0];
                        //布防状态alert_status 1布防 0撤防
                        if (resdata[0].alert_status == 0) {
                            $scope.UsingDeviceViewModel.device.status = false;
                            $scope.UsingDeviceViewModel.device.titleText = "撤防";
                            $scope.UsingDeviceViewModel.device.icon = "ion-unlocked";
                        }
                        else {
                            $scope.UsingDeviceViewModel.device.status = true;
                            $scope.UsingDeviceViewModel.device.titleText = "布防";
                            $scope.UsingDeviceViewModel.device.icon = "ion-locked";
                        }

                        //状态status 1在线 0掉线
                        if (resdata[0].alertStatus == 1) {
                            $scope.UsingDeviceViewModel.device.deviceStatus = "您当前的主机正在正常运行";
                        }
                        else {
                            $scope.UsingDeviceViewModel.device.deviceStatus = "您当前的主机已掉线";
                        }
                    }).error(function () { 
                        alert("服务器请求故障");
                    });
                }
                    //布防失败
                else {
                    alert("布防请求失败");
                }
                //显示文字和锁图标
                $scope.UsingDeviceViewModel.device.titleText = $scope.UsingDeviceViewModel.device.status ? "布防" : "撤防";
                $scope.UsingDeviceViewModel.device.icon = $scope.UsingDeviceViewModel.device.status ? "ion-locked" : "ion-unlocked";
            }).error(function () {
                alert("服务器请求故障");
            });
        }
    };


    //说明modal
    $scope.openModal = function () {
        startModal($ionicLoading);

        $timeout(function () {
            $ionicLoading.hide();
        }, 2000);
    }
    $scope.toggleLeft = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };
    $scope.nodeTypeTap = function(route, detType,detTypeId) {
        //$scope.UsingNodesViewModel.nodes = nodes;
        $scope.UsingNodesViewModel.nodeType = detType;
        $scope.UsingNodesViewModel.nodeTypeId = detTypeId;
        
        $state.go(route);
    };
    $scope.nodeTap = function(route, node) {
        $scope.nodeViewModel.node = node;
        $state.go(route);
    };  
    $scope.pageJump = function(route) {
        $state.go(route);
    };    
    $ionicPopover.fromTemplateUrl('templates/alerts.html', {
        scope: $scope,
    }).then(function(popover) {
        $scope.popover = popover;
    });
    $scope.openAlerts = function($event) {
        $scope.popover.show($event);
    };
    $scope.closeAlerts = function() {
        $scope.popover.hide();
    };
    $scope.$on('$destroy', function() {
        $scope.popover.remove();
    });
    $timeout(function () {
        ionic.EventController.trigger("resize", "", true, false);
    }, 1500);
})
//布防 app.arm arm.html
.controller('ArmCtrl', function($scope, $state, locals) {
    if (!locals.get("cust_id",""))
        $state.go("app.login"); 
})

//摄像头 app.camera camera.html
.controller('CameraCtrl', function($scope, $http, $state, locals){ 
    if (!locals.get("cust_id",""))
        $state.go("app.login"); 

    $scope.init = function() {
        alert("尚未提供添加摄像头接口");
    };
})

////////////////////////////////////////////////////////////////////////////////////////////////////////
///
////////////////////////////////////////////////////////////////////////////////////////////////////////
    //节点配对
.controller('NodesCtrl', function ($scope,$http, locals,$ionicLoading, $timeout, $state) {
        if (!locals.get("cust_id",""))
            $state.go("app.login"); 

        $scope.init = function () {
            var nodelisturl = '/node/list';
            var dvcid = $scope.UsingDeviceViewModel.device.device_id;
            var nodelistreqd = { "cust_id": $scope.global.cust_id, "device_id": dvcid };
            var nodelistreq = httpReqGen(nodelisturl, nodelistreqd);

            $http(nodelistreq).success(function (data) {
                //取返回值有效data
                var nodesdata = resResult(data);
                //NodesViewModel.nodes 当前主机下所有节点
                $scope.NodesViewModel.nodes = nodesdata;
                //UsingNodesViewModel.nodes 正在使用的当前主机下所有节点
                $scope.UsingNodesViewModel.nodes = nodesdata;
            }).error(function () {
                alert("服务器请求故障");
            });
        }
        $scope.startPairing = function(){
            startLoading($ionicLoading);

            $timeout(function () {
                var nodelisturl = '/node/list';
                var dvcid = $scope.UsingDeviceViewModel.device.device_id;
                var nodelistreqd = { "cust_id": $scope.global.cust_id, "device_id": dvcid };
                var nodelistreq = httpReqGen(nodelisturl, nodelistreqd);

                $http(nodelistreq).success(function (data) {
                    //取返回值有效data
                    var nodesdata = resResult(data);
                    //NodesViewModel.nodes 当前主机下所有节点
                    $scope.NodesViewModel.nodes = nodesdata;
                    //UsingNodesViewModel.nodes 正在使用的当前主机下所有节点
                    $scope.UsingNodesViewModel.nodes = nodesdata;
                }).error(function () {
                    alert("服务器请求故障");
                });

                $ionicLoading.hide();
            }, 10000);
        }

        $scope.nodeEdit = function (node) {
            $scope.Temp.EditingNode = node;
            $state.go("app.nodeedit")
        }
        $scope.removeNode = function (editingNode) {
            //修改节点名字
            var url = '/node/delete';
            var reqd = { "cust_id": $scope.global.cust_id, "device_id": $scope.UsingDeviceViewModel.device.device_id, "node_id": editingNode.node_id };
            var req = httpReqGen(url, reqd);

            $http(req).success(function (data) {
                //取返回值有效data
                if (data.result.code == "0000") {
                    alert(data.result.msg);
                    $state.go("app.nodes");
                }
                else
                    alert(data.result.msg);
            }).error(function () {
                alert("服务器请求故障");
            });
            
            
        }

    })
//添加设备 app.addNode add-node.html
.controller('NodeEditCtrl', function ($scope, $state, locals,$http) {
  if (!locals.get("cust_id",""))
    $state.go("app.login"); 

  $scope.submitEdit = function () {
      var sss = $scope.Temp.EditingNode;
      var nodeid = $scope.Temp.EditingNode;
      //修改节点名字
      var url = '/node/name/update';
      var reqd = { "cust_id": $scope.global.cust_id, "device_id": $scope.UsingDeviceViewModel.device.device_id, "node_id": $scope.Temp.EditingNode.node_id, "name": $scope.Temp.EditingNode.name };
      var req = httpReqGen(url, reqd);

      $http(req).success(function (data) {
          //取返回值有效data
          if (data.result.code == "0000") {
              alert("节点名称已更改");
              $state.go("app.nodes");
          }
          else
              alert(data.result.msg);
      }).error(function () {
          alert("服务器请求故障");
      });
  }
})
////////////////////////////////////////////////////////////////////////////////////////////////////////
///
////////////////////////////////////////////////////////////////////////////////////////////////////////
//用户 app.usersetting usersetting.html
.controller('usersettingCtrl', function($scope, $state, locals) {
  if (!locals.get("cust_id",""))
    $state.go("app.login"); 

  $scope.logout = function() {
    alert(locals.get("cust_id",""));
    //存储数据
    locals.set("username","0");
    locals.set("cust_id", "0");
    console.log('cust_id: ' + locals.get("cust_id",""));
    $state.go('app.login');
  }
})
.controller('MaintananceCtrl', function ($scope, $state, locals) {
    if (!locals.get("cust_id", ""))
        $state.go("app.login");

    $scope.init = function () {
        alert("报修借口未实现");
    }
    $scope.GuestSevice = { Maintanance: null };

    $scope.maintananceSubmit = function () {
        alert(locals.get("cust_id", ""));
        //报修申请

        //var url = '';
        //var reqd = { };
        //var req = httpReqGen(url, reqd);

        //$http(req).success(function (data) {
        //    //取返回值有效data
        //    if (data.result.code == "0000") {
        //        alert("报修已提交");
        //        $state.go("app.nodes");
        //    }
        //    else
        //        alert(data.result.msg);
        //}).error(function () {
        //    alert("服务器请求故障");
        //});

    }
})

.controller('MessagesCtrl', function ($scope, $state, locals) {
    if (!locals.get("cust_id", ""))
        $state.go("app.login");

    $scope.MessageViewModel = { messages: null };

    $scope.messageInit = function () {

        alert("消息接口未提供");

        ////获取MessageList
        //var url = 'xxxxx';
        //var reqd = {};
        //var req = httpReqGen(url, reqd);

        //$http(req).success(function (data) {
        //    //取返回值有效data
        //    if (data.result.code == "0000") {
        //        $scope.MessageViewModel = data;
        //    }
        //    else
        //        alert(data.result.msg);
        //}).error(function () {
        //    alert("服务器请求故障");
        //});

    }

})

/////////////////////////////////////////////////       
//个人信息 app.userinfo userinfo.html
.controller('updateUser', function($scope, $q, $http, $state, locals) {
  if (!locals.get("cust_id",""))
    $state.go("app.login"); 


  var url = '/account/detail';
  var reqd = { "cust_id": $scope.global.cust_id};
  var req = httpReqGen(url, reqd);
  $http(req).success(function (data) {
      var validData = resResult(data);
      if (validData) {
          $scope.UserViewModel.user = validData;
      }
  }).error(function () { });


  $scope.setFormScope = function(scope){
    this.formScope = scope;
  }

  //$scope.newuser = $scope.user;
  $scope.userSubmit = function() {
      var url = '/account/upgrade';
      var reqd = { "cust_id": $scope.global.cust_id,"tel":$scope.UserViewModel.user.tel, "email":$scope.UserViewModel.user.email,"address":$scope.UserViewModel.user.address };
      var req = httpReqGen(url, reqd);
      $http(req).success(function (data) {
          var validData = resResult(data);
          if (validData) {
              $state.go("app.usersetting");
          }
      }).error(function () { });
      $scope.UserViewModel.user

  };
})
//子账号 app.subusers subusers.html
.controller('subUserCtrl', function($scope, $state, $http) {

  $scope.delete = function(item){
    //删除子账号业务
  }
  $scope.edit = function(item){
    //编辑子账号业务
  }  

  $scope.pageJump = function(route) {
    $state.go(route);
  };  
})
//子账号 app.subuserinfo subuserinfo.html
.controller('addSubUser', function($scope, locals) {
  if (!locals.get("cust_id",""))
    $state.go("app.login"); 

  $scope.setFormScope = function(scope){
    this.formScope = scope;
  }
  $scope.newuser = {};
  $scope.userSubmit = function() {
    alert("尚未提供添加子账户接口");
  };
})
/////////////////////////////////////////////////
///
.controller('findPasswordCtrl', function($scope, $q, $http, $state, locals){
  $scope.findData = {};
  $scope.findPassword = function() {
    if(!$scope.findData.mobileNo || !$scope.findData.password || !$scope.findData.passwordConfirm
      || !$scope.findData.code) {
      alert("请填写");
      return;
    }
    if($scope.findData.password != $scope.findData.passwordConfirm) {
      alert('新密码输入不一致');
      return;
    }    

    var apibranch = '/account/findpwd';
    var newpw = hex_md5($scope.findData.password).toUpperCase();
    var requestObject = {
        phone: $scope.findData.mobileNo,
        login_pwd: newpw,
        sms_captcha: $scope.findData.code
    };
    var req = httpReqGen(apibranch,requestObject);

    $http(req).then(function(response) {
      console.log(response);     
      var result = $.parseJSON(response.data.result);
      if (result.code == 0000){
        $state.go('app.login');
      } else {
        alert(result.msg);
      }
    }, function(error) {    
      console.log(error);
    });
  };
})
/////////////////////////////////////////////////
//更改密码 app.changepassword changepassword.html
.controller('PasswordCtrl', function($scope,$q,$http,$state, locals) {
  if (!locals.get("cust_id",""))
    $state.go("app.login"); 
  
  $scope.setFormScope = function(scope){
    this.formScope = scope;

  }
  $scope.codeform = {};
  $scope.changePW = function() {
    if(!$scope.codeform.oldPW || !$scope.codeform.newPW || !$scope.codeform.confirmPW) {
      alert('请填写');
      return;
    }
    if($scope.codeform.newPW != $scope.codeform.confirmPW) {
      alert('新密码输入不一致');
      return;
    }    
    var apibranch = '/account/updatepwd';

    var oldpw = hex_md5($scope.codeform.oldPW).toUpperCase();
    var newpw = hex_md5($scope.codeform.newPW).toUpperCase();
    var id = $scope.global.cust_id;
    var reqobj = {
      "cust_id":id,
      "old_pwd":oldpw,
      "new_pwd":newpw
    };
    var req = httpReqGen(apibranch,reqobj);

    var deferred = $q.defer();
    $http(req).then(function(response) {
      var resData = "";
      if(response.status == 200){
        var resData = $.parseJSON(response.data.result);
        if(resData.code == "0000"){
          alert('密码已修改');
          $state.go("app.usersetting");           
        }
        else{
          alert('密码修改失败');
        }
      }
      else
        alert('密码修改失败');
      deferred.resolve();
    }, function(error) {
        deferred.reject();
    });
  };
})  
/////////////////////////////////////////////////
///
/////////////////////////////////////////////////
//版本控制 app.version version.html
.controller('VersionCtrl', function($scope,$http,$q, locals){
  if (!locals.get("cust_id",""))
    $state.go("app.login"); 
   
  $scope.VersionViewModel = { version: null, currentVersion: {"version":"2.0.0"} };
  $scope.init = function () {
      var url = '/app/upgrade';
      var platform = "Android";
      var version = $scope.VersionViewModel.currentVersion.version;
      var reqd = { "platform": platform, "app_version": version };
      var req = httpReqGen(url, reqd);

      $http(req).success(function (data) {
          //取返回值有效data
          var versiondata = resResult(data);
          //version vm
          if (data.result.msg == "已经是最新版!!!" && data.result.code == "1002") {
              $scope.VersionViewModel.version = {"version_no":"3.0.2","is_update":0,"update_content":"已是最新版本","cer_type":"app","id":"728430815610302464","public_time":"2016-05-06 11:46:33","down_addr":"http://www.baidu.com","file_size":"10","platform":"Android"};
          }
          else
              $scope.VersionViewModel.version = versiondata;

      }).error(function () { });

  }
})
/////////////////////////////////////////////////
///
/////////////////////////////////////////////////
//帮助 app.help help.html
.controller('HelpCtrl', function($scope){ 
})
/////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
///
////////////////////////////////////////////////////////////////////////////////////////////////////////
//设置 app.settings settings.html
.controller('settingsCtrl', function($scope, $state, locals) {
  if (!locals.get("cust_id",""))
      $state.go("app.login");

  $scope.versionToggleChanged = function () {
      var result = ($scope.TempToggle.notifyVersion) ? true : false;
      locals.set("n_version", result);
      alert($scope.TempToggle.notifyVersion);
  }

})
.controller('MessageSettingCtrl', function ($scope, $state, locals) {
    if (!locals.get("cust_id", ""))
        $state.go("app.login");
    $scope.vibToggleChanged = function () {
        var result = ($scope.TempToggle.notifyVib) ? true : false;
        locals.set("n_vib", result);
    }
    $scope.pushToggleChanged = function () {
        var result = ($scope.TempToggle.notifyPush) ? true : false;
        locals.set("n_push", result);
    }
})
/////////////////////////////////////////////////
///
/////////////////////////////////////////////////

////////////////////
//选择主机 app.deviceselect deviceselect.html
.controller('DeviceSelectCtrl', function($scope, $state) {
  $scope.data = {};
  //console.log($scope.UsingDeviceViewModel.name);
  $scope.init = function(){
    
  }
  $scope.currentDeviceChange = function (device) {
      $scope.UsingDeviceViewModel.device = device;
  };
})
//主机管理 app.devicemanage devicemanage.html
.controller('DeviceMangeCtrl', function ($scope, $state,$http) {
    $scope.data = {};
    //console.log($scope.UsingDeviceViewModel.name);
    $scope.init = function () {

    }
    $scope.deviceTap = function (route, device) {
        $scope.Temp.EditingDevice = device;
        $state.go(route);
    };

    //通过二维码添加主机
    $scope.addDevicebyBarcode = function () {

        $cordovaBarcodeScanner.scan().then(function (imageData) {

            var deviceId = imageData.text;
            var devicename = ""
            var customerId = $scope.global.cust_id;
            //添加主机
            var url = '/device/binding';
            var dvcid = $scope.UsingDeviceViewModel.device.device_id;
            var reqd = { "cust_id": customerId, "device_id": deviceId, "device_name": devicename };
            var req = httpReqGen(url, reqd);

            $http(req).success(function (data) {
                var validData = resResult(data);
                if (validData) {
                    var devicelisturl = '/device/list';
                    var devicelistreqd = { "cust_id": $scope.global.cust_id };
                    var devicelistreq = httpReqGen(devicelisturl, devicelistreqd);

                    $http(devicelistreq).success(function (data) {
                        var resdata = resResult(data);
                        $scope.DevicesViewModel.devices = null;
                        $scope.DevicesViewModel.devices = resdata;
                        //var newdada = [resdata[0], resdata[0], resdata[0]];
                        //$scope.DevicesViewModel.devices = newdada;
                        $scope.UsingDeviceViewModel.device = resdata[0];
                    }).error(function () { });
                }
            }).error(function () { });


            console.log("Barcode Format -> " + imageData.format);

            console.log("Cancelled -> d" + imageData.cancelled);

        }, function (error) {
            console.log("An error happened -> " + error);
        });
    };
})
.controller('DeviceDetailsCtrl', function ($scope, $state) {
    $scope.temp = { name: $scope.Temp.EditingDevice.device_name, id: $scope.Temp.EditingDevice.device_id };
    $scope.updateDeviceInfo = function () {
        var datata = $scope.temp;
    }
})
//添加主机 app.deviceinfo deviceinfo.html
.controller('addDevice', function($scope) {
  $scope.init = function(){
    alert("添加主机接口尚未提供");
  }
})
////////////////////
/////////////////////////////////////////////////
///
/////////////////////////////////////////////////
//主机网络连接管理 app.devicenetwork devicenetwork.html
.controller('DeviceNetworkCtrl', function($scope){ 
  $scope.init = function(){
    alert("主机网络设置接口尚未提供");
  }
})
/////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
///
////////////////////////////////////////////////////////////////////////////////////////////////////////
//通知 app.notifies notifies.html
.controller('NotificationCtrl', function($scope, $state, $ionicPopup, locals) {
  if (!locals.get("cust_id",""))
    $state.go("app.login"); 

  $scope.deviceSelect = function() {

  };     
})
/////////////////////////////////////////////////
///
/////////////////////////////////////////////////
//支付 app.purchaseinfo purchaseinfo.html
.controller('PurchaseDevicesCtrl', function($scope,$state) {
  $scope.init = function(){
    // alert("支付接口尚未提供");
  }
  $scope.next = function(device){
    //$scope.PurchasingDevice.device = device;
    $scope.PurchasingDevice.device.accountId = device.account.accountId;
    $scope.PurchasingDevice.device.createAt = device.createAt;
    $scope.PurchasingDevice.device.deviceId = device.deviceId;
    $scope.PurchasingDevice.device.isDeleted = device.isDeleted;
    $scope.PurchasingDevice.device.name = device.name;
    $state.go('app.purchaseinfo');
  }
})
//支付 app.purchaseinfo purchaseinfo.html
.controller('PurchaseCtrl', function($scope,$state) {
  $scope.init = function(){
    // alert("支付接口尚未提供");
  }

  $scope.next = function() {
    $state.go('app.purchasemethod');    
  }

})
.controller('PurchaseMethodCtrl', function($scope,$state) {
  $scope.init = function(){
    
  }
  $scope.purchase = function(){
    
  }  

})

/////////////////////////////////////////////////
///
/////////////////////////////////////////////////
//报警 app.alarm alarm.html
.controller('AlarmCtrl', function ($scope, $state, $http) {
    $scope.AlarmViewModel = { alarms: null };
    $scope.init = function(){
        alert("报警数据结构尚未提供");

        //接口未实现
        var alarmlisturl = '/device/alert/record';
        var alarmreqd = { "cust_id": $scope.global.cust_id, "device_id": $scope.UsingDeviceViewModel.device.device_id, "page": 1, "rows": 1, };
        var alarmreq = httpReqGen(alarmlisturl, alarmreqd);

        $http(alarmreq).success(function (data) {
            //取返回值有效data
            var alarmdata = resResult(data);
            //更新内存的报警记录
            $scope.AlarmViewModel.alarms = alarmdata;
        }).error(function () {
            alert("服务器请求故障");
        });
  }
})
/////////////////////////////////////////////////
///
/////////////////////////////////////////////////
//主板电池信息 app.battery battery.html
.controller('BatteryCtrl', function($scope,$state) {
    $scope.BatteryViewModel = { battery: null };
    $scope.init = function () {
        alert("节点电量接口尚未提供");

        ////接口未实现
        //var manulisturl = '/电量/电量list';
        //var manulistreqd = {};
        //var manulistreq = httpReqGen(manulisturl, manulistreqd);

        //$http(manulistreq).success(function (data) {
        //    //取返回值有效data
        //    var batterydata = resResult(data);
        //    //更新内存的操作记录
        //    $scope.BatteryViewModel.battery = batterydata;
        //}).error(function () { });

    }
})
/////////////////////////////////////////////////
///
///
/////////////////////////////////////////////////
//操作栈 app.manustack manustack.html
.controller('ManuStackCtrl', function ($scope, $state) {
    $scope.ManuStackViewModel = { manustack: null };
    $scope.init = function(){
        alert("操作记录数据结构尚未提供");

        var manulisturl = '/device/opt/record';
        var manulistreqd = { "cust_id": $scope.global.cust_id, "device_id": $scope.UsingDeviceViewModel.device.device_id, "page": 1, "rows": 1, };
        var manulistreq = httpReqGen(manulisturl, manulistreqd);

        $http(manulistreq).success(function (data) {
            //取返回值有效data
            var manudata = resResult(data);
            //更新内存的操作记录
            $scope.ManuStackViewModel.manustack = manudata;
        }).error(function () {
            alert("服务器请求故障");
        });
        
  }
})
/////////////////////////////////////////////////
///
////////////////////////////////////////////////////////////////////////////////////////////////////////
//测试用功能 app.vib vib.html
.controller('VibrationCtrl', function($scope, $cordovaVibration, $cordovaBarcodeScanner, $state, locals){ 
 if (!locals.get("cust_id",""))
    $state.go("app.login"); 

  $scope.startVib=function(){ 
    // 震动 1000ms 
    $cordovaVibration.vibrate(1000); 
  };


  $scope.scanBarcode = function() {

  $cordovaBarcodeScanner.scan().then(function(imageData) {

  alert(imageData.text);

  console.log("Barcode Format -> " + imageData.format);

  console.log("Cancelled -> d" + imageData.cancelled);

  }, function(error) {

  console.log("An error happened -> " + error);

  });

  };
})
////////////////////////////////////////////////////////////////////////////////////////////////////////
//注册
.controller('register', function($q, $scope, $ionicSideMenuDelegate, $ionicPopover, $state, $http, locals) {

  //$scope.setFormScope = function(scope){
  //  this.formScope = scope;
  //}
  $scope.registerData = {};
  $scope.sendSMS = function (phoneNum) {
      var url = '/sms/captcha/register';
      var reqd = { "phone": phoneNum };
      var req = httpReqGen(url, reqd);
      $http(req).success(function (data) {
          //发送成功0000
          if (data.result.code == "0000")
              alert("手机验证码发送成功");
              //手机号码已经注册1002
          else
              alert("该手机号码已经注册");
      }).error(function () {
          alert("服务器请求故障");
      });
  }
  $scope.submit = function() {
    if(!$scope.registerData.mobileNo) {
      alert('mobileNo required');
      return;
    }
    if(!$scope.registerData.password) {
      alert('password required');
      return;
    }
    if(!$scope.registerData.code) {
      alert('code required');
      return;
    }

    var requestData = {
      phone: $scope.registerData.mobileNo,
      login_pwd: hex_md5($scope.registerData.password).toLocaleUpperCase(),
      sms_captcha: $scope.registerData.code,
    };

    var apibranch = '/account/register';
    var request = httpReqGen(apibranch,requestData);

    $http(request).then(function(response) {
        //取返回值有效data
        var nodesdata = resResult(response.data);
        $scope.global.cust_id = nodesdata;
        $state.go('app.userinfo');

    }, function(error) {
    });
  }
  $scope.pageJump = function (route) {
      $state.go(route);
  }
  $scope.check = function (scope) {
      if ($scope.registerData.unchecked)
          $scope.registerData.unchecked = false;
      else
          $scope.registerData.unchecked = true;
  }
})

//本地存储数据===================================
.factory('locals',['$window',function($window){
      return{        //存储单个属性
        set :function(key,value){
          $window.localStorage[key]=value;
        },        //读取单个属性
        get:function(key,defaultValue){
          return  $window.localStorage[key] || defaultValue;
        },        //存储对象，以JSON格式存储
        setObject:function(key,value){
          $window.localStorage[key]=JSON.stringify(value);
        },        //读取对象
        getObject: function (key) {
          return JSON.parse($window.localStorage[key] || '{}');
        }
      }
  }])

//极光推送===========================================
.factory('jpushService',['$http','$window','$document',function($http,$window,$document){
    var jpushServiceFactory={};

    //var jpushapi=$window.plugins.jPushPlugin;

    //启动极光推送
    var _init=function(config){
        $window.plugins.jPushPlugin.init();
        //设置tag和Alias触发事件处理
        document.addEventListener('jpush.setTagsWithAlias',config.stac,false);
        //打开推送消息事件处理
        $window.plugins.jPushPlugin.openNotificationInAndroidCallback = config.oniac;

        $window.plugins.jPushPlugin.setDebugMode(true);
    }
    //获取状态
    var _isPushStopped=function(fun){
        $window.plugins.jPushPlugin.isPushStopped(fun)
    }
    //停止极光推送
    var _stopPush=function(){
        $window.plugins.jPushPlugin.stopPush();
    }

    //重启极光推送
    var _resumePush=function(){
        $window.plugins.jPushPlugin.resumePush();
    }

    //设置标签和别名
    var _setTagsWithAlias=function(tags,alias){
        $window.plugins.jPushPlugin.setTagsWithAlias(tags,alias);
    }

    //设置标签
    var _setTags=function(tags){
        $window.plugins.jPushPlugin.setTags(tags);
    }

    //设置别名
    var _setAlias=function(alias){
        $window.plugins.jPushPlugin.setAlias(alias);
    }

    jpushServiceFactory.init=_init;
    jpushServiceFactory.isPushStopped=_isPushStopped;
    jpushServiceFactory.stopPush=_stopPush;
    jpushServiceFactory.resumePush=_resumePush;

    jpushServiceFactory.setTagsWithAlias=_setTagsWithAlias;
    jpushServiceFactory.setTags=_setTags;
    jpushServiceFactory.setAlias=_setAlias;

    return jpushServiceFactory;
}])

//登录
.controller('login', function($scope, $ionicSlideBoxDelegate, $ionicPopup, $http, $state, locals) {
  $scope.loginData = {};
  $scope.login = function () {
      if (!$scope.loginData.username) {
          alert('请输入用户名。');
          return;
      }
      if (!$scope.loginData.password) {
          alert('请输入密码。');
          return;
      }
      var requestData = {
          phone: $scope.loginData.username,
          login_pwd: hex_md5($scope.loginData.password).toLocaleUpperCase(),
      };

      var apibranch = '/account/login';
      var request = httpReqGen(apibranch, requestData);

      $http(request).then(function (response) {
          console.log(response);
          var result = response.data.result;
          if (result.code == 0000) {
              $scope.global.cust_id = result.data.cust_id;

              //存储数据
              locals.set("username", requestData.phone);
              locals.set("cust_id", result.data.cust_id);
              //读取数据
              console.log(locals.get("username", ""));
              console.log(locals.get("cust_id", ""));
              $scope.OverViewViewModel.JustLogin = true;
              $state.go('app.dashboard.overview');
          } else {
              alert(result.msg);
          }
      }, function (error) {
          console.log(error);
      });
  }
  $scope.nextSlide = function() {
    $ionicSlideBoxDelegate.next();
  }
  $scope.prevSlide = function() {
    $ionicSlideBoxDelegate.previous();
  }
  $scope.setFormScope = function(scope){
    this.formScope = scope;
  }
})

////////////////////////////////////////////////////////////////////////////////////////////////////////
.directive('wrapOwlcarousel', function () {
    return {
        restrict: 'E',
        link: function (scope, element, attrs) {
            var options = scope.$eval($(element).attr('data-options'));
            $(element).owlCarousel(options);
        }
    };
})
;

function getReqNo(){
    var newuuid = UUID.prototype.createUUID();
    var aesKey = "XinLaiWitHome___";
    var newAesKey = null;
    var aesEncrypt = function(data, keyStr, ivStr) {
                var sendData = CryptoJS.enc.Utf8.parse(data);
                var key = CryptoJS.enc.Utf8.parse(keyStr);
                var iv  = CryptoJS.enc.Utf8.parse(ivStr);
                var encrypted = CryptoJS.AES.encrypt(sendData, key,{iv:iv,mode:CryptoJS.mode.CBC,padding:CryptoJS.pad.Iso10126});
                return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
    };
    var aesDecrypt = function(data, keyStr, ivStr) {
      var key = CryptoJS.enc.Utf8.parse(keyStr);
      var iv  = CryptoJS.enc.Utf8.parse(ivStr);
      var decrypted = CryptoJS.AES.decrypt(data, key, {iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Iso10126});
      return decrypted.toString(CryptoJS.enc.Utf8);
    };
    var code = aesEncrypt(newuuid, aesKey, aesKey);   
    return code;
}
function httpReqGen(apibranch,reqData){
    var code = getReqNo();
    var url = 'http://139.196.13.82/xinlai' + apibranch + '?req_no=' + code;
    return req = {
      headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Accept': '*/*'
                  },
      method: 'POST',
      url: url,
      data: reqData
    };  
}
function httpReqGETGen(apibranch){
    var code = getReqNo();
    var url = 'http://139.196.13.82/xinlai' + apibranch + '?req_no=' + code;
    return req = {
      headers: {
                  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                  'Accept': '*/*'
               },       
      method: 'GET',
      url: url
    };  
}
function httpTESTGen(url,head){
    return req = {
      headers: head,     
      method: 'GET',
      url: url
    };  
}


function circleCss() {
    var cWidth = parseFloat($('.cn-wrapper li a').css('width').split('p')[0]);
    var rate = cWidth / 366;

    var ss = [-70, 14, 40];
    var m1 = [-140, 152, 179];
    var m2 = [-100, 55, 80];
    var m3 = [0, 15, 45];
    var m4 = [100, 57, 83];
    var m5 = [146, 154, 181];
    var m6 = [97, 254, 282];
    var m7 = [0, 293, 323];
    var m8 = [-101, 257, 285];
    var mm = [m1,m2,m3,m4,m5,m6,m7,m8]

    ss[0] = Math.floor(ss[0] * rate) + "px";
    ss[1] = Math.ceil(ss[1] * rate) + "px";
    ss[2] = Math.ceil(ss[2] * rate) + "px";
    for (var i = 0; i < mm.length; i++) {
        for (var j = 0; j < m1.length; j++) {
            mm[i][j] = Math.floor(mm[i][j] * rate) + "px";
        }
    }


    var eicon = $('.cn-wrapper li a i');
    for (var i = 0; i < eicon.length; i++) {
        eicon.eq(i).css("left", mm[i][0]);
        eicon.eq(i).css("top", mm[i][1]);
        eicon.eq(i).css("font-size", ss[2]);
    }
    var espan = $('.cn-wrapper li a span');
    for (var i = 0; i < espan.length; i++) {
        espan.eq(i).css("left", mm[i][0]);
        espan.eq(i).css("top", mm[i][2]);
        espan.eq(i).css("margin-top", ss[0]);
        espan.eq(i).css("font-size", ss[1]);
    }

}

function resResult(data) {
    if (data.result.code == "0000")
        return data.result.data;
    else
        return false;
}
function startLoading($ionicLoading) {
    $ionicLoading.show({
        templateUrl: "templates/loading.html",
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });
}
function startModal($ionicLoading) {
    $ionicLoading.show({
        templateUrl: "templates/modal.html",
        content: '为了您的只能居家，我们正在拼命研发中，敬请期待 !',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });
}

//首页报警颜色显示
function alarmCoreJudge(alarmdata) {
    //门磁
    if (alarmdata.xxxxxx) {
        $('#megnetCore').css("color", "#d43838");
    }
    else
        $('#megnetCore').css("color", "#57a595");

    //红外
    if (alarmdata.xxxxxx) {
        $('#infraCore').css("color", "#d43838");
    }
    else
        $('#infraCore').css("color", "#57a595");

    //水浸
    if (alarmdata.xxxxxx) {
        $('#waterCore').css("color", "#d43838");
    }
    else
        $('#waterCore').css("color", "#57a595");

    //燃气
    if (alarmdata.xxxxxx) {
        $('#gasCore').css("color", "#d43838");
    }
    else
        $('#gasCore').css("color", "#57a595");

    //烟雾
    if (alarmdata.xxxxxx) {
        $('#smokeCore').css("color", "#d43838");
    }
    else
        $('#smokeCore').css("color", "#57a595");
}

//首页报警概要
function alarmDescGen(alarmdata) {
    //生成desc规则 
    var desc = alarmdata;
    $scope.AlarmsViewModel.desc = desc;

    //alarm概述字体颜色
    if (alarmdata.xxx) {
        $('#alarmDesc').css("color", "#d43838");
    }
    else {
        $('#alarmDesc').css("color", "#57a595");
    }
}