import {Parser} from './base';
import {Lexer, token_types} from './lexer';
import {InvalidInputError} from './exceptions';

import {BinaryNode, AndNode, OrNode, XOrNode, EquivNode, ImpliesNode, ProvidedNode} from '../nodes/binary';
import {UnaryNode, NotNode} from '../nodes/unary';
import {ValueNode, VariableNode} from '../nodes/value';

/**
 * Parses a boolean expression
 *
 * <or>  ::= <and> ( ("∨" | "⊻") <or> )?
 * <and> ::= "~"? <exp> ( ("∧" | "≡" | "⇒" | "⇐")  <or> )?
 * <exp> ::= [a-zA-Z_][a-zA-Z0-9_]* | 0 | 1
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

		tokens.reverse();
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
	 * <exp> ::= [a-zA-Z_][a-zA-Z0-9_]* | 0 | 1
	 * <exp> ::= "(" <or> ")"
	 *
	 * @returns {Node}
	 * @private
	 */
	_parse_exp() {
		let node;
		let next = this.peek();

		if (next === token_types.CLOSE_BR) {
			this.next();
			node = this._parse_or();

			if (this.peek() !== token_types.OPEN_BR) {
				throw new InvalidInputError('Expression contains unmatched parenthesis');
			}

			this.next();

		} else if (next === token_types.VAR) {
			let var_label = this.peek_symbol().value;
			node = this.create_var(var_label);
			this.next();

		} else if (next === token_types.CONST_TRUE) {
			node = new ValueNode(true);
			this.next();

		} else if (next === token_types.CONST_FALSE) {
			node = new ValueNode(false);
			this.next();
		}

		return node;
	}

	/**
	 * Parse an AND node
	 *
	 * <and> ::= "~"? <exp> ( ("∧" | "≡" | "⇒" | "⇐")  <or> )?
	 *
	 * @returns {Node}
	 * @private
	 */
	_parse_and() {

		// Begin by parsing the initial node
		let node = this._parse_exp();

		// If there is a not operator following, apply it to the previous node (remember, we are working in reverse)
		if (this.peek() === token_types.OP_NOT) {
			this.next();
			node = new NotNode(node);
		}

		// Store the value of the next node so we don't need to keep calling this
		let peek = this.peek();

		if (peek === token_types.OP_AND || peek === token_types.OP_EQUIV || peek === token_types.OP_IMPLIES || peek === token_types.OP_PROVIDED) {
			this.next();
			let term = this._parse_and();

			if (peek === token_types.OP_EQUIV) {
				node = new EquivNode(term, node);

			} else if (peek === token_types.OP_IMPLIES) {
				node = new ImpliesNode(term, node);

			} else if (peek === token_types.OP_PROVIDED) {
				node = new ProvidedNode(term, node);

			} else {
				node = new AndNode(term, node);
			}
		}

		return node;
	}

	/**
	 * Parse an OR node
	 *
	 * <or> ::= <and> ( ("∨" | "⊻") <or> )?
	 *
	 * @returns {Node}
	 * @private
	 */
	_parse_or() {
		let node = this._parse_and();
		let peek = this.peek();

		if (peek === token_types.OP_OR || peek === token_types.OP_XOR) {
			this.next();
			let term = this._parse_or();

			if (peek === token_types.OP_XOR) {
				node = new XOrNode(term, node);
			} else {
				node = new OrNode(term, node);
			}
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
		let node = this._parse_or();
		this._vars.reverse();
		return node;
	}

	/**
	 * Traverse a node tree and construct a list of the nodes
	 * @param {Node} node The root node of the tree
	 * @param {Set} list List to store the node objects in
	 */
	static traverse_tree(node, list) {

		if (node === null || node instanceof ValueNode) {
			return;
		}

		list.add(node);

		if (node instanceof UnaryNode) {
			BooleanParser.traverse_tree(node.child, list);
		} else if (node instanceof BinaryNode) {
			BooleanParser.traverse_tree(node.left, list);
			BooleanParser.traverse_tree(node.right, list);
		}
	}
}

