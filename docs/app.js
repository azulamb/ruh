var App;
(function (App) {
    var ANIME_DIFF = 100;
    var ANIME_WAIT = 1000;
    var ANIME_TIME = 1000;
    var WIDTH = 6;
    var HEIGHT = 7;
    var OPTION = {
        chain: true,
        pattern: ['pn', 'pt', 'pm', 'pp'],
    };
    var ATTR = ['F', 'W', 'T'];
    function overturnAfter(panel, attr, cls, count) {
        if (count === void 0) { count = 1; }
        if (panel.isOverturn()) {
            return;
        }
        setTimeout(function () { panel.overturn(attr, cls); }, count * ANIME_DIFF);
    }
    function overturnNeighbour(game, x, y, attr) {
        var L = 0 < x;
        var R = x + 1 < WIDTH;
        if (0 < y) {
            if (L) {
                overturnAfter(game.getPanel(x - 1, y - 1), attr, 'tdu');
            }
            overturnAfter(game.getPanel(x, y - 1), attr, 'tdvu');
            if (R) {
                overturnAfter(game.getPanel(x + 1, y - 1), attr, 'tdr');
            }
        }
        if (L) {
            overturnAfter(game.getPanel(x - 1, y), attr, 'tdhl');
        }
        if (R) {
            overturnAfter(game.getPanel(x + 1, y), attr, 'tdhr');
        }
        if (y + 1 < HEIGHT) {
            if (L) {
                overturnAfter(game.getPanel(x - 1, y + 1), attr, 'tdl');
            }
            overturnAfter(game.getPanel(x, y + 1), attr, 'tdvd');
            if (R) {
                overturnAfter(game.getPanel(x + 1, y + 1), attr, 'tdd');
            }
        }
        return 1;
    }
    function overturnNeighbourV(game, x, y, attr) {
        if (0 < y) {
            overturnAfter(game.getPanel(x, y - 1), attr, 'tdvu');
        }
        if (y + 1 < HEIGHT) {
            overturnAfter(game.getPanel(x, y + 1), attr, 'tdvd');
        }
        return 1;
    }
    function overturnNeighbourH(game, x, y, attr) {
        if (0 < x) {
            overturnAfter(game.getPanel(x - 1, y), attr, 'tdhl');
        }
        if (x + 1 < WIDTH) {
            overturnAfter(game.getPanel(x + 1, y), attr, 'tdhr');
        }
        return 1;
    }
    function overturnCross(game, x, y, attr) {
        if (0 < y) {
            overturnAfter(game.getPanel(x, y - 1), attr, 'tdvu');
        }
        if (0 < x) {
            overturnAfter(game.getPanel(x - 1, y), attr, 'tdhl');
        }
        if (x + 1 < WIDTH) {
            overturnAfter(game.getPanel(x + 1, y), attr, 'tdhr');
        }
        if (y + 1 < HEIGHT) {
            overturnAfter(game.getPanel(x, y + 1), attr, 'tdvd');
        }
        return 1;
    }
    function overturnLineV(game, x, y, attr) {
        var i;
        var c;
        var ret = y < HEIGHT / 2 ? (HEIGHT - y - 1) : (y - 1);
        c = 0;
        for (i = y - 1; 0 <= i; --i) {
            overturnAfter(game.getPanel(x, i), attr, 'tdvu', ++c);
        }
        c = 0;
        for (i = y + 1; i < HEIGHT; ++i) {
            overturnAfter(game.getPanel(x, i), attr, 'tdvd', ++c);
        }
        return ret;
    }
    function overturnLineH(game, x, y, attr) {
        var i;
        var c;
        var ret = x < WIDTH / 2 ? (WIDTH - x - 1) : (x - 1);
        c = 0;
        for (i = x - 1; 0 <= i; --i) {
            overturnAfter(game.getPanel(i, y), attr, 'tdhl', ++c);
        }
        c = 0;
        for (i = x + 1; i < WIDTH; ++i) {
            overturnAfter(game.getPanel(i, y), attr, 'tdhr', ++c);
        }
        return ret;
    }
    function overturnCrossL(game, x, y, attr) {
        var a = overturnLineV(game, x, y, attr);
        var b = overturnLineH(game, x, y, attr);
        return Math.max(a, b);
    }
    var OVERTURN = {
        pn: overturnNeighbour,
        pt: overturnNeighbourV,
        pm: overturnNeighbourH,
        pp: overturnCross,
        pv: overturnLineV,
        pl: overturnLineH,
        pc: overturnCrossL,
    };
    var Enemy = (function () {
        function Enemy() {
            this.hp = 0;
            this.attr = 0;
            this.panel = document.createElement('div');
            this.panel.classList.add('tn', 'enemy');
        }
        Enemy.prototype.getElement = function () { return this.panel; };
        Enemy.prototype.create = function () {
            this.panel.style.display = 'block';
            this.hp = 1;
            this.attr = 0;
        };
        Enemy.prototype.damage = function (attr) {
            if (this.hp <= 0) {
                return;
            }
            if (this.attr === attr) {
            }
            else if (this.attr === (attr + 1) % 3) {
            }
            else {
            }
        };
        Enemy.prototype.nextTurn = function () {
            if (this.hp <= 0) {
                return;
            }
        };
        Enemy.prototype.getAttr = function () { return this.attr; };
        Enemy.prototype.getHp = function () { return this.hp; };
        return Enemy;
    }());
    var Panel = (function () {
        function Panel(panel, game, x, y) {
            var _this = this;
            this.enable = false;
            this.parent = panel;
            this.game = game;
            this.x = x;
            this.y = y;
            this.clear();
            this.panel = this.inPanel();
            this.enemy = new Enemy();
            this.panel.addEventListener('click', function (e) { return _this.onClick(e); }, false);
            this.panel.addEventListener('transitionend', function (e) { return _this.onEndAnime(e); }, false);
            this.setPanel(Math.floor(Math.random() * 3), Math.floor(Math.random() * OPTION.pattern.length));
            panel.appendChild(this.panel);
            panel.appendChild(this.enemy.getElement());
        }
        Panel.prototype.clear = function () {
            var children = this.parent.childNodes;
            for (var i = children.length - 1; 0 <= i; --i) {
                this.parent.removeChild(children[i]);
            }
        };
        Panel.prototype.inPanel = function () {
            var panel = document.createElement('div');
            panel.classList.add('tn');
            return panel;
        };
        Panel.prototype.clearPanel = function () {
            this.panel.classList.remove('cr', 'cg', 'cb', 'td', 'pn', 'pt', 'pm', 'pp', 'pv', 'pl', 'pc', 'tdvu', 'tdvd', 'tdhl', 'tdhr', 'tdu', 'tdr', 'tdd', 'tdl');
        };
        Panel.prototype.afterWait = function () {
            this.setPanel(Math.floor(Math.random() * 3), Math.floor(Math.random() * OPTION.pattern.length));
            if (this.game.isAllEnable()) {
                this.game.nextTurn();
            }
        };
        Panel.prototype.createEnemy = function () {
            this.enemy.create();
        };
        Panel.prototype.onClick = function (e) {
            this.game.onEffect(false);
            this.overturn(this.attr, 'td', true);
        };
        Panel.prototype.onEndAnime = function (e) {
            var _this = this;
            if (e.propertyName !== 'transform') {
                return;
            }
            if (!this.panel.classList.contains('tn')) {
                setTimeout(function () { _this.afterWait(); }, ANIME_WAIT);
            }
        };
        Panel.prototype.overturn = function (attr, cls, force) {
            if (force === void 0) { force = false; }
            if (!this.enable) {
                return;
            }
            this.enemy.damage(this.attr);
            this.enable = false;
            this.panel.classList.remove('tn');
            this.panel.classList.add(cls);
            if (!(force || OPTION.chain) || this.attr !== attr) {
                return;
            }
            var key = OPTION.pattern[this.type] || '';
            if (!key) {
                return;
            }
            OVERTURN[key](this.game, this.x, this.y, attr);
        };
        Panel.prototype.setPanel = function (attr, type) {
            this.attr = attr;
            this.type = type;
            this.clearPanel();
            this.panel.classList.add('tn', OPTION.pattern[type] || '', (attr === 0 ? 'cr' : (attr === 1 ? 'cg' : 'cb')));
            this.enable = true;
        };
        Panel.prototype.isOverturn = function () { return !this.panel.classList.contains('tn'); };
        Panel.prototype.isEnable = function () { return this.enable; };
        Panel.prototype.nextTurn = function () {
            this.enemy.nextTurn();
        };
        return Panel;
    }());
    var Game = (function () {
        function Game(id) {
            var parent = document.getElementById(id);
            if (!parent) {
                return;
            }
            var panels = parent.children;
            this.panels = [];
            for (var i = 0; i < panels.length; ++i) {
                this.panels.push(new Panel(panels[i], this, i % WIDTH, Math.floor(i / WIDTH)));
            }
        }
        Game.prototype.getPanel = function (x, y) { return this.panels[y * WIDTH + x]; };
        Game.prototype.nextTurn = function () {
            for (var i = 0; i < this.panels.length; ++i) {
                this.panels[i].nextTurn();
            }
            this.onEffect(true);
        };
        Game.prototype.onEffect = function (hide) {
            if (hide === void 0) { hide = false; }
            var effect = document.getElementById('effect');
            if (!effect) {
                return;
            }
            if (hide) {
                effect.classList.add('hidden');
            }
            else {
                effect.classList.remove('hidden');
            }
        };
        Game.prototype.isAllEnable = function () {
            for (var i = 0; i < this.panels.length; ++i) {
                if (!this.panels[i].isEnable()) {
                    return false;
                }
            }
            return true;
        };
        return Game;
    }());
    function unsupportedBrowser() {
        if (typeof (TransitionEvent) === "undefined") {
            return true;
        }
        var e = document.createElement('div');
        if (e.style['imageRendering'] === undefined) {
            return true;
        }
        return false;
    }
    function init(option) {
        if (unsupportedBrowser()) {
            var us = document.getElementById('unsupported');
            if (!us) {
                return;
            }
            us.classList.remove('hidden');
            return;
        }
        var button = document.getElementById('play');
        if (!button) {
            return;
        }
        button.addEventListener('click', function () {
            start(option);
        }, false);
    }
    App.init = init;
    function start(option) {
        Object.keys(option).forEach(function (key) {
            OPTION[key] = option[key];
        });
        var game = new Game('panels');
        var top = document.getElementById('top');
        if (!top) {
            return;
        }
        top.classList.add('hidden');
    }
    App.start = start;
})(App || (App = {}));
