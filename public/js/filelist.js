"use strict";
var MyFile = MyFile || {
  list: {}
};

MyFile.list = (function() {
    var content = null;
    var updateContent = function(data) {
        var ul = document.querySelector('#filelist');
        if (content) {
            ul.removeChild(content);
        }
        var embed = document.createElement('embed');
        embed.setAttribute('type', data.type);
        embed.setAttribute('src', data.uri+'?'+(new Date().getTime()));
        embed.setAttribute('width', '100%');
        embed.setAttribute('height', '800');
        var fragment = document.createDocumentFragment();
        fragment.appendChild(embed);
        ul.appendChild(fragment);
        content = embed;
    }

    return {
        updateContent: updateContent
    };
}());
