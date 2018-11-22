import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';
import Parser from '../src/js/parser';

describe('The javascript parser', () => {
    it('is parsing an empty function correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('')),
            '{"type":"Program","body":[],"sourceType":"script"}'
        );
    });

    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('let a = 1;')),
            '{"type":"Program","body":[{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"a"},"init":{"type":"Literal","value":1,"raw":"1"}}],"kind":"let"}],"sourceType":"script"}'
        );
    });
});

describe('The parser', () => {
    it('is parsing assignment correctly', () => {
        let parser = new Parser('high = n - 1;');
        parser.build();
        assert.equal(JSON.stringify(parser.nodes), '[{"line":1,"type":"AssignmentExpression","title":"high","condition":"","value":"n - 1"}]');
    });
    it('is parsing if-elseif-else correctly', () => {
        let parser = new Parser('if (X < V[mid]) high = mid - 1; else if (X > V[mid]) low = mid + 1; else mid++;');
        parser.build();
        assert.equal(JSON.stringify(parser.nodes), '[{"line":1,"type":"IfStatement","title":"","condition":"","value":"X < V[mid]"},{"line":2,"type":"AssignmentExpression","title":"high","condition":"","value":"mid - 1"},{"line":3,"type":"ElseIfStatement","title":"","condition":"","value":"X > V[mid]"},{"line":4,"type":"AssignmentExpression","title":"low","condition":"","value":"mid + 1"},{"line":5,"type":"Else","title":"","condition":"","value":""},{"line":6,"type":"UpdateExpression","title":"mid","condition":"","value":"mid ++"}]');
    });
    it('is parsing while correctly', () => {
        let parser = new Parser('while (low <= high) mid = (low + high)/2;');
        parser.build();
        assert.equal(JSON.stringify(parser.nodes), '[{"line":1,"type":"WhileStatement","title":"","condition":"low <= high","value":""},{"line":2,"type":"AssignmentExpression","title":"mid","condition":"","value":"low + high / 2"}]');
    });
});

describe('The parser', () => {
    it('is parsing for correctly', () => {
        let parser = new Parser('let sum =0; let array = [1,2,3,4,5]; for (let i = 0; i < array.length; i++) {sum += array[i];}');
        parser.build();
        assert.equal(JSON.stringify(parser.nodes), '[{"line":1,"type":"VariableDeclaration","title":"sum","condition":"","value":"0"},{"line":2,"type":"VariableDeclaration","title":"array","condition":"","value":"Array(5)"},{"line":3,"type":"ForStatement","title":"","condition":"i < array.length","value":""},{"line":3,"type":"VariableDeclaration","title":"i","condition":"","value":"0"},{"line":4,"type":"AssignmentExpression","title":"sum","condition":"","value":"array[i]"}]');
    });
    it('is parsing return correctly', () => {
        let parser = new Parser('function func(){return -1;}');
        parser.build();
        assert.equal(JSON.stringify(parser.nodes), '[{"line":1,"type":"FunctionDeclaration","title":"func","condition":"","value":""},{"line":2,"type":"ReturnStatement","title":"","condition":"","value":"-1"}]');
    });
    it('is parsing more than function correctly', () => {
        let parser = new Parser('function binarySearch(X, V, n=0){let low, high, mid;low = 0;high = n - 1;while (low <= high) {mid = (low + high)/2;if (X < V[mid])high = mid - 1;else{sum++;mid = mid +1;return mid;}}return -1;}function binarySearch(X, V, n=0){let low, high, mid;low = 0;high = n - 1;while (low <= high) {mid = (low + high)/2;if (X < V[mid])high = mid - 1;else{sum++;mid = mid +1;return mid;}}return -1;}');
        parser.build();
        assert.equal(JSON.stringify(parser.nodes), '[{"line":1,"type":"FunctionDeclaration","title":"binarySearch","condition":"","value":""},{"line":1,"type":"VariableDeclaration","title":"X","condition":"","value":""},{"line":1,"type":"VariableDeclaration","title":"V","condition":"","value":""},{"line":1,"type":"VariableDeclaration","title":"n","condition":"","value":"0"},{"line":2,"type":"VariableDeclaration","title":"low","condition":"","value":"null (or nothing)"},{"line":2,"type":"VariableDeclaration","title":"high","condition":"","value":"null (or nothing)"},{"line":2,"type":"VariableDeclaration","title":"mid","condition":"","value":"null (or nothing)"},{"line":3,"type":"AssignmentExpression","title":"low","condition":"","value":"0"},{"line":4,"type":"AssignmentExpression","title":"high","condition":"","value":"n - 1"},{"line":5,"type":"WhileStatement","title":"","condition":"low <= high","value":""},{"line":6,"type":"AssignmentExpression","title":"mid","condition":"","value":"low + high / 2"},{"line":7,"type":"IfStatement","title":"","condition":"","value":"X < V[mid]"},{"line":8,"type":"AssignmentExpression","title":"high","condition":"","value":"mid - 1"},{"line":9,"type":"Else","title":"","condition":"","value":""},{"line":10,"type":"UpdateExpression","title":"sum","condition":"","value":"sum ++"},{"line":11,"type":"AssignmentExpression","title":"mid","condition":"","value":"mid + 1"},{"line":12,"type":"ReturnStatement","title":"","condition":"","value":"mid"},{"line":13,"type":"ReturnStatement","title":"","condition":"","value":"-1"},{"line":14,"type":"FunctionDeclaration","title":"binarySearch","condition":"","value":""},{"line":14,"type":"VariableDeclaration","title":"X","condition":"","value":""},{"line":14,"type":"VariableDeclaration","title":"V","condition":"","value":""},{"line":14,"type":"VariableDeclaration","title":"n","condition":"","value":"0"},{"line":15,"type":"VariableDeclaration","title":"low","condition":"","value":"null (or nothing)"},{"line":15,"type":"VariableDeclaration","title":"high","condition":"","value":"null (or nothing)"},{"line":15,"type":"VariableDeclaration","title":"mid","condition":"","value":"null (or nothing)"},{"line":16,"type":"AssignmentExpression","title":"low","condition":"","value":"0"},{"line":17,"type":"AssignmentExpression","title":"high","condition":"","value":"n - 1"},{"line":18,"type":"WhileStatement","title":"","condition":"low <= high","value":""},{"line":19,"type":"AssignmentExpression","title":"mid","condition":"","value":"low + high / 2"},{"line":20,"type":"IfStatement","title":"","condition":"","value":"X < V[mid]"},{"line":21,"type":"AssignmentExpression","title":"high","condition":"","value":"mid - 1"},{"line":22,"type":"Else","title":"","condition":"","value":""},{"line":23,"type":"UpdateExpression","title":"sum","condition":"","value":"sum ++"},{"line":24,"type":"AssignmentExpression","title":"mid","condition":"","value":"mid + 1"},{"line":25,"type":"ReturnStatement","title":"","condition":"","value":"mid"},{"line":26,"type":"ReturnStatement","title":"","condition":"","value":"-1"}]');
    });
});

describe('The parser', () => {
    it('is parsing more than logic condition in while loop correctly', () => {
        let parser = new Parser('let low, high, mid;low = 0;high = 10;while (low <= high && 1 == 1 && 0 == 0) {low++;}');
        parser.build();
        assert.equal(JSON.stringify(parser.nodes), '[{"line":1,"type":"VariableDeclaration","title":"low","condition":"","value":"null (or nothing)"},{"line":1,"type":"VariableDeclaration","title":"high","condition":"","value":"null (or nothing)"},{"line":1,"type":"VariableDeclaration","title":"mid","condition":"","value":"null (or nothing)"},{"line":2,"type":"AssignmentExpression","title":"low","condition":"","value":"0"},{"line":3,"type":"AssignmentExpression","title":"high","condition":"","value":"10"},{"line":4,"type":"WhileStatement","title":"","condition":"low <= high && 1 == 1 && 0 == 0","value":""},{"line":5,"type":"UpdateExpression","title":"low","condition":"","value":"low ++"}]');
    });
    it('is parsing more than logic condition in for loop correctly', () => {
        let parser = new Parser('let high = 10, sum = 0; for (let i = 0; i<= high && 1 == 1 && 0 == 0; i++) {sum++;}');
        parser.build();
        assert.equal(JSON.stringify(parser.nodes), '[{"line":1,"type":"VariableDeclaration","title":"high","condition":"","value":"10"},{"line":1,"type":"VariableDeclaration","title":"sum","condition":"","value":"0"},{"line":2,"type":"ForStatement","title":"","condition":"i <= high && 1 == 1 && 0 == 0","value":""},{"line":2,"type":"VariableDeclaration","title":"i","condition":"","value":"0"},{"line":3,"type":"UpdateExpression","title":"sum","condition":"","value":"sum ++"}]');
    });
    it('is check html render correctly', () => {
        let parser = new Parser('let high = 10, sum = 0; for (let i = 0; i<= high && 1 == 1 && 0 == 0; i++) {sum++;}');
        parser.build();
        assert.equal(parser.render(), '<tr><th scope="row">1</th> <td>VariableDeclaration</td> <td>high</td> <td></td> <td>10</td></tr><tr><th scope="row">1</th> <td>VariableDeclaration</td> <td>sum</td> <td></td> <td>0</td></tr><tr><th scope="row">2</th> <td>ForStatement</td> <td></td> <td>i <= high && 1 == 1 && 0 == 0</td> <td></td></tr><tr><th scope="row">2</th> <td>VariableDeclaration</td> <td>i</td> <td></td> <td>0</td></tr><tr><th scope="row">3</th> <td>UpdateExpression</td> <td>sum</td> <td></td> <td>sum ++</td></tr>');
    });
});

describe('The parser', () => {
    it('is parsing complex statements', () => {
        let parser = new Parser('function binarySearch(X, V, n=0){let low, high, mid=0;let array = [1,2,3,4,5];low = 0;high = n - 1;low++;for (let i = 0; i < array[5]; i++) {high += array[i];}return high&&low&&array[0];}');
        parser.build();
        assert.equal(JSON.stringify(parser.nodes), '[{"line":1,"type":"FunctionDeclaration","title":"binarySearch","condition":"","value":""},{"line":1,"type":"VariableDeclaration","title":"X","condition":"","value":""},{"line":1,"type":"VariableDeclaration","title":"V","condition":"","value":""},{"line":1,"type":"VariableDeclaration","title":"n","condition":"","value":"0"},{"line":2,"type":"VariableDeclaration","title":"low","condition":"","value":"null (or nothing)"},{"line":2,"type":"VariableDeclaration","title":"high","condition":"","value":"null (or nothing)"},{"line":2,"type":"VariableDeclaration","title":"mid","condition":"","value":"0"},{"line":3,"type":"VariableDeclaration","title":"array","condition":"","value":"Array(5)"},{"line":4,"type":"AssignmentExpression","title":"low","condition":"","value":"0"},{"line":5,"type":"AssignmentExpression","title":"high","condition":"","value":"n - 1"},{"line":6,"type":"UpdateExpression","title":"low","condition":"","value":"low ++"},{"line":7,"type":"ForStatement","title":"","condition":"i < array[5]","value":""},{"line":7,"type":"VariableDeclaration","title":"i","condition":"","value":"0"},{"line":8,"type":"AssignmentExpression","title":"high","condition":"","value":"array[i]"},{"line":9,"type":"ReturnStatement","title":"","condition":"","value":{"leftName":{"leftName":"high","rightName":"low","operator":"&&"},"rightName":"array[0]","operator":"&&"}}]');
    });
});
