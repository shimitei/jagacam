var MyImg = MyImg || {
  list: {}
};

MyImg.list = (function() {
    var map = {};
    var getImg = function (id) {
        if (!map.hasOwnProperty(id)) {
            var ul = document.querySelector('#imglist');
            var fragment = document.createDocumentFragment();
            var li = document.createElement('li');
            var img = document.createElement('img');
            img.setAttribute('id', id);
            map[id] = 1;
            li.appendChild(img);
            fragment.appendChild(li);
            ul.appendChild(fragment);
        }
        return document.getElementById(id);
    }

    var updateImage = function(id, dataURL) {
        getImg(id).setAttribute('src', dataURL);
    }

    var removeImage = function(id) {
        if (map.hasOwnProperty(id)) {
            delete map[id];
            var img = document.getElementById(id);
            var ul = document.querySelector('#imglist');
            var li = img.parentNode;
            ul.removeChild(li);
        }
    }

    return {
        updateImage: updateImage,
        removeImage: removeImage
    };
}());
