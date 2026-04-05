var board = null
var game = new Chess()
var $status = $('#status')

// Simple Minimax AI for "Ahmed"
function evaluateBoard(game) {
    var totalEvaluation = 0;
    var board = game.board();
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            totalEvaluation += getPieceValue(board[i][j], i, j);
        }
    }
    return totalEvaluation;
}

function getPieceValue(piece, x, y) {
    if (piece === null) return 0;
    var getAbsoluteValue = function (piece) {
        if (piece.type === 'p') return 10;
        if (piece.type === 'r') return 50;
        if (piece.type === 'n') return 30;
        if (piece.type === 'b') return 30;
        if (piece.type === 'q') return 90;
        if (piece.type === 'k') return 900;
        throw "Unknown piece type: " + piece.type;
    };
    var absoluteValue = getAbsoluteValue(piece, piece.color === 'w');
    return piece.color === 'w' ? absoluteValue : -absoluteValue;
}

function makeBestMove() {
    if (game.game_over()) return;

    var possibleMoves = game.moves();
    if (possibleMoves.length === 0) return;

    // Simple AI: Picks the move that results in the best board score
    var bestMove = null;
    var bestValue = Infinity; // Black wants to minimize the score

    for (var i = 0; i < possibleMoves.length; i++) {
        game.move(possibleMoves[i]);
        var boardValue = evaluateBoard(game);
        game.undo();
        if (boardValue < bestValue) {
            bestValue = boardValue;
            bestMove = possibleMoves[i];
        }
    }

    game.move(bestMove);
    board.position(game.fen());
    updateStatus();
}

function onDragStart(source, piece, position, orientation) {
    if (game.game_over()) return false
    if (piece.search(/^b/) !== -1) return false
}

function onDrop(source, target) {
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q'
    })

    if (move === null) return 'snapback'

    window.setTimeout(makeBestMove, 250);
    updateStatus();
}

function updateStatus() {
    var status = ''
    var moveColor = (game.turn() === 'b') ? 'Black (Ahmed)' : 'White'

    if (game.in_checkmate()) {
        status = 'Game over, ' + moveColor + ' is in checkmate.'
        if(game.turn() === 'w') alert("Ahmed El Addawy has defeated you!");
    } else if (game.in_draw()) {
        status = 'Game over, drawn position'
    } else {
        status = moveColor + ' to move'
        if (game.in_check()) {
            status += ', ' + moveColor + ' is in check'
        }
    }
    $status.html(status)
}

var config = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
}
board = Chessboard('myBoard', config)

$('#resetBtn').on('click', function() {
    game.reset();
    board.start();
    updateStatus();
});

updateStatus();
