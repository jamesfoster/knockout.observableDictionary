To use the knockout observable dictionary you simply need to reference knockout and then this

    <script type='text/javascript' src="http://github.com/downloads/SteveSanderson/knockout/knockout-2.0.0.js"></script>
    <script type='text/javascript' src="http://github.com/downloads/jamesfoster/knockout.observableDictionary/knockout.observableDictionary-0.1.js"></script>

Then pass a javascript object to ko.observableDictionary() as follows.

    var person = {
        name: 'Joe Bloggs',
        height: 180,
        'hair colour': 'brown'
    };
    
    var viewModel = {
        person: new ko.observableDictionary(person)
    };
    
    ko.applyBindings(viewModel);

You can data bind to the obersvableDictionary as you would an obersvableArray. Each element of the obersvableDictionary has a `key` property and a `value` property

    <ul data-bind="foreach: person">
        <li>
            <span data-bind="key"></span>
            <span data-bind="value"></span>
        </li>
    </ul>

You can also data bind to specific elements within the dictionary

    <label>Name: <input data-bind="person.get('name')" /></label>

You can even data bind to elements which don't exist yet. In this case, if you the value updates it will add the element to the dictionary.

    <label>Company: <input data-bind="person.get('company')" /></label>

To set a value on the dictionary in code use the `set` method: `viewModel.person.set('hair colour', 'blue');`. The array methods `indexOf`, `remove`, and `push` have also been overridden to behave as expected with dictionaries e.g. `viewModel.person.remove('height')` and `viewModel.person.indexOf('hair colour')`

Enjoy

    