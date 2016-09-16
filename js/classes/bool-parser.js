
import {Parser} from './parser.js';
import {AndNode, OrNode, NotNode} from './nodes.js';
import {VariableNode, TrueNode, FalseNode} from './bool-nodes.js';


/**
 * Parses a boolean expression
 *
 * <or> ::= <and> ( "v" <or> )?
 * <and> ::= "~"? <exp> ( "^" <or> )?
 * <exp> ::= "0" | "1" | "A" | "B" | ... | "Z"
 * <exp> ::= "(" <or> ")"
 */
export class BooleanParser extends Parser {

	/**
	 * @constructor
	 * @param {string} exp
	 */
	constructor(exp) {

		let tokens = exp.match(/[A-Za-z_]\w*|[v^~01()]/g);
		super(tokens);

		this._vars = [];
	}

	/**
	 * Create a new variable node with a given label, if one
	 * does not already exist
	 * @param {string} label Label for the variable node
	 * @returns {VariableNode} Either a newly-created or an existing variable node
	 */
	create_var(label) {
		let node;

		for (let v of this._vars) {
			if (v.label === label) {
				return v;
			}
		}

		node = new VariableNode(label, null);
		this._vars.push(node);
		return node;
	}

	/**
	 * Retrieve the list of variables
	 * @returns {Array} list of variables used in the expression
	 */
	get_vars() {
		return this._vars;
	}

	/**
	 * Parse an expression node
	 *
	 * <exp> ::= "A" | "B" | ... | "Z"
	 * <exp> ::= "(" <e1> ")"
	 *
	 * @returns {Node}
	 * @private
	 */
	_parse_exp() {
		let node;

		if (this.peek() === '(') {
			this.next();
			node = this._parse_or();

			if (this.peek() !== ')') {
				throw new Error('Closing parenthesis not found');
			}

			this.next();

		} else if (this.peek().match(/[A-Za-z_]\w*|[01]/)) {
			let var_label = this.peek();

			if (var_label === '1') {
				node = new TrueNode();
			} else if (var_label === '0') {
				node = new FalseNode();
			} else {
				node = this.create_var(var_label);
			}

			this.next();
		}

		return node;
	}

	/**
	 * Parse an and node
	 *
	 * <and> ::= "~"? <exp> ( "^" <or> )?
	 *
	 * @returns {Node}
	 * @private
	 */
	_parse_and() {
		let node;

		if (this.peek() === '~') {
			this.next();
			node = this._parse_exp();
			node = new NotNode(node);
		} else {
			node = this._parse_exp();
		}

		if (this.peek() === '^') {
			this.next();
			let term = this._parse_and();
			node = new AndNode(node, term);
		}

		return node;
	}

	/**
	 * Parse an or node
	 *
	 * <or> ::= <and> ( "v" <or> )?
	 *
	 * @returns {Node}
	 * @private
	 */
	_parse_or() {
		let node = this._parse_and();

		if (this.peek() === 'v') {
			this.next();
			let term = this._parse_or();
			node = new OrNode(node, term);
		}

		return node;
	}

	/**
	 * Parse the tokens
	 *
	 * @returns {Node}
	 * @private
	 */
	_parse() {
		return this._parse_or();
	}
}

