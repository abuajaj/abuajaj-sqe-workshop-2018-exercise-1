/* eslint-disable complexity */
import {parseCode} from './code-analyzer';

/**
 * Node of statement code
 */
class Node {
    constructor(line, type, title, condition, value) {
        this.line      = line;
        this.type      = type;
        this.title     = title;
        this.condition = condition;
        this.value     = value;
    }
}

// Code Parser
export default class Parser {

    constructor(input) {
        this.input       = input;
        this.nodes       = [];
        this.currentLine = 1;
        this.parsedCode  = null;
    }

    // Build the Parser
    build() {
        this.parsedCode = parseCode(this.input);
        // Functions
        for (let i = 0; i < this.parsedCode.body.length; i++) {
            this.buildRecursive(this.parsedCode.body[i]);
        }
    }

    // Build structure of parser in recursive way..
    buildRecursive(data) {
        if ('BlockStatement' !== data.type) this.buildNode(data);

        if (!data.body) return;

        if (Array.isArray(data.body)) for (let i = 0; i < data.body.length; i++) this.buildRecursive(data.body[i]);
        else this.buildRecursive(data.body);
    }

    // Build the relevant node & append to nodes list
    buildNode(data) {
        if ('FunctionDeclaration' === data.type) this.functionDeclarationNode(data);
        if ('VariableDeclaration' === data.type) this.variableDeclarationNode(data);
        if ('ExpressionStatement' === data.type) this.expressionStatementNode(data);
        if ('WhileStatement' === data.type) this.whileStatementNode(data);
        if ('ForStatement' === data.type) this.forStatementNode(data);
        if ('IfStatement' === data.type || 'ElseIfStatement' === data.type) this.ifStatementNode(data);
        if ('ReturnStatement' === data.type) this.returnStatementNode(data);
    }

    //
    functionDeclarationNode(data) {
        let node = new Node(this.currentLine, data.type, data.id.name, '', '');
        this.nodes.push(node);
        // Add variables declaration
        for (let i = 0; i < data.params.length; i++) {
            let result = this.expressionStatementRecursive(data.params[i]);
            let name   = data.params[i].name, value = '';
            if (result.leftName && result.rightName) {
                name  = result.leftName;
                value = result.rightName;
            }
            this.nodes.push(new Node(this.currentLine, 'VariableDeclaration', name, '', value));
        }
        this.currentLine++;
    }

    //
    variableDeclarationNode(data) {
        let value = null;
        // Add variables declaration
        for (let i = 0; i < data.declarations.length; i++) {
            if (!data.declarations[i].init)
                value = 'null (or nothing)';
            else if ('Literal' === data.declarations[i].init.type)
                value = data.declarations[i].init.raw;
            else if ('ArrayExpression' === data.declarations[i].init.type)
                value = 'Array(' + data.declarations[i].init.elements.length + ')';
            else if ('VariableDeclarator' === data.declarations[i].type) {
                value = this.expressionStatementRecursive(data.declarations[i].init);
            }
            this.nodes.push(new Node(this.currentLine, 'VariableDeclaration', data.declarations[i].id.name, '', value));
        }
        this.currentLine++;
    }

    //
    expressionStatementNode(data) {
        let result     = this.expressionStatementRecursive(data);
        let expression = null;
        if ('ExpressionStatement' === data.type) expression = data.expression; else expression = data;

        this.nodes.push(new Node(this.currentLine++, expression.type, result.leftName, '', result.rightName));
    }

    //
    expressionStatementRecursive(data) {
        if ('Identifier' === data.type) return data.name;
        if ('Literal' === data.type) return data.raw;
        if ('MemberExpression' === data.type) {
            if (data.computed) return this.expressionStatementRecursive(data.object) + '[' + this.expressionStatementRecursive(data.property) + ']';
            else return this.expressionStatementRecursive(data.object) + '.' + this.expressionStatementRecursive(data.property);
        }
        if ('UnaryExpression' === data.type) {
            if (data.operator) return data.operator + data.argument.raw;
        }
        if ('UpdateExpression' === data.type) return {'leftName' : data.argument.name, 'rightName': data.argument.name + ' ' + data.operator};
        if ('BinaryExpression' === data.type) return this.expressionStatementRecursive(data.left) + ' ' + data.operator + ' ' + this.expressionStatementRecursive(data.right);
        let expression = null;
        if ('ExpressionStatement' === data.type) expression = data.expression; else expression = data;
        if (!expression.left && !expression.right) return this.expressionStatementRecursive(expression);
        return {'leftName' : this.expressionStatementRecursive(expression.left), 'rightName': this.expressionStatementRecursive(expression.right), 'operator' : 'LogicalExpression' === data.type ? data.operator : ''};
    }

    //
    whileStatementNode(data) {
        let conditions = this.expressionStatementRecursive(data.test);
        this.nodes.push(new Node(this.currentLine++, data.type, '', this.conditionRecursive(conditions), ''));
    }

    //
    conditionRecursive(data) {
        if (!data.leftName && !data.rightName) return data;
        return this.conditionRecursive(data.leftName) + ' ' + data.operator + ' ' + this.conditionRecursive(data.rightName);
    }

    //
    forStatementNode(data) {
        let conditions = this.expressionStatementRecursive(data.test);
        // Add the for
        this.nodes.push(new Node(this.currentLine, data.type, '', this.conditionRecursive(conditions), ''));
        // Add the for's init variables
        this.variableDeclarationNode(data.init);
    }

    //
    ifStatementNode(data) {
        let test = this.expressionStatementRecursive(data.test);
        this.nodes.push(new Node(this.currentLine++, data.type, '', '', test));

        if (data.consequent) this.buildRecursive(data.consequent);

        if (data.alternate) {
            if ('IfStatement' === data.alternate.type) data.alternate.type = 'Else' + data.alternate.type;
            else this.nodes.push(new Node(this.currentLine++, 'Else', '', '', ''));

            this.buildRecursive(data.alternate);
        }
    }

    //
    returnStatementNode(data) {
        let result = this.expressionStatementRecursive(data.argument);
        this.nodes.push(new Node(this.currentLine++, data.type, '', '', result));
    }

    // Build & Render the HTML
    render() {
        let html = '';
        for (let i = 0; i < this.nodes.length; i++) {
            html += '<tr>';
            html += '<th scope="row">' + this.nodes[i].line + '</th>';
            html += ' <td>' + this.nodes[i].type + '</td>';
            html += ' <td>' + this.nodes[i].title + '</td>';
            html += ' <td>' + this.nodes[i].condition + '</td>';
            html += ' <td>' + this.nodes[i].value + '</td>';
            html += '</tr>';
        }

        return html;
    }
}