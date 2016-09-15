
import {Parser} from './parser.js';
import {BoolNode, AndNode, OrNode} from './bool-nodes.js';

/**
 * Parses a boolean expression
 *
 * <or> ::= <and> ( "v" <or> )?
 * <and> ::= <exp> ( "^" <or> )?
 * <exp> ::= "0" | "1" | "A" | "B" | ... | "Z"
 * <exp> ::= "(" <or> ")"
 */
export class BooleanParser extends Parser {

	/**
	 * @constructor
	 * @param {string} tokens
	 */
	constructor(tokens) {
		tokens = tokens.replace(/\s+/g, '');
		super(tokens);
		this.vars = [];
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

		} else if (this.peek().match(/[01A-Z]/)) {
			let var_name = this.peek();
			node = new BoolNode(var_name);

			this.vars.push(node);
			this.next();
		}

		return node;
	}

	/**
	 * Parse an and node
	 *
	 * <and> ::= <e3> ( "^" <e1> )?
	 *
	 * @returns {Node}
	 * @private
	 */
	_parse_and() {
		let node = this._parse_exp();

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
	 * <e1> ::= <e2> ( "v" <e1> )?
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

