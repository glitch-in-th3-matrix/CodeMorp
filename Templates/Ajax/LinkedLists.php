<div class="linked-lists-wrapper">
    <div class="array-builder-wrap">
        <label for="array-input">List (Space Separated)</label>
        <div class="array-builder">
            <input type="text" class="form-control"
                id="array-input" value="4 9 2 7 5 1 6 8 3 10">
            <button class="btn btn-light" id="build-list">Build List</button>
        </div>
    </div>
    <div class="list-types-wrap">
        <div class="list-types">
            <button class="btn" data-list-type="SLL">SLL</button>
            <button class="btn" data-list-type="DLL">DLL</button>
            <button class="btn" data-list-type="CSLL">CSLL</button>
            <button class="btn" data-list-type="CDLL">CDLL</button>
        </div>
    </div>
    <div class="array-wrapper list-wrapper">
        <div class="array-item list-node"><span></span></div>
        <i class="fa"></i>
        <div class="array-item list-node"><span></span></div>
        <i class="fa"></i>
        <div class="array-item list-node"><span></span></div>
        <i class="fa"></i>
        <div class="array-item list-node"><span></span></div>
        <i class="fa"></i>
        <div class="array-item list-node"><span></span></div>
        <i class="fa"></i>
        <div class="array-item list-node"><span></span></div>
        <i class="fa"></i>
        <div class="array-item list-node"><span></span></div>
        <i class="fa"></i>
        <div class="array-item list-node"><span></span></div>
        <i class="fa"></i>
        <div class="array-item list-node"><span></span></div>
        <i class="fa"></i>
        <div class="array-item list-node"><span></span></div>
        <svg class="links"></svg>
    </div>
    <div class="controls-wrap list-controls">
        <div class="controls-wrap full">
            <div class="inputs-wrap">
                <div class="input-box">
                    <label for="item">Element(s)</label>
                    <input type="text" name="item" class="form-control" id="array-element">
                </div>
                <div class="input-box">
                    <label for="index">Index</label>
                    <input type="text" name="index" class="form-control" id="array-index">
                </div>
                <div class="reset-wrap">
                    <button class="btn btn-light" id="reset-array">
                        <span class="bi bi-arrow-clockwise"></span>
                    </button>
                </div>
            </div>
        </div>
        <div class="controls">
            <button class="btn btn-light" id="traverse-list">Traverse</button>
            <button class="btn btn-light" id="push-front">Push Front</button>
            <button class="btn btn-light" id="push-back">Push Back</button>
            <button class="btn btn-light" id="insert">Insert</button>
            <button class="btn btn-light" id="pop-front">Pop Front</button>
            <button class="btn btn-light" id="pop-back">Pop Back</button>
            <button class="btn btn-light" id="erase">Erase</button>
        </div>
    </div>
</div>