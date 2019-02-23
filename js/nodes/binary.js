import {Node} from './base';

/**
 * Represents a node with two children
 */
export class BinaryNode extends Node {

	/**
	 * @constructor
	 * @param {Node} left
	 * @param {Node} right
	 */
	constructor(left, right) {
		super();
		this.left = left;
		this.right = right;
	}

	/**
	 * Returns a string representation of the node
	 * @returns {string}
	 */
	toString() {
		return 'Node(' + this.left + ', ' + this.right + ')'
	}

	static wrapNode(node) {
		let s = node.toString();

		// ensure that OR nodes have brackets to maintain precedence
		if (node instanceof OrNode || node instanceof XOrNode) {
			s = '(' + s + ')';
		}

		return s;
	}

	/**
	 * Evaluate the node
	 * @abstract
	 * @returns {*}
	 */
	evalValue() {
		return super.evalValue();
	}
}

/**
 * Represents an "and" node
 */
export class AndNode extends BinaryNode {

	/**
	 * Evaluate the node
	 * @returns {boolean} The result of (L ∧ R)
	 */
	evalValue() {
		return this.left.evalValue() && this.right.evalValue();
	}

	/**
	 * Returns a string representation of the node
	 * @returns {string}
	 */
	toString() {
		return BinaryNode.wrapNode(this.left) + ' ∧ ' + BinaryNode.wrapNode(this.right);
	}
}

/**
 * Represents an OR node
 */
export class OrNode extends BinaryNode {

	/**
	 * Evaluates the node
	 * @returns {boolean} The result of (L ∨ R)
	 */
	evalValue() {
		return this.left.evalValue() || this.right.evalValue();
	}

	/**
	 * Returns a string representation of the node
	 * @returns {string}
	 */
	toString() {
		return this.left + ' ∨ ' + this.right;
	}
}

/**
 * Represents an XOR node
 */
export class XOrNode extends BinaryNode {

	/**
	 * Evaluates the node
	 * @returns {boolean} The result of (L ⊻ R)
	 */
	evalValue() {
		return this.left.evalValue() ? !this.right.evalValue() : this.right.evalValue();
	}

	/**
	 * Returns a string representation of the node
	 * @returns {string}
	 */
	toString() {
		return this.left + ' ⊻ ' + this.right;
	}
}

/**
 * Represents a equivalence node
 */
export class EquivNode extends BinaryNode {

	/**
	 * Evaluates the node
	 * @returns {boolean} The result of (L ≡ R)
	 */
	evalValue() {
		return this.left.evalValue() === this.right.evalValue();
	}

	/**
	 * Returns a string representation of the node
	 * @returns {string}
	 */
	toString() {
		return BinaryNode.wrapNode(this.left) + ' ≡ ' + BinaryNode.wrapNode(this.right);
	}
}

/**
 * Represents an implication node
 */
export class ImpliesNode extends BinaryNode {

	/**
	 * Evaluates the node
	 * @returns {boolean} The result of (L → R)
	 */
	evalValue() {
		return this.left.evalValue() ? this.right.evalValue() : true;
	}

	/**
	 * Returns a string representation of the node
	 * @returns {string}
	 */
	toString() {
		return BinaryNode.wrapNode(this.left) + ' → ' + BinaryNode.wrapNode(this.right);
	}
}

/**
 * Represents a provided operation node
 */
export class ProvidedNode extends BinaryNode {

	/**
	 * Evaluates the node
	 * @returns {boolean} The result of (L ← R)
	 */
	evalValue() {
		const a = this.left.evalValue();
		const b = this.right.evalValue();
		return (a && b) || !b;
	}

	/**
	 * Returns a string representation of the node
	 * @returns {string}
	 */
	toString() {
		return BinaryNode.wrapNode(this.left) + ' ← ' + BinaryNode.wrapNode(this.right);
	}
}
