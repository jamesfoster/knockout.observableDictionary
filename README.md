To use the knockout observable dictionary you simply need to reference knockout and then this

    <script type='text/javascript' src="http://github.com/downloads/SteveSanderson/knockout/knockout-2.0.0.js"></script>
    <script type='text/javascript' src="https://raw.github.com/jamesfoster/knockout.observableDictionary/master/ko.observableDictionary.js"></script>

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

To loop over the items in the dictionary simply data bind to the items property. Each item has a `key` property and a `value` property

    <ul data-bind="foreach: person.items">
        <li>
            <span data-bind="key"></span>
            <span data-bind="value"></span>
        </li>
    </ul>

You can also data bind to specific elements within the dictionary using the method `get`

    <label>Name: <input data-bind="person.get('name')" /></label>

You can even data bind to elements which don't exist yet. In this case, if you update the value it will add a new item to the dictionary.

    <label>Company: <input data-bind="person.get('company')" /></label>

To set a value on the dictionary in code use the `set` method: `viewModel.person.set('hair colour', 'blue');`. The obersvableArray methods `indexOf`, `remove`, `sort` and `push` have also been overridden to behave as expected with dictionaries e.g. `viewModel.person.remove('height')` and `viewModel.person.indexOf('hair colour')`

Enjoy

    