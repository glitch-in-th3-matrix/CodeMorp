<?php
    include_once "../Basic/Utils.php";

    $contact_type = [
        "teacher" => "students",
        "student" => "teachers"
    ];

    $qry_1 = "select contacts.* from {$user_type}s
              join $contact_type[$user_type] as contacts
              on {$user_type}s.department = contacts.department
              where {$user_type}s.email = '$user_email'";
    $contacts = $connection->query($qry_1);

    include_once "../Basic/Head.php";
    include_once "../Basic/Menu.php";
?>

    <div class="content-wrapper">
    <div class="container-fluid">
        <div class="row mt-3 profile-container">
            <div class="col-lg-4 profile-details">
                <div class="card profile-card-2">
                    <div class="contacts-container">
                        <div class="header">
                            <h3>Contacts</h3>
                        </div>
                        <div class="contacts-wrapper">
                            <?php while ($contact = $contacts->fetch_assoc()): ?>
                                <div class="contact" data-receiver="<?= $contact["email"] ?>">
                                    <div class="img-wrap">
                                        <img src="../../Media/<?= $contact_type[$user_type] ?>/<?= $contact["photo"] ?>" 
                                            alt="profile photo">
                                    </div>
                                    <p><?= $contact["name"] ?></p>
                                </div>
                            <?php endwhile; ?>
                        </div>
                    </div>
                </div>
            </div>
        
            <div class="col-12 col-lg-8 col-xl-8">
                <div class="card profile-card-2">
                    <div class="chat-container">
                        <div class="chat-wrap">
                            <div class="chat" id="chat">
                            </div>
                        </div>
                        <div class="input-box">
                            <input type="text" class="form-control" id="message">
                            <button class="btn btn-light" id="send-message">
                                <i class="bi bi-send-fill"></i>
                            </button>
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