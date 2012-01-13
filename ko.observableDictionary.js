// Knockout Observable Dictionary
// (c) James Foster
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

(function() {
    function DictionaryItem(key, value, dictionary) {
        var observableKey = new ko.observable(key);
        this.value = ko.observable(value);
        this.key = new ko.computed({
            read: observableKey,
            write: function(newKey) {
                var current = observableKey();

                if (current == newKey) return;

                // no two items are allowed to share the same key.
                dictionary.remove(newKey);

                observableKey(newKey);
            }
        });
    }

    ko.observableDictionary = function(dictionary) {
        var result = {};
        
        result.items = new ko.observableArray();

        for (var key in dictionary) {
            if (dictionary.hasOwnProperty(key)) {
                result.items.push(new DictionaryItem(key, dictionary[key], result));
            }
        }

        result._wrappers = {};

        ko.utils.extend(result, ko.observableDictionary['fn']);

        return result;
    };

    ko.observableDictionary['fn'] = {
        remove: function(valueOrPredicate) {
            var predicate = valueOrPredicate;

            if (typeof valueOrPredicate == "DictionaryItem") {
                predicate = function(item) {
                    return item.key() === valueOrPredicate.key();
                };
            }
            else if (typeof valueOrPredicate != "function") {
                predicate = function(item) {
                    return item.key() === valueOrPredicate;
                };
            }

            ko.observableArray['fn'].remove.call(this.items, predicate);
        },

        push: function(key, value) {
            // handle the case where only a DictionaryItem is passed in
            var item;

            if (typeof key == "DictionaryItem") {
                item = key;
                value = key.value();
                key = key.key();
            }

            var current = this.get(key, false);
            if (current) {
                // update existing value
                current(value);
                return current;
            }

            if (!item) {
                item = new DictionaryItem(key, value, this);
            }

            return ko.observableArray['fn'].push.call(this.items, item);
        },

        sort: function(method) {
            if (method === undefined) {
                method = function(a, b) {
                    return defaultComparison(a.key(), b.key());
                };
            }

            return ko.observableArray['fn'].sort.call(this.items, method);
        },

        indexOf: function(key) {
            if (typeof key == "DictionaryItem") {
                return ko.observableArray['fn'].indexOf.call(this.items, key);
            }

            var underlyingArray = this.items();
            for (var index = 0; index < underlyingArray.length; i++) {
                if (underlyingArray[index].key() == key) return index;
            }
        },

        get: function(key, wrap) {
            if (wrap == false)
                return getValue(key, this.items());

            var wrapper = this._wrappers[key];

            if (wrapper == null) {
                wrapper = this._wrappers[key] = new ko.computed({
                    read: function() {
                        var value = getValue(key, this.items());
                        return value ? value() : null;
                    },
                    write: function(newValue) {
                        var value = getValue(key, this.items());

                        if (value)
                            value(newValue);
                        else
                            this.push(key, newValue);
                    }
                }, this);
            }

            return wrapper;
        },

        set: function(key, value) {
            return this.push(key, value);
        },

        toJSON: function() {
            var result = {};
            
            // in toJSON `this` refers to the plain JS object (observables are unwrapped)
            ko.utils.arrayForEach(this.items, function(item) {
                result[item.key] = item.value;
            });
    
            return result;
        }
    };

    function getValue(key, items) {
        var found = ko.utils.arrayFirst(items, function(item) {
            return item.key() == key;
        })
        return found ? found.value : null;
    }
})();


// Utility methods
// ---------------------------------------------
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function defaultComparison(a, b) {
    if (isNumeric(a) && isNumeric(b)) return a - b;

    a = a.toString();
    b = b.toString();

    return a == b ? 0 : (a < b ? -1 : 1);
}
// ---------------------------------------------