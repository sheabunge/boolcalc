
import {Node} from './node.js';

/**
 * Represents a boolean value
 */
export class BoolNode extends Node {

	/**
	 * @constructor
	 * @param {string} label Node label
	 */
	constructor(label) {
		super(null, null);
		this.label = label;
		this._value = null;

		if (label === '0' || label === '1') {
			this.value = '0' !== label;
		}
	}

	set value(value) {

		if (value !== null && typeof(value) !== 'boolean') {
			throw new TypeError('Node value must be boolean');
		}

		this._value = value;
	}

	get value() {
		return this._value;
	}

	/**
	 * Evaluate the node
	 * @returns {boolean} Value of the node
	 */
	eval() {
		return this.value;
	}

	toString() {
		return this.label + '(' + this.value + ')';
	}
}

/**
 * Represents an "and" node
 */
export class AndNode extends Node {

	/**
	 * Evaluate the node
	 * @returns {boolean} The result of (L ^ R)
	 */
	eval() {
		return this.left.eval() && this.right.eval();
	}

	toString() {
		return this.left.toString() + ' ^ ' + this.right.toString();
	}
}

/**
 * Represents an "or" node
 */
export class OrNode extends Node {

	/**
	 * Evaluates the node
	 * @returns {boolean} The result of (L v R)
	 */
	eval() {
		return this.left.eval() || this.right.eval();
	}

	toString() {
		return this.left.toString() + ' v ' + this.right.toString();
	}
}
