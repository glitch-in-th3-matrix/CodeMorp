<div class="infix-to-postfix-wrapper notation-wrapper">
    <div class="character-builder-wrap">
        <label for="character-input">Infix Expression</label>
        <div class="character-builder">
            <input type="text" class="form-control" 
                id="character-input" value="(( A + B ) * C ) - D">
            <button class="btn btn-light" id="load-characters">Load</button>
        </div>
    </div>
    <div class="algorithm-wrapper">
        <div class="input-wrapper">
            <div class="characters-wrap">
                <h1>Input Tokens</h1>
                <div class="characters">
                </div>
            </div>
            <div class="operator-wrap">
                <h1 class="stack-title">Operator Stack</h1>
                <div class="operators">
                </div>
            </div>
        </div>
        <div class="output-wrapper">
            <div class="characters-wrap">
                <h1>Output</h1>
                <div class="characters">
                </div>
            </div>
        </div>
    </div>
    <div class="controls-wrap">
        <div class="controls">
            <button class="btn btn-light" id="i-p-step">
                <span class="bi bi-skip-forward-fill"></span>
            </button>
            <button class="btn btn-light" id="i-p-play">
                <span class="bi bi-play-fill"></span>
            </button>
            <button class="btn btn-light" id="i-p-pause">
                <span class="bi bi-pause-fill"></span>
            </button>
            <button class="btn btn-light" id="i-p-reset">
                <span class="bi bi-arrow-clockwise"></span>
            </button>
        </div>
    </div>
</div>