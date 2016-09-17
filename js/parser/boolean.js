
import {Parser} from './base';
import {Lexer, token_types} from './lexer';
import {AndNode, OrNode} from '../nodes/binary';
import {NotNode} from '../nodes/unary';
import {ValueNode, VariableNode} from '../nodes/value';


/**
 * Parses a boolean expression
 *
 * <or>  ::= <and> ( "v" <or> )?
 * <and> ::= "~"? <exp> ( "^" <or> )?
 * <exp> ::= [a-zA-Z_][a-zA-Z0-9_]*
 * <exp> ::= "(" <or> ")"
 */
export class BooleanParser extends Parser {

	/**
	 * @constructor
	 * @param {string} exp
	 */
	constructor(exp) {
		let lexer = new Lexer(exp);
		let tokens = lexer.read_all();
		console.log('tokens: ' + tokens);

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

		if (this.peek() === token_types.OPEN_BR) {
			this.next();
			node = this._parse_or();

			if (this.peek() !== token_types.CLOSE_BR) {
				throw new Error('Closing parenthesis not found');
			}

			this.next();

		} else if (this.peek() === token_types.VAR) {
			let var_label = this.peek_symbol().value;
			node = this.create_var(var_label);
			this.next();
		} else if (this.peek() === token_types.CONST) {
			node = new ValueNode(this.peek_symbol().value !== '0');
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

		if (this.peek() === token_types.OP_NOT) {
			this.next();
			node = this._parse_exp();
			node = new NotNode(node);
		} else {
			node = this._parse_exp();
		}

		if (this.peek() === token_types.OP_AND) {
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

		if (this.peek() === token_types.OP_OR) {
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

