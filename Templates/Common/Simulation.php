<?php
    include_once "../Basic/Utils.php";
    
    $id = $_GET["id"];

    $qry_1 = "select * from simulations where id = $id";
    $simulation = $connection->query($qry_1)->fetch_assoc();

    include_once "../Basic/Head.php";
    include_once "../Basic/Menu.php";
?>

<div class="content-wrapper">
    <div class="container-fluid">
        <div class="row mt-3 simulation-container">
            <div class="col-lg-12 simulation-tabs">
                <div class="card">
                    <div class="card-body">
                        <ul class="nav nav-tabs nav-tabs-primary row top-icon nav-justified">
                            <li class="nav-item">
                                <a href="javascript:void();" data-target="#details" data-toggle="tab"
                                    class="nav-link active">
                                        <i class="bi bi-file-earmark-text"></i> 
                                        <span class="hidden-xs">Details</span>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="javascript:void();" data-target="#visualization" data-toggle="tab"
                                    class="nav-link">
                                        <i class="bi bi-bar-chart"></i> 
                                        <span class="hidden-xs">Visualization</span></a>
                            </li>
                        </ul>
                        <div class="tab-content p-3">
                            <div class="tab-pane active" id="details">
                                <div class="simulation-wrapper">
                                    <div class="description-wrap">
                                        <h4><?= $simulation["title"] ?></h4>
                                        <p><?= $simulation["description"] ?></p>
                                    </div>
                                    <div class="code-wrap">
                                        <h5>Code</h5>
                                        <pre>
                                            <code class="language-cpp"><?= htmlspecialchars($simulation["code"]) ?></code>
                                        </pre>
                                    </div>
                                    <div class="steps-wrap">
                                        <h5>Steps</h5>
                                        <ul>
                                            <?php foreach (json_decode($simulation["steps"]) as $step): ?>
                                                <li><?= $step ?></li>
                                            <?php endforeach; ?>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane tab-pane-2" id="visualization">
                                <div class="visualization-wrapper" data-visualization="<?= slugify($simulation["title"]) ?>">
                                </div>
                            </div>
                        </div>
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