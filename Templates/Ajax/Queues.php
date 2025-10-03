<div class="queues-wrapper">
    <div class="array-builder-wrap">
        <label for="array-input">Queue (Space Separated)</label>
        <div class="array-builder">
            <input type="text" class="form-control"
                id="array-input" value="1 2 3 4 5 6 7 8">
            <button class="btn btn-light" id="build-queue">Build Queue</button>
        </div>
    </div>
    <div class="array-wrapper">
        <div class="array-item"><span></span></div>
        <div class="array-item"><span></span></div>
        <div class="array-item"><span></span></div>
        <div class="array-item"><span></span></div>
        <div class="array-item"><span></span></div>
        <div class="array-item"><span></span></div>
        <div class="array-item"><span></span></div>
        <div class="array-item"><span></span></div>
    </div>
    <div class="controls-wrap list-controls">
        <div class="controls-wrap full">
            <div class="inputs-wrap">
                <div class="input-box">
                    <label for="item">Element</label>
                    <input type="number" name="item" class="form-control" id="array-element">
                </div>
                <div class="btn-wrap">
                    <button class="btn btn-light" id="reset-queue">
                        <span class="bi bi-arrow-clockwise"></span>
                    </button>
                    <button class="btn btn-light" id="insert">Insert</button>
                    <button class="btn btn-light" id="delete">Delete</button>
                </div>
            </div>
        </div>
    </div>
</div>