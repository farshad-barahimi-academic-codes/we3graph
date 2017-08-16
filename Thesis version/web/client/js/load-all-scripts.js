/**
 * Reloads all scripts and then starts after all scripts are loaded
 */

$.when(
    $.getScript('js/globals/enums.js'),
    $.getScript('js/globals/colors.js'),
    $.getScript('libraries/helvetiker_font/helvetiker_regular.typeface.js'),
    $.getScript('js/interface/message-box.js'),
    $.getScript('js/web-service/service-response.js'),
    $.getScript('js/web-service/command.js'),
    $.getScript('js/web-service/web-service.js'),
    $.getScript('js/data-structure/id-hash-dictionary.js'),
    $.getScript('js/model/graph.js'),
    $.getScript('js/model/vertex.js'),
    $.getScript('js/model/edge.js'),
    $.getScript('js/model/bend.js'),
    $.getScript('js/model/edge-line.js'),
    $.getScript('js/interface/property-description.js'),
    $.getScript('js/interface/border-button.js'),
    $.getScript('js/interface/accordion-manager.js'),
    $.getScript('js/interface/border-manager.js'),
    $.getScript('js/interface/action-manager.js'),
    $.getScript('js/interface/keyboard-manager.js'),
    $.getScript('js/interface/mouse-manager.js'),
    $.getScript('js/interface/touch-manager.js'),
    $.getScript('js/interface/start-panel-manager.js'),
    $.getScript('js/interface/admin-panel-manager.js'),
    $.getScript('js/interface/interface-manager.js'),
    $.getScript('js/globals/singletons.js'),
    $.getScript('js/render/render-manager.js'),
    $.getScript('js/render/engines/default-engine.js'),
    $.getScript('js/globals/config.js'),
    $.getScript('js/start.js')
).done(function ()
    {
        //All scripts except render engines are loaded
        $.when(
            $.getScript('js/render/engines/all-js-files.php')
        ).done(function ()
            {
                Start();
            });
    });