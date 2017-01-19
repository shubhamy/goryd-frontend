app.filter('rainbow', function() {
    return function(input) {
        input += 1;
        if (input % 10 == 1) {
            return "bg-aqua";
        } else if (input % 10 == 2) {
            return "bg-orange";
        } else if (input % 10 == 3) {
            return "bg-yellow";
        } else if (input % 10 == 4) {
            return "bg-blue";
        } else if (input % 10 == 5) {
            return "bg-green";
        } else if (input % 10 == 6) {
            return "bg-purple";
        } else if (input % 10 == 7) {
            return "bg-red";
        } else if (input % 10 == 8) {
            return "bg-black";
        } else if (input % 10 == 9) {
            return "bg-olive";
        } else {
            return "bg-fuchsia";
        }
    };
});

app.filter('mediaAsset', function($helpgoryd) {
    return function(input, mode) {
        if (typeof input == 'undefined' || input === null) {
            return '/images/ic_account_circle_white_24px.svg';
        }
        if (input.indexOf('http') == -1) {
            input = URL_PREFIX + input;
        }
        if (mode == 'thumbnail') {
            var toReturn = $helpgoryd.convertThumbnail(input);
            if (toReturn == 'Invalid' || input === null || typeof input == 'undefined') {
                return '/images/ic_account_circle_white_24px.svg';
                // return '/images/audi-car-clouds-23943.jpg';
            }
            return $helpgoryd.convertThumbnail(URL_PREFIX + input);
        } else {
            return input;
        }
    };
});
app.filter('mediaAssetID', function($helpgoryd) {
    return function(input, mode) {
        if (typeof input == 'undefined' || input === null) {
            return '/images/ic_account_circle_black_24px.svg';
        }
        if (input.indexOf('http') == -1) {
            input = URL_PREFIX + input;
        }
        if (mode == 'thumbnail') {
            var toReturn = $helpgoryd.convertThumbnail(input);
            if (toReturn == 'Invalid' || input === null || typeof input == 'undefined') {
                return '/images/ic_account_circle_black_24px.svg';
                // return '/images/audi-car-clouds-23943.jpg';
            }
            return $helpgoryd.convertThumbnail(URL_PREFIX + input);
        } else {
            return input;
        }
    };
});

app.filter('mediaAssetcar', function($helpgoryd) {
    return function(input, mode) {
        if (typeof input == 'undefined' || input === null) {
          return '/images/car.svg';
        }
        if (input.indexOf('http') == -1) {
            input = URL_PREFIX + input;
        }
        if (mode == 'thumbnail') {
            var toReturn = $helpgoryd.convertThumbnail(input);
            if (toReturn == 'Invalid' || input === null || typeof input == 'undefined') {
                return '/images/car.svg';
            }
            return $helpgoryd.convertThumbnail(URL_PREFIX + input);
        } else {
            return input;
        }
    };
});
