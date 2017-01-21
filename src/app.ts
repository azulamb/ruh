//http://www.yoheim.net/blog.php?q=20120810
//https://developer.mozilla.org/ja/docs/Web/CSS/image-rendering
//http://www.webcreatorbox.com/tech/css-sprite-steps/
module App
{
	const ANIME_DIFF: number = 100;
	const ANIME_WAIT: number = 1000;
	const ANIME_TIME: number = 1000;
	const WIDTH: number = 6;
	const HEIGHT: number = 7;
	const OPTION =
	{
		chain: true,
		pattern: [ 'pn', 'pt', 'pm', 'pp'/*,'pv', 'pl', 'pc'*/ ],
	};
	const ATTR: string[] = [ 'F', 'W', 'T' ];

	function overturnAfter( panel: Panel, attr: number, cls: string, count: number = 1 )
	{
		if ( panel.isOverturn() ) { return; }
		setTimeout( () => { panel.overturn( attr, cls ); }, count * ANIME_DIFF );
	}

	function overturnNeighbour( game: Game, x: number, y: number, attr: number ): number
	{
		const L: boolean = 0 < x;
		const R: boolean = x + 1 < WIDTH;
		if ( 0 < y )
		{
			if ( L ) { overturnAfter( game.getPanel( x - 1, y - 1 ), attr, 'tdu' ); }
			overturnAfter( game.getPanel( x, y - 1 ), attr, 'tdvu' );
			if ( R ) { overturnAfter( game.getPanel( x + 1, y - 1 ), attr, 'tdr' ); }
		}
		if ( L ) { overturnAfter( game.getPanel( x - 1, y ), attr, 'tdhl' ); }
		if ( R ) { overturnAfter( game.getPanel( x + 1, y ), attr, 'tdhr' ); }
		if ( y  + 1 < HEIGHT )
		{
			if ( L ) { overturnAfter( game.getPanel( x - 1, y + 1 ), attr, 'tdl' ); }
			overturnAfter( game.getPanel( x, y + 1 ), attr, 'tdvd' );
			if ( R ) { overturnAfter( game.getPanel( x + 1, y + 1 ), attr, 'tdd' ); }
		}
		return 1;
	}

	function overturnNeighbourV( game: Game, x: number, y: number, attr: number ): number
	{
		if ( 0 < y ) { overturnAfter( game.getPanel( x, y - 1 ), attr, 'tdvu' ); }
		if ( y  + 1< HEIGHT ) { overturnAfter( game.getPanel( x, y + 1 ), attr, 'tdvd' ); }
		return 1;
	}

	function overturnNeighbourH( game: Game, x: number, y: number, attr: number ): number
	{
		if ( 0 < x ) { overturnAfter( game.getPanel( x - 1, y ), attr, 'tdhl' ); }
		if ( x + 1 < WIDTH ) { overturnAfter( game.getPanel( x + 1, y ), attr, 'tdhr' ); }
		return 1;
	}

	function overturnCross( game: Game, x: number, y: number, attr: number ): number
	{
		if ( 0 < y ) { overturnAfter( game.getPanel( x, y - 1 ), attr, 'tdvu' ); }
		if ( 0 < x ) { overturnAfter( game.getPanel( x - 1, y ), attr, 'tdhl' ); }
		if ( x + 1 < WIDTH ) { overturnAfter( game.getPanel( x + 1, y ), attr, 'tdhr' ); }
		if ( y  + 1< HEIGHT ) { overturnAfter( game.getPanel( x, y + 1 ), attr, 'tdvd' ); }
		return 1;
	}

	function overturnLineV( game: Game, x: number, y: number, attr: number ): number
	{
		let i: number;
		let c: number;
		const ret = y < HEIGHT / 2 ? ( HEIGHT - y  - 1) : ( y  - 1 );
		// up
		c = 0;
		for ( i = y - 1 ; 0 <= i ; --i )
		{
			overturnAfter( game.getPanel( x, i ), attr, 'tdvu', ++c );
		}
		// down
		c = 0;
		for ( i = y + 1 ; i < HEIGHT ; ++i )
		{
			overturnAfter( game.getPanel( x, i ), attr, 'tdvd', ++c );
		}
		return ret;
	}

	function overturnLineH( game: Game, x: number, y: number, attr: number ): number
	{
		let i: number;
		let c: number;
		const ret = x < WIDTH / 2 ? ( WIDTH - x  - 1) : ( x  - 1 );
		// left
		c = 0;
		for ( i = x - 1 ; 0 <= i ; --i )
		{
			overturnAfter( game.getPanel( i, y ), attr, 'tdhl', ++c );
		}
		// right
		c = 0;
		for ( i = x + 1 ; i < WIDTH ; ++i )
		{
			overturnAfter( game.getPanel( i, y ), attr, 'tdhr', ++c );
		}
		return ret;
	}

	function overturnCrossL( game: Game, x: number, y: number, attr: number ): number
	{
		const a = overturnLineV( game, x, y, attr );
		const b = overturnLineH( game, x, y, attr );
		return Math.max( a, b );
	}

	const OVERTURN: { [ key: string ]: ( game: Game, x: number, y: number, attr: number ) => number } =
	{
		pn: overturnNeighbour,
		pt: overturnNeighbourV,
		pm: overturnNeighbourH,
		pp: overturnCross,
		pv: overturnLineV,
		pl: overturnLineH,
		pc: overturnCrossL,
	};

	class Enemy
	{
		private panel: HTMLElement;
		private hp: number;
		private attr: number;

		constructor()
		{
			this.hp = 0;
			this.attr = 0;
			this.panel = document.createElement( 'div' );
			this.panel.classList.add( 'tn', 'enemy' );
		}

		public getElement(): HTMLElement { return this.panel; }

		public create()
		{
			this.panel.style.display = 'block';
			this.hp = 1;
			this.attr = 0;
		}

		public damage( attr: number )
		{
			if ( this.hp <= 0 ) { return; }
			if ( this.attr === attr )
			{
				// same
			} else if ( this.attr === ( attr + 1 ) % 3 )
			{
				// damage
			} else
			{
				// heal
			}
		}

		public nextTurn()
		{
			if ( this.hp <= 0 ) { return; }
		}

		public getAttr() { return this.attr; }
		public getHp() { return this.hp; }
	}

	class Panel
	{
		private game: Game;
		private parent: HTMLElement;
		private panel: HTMLElement;
		private enemy: Enemy;
		private attr: number;
		private type: number;
		private x: number;
		private y: number;
		private enable: boolean;

		constructor( panel: HTMLElement, game: Game, x: number, y: number )
		{
			this.enable = false;
			this.parent = panel;
			this.game = game;
			this.x = x;
			this.y = y;
			this.clear();
			this.panel = this.inPanel();
			this.enemy = new Enemy();

			this.panel.addEventListener( 'click', ( e ) => { return this.onClick( e ); }, false );
			this.panel.addEventListener( 'transitionend', ( e ) => { return this.onEndAnime( <TransitionEvent>e ); }, false);

			this.setPanel( Math.floor( Math.random() * 3 ), Math.floor( Math.random() * OPTION.pattern.length ) );

			panel.appendChild( this.panel );
			panel.appendChild( this.enemy.getElement() );
		}

		private clear()
		{
			const children = this.parent.childNodes;
			for ( let i = children.length - 1; 0 <= i ; --i )
			{
				this.parent.removeChild( children[ i ] );
			}
		}

		private inPanel(): HTMLElement
		{
			const panel = document.createElement( 'div' );
			panel.classList.add( 'tn' );
			return panel;
		}

		private clearPanel()
		{
			this.panel.classList.remove( 'cr', 'cg', 'cb', 'td', 'pn', 'pt', 'pm', 'pp', 'pv', 'pl', 'pc', 'tdvu', 'tdvd', 'tdhl', 'tdhr', 'tdu', 'tdr', 'tdd', 'tdl' );
		}

		private afterWait()
		{
			this.setPanel( Math.floor( Math.random() * 3 ), Math.floor( Math.random() * OPTION.pattern.length ) );
			if ( this.game.isAllEnable() )
			{
				// End all animation.
				this.game.nextTurn();
			}
		}

		public createEnemy()
		{
			this.enemy.create();
		}

		public onClick( e: Event )
		{
			//if ( this.panel.classList.contains( '' ) ){}
			this.game.onEffect( false );
			this.overturn( this.attr, 'td', true );
		}

		public onEndAnime( e: TransitionEvent )
		{
			if ( e.propertyName !== 'transform' ) { return; }
			if ( !this.panel.classList.contains( 'tn' ) )
			{
				setTimeout( () => { this.afterWait(); }, ANIME_WAIT );
			}
		}

		public overturn( attr: number, cls: string, force: boolean = false )
		{
			if ( !this.enable ) { return; }
			this.enemy.damage( this.attr );
			this.enable = false;
			this.panel.classList.remove( 'tn' );
			this.panel.classList.add( cls );
			if ( !(force || OPTION.chain) || this.attr !== attr ) { return; }
			const key: string = OPTION.pattern[ this.type ] || '';
			if ( !key ) { return; }
			OVERTURN[ key ]( this.game, this.x, this.y, attr );
		}

		public setPanel( attr: number, type: number )
		{

			this.attr = attr;
			this.type = type;
			this.clearPanel();
			this.panel.classList.add( 'tn', OPTION.pattern[ type ] || '', ( attr === 0 ? 'cr' : ( attr === 1 ? 'cg' : 'cb' ) ) );
			this.enable = true;
			//this.panel.innerHTML = [ this.type, OPTION.pattern[ type ] ].join(' ');
		}
		public isOverturn(): boolean { return !this.panel.classList.contains( 'tn' ); }
		public isEnable(): boolean { return this.enable; }
		public nextTurn()
		{
			this.enemy.nextTurn();
		}
	}

	class Game
	{
		private panels: Panel[];

		constructor( id: string )
		{
			const parent = document.getElementById( id );
			if ( !parent ) { return; }
			const panels = parent.children;
			this.panels = [];
			for( let i=0 ; i < panels.length ; ++i )
			{
				this.panels.push( new Panel( <HTMLElement>panels[ i ], this, i % WIDTH, Math.floor( i / WIDTH ) ) );
			}
		}

		public getPanel( x: number, y: number ): Panel { return this.panels[ y * WIDTH + x ]; }

		public nextTurn()
		{
			for ( let i = 0 ; i < this.panels.length ; ++i )
			{
				this.panels[ i ].nextTurn();
			}
			this.onEffect( true );
		}

		public onEffect( hide: boolean = false )
		{
			const effect = document.getElementById( 'effect' );
			if ( !effect ) { return; }
			if ( hide )
			{
				effect.classList.add( 'hidden' );
			} else
			{
				effect.classList.remove( 'hidden' );
			}
		}

		public isAllEnable(): boolean
		{
			for ( let i = 0 ; i < this.panels.length ; ++i )
			{
				if ( !this.panels[ i ].isEnable() ) { return false; }
			}
			return true;
		}
	}

	function unsupportedBrowser(): boolean
	{
		if ( typeof( TransitionEvent ) === "undefined" ) { return true; }
		//if ( 0 < navigator.userAgent.indexOf( 'Edge' ) ) { return true; }
		const e = document.createElement( 'div' );
		if ( e.style[ 'imageRendering' ] === undefined ) { return true; }
		return false;
	}

	export function init( option: { [ key: string ]: boolean } )
	{
		if ( unsupportedBrowser() )
		{
			const us = document.getElementById( 'unsupported' );
			if ( !us ) { return; }
			us.classList.remove( 'hidden' );
			return;
		}

		const button = document.getElementById( 'play' );
		if ( !button ){ return; }
		button.addEventListener('click',function()
		{
			start( option );
		}, false );

	}

	export function start( option: { [ key: string ]: boolean } )
	{

		Object.keys( option ).forEach( ( key ) =>
		{
			OPTION[ key ] = option[ key ];
		} );

		const game = new Game( 'panels' );

		const top = document.getElementById( 'top' );
		if ( !top ){ return; }
		top.classList.add( 'hidden' );
	}
}
