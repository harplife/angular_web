(function(){
  $(document).ready(function() {
      $('body').on('click', '.button--watch_video', function(){
          $('.section--workspace_one_desc2').addClass('video_on');
      });

      $('body').on('click', '.button--close_video', function(){
          $('.section--workspace_one_desc2').removeClass('video_on');
      });
      var isPcViewPort;

      var setPcMobileGnbSync = function(){
          $('.item--gnb').each(function(i,el){
              if( $(el).hasClass('item--gnb_on') ){
                  $(el).addClass('item--gnb_on__mobile');
              }
          });
      };

      var getIsPcViewPort = function(){
          var winWidth = $(window).width();
          return winWidth >= 1350;
      };

      setPcMobileGnbSync();
      isPcViewPort = getIsPcViewPort();

//         var mainSlider = new Swiper ('.swiper-container',{
//             autoplay: true,
//             keyboard: {
//                 enabled: true,
//                 onlyInViewport: false,
//             },
//         });

//         $('#lightSlider').lightSlider({
//             gallery:true,
//             item:1,
//             auto:true,
//             loop:true,
//             slideMargin:0,
//             enableDrag: true,
//             thumbWidth:80,
//             animateThumb:false,
//             thumbHeight:'80px',
//             currentPagerPosition:'middle'
//         });

      $('#section--module_header .link--gnb').on('click', function(e){
          if(!isPcViewPort) return;

          var target = $(e.currentTarget);
          if(target.data('link') !== 'link'){
              e.preventDefault();
              $('#section--module_header').toggleClass('section--module_header__on');
          }
      });

      $('.section--custom_select_box').on('click', function(e){
          var target = $(e.currentTarget);
          $('.section--custom_select_box').not(target).removeClass('section--custom_select_box__on');
          target.toggleClass('section--custom_select_box__on');
      });

      $('.button--toggle_gnb').on('click', function(e){
          $('.section--header_content').addClass('on');
      });

      $('.button--close_mobile_gnb, .dimmed').on('click', function(e){
          $('.section--header_content').removeClass('on');
      });

      $('.link--gnb').on('click', function(e){
          if(isPcViewPort) return;

          e.preventDefault();
          var target = $(e.currentTarget);
          var targetList = target.parent('.item--gnb');

          if(!targetList.hasClass('item--gnb_on__mobile')){
              targetList.addClass('item--gnb_on__mobile');
              target.next().stop().slideDown();
          }else{
              targetList.removeClass('item--gnb_on__mobile');
              target.next().stop().slideUp();
          }
      });

      /*$('.button--search_keyword').on('click', function(e){
          if(isPcViewPort) return;

          var searchContainer = $('.section--search');
          var searchForm = $('.input--search_keyword');
          var isOpen = searchContainer.hasClass('on');
          var searchKeyword = searchForm.val();

          if( isOpen && searchKeyword ){
              $('.button--search_keyword').submit();
              return;
          }

          if( isOpen ){
              searchContainer.removeClass('on');
              searchForm.blur();
          } else {
              searchContainer.addClass('on');
              searchForm.focus();
          }
      });
*/
      $('.button--send_mail').on('click', function(){
          $('.section--mail_form').addClass('send');
      })

      $('.button--send_mail_ok').on('click', function(){
          $('.section--mail_form').removeClass('send');
      })


      var getCompareBox = function(items){
          var compareBox = [];
          var compareBoxSize = Math.ceil(items.length / 2);

          for(var i=0, len=compareBoxSize; i<len; i++){
              compareBox.push([]);
          }

          return compareBox;
      };

      var getEachItemsInfo = function(items){
          var compareBox = getCompareBox(items);
          var rowCount = 0;

          for(var i=0, len=items.length; i<len; i++){
              if(rowCount + 1 > (i/2)){
                  compareBox[rowCount].push(items.eq(i).outerHeight());
              } else if(rowCount + 1 == (i/2)) {
                  rowCount += 1;
                  compareBox[rowCount].push(items.eq(i).outerHeight());
              }
          }

          return compareBox;
      };

      var getEachRowItemValue = function(compareBox){
          var maxHeight;

          for(var i=0, len=compareBox.length; i<len; i++){
              var row = compareBox[i],
                  columnOne = row[0],
                  columnTwo = row[1];

              if(!columnTwo){
                  compareBox[i][0] = columnOne;
              } else {
                  maxHeight = columnOne >= columnTwo ? columnOne : columnTwo;
                  compareBox[i][0] = maxHeight;
                  compareBox[i][1] = maxHeight;
              }
          }

          return compareBox;
      };

      var setEachRowStyle = function(eachRowItemValue, elList){
          var totalItemsStyleValueList = eachRowItemValue.join(',').split(',');

          for(var i=0, len=totalItemsStyleValueList.length; i<len; i++){
              elList.eq(i).height(totalItemsStyleValueList[i]);
          }
      };

      var targetItemList = $('.section--events_list .item--event');
      var isSetStyle = false;
      var setListStyle = function(){
          var isPc = getIsPcViewPort();

          if(isPc){
              if(!isSetStyle){
                  setEachRowStyle(getEachRowItemValue(getEachItemsInfo (targetItemList)), targetItemList);
                  isSetStyle = true;
              }
          }else{
              isSetStyle = false;
              targetItemList.height('auto');
          }
      };

      setListStyle();
      $(window).on('resize', function(){
          setListStyle();
          isPcViewPort = getIsPcViewPort();

          if(!isPcViewPort){
              setPcMobileGnbSync();
          }
      });
  });
})();
