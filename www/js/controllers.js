angular.module('starter.controllers', ['WifiServices'])

////////////////////////////////////////////////////////////////////////////////////////////////////////
//数据
.controller('MainCtrl', function($scope, $ionicSideMenuDelegate, $ionicPopover, $state, $timeout) {

  $scope.global = { cust_id : 0 };
  $scope.user = { Id: 1, Name: 'Admin', Email: 'admin@test.domain', Phone: '13609876543', Tel: '02129807893', 
                  EmergMan1: 'AdminEmerg1', EmergMan1Phone: '13609876542',EmergMan2: 'AdminEmerg2', 
                  EmergMan2Phone: '13609876541', address: '浦东新区耀华路120弄121号102' };

  $scope.version = {"Platform":"","UpdateTime":"","DownloadAddr":"","CurrentVersion_no":"","LastestVersion_no":"","UpdateContent":"","IsUpdate":""};

  $scope.subUsers = [{Id:1,Name:'子账号1'}];

  $scope.users = [
		{ username: 'Admin', email: 'admin@test.domain', location: true, id: 'admin', avatar: 'img/men.jpg', enabled: 'true', lastLogin: 'Online' },
		{ username: 'Stacy S', email: 'stacy@test.domain', location: true, id: 'stacy', avatar: 'img/girl.jpg', enabled: 'true', lastLogin: 'Last login: 01/09/2014' },
		{ username: 'Mom', email: 'mom@test.domain', location: false, id: 'mom', avatar: 'img/noavatar.png', enabled: 'false', lastLogin: 'Last login: never' },
	];
	$scope.CurrentDeviceViewModel = { id: 0, name: 'No Device', icon: 'ion-ios7-help-empty', status: 'Offline'};
	$scope.UsingDeviceViewModel = { device: null };
	$scope.UsingNodesViewModel = {
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
  $scope.nodeViewModel = {
    node:""
   };

  $scope.OverViewViewModel = {
    OverStatus:"normal",
    JustLogin:false
  };

  $scope.ArmViewModel = { checked: true };
  $scope.DevicesViewModel = {
    devices:null
  };  
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
  $scope.Temp = {
      EditingDevice:null
  };
  $scope.UserViewModel = { user: null };
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
.controller('WifiController', ['$scope', 'WifiService', function($scope, WifiService){
    $scope.wifiList = [];

    window.setTimeout(function(){
        $scope.wifiList = WifiService.list();
        $scope.$apply();
    }, 5000);

    $scope.getList = function(){
        $scope.wifiList = WifiService.list();
    }

    $scope.connectWifi = function(name){
        WifiService.connectionToWifi(name);
    }
}])


//首页 app.overview overview.html
.controller('OverViewCtrl', function ($q, $scope, $ionicSideMenuDelegate, $ionicPopup, $ionicPopover, $state, $timeout, $http, $ionicLoading, locals) {
    $scope.DataReq = function () {
    $ionicLoading.show({
      templateUrl:"templates/loading.html",
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });
    console.log(locals.get("cust_id",""));
    if (!locals.get("cust_id",""))
      $state.go("app.login"); 


    //主机、节点信息 xw接口
    //var url = 'http://t.xinlaihome.cn:8001/api/app/1.0/account/' + accountId + '/device';
    //var head = {
    //                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    //                'Accept': '*/*'
    //           };
        //var wreq = httpTESTGen(url,head);           

        //7-21改为dc接口
        //首次登录overview是加载默认主机，之后使用UsingDevice仅加载节点信息
    if ($scope.OverViewViewModel.JustLogin) {
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
            if (resdata[0].status == 0) {
                $scope.UsingDeviceViewModel.device.status = false;
                $scope.UsingDeviceViewModel.device.titleText = "撤防";
                $scope.UsingDeviceViewModel.device.icon = "ion-unlocked";
            }
            else {
                $scope.UsingDeviceViewModel.device.status = true;
                $scope.UsingDeviceViewModel.device.titleText = "布防";
                $scope.UsingDeviceViewModel.device.icon = "ion-locked";
            }

            if (resdata[0].alertStatus == 1) {
                $scope.UsingDeviceViewModel.device.deviceStatus = "您当前的主机正在报警";
            }
            else {
                $scope.UsingDeviceViewModel.device.deviceStatus = "您当前的主机正常连接";
            }

            //主机信息返回后请求节点信息
            var nodelisturl = '/node/list';
            var dvcid = $scope.UsingDeviceViewModel.device.device_id;
            var nodelistreqd = { "cust_id": $scope.global.cust_id, "device_id": dvcid };
            var nodelistreq = httpReqGen(nodelisturl, nodelistreqd);

            $http(nodelistreq).success(function (data) {
                var nodesdata = resResult(data);
                $scope.NodesViewModel.nodes = nodesdata;
                $scope.UsingNodesViewModel.nodes = nodesdata;
            }).error(function () { });


        }).error(function () { });
        $scope.OverViewViewModel.JustLogin = false;
    }
    else {
        //主机信息返回后请求节点信息
        var nodelisturl = '/node/list';
        var dvcid = $scope.UsingDeviceViewModel.device.device_id;
        var nodelistreqd = { "cust_id": $scope.global.cust_id, "device_id": dvcid };
        var nodelistreq = httpReqGen(nodelisturl, nodelistreqd);

        $http(nodelistreq).success(function (data) {
            var nodesdata = resResult(data);
            $scope.NodesViewModel.nodes = nodesdata;
            $scope.UsingNodesViewModel.nodes = nodesdata;
        }).error(function () { });
    }

    
    $timeout(function () {
        $ionicLoading.hide();
    }, 500);


        //九宫格css
       //circleCss();
       //DataReq end
  }
    //toggle用
    $scope.armStatusChange = function () {
        $scope.UsingDeviceViewModel.device.titleText = $scope.UsingDeviceViewModel.device.status ? "布防" : "撤防";
        $scope.UsingDeviceViewModel.device.icon = $scope.UsingDeviceViewModel.device.status ? "ion-locked" : "ion-unlocked";
    };
    //button用
    $scope.armStatusBtnChange = function () {
        if ($scope.UsingDeviceViewModel.device.status)
            $scope.UsingDeviceViewModel.device.status = false;
        else
            $scope.UsingDeviceViewModel.device.status = true;
        $scope.UsingDeviceViewModel.device.titleText = $scope.UsingDeviceViewModel.device.status ? "布防" : "撤防";
        $scope.UsingDeviceViewModel.device.icon = $scope.UsingDeviceViewModel.device.status ? "ion-locked" : "ion-unlocked";
    };

  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
  $scope.nodeTypeTap = function(route, detType) {
      //$scope.UsingNodesViewModel.nodes = nodes;
      $scope.UsingNodesViewModel.nodeType = detType;
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
//添加设备 app.addNode add-node.html
.controller('addNode', function($scope, $state, locals) {
  if (!locals.get("cust_id",""))
    $state.go("app.login"); 

  $scope.nodes = [
    { nodename: 'Door Magnet', email: 'admin@test.domain', location: true, id: 'admin', avatar: 'img/men.jpg', enabled: 'true', lastLogin: 'Online',nodetype:'doormagnet' },
    { nodename: 'Infra Sensor', email: 'stacy@test.domain', location: true, id: 'stacy', avatar: 'img/girl.jpg', enabled: 'true', lastLogin: 'Online',nodetype:'infrasensor' },
    { nodename: 'Smoke Sensor', email: 'mom@test.domain', location: true, id: 'mom', avatar: 'img/men.png', enabled: 'true', lastLogin: 'Online' ,nodetype:'smokesensor'},
    { nodename: 'Gas Sensor', email: 'mom@test.domain', location: true, id: 'mom', avatar: 'img/men.png', enabled: 'true', lastLogin: 'Online' ,nodetype:'gassensor'},
    { nodename: 'E-Key', email: 'mom@test.domain', location: true, id: 'mom', avatar: 'img/men.png', enabled: 'true', lastLogin: 'Online' ,nodetype:'ekey'},
    { nodename: 'Camera', email: 'mom@test.domain', location: true, id: 'mom', avatar: 'img/men.png', enabled: 'false', lastLogin: 'Online' ,nodetype:'camera'},
  ]; 
  $scope.devices = [
    { devicename: 'Device1', id: 'dv1'},
    { devicename: 'Device2', id: 'dv2'},
    { devicename: 'Device3', id: 'dv3'},
  ];      
  $scope.setFormScope = function(scope){
    this.formScope = scope;
  }
  $scope.newnode = {};
  $scope.nodeSubmit = function() {
    alert("尚未提供添加节点接口");
  };
})
////////////////////////////////////////////////////////////////////////////////////////////////////////
///
////////////////////////////////////////////////////////////////////////////////////////////////////////
//用户 app.usersetting usersetting.html
.controller('usersetting', function($scope, $state, locals) {
  if (!locals.get("cust_id",""))
    $state.go("app.login"); 

  $scope.logout = function() {
    alert(locals.get("cust_id",""));
    //存储数据
    locals.set("username",'');
    locals.set("cust_id", '');
    console.log('cust_id: ' + locals.get("cust_id",""));
    $state.go('app.login');
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

  $scope.init = function(){

    var apibranch = '/app/upgrade';
    var platform = "Android";
    var version = "2.0.0";
    var reqd = {"platform":platform,"app_version":version};
    reqd = JSON.stringify(reqd);
    var req = httpReqGen(apibranch,reqd);

    var deferred = $q.defer();
    $http(req).then(function(response) {
      var resData = "";
      if(response.status == 200){
        var resData = $.parseJSON(response.data.result);
        if(resData.code != "0000"){
          alert("数据接口有误: " + resData.code);
          //return;
        }
        var objectData = resData.data;

        $scope.newver = $scope.version;
        $scope.newver.Platform = objectData.platform;
        $scope.newver.UpdateTime = objectData.public_time;
        $scope.newver.DownloadAddr = objectData.down_addr;
        $scope.newver.CurrentVersion_no = version;
        $scope.newver.LastestVersion_no = objectData.version_no;
        $scope.newver.UpdateContent = objectData.update_content;
        $scope.newver.IsUpdate = objectData.is_update;       
        $scope.version = $scope.newver;
      }
        deferred.resolve();
    }, function(error) {
        deferred.reject();
    }); 
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
.controller('settings', function($scope, $state, locals) {
  if (!locals.get("cust_id",""))
    $state.go("app.login"); 

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
.controller('AlarmCtrl', function($scope,$state) {
    $scope.init = function(){
    alert("报警接口尚未提供");
  }
})
/////////////////////////////////////////////////
///
/////////////////////////////////////////////////
//主板电池信息 app.battery battery.html
.controller('BatteryCtrl', function($scope,$state) {
    $scope.init = function(){
    alert("主机电池信息接口尚未提供");
    }
})
/////////////////////////////////////////////////
///
///
/////////////////////////////////////////////////
//操作栈 app.manustack manustack.html
.controller('ManuStackCtrl', function($scope,$state) {
    $scope.init = function(){
    alert("操作记录接口尚未提供");
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
.controller('register', function($q, $scope, $ionicSideMenuDelegate, $ionicPopover, $state, $timeout, $http, locals) {

  $scope.setFormScope = function(scope){
    this.formScope = scope;
  }
  $scope.registerData = {};

  $scope.submit = function(scope) {
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
      console.log(response);
      var result = $.parseJSON(response.data.result);
      if (result.code == 0000){
        $scope.global.cust_id = result.data.cust_id;
        console.log(result.data.cust_id);
        $state.go('app.userinfo');
      } else {
        alert(result.msg);
      }
    }, function(error) {
    });
  }
  $scope.pageJump = function (route) {
      $state.go(route);
  };
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

//登录
.controller('login', function($scope, $ionicSlideBoxDelegate, $timeout, $ionicLoading, $ionicPopup, $http, $state, locals) {
  $scope.loginData = {};
  $scope.login = function() {
    if(!$scope.loginData.username) {
      alert('请输入用户名。');
      return;
    }
    if(!$scope.loginData.password) {
      alert('请输入密码。');
      return;
    }
    var requestData = {
      phone: $scope.loginData.username,
      login_pwd: hex_md5($scope.loginData.password).toLocaleUpperCase(),
    };

  var apibranch = '/account/login';
  var request = httpReqGen(apibranch,requestData);

  $http(request).then(function(response) {
      console.log(response);
      var result = response.data.result;
      if (result.code == 0000){
        $scope.global.cust_id = result.data.cust_id;

        //存储数据
        locals.set("username",requestData.phone);
        locals.set("cust_id", result.data.cust_id);
        //读取数据
        console.log(locals.get("username",""));
        console.log(locals.get("cust_id",""));
        $scope.OverViewViewModel.JustLogin = true;
        $state.go('app.overview');
      } else {
        alert(result.msg);
      }
    }, function(error) {
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

