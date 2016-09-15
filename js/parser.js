
export class Parser {

    constructor(tokens) {
        this.tokens = tokens;
        this.length = tokens.length;
        this.current = 0;
    }

    end() {
        return this.current == this.length;
    }

    peek() {
        return this.end() ? null : this.tokens[this.current];
    }

    next(token) {

        if (token) {
            if (this.peek(token) == token) {
                this.next();
                return true;
            }

            return false;
        }

        if (!this.end()) {
            ++this.current;
        }
    }

    parse() {
        let node = this._parse();

        if (! this.end()) {
            throw new Error('extra content found at end of input');
        }

        return node;
    }

    _parse() {
        throw new TypeError('_parse() method not implemented');
    }
}


export class Node {

    constructor(left, right) {
        this.left = left;
        this.right = right;
    }

    eval() {
        throw TypeError('eval() method not implemented');
    }
}

