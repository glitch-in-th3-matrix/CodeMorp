<?php
    include_once "../Basic/Utils.php";
    include_once "../Basic/Head.php";
    include_once "../Basic/Menu.php";
?>

<div class="content-wrapper" id="exam-wrapper">
    <div class="container-fluid">
        <div class="row mt-3 profile-container">
            <div class="col-lg-8 profile-tabs">
                <div class="card test-card-left">
                    <div class="card-body">
                        <div class="question-wrap">
                            <div class="question-cover">
                                <p class="question" id="question"></p>
                            </div>
                            <div class="options-wrap">
                                <div class="option"></div>
                                <div class="option"></div>
                                <div class="option"></div>
                                <div class="option"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-lg-4 profile-details">
                <div class="card test-card-right">
                    <div class="clock-wrap">
                        <p class="countdown">02:00</p>
                    </div>
                    <div class="questions-wrap">
                        <?php for ($i = 1; $i <= 20; $i++): ?>
                            <div class="question-no">
                                <p><?= $i ?></p>
                            </div>
                        <?php endfor ?>
                    </div>
                    <div class="submit-wrap">
                        <button class="btn btn-light" id="submit-exam">Submit</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="overlay toggle-menu"></div>
    </div>
</div>
<?php
    include_once "../Basic/Footer.php";
?>