/**
 * axiecc@gmail.com create by xiethan on 19.12.17
 *  $.fn.msg(str|object, [object]) 
 * 概述： 方法可以调用网页一个提示框, 依赖于jquery
 * 参数：str: 提示框显示的文字，样式等设置为默认值
 *      object：一个设置集合对象：如：{ text: '我是测试object', type: 'info', position: 'top-center' }
 *      str,[object]:str为调用库的哪个(msg|removemsg)方法，object:与上一致
 *  附：可以设置的object的值：
    *    {
        inEffect: {opacity: 'show'}, // 实现方式
        inEffectDuration: 200,               // 出现过渡时间
        stayTime: 1000,  //信息停留时间
        leaveTime: 600, // 信息离开动画时间
        text: '',   // 提示内容
        sticky: false, // 内容是否常驻界面
        type: 'info', //类型：notice, warning, danger, success,info
        position: 'top-center', //// top-left, top-center, top-right, middle-left, middle-center, middle-right 
        close: false, // 是否开启开关功能
        closeText: '✖', //关闭的文字
        closeFunction: null, // 是否开启开关功能
      }
 * 示例：
 *  最简单调用方式： $.fn.msg('我是测试str')  
    次简单调用方式,不自动消失，并有关闭按钮：$.fn.msg({ text: '我是测试object', type: 'info', position: 'top-center',close: true,sticky:true })
    info一般消息 $.fn.msg('msg', { text: '一般消息', type: 'info', position: 'top-center' })  
    notice通知消息 $.fn.msg('msg', { text: '通知消息', type: 'notice', position: 'top-center' })  
    success成功消息 $.fn.msg('msg', { text: '成功消息', type: 'success', position: 'top-center' })  
    warning警告消息 $.fn.msg('msg', { text: '警告消息', type: 'warning', position: 'top-center' })  
    danger危险消息 $.fn.msg('msg', { text: '危险消息', type: 'danger', position: 'top-center' })  

 */
;(function($){
  var defaults = {
    inEffect: {opacity: 'show'}, // 实现方式
    inEffectDuration: 200,               // 出现过渡时间
    stayTime: 1000,  //信息停留时间
    leaveTime: 600, // 信息离开动画时间
    text: '',   // 提示内容
    sticky: false, // 内容是否常驻界面
    type: 'info', //类型：notice, warning, danger, success,info
    position: 'top-center', //// top-left, top-center, top-right, middle-left, middle-center, middle-right 
    close: false, // 是否开启开关功能
    closeText: '✖', //关闭的文字
    closeFunction: null, // 是否开启开关功能
  }

  var methods = {
    init: function(options){
      // if(options) {
      //   $.extend({}, settings, options||{})
      // }
    },
    msg: function(options) {
      var settings = {};
      // 合并配置
      // console.log(options)
      settings = $.extend({}, defaults, options || {})
      // 声明变量 declare variables <div class="popup-content"></div>
      // ✘ ✖ ✔ ❗ ¡ ¡ ☞ ¡㊀
      switch (settings.type) {
        case 'notice':
            settings.text ='ⓘ' + settings.text;
            break;
        case 'info':
            settings.text ='ⓘ' + settings.text;
          break;
        case 'success':
            settings.text ='✔' + settings.text;
          break;
        case 'warning':
            settings.text ='！' + settings.text;
          break;
        case 'danger':
            settings.text ='✘' + settings.text;
          break;
      }
      var msgWrapAll, msgItemOuter, msgItemInner;// msgItemClose, msgItemImage;
      msgWrapAll = (!$('.msg-container').length) ? $('<div><div>').addClass('msg-container').addClass('msg-position-'+settings.position).appendTo('body') : $('.msg-container');
      msgItemOuter = $('<div><div>').addClass('msg-item-wrapper');
      if(settings.close){ //  || settings.sticky
        msgItemInner = $('<div></div>').hide().addClass('msg-item msg-type-' + settings.type).appendTo(msgWrapAll).html($('<span>').append(settings.text)).animate(settings.inEffect, settings.inEffectDuration).wrap(msgItemOuter);
        msgItemClose = $('<span class="close"><b></b></span>').hide().prependTo(msgItemInner).html(settings.closeText).click(function(){$().msg('removemsg', msgItemInner, settings)}).show();
        // msgItemImage =  $('<div></div>').addClass('msg-item-image').addClass('msg-item-image-'+settings.type).prependTo(msgItemInner);
      }else{
        msgItemInner = $('<div></div>').hide().addClass('msg-item msg-type-' + settings.type).appendTo(msgWrapAll).html($('<p>').append(settings.text)).animate(settings.inEffect, settings.inEffectDuration).wrap(msgItemOuter);
      }

      // 兼容处理
      if(navigator.userAgent.match(/MSIE 6/i))
			{
        msgWrapAll.css({top: document.documentElement.scrollTop});
      }
      // 消失处理
      if(!settings.sticky){
        setTimeout(function(){
          $().msg('removemsg', msgItemInner, settings)
        }, settings.stayTime);
      }

      return msgItemInner;

    },
    removemsg: function(obj, settings){
      // console.log(settings);
      //  return;
      obj.animate({opacity: '0'}, settings.leaveTime || 600, function(){
        obj.parent().animate({height: '0px'},300, function(){
          obj.parent().remove();
        })
      })
      //callback
      if(settings && settings.closeFunction == "function"){
        settings.closeFunction(); 
      }
    },
  };

  $.fn.msg = function(method) {
    // 简洁调用 method calling logic
    if(arguments.length == 1){
      // 只传一个变量时，
      if(typeof(arguments[0]) == "string"){
        // 提示信息strings, eg: $.fn.msg('我是测试str')
        $.fn.msg('msg',  { text: method, type: 'info', position: 'top-center' })
      }else{
        $.fn.msg('msg', method)
      }
    }else if(methods[method]){
          // eg: $.fn.msg('msg',  { text: '我是测试object', type: 'info', position: 'top-center' })
          return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    }else {
      throw new Error('Method ' + method + ' does not exist:@15161')
    }
  }

})(jQuery);

