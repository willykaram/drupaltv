Drupal.settings.absolute_messages = Drupal.settings.absolute_messages || {};

(function ($) {

  $(document).ready(function(){

    // Move messages from closure to right after opening of body tag.
    $("body").prepend($("#absolute-messages-messages"));

    // Make sure that we do not display more message lines than maximum
    // number of message lines defined in module settings (if defined).
    if (Drupal.settings.absolute_messages.max_lines) {
      // Fetch current height of single message line defined in CSS.
      var line_height = parseInt($(".absolute-messages-message .content").css("line-height"));
      var current_height;
      // display-none elements do not have height, so we need to display
      // them first  (although hidden) to be able to get their height.
      // Also, force-set height to avoid "jumpy" animation.
      $(".absolute-messages-message").css({'visibility':'hidden', 'display':'block'})
                                     .css("height", $(this).height());
      $.each($(".absolute-messages-message .content"), function(){
        current_height = $(this).height();
        // Update max-height property for each line if needed.
        if (current_height > line_height * Drupal.settings.absolute_messages.max_lines) {
          $(this).css("max-height", line_height * Drupal.settings.absolute_messages.max_lines)
                 .addClass("collapsed")
                 .parents(".absolute-messages-message")
                 .addClass("collapsible")
                 .attr("title", "Click to see the whole message");
        }
      });
      // And hide them again so we still can manage them using jQuery sliding.
      $(".absolute-messages-message").removeAttr('style');
    }

    // Show all messages.
    $(".absolute-messages-message").slideDown(600);

    // Dismiss single message.
    $("a.absolute-messages-dismiss").click(function(){
      $(this).parents(".absolute-messages-message").slideUp(300);
      // Make sure that "Dismiss all" icon is removed too
      // when last message is being dismissed.
      if ($(".absolute-messages-message:visible").size() <= 2) {
        setTimeout(function(){
          $("div.absolute-messages-dismiss-all").hide();
        }, 300);
      }
    });

    // Dismiss all messages.
    $("a.absolute-messages-dismiss-all").click(function(){
      $(".absolute-messages-message").slideUp(300);
    });

    // Automatic dismiss messages after specified time.
    var timeOuts = new Array();
    $.each(Drupal.settings.absolute_messages.dismiss, function(index, value){
      if (value == 1) {
        timeOuts[index] = setTimeout(function(){
          $(".absolute-messages-"+index).slideUp("slow");
        }, Drupal.settings.absolute_messages.dismiss_time[index] * 1000);
      }
    });

    // Clear all timeouts on mouseover and set them again on mouseout.
    $(".absolute-messages-message").hover(function(){
      $.each(Drupal.settings.absolute_messages.dismiss, function(index, value){
        clearTimeout(timeOuts[index]);
      });
    }, function(){
      $.each(Drupal.settings.absolute_messages.dismiss, function(index, value){
        timeOuts[index] = setTimeout(function(){
          $(".absolute-messages-"+index).slideUp("slow");
        }, Drupal.settings.absolute_messages.dismiss_time[index] * 1000);
      });
    });

    // Expand/collapse long messages.
    $(".absolute-messages-message.collapsible").click(function(){
      if ($(this).find(".content").hasClass("collapsed")) {
        $(this).find(".content")
               .css("max-height", "")
               .removeClass("collapsed")
               .addClass("expanded");
      } else {
        $(this).find(".content")
               .css("max-height", line_height * Drupal.settings.absolute_messages.max_lines)
               .removeClass("expanded")
               .addClass("collapsed");
      }
    });

  });

})(jQuery);
