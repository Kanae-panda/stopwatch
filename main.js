class Timer {
	constructor() {
		/* 要素を取得 */
		this.timeElement = document.getElementById("time");
		this.startButton = document.querySelector('input[value="スタート"]');
		this.stopButton = document.querySelector('input[value="ストップ"]');
		this.resetButton = document.querySelector('input[value="リセット"]');
		
		/* 初期値を設定 */
		this.startTime = 0; /* スタートをクリックした時刻 */
		this.stopTime = 0; /* ストップをクリックした時刻 */
		this.timeoutID = null; /* 繰り返す */
		
		/* クリック時の動作 */
		this.startButton.addEventListener('click', () => this.start());
		this.stopButton.addEventListener('click', () => this.stop());
		this.resetButton.addEventListener('click', () => this.reset());
	}
	
	/* 表示時間の設定 */
	displayTime() {
		/* 現在時刻(ミリ秒)=「クリックまでの時間」-「スタートまで」+「ストップ以降」 */
		const currentTime = new Date(
			Date.now() - this.startTime + this.stopTime
		);
		
		/* 現在時刻を日本時間(-9時間)に調整 */
		currentTime.setHours(
			currentTime.getHours() + currentTime.getTimezoneOffset() / 60
		);
		
		/* 現在時刻をミリ秒から時間・分・秒・ミリ秒に修正し、2桁または3桁で表示 */
		const h = String(currentTime.getHours()).padStart(2, "0");
		const m = String(currentTime.getMinutes()).padStart(2, "0");
		const s = String(currentTime.getSeconds()).padStart(2, "0");
		const ms = String(currentTime.getMilliseconds()).padStart(3, "0");
		
		/* 時計を00:00:00:000で表示*/
		this.timeElement.textContent = `${h}:${m}:${s}:${ms}`;
		
		/* 10ミリ秒ごとに繰り返す(時間を更新) */
		this.timeoutID = setTimeout(() => this.displayTime(), 10);
	}
	
	/* スタートボタンの有効化・無効化 */
	start() {
		this.disabled(true, false, false); /* スタートボタンは押せない */
		this.startTime = Date.now(); /* 開始時間を取得 */
		this.displayTime(); /* 時間を更新 */
	}
	
	/* ストップボタンの有効化・無効化 */
	stop() {
		this.disabled(false, true, false); /* ストップボタンは押せない */
		
		/* 時間の更新を止める */
		clearTimeout(this.timeoutID);
		this.TimeoutID = null; /* 更新する値はなしにする */
		
		/* 停止時間を取得=「クリックまでの時間」-「取得した開始時間」+「前の停止時間」 */
		this.stopTime += Date.now() - this.startTime;
	}
	
	/* リセットボタンの有効化・無効化 */
	reset() {
		this.disabled(false, true, true); /* リセットボタンとストップボタンは押せない */
		
		/* 停止ボタンを押さずにリセットボタンを押した際、更新を止める */
		if(this.timeoutID) {
			clearTimeout(this.timeoutID);
			this.timeoutID = null;
		}
		
		/* リセットボタンを押した時の時間表示 */
		this.timeElement.textContent = "00:00:00:000";
		this.stopTime = 0; /* 停止時間の初期化 */
	}
	
	/* ボタンを無効化にする関数 */
	disabled(start, stop, reset) {
		this.startButton.disabled = start;
		this.stopButton.disabled = stop;
		this.resetButton.disabled = reset;
	}
}

/* クラス(設計図)のTimerからnewでインスタンスを生成。最初はスタートボタンのみ押せる。 */
const timer = new Timer().disabled(false, true, true);