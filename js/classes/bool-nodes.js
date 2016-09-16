
import {Node} from './nodes.js';

/**
 * Represents a variable boolean value
 */
export class VariableNode extends Node {

	/**
	 * @constructor
	 * @param {string} label Node label
	 * @param {boolean|null} value Value of the node
	 */
	constructor(label, value) {
		super(null, null);
		this.label = label;
		this.value = value || null;
	}

	/**
	 * Set the value property
	 *
	 * If the value is not a valid boolean, then it will be set to null
	 *
	 * @param {boolean|null} value
	 */
	set value(value) {

		if (typeof(value) !== 'boolean') {
			value = null;
		}

		this._value = value;
	}

	/**
	 * Retrieve the node's value
	 * @returns {boolean|null}
	 */
	get value() {
		return this._value;
	}

	/**
	 * Evaluate the node
	 * @throws {Error} If the node value is null
	 * @returns {boolean} Value of the node
	 *
	 */
	eval() {
		if (this.value === null) {
			throw new Error('Variable Node "' + this.label + '" cannot be null')
		}

		return this.value;
	}

	/**
	 * Retrieve a string representation of the node
	 * @returns {string}
	 */
	toString() {
		return this.label + '(' + this.value + ')';
	}
}

/**
 * Node representing a true boolean value
 */
export class TrueNode extends Node {

	/**
	 * @constructor
	 */
	constructor() {
		super(null, null);
	}

	/**
	 * Evaluate the node
	 * @returns {boolean}
	 */
	eval() {
		return true;
	}

	/**
	 * Retrieve a string representation of the node
	 * @returns {string}
	 */
	toString() {
		return '1';
	}
}

/**
 * Node representing a false boolean value
 */
export class FalseNode extends Node {

	/**
	 * @constructor
	 */
	constructor() {
		super(null, null);
	}

	/**
	 * Evaluate the node
	 * @returns {boolean}
	 */
	eval() {
		return false;
	}

	/**
	 * Retrieve a string representation of the node
	 * @returns {string}
	 */
	toString() {
		return '0';
	}
}
