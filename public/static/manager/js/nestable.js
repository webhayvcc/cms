Crazy.nestable = {
    add : function(selector){
        let $dd = $(selector);
        let options = {
            group:1,
            callback: function(l,e){
                if($(l).data('callback')){
                    Crazy.func.call($(l).data('callback'),[l,e]);
                }
            }
        };
        if($dd.data('max-depth')){
            options.maxDepth = Number($dd.data('max-depth'));
        }

        $dd.nestable(options)//.on('change', updateOutput);
    },
    remove:function(selector){
        $(selector).nestable('destroy');
    }
}
$(function(){
    if(typeof nestable_selectors != 'undefined'){
        
        if(Crazy.getType(nestable_selectors) == 'array'){
            for(var i = 0; i < nestable_selectors.length; i++){
                Crazy.nestable.add(nestable_selectors[i]);
            }
        }
    }
});