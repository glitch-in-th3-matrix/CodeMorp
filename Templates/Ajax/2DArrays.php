<div class="two-d-arrays-wrapper">
    <div class="array-builder-wrap wide two-d-array-builder">
        <div class="input-box">
            <label for="rows">Rows</label>
            <input type="number" class="form-control" id="rows" value="3">
        </div>
        <div class="input-box">
            <label for="columns">Columns</label>
            <input type="number" class="form-control" id="columns" value="8">
        </div>
        <div class="input-box">
            <label for="limit">Limit</label>
            <input type="number" class="form-control" id="limit" value="30">
        </div>
        <div class="build-btn-wrap">
            <button class="btn btn-light" id="build-array">Build Array</button>
        </div>
    </div>
    <div class="array-wrapper two-d-array-wrapper p-b-2">
        <div class="row-wrap">
            <div class="array-item"><span></span></div>
            <div class="array-item"><span></span></div>
            <div class="array-item"><span></span></div>
            <div class="array-item"><span></span></div>
            <div class="array-item"><span></span></div>
            <div class="array-item"><span></span></div>
            <div class="array-item"><span></span></div>
            <div class="array-item"><span></span></div>
        </div>
        <div class="row-wrap">
            <div class="array-item"><span></span></div>
            <div class="array-item"><span></span></div>
            <div class="array-item"><span></span></div>
            <div class="array-item"><span></span></div>
            <div class="array-item"><span></span></div>
            <div class="array-item"><span></span></div>
            <div class="array-item"><span></span></div>
            <div class="array-item"><span></span></div>
        </div>
        <div class="row-wrap">
            <div class="array-item"><span></span></div>
            <div class="array-item"><span></span></div>
            <div class="array-item"><span></span></div>
            <div class="array-item"><span></span></div>
            <div class="array-item"><span></span></div>
            <div class="array-item"><span></span></div>
            <div class="array-item"><span></span></div>
            <div class="array-item"><span></span></div>
        </div>
    </div>
    <div class="controls-wrap wide">
        <div class="inputs-wrap">
            <div class="input-box">
                <label for="item">Element</label>
                <input type="number" name="element" class="form-control" id="array-element">
            </div>
            <div class="input-box">
                <label for="index">Row Index</label>
                <input type="number" name="row-index" class="form-control" 
                    id="row-index" min=0>
            </div>
            <div class="input-box">
                <label for="index">Column Index</label>
                <input type="number" name="column-index" class="form-control" 
                    id="column-index" min=0>
            </div>
            <div class="reset-wrap">
                <button class="btn btn-light" id="reset-array">
                    <span class="bi bi-arrow-clockwise"></span>
                </button>
            </div>
        </div>
    </div>
</div>
<div class="features-wrap">
    <div class="output-wrap">
        <!-- <div class="output">
            <p>55</p>
        </div> -->
    </div>
    <div class="controls">
        <button class="btn btn-light" id="traverse-array">
            <span>Traverse</span>
        </button>
        <button class="btn btn-light" id="find-value">
            <span>Find Value</span>
        </button>
        <button class="btn btn-light" id="update-element">
            <span>Update</span>
        </button>
    </div>
</div>