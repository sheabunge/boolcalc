import {Node} from './base';
import {ParseError} from '../parser/exceptions';

/**
 * Node representing a value
 */
export class ValueNode extends Node {

	/**
	 * @constructor
	 * @param {boolean|null} value The value that this node represents
	 */
	constructor(value) {
		super();
		this.value = value;
	}

	/**
	 * Set the value property
	 *
	 * If the value is not a valid boolean, then it will be set to null
	 *
	 * @param {boolean|null} value
	 */
	set value(value) {
		this._value = typeof(value) === 'boolean' ? value : null;
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
	 * @throws {ParseError} If the node value is null
	 * @returns {boolean} Value of the node
	 *
	 */
	evalValue() {
		if (null === this.value) {
			throw new ParseError('Value of node cannot be null')
		}

		return this.value;
	}

	/**
	 * Retrieve a string representation of the node
	 * @returns {string}
	 */
	toString() {
		return this.value ? '1' : '0';
	}
}

/**
 * Represents a variable boolean value with an attached label
 */
export class VariableNode extends ValueNode {

	/**
	 * @constructor
	 * @param {string} label Node label
	 * @param {boolean|null} value Value of the node
	 */
	constructor(label, value) {
		super(value);
		this.label = label;
	}

	/**
	 * Retrieve a string representation of the node
	 * @returns {string}
	 */
	toStringDebug() {
		return this.label + '(' + this.value + ')';
	}

	/**
	 * Retrieve a string representation of the node
	 * @returns {string}
	 */
	toString() {
		return this.label;
	}
}
