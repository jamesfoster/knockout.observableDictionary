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
        var observable = new ko.observableArray();

        for (var key in dictionary) {
            if (dictionary.hasOwnProperty(key)) {
                observable.push(new DictionaryItem(key, dictionary[key], observable));
            }
        }

        ko.utils.extend(observable, ko.observableDictionary['fn']);

        return observable;
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

            ko.observableArray['fn'].remove.call(this, predicate);
        },

        push: function(key, value) {
            // handle the case where only a DictionaryItem is passed in
            var item;

            if (typeof key == "DictionaryItem") {
                item = key;
                key = key.key();
                value  = key.value();
            }

            var current = this.get(key);
            if (current) {
                // update existing value
                current(value);
                return current;
            }

            if (!item) {
                item = new DictionaryItem(key, value, this);
            }

            return ko.observableArray['fn'].push.call(this, item);
        },

        sort: function(method) {
            if (method === undefined) {
                method = function(a, b) {
                    return defaultComparison(a.key(), b.key());
                };
            }

            return ko.observableArray['fn'].sort.call(this, method);
        },

        indexOf: function(key) {
            if (typeof key == "DictionaryItem") {
                return ko.observableArray['fn'].indexOf.call(this, key);
            }

            var underlyingArray = this();
            for (var index = 0; index < underlyingArray.length; i++) {
                if (underlyingArray[index].key() == key) return index;
            }
        },

        get: function(key) {
            var found = ko.utils.arrayFirst(this(), function(item) {
                return item.key() == key;
            })
            return found ? found.value : null;
        },

        set: function(key, value) {
            return this.push(key, value);
        }
    };
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