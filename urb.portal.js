
/* Initialize URB Namespace */
if (typeof (URB) === 'undefined') {
    window.URB = window.parent.URB || {};
}


URB.Validate = (function ($, window, document, _undefined) {

    console.log('Loading URB.Validate');

    const Types = [
        'undefined',
        'object',
        'boolean',
        'number',
        'bigint',
        'string',
        'symbol',
        'function',
        'array',
        'null'
    ];


    /**
     *  Returns true if value equal to string 
     *  
     * @param {any} value - value to evaluate
     * @return {boolean} - returns boolean
     */
    function isString(value) {

        return typeof value === 'string';
    }


    /**
     *  Returns true if value is array
     * @param {any} value - value to evaluate
     * @return {boolean} - returns boolean
     */
    function isArray(value) {
        return Array.isArray(value);
    }

    /**
     *  Returns true if value is empty
     *  
     *  [] = false
     *  '' = false
     *  undefined = false;
     *  null = false
     *  {} = false;
     *  
     * @param {any} value - value to evaluate
     * @return {boolean} - returns boolean
     */
    function isEmpty(value) {

        if (isArray(value)) return value.length === 0;

        if (isString(value)) return value === '';

        if (isObject(value)) return Object.keys(value).length === 0;

        if (value === null) return true;

        if (typeof value === 'undefined') return true;



        return false;
    }

    /**
     *  Returns true if value equal to object
     *  
     * @param {any} value - value to evaluate
     * @return {boolean} returns true if value is object 
     */
    function isObject(value) {
        return typeof value === 'object';
    }

    /**
     * Returns true if value is callable/function
     * 
     * @param {any} value - value to validate
     * @return {boolean} returns true if value is callable
     */
    function isCallable(value) {
        return typeof value === 'function';
    }

    /**
     * Returns true if value is element
     * 
     * @param {any} value value to validate
     * @return {boolean} returns true if value is element
     */
    function isElement(value) {
        return value instanceof Element || value instanceof HTMLDocument || value instanceof HTMLElement;
    }

    /**
     * Checks if object is instance of stringBuilder
     * 
     * @param {any} value - value to validate
     * @return {boolean} - returns true if instance of stringBuilder or implements methods 
     */
    function isStringBuilder(value) {
        try {
            return value instanceof URB.Utility.stringBuilder;
        } catch (e) {
            return isObject(value) && hasKeys(value, ['append', 'toString']);
        }
    }

    /**
     * Checks if object is instance of Promise
     *
     * @param {any} value - value to validate
     * @return {boolean} - returns true if instance of Promise or implements then method
     */
    function isPromise(value) {
        
        return value instanceof Promise || hasKey(value, 'then');
    }
    

    /**
     * Check value against array of valid values 
     * 
     * @param {string} value - value to validate 
     * @param {array} validValues - array of String Values
     * @return {boolean} return true if value exist in array
     */
    function isValidValue(value, validValues) {

 
        if (!isString(value) || !isArray(validValues)) return false;


        return validValues.indexOf(value) !== -1; 

    }


    /**
     * Check if Value is equal to the passed in type
     * 
     * @param {string} type - type to check 
     * @param {any} value - value to validate
     * @return {boolean} returns true if equals type
     */
    function isType(type, value) {

        throwIf(isString(type) && isValidValue(type, Types),'type is not a string or a valid type');

        if (type === 'array') return isArray(value);

        if (type === 'null') return value === null;

        return typeof value === type;
    }


	/*
	* Checks if object has list of properities
	*
	* @param obj {object} - object to check for properties
	* @param keys {array} - keys/properties to check for within object - nested keys values "." notation 
	* @return {boolean} - returns true if objects contains entire list of keys otherwise false
	*/
    function hasKeys(obj, keys) {

        //Check if keys is an array
        if (!Array.isArray(keys)) throw "invalid parameter keys is not an array";

        //Check if object is indeed an object
        if (typeof (obj) !== 'object') throw "invalid parameter obj is not an Object";

        return keys.every(function (key) {
            return hasKey(obj, key);
        });
    }

    /**
     * Checks if object has property
     * 
     * @param {object} obj -object to check 
     * @param {string} key - key Optionally can check nested keys utilizing "." notation
     * @return {boolean} returns true if property is available
     */
    function hasKey(obj, key) {
        return key.split(".").every(function (x) {
            if (typeof obj !== "object" || obj === null || !(x in obj))
                return false;
            obj = obj[x];
            return true;
        });
    }

    

    /**
     * Preforms a type check on all elements on array
     * 
     * @param {any} array - array to evaluate
     * @param {string|callback} type - array element types can be string type or callback
     * @return {boolean} - return true if all values in array are of type
     * @throws error if invalid parameters
     */
    function isArrayType(array, type) {

        throwIf(isString(type) || isCallable(type),'type is not a string or callable value');
        throwIf(isArray(array),'type is not a string or callable value');

        var status = true;

        for (var i = 0; i < array.length; i++) {

            
            if (isString(type)) {
                if (isType(type, array[i]) === false) {
                    status = false;
                    break;
                }
                continue;
            }

            if (isCallable(type)) {
                if (!!type(array[i]) === false) {
                    status = false;
                    break;
                }
                continue;
            }
            

            if (typeof array[i] === type) return;
        }

        return status;
    }


    /**
     * Throw error if condition is false
     * 
     * @param {any} condition - condition to evaluate 
     * @param {any} message - message to throw
     * @throw {Error}  - throw error when condition = false 
     */
    function throwIf(condition, message) {
        if (condition === false) throw message;
    }



    /**
     * Returns true if all conditions are true
     * 
     * @param {array} conditions - list of conditions to evaulate
     * @return {boolean} - returns boolean
     */
    function all(conditions) {

        return conditions.every(function (condition) {
            return !!condition;
        });
    }


    /**
     * Returns true if any conditions are true
     * 
     * @param {array} conditions - list of conditions to evaulate
     * @return {boolean} - returns boolean
     */
    function any(conditions) {
        for (var i = 0; i < conditions.length; i++) {
            if (!!condition === true) return true;
        }

        return false;
    }


    return {
        isString: isString,
        isArray: isArray,
        isObject: isObject,
        isEmpty: isEmpty,
        isCallable: isCallable,
        isElement: isElement,
        isStringBuilder: isStringBuilder,
        isPromise: isPromise,
        isValidValue: isValidValue,
        isType: isType,
        isArrayType: isArrayType,
        hasKey: hasKey,
        hasKeys: hasKeys,
     
        all: all,
        any: any,
        throwIf:throwIf

    };
}(jQuery, window, document));

/* Initialize URB Namespace */
if (typeof (URB) === 'undefined') {
    window.URB = window.parent.URB || {};
}




/**
 * @param {window} window - current window reference
 * @param {document} document - current document reference
 * @param {URB.Validate} Validate - Requires URB.Validate module
 * @param {undefined} _undefined - valid undefined reference 
 * @return {URB.Utility} - assigns and returns URB.Utility module/object
 * 
 * */
URB.Utility = (function (window, document, Validate, _undefined) {

    console.log('Loading URB.Utility');

    var LogEnabled = false;

    /**
     *  Retrieve URL Query Parameters
     * @return {object} - object of query parameters
     * 
     * */
    function getUrlParameters(context) {

        context = context || window;

        var queryString = context.location.search.substring(1);
        var params = {};
        var queryStringParts = queryString.split("&");
        for (var i = 0; i < queryStringParts.length; i++) {
            var pieces = queryStringParts[i].split("=");
            params[pieces[0].toLowerCase()] = pieces.length === 1 ? null : decodeURIComponent(pieces[1]);
        }

        return params;
    }

    /**
     * Retrieve Data Query Parameter object passed by D365
     * @return {object|null}  data object from URL Query String
     * */
    function getDataQueryParameter(context) {

        context = context || window;
        var urlParams = getUrlParameters(context);

        if (typeof urlParams['data'] === 'undefined') return null;

        return JSON.parse(urlParams['data']);
    }




    /**
     *  createElement is a dom element factory used to quickly generate dom ojects
     *  
     * @param {string} type - dom element type (e.x. div, span, p, etc)
     * @param {object} attributes - attributes object used to set attributes to the dom element
     * @param {array} children - will append strings and other dom elements to the newly created element
     * @return {HTMLElement} - returns html element
     */
    function createElement(type, attributes, children) {
        //Default children value
        if (typeof children === 'undefined') children = [];

        Validate.throwIf(Validate.isString(type), 'type is not a string');
        Validate.throwIf(Validate.isObject(attributes), 'attributes is not an object');
        Validate.throwIf(Validate.isArray(children), 'children is not an array');

        const el = document.createElement(type);

        for (key in attributes) {
            el.setAttribute(key, attributes[key]);
        }

        children.forEach(function (child) {

            if (Validate.isString(child)) {
                el.appendChild(document.createTextNode(child));

            } else if (Validate.isElement(child)) {
                el.appendChild(child);
            }

        });

        return el;

    }

    function createElementString(string, placeholders) {

        placeholders = placeholders || {};
        const el = document.createElement('div');


        var html = string.replace(
            /{(\w*)}/g, // regex checks for the following format {replacement name}
            function (m, key) { return placeholders.hasOwnProperty(key) ? placeholders[key] : ''; }
        );


        el.innerHTML = html;

        return el.firstChild;
    }

    function htmlElementToString(htmlElement) {

        var temp = document.createElement('div');

        temp.appendChild(htmlElement);

        return temp.innerHTML;

    }


    /**
     *  Applies Data Attributes to existing dom element
     *
     * @param {HTMLElement} element - dom element
     * @param {object} attributes - attributes object used to set data attributes to the dom element (ex. data-{dataattribute})
     * @return {HTMLElement} - returns html element
     */
    function applyDataAttributes(element, attributes) {
        Validate.throwIf(Validate.isElement(element), 'element is not a DOM element');
        Validate.throwIf(Validate.isObject(attributes), 'attributes is not an object');


        for (key in attributes) {
            element.setAttribute('data-' + key, attributes[key]);
        }

        return element;
    }


    /**
     *  Applies Data Attributes to existing dom element
     *
     * @param {HTMLElement} element - dom element 
     * @param {object} properties - properties object used to set object properties to the dom element
     * @return {HTMLElement} - returns html element
     */
    function applyProperties(element, properties) {

        Validate.throwIf(Validate.isElement(element), 'element is not a DOM element');
        Validate.throwIf(Validate.isObject(properties), 'attributes is not an object');


        for (key in properties) {
            element[key] = properties[key];
        }

        return element;
    }



    function extendObjectArray(obj, extensions) {


        if (!Validate.isArray(extensions)) throw 'extensions must be an array, a ' + typeof extensions + ' was given';

        extensions.forEach(function (extension) {

            if (Validate.hasKeys(extension, ['name', 'property'])) {
                extendObject(obj, extension.name, extension.property);
                return true;
            }

            warn('extension did not have the required properties', extension);
        });

    }

    function extendObject(obj, name, property) {

        if (isFunctionExecutable(property)) {
            obj[name] = getFunctionByName(property).bind(obj);
            return obj;
        }

        if (Validate.isCallable(property)) {
            obj[name] = property.bind(obj);
            return obj;
        }


        obj[name] = property;
        return obj;

    }



    /**
     * Fluent string builder object 
     * 
     * Append a string or an array of strings to builder and use toString method to return the string
     * 
     * Allows join value to be configured using join method (default empty string '')
     * 
     * @param {string|array} string - allows user to append a string or array of strings 
     * @return {this} - returns object to allow chaining method calls
     */
    function stringBuilder(string) {

        this.strings = [];
        var joinOn = '';

        //user can add a string or an array of strings to the append function
        this.append = function (string) {


            if (Validate.isArray(string)) {
                string.forEach(function (value) { this.strings.push(value); }, this);
            } else {
                this.strings.push(string);
            }

            return this;
        };

        //
        this.join = function (string) {

            if (Validate.isString(string)) joinOn = string;
            return this;
        };

        this.toString = function () {
            return this.strings.join(joinOn);
        };


        this.append(string);

        return this;

    }


    /**
     * Creates stringBuilder Object 
     * 
     * @param {string} string - first string to add to builder (Optional)
     * @return {stringBuilder} - returns new stringBuilder object
     */
    function getStringBuilder(string) {

        return new stringBuilder(string);
    }







    /**
     * Excecute function By Name can utilize Name spaced notation to call function
     * Can also apply starting context
     * 
     * @param {any} functionName - Namespaced notation acceptable (ex My.NameSpace.functionName)
     * @param {any} context - executing context
     * @return {any} response from executed function
     */
    function executeFunctionByName(functionName, context /*, args */) {
        context = context || window;
        var args = Array.prototype.slice.call(arguments, 2);

        return getFunctionByName(functionName, context).apply(context, args);
    }


    function getFunctionByName(functionName, context) {
        context = context || window;

        var namespaces = functionName.split(".");
        var func = namespaces.pop();
        for (var i = 0; i < namespaces.length; i++) {
            context = context[namespaces[i]];
        }

        return context[func];
    }

    function isFunctionExecutable(functionName, context) {
        context = context || window;
        try {
            return typeof getFunctionByName(functionName, context) === 'function';
        } catch (e) {
            error('Function "' + functionName + '" does not exist in the the following context', context);
            return false;
        }

    }

    function log() {

        if (!LogEnabled) {
            return emptyFunction;
        }

        if (window.console) return console.log.bind(window.console);

    }

    function logHeader(title) {

        if (!LogEnabled) {
            return emptyFunction;
        }

        this.log('******************************************************');
        this.log(title);
        this.log('******************************************************');

        var args = Array.prototype.slice.call(arguments, 1);
        if (args.length > 0) {
            this.log(args);
            this.log('******************************************************');
        }

    }

    function error() {

        if (!LogEnabled) {
            return emptyFunction;
        }

        if (window.console) return console.error.bind(window.console);
    }

    function warn() {

        if (!LogEnabled) {
            return emptyFunction;
        }

        if (window.console) return console.warn.bind(window.console);
    }

    function enableLog() {
        LogEnabled = true;
    }

    function disableLog() {
        LogEnabled = false;
    }

    function emptyFunction() { };



    function getEntityMetaData(entity) {
        var req = new XMLHttpRequest();
        req.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v9.1/EntityDefinitions(LogicalName='" + entity + "')", true);
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
        req.onreadystatechange = function () {
            if (this.readyState === 4) {
                req.onreadystatechange = null;
                if (this.status === 200) {
                    var result = JSON.parse(this.response);
                    console.log(result);
                } else {
                    Xrm.Utility.alertDialog(this.statusText);
                }
            }
        };
        req.send();
    }


    /**
   * Retrieves nested property for object returns null if does not exists
   * 
   * @param {object} obj - object to retrieve property from
   * @param {string} key - object "." notation to retrieve nested properties
   * @param {any} defaultValue - if return value eq to null or undefined return default value instead
   * @return {any| null|defaultValue} returns value or null if undefined
   */
    function getKey(obj, key, defaultValue) {
        var val = key.split(".").reduce(function (o, x) {
            return (typeof o === "undefined" || o === null) ? o : o[x];
        }, obj);

        //Set Default Value
        if (typeof val === "undefined" || val === null) {
            return typeof defaultValue !== 'undefined' ? defaultValue : val;
        } else {
            return val;
        }
    }




    /**
     * Return Default value if passed in value is null or undefined 
     * 
     * @param {any} value value to test
     * @param {any} defaultValue response value if null or undefined
     * @return {value|defaultValue} - Response value
     */
    function defaultValue(value, defaultValue) {

        if (typeof value === 'undefined' || value === null) return defaultValue;

        return value;
    }


    /**
     * Add Minutes to Date object
     * 
     * @param {Date} date - Date object
     * @param {Integer} minutes - integer minutes to add
     * @return {Date} - returns new Date object with minutes added
     */
    function addMinutes(date, minutes) {
        return new Date(date.getTime() + minutes * 60000);
    }


    function curry(func, thisArg) {

        var args = Array.prototype.slice.call(arguments, 1);
        return func.bind.apply(func, args);
    }


    return {
        el: createElement, //shorthand method call for createElement
        createElement: createElement,
        createElementString: createElementString,
        htmlElementToString: htmlElementToString,
        applyDataAttributes: applyDataAttributes,
        stringBuilder: stringBuilder, //contstructor
        sb: getStringBuilder,// shorthand method call for stringBuilder
        extendObjectArray: extendObjectArray,
        extendObject: extendObject,
        applyProperties: applyProperties,//HTMLElement
        getDataQueryParameter: getDataQueryParameter,
        getUrlParameters: getUrlParameters,

        executeFunctionByName: executeFunctionByName,
        getFunctionByName: getFunctionByName,
        isFunctionExecutable: isFunctionExecutable,
        curry: curry,

        emptyFunction: emptyFunction,
        defaultValue: defaultValue,
        getKey: getKey,

        //Time methods
        addMinutes: addMinutes,
        //Logging Methods
        enableLog: enableLog,
        disableLog: disableLog,
        logHeader: logHeader,
        get logging() {
            return LogEnabled;
        },
        set logging(state) {
            LogEnabled = !!state;
        },
        get log() {
            return log();
        },
        get warn() {
            return warn();
        },
        get error() {
            return error();
        }


    };



}(
    window,
    document,
    function () { if (typeof URB.Validate === 'undefined') throw 'Missing URB.Validate'; return URB.Validate; }()
));



/* Initialize URB Namespace */
if (typeof (URB) === 'undefined') {
    window.URB = window.parent.URB || {};
}
console.log('URB namespace loaded');

// Initialize URB.Utility namespace
if (typeof (URB.Portal) === 'undefined') { URB.Portal = {}; };

URB.Portal.Form = (function ($, window, document, _undefined) {
    'use strict';


    /**
     * Initialize Portal form elements 
     * */
    function initForm(context) {

        context = context || window;

        $('.control input, .control select, .control span.boolean-radio, .control textarea', context.document).not('.query.form-control').each(function () {
            URB.Portal.Form.initFormControl(this);
        });

    }

    /**
     * Apply formControl methods to element 
     *
     * @param {HTMLElement} element - Input HTML Element
     * @return {HTMLElement} - returns initialized form Element
     */
    function formControl(element) {
        element.formControl = {
            control: element,
            hide: function () { this.controlContainer.style.display = 'none' },
            show: function () { this.controlContainer.style.display = 'block' },
            get type() {
                return getControlType.call(this, this.control);
            },
            get value() {
                return getValueObject.call(this, this.control);
            },
            set value(value) {
                setValueObject.call(this, this.control, value);
            },
            get controlContainer() {
                return getControlElementContainer.call(this, this.control);
            },
            get isDisabled() {
                return getDisabledStatus.call(this, this.control);
            },
            get isRequired() {
                return getRequiredStatus.call(this, this.control);
            }

        };

        return element;

    }

    /**
     * Element Type Constants
     */
    const FORM_CONTROL_TYPE_TEXT = 'text';
    const FORM_CONTROL_TYPE_TEXTAREA = 'textarea';
    const FORM_CONTROL_TYPE_MONEY = 'money';
    const FORM_CONTROL_TYPE_INTEGER = 'integer';
    const FORM_CONTROL_TYPE_DECIMAL = 'decimal';
    const FORM_CONTROL_TYPE_MODAL_LOOKUP = 'modal-lookup';
    const FORM_CONTROL_TYPE_SELECT_LOOKUP = 'select-lookup';
    const FORM_CONTROL_TYPE_SELECT_PICKLIST = 'select-picklist';
    const FORM_CONTROL_TYPE_SELECT_BOOLEAN = 'select-boolean';
    const FORM_CONTROL_TYPE_HIDDEN = 'hidden';
    const FORM_CONTROL_TYPE_RADIO_BOOLEAN = 'radio-boolean';
    const FORM_CONTROL_TYPE_CHECKBOX = 'checkbox';
    const FORM_CONTROL_TYPE_DATETIME = 'datetime';
    const FORM_CONTROL_TYPE_STATE = 'state';

    /**
     * Control Value Types
     */
    const CONTROL_VALUE_TYPE_STRING = 'string';
    const CONTROL_VALUE_TYPE_INTEGER = 'integer';
    const CONTROL_VALUE_TYPE_DECIMAL = 'decimal';
    const CONTROL_VALUE_TYPE_MONEY = 'money';
    const CONTROL_VALUE_TYPE_LOOKUP = 'lookup';
    const CONTROL_VALUE_TYPE_BOOLEAN = 'boolean';
    const CONTROL_VALUE_TYPE_OPTIONSET = 'optionset';
    const CONTROL_VALUE_TYPE_DATETIME = 'datetime';
    const CONTROL_VALUE_TYPE_STATE = 'state';

    /**
     * Return Portal FormControl Element Type 
     * 
     * @param {HTMLElement} element - HTML Element
     * @return {string} - return control type
     */
    function getControlType(element) {
        element = element || this.control;

        

        if (typeof element.tagName !== 'string') {
            throw new Error('No HTMLElment and or FormControl passed');
        }

        // Check if control is state field
        if (element.tagName === 'INPUT' && element.id === 'statecode_EntityState') {
            return FORM_CONTROL_TYPE_STATE;
        }

        // Check for modal relationship lookup 
        if (element.tagName === 'INPUT' && element.type === 'hidden' && !element.classList.contains('text') && element.parentElement.querySelector('#' + element.id + '_name').classList.contains('lookup')) {
            return FORM_CONTROL_TYPE_MODAL_LOOKUP;
        }

        // Check for Money text box
        if (element.tagName === 'INPUT' && element.classList.contains('text') && element.classList.contains('money')) {
            return FORM_CONTROL_TYPE_MONEY;
        }

        // Check for Integer text box
        if (element.tagName === 'INPUT' && element.classList.contains('text') && element.classList.contains('integer')) {
            return FORM_CONTROL_TYPE_INTEGER;
        }

        // Check for Decimal text box
        if (element.tagName === 'INPUT' && element.classList.contains('text') && element.classList.contains('decimal')) {
            return FORM_CONTROL_TYPE_DECIMAL;
        }

        // check for regular text box 
        if (element.tagName === 'INPUT' && element.classList.contains('text')) {
            return FORM_CONTROL_TYPE_TEXT;
        }

        // check for regular text box 
        if (element.tagName === 'TEXTAREA' && element.classList.contains('textarea')) {
            return FORM_CONTROL_TYPE_TEXTAREA;
        }

        // Check for lookup that has been transformed into select dropdown 
        if (element.tagName === 'SELECT' && element.classList.contains('lookup')) {
            return FORM_CONTROL_TYPE_SELECT_LOOKUP;
        }
        // Check for picklist/optionset dropdown form element 
        if (element.tagName === 'SELECT' && element.classList.contains('picklist')) {
            return FORM_CONTROL_TYPE_SELECT_PICKLIST;
        }
        // Check for boolean dropdown yes/no field
        if (element.tagName === 'SELECT' && element.classList.contains('boolean-dropdown')) {
            return FORM_CONTROL_TYPE_SELECT_BOOLEAN;
        }
        // Check if hidden type 
        if (element.tagName === 'INPUT' && element.type === 'hidden') {
            return FORM_CONTROL_TYPE_HIDDEN;
        }
        // Check if type is boolean radio 
        if (element.tagName === 'SPAN' && element.classList.contains('boolean-radio')) {
            return FORM_CONTROL_TYPE_RADIO_BOOLEAN;
        }
        // Check if type is boolean radio children radio inputs
        if (element.parentElement.tagName === 'SPAN' && element.parentElement.classList.contains('boolean-radio')) {
            return FORM_CONTROL_TYPE_RADIO_BOOLEAN;
        }

        // Check if type is checkbox 
        if (element.tagName === 'INPUT' && element.parentElement.classList.contains('checkbox') && element.type === 'checkbox') {
            return FORM_CONTROL_TYPE_CHECKBOX;
        }

        // Check if type is Datetime 
        if (element.tagName === 'INPUT' && element.classList.contains('datetime') && element.type === 'text') {
            return FORM_CONTROL_TYPE_DATETIME;
        }

        //Default return type text
        console.warn('Element id' + element.id + ' has defaulted to type text');
        return FORM_CONTROL_TYPE_TEXT;
    }


    /**
     * 
     * @param {HTMLElement} element - HTML Element
     * @return {Object} - value object
     */
    function getValueObject(element) {
        element = element || this.control;

        var type = this.type;

        switch (type) {
            case FORM_CONTROL_TYPE_STATE:
                return getStateValueObject(element);
            case FORM_CONTROL_TYPE_MODAL_LOOKUP:
                return getLookupValueObject(element);
            case FORM_CONTROL_TYPE_TEXT:
                return getInputValueObjectText(element);
            case FORM_CONTROL_TYPE_TEXTAREA:
                return getInputValueObjectText(element);
            case FORM_CONTROL_TYPE_INTEGER:
                return getInputValueObjectInteger(element);
            case FORM_CONTROL_TYPE_DECIMAL:
                return getInputValueObjectFloat(element);
            case FORM_CONTROL_TYPE_MONEY:
                return getInputValueObjectMoney(element);
            case FORM_CONTROL_TYPE_SELECT_LOOKUP:
                return getSelectLookupValueObject(element);
            case FORM_CONTROL_TYPE_SELECT_PICKLIST:
                return getSelectValueObject(element);
            case FORM_CONTROL_TYPE_SELECT_BOOLEAN:
                return getSelectValueObject(element);
            case FORM_CONTROL_TYPE_HIDDEN:
                return getInputValueObject(element);
            case FORM_CONTROL_TYPE_RADIO_BOOLEAN:
                return getRadioValueObject(element);
            case FORM_CONTROL_TYPE_CHECKBOX:
                return getCheckboxValueObject(element);
            case FORM_CONTROL_TYPE_DATETIME:
                return getDatetimeValueObject(element);
            default:
                //console.log('uses default case', element, type)
                return getInputValueObject(element);

        }

    }


    /**
     * 
     * @param {HTMLElement} element - HTML Element
     * @param {any} value - value object to set on control
     * @return {Object} - value object
     */
    function setValueObject(element, value) {
        element = element || this.control;

        var type = this.type;

        switch (type) {
            case FORM_CONTROL_TYPE_STATE:
                console.warn('Sate is a read only field.');
                break;
            case FORM_CONTROL_TYPE_MODAL_LOOKUP:
                setLookupValueObject(element, value);
                break;
            case FORM_CONTROL_TYPE_TEXT:
                setInputValueText(element, value);
                break;
            case FORM_CONTROL_TYPE_TEXTAREA:
                setInputValueText(element, value);
                break;
            case FORM_CONTROL_TYPE_INTEGER:
                setInputValueText(element, value);
                break;
            case FORM_CONTROL_TYPE_DECIMAL:
                setInputValueText(element, value);
                break;
            case FORM_CONTROL_TYPE_MONEY:
                setInputValueText(element, value);
                break;
            case FORM_CONTROL_TYPE_SELECT_LOOKUP:
                setSelectLookupValueObject(element, value);
                break;
            case FORM_CONTROL_TYPE_SELECT_PICKLIST:
                setSelectValueObject(element, value);
                break;
            case FORM_CONTROL_TYPE_SELECT_BOOLEAN:
                setSelectValueObject(element, value);
                break;
            case FORM_CONTROL_TYPE_HIDDEN:
                setInputValueText(element, value);
                break;
            case FORM_CONTROL_TYPE_RADIO_BOOLEAN:
                setRadioBooleanValueObject(element, value);
                break;
            case FORM_CONTROL_TYPE_CHECKBOX:
                setCheckboxValueObject(element, value);
                break;
            case FORM_CONTROL_TYPE_DATETIME:
                setDatetimeValueObject(element, value);
                break;
            default:
                //console.log('uses default case', element, type)
                setInputValueText(element, value);

        }

    }

    /**
     * Retrieve current value of Input Element
     * 
     * @param {object} formControl - FormControl Object
     * @return {any} formElement Value
     */
    function getFormElementValue(formControl) {

        if (! 'value' in formControl) {
            console.error('formControl ID = ' + formControl.id + ' does not have the property value', formControl);
        }

        return formControl.value;
    }

    /**
    * Set current value of Input Element
    * 
    * @param {object} formControl - FormControl Object
    * @param {any} value - value to set to form control
    */
    function setFormElementValue(formControl, value) {

        if (typeof value === 'undefined') throw 'Value is undefiend';

        if (! 'value' in formControl) {
            console.error('formControl ID = ' + formControl.id + ' does not have the property value', formControl);
        }

        formControl.value = value;
    }

    /**
     * Get Input Value Object 
     * 
     * @param {any} formControl - FormControl Object
     * @return {object} returns object with value and text properties which share the same value
     */
    function getInputValueObject(formControl) {
        return {
            type: CONTROL_VALUE_TYPE_STRING,
            value: getFormElementValue(formControl),
            text: getFormElementValue(formControl),
        };
    }

    /**
    * Get Input Value Object as String 
    * 
    * @param {any} formControl - FormControl Object
    * @return {object} returns object with value and text properties which share the same value
    */
    function getInputValueObjectText(formControl) {
        return {
            type: CONTROL_VALUE_TYPE_STRING,
            value: getFormElementValue(formControl) || '',
            text: getFormElementValue(formControl) || '',
        };
    }

    /**
    * set Input Value Object as String 
    * 
    * @param {any} formControl - FormControl Object
    * @param {any} value - value to store 
    */
    function setInputValueText(formControl, value) {

        try {
            setFormElementValue(formControl, typeof value === 'string' || typeof value === 'number' ? value : value.value);
        } catch (error) {
            console.error(error);
        }


    }


    /**
     * Get Input Value Object as Integer
     * 
     * @param {any} formControl - FormControl Object
     * @return {object} returns object with value and text properties which share the same value
     */
    function getInputValueObjectInteger(formControl) {
        return {
            type: CONTROL_VALUE_TYPE_INTEGER,
            value: parseInt(getFormElementValue(formControl), 10) || null,
            text: getFormElementValue(formControl) || '',
        };
    }

    /**
     * Get Input Value Object as Float
     * 
     * @param {any} formControl - FormControl Object
     * @return {object} returns object with value and text properties which share the same value
     */
    function getInputValueObjectFloat(formControl) {
        return {
            type: CONTROL_VALUE_TYPE_DECIMAL,
            value: parseFloat(getFormElementValue(formControl).replace(/,/g, '')) || null,
            text: getFormElementValue(formControl) || '',
        };
    }

    /**
     * Get Input Value Object as Money
     * 
     * @param {any} formControl - FormControl Object
     * @return {object} returns object with value and text properties which share the same value
     */
    function getInputValueObjectMoney(formControl) {

        var valueObject = getInputValueObjectFloat(formControl);
        valueObject.type = CONTROL_VALUE_TYPE_MONEY;

        return valueObject;
    }

    /**
     * Retrieve current value for Lookup Control formControl
     * @param {any} formControl - FormControl Object
     * @return {object} returns current value, text, and entity name in object form
     */
    function getLookupValueObject(formControl) {
        var controlContainer = formControl.formControl.controlContainer;

        return {
            type: CONTROL_VALUE_TYPE_LOOKUP,
            value: getFormElementValue(formControl),
            text: getFormElementValue(controlContainer.querySelector('.control #' + formControl.id + '_name')),
            entity: getFormElementValue(controlContainer.querySelector('.control #' + formControl.id + '_entityname')),
        };

    }
    /**
     * Retrieve current value for State formControl
     * @param {any} formControl - FormControl Object
     * @return {object} returns current value, text, and entity name in object form
     */
    function getStateValueObject(formControl) {
        var controlContainer = formControl.formControl.controlContainer;

        return {
            type: CONTROL_VALUE_TYPE_STATE,
            value: parseInt(controlContainer.querySelector('#statecode_EntityState').value),
            text: controlContainer.querySelector('#statecode').innerHTML,
        };
    }

    /**
     * Set current value for Lookup Control formControl
     * 
     * @param {any} formControl - FormControl Object
     * @param {set} value - lookup value to set 
     */
    function setSelectLookupValueObject(formControl, value) {
        var controlContainer = formControl.formControl.controlContainer;
        var entityName = controlContainer.querySelector('.control #' + formControl.id + '_entityname').value;
        try {
            setFormElementValue(formControl, typeof value === 'string' ? value : value.value);
            setFormElementValue(controlContainer.querySelector('.control #' + formControl.id + '_entityname'), value.entity ? value.entity : entityName);
        } catch (error) {
            console.error(error);
        }




    }

    /**
     * Set current value for Lookup Control formControl
     * 
     * @param {any} formControl - FormControl Object
     * @param {set} value - lookup value to set 
     */
    function setLookupValueObject(formControl, value) {
        var controlContainer = formControl.formControl.controlContainer;

        try {
            setFormElementValue(formControl, value.value);
            setFormElementValue(controlContainer.querySelector('.control #' + formControl.id + '_name'), value.text);
            setFormElementValue(controlContainer.querySelector('.control #' + formControl.id + '_entityname'), value.entity);
        } catch (error) {
            console.error(error);
        }




    }


    /**
     * Retreive current value for a select lookup form element 
     * @param {any} formControl - FormControl Object
     * @return {object} returns current value, text, and entity name in object form
     */
    function getSelectLookupValueObject(formControl) {
        var controlContainer = formControl.formControl.controlContainer;

        return {
            type: CONTROL_VALUE_TYPE_LOOKUP,
            value: getFormElementValue(formControl),
            text: formControl.options[formControl.selectedIndex].text,
            entity: getFormElementValue(controlContainer.querySelector('.control #' + formControl.id + '_entityname'))
        };
    }



    /**
     * Retreive current value for a select form element 
     * @param {any} formControl - FormControl Object
     * @return {object} returns current value, text, and tentity name in object form
     */
    function getSelectValueObject(formControl) {
        var controlContainer = formControl.formControl.controlContainer;

        return {
            type: CONTROL_VALUE_TYPE_OPTIONSET,
            value: isNaN(parseInt(getFormElementValue(formControl), 10)) ? null : parseInt(getFormElementValue(formControl), 10) ,
            text: formControl.options[formControl.selectedIndex].text,
        }
    }

    /**
    * Retreive current value for a select form element 
    * @param {any} formControl - FormControl Object
    * @param {any} value - value to set to select field
    */
    function setSelectValueObject(formControl, value) {

        try {
            setFormElementValue(formControl, typeof value === 'string' || typeof value === 'number' ? value : value.value);

        } catch (error) {
            console.error(error);
        }
    }


    /**
     * Retreive current value for radio control
     * 
     * @param {any} formControl - form Control object 
     * @return {object} returns current value object 
     */
    function getRadioValueObject(formControl) {

        var control = formControl;

        //Check if this is a child radio input item change context to parent control element
        if (formControl.tagName === 'INPUT' && formControl.type === 'radio') control = formControl.parentElement;

        var currentSelectedRadio = control.querySelector('input[type="radio"]:checked');

        // Check if radio has been selected if not return null
        if (currentSelectedRadio === null) {
            console.warn('formControl #' + control.id + ' does not currently have a radio button selected');
            return currentSelectedRadio;
        }

        return {
            type: CONTROL_VALUE_TYPE_BOOLEAN,
            value: getFormElementValue(currentSelectedRadio) === '1' ? true : false,
            text: getRadioLabelText(currentSelectedRadio),
        };
    }



    /**
     * set current value for boolean radio control
     * 
     * @param {any} formControl - form Control object 
     * @param {any} value - check radio value 
     */
    function setRadioBooleanValueObject(formControl, value) {

        var control = formControl;

        //Check if this is a child radio input item change context to parent control element
        if (formControl.tagName === 'INPUT' && formControl.type === 'radio') control = formControl.parentElement;

        if (value === 1 || value === true || (typeof value.value !== 'undefined' && (value.value === 1 || value.value === true))) {
            control.querySelector('#' + control.id + '_1').checked = true;
        } else {
            control.querySelector('#' + control.id + '_0').checked = true;
        }


    }


    /**
     *  Retreives Radio element text label value 
     *  
     * @param {HTMLElement} radioElement - HTML Element Input Radio
     * @return {string|null} return string of label or null for no label 
     */
    function getRadioLabelText(radioElement) {

        var label = document.querySelector('label[for="' + radioElement.id + '"]');

        // Check if label exists for radio element
        if (label === null) {
            console.warn('No label Value', radioElement);
            return null;
        }

        //Initalize label Value
        var labelValue = '';

        for (var i = 0; i < label.childNodes.length; i++) {

            //Filters out nodes that have class of sr-only "Screen Reader"
            if ('classList' in label.childNodes[i] && label.childNodes[i].classList.contains('sr-only')) { continue; };

            // if the value is a text node uses nodeValue if node is htmlelement use innerText htmlelements will have a null nodevalue
            labelValue += label.childNodes[i].nodeValue || label.childNodes[i].innerText;

        }

        return labelValue;

    }
    /**
     *  Retrieves Checkbox current value 
     *  
     * @param {any} formControl - FormControl Object
     * @return {object} return current value and if checked true or false
     */
    function getCheckboxValueObject(formControl) {

        return {
            type: CONTROL_VALUE_TYPE_BOOLEAN,
            value: formControl.checked,
            text: formControl.value
        };
    }


    /**
     *  Set Checkbox current value 
     *  
     * @param {any} formControl - FormControl Object
     * @param {any} value - value object or boolean value
     */
    function setCheckboxValueObject(formControl, value) {

        if (value === 1 || value === true || (typeof value.value !== 'undefined' && (value.value === 1 || value.value === true))) {
            formControl.checked = true;
        } else {
            formControl.checked = false;
        }

    }

    /**
     * Retrieves current datetime/date on formControl
     * 
     * @param {any} formControl - FormControl Object
     * @return {object} returns value object with raw datetime value and formatted date value
     */
    function getDatetimeValueObject(formControl) {

        return {
            type: CONTROL_VALUE_TYPE_DATETIME,
            value: formControl.value ? new Date(formControl.value) : null,
            formattedValue: formControl.nextSibling === null ? '' : formControl.nextSibling.querySelector('.form-control').value,
        };

    }


    /**
    * Set current datetime/date on formControl
    * 
    * @param {any} formControl - FormControl Object
    * @param {any} value - Date, Moment or String 
    */
    function setDatetimeValueObject(formControl, value) {

        //var datepicker = formControl.nextSibling === null ? '' : formControl.nextSibling.querySelector('.form-control');

        var datepicker = formControl.parentElement.querySelector('.datetimepicker .form-control');


        if (!datepicker) {
            console.error('No datepicker on field');
        }

        var format = datepicker.dataset['dateFormat'];

        var date = (value instanceof Date || typeof value === 'string') ? moment(value) : moment();

        formControl.value = date.format();
        datepicker.value = date.format(format);
        datepicker.dispatchEvent(new Event('change'));



    }

    /**
     * Checks if formControl is Disabled
     * 
     * @param {htmlElement} element - HTML Element
     * @return {boolean} - return disabled state
     */
    function getDisabledStatus(element) {

        element = element || this.control;

        if (element.disabled || element.classList.contains('aspNetDisabled')) {
            return true;
        }

        return false;
    }

    /**
     *  Checks if formControl is required
     *  
     * @param {htmlElement} element - HTML Element
     * @return {boolean} - return required status
     */
    function getRequiredStatus(element) {

        element = element || this.control;

        if (element.required || getControlElementContainer(element).querySelector('.info.required') !== null) {
            return true;
        }

        return false;
    }

    /**
     * Retrieves form control container with the following structure 
     *  td.form-control-cell > .control #{elementid}
     * 
     * @param {htmlElement} element - HTML element
     * @return {htmlElement} parent container element
     */
    function getControlElementContainer(element) {

        element = element || this.control;

        var container = element.parentElement.parentElement;

        // Structure includes additional div container input-group must get parent of this container
        if (container.classList.contains('control')) {
            container = container.parentElement;
        }

        // DOM structure check report error
        if (!container.classList.contains('cell') || container.querySelector('.control  #' + element.id) === null) {
            console.error('Element "' + element.id + '" does not have container with proper DOM structure');
        }

        return container;
    }


    function showControl(element) {
        element = element || this.control;


    }

    function testingHandleError(error, object) {
        console.log('Error Occurred ==============================================================');
        console.log(object);
        console.error(error);
    }

    function formTest() {


        $('.control input, .control select, .control span.boolean-radio').not('.query.form-control').each(function () {
            URB.Portal.Form.initFormControl(this);
            console.log('**********Form Element Test ****************************************************************');
            console.log(this);
            console.log('**********Start Test************************************************************************');

            try {
                console.log('Testing get type ======================================================');
                console.log(this.formControl.type);
            }
            catch (error) {
                testingHandleError(error, this);
            }
            try {
                console.log('Testing get Value ======================================================');
                console.log(this.formControl.value);
            }
            catch (error) {
                testingHandleError(error, this);
            }

            try {
                console.log('Testing get controlContainer ======================================================');
                console.log(this.formControl.controlContainer);
            }
            catch (error) {
                testingHandleError(error, this);
            }

            try {
                console.log('Testing get isDisabled ======================================================');
                console.log(this.formControl.isDisabled);
            }
            catch (error) {
                testingHandleError(error, this);
            }
            try {
                console.log('Testing get isRequired ======================================================');
                console.log(this.formControl.isRequired);
            }
            catch (error) {
                testingHandleError(error, this);
            }




        });
    }


    return {
        initForm: initForm,
        initFormControl: formControl,
        formTest: formTest
    };

}(jQuery, window, document));

/** WebAPI wrapper for Portal **/
(function (webapi, $) {
    function safeAjax(ajaxOptions) {
        var deferredAjax = $.Deferred();
        shell.getTokenDeferred().done(function (token) {
            // add headers for AJAX
            if (!ajaxOptions.headers) {
                $.extend(ajaxOptions, {
                    headers: {
                        "__RequestVerificationToken": token
                    }
                });
            } else {
                ajaxOptions.headers["__RequestVerificationToken"] = token;
            }
            $.ajax(ajaxOptions)
                .done(function (data, textStatus, jqXHR) {
                    validateLoginSession(data, textStatus, jqXHR, deferredAjax.resolve);
                }).fail(deferredAjax.reject); //AJAX
        }).fail(function () {
            deferredAjax.rejectWith(this, arguments); /*on token failure pass the token AJAX and args*/
        });
        return deferredAjax.promise();
    }
    webapi.safeAjax = safeAjax;
})(window.webapi = window.webapi || {}, jQuery)



URB.Portal.WebApi = (function ($,v,u, window, document,_undefined) {
    'use strict';
    
    
    /**
    * Web API Config
    * 
    * Stores Entity Set Name Map
    * */
    let webApiConfig  = {
        loggingEnabled: false,
        entitySetNameMap: {
            'account': 'accounts',
            'contact': 'contacts',
            'incident': 'incidents',  
        }
    }

    /**
     * 
     * @param {string} entity 
     * @returns {string}
     */
    function getEntitySetName(entity) {
        if(!webApiConfig.entitySetNameMap[entity]) {
           throw('Entity set name for '+ entity +' does not exist in map');
        }
        return webApiConfig.entitySetNameMap[entity]
    }

    /**
     * 
     * @param {string} entity 
     * @param {string} setName 
     * @returns {thisArg}
     */
    function setEntitySetName(entity, setName) {
        if(!v.isString(entity) && !v.isString(setName)) {
            throw('entity or setName was not a string');
        }
        webApiConfig.entitySetNameMap[entity] = setName;
        return this;
    }

    /**
     *  Get Web API Config object
     * @returns {object}
     */
    function getWebApiConfig () {
        return webApiConfig;
    }

    /**
     *  Portal Web API create record 
     * 
     * @param {string} entity 
     * @param {object} data 
     * @param {boolean} logEnabled
     * @returns {Promise}
     */
    async function create(entity,data,loggingEnabled) {
        
        loggingEnabled = loggingEnabled || webApiConfig.loggingEnabled;

        let setName = getEntitySetName(entity);

         return new Promise((resolve,reject) => {
            webapi.safeAjax({
                type: "POST",
                contentType: "application/json",
                url: `/_api/${setName}`,
                data: JSON.stringify(data),
                success: function (data, textStatus, xhr) {
                    let recordId = xhr.getResponseHeader("entityid");
                    u.log('Creation Successful', {entity: entity, recordId: recordId});
                    resolve(recordId)
                },
                error: function (xhr, textStatus, errorThrown) {
                    u.error(xhr);
                    reject(xhr);
                }
            });
        })
    }

    /**
     * Update record in dataverse 
     * 
     * @param {string} entity 
     * @param {string} recordId 
     * @param {object} data 
     * @param {boolean} loggingEnabled 
     * @returns {Promise}
     */
    async function update(entity,recordId,data,loggingEnabled) {
        
        loggingEnabled = loggingEnabled || webApiConfig.loggingEnabled;

        let setName = getEntitySetName(entity);

         return new Promise((resolve,reject) => {
            webapi.safeAjax({
                type: "PATCH",
                contentType: "application/json",
                url: `/_api/${setName}(${recordId})`,
                data: JSON.stringify(data),
                success: function (data, textStatus, xhr) {
                    let recordId = xhr.getResponseHeader("entityid");
                    u.log('Update Successful', {entity: entity, recordId: recordId});
                    resolve(recordId)
                },
                error: function (xhr, textStatus, errorThrown) {
                    u.error(xhr);
                    reject(xhr);
                }
            });
        })
    }

    async function deleteRecord(entity,recordId,loggingEnabled) {
        
        loggingEnabled = loggingEnabled || webApiConfig.loggingEnabled;

        let setName = getEntitySetName(entity);

         return new Promise((resolve,reject) => {
            webapi.safeAjax({
                type: "DELETE",
                contentType: "application/json",
                url: `/_api/${setName}(${recordId})`,
                success: function (data, textStatus, xhr) {
                    u.log('Record successfully deleted', {entity: entity, recordId: recordId});
                    resolve(true)
                },
                error: function (xhr, textStatus, errorThrown) {
                    u.error('Delete record failed',xhr);
                    reject(false);
                }
            });
        })
    }  



    return {
        getEntitySetName: getEntitySetName,
        setEntitySetName: setEntitySetName,
        getWebApiConfig: getWebApiConfig,
        create: create,
        update:update,
        deleteRecord:deleteRecord,
        

    }
    


})(jQuery,URB.Validate,URB.Utility, window, document);


/* Initialize URB Namespace */
if (typeof (URB) === 'undefined') {
    window.URB = window.parent.URB || {};
}
console.log('URB namespace loaded');


/**
 * URB/Portal-D365
 * @constructor
 * @param {Object} $ - jQuery 
 * @param {Object} window
 * @param {Object} document
 * @param _undefined
*/

URB.Portal.Utility = (function ($, window, document, _undefined) {
    'use strict';



    /**
    * Default Validation Config
    * 
    * */
    var defaultValidationConfig = {
        errorMessage: "Default validation error message",
        isRequiredUi: false,
        validationFunction: function () { return true },
        context: window,
        initialValue: '',
        validatorIdPrefix: false,
        controlLabel: false,
        display: 'dynamic'
    }

    /**
     * Checks if page contains Page_Validator object from portal form 
     */
    function hasPageValidators(context) {
        if (typeof (context.Page_Validators) === 'undefined') {
            return false;
        }
        return true;
    }

    function isValidConfig(config) {
        /**
        * Validation Step
        */
        if (typeof (control) !== 'string') {
            console.log('control value must be string');
            return false;
        }

        if (typeof (errorMessage) !== 'string') {
            console.log('errorMessage value must be string');
            return false;
        }

        if (!validationFunction instanceof Function) {
            console.log('validationFunction must be an executable function');
            return false;
        }

    }
    function createValidation(control, errorMessage, validationFunction, context, validatorId, controlLabel, initialValue) {

        /**
         * Validation Step
         */
        if (typeof (control) !== 'string') {
            console.log('control value must be string');
            return false;
        }

        if (typeof (errorMessage) !== 'string') {
            console.log('errorMessage value must be string');
            return false;
        }

        if (!validationFunction instanceof Function) {
            console.log('validationFunction must be an executable function');
            return false;
        }

        /**
         * Inialize Default Values if not passed
         */
        context = context || window;
        validatorId = validatorIdPrefix || 'Validator_' + control;
        controlLabel = controlLabel || control + '_label';
        initialValue = initialValue || '';


        /**
         * Create Validator
         * */
        var validator = context.document.createElement('span');

        validator.style.display = 'none';
        validator.id = validatorId
        validator.controltovalidate = control;
        validator.controlElement = context.document.getElementById(control);
        validator.errormessage = '<a href="#' + controlLabel + '" onclick=\'javascript:scrollToAndFocus("' + controlLabel + '","' + control + '");return false;\' >' + errorMessage + '</a>';
        // Functionality not currently used need to investigate for improved method
        validator.validationGroup = '';
        validator.initialvalue = initialValue;
        validator.evaluationfunction = validationFunction;
        validator.display = "Dynamic";
        // create method to remove the validation from Page_Validation list
        validator.dispose = function () {
            var currentDocument = this.ownerDocument;
            Array.remove(currentDocument.defaultView.Page_Validators, currentDocument.getElementById(validatorId));
        };

        return validator;
    }

    /**
     * Generate a Validator HTMLElement to be added to Page_Validator array
     * 
     * @param {object} config - validator configuration object
     * @returns {HTMLElement} returns Validator HTMLElement
     */
    function createValidationFromConfig(config) {

        // Check if config object has required control field
        if (typeof config !== 'object' || !(typeof config.control === 'string' || Array.isArray(config.control))) {
            return false;
        }

        //If Config.control is array then filter through each control with the same config
        if (Array.isArray(config.control)) {

            config.control.forEach(function (control) {

                var newConfig = $.extend({}, config, { control: control });

                addValidator(createValidationFromConfig(newConfig), newConfig.context || window);
            });

            return;
        }


        // Merge Default validation config with passed config to initialize required fields
        config = $.extend({}, defaultValidationConfig, config);

        // Generate ValidatorId and Control Label if one does not exists
        config.validatorIdPrefix = config.validatorIdPrefix || 'Validator';
        config.validatorId = config.validatorIdPrefix + '_' + config.control;
        config.controlLabel = config.controlLabel || config.control + '_label';

        // Create Validator DOM Object
        var validator = config.context.document.createElement('span');

        validator = $.extend(validator, {
            context: config.context,
            style: { display: 'none' },
            id: config.validatorId,
            controltovalidate: config.control,
            controlElement: config.context.document.getElementById(config.control),
            errormessage: '<a href="#' + config.controlLabel + '" onclick=\'javascript:scrollToAndFocus("' + config.controlLabel + '","' + config.control + '");return false;\' >' + config.errorMessage + '</a>',
            validationGroup: config.validationGroup,
            initialvalue: config.initialValue,
            evaluationfunction: config.validationFunction,
            display: config.display,
            isRequiredUi: config.isRequiredUi,
            dispose: function () {
                var currentDocument = config.context.document;
                Array.remove(currentDocument.defaultView.Page_Validators, currentDocument.getElementById(config.validatorId));
            }


        });

        //Check if Depends on has been passed via the config object 
        if (typeof config.dependsOn === 'object') {
            validator.dependsOn = config.dependsOn;
        }


        return validator;

    }


    /**
     * Validator Function that always returns true used placeholder/default function 
     * 
     * @return {boolean} returns true
     */
    function alwaysTrueValidator() {
        return true;
    }

    /**
     * Validates required field by element ID
     * Dependent on form Validation 
     * 
     * @param {string} controlId - controlId to validate
     * @return {boolean} - returns true if control has a value 
     */
    function requireFieldValidatorOnId(controlId, context) {

        context = context || window;

        var controlValue = context.document.getElementById(controlId).formControl.value.value;

        return controlValue;

        return (controlValue !== '' && controlValue !== 'undefined');
    }

    /**
     * Validator to check if any field of the required fields contain values
     * 
     * @param {array} fields - array of fields to require
     * @return {function} returns callback function for validation 
     */
    function requireFieldsOrValidator(fields) {

        if (!Array.isArray(fields)) {
            console.error('Validation function "requireFieldsOrValidator" requires an array of fields to check');
            return alwaysTrueValidator;
        }

        // return function to check if any of the required fields have a value
        return function (val) {

            var contextDocument = val.ownerDocument.defaultView;

            for (var i = 0; i < fields.length; i++) {

                if (typeof fields[i] !== 'string') {
                    continue;
                }

                if (!contextDocument.document.getElementById(fields[i])) {
                    console.warn(fields[i] + ' does not exist skipping validation');
                    continue;
                }

                if (requireFieldValidatorOnId(fields[i], contextDocument)) {
                    return true;
                }
            }

            return false;

        }

    }
    /**
     * Validates Required Field only if the field is currently visible on form
     *
     * @param {object} val validator DOM object
     * @return {boolean} - returns boolean validation status
     */
    function requireFieldValidatorIfNotHidden(val) {
        var control = val.ownerDocument.getElementById(val.controltovalidate);

        if (control.offsetHeight < 1) return true;


        //Use Existing RequiredField Validator
        return val.ownerDocument.defaultView.RequiredFieldValidatorEvaluateIsValid(val);
    }

    /**
     * Validates if fields are not hidden - input paramater is another validator method
     *
     * @param {object} validatorMethod malidation method
     * @return {boolean} - returns boolean validation status
     */
    function requireValidatorMethodIfNotHidden(validatorMethod) {

        var validationFunction = validatorMethod;

        return function (val) {

            var control = val.ownerDocument.getElementById(val.controltovalidate);

            if (control.offsetHeight < 1) return true;


            //Use Existing RequiredField Validator
            return validationFunction(val);
        };


    }

    /**
     * Validates if condition = true - input paramater is another validator method
     *
     * @param {object} validatorMethod malidation method
     * @param {object} condition - callback condition returns boolean
     * @return {object} - returns boolean validation status
     */
    function requireValidatorMethodIfConditionTrue(validatorMethod, condition) {

        var validationFunction = validatorMethod;


        return function (val) {

            if (!condition()) return true;


            //Use Existing RequiredField Validator
            return validationFunction(val);
        };

    }

    /**
     * Add Validator Element created by createValidation method(s) to Page_Validators array
     * 
     * @param {HTMLElement} validator - Validator Object
     * @param {window} context - current execution window
     * @return {boolean} return sucess results
     */
    function addValidator(validator, context) {

        try {

            //If no validator is passed in continue execution
            if (!validator) return;

            if (typeof context === 'undefined') {
                context = window;
            }

            if (!hasPageValidators(context)) {
                console.log('Page_Validators does not exist in the current context', context);
                context.Page_Validators = [];
                //return false;
            }

            if (typeof context.document.getElementById(validator.controltovalidate).Validators === 'undefined') {
                console.log('Control does not contain the Validator array');
                context.document.getElementById(validator.controltovalidate).Validators = [];
                //return false;
            }
            //Assign to Page Validators for form
            context.Page_Validators.push(validator);

            console.log($('#' + validator.controltovalidate, context.document));

            //Assign Validator to control element that is being validated
            context.document.getElementById(validator.controltovalidate).Validators.push(validator);

            //Get Control Container 
            validator.controlContainer = $('#' + validator.controltovalidate, context.document).closest('td');

            //Add validator element to dom list of validators for the control
            validator.controlContainer.find('.validators').append(validator);

            //If Validator is marked as required update the UI to reflect the change
            if (validator.isRequiredUi) {
                validator.controlContainer.find('.info').addClass('required');
            }

            //Apply any depends on functionality
            applyDependsOn(validator);

            if (typeof context.ValidatorOnLoad === 'function') {
                context.ValidatorOnLoad();
            }
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    function triggerValidation() {
        if (typeof (Page_Validators) == "undefined")
            return;
        var i, val;
        for (i = 0; i < Page_Validators.length; i++) {
            val = Page_Validators[i];

            val.evaluationfunction()

        }

    }
    /**
     * Create Validations From Config Array 
     * 
     * @param {array} configs - Array of Config Objects 
     * @returns {void}
     */
    function createValidationsFromConfigArray(configs) {

        //Check if Configs array is empty or contains any data
        if (!configs || configs.length < 1) return false;

        for (var i = 0; i < configs.length; i++) {
            this.addValidator(this.createValidationFromConfig(configs[i]), configs[i].context || window);
        }

    }


    /**
     * Default Hide Form Container Method 
     * 
     * @param {any} field - field 
     * @param {any} context - window context
     * @return {void}
     */
    function _defaultHideFormContainer(field, context) {

        context = context || window;

        $("#" + field, context.document).closest("td").hide();
    }

    /**
     *  Default Show Form Container Method
     *  
     * @param {any} field - field 
     * @param {any} context - window context
     * @return {void}
     */
    function _defaultShowFormContainer(field, context) {

        context = context || window;

        $("#" + field, context.document).closest("td").show();
    }


    /**
    *  Default Show Form Section Method
    *  
    * @param {any} field - field 
    * @param {any} context - window context
    * @return {void}
    */
    function _defaultShowFormSection(field, context) {

        context = context || window;

        field.style.display = 'block';
    }


    /**
    *  Default Hide Form Section Method
    *  
    * @param {any} field - field 
    * @param {any} context - window context
    * @return {void}
    */
    function _defaultHideFormSection(field, context) {

        context = context || window;

        field.style.display = 'none';
    }

    /**
     *  Default Change Callback Method 
     *  
     * @param {string} field - field id
     * @param {string} dependentField - dependent field id
     * @param {array} values - array of dependent values
     * @param {window} context - window object 
     */
    function _defaultChangeCallback(field, dependentField, values, context) {

        //Get depended Fields current Value
        var dependentFieldEl = context.document.getElementById(dependentField);
        var dependentFieldValue = dependentFieldEl.formControl.value.value;

        //var dependentFieldValue = $('#' + dependentField, context.document).val();

        //Check if current value matches any depend value
        console.log(values, Array.isArray(values), typeof values);


        if ((values === 'undefined' && dependentFieldValue !== '') || $.inArray(dependentFieldValue, values) !== -1) {
            _defaultShowFormContainer(field, context);
        } else {
            _defaultHideFormContainer(field, context);
        }
    }

    /**
     *  Depends on Field Containing Data Callback Method
     *
     * @param {string} field - field id
     * @param {string} dependentField - dependent field id
     * @param {array} values - array of dependent values
     * @param {window} context - window object
     */
    function dependsOnFieldContainsData(field, dependentField, values, context) {

        //Get depended Fields current Value
        var dependentFieldEl = context.document.getElementById(dependentField);
        var dependentFieldValue = dependentFieldEl.formControl.value.value;

        //var dependentFieldValue = $('#' + dependentField, context.document).val();

        //Check if current value matches any depend value
        console.log(values, Array.isArray(values), typeof values);


        if (dependentFieldValue) {
            _defaultShowFormContainer(field, context);
        } else {
            _defaultHideFormContainer(field, context);
        }
    }

    /**
     *  Depends on Field Does not Contain Data Callback Method
     *
     * @param {string} field - field id
     * @param {string} dependentField - dependent field id
     * @param {array} values - array of dependent values
     * @param {window} context - window object
     */
    function dependsOnFieldDoesNotContainsData(field, dependentField, values, context) {

        //Get depended Fields current Value
        var dependentFieldEl = context.document.getElementById(dependentField);
        var dependentFieldValue = dependentFieldEl.formControl.value.value;

        //var dependentFieldValue = $('#' + dependentField, context.document).val();

        //Check if current value matches any depend value
        console.log(values, Array.isArray(values), typeof values);


        if (!dependentFieldValue) {
            _defaultShowFormContainer(field, context);
        } else {
            _defaultHideFormContainer(field, context);
        }
    }



    /**
    *  Default Change Callback Method 
    *  
    * @param {HTMLElement} section - Section Html Element
    * @param {HTMLElement} dependentField - dependent field HTML Element
    * @param {array} values - array of dependent values
    * @param {window} context - window object 
    */
    function _defaultSectionChangeCallback(section, dependentField, values, context) {


        var dependentFieldValue = ( typeof dependentField.formControl !== 'undefined' ? dependentField.formControl.value.value  : dependentField[0].formControl.value.value) ;

        //var dependentFieldValue = $('#' + dependentField, context.document).val();

        //Check if current value matches any depend value
        console.log(values, Array.isArray(values), typeof values);


        if ((values === 'undefined' && dependentFieldValue !== '') || $.inArray(dependentFieldValue, values) !== -1) {
            _defaultShowFormSection(section, context);
        } else {
            _defaultHideFormSection(section, context);
        }
    }

    /**
     * Create field Dependencies
     * 
     * By default without providing initCallback or changeCallback dependsOn will hideshow fields based on dependent values list 
     * 
     * @param {string} field - field id
     * @param {string} dependentField - dependent field id
     * @param {array} values - array of values to check 
     * @param {window} context - window context
     * @param {function} initCallback - initial callback when first enabled (Optional)
     * @param {function} changeCallback - on change callback method (Optional)
     */
    function dependsOn(field, dependentField, values, context, initCallback, changeCallback) {


        //Select Dependent Field 
        var _dependentField = $(context.document.getElementById(dependentField));
        //var _dependentField = context.document.getElementById(dependentField); 



        // Initialize fields based on initCallback or defaultChangeCallback
        if (typeof initCallback === 'function') {
            initCallback(field, dependentField, values, context);
        } else {
            _defaultChangeCallback(field, dependentField, values, context);
        }


        //Set Change event on dependent field
        _dependentField.on('change', function () {
            console.log('Change Event On: ' + dependentField, _dependentField)
            if (typeof changeCallback === 'function') {
                changeCallback(field, dependentField, values, context);
            } else {

                _defaultChangeCallback(field, dependentField, values, context);
            }

        });

    }


    /**
     * Adds event listener to watch for postMessage with Success Message 
     *
     * @param {object} context Window Object
     */
    function reloadOnPostMessageSuccess(context) {

        context = context || window;
        console.log('set event listener for refresh on modal success');
        context.addEventListener("message", function (event) {
            console.log(event, event.origin, event.data, event.origin !== context.location.origin, context.location.origin);
            if (event.origin !== context.location.origin) {
                return;
            }
            if (typeof event.data === 'string' && event.data === 'Success') {
                context.location.reload();
            }

        }, false);
    }

    /**
     * Apply Depends On from Config
     * 
     * @param {object} config - validation config object
     */
    function applyDependsOn(config) {

        console.log('applyDependsOn', config.dependsOn);

        if (typeof config.dependsOn === 'object') {

            dependsOn(config.controltovalidate, config.dependsOn.field, config.dependsOn.values, config.context, config.dependsOn.initCallback, config.dependsOn.changeCallback);
        }
    }


    /**
     * Executes callback catches errors
     * 
     * @param {function} executable - function to execute
     * @return {boolean} - return true if successfully executed
     */
    function executeInitalization(executable) {
        try {

            if (typeof executable === 'string') {
                executeFunctionByName(executable);
                return true;
            }

            if (typeof executable !== 'function') return false;

            executable();
            return true;
        }
        catch (error) {
            console.error(error);
        }
        return false;
    }

    /**
     * Executes initialization scripts
     * */
    function executeInitalizationScripts() {

        if (typeof URB.initScripts === 'function') {
            executeInitalization(URB.initScripts);
        }



        if (URB.initScripts instanceof Array && URB.initScripts.length > 0) {

            for (var i = 0; i < URB.initScripts.length; i++) {
                executeInitalization(URB.initScripts[i]);
            }
        }

        console.log('URB initalization scripts executed');
    }

    /**
     * Excecute function By Name can utilize Name spaced notation to call function
     * Can also apply starting context
     * 
     * @param {any} functionName - Namespaced notation acceptable (ex My.NameSpace.functionName)
     * @param {any} context - executing context
     * @return {any} response from executed function
     */
    function executeFunctionByName(functionName, context /*, args */) {
        context = context || window;
        var args = Array.prototype.slice.call(arguments, 2);

        return getFunctionByName(functionName, context).apply(context, args);
    }


    /**
     *  Gets Function By Name utilizing namespaced notation
     *  
     * @param {any} functionName
     * @param {any} context
     * @return {function} - returns function
     */
    function getFunctionByName(functionName, context) {
        context = context || window;

        var namespaces = functionName.split(".");
        var func = namespaces.pop();
        for (var i = 0; i < namespaces.length; i++) {
            context = context[namespaces[i]];
        }

        return context[func];
    }

    /** 
     * Generate a GUID
     * @return {string} GUID - UUIDv4 Guid
     */
    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     *  Collapse Text Method using Bootstrap 3.3.7 collapse methods
     *  
     * @param {any} selector - query selector
     * @param {any} maxlength - max character length
     */
    function collapseText(selector, maxlength) {
        var regex = new RegExp('^(?:.|\s){1,' + maxlength + '}(?:\s|$)', "sm");

        document.querySelectorAll(selector).forEach(function (el) {
            //console.log(el.innerText);

            var match = el.innerHTML.match(regex)
            if (match && typeof match[0] !== 'undefined' /*&& el.innerText.length > maxlength && match[0].length <= maxlength*/) {
                var original = el.innerHTML;
                var newText = [];
                var textUid = uuidv4()
                newText.push('<div class="pre-text">')
                newText.push(original.substr(0, match[0].length).trim())

                if (el.innerHTML.length > maxlength && match[0].length <= maxlength) {
                    newText.push('<span id="' + textUid + '" class="collapse collapse-text">');
                    newText.push(original.substr(match[0].length));
                    newText.push('</span>');
                    newText.push('<br/><a role="button collapse-button" data-toggle="collapse" href="#' + textUid + '" aria-expanded="false" aria-controls="collapseButton"></a>');
                }

                newText.push('</div>')
                el.innerHTML = newText.join('');
            }
        })
    }



    /**
     *  Hide/Show Form Sections using DependsOn Field and values
     *  
     * @param {any} section
     * @param {any} dependentField
     * @param {any} values
     * @param {any} context
     * @param {any} initCallback
     * @param {any} changeCallback
     */
    function sectionDependsOn(section, dependentField, values, context, initCallback, changeCallback) {

        context = context || window;

        //Query Parent Element of section id which should be a fieldset
        var sectionEl = context.document.querySelector('[data-name="' + section + '"]').parentElement


        //Select Dependent Field 
        //var _dependentField = context.document.getElementById(dependentField);
        var _dependentField = $(context.document.getElementById(dependentField));

        console.log(sectionEl, _dependentField);
        //Must have valide section and dependent fields
        if (!sectionEl || !_dependentField) return;

        console.log('Executing Section Depends ON');

        // Initialize fields based on initCallback or defaultChangeCallback
        if (typeof initCallback === 'function') {
            initCallback(sectionEl, _dependentField, values, context);
        } else {
            _defaultSectionChangeCallback(sectionEl, _dependentField, values, context);
        }





        //Set Change event on dependent field
        _dependentField.on('change', function () {

            if (typeof changeCallback === 'function') {
                changeCallback(sectionEl, _dependentField, values, context);
            } else {

                _defaultSectionChangeCallback(sectionEl, _dependentField, values, context);
            }

        });




    }



    /**
     *  Hide/Show Form Sections using DependsOn Fields and Condition
     *  
     * @param {striing} section
     * @param {string|array} dependentFields
     * @param {function} condition
     * @param {window} context
     */
    function sectionDependsCondition(section, dependentFields, condition, context) {



        context = context || window;

        //Query Parent Element of section id which should be a fieldset
        var sectionEl = context.document.querySelector('[data-name="' + section + '"]').parentElement

        if (!Array.isArray(dependentFields)) {
            dependentFields = [dependentFields];
        }

        var _dependentFields = [];
        //Select Dependent Field 
        if (dependentFields) {
            dependentFields.forEach(function (dependentField) {
                if (context.document.getElementById(dependentField)) _dependentFields.push(context.document.getElementById(dependentField));
            })

        }

        //Set Current Section Display State
        if (condition()) {
            _defaultShowFormSection(sectionEl, context);
        } else {
            _defaultHideFormSection(sectionEl, context);
        }




        //Set Change event on dependent field
        _dependentFields.forEach(function (field) {
            field.addEventListener('change', function () {
                console.log('Section Condition Event Triggered')
                if (condition()) {
                    _defaultShowFormSection(sectionEl, context);
                } else {
                    _defaultHideFormSection(sectionEl, context);
                }

            });
        })
    }

    /**
    * Get entity Record from currently loaded EntityForm
    *
    *@param {object|window} context - current executing window context
    *@return {null|object|entity} Entity - returns entity object value
    */
    function getEntityFormRecord(context) {

        context = context || window;

        var parentEntity = null;

        var entityForm = context.document.getElementsByClassName('entity-form')[0] || null;

        //Entity
        if (entityForm !== null && entityForm.id === 'EntityFormView') {

            var entity = {
                entity: entityForm.querySelector('#EntityFormView_EntityName').value,
                type: 'lookup',
                value: entityForm.querySelector('#EntityFormView_EntityID').value,
                text: ""
            }

            return entity
        }

        // Entity Form
        if (entityForm !== null && entityForm.id !== 'EntityFormView') {

            var entityControlId = entityForm.id;

            var entity = {
                entity: entityForm.querySelector('#' + entityControlId + '_EntityName').value,
                type: 'lookup',
                value: entityForm.querySelector('#' + entityControlId + '_EntityID').value,
                text: ""
            }

            return entity
        }

        return null;
    }

    /**
    * Append Releated Entity Id to Query String of form action URL.
    *
    * @param (string) paramName - query parameter to be applied
    * @param (string) lookupField - id of lookup field - must have formControl applied 
    * @param (window|object) context - executing window context
    * @return void
    */
    function appendRelatedEntityIdToQuery(paramName, lookupField, context) {

        context = context || window;

        var field = context.document.getElementById(lookupField);
        var form = context.document.getElementById('liquid_form');
        var formActionUrl = form.action;

        if (field.formControl.value.value === '' || !form || !formActionUrl) return;

        if (formActionUrl.indexOf('&' + paramName + '=') === -1) {
            formActionUrl += '&' + paramName + '=' + field.formControl.value.value
            form.action = formActionUrl;
            return;
        }

        console.warn('parameter "' + paramName + '" already exists on form action url');
        return;
    }

    /**
     * Synchronous Sleep Method
     * 
     * @param {any} milliseconds - number of milliseconds to wait 
     */
    function sleep(milliseconds) {
        const date = Date.now();
        let currentDate = null;
        do {
            currentDate = Date.now();
        } while (currentDate - date < milliseconds);
    }



    /**
     * Update Record utilizing Portal WebAPI 
     * 
     * @param {string} entity - entity plural schema name for api
     * @param {string} recordId - record GUID
     * @param {object} data - data payload to update
     */
    function updateDataOnEntity(entity, recordId, data) {

        return webapi.safeAjax({
            type: "PATCH",
            url: "/_api/" + entity + "(" + recordId + ")",
            contentType: "application/json",
            async: false,
            data: JSON.stringify(data),
            success: function (res) {
                console.log(res);
                return res;
            }
        });

    }

   

    function uploadSharePointFile(sharepointAddFileURL, formData, callback) {

        var recordToUpdateId = arguments[3];
        var futherCallback = arguments[4];

        webapi.safeAjax({
            type: "POST",
            url: sharepointAddFileURL,
            contentType: false,
            processData: false,
            data: formData,
            success: function (res) {
                console.log(res);
            },
            complete: function (data) {
                callback(recordToUpdateId, futherCallback);
            }
        });
    }

    function enablePhoneNumberMasking(field, context) {

        context = context || window;

        if (URB.Validate.isString(field)) {
            field = context.document.getElementById(field);
        }

        if (!field instanceof context.HTMLElement) {
            console.error('Field is not a HTMLElement');
            return false;
        }

        var cleave = new Cleave(field, {
            blocks: [0, 3, 0, 3, 4],
            delimiters: ['(', ')', ' ', '-'],
            swapHiddenInput: true
        });
    }

    function enableSnnMasking(field, context) {
        context = context || window;

        if (URB.Validate.isString(field)) {
            field = context.document.getElementById(field);
        }

        if (!field instanceof context.HTMLElement) {
            console.error('Field is not a HTMLElement');
            return false;
        }

        var cleave = new Cleave(field, {
            blocks: [3, 2, 4],
            delimiters: ['-', '-'],
            swapHiddenInput: true
        });
    }

    /**
     * Require FIeld if dependent field value is set
     * 
     * @param {string} field - dependent field id
     * @param {any|array} values - value(s)
     * @param {string|null} validatorField - validation field default null 
     * @return {function} - Validator Method
     */
    function requireFieldIfDependentFieldValue(field, values, validatorField) {

        validatorField = validatorField || null;


        if (!Array.isArray(values)) {
            values = [values];
        }

        var validatorFieldEl = document.getElementById(validatorField);

        if (validatorFieldEl && validatorFieldEl.formControl) {
            var fieldInfoEl = validatorFieldEl.formControl.controlContainer.querySelector('.info');

            var dependentField = document.getElementById(field);
            var dependentFieldValue = dependentField.formControl.value.value;

            //On Load Execute Required Field Check
            if (dependentField && $.inArray(dependentFieldValue, values) !== -1) {
                fieldInfoEl.classList.add('required');
            } else {
                fieldInfoEl.classList.remove('required');
            }


            //Set Change event on dependent field
            dependentField.addEventListener('change', function () {
                var dependentFieldValue = dependentField.formControl.value.value;

                if (dependentField && $.inArray(dependentFieldValue, values) !== -1) {
                    fieldInfoEl.classList.add('required');
                } else {
                    fieldInfoEl.classList.remove('required');
                }

            });
        }


        return function (val) {
            var fieldEl = document.getElementById(field);
            var fieldValue = fieldEl.formControl.value.value;
            console.log("field value: " + fieldValue);

            if (fieldEl && $.inArray(fieldValue, values) !== -1) {
                return val.ownerDocument.defaultView.RequiredFieldValidatorEvaluateIsValid(val);
            } else {
                return true;
            }
        };
    }

    function requiredAllConditions(validators) {

        if (!Array.isArray(validators)) {
            console.log('Validators is not an array');
            return function () { return true; }; // return default validation method
        }

        return function (val) {

            return validators.every(function (validator) {

                return validator(val);
            });

        };

    }

    /**
    * Validates requires checkbox be true/checked
    *
    * @param {object} val validator DOM object
    * @return {boolean} - returns boolean validation status
    */
    function requireCheckboxTrue(val) {
        var control = val.ownerDocument.getElementById(val.controltovalidate);

        return control.formControl.value.value;

    }


    /**
     * condition check if field Value is within list of given values
     * @param {string} field
     * @param {any|array} values
     * @return {function} condition function
     */
    function conditionFieldEqualValue(field, values, context) {

        context = context || window;

        if (!Array.isArray(values)) {
            values = [values];
        }

        var fieldEl = context.document.getElementById(field);



        return function () {
            var fieldValue = fieldEl.formControl.value.value;
            console.log(field + " field value: " + fieldValue);
            return (fieldEl && $.inArray(fieldValue, values) !== -1);
        }
    }


    /**
     * condition check if field Value does not equal a value within the given values
     * @param {string} field
     * @param {any|array} values
     * @return {function} condition function
     */
    function conditionFieldNotEqualValue(field, values, context) {

        if (!Array.isArray(values)) {
            values = [values];
        }


        return function () { return !conditionFieldEqualValue(field, values, context)() }
    }

    /**
     * Checks if array of conditions are all true
     * @param {any} conditions
     * @return {function} condition function
     */
    function conditionAll(conditions) {

        if (!Array.isArray(conditions)) {
            conditions = [conditions];
        }

        return function () { return conditions.every(function (val) { return typeof value === 'boolean' ? val : !!val() }) }
    }

    /**
     * Checks if array of conditions any are true
     * @param {any} conditions
     * @return {function} condition function
     */
    function conditionAny(conditions) {
        if (!Array.isArray(conditions)) {
            conditions = [conditions];
        }

        return function () { return conditions.some(function (val) { return typeof value === 'boolean' ? val : !!val() }) }
    }

    /* Returned Public Methods and Properties */
    return {
        addValidator: addValidator,
        createValidation: createValidation,
        createValidationFromConfig: createValidationFromConfig,
        createValidationsFromConfigArray: createValidationsFromConfigArray,
        dependsOn: dependsOn,
        sectionDependsOn: sectionDependsOn,
        sectionDependsCondition: sectionDependsCondition,
        reloadOnPostMessageSuccess: reloadOnPostMessageSuccess,
        executeInitalizationScripts: executeInitalizationScripts,
        getEntityFormRecord: getEntityFormRecord,
        appendRelatedEntityIdToQuery: appendRelatedEntityIdToQuery,
        /**
         * Misc Methods
         */
        collapseText: collapseText,
        uuidv4: uuidv4,
        updateDataOnEntity: updateDataOnEntity,
        updateDataOnApplication: updateDataOnApplication,
        triggerApplicationValidationCheck: triggerApplicationValidationCheck,
        uploadSharePointFile: uploadSharePointFile,
        sleep: sleep,
        enablePhoneNumberMasking: enablePhoneNumberMasking,
        enableSnnMasking: enableSnnMasking,
        defaultShowFormContainer: _defaultShowFormContainer,
        defaultHideFormContainer: _defaultHideFormContainer,
        /**
         * Validators
         */
        Validators: {
            requireFieldValidatorIfNotHidden: requireFieldValidatorIfNotHidden,
            requireFieldsOrValidator: requireFieldsOrValidator,
            requireFieldIfDependentFieldValue: requireFieldIfDependentFieldValue,
            requiredAllConditions: requiredAllConditions,
            requireValidatorMethodIfNotHidden: requireValidatorMethodIfNotHidden,
            requireCheckboxTrue: requireCheckboxTrue,
            requireValidatorMethodIfConditionTrue: requireValidatorMethodIfConditionTrue,
            conditionFieldEqualValue: conditionFieldEqualValue,
            conditionFieldNotEqualValue: conditionFieldNotEqualValue,
            conditionAll: conditionAll,
            conditionAny: conditionAny,
            dependsOnFieldContainsData: dependsOnFieldContainsData,
            dependsOnFieldDoesNotContainsData: dependsOnFieldDoesNotContainsData
        },
        /** 
         * Client/Project Extention Methods
         */
        Extensions: {

        }

    };


}(jQuery, window, document));

// Execute Initialization
URB.Portal.Utility.executeInitalizationScripts();

//Initialize Namespaces
URB.Portal.Accessibility = URB.Portal.Accessibility || {};
URB.Portal.Accessibility.FontResizer = URB.Portal.Accessibility.FontResizer || {};

(function() {
    
    const _INSTANCES = new Map();
    const _FONT_SIZE_COOKIE = 'font-resizer';

    this.initialize = async function(element) {

        element = element || document.querySelector('body');
        let currentFontSize = parseFloat(getComputedStyle(element).getPropertyValue('font-size').replace('px','')) || 16;

        element.fontResizer = {
            element: element,
            defaultFontSize: parseFloat(element.dataset?.defaultFontSize) || 16,
            getCurrentComputedFontSize: getCurrentComputedFontSize,
            setSize: setSize,
            incrementSize: incrementSize,
            resetToDefaultFontSize:resetToDefaultFontSize,
            persistCurrentFont:persistCurrentFont,
            removeCurrentFontCookie:removeCurrentFontCookie
        }

        element.addEventListener('click',function(e) {
            if(e.target && e.target.matches('.font-resize-action')) {
                currentFontSize = resizeFontActionClick(this.fontResizer, e.target);
            }
        });

        _INSTANCES.set(element,element.fontResizer);
    }

    this.getInstances = function() {
        return _INSTANCES;
    }


    function getCurrentComputedFontSize() {
        return parseFloat(getComputedStyle(this.element).getPropertyValue('font-size').replace('px',''));
    }

    function resetToDefaultFontSize() {
        this.element.style['font-size'] = this.defaultFontSize+'px';
    }

    /**
    *  Set font size property on element
    *  
    * @param {int} size - font size in pixels 
    * 
    */
    function setSize(size) {
        this.element.style['font-size'] = size+'px';
    }

    /**
    *  Increment and set font size property on element
    *  
    * @param {int} increment - incrementing value to set font size 
    * 
    */
    function incrementSize(increment) {
        this.setSize(this.getCurrentComputedFontSize() + increment);
    }
    
    function resizeFontActionClick(instance, target) {
        let action = target.dataset?.resizeAction || 'reset';
        let increment = parseFloat(target.dataset?.resizeIncrement) || 2;
        
        if(action === 'reset') {
            instance.resetToDefaultFontSize();
            instance.removeCurrentFontCookie();
        } else {
            instance.incrementSize(increment);
            instance.persistCurrentFont(instance.getCurrentComputedFontSize())
        }

        return instance.getCurrentComputedFontSize();
    }

    function persistCurrentFont(fontSize) {
        setCookie(_FONT_SIZE_COOKIE,fontSize,30);
    }

    function removeCurrentFontCookie() {
        removeCookie(_FONT_SIZE_COOKIE);
    }

    function setCookie(name,value,days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
        return value;
    }
    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    function removeCookie(name) {
        document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
    
    
}).call(URB.Portal.Accessibility.FontResizer);
