<div class="postfix-evaluation-wrapper notation-wrapper">
    <div class="character-builder-wrap">
        <label for="character-input">Postfix Expression</label>
        <div class="character-builder">
            <input type="text" class="form-control" 
                id="character-input" value="30 sin 45 cos +">
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
            <div class="stack-wrap">
                <h1 class="stack-title">Evaluation Stack</h1>
                <div class="characters">
                </div>
            </div>
        </div>
        <div class="output-wrapper">
            <div class="characters-wrap">
                <h1>Result</h1>
                <div class="characters">
                </div>
            </div>
        </div>
    </div>
    <div class="controls-wrap">
        <div class="controls">
            <button class="btn btn-light" id="p-e-step">
                <span class="bi bi-skip-forward-fill"></span>
            </button>
            <button class="btn btn-light" id="p-e-play">
                <span class="bi bi-play-fill"></span>
            </button>
            <button class="btn btn-light" id="p-e-pause">
                <span class="bi bi-pause-fill"></span>
            </button>
            <button class="btn btn-light" id="p-e-reset">
                <span class="bi bi-arrow-clockwise"></span>
            </button>
        </div>
    </div>
</div>