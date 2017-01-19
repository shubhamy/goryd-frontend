app.factory('$helpgoryd', function() {
    var data = [1, 2, 3, 4];
    return {
        getData: function(i) {
            return data[i];
        },
        range: function(start, end) {
            a = [];
            if (start > end) {
                return "Error";
            }
            for (var i = start; i < end; i++) {
                a[i - start] = i;
            }
            return a;
        },
        convertThumbnail: function(imagename) {
            type = imagename.split('.')[imagename.split('.').length - 1];
            extentions = ['png', 'jpg', 'jpeg', 'svg'];
            flag = extentions.indexOf(type);
            if (flag > -1) {
                return imagename.replace('.' + type, '_thumbnail.' + type);
            } else {
                return "Invalid";
            }
        },
    };
});

app.service('editList', function () {
        var property = '1';
        return {
            getProperty: function () {
                return property;
            },
            setProperty: function(value) {
                property = value;
            }
        };
    });

app.service('calenderShare', function () {
        var property = '1';
        return {
            getProperty: function () {
                return property;
            },
            setProperty: function(value) {
                property = value;
            }
        };
    });
app.service('ListingComplete', function () {
        var property = '';
        return {
            getProperty: function () {
                return property;
            },
            setProperty: function(value) {
                property = value;
            }
        };
    });
app.service('reviewCar', function () {
        var property = '';
        return {
            getProperty: function () {
                return property;
            },
            setProperty: function(value) {
                property = value;
            }
        };
    });
    app.service('date1', function () {
            var property = '';
            return {
                getProperty: function () {
                    return property;
                },
                setProperty: function(value) {
                    property = value;
                }
            };
        });
  app.service('date2', function () {
          var property = '';
          return {
              getProperty: function () {
                  return property;
              },
              setProperty: function(value) {
                  property = value;
              }
          };
      });
    app.service('reviewCarImg', function () {
            var property = '';
            return {
                getProperty: function () {
                    return property;
                },
                setProperty: function(value) {
                    property = value;
                }
            };
        });
app.service('indexShare', function () {
        var property = '';
        return {
            getProperty: function () {
                return property;
            },
            setProperty: function(value) {
                property = value;
            }
        };
    });
app.service('customerProf', function () {
        var property = '';
        return {
            getProperty: function () {
                return property;
            },
            setProperty: function(value) {
                property = value;
            }
        };
    });
app.service('fbData', function () {
        var property = '';
        return {
            getProperty: function () {
                return property;
            },
            setProperty: function(value) {
                property = value;
            }
        };
    });
