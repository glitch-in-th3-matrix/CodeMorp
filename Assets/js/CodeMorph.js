$(document).ready(() => {
    // Show Password
    $("#show-password").on("change", (event) => {
        $("#password-input").attr(
            "type",
            event.target.checked ? "text" : "password"
        );
    });

    // PopUp Helper Function
    const showPopUp = (icon, title, message, attachment = null) => {
        isError = icon === "error";

        Swal.fire({
            icon: icon,
            title: title,
            text: message,
            background: isError ? "#000000E6" : "#fffffff8",
            iconColor: isError ? "red" : "#2196F3",
            color: isError ? "#FFF" : "#000",
            confirmButtonColor: isError ? "#B71919FF" : "#2196F3",
            showDenyButton: !!attachment,
            denyButtonText: "Download",
            denyButtonColor: "green",
        })
            .then((result) => {
                if (result.isDenied && attachment) {
                    const $a = $("<a>")
                        .attr("href", `../../Media/Attachments/${attachment}`)
                        .attr("download", "")
                        .css("display", "none");

                    $("body").append($a);
                    $a[0].click();
                    $a.remove();
                }
            });
    };

    // Flash Message
    const $flashMessage = $("#flash-message");

    if ($flashMessage.length) {
        var { icon, title, message } = $flashMessage.data();
        showPopUp(icon, title, message);
    }

    // Open Notification
    var $notifications = $(".alert.notification");

    if ($notifications.length) {
        $notifications.on("click", function () {
            var title = $(this).data("title");
            var message = $(this).data("message");
            var attachment = $(this).data("attachment");

            showPopUp("info", title, message, attachment);
        });
    }

    // Confirmbox
    const confirmDelete = (itemName) => {
        return Swal.fire({
            title: `Delete ${itemName.replace(/_/g, " ")}`,
            text: "This action can't be undone.",
            icon: "warning",
            iconColor: "red",
            showCancelButton: true,
            background: "#000000E6",
            color: "#FFF",
            confirmButtonColor: "#B71919FF",
            cancelButtonColor: "#4b5563",
            confirmButtonText: "Yes, Delete It!"
        });
    }

    // Delete Item
    $(document).on("click", ".delete-item", (e) => {
        e.preventDefault();

        const $this = $(e.currentTarget);
        const type = $this.data("type");
        const id = $this.data("id");

        confirmDelete(type).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: "../../Templates/Ajax/DeleteItem.php",
                    method: "POST",
                    data: {
                        type: type,
                        id: id
                    },
                    dataType: "json",
                    success: (response) => {
                        if (response.status == "success") {
                            $this.closest("tr").remove();
                            Swal.fire("Deleted!", response.message, "success");
                        } else {
                            Swal.fire("Error!", response.message, "error");
                        }
                    },
                    error: () => {
                        Swal.fire("OOPS!", "Server Error. Try Again", "error");
                    }
                });
            }
        });
    });

    // Label Shortener Helper Function
    function shortenLabel(label) {
        var words = label.split(" ");
        var firstWord = words[0];
        var initials = words.slice(1).map(word => word[0]).join('');

        return `${firstWord} ${initials}`;
    }

    // Random Color Generator
    function generateWhiteShades(count) {
        var shades = [];
        var step = 0.8 / (count - 1);

        for (let i = 0; i < count; i++) {
            const alpha = 1 - (step * i);
            shades.push(`rgba(255, 255, 255, ${alpha.toFixed(2)})`);
        }

        return shades;
    }

    // Chart Creator Helper Function
    function createChart(
        id,
        type,
        labels,
        data,
        backgroundColor,
        label,
        isCurved = false,
        symbol = null
    ) {
        const ctx = document.getElementById(id).getContext('2d');

        return new Chart(ctx, {
            type: type,
            data: {
                labels: type == "line" ? labels.map(shortenLabel) : labels,
                datasets: [{
                    label: label,
                    data: data,
                    backgroundColor: backgroundColor,
                    borderColor: type == "line" ? "#FFF" : "transparent",
                    borderWidth: type == "line" ? 1 : 0,
                    barThickness: 10,
                    fill: false,
                    tension: isCurved ? 0.1 : 0
                }]
            },
            options: {
                indexAxis: "x",
                responsive: true,
                maintainAspectRatio: false,
                scales: (type === "line" || type === "bar") ? {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            color: '#ddd'
                        },
                        grid: {
                            color: 'rgba(221, 221, 221, 0.08)'
                        }
                    },
                    y: {
                        ticks: {
                            color: '#ddd'
                        },
                        grid: {
                            color: 'rgba(221, 221, 221, 0.08)'
                        }
                    }
                } : {},
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            title: context => labels[context[0].dataIndex],
                            label: context => {
                                const value = context.dataset.data[context.dataIndex];
                                return `${label}: ${symbol ? symbol : ""} ${Number(value).toLocaleString()}`;
                            }
                        },
                        displayColors: false
                    }
                }
            }
        });
    }

    // Revenue Chart
    const $revenueChart = $("#revenue-chart");

    if ($revenueChart.length) {
        var departments = $revenueChart.data("departments");
        var revenue = $revenueChart.data("revenue");

        createChart(
            "revenue-chart",
            "line",
            departments,
            revenue,
            "#FFF",
            "Revenue",
            true,
            "₹"
        );
    }

    // Departments-Students Chart
    const $departmentsChart = $("#departments-chart");

    if ($departmentsChart.length) {
        var departments = $revenueChart.data("departments");
        var student_count = $departmentsChart.data("student-count");

        var bgColors = generateWhiteShades(departments.length);

        createChart(
            "departments-chart",
            "doughnut",
            departments,
            student_count,
            bgColors,
            "Students",
            false
        );
    }

    // Add Visualization Step Input
    $(".add-step").on("click", (e) => {
        var formGroup = `
            <div class="form-group">
                <input tpye="text" name="steps[]" class="form-control">
            </div>
        `;

        var $newInput = $(formGroup)
            .insertBefore(
                $(e.target)
                    .closest(".steps-wrap")
                    .find(".plus-wrap")
            )
            .find("input");

        $newInput.focus();
    });

    //Sanitize Array Inputs
    $(document).on("input", "#array-input", function () {
        this.value = this.value.replace(/[^0-9\s]/g, "");
    });

    // Get Visualization
    var $visualizationWrapper = $('.visualization-wrapper');
    var visualization = $visualizationWrapper.data('visualization');

    $visualizationWrapper.load(`../../Templates/Ajax/${visualization}.php`, () => {
        const $defaultArray = $(".array-wrapper").html();

        // Build Array Helper Function
        function buildArray(mode, checkSorted = false, max = 20) {
            var $arrayWrapper = $(".array-wrapper");
            var $input = $("#array-input");
            var arrayInput = $input.val().trim();

            let array = arrayInput
                .split(/[ \s]+/)
                .filter(v => v.length)
                .map(Number);

            if (!array.length) return null;

            if (checkSorted) {
                for (let i = 1; i < array.length; i++) {
                    if (array[i] < array[i - 1]) {
                        showPopUp(
                            "error",
                            "Unsorted Array!",
                            "Binary Search only works on sorted arrays."
                        );
                        return null;
                    }
                }
            }

            if (mode === "sort") {
                if (array.length > max) {
                    showPopUp(
                        "error",
                        "Too Many Items!",
                        `Please limit the array to a maximum of ${max} elements for visualization.`
                    );
                    return null;
                }

                if (Math.max(...array) > 15 || Math.min(...array) < 1) {
                    showPopUp(
                        "error",
                        "Out of Range!",
                        "Values must be between 1 and 15 for visualization."
                    );
                    return null;
                }
            }

            let html = "";
            array.forEach(number => {
                html += `<div class="array-item" data-item="${number}"><span>${number}</span></div>`;
            });

            $input.val("");
            $arrayWrapper.html(html);

            if (mode === "sort") {
                $(".array-item").each(function () {
                    $(this).css(
                        "height",
                        parseInt($(this).data("item"), 10) * 4 + "vh"
                    );
                });
            }

            return array;
        }

        // Linear Search
        if ($(".linear-search-wrapper").length) {
            let array = [];
            let target = null;
            let index = 0;
            let interval = null;

            // Linear Search Build Array
            $("#ls-build-array").on("click", () => {
                array = buildArray("search") || [];
                index = 0;
            });

            // Linear Search Step Helper Function
            function lsStep() {
                var $arrayItems = $(".array-wrapper .array-item");
                target = parseInt($("#ls-target").val().trim(), 10);

                if (!array.length || isNaN(target) || index >= array.length) {
                    const messages = {
                        noArray: ["error", "No Array!", "Build an array first"],
                        noTarget: ["error", "No Target", "Enter a valid target"],
                    };

                    if (!array.length) showPopUp(...messages.noArray);
                    else if (isNaN(target)) showPopUp(...messages.noTarget);

                    if (interval) clearInterval(interval);
                    return;
                };

                var $current = $arrayItems.eq(index);

                if (array[index] == target) {
                    $current.addClass("found");
                    showPopUp(
                        "success",
                        "Target Found!",
                        `${target} found at index ${index}`
                    );
                    index = array.length;
                } else {
                    $current.addClass("not-found");
                    index++;

                    if (index >= array.length) {
                        showPopUp(
                            "warning",
                            "Target Not Found!",
                            `${target} does not exist in the array`
                        );
                    }
                }
            }

            // Linear Search Step
            $("#ls-step").on("click", lsStep);

            // Linear Search Play
            $("#ls-play").on("click", () => {
                if (interval) clearInterval(interval);
                interval = setInterval(lsStep, 500);
            });

            // Linear Search Pause
            $("#ls-pause").on("click", () => {
                if (interval) clearInterval(interval);
            });

            // Linear Search Reset
            $("#ls-reset").on("click", () => {
                if (interval) clearInterval(interval);
                index = 0;

                $("#array-input").val("");
                $("#ls-target").val("");
                $(".array-wrapper .array-item").removeClass("not-found found");
                $(".array-wrapper").html($defaultArray);
            });

            // Linear Search New Target
            $("#ls-target").on("blur", () => {
                if (interval) clearInterval(interval);
                index = 0;
                $(".array-wrapper .array-item").removeClass("not-found found");
            });
        }

        // Binary Search
        else if ($(".binary-search-wrapper").length) {
            let array = [];
            let low = 0;
            let mid = 0;
            let high = 0;
            let target = null;
            let interval = null;
            let searchComplete = false;

            // Binary Search Build Array
            $("#bs-build-array").on("click", () => {
                array = buildArray("search", true) || [];
                searchComplete = false;
                low = 0;
                mid = 0;
                high = array.length - 1;
            });

            // Binary Search Helper Function
            function bsStep() {
                if (searchComplete) return;

                var $arrayItems = $(".array-wrapper .array-item");
                target = parseInt($("#bs-target").val().trim());

                if (!array.length || isNaN(target)) {
                    const messages = {
                        noArray: ["error", "No Array!", "Build an array first"],
                        noTarget: ["error", "No Target", "Enter a valid target"],
                    };

                    if (!array.length) showPopUp(...messages.noArray);
                    else if (isNaN(target)) showPopUp(...messages.noTarget);

                    if (interval) clearInterval(interval);
                    return;
                }

                if (low > high) {
                    showPopUp(
                        "warning",
                        "Target not found!",
                        `${target} does not exist in array`
                    );
                    if (interval) clearInterval(interval);
                    searchComplete = true;
                    return;
                }

                mid = Math.floor((low + high) / 2);
                var $current = $arrayItems.eq(mid);

                if (array[mid] === target) {
                    $current.addClass("found");
                    showPopUp("success", "Target Found!", `${target} found at index ${mid}`);
                    if (interval) clearInterval(interval);
                    searchComplete = true;
                } else if (array[mid] > target) {
                    for (let i = mid; i <= high; i++) {
                        $arrayItems.eq(i).addClass("not-found");
                    }
                    high = mid - 1;
                } else {
                    for (let i = low; i <= mid; i++) {
                        $arrayItems.eq(i).addClass("not-found");
                    }
                    low = mid + 1;
                }
            }

            // Binary Search Step
            $("#bs-step").on("click", bsStep);

            // Binary Search Play
            $("#bs-play").on("click", () => {
                if (interval) clearInterval(interval);
                interval = setInterval(bsStep, 500);
            });

            // Binary Search Pause
            $("#bs-pause").on("click", () => {
                if (interval) clearInterval(interval);
            })

            // Binary Search Reset
            $("#bs-reset").on("click", () => {
                if (interval) clearInterval(interval);

                array = [];
                searchComplete = false;
                low = 0;
                mid = 0;
                target = null;

                $("#array-input").val("");
                $("#bs-target").val("");
                $('.array-wrapper .array-item').removeClass("not-found found");
                $(".array-wrapper").html($defaultArray);
            });

            // Linear Search New Target
            $("#bs-target").on("blur", () => {
                if (interval) clearInterval(interval);

                searchComplete = false;
                low = 0;
                mid = 0;
                high = array.length - 1;

                $(".array-wrapper .array-item").removeClass("not-found found");
            });
        }

        // Bubble Sort
        else if ($(".bubble-sort-wrapper").length) {
            let array = [];
            let pass = 0;
            let index = 0;
            let sorted = false;
            let passInterval = null;
            let interval = null;

            // Bubble Sort Array Builder
            $("#sort-build-array").on("click", () => {
                array = buildArray("sort") || [];
                pass = 0;
                index = 0;
                sorted = false;

                if (passInterval) clearInterval(passInterval);
                if (interval) clearInterval(interval);
            });

            // Bubble Sort Step Helper Function
            function bubbleSortStep() {
                if (sorted) return;

                if (!array.length) {
                    showPopUp(
                        "error",
                        "No Array!",
                        "Build an array first."
                    );

                    if (passInterval) clearInterval(passInterval);
                    if (interval) clearInterval(interval);
                    return;
                }

                const $arrayItems = $(".array-item");
                const $currentItem = $arrayItems.eq(index);
                const $nextItem = $arrayItems.eq(index + 1);

                $arrayItems.removeClass("comparing");
                $currentItem.addClass("comparing");
                $nextItem.addClass("comparing");

                if (array[index] > array[index + 1]) {
                    [array[index], array[index + 1]] = [array[index + 1], array[index]];
                    $nextItem.insertBefore($currentItem);
                }

                index++;

                if (index >= array.length - pass - 1) {
                    $arrayItems.removeClass("comparing");
                    $(".array-item").eq(array.length - pass - 1).addClass("sorted");
                    index = 0;
                    pass++;
                }

                if (pass >= array.length - 1) {
                    $(".array-item").eq(array.length - pass - 1).addClass("sorted");
                    sorted = true;
                    showPopUp(
                        "success",
                        "Sorting Complete!",
                        "The array has been successfully sorted using bubble sort."
                    );
                }
            }

            // Bubble Sort Step
            $("#b-sort-step").on("click", bubbleSortStep);

            // Bubble Sort Pass
            $("#b-sort-pass").on("click", () => {
                let startPass = pass;

                passInterval = setInterval(() => {
                    if (pass === startPass && !sorted) bubbleSortStep();
                    else clearInterval(passInterval)
                }, 200);
            });

            // Bubble Sort Play
            $("#b-sort-play").on("click", () => {
                if (interval) clearInterval(interval);
                interval = setInterval(bubbleSortStep, 200);
            });

            // Bubble Sort Pause
            $("#b-sort-pause").on("click", () => {
                if (passInterval) clearInterval(passInterval);
                if (interval) clearInterval(interval);
            });

            // Bubble Sort Reset
            $("#b-sort-reset").on("click", () => {
                if (passInterval) clearInterval(passInterval);
                if (interval) clearInterval(interval);

                array = [];
                pass = 0;
                index = 0;
                sorted = false;

                $("#array-input").val("");
                $(".array-wrapper").html($defaultArray);
            });
        }

        // Selection Sort
        else if ($(".selection-sort-wrapper").length) {
            let array = [];
            let sorted = false;
            let passInterval = null;
            let interval = null;
            let currentIndex = 0;
            let scanIndex = 1;
            let minIndex = 0;

            // Selection Sort Build Array
            $("#sort-build-array").on("click", () => {
                if (passInterval) clearInterval(passInterval);
                if (interval) clearInterval(interval);

                array = buildArray("sort") || [];
                sorted = false;
                passInterval = null;
                interval = null;
                currentIndex = 0;
                scanIndex = 0;
                minIndex = 0;
            });

            // Selection Sort Step Helper Function
            function selectionSortStep() {
                if (sorted) return;

                if (!array.length) {
                    showPopUp(
                        "error",
                        "No Array!",
                        "Build an array first."
                    );

                    if (passInterval) clearInterval(passInterval);
                    if (interval) clearInterval(interval);
                    return;
                }

                const $arrayItems = $(".array-item");
                $arrayItems.removeClass("comparing min");

                if (scanIndex < array.length) {
                    $arrayItems.eq(scanIndex).addClass("comparing");
                    $arrayItems.eq(minIndex).addClass("min");

                    if (array[scanIndex] < array[minIndex]) {
                        minIndex = scanIndex;
                    }

                    scanIndex++;
                    return;
                }

                if (minIndex !== currentIndex) {
                    [array[currentIndex], array[minIndex]] = [array[minIndex], array[currentIndex]];

                    const $arrayItems = $(".array-item");
                    const $currentItem = $arrayItems.eq(currentIndex);
                    const $minItem = $arrayItems.eq(minIndex);
                    const $currentClone = $currentItem.clone(true);
                    const $minClone = $minItem.clone(true);

                    $currentItem.replaceWith($minClone);
                    $minItem.replaceWith($currentClone);
                }

                $(".array-item").eq(currentIndex).addClass("sorted");

                currentIndex++;
                scanIndex = currentIndex + 1;
                minIndex = currentIndex;

                if (currentIndex >= array.length - 1) {
                    $(".array-item").eq(array.length - 1).addClass("sorted");
                    sorted = true;
                    showPopUp(
                        "success",
                        "Sorting Complete!",
                        "The array has been successfully sorted using selection sort."
                    );
                }
            }

            // Selection Sort Step
            $("#s-sort-step").on("click", selectionSortStep);

            // Selection Sort Pass
            $("#s-sort-pass").on("click", () => {
                let startIndex = currentIndex;

                passInterval = setInterval(() => {
                    if (currentIndex === startIndex && !sorted) selectionSortStep();
                    else clearInterval(passInterval);
                }, 200);
            });

            // Selection Sort Play
            $("#s-sort-play").on("click", () => {
                if (interval) clearInterval(interval);
                interval = setInterval(selectionSortStep, 200);
            });

            // Selection Sort Pause
            $("#s-sort-pause").on("click", () => {
                if (passInterval) clearInterval(passInterval);
                if (interval) clearInterval(interval);
            });

            // Selection Sort Reset
            $("#s-sort-reset").on("click", () => {
                if (passInterval) clearInterval(passInterval);
                if (interval) clearInterval(interval);

                array = [];
                sorted = false;
                currentIndex = 0;
                scanIndex = 1;
                minIndex = 0;

                $("#array-input").val("");
                $(".array-wrapper").html($defaultArray);
            });
        }

        // Insertion Sort
        else if ($(".insertion-sort-wrapper").length) {
            let array = [];
            let currentIndex = 1;
            let scanIndex = null;
            let key = undefined;
            let sorted = false;
            let passInterval = null;
            let interval = null;

            // Insertion Sort Build Array
            $("#sort-build-array").on("click", () => {
                if (passInterval) clearInterval(passInterval);
                if (interval) clearInterval(interval);

                array = buildArray("sort") || [];
                currentIndex = 1;
                scanIndex = null;
                key = undefined;
                sorted = false;
            });

            // Insertion Sort Step Helper Function
            function insertionSortStep() {
                if (sorted) return;

                if (!array.length) {
                    showPopUp(
                        "error",
                        "No Array!",
                        "Build and array first!"
                    );

                    if (passInterval) clearInterval(passInterval);
                    if (interval) clearInterval(interval);
                    return;
                }

                const $arrayItems = $(".array-item");
                $arrayItems.removeClass("sorted");

                for (let i = 0; i < currentIndex + 1; i++) {
                    $arrayItems.eq(i).addClass("sorted");
                }

                if (typeof key === "undefined") {
                    key = array[currentIndex];
                    scanIndex = currentIndex - 1;
                    $arrayItems.eq(currentIndex).addClass("key");
                    return;
                }

                if (scanIndex >= 0 && array[scanIndex] > key) {
                    array[scanIndex + 1] = array[scanIndex];

                    const $scanItem = $arrayItems.eq(scanIndex);
                    $scanItem.insertAfter($arrayItems.eq(scanIndex + 1));

                    scanIndex--;
                    return;
                }

                $arrayItems.removeClass("key")
                array[scanIndex + 1] = key;

                currentIndex++;
                key = undefined;

                if (currentIndex >= array.length) {
                    sorted = true;
                    $arrayItems.addClass("sorted");
                    showPopUp(
                        "success",
                        "Sorting Complete!",
                        "The array has been successfully sorted using insertion sort."
                    );
                }
            }

            // Insertion Sort Step
            $("#i-sort-step").on("click", insertionSortStep);

            // Insertion Sort Pass
            $("#i-sort-pass").on("click", () => {
                let startIndex = currentIndex;

                passInterval = setInterval(() => {
                    if (currentIndex === startIndex && !sorted) insertionSortStep();
                    else clearInterval(passInterval);
                }, 200);
            });

            // Insertion Sort Play
            $("#i-sort-play").on("click", () => {
                if (interval) clearInterval(interval);
                interval = setInterval(insertionSortStep, 200);
            });

            // Insertion Sort Pause
            $("#i-sort-pause").on("click", () => {
                if (passInterval) clearInterval(passInterval);
                if (interval) clearInterval(interval);
            });

            // Insertion Sort Reset
            $("#i-sort-reset").on("click", () => {
                if (passInterval) clearInterval(passInterval);
                if (interval) clearInterval(interval);

                array = [];
                currentIndex = 1;
                scanIndex = null;
                key = undefined;
                sorted = false;

                $("#array-input").val("");
                $(".array-wrapper").html($defaultArray);
            });
        }

        // Merge Sort
        else if ($(".merge-sort-wrapper").length) {
            let array = [];
            let steps = [];
            let stepIndex = 0;
            let sorted = false;
            let interval = null;

            // Plan Steps Helper Function
            function plan(left, right) {
                if (left >= right) return;

                const mid = Math.floor((left + right) / 2);

                steps.push({type: "split", left, mid, right});
                plan(left, mid);
                plan(mid + 1, right);
                steps.push({type: "merge", left, mid, right});
            }

            // Merge Sort Build Array
            $("#sort-build-array").on("click", () => {
                array = buildArray("sort", false, 20) || [];
                steps = [];
                stepIndex = 0;
                sorted = false;

                $(".array-item").removeClass("split-left split-right merged sorted");
                if (interval) clearInterval(interval);
                if (array.length > 0) plan(0, array.length - 1);
            });

            // Merge Sort Step Helper Function
            function mergeSortStep() {
                if (sorted) return;

                if (!array.length) {
                    showPopUp(
                        "error",
                        "No Array",
                        "Build an array first."
                    );

                    if (interval) clearInterval(interval);
                    return;
                }

                const action = steps[stepIndex];
                const $arrayItems = $(".array-item");

                $arrayItems.removeClass("split-left split-right");

                if (action.type === "split") {
                    for (let i = action.left; i <= action.mid; i++) {
                        $arrayItems.eq(i).addClass("split-left");
                    }

                    for (let i = action.mid + 1; i <= action.right; i++) {
                        $arrayItems.eq(i).addClass("split-right")
                    }
                } else {
                    const leftHalf = array.slice(action.left, action.mid + 1);
                    const rightHalf = array.slice(action.mid + 1, action.right + 1);
                    const merged = [];
                    let i = 0, j = 0;

                    while (i < leftHalf.length && j < rightHalf.length) {
                        if (leftHalf[i] <= rightHalf[j]) merged.push(leftHalf[i++]);
                        else merged.push(rightHalf[j++]);
                    } 

                    while (i < leftHalf.length) merged.push(leftHalf[i++]);
                    while (j < rightHalf.length) merged.push(rightHalf[j++]);

                    for (let k = 0; k < merged.length; k++) {
                        const index = action.left + k;
                        array[index] = merged[k];
                        
                        const $arrayItem = $arrayItems.eq(index);
                        $arrayItem.attr("data-item", merged[k]);
                        $arrayItem.find("span").text(merged[k]);
                        $arrayItem.css("height", `${merged[k] * 4}vh`);
                        $arrayItem.addClass("sorted");
                    }
                }

                stepIndex++;

                if (stepIndex >= steps.length) {
                    sorted = true;
                    showPopUp(
                        "success",
                        "Sorting Complete!",
                        "The array has been successfully sorted using merge sort."
                    );

                    if (interval) clearInterval(interval);
                    return;
                }
            }

            // Merge Sort Step
            $("#m-sort-step").on("click", mergeSortStep);

            // Merge Sort Pass
            $("#m-sort-play").on("click", () => {
                if (interval) clearInterval(interval);
                interval = setInterval(mergeSortStep, 300);
            });

            // Merge Sort Pause
            $("#m-sort-pause").on("click", () => {
                if (interval) clearInterval(interval);
            });

            // Merge Sort Reset
            $("#m-sort-reset").on("click", () => {
                steps = [];
                stepIndex = 0;
                sorted = false;

                if (interval) clearInterval(interval);
                $(".array-wrapper").html($defaultArray);
            });
        }
    });
});