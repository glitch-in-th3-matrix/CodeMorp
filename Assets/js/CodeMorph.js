$(document).ready(() => {
    // Toggle Password Visibility
    $("#show-password").on("change", (event) => {
        $("#password-input").attr(
            "type",
            event.target.checked ? "text" : "password"
        );
    });


    /**
     * Shows a PopUp with optional attachment
     * 
     * @param {'success' | 'error' | 'warning' | 'info' | 'question'} icon 
     * @param {string} title 
     * @param {string} message 
     * @param {string} [attachment=null] 
     * @param {boolean} [escape=true] 
     * @returns {Promise<import('sweetalert2).SweerAlertResult<any>>;}
     */
    const showPopUp = (
        icon,
        title,
        message,
        attachment = null,
        escape = true
    ) => {
        isError = icon === "error";

        return Swal.fire({
            icon: icon,
            title: title,
            text: message,
            background: isError ? "#000000E6" : "#fffffff8",
            iconColor: isError ? "red" : "#2196F3",
            color: isError ? "#FFF" : "#000",
            showConfirmButton: escape,
            confirmButtonColor: isError ? "#B71919FF" : "#2196F3",
            showDenyButton: !!attachment,
            denyButtonText: "Download",
            denyButtonColor: "green",
            allowOutsideClick: escape,
            allowEscapeKey: escape,
            showCancelButton: !escape,
            cancelButtonColor: "#B71919FF",
            cancelButtonText: "Submit"
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

            showPopUp("info", title, message, attachment)
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
        });
    }


    /**
     * Deletion Confirm Box
     * 
     * @param {string} itemName 
     * @returns {Promise<import('sweetalert2').SweetAlertResult<any>>}
     */
    const confirmDelete = (itemName) => {
        return Swal.fire({
            title: `Delete ${itemName.replace(/_/g, " ")}`,
            text: "This action can't be undone.",
            icon: "warning",
            iconColor: "red",
            showCancelButton: true,
            background: "#000000E6",
            color: "#FFFFFF",
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
                        if (response.status === "success") {
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


    // Handle Simulation Status
    $(document).on("click", ".simulation-status", (e) => {
        e.preventDefault();

        const $this = $(e.currentTarget);
        const status = $this.data("status");
        const id = $this.data("id");
        const approve = status == 1;

        Swal.fire({
            title: `${approve ? "Approve" : "Reject"} simulation`,
            text: "This action can't be undone",
            icon: approve ? "success" : "warning",
            iconColor: approve ? "#2196F3" : "#B71919FF",
            showCancelButton: true,
            background: approve ? "#FFFFFF" : "#000000E6",
            color: approve ? "#000000" : "#FFFFFF",
            confirmButtonColor: approve ? "#2196F3" : "#B71919FF",
            cancelButtonColor: "#4B5563",
            confirmButtonText: "Yes"
        })
            .then((result) => {
                if (result.isConfirmed) {
                    $.ajax({
                        url: "../../Templates/Ajax/SimulationStatus.php",
                        method: "POST",
                        data: {
                            status: status,
                            id: id
                        },
                        dataType: "json",
                        success: (response) => {
                            if (response.status == "success") {
                                $this.closest("tr").remove();
                                showPopUp(
                                    "success",
                                    `Simulation ${approve ? "Approved" : "Rejected"}`,
                                    response.message
                                );
                            } else {
                                showPopUp(
                                    "error",
                                    "Error!",
                                    response.message
                                );
                            }
                        },
                        error: () => {
                            showPopUp(
                                "error",
                                "OOPS!",
                                "Server Error. Try Again"
                            );
                        }
                    });
                }
            });
    });


    // Student Details Redirect
    $("tr[data-student-id]").on("click", (e) => {
        if (!$(e.target).closest("a").length) {
            const studentId = $(e.currentTarget).data("student-id");
            window.location.href = `../../Templates/Common/Student.php?id=${studentId}`;
        }
    });


    /**
     * Shortens a chart label
     * 
     * @param {string} label 
     * @returns {string}
     */
    function shortenLabel(label) {
        var words = label.split(" ");
        var firstWord = words[0];
        var initials = words.slice(1).map(word => word[0]).join('');

        return `${firstWord} ${initials}`;
    }


    /**
     * Generates an array of shades of white
     * 
     * @param {number} count 
     * @returns {string[]}
     */
    function generateWhiteShades(count) {
        var shades = [];
        var step = 0.8 / (count - 1);

        for (let i = 0; i < count; i++) {
            const alpha = 1 - (step * i);
            shades.push(`rgba(255, 255, 255, ${alpha.toFixed(2)})`);
        }

        return shades;
    }


    /**
     * Creates a chart.js on a given canvas element
     * 
     * @param {string} id 
     * @param {'line'|'bar'|'pie'|'doughnut'|'radar'|'polarArea'|'bubble'|'scatter'} type 
     * @param {string[]} labels 
     * @param {number[]} data 
     * @param {string|string[]} backgroundColor 
     * @param {string} label
     * @param {boolean} [isCurved=false] 
     * @param {string|null} [symbol=null]   
     * @param {number|boolean} [startAtZero=false] 
     * @returns {import('chart.js').Chart;}
     */
    function createChart(
        id,
        type,
        labels,
        data,
        backgroundColor,
        label,
        isCurved = false,
        symbol = null,
        startAtZero = false
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
                        min: startAtZero !== false ? startAtZero : undefined,
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


    // Exam Chart
    const $testsChart = $("#tests-chart");

    if ($testsChart.length) {
        var marks = $testsChart.data("marks");
        var tests = marks.map((element, index) => `Test ${index + 1}`);

        createChart(
            "tests-chart",
            "line",
            tests,
            marks,
            "#FFF",
            "Score",
            true,
            null,
            0
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
    $(document).on("input", "#array-input, #array-element, #array-index", function () {
        this.value = this.value.replace(/[^0-9\s]/g, "");
    });


    // Get Visualization
    var $visualizationWrapper = $('.visualization-wrapper');
    var visualization = $visualizationWrapper.data('visualization');

    $visualizationWrapper.load(`../../Templates/Ajax/${visualization}.php`, () => {
        const defaultArray = $(".array-wrapper").html();
        const binaryOperators = new Set(["+", "-", "*", "/", "^"]);
        const unaryOperators = new Set([
            "sin",
            "cos",
            "tan",
            "log",
            "sqrt"
        ]);


        /**
         * Infix Expression Validator
         * 
         * @param {string} expression 
         * @returns {string|boolean}
         */
        function isValidInfix(expression) {
            if (!expression.length) return false;

            const validPattern = /^[A-Za-z0-9+\-*/^()\s]+$/;
            if (!validPattern.test(expression)) return false;

            let balance = 0;
            for (let char of expression) {
                balance += char === '(' ? 1 : (char === ')' ? -1 : 0);
                if (balance < 0) return false;
            }

            if (balance !== 0) return false;

            expression = expression.replace(/\s+/g, "");

            if (/^[+\-*/^]/.test(expression)) return false;
            if (/[+\-*/^]$/.test(expression)) return false;
            if (/([+\-*/^]{2,})/.test(expression)) return false;

            return expression;
        }


        /**
         * Postfix Expression Validator
         * 
         * @param {string} expression 
         * @returns {string|boolean|undefined}
         */
        function isValidPostfix(expression) {
            if (!expression) return;

            const tokens = expression.trim().split(/\s+/);
            let stackCount = 0;

            for (let token of tokens) {
                if (/^\d+(\.\d+)?$/.test(token)) {
                    stackCount++;

                } else if (binaryOperators.has(token)) {
                    if (stackCount < 2) return false;
                    stackCount--;

                } else if (unaryOperators.has(token)) {
                    if (stackCount < 1) return false;

                } else {
                    return false;
                }
            }

            return stackCount === 1 ? tokens.join(" ") : false;
        }


        /**
         * Expression Tokenizer Helper Function
         * 
         * @param {string} expression 
         * @returns {string[]}
         */
        function tokenize(expression) {
            const regex = /\s*([A-Za-z]+|\d+\.?\d*|[+\-*/^()]|\S)\s*/g;
            const tokens = [];
            let match;

            while ((match = regex.exec(expression)) !== null) {
                tokens.push(match[1]);
            }

            return tokens;
        }


        /**
         * Array Builder Helper Function
         * 
         * @param {"search"|"sort"|"1D"|"stack"|"queue"} mode 
         * @param {boolean} checkSorted 
         * @param {number} max 
         * @returns {number[]|null}
         */
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
            } else if (["stack", "queue"].includes(mode)) {
                if (array.length > max) {
                    showPopUp(
                        "error",
                        "Too Many Items!",
                        `Please limit the stack to a maximum of ${max} elements for visualization.`
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
                        +($(this).data("item")) * 4 + "vh"
                    );
                });
            }

            return array;
        }


        /**
         *  Matrix Builder Helper Function
         * 
         * @returns {number[][]|undefined}
         */
        function buildMatrix() {
            const $arrayWrapper = $(".array-wrapper");
            var $rowsInput = $("#rows");
            var $columnsInput = $("#columns");
            var $limitInput = $("#limit");

            var rowsLength = +$rowsInput.val().trim();
            var columnsLength = +$columnsInput.val().trim();
            var limit = +$limitInput.val().trim();

            if (
                rowsLength < 1 || rowsLength > 10 || columnsLength < 1 || columnsLength > 10
            ) {
                showPopUp(
                    "error",
                    "Row / Column count out of range",
                    "Keep the row / column count between 1 - 10 for visualization purposes"
                );
                return;
            }

            if (limit < 1 || limit > 100) {
                showPopUp(
                    "error",
                    "Limit out of range",
                    "Keep limit between 1 - 100 for visualization"
                );
                return;
            }

            var matrix = [];
            for (let i = 0; i < rowsLength; i++) {
                matrix[i] = [];
                for (let j = 0; j < columnsLength; j++) {
                    matrix[i][j] = Math.ceil(Math.random() * limit);
                }
            }

            $arrayWrapper.empty();
            $rowsInput.val("");
            $columnsInput.val("");
            $limitInput.val("");

            matrix.forEach(row => {
                const $row = $(`<div class="row-wrap"></dv>`);

                row.forEach(item => {
                    const $item = $(`<div class="array-item"><span>${item}</span></div>`);
                    $row.append($item);
                });

                $arrayWrapper.append($row);
            });

            return matrix;
        }


        /**
         * Character Array Builder Helper Function
         * 
         * @param {"infix"|"postfix"} notation 
         * @param {string[]} tokens 
         * @returns {void}
         */
        function loadChars(notation, tokens) {
            const input = $("#character-input").val().trim();
            const $charsContainer = $(".input-wrapper .characters-wrap .characters");
            const $operatorContainer = $(".operator-wrap .operators");
            const $outputContainer = $(".output-wrapper .characters");
            const $stackContainer = $(".stack-wrap .characters");

            $charsContainer.empty();
            $operatorContainer.empty();
            $outputContainer.empty();
            $stackContainer.empty();

            const expression = notation === "infix"
                ? isValidInfix(input)
                : isValidPostfix(input);

            if (!expression) {
                showPopUp(
                    "error",
                    "Invalid Expression",
                    "The entered expression is invalid"
                );
                return;
            }

            tokens.length = 0;
            tokens.push(...(tokenize(expression)));

            tokens.forEach(token => {
                const $character = $(`<div class="char"><p>${token}</p></div>`);
                $charsContainer.append($character);
            });

            $("#character-input").val("");
        }


        /**
         * 1D Array Validator Utility Function
         * 
         * @param {number[]} array 
         * @param {string|undefined} element 
         * @param {string|undefined} index 
         * @param {"merge"|"slice"} func 
         * @returns {boolean|undefined}
         */
        function oneDArrayValidator(array, element, index, func) {
            if (!array.length) {
                showPopUp(
                    "error",
                    "No Array",
                    "Build an array first"
                );
                return;
            }

            if (element !== undefined) {
                const trimmed = element.trim();
                if (!trimmed || (func !== "merge" && trimmed.includes(" "))) {
                    showPopUp(
                        "error",
                        !trimmed ? "No Element Specified" : "Invalid Element",
                        !trimmed ? "Enter an Element" : "Enter a valid Element"
                    );
                    return;
                }
            }

            if (index !== undefined) {
                const trimmed = index.trim();
                if (!trimmed || (func !== "slice" && trimmed.includes(" "))) {
                    showPopUp(
                        "error",
                        "Invalid Index!",
                        "Enter a valid index"
                    );
                    return;
                }

                if (func === "slice") {
                    const indices = index.trim().split(/\s+/);
                    if (indices.length > 2) {
                        showPopUp(
                            "error",
                            "Invalid Index",
                            "Enter one or two space-separated indices"
                        );
                        return;
                    }
                }

                const num = Number(trimmed);
                if (num < 0 || num >= array.length) {
                    showPopUp(
                        "error",
                        "Invalid Index",
                        "Index out of range"
                    );
                    return;
                }
            }

            return true;
        }


        /**
         * 2D Array Validator Utility Function
         * 
         * @param {number[][]} matrix 
         * @param {string|undefined} element 
         * @param {string|undefined} rowIndex 
         * @param {string|undefined} columnIndex 
         * @returns {boolean|undefined}
         */
        function twoDArrayValidator(matrix, element, rowIndex, columnIndex) {
            const checkIndex = (value, max, type) => {
                if (value === "" || +value >= max) {
                    showPopUp(
                        "error",
                        value === "" ? `No ${type} index` : `Invalid ${type} index`,
                        value === "" ? `Enter a ${type.toLowerCase()} index` : `${type} index out of range`
                    );
                    return;
                }
                return true;
            }

            if (!matrix.length) {
                showPopUp(
                    "error",
                    "No Array",
                    "Build an array first"
                );
                return;
            }

            if (
                rowIndex !== undefined && !checkIndex(
                    rowIndex,
                    matrix.length,
                    "Row"
                )
            ) return;

            if (
                columnIndex !== undefined && !checkIndex(
                    columnIndex,
                    matrix[rowIndex].length,
                    "Column"
                )
            ) return;

            if (element !== undefined && element === "") {
                showPopUp(
                    "error",
                    "No Element Specified",
                    "Enter an element"
                );
                return;
            }

            return true;
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


            /**
             * Linear Search Step Helper Function
             * 
             * @returns {void}
             */
            function linearSearchStep() {
                var $arrayItems = $(".array-wrapper .array-item");
                target = +$("#ls-target").val().trim();

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
            $("#ls-step").on("click", linearSearchStep);

            // Linear Search Play
            $("#ls-play").on("click", () => {
                if (interval) clearInterval(interval);
                interval = setInterval(linearSearchStep, 500);
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
                $(".array-wrapper").html(defaultArray);
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


            /**
             * Binary Search Helper Function
             * 
             * @returns {void}
             */
            function binarySearchStep() {
                if (searchComplete) return;

                var $arrayItems = $(".array-wrapper .array-item");
                target = +$("#bs-target").val().trim();

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
            $("#bs-step").on("click", binarySearchStep);

            // Binary Search Play
            $("#bs-play").on("click", () => {
                if (interval) clearInterval(interval);
                interval = setInterval(binarySearchStep, 500);
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
                $(".array-wrapper").html(defaultArray);
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


            /**
             * Bubble Sort Step Helper Function
             * 
             * @returns {void}
             */
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
                $(".array-wrapper").html(defaultArray);
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


            /**
             * Selection Sort Step Helper Function
             * 
             * @returns {void}
             */
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
                $(".array-wrapper").html(defaultArray);
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


            /**
             * Insertion Sort Step Helper Function
             * 
             * @returns {void}
             */
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
                $(".array-wrapper").html(defaultArray);
            });
        }


        // Merge Sort
        else if ($(".merge-sort-wrapper").length) {
            let array = [];
            let steps = [];
            let stepIndex = 0;
            let sorted = false;
            let interval = null;


            /**
             * Merge Sort Steps Planner Helper Function
             * 
             * @param {number} left 
             * @param {number} right 
             * @returns {void}
             */
            function planMergeSort(left, right) {
                if (left >= right) return;

                const mid = Math.floor((left + right) / 2);

                steps.push({ type: "split", left, mid, right });
                planMergeSort(left, mid);
                planMergeSort(mid + 1, right);
                steps.push({ type: "merge", left, mid, right });
            }

            // Merge Sort Build Array
            $("#sort-build-array").on("click", () => {
                array = buildArray("sort") || [];
                steps = [];
                stepIndex = 0;
                sorted = false;

                if (interval) clearInterval(interval);
                if (array.length > 0) planMergeSort(0, array.length - 1);
            });


            /**
             * Merge Sort Step Helper Function
             * 
             * @returns {void}
             */
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
                $(".array-wrapper").html(defaultArray);
            });
        }


        // Quick Sort
        else if ($(".quick-sort-wrapper").length) {
            let array = [];
            let steps = [];
            let stepIndex = 0;
            let sorted = false;
            let passInterval = null;
            let interval = null;


            /**
             * Quick Sort Steps Planner Helper Function
             * 
             * @param {number[]} arr 
             * @param {number} left 
             * @param {number} right 
             * @returns {void}
             */
            function planQuickSort(arr, left, right) {
                if (left > right) return;

                if (left == right) {
                    steps.push({ type: "mark-sorted", left, right });
                    return;
                }

                let pivot = arr[right];
                let i = left;

                steps.push({ type: "partition-start", left, right, pivot });

                for (let j = left; j < right; j++) {
                    steps.push({ type: "compare", i, j, pivot });
                    if (arr[j] < pivot) {
                        [arr[i], arr[j]] = [arr[j], arr[i]];
                        steps.push({ type: "swap", i, j });
                        i++;
                    }
                }

                [arr[i], arr[right]] = [arr[right], arr[i]];
                steps.push({ type: "pivot-swap", i, right, left });

                planQuickSort(arr, left, i - 1);
                planQuickSort(arr, i + 1, right);
            }

            // Quick Sort Build Array
            $("#sort-build-array").on("click", () => {
                array = buildArray("sort") || [];
                steps = [];
                stepIndex = 0;
                sorted = false;

                if (passInterval) clearInterval(passInterval);
                if (interval) clearInterval(interval);
                if (array.length > 0) planQuickSort([...array], 0, array.length - 1);
            });


            /**
             * Quick Sort Step Helper Function
             * 
             * @returns {void}
             */
            function quickSortStep() {
                if (sorted) return;

                if (!array.length) {
                    showPopUp(
                        "error",
                        "No Array",
                        "Build an array first."
                    );

                    if (passInterval) clearInterval(passInterval);
                    if (interval) clearInterval(interval);
                    return;
                }

                const action = steps[stepIndex];
                const $arrayItems = $(".array-item");

                $arrayItems.removeClass("comparing");

                switch (action.type) {
                    case "partition-start":
                        for (let i = action.left; i < action.right; i++) {
                            $arrayItems.eq(i).addClass("partition");
                        }
                        $arrayItems.eq(action.right).addClass("pivot");
                        break;

                    case "compare":
                        $arrayItems.removeClass("comparing");
                        $arrayItems.eq(action.i).removeClass("partition").addClass("comparing");
                        $arrayItems.eq(action.j).removeClass("partition").addClass("comparing");
                        break;

                    case "swap":
                        $arrayItems.eq(action.i).addClass("comparing");
                        $arrayItems.eq(action.j).addClass("comparing");

                        const $element1 = $arrayItems.eq(action.i);
                        const $element2 = $arrayItems.eq(action.j);

                        const $clone1 = $element1.clone(true);
                        const $clone2 = $element2.clone(true);

                        $element1.replaceWith($clone2);
                        $element2.replaceWith($clone1);
                        break;

                    case "pivot-swap":
                        const $pivotElement = $arrayItems.eq(action.i);
                        const $rightElement = $arrayItems.eq(action.right);

                        $pivotElement.addClass("pivot");
                        $rightElement.addClass("comparing");

                        const $pivotClone = $pivotElement.clone(true);
                        const $rightClone = $rightElement.clone(true);

                        $pivotElement.replaceWith($rightClone);
                        $rightElement.replaceWith($pivotClone);
                        $pivotClone.removeClass("pivot");
                        $rightClone.removeClass("comparing pivot").addClass("sorted");

                        for (let k = action.left; k <= action.right; k++) {
                            $(`.array-item:eq(${k})`).removeClass("partition");
                        }
                        break;

                    case "mark-sorted":
                        for (let k = action.left; k <= action.right; k++) {
                            $arrayItems.eq(k).removeClass("pivot comparing").addClass("sorted");
                        }
                        break;
                }

                stepIndex++;

                if (stepIndex >= steps.length) {
                    sorted = true;
                    showPopUp(
                        "success",
                        "Array Sorted",
                        "The array has been successfully sorted using quick sort."
                    );
                }
            }

            // Quick Sort Step
            $("#q-sort-step").on("click", quickSortStep);

            // Quick Sort Pass
            $("#q-sort-pass").on("click", () => {
                passInterval = setInterval(() => {
                    const action = steps[stepIndex];

                    if (!action || sorted) {
                        clearInterval(passInterval);
                        return;
                    }

                    quickSortStep();

                    if (["pivot-swap", "mark-sorted"].includes(action.type)) {
                        clearInterval(passInterval);
                    }
                }, 300);
            });

            // Quick Sort Play
            $("#q-sort-play").on("click", () => {
                if (passInterval) clearInterval(passInterval);
                if (interval) clearInterval(interval);
                interval = setInterval(quickSortStep, 300);
            });

            // Quick Sort Pause
            $("#q-sort-pause").on("click", () => {
                if (passInterval) clearInterval(passInterval);
                if (interval) clearInterval(interval);
            });

            // Quick Sort Reset
            $("#q-sort-reset").on("click", () => {
                if (passInterval) clearInterval(passInterval);
                if (interval) clearInterval(interval);
                array = [];
                steps = [];
                stepIndex = 0;
                sorted = false;
                $("#array-input").val("");
                $(".array-wrapper").html(defaultArray);
            });
        }


        // Infix To Postfix Algorithm
        else if ($(".infix-to-postfix-wrapper").length) {
            let tokens = [];
            let currentIndex = 0;
            let operatorStack = [];
            let interval = null;

            // Infix To Postfix Build Character Array
            $("#load-characters").on("click", () => {
                loadChars("infix", tokens);
                currentIndex = 0;
                operatorStack = [];

                if (interval) clearInterval(interval);
            });


            /**
             * Infix To Postfix Step Helper Function
             * 
             * @returns {void}
             */
            function infixToPosfixStep() {
                var token = tokens[currentIndex];
                var $outputContainer = $(".output-wrapper .characters");
                var $operatorContainer = $(".operator-wrap .operators");
                var $inputContainer = $(".input-wrapper .characters .char");

                $inputContainer.removeClass("active");

                if (tokens.length === 0) {
                    if (interval) clearInterval(interval);
                    showPopUp(
                        "error",
                        "No Infix Expression",
                        "Load a valid infix expression first!"
                    );
                    return
                };

                if (currentIndex >= tokens.length) {
                    while (operatorStack.length) {
                        const operator = operatorStack.pop();
                        $operatorContainer.find(".operator:last").remove();
                        $outputContainer.append(`<div class="char sorted"><p>${operator}</p></div>`);
                    }

                    if (interval) clearInterval(interval);

                    showPopUp(
                        "success",
                        "Done",
                        "Infix to Postfix conversion completed"
                    );

                    return;
                };

                $inputContainer.eq(currentIndex).addClass("active");

                if (/^(sin|cos|tan|log|exp)$/.test(token)) {
                    operatorStack.push(token);
                    $operatorContainer.append(`<div class="operator"><p>${token}</p></div>`);

                } else if (/[A-Za-z0-9]/.test(token)) {
                    $outputContainer.append(`<div class="char sorted"><p>${token}</p></div>`);

                } else if (/[-+*/^]/.test(token)) {
                    const precedence = {
                        "+": 1,
                        "-": 1,
                        "*": 2,
                        "/": 2,
                        "^": 3
                    };
                    const rightAssociative = { "^": true }

                    while (
                        operatorStack.length &&
                        operatorStack[operatorStack.length - 1] !== "(" &&
                        (
                            (
                                rightAssociative[token] &&
                                precedence[operatorStack[operatorStack.length - 1]] > precedence[token]
                            ) ||
                            (
                                !rightAssociative[token] &&
                                precedence[operatorStack[operatorStack.length - 1]] >= precedence[token]
                            )
                        )
                    ) {
                        const operator = operatorStack.pop();
                        $operatorContainer.find(".operator:last").remove();
                        $outputContainer.append(`<div class="char sorted"><p>${operator}</p></div>`);
                    }

                    operatorStack.push(token);
                    $operatorContainer.append(`<div class="operator"><p>${token}</p></div>`);

                } else if (token === "(") {
                    operatorStack.push(token);
                    $operatorContainer.append(`<div class="operator"><p>${token}</p></div>`);

                } else if (token === ")") {
                    while (
                        operatorStack.length &&
                        operatorStack[operatorStack.length - 1] !== "("
                    ) {
                        const operator = operatorStack.pop();
                        $operatorContainer.find(".operator:last").remove();
                        $outputContainer.append(`<div class="char sorted"><p>${operator}</p></div>`)
                    }

                    operatorStack.pop();
                    $operatorContainer.find(".operator:last").remove();

                    if (
                        operatorStack.length &&
                        /^(sin|cos|tan|log|exp)$/.test(operatorStack[operatorStack.length - 1])) {
                        const func = operatorStack.pop();
                        $operatorContainer.find(".operator:last").remove();
                        $outputContainer.append(`<div class="char sorted"><p>${func}</p></div>`);
                    }
                }
                currentIndex++;
            }

            // Infix To PostFix Step
            $("#i-p-step").on("click", infixToPosfixStep);

            // Infix To Postfix Play
            $("#i-p-play").on("click", () => {
                if (interval) clearInterval(interval);
                interval = setInterval(infixToPosfixStep, 300);
            });

            // Infix To Postfix Step
            $("#i-p-pause").on("click", () => {
                if (interval) clearInterval(interval);
            });

            // Infix To Postfix Reset
            $("#i-p-reset").on("click", () => {
                tokens = [];
                currentIndex = 0;
                operatorStack = [];

                if (interval) clearInterval(interval);
                $(".input-wrapper .characters").html("");
                $(".operator-wrap .operators").html("");
                $(".output-wrapper .characters").html("");
            });
        }


        // Postfix Evaluation
        else if ($(".postfix-evaluation-wrapper").length) {
            let tokens = [];
            let currentIndex = 0;
            let evaluationStack = [];
            let interval = null;

            // Postfix Evalutaion Build Character Array
            $("#load-characters").on("click", () => {
                loadChars("postfix", tokens);
                currentIndex = 0;
                evaluationStack = [];

                if (interval) clearInterval(interval);
            });


            /**
             * Postfix Evaluation Step Helper Function
             * 
             * @returns {void}
             */
            function postfixEvaluationStep() {
                const $inputChars = $(".input-wrapper .characters .char");
                const $stackContainer = $(".stack-wrap .characters");
                const $resultContainer = $(".output-wrapper .characters");

                $inputChars.removeClass("active");

                if (tokens.length === 0) {
                    if (interval) clearInterval(interval);
                    showPopUp(
                        "error",
                        "No Postfix Expression",
                        "Load a valid postfix expression first!"
                    );
                    return
                };

                $stackContainer.empty();

                if (currentIndex >= tokens.length) {
                    if (interval) clearInterval(interval);
                    showPopUp(
                        "success",
                        "Done",
                        "Postfix Evaluation Completed."
                    );
                    return;
                }

                const token = tokens[currentIndex];
                $inputChars.eq(currentIndex).addClass("active");

                if (!isNaN(token)) {
                    evaluationStack.push(Number(token));
                    $resultContainer.append(`<div class="char"><p>${token}</p></div>`);

                } else if (unaryOperators.has(token)) {
                    const operand = evaluationStack.pop();
                    let result;

                    if (["sin", "cos", "tan"].includes(token)) {
                        result = Math[token](operand * Math.PI / 180);
                    } else {
                        result = Math[token](operand);
                    }

                    result = Number(result.toFixed(6));
                    evaluationStack.push(result);

                    $resultContainer.find(".char:last").remove();
                    $stackContainer.append(`<div class="char"><p>${token}</p></div>`);
                    $stackContainer.append(`<div class="char"><p>${operand}</p></div>`);
                    $resultContainer.append(`<div class="char"><p>${result}</p></div>`);

                } else if (binaryOperators.has(token)) {
                    const rightOperand = evaluationStack.pop();
                    const leftOperand = evaluationStack.pop();
                    let result;

                    $stackContainer.append(`<div class="char"><p>${leftOperand}</p></div>`);
                    $stackContainer.append(`<div class="char"><p>${token}</p></div>`);
                    $stackContainer.append(`<div class="char"><p>${rightOperand}</p></div>`);

                    switch (token) {
                        case "+":
                            result = leftOperand + rightOperand;
                            break;
                        case "-":
                            result = leftOperand - rightOperand;
                            break;
                        case "*":
                            result = leftOperand * rightOperand;
                            break;
                        case "/":
                            result = leftOperand / rightOperand;
                            break;
                        case "^":
                            result = Math.pow(leftOperand, rightOperand);
                            break;
                    }

                    result = Number(result.toFixed(6));
                    evaluationStack.push(result);
                    $resultContainer.find(".char:last").remove();
                    $resultContainer.find(".char:last").remove();
                    $resultContainer.append(`<div class="char"><p>${result}</p></div>`);

                } else {
                    showPopUp(
                        "error",
                        "Invalid Token",
                        `Token ${token} is not recognized`
                    );
                    return;
                }

                currentIndex++
            }

            // Postfix Evaluation Step
            $("#p-e-step").on("click", postfixEvaluationStep);

            // Postfix Evaluation Play
            $("#p-e-play").on("click", () => {
                if (interval) clearInterval(interval);
                interval = setInterval(postfixEvaluationStep, 300);
            });

            // Postfix Evaluation Pause
            $("#p-e-pause").on("click", () => {
                if (interval) clearInterval(interval);
            });

            // Postfix Evaluation Reset
            $("#p-e-reset").on("click", () => {
                tokens = [];
                currentIndex = 0;
                evaluationStack = [];

                if (interval) clearInterval(interval);
                $(".characters").html("");
            });
        }


        // 1D Arrays
        else if ($(".one-d-arrays-wrapper").length) {
            let array = [];
            let isBusy = false;
            let timers = [];
            const $outputWrap = $(".output-wrap");


            /**
             * 1D Array Soft Reset Utility Function
             * 
             * @returns {void}
             */
            function softReset() {
                isBusy = false;
                timers.forEach(timer => clearTimeout(timer));
                timers = [];
                $outputWrap.html("");
                $(".array-wrapper .array-item").removeClass("active match");
            }

            // Build 1D Array
            $("#build-array").on("click", () => {
                array = buildArray("1D") || [];
                if (!array.length) $(".array-wrapper").html(defaultArray);
                softReset();
            });

            // Reset 1D Array
            $("#reset-array").on("click", () => {
                softReset();
                array = [];
                $(".array-wrapper").html(defaultArray);
                $("#array-input").val("");
                $("#array-element").val("");
                $("#array-index").val("");
            });

            // Traverse 1D Array
            $("#traverse-array").on("click", () => {
                if (isBusy || !oneDArrayValidator(array)) return;
                softReset();
                isBusy = true;

                const $arrayItems = $(".array-wrapper .array-item");
                $arrayItems.each(function (index) {
                    const timer = setTimeout(() => {
                        $arrayItems.removeClass("active");
                        $(this).addClass("active");

                        if (index === $arrayItems.length - 1) {
                            const finalTimer = setTimeout(() => {
                                $arrayItems.removeClass("active");
                                showPopUp(
                                    "success",
                                    "Traversal Complete",
                                    "All array elements visited succesfully"
                                );
                                isBusy = false;
                            }, 500);
                            timers.push(finalTimer);
                        }
                    }, index * 500);
                    timers.push(timer);
                });
            });

            // 1D Array Find Index
            $("#find-element-index").on("click", () => {
                const $arrayItems = $(".array-wrapper .array-item");
                const element = $("#array-element").val();
                let isFound = false;

                if (isBusy || !oneDArrayValidator(array, element)) return;
                softReset();
                isBusy = true;

                $arrayItems.each(function (index, arrayItem) {
                    const $arrayItem = $(arrayItem);
                    const timer = setTimeout(() => {
                        $arrayItems.removeClass("active match");
                        $arrayItem.addClass("active");

                        if ($arrayItem.text() === element) {
                            $arrayItem.removeClass("active");
                            $arrayItem.addClass("match");

                            const foundTimer = setTimeout(() => {
                                showPopUp(
                                    "success",
                                    "Match Found",
                                    `Match found at index ${index}`
                                );
                            }, 500);

                            isFound = true;
                            isBusy = false;
                            timers.forEach(timer => clearTimeout(timer));
                            $outputWrap.append(`<div class="output"><p>${index}</p></div>`);

                        } else if (index == $arrayItems.length - 1 && !isFound) {
                            const notFoundTimer = setTimeout(() => {
                                $arrayItem.removeClass("active");
                                showPopUp(
                                    "warning",
                                    "Not Found",
                                    `${element} is not in the array`
                                );
                                isBusy = false;
                            }, 500)
                            timers.push(notFoundTimer);
                        }
                    }, index * 500);
                    timers.push(timer);
                });
            });

            // 1D Array Find Value
            $("#find-array-element").on("click", () => {
                const $arrayItems = $(".array-wrapper .array-item");
                const index = $("#array-index").val().trim();

                if (isBusy || !oneDArrayValidator(array, undefined, index)) return;
                softReset();

                const $targetItem = $arrayItems.eq(index);
                $targetItem.addClass("match");
                $outputWrap.append(`<div class="output"><p>${array[index]}</p></div>`);
                showPopUp(
                    "success",
                    "Value Found",
                    `Value at index ${index} is ${array[index]}`
                );
            });

            // 1D Array Element Count
            $("#element-count").on("click", () => {
                const $arrayItems = $(".array-wrapper .array-item");
                const element = $("#array-element").val().trim();
                let count = 0;

                if (isBusy || !oneDArrayValidator(array, element)) return;
                softReset();
                isBusy = true;

                $arrayItems.each(function (index, arrayItem) {
                    const $arrayItem = $(arrayItem);
                    const timer = setTimeout(() => {
                        $arrayItems.removeClass("active");
                        $arrayItem.addClass("active");

                        if ($arrayItem.text() === element) {
                            $arrayItem.removeClass("active").addClass("match");
                            count++;
                        }

                        if (index === $arrayItems.length - 1) {
                            const finalTimer = setTimeout(() => {
                                showPopUp(
                                    count > 0 ? "success" : "warning",
                                    `${count} occurences`,
                                    `${element} occurs ${count} times in the array`
                                );
                                $arrayItems.removeClass("active");
                                isBusy = false;
                            }, 500);
                            $outputWrap.append(`<div class="output"><p>${count}</p></div>`);
                            timers.push(finalTimer);
                        }
                    }, index * 500);
                    timers.push(timer);
                });
            });

            // 1D Array Insert Element
            $("#insert-element").on("click", () => {
                const element = $("#array-element").val().trim();
                const index = $("#array-index").val().trim();

                if (isBusy || !oneDArrayValidator(array, element, index)) return;
                softReset();

                const $arrayWrapper = $(".array-wrapper");
                $arrayWrapper.empty();

                array.splice(index, 0, element);
                array.forEach((item, index_) => {
                    const $item = $(`<div class="array-item"><span>${item}</span></div>`);

                    if (index_ == index) $item.addClass("match");
                    $arrayWrapper.append($item);
                });

                const timer = setTimeout(() => {
                    showPopUp(
                        "success",
                        "Element Inserted",
                        `Inserted ${element} at index ${index}`
                    );
                }, 500);
                timers.push(timer);
            });

            // 1D Array Update Element
            $("#update-element").on("click", () => {
                const element = $("#array-element").val().trim();
                const index = $("#array-index").val().trim();

                if (isBusy || !oneDArrayValidator(array, element, index)) return;
                softReset();
                isBusy = true;

                const $arrayItems = $(".array-wrapper .array-item");
                const $target = $arrayItems.eq(index);

                $target.addClass("active");

                const timer = setTimeout(() => {
                    array[index] = element;
                    $target.find("span").text(element);
                    $target.addClass("match");

                    const finalTimer = setTimeout(() => {
                        showPopUp(
                            "success",
                            "Element Updated",
                            `Updated index ${index} with value ${element}`
                        );
                        isBusy = false;
                    }, 500);
                    timers.push(finalTimer);
                }, 800);
                timers.push(timer);
            });

            // 1D Array Pop
            $("#pop-array").on("click", () => {
                const lastIndex = array.length - 1;
                const poppedElement = array[lastIndex];
                const $arrayItems = $(".array-wrapper .array-item");
                const $target = $arrayItems.eq(lastIndex);

                if (isBusy || !oneDArrayValidator(array)) return;
                softReset();
                isBusy = true;

                $target.addClass("remove");
                const timer = setTimeout(() => {
                    array.pop();

                    $target.fadeOut(400, () => {
                        $target.remove();
                        $outputWrap.append(`<div class="output"><p>${poppedElement}</p></div>`);

                        const successTimer = setTimeout(() => {
                            showPopUp(
                                "success",
                                "Element Popped",
                                `Removed element ${poppedElement} from the array`
                            );
                            isBusy = false;
                        }, 500);
                        timers.push(successTimer);
                    });
                }, 800);
                timers.push(timer);
            });

            // 1D Array Min Element
            $("#array-min").on("click", () => {
                if (isBusy || !oneDArrayValidator(array)) return;
                softReset();
                isBusy = true;

                const $arrayItems = $(".array-wrapper .array-item");
                let currentMin = array[0];
                let currentMinIndex = 0;

                $arrayItems.eq(0).addClass("match");

                array.forEach((item, index) => {
                    const $item = $arrayItems.eq(index);

                    const timer = setTimeout(() => {
                        $item.addClass("active");

                        if (item < currentMin) {
                            $arrayItems.eq(currentMinIndex).removeClass("match");
                            currentMin = item;
                            currentMinIndex = index;
                            $arrayItems.eq(index).addClass("match");
                        }

                        const activeTimer = setTimeout(() => {
                            $item.removeClass("active");
                        }, 500);
                        timers.push(activeTimer);

                        if (index === array.length - 1) {
                            const finalTimer = setTimeout(() => {
                                $outputWrap.append(`<div class="output"><p>${currentMin}</p></div>`);
                                showPopUp(
                                    "success",
                                    "Minimun Element Found",
                                    `Minimum value is ${currentMin} at index ${currentMinIndex}`
                                );
                                isBusy = false;
                            }, 600);
                            timers.push(finalTimer);
                        }
                    }, index * 700);
                    timers.push(timer);
                });
            });

            // 1D Array Max Element
            $("#array-max").on("click", () => {
                if (isBusy || !oneDArrayValidator(array)) return;
                softReset();
                isBusy = true;

                const $arrayItems = $(".array-wrapper .array-item");
                let currentMax = array[0];
                let currentMaxIndex = 0;

                $arrayItems.eq(0).addClass("match");

                array.forEach((item, index) => {
                    const $item = $arrayItems.eq(index);

                    const timer = setTimeout(() => {
                        $item.addClass("active");

                        if (item > currentMax) {
                            $arrayItems.eq(currentMaxIndex).removeClass("match");
                            currentMax = item;
                            currentMaxIndex = index;
                            $arrayItems.eq(index).addClass("match");
                        }

                        const activeTimer = setTimeout(() => {
                            $item.removeClass("active");
                        }, 500);
                        timers.push(activeTimer);

                        if (index === array.length - 1) {
                            const finalTimer = setTimeout(() => {
                                $outputWrap.append(`<div class="output"><p>${currentMax}</p></div>`);
                                showPopUp(
                                    "success",
                                    "Minimun Element Found",
                                    `Minimum value is ${currentMax} at index ${currentMaxIndex}`
                                );
                                isBusy = false;
                            }, 600);
                            timers.push(finalTimer);
                        }
                    }, index * 700);
                    timers.push(timer);
                });
            });

            // 1D Array Sum
            $("#array-sum").on("click", () => {
                if (isBusy || !oneDArrayValidator(array)) return;
                softReset();
                isBusy = true;

                const $arrayItems = $(".array-wrapper .array-item");
                let runningSum = 0;

                array.forEach((item, index) => {
                    const $item = $arrayItems.eq(index);

                    const timer = setTimeout(() => {
                        $item.addClass("active");
                        runningSum += Number(item);
                        $outputWrap.empty().append(`<div class="output temp"><p>${runningSum}</p></div>`);

                        const activeTimer = setTimeout(() => {
                            $item.removeClass("active");
                        }, 500);
                        timers.push(activeTimer);

                        if (index === array.length - 1) {
                            const finalTimer = setTimeout(() => {
                                $outputWrap.find(".output").removeClass("temp");
                                showPopUp(
                                    "success",
                                    "Completed!",
                                    `Total sum of array elements is ${runningSum}`
                                );
                                isBusy = false;
                            }, 600);
                            timers.push(finalTimer);
                        }
                    }, index * 700);
                    timers.push(timer);
                });
            });

            // 1D Array Mean
            $("#array-mean").on("click", () => {
                if (isBusy || !oneDArrayValidator(array)) return;
                softReset();
                isBusy = true;

                const $arrayItems = $(".array-wrapper .array-item");
                let runningSum = 0;
                let count = 0;
                let mean = 0;

                array.forEach((item, index) => {
                    const $item = $arrayItems.eq(index);

                    const timer = setTimeout(() => {
                        $item.addClass("active");
                        runningSum += Number(item);
                        count += 1;
                        mean = Math.round((runningSum / count) * 100) / 100;

                        $outputWrap.empty().append(`
                            <div class="output temp"><p>${runningSum}</p></div>
                            <div class="output temp"><p>/</p></div>
                            <div class="output temp"><p>${count}</p></div>
                            <div class="output temp"><p>=</p></div>
                            <div class="output temp"><p>${mean}</p></div>    
                        `);

                        const activeTimer = setTimeout(() => {
                            $item.removeClass("active");
                        }, 500);
                        timers.push(activeTimer);

                        if (index === array.length - 1) {
                            const finalTimer = setTimeout(() => {
                                $outputWrap.empty().append(`<div class="output"><p>${mean}</p></div>`);
                                showPopUp(
                                    "success",
                                    "Completed!",
                                    `Mean of the array is ${mean}`
                                );
                                isBusy = false;
                            }, 600);
                            timers.push(finalTimer);
                        }
                    }, index * 700);
                    timers.push(timer);
                });
            });

            // 1D Array Reverse
            $("#reverse-array").on("click", () => {
                if (isBusy || !oneDArrayValidator(array)) return;
                softReset();
                isBusy = true;

                const $arrayItems = $(".array-wrapper .array-item");
                let left = 0;
                let right = array.length - 1;

                function swapElements() {
                    if (left >= right) {
                        $arrayItems.addClass("active");
                        showPopUp(
                            "success",
                            "Array Reversed!",
                            `Reversed Array: [${array.join(", ")}]`
                        );
                        isBusy = false;
                        return;
                    }

                    const $leftItem = $arrayItems.eq(left);
                    const $rightItem = $arrayItems.eq(right);

                    $arrayItems.removeClass("match");
                    $leftItem.addClass("active");
                    $rightItem.addClass("active");

                    const leftMidX = $leftItem.offset().left + $leftItem.outerWidth() / 2;
                    const leftMidY = $leftItem.offset().top + $leftItem.outerHeight() / 2;
                    const rightMidX = $rightItem.offset().left + $rightItem.outerWidth() / 2;
                    const rightMidY = $rightItem.offset().top + $rightItem.outerHeight() / 2;
                    const distanceX = rightMidX - leftMidX;
                    const distanceY = rightMidY - leftMidY;

                    $leftItem.css({
                        transform: `translate(${distanceX}px, ${distanceY}px)`,
                        transition: `all .4s ease-in-out`
                    });
                    $rightItem.css({
                        transform: `translate(${-distanceX}px, ${-distanceY}px)`,
                        transition: `all .4s ease-in-out`
                    });

                    const timer = setTimeout(() => {
                        $leftItem.css({
                            transform: "none",
                            transition: "none"
                        });
                        $rightItem.css({
                            transform: "none",
                            transition: "none"
                        });

                        const temp = array[left];
                        array[left] = array[right];
                        array[right] = temp;

                        const tempText = $leftItem.find("span").text();
                        $leftItem.find("span").text($rightItem.find("span").text());
                        $rightItem.find("span").text(tempText);

                        left++;
                        right--;

                        const innerTimer = setTimeout(swapElements, 100);
                        timers.push(innerTimer);
                    }, 400);
                    timers.push(timer);
                }

                swapElements();
            });

            // 1D Array Shuffle
            $("#shuffle-array").on("click", () => {
                if (isBusy || !oneDArrayValidator(array)) return;
                softReset();
                isBusy = true;

                const $arrayItems = $(".array-wrapper .array-item");
                let currentIndex = array.length;

                function shuffleStep() {
                    if (currentIndex <= 1) {
                        $arrayItems.addClass("active");
                        showPopUp(
                            "success",
                            "Array Shuffled!",
                            `Shuffled Array: [${array.join(", ")}]`
                        );
                        isBusy = false;
                        return;
                    }

                    const randomIndex = Math.floor(Math.random() * currentIndex);
                    currentIndex--;

                    const $currentItem = $arrayItems.eq(currentIndex);
                    const $randomItem = $arrayItems.eq(randomIndex);

                    $currentItem.addClass("active");
                    $randomItem.addClass("active");

                    const currentOffset = $currentItem.position();
                    const randomOffset = $randomItem.position();
                    const distanceX = randomOffset.left - currentOffset.left;
                    const distanceY = randomOffset.top - currentOffset.top;

                    $currentItem.css({
                        transform: `translate(${distanceX}px, ${distanceY}px)`,
                        transition: "all .4s ease-in-out"
                    });
                    $randomItem.css({
                        transform: `translate(${-distanceX}px, ${-distanceY}px)`,
                        transition: "all .4s ease-in-out"
                    });

                    const timer = setTimeout(() => {
                        $currentItem.css({
                            transform: "none",
                            transition: "none"
                        });
                        $randomItem.css({
                            transform: "none",
                            transition: "none"
                        });

                        const temp = array[currentIndex];
                        array[currentIndex] = array[randomIndex];
                        array[randomIndex] = temp;

                        const tempText = $currentItem.find("span").text();
                        $currentItem.find("span").text($randomItem.find("span").text());
                        $randomItem.find("span").text(tempText);

                        const innerTimer = setTimeout(shuffleStep(), 100);
                        timers.push(innerTimer);
                    }, 400);
                    timers.push(timer);
                }

                shuffleStep();
            });

            // 1D Array Merge
            $("#merge-array").on("click", () => {
                const newArray = $("#array-element").val().trim().split(/\s+/);
                const $arrayWrapper = $(".array-wrapper");

                if (isBusy || !oneDArrayValidator(
                    array,
                    newArray.join(" "),
                    undefined,
                    "merge"
                )) return;

                softReset();
                isBusy = true;
                array = array.concat(newArray);

                newArray.forEach(element => {
                    const $newItem = $(
                        `<div class="array-item match hidden"><span>${element}</span></div>`
                    );

                    $arrayWrapper.append($newItem);

                    const hiddenTimer = setTimeout(() => {
                        $newItem.removeClass("hidden")
                    }, 100);
                    timers.push(hiddenTimer);
                });

                const matchTimer = setTimeout(() => {
                    $(".array-item.match").removeClass("active").addClass("match");
                }, 100);
                timers.push(matchTimer);

                const activeTimer = setTimeout(() => {
                    $(".array-item").css({
                        transition: "all .4s ease-in-out"
                    });
                    $(".array-item").removeClass("match").addClass("active");

                    const successTimer = setTimeout(() => {
                        showPopUp(
                            "success",
                            "Arrays Merged!",
                            `New Array: [${array.join(", ")}]`
                        );
                        isBusy = false;
                    }, 1000);
                }, 1000);
            });

            // 1D Array Slice 
            $("#slice-array").on("click", () => {
                const index = $("#array-index").val().trim();

                if (isBusy || !oneDArrayValidator(
                    array,
                    undefined,
                    index,
                    "slice"
                )) return;

                softReset();
                isBusy = true;

                const $arrayItems = $(".array-wrapper .array-item");
                const indices = index.trim().split(/\s+/);
                const start = Number(indices[0]);
                const end = indices.length > 1 ? Number(indices[1]) : array.length;

                if (start >= end) {
                    $arrayItems.each(function () {
                        $(this).addClass("remove").fadeOut(1000, function () {
                            $(this).remove();
                        });
                    });
                } else {
                    for (let i = 0; i < array.length; i++) {
                        const $item = $arrayItems.eq(i);

                        if (i >= start && i < end) {
                            $item.addClass("active");
                        } else {
                            $item.addClass("remove");
                            $item.fadeOut(1000, function () {
                                $(this).remove();
                            });
                        }
                    }
                }

                array = array.slice(start, end);

                const timer = setTimeout(() => {
                    showPopUp(
                        "success",
                        "Array Sliced!",
                        `New Array: [${array.join(", ")}]`
                    );
                    isBusy = false;
                }, 2000);
                timers.push(timer);
            });
        }


        // 2D Arrays
        else if ($(".two-d-arrays-wrapper").length) {
            let matrix = [];
            let isBusy = false;
            let timers = [];
            const $outputWrap = $(".output-wrap");


            /**
             * 2D Array Soft Reset Utility Function
             * 
             * @returns {void}
             */
            function softReset() {
                isBusy = false;
                timers.forEach(timer => clearTimeout(timer));
                timers = [];
                $outputWrap.html("");
                $(".array-wrapper .array-item").removeClass("active match");
            }

            // Build 2D Array
            $("#build-array").on("click", () => {
                matrix = buildMatrix() || [];
                if (!matrix.length) $(".array-wrapper").html(defaultArray);
                softReset();
            });

            // Reset 2D Array
            $("#reset-array").on("click", () => {
                softReset();
                matrix = [];
                $(".array-wrapper").html(defaultArray);
                $("#rows").val("");
                $("#columns").val("");
                $("#limit").val("");
                $("#array-element").val("");
                $("#row-index").val("");
                $("#column-index").val("");
            });

            // Traverse 2D Array
            $("#traverse-array").on("click", () => {
                if (isBusy || !twoDArrayValidator(matrix)) return;
                softReset();
                isBusy = true;

                const $arrayItems = $(".array-wrapper .array-item");
                $arrayItems.each(function (index) {
                    const timer = setTimeout(() => {
                        $arrayItems.removeClass("active");
                        $(this).addClass("active");

                        if (index === $arrayItems.length - 1) {
                            const finalTimer = setTimeout(() => {
                                $arrayItems.removeClass("active");
                                showPopUp(
                                    "success",
                                    "Traversal Complete",
                                    "All array elements visited succesfully"
                                );
                                isBusy = false;
                            }, 500);
                            timers.push(finalTimer);
                        }
                    }, index * 500);
                    timers.push(timer);
                });
            });

            // 2D Array Find Element
            $("#find-value").on("click", () => {
                const $arrayRows = $(".array-wrapper .row-wrap");
                const rowIndex = $("#row-index").val();
                const columnIndex = $("#column-index").val();

                if (isBusy || !twoDArrayValidator(
                    matrix,
                    undefined,
                    rowIndex,
                    columnIndex
                )) return;
                softReset();

                const $targetRow = $arrayRows.eq(rowIndex);
                const $targetItem = $targetRow.find(".array-item").eq(columnIndex);

                $targetItem.addClass("match");
                $outputWrap.append(
                    `<div class="output"><p>${matrix[rowIndex][columnIndex]}</p></div>`
                );
                showPopUp(
                    "success",
                    "Value Found",
                    `Value at row ${rowIndex} column ${columnIndex} is 
                    ${matrix[rowIndex][columnIndex]}`
                );
            });

            // 2D Array Update Element
            $("#update-element").on("click", () => {
                const element = $("#array-element").val().trim();
                const rowIndex = $("#row-index").val().trim();
                const columnIndex = $("#column-index").val().trim();

                if (isBusy || !twoDArrayValidator(
                    matrix,
                    element,
                    rowIndex,
                    columnIndex
                )) return;
                softReset();
                isBusy = true;

                const $arrayRows = $(".array-wrapper .row-wrap");
                const $targetRow = $arrayRows.eq(rowIndex);
                const $targetItem = $targetRow.find(".array-item").eq(columnIndex);

                $targetItem.addClass("active");

                const timer = setTimeout(() => {
                    matrix[rowIndex][columnIndex] = element;
                    $targetItem.find("span").text(element);
                    $targetItem.addClass("match");

                    const finalTimer = setTimeout(() => {
                        showPopUp(
                            "success",
                            "Element Updated",
                            `Updated index ${rowIndex}, ${columnIndex} with value ${element}`
                        );
                        isBusy = false;
                    }, 500);
                    timers.push(finalTimer);
                }, 800);
                timers.push(timer);
            });
        }


        // Linked Lists
        else if ($(".linked-lists-wrapper").length) {
            const $listTypes = $(".list-types .btn");
            const defaultList = $(".array-wrapper").html();
            let list = [];
            let isBusy = false;
            let timers = [];
            let listType = null;


            /**
             * Linked List Soft Reset
             * 
             * @returns {void}
             */
            function softReset() {
                isBusy = false;
                timers.forEach(timer => clearTimeout(timer));
                timers = [];
                $(".array-wrapper .array-item").removeClass("active match");
            }


            /**
             * Render An Arrow From Last Element To First
             * 
             * @returns {void}
             */
            function drawLoopArrow() {
                const $nodes = $(".list-node");
                const $svg = $(".links");
                $svg.empty();

                if ($.inArray(listType, ["CSLL", "CDLL"]) === -1) return;

                const $wrapper = $(".list-wrapper");
                const wrapperOffset = $wrapper.offset();
                const $firstElement = $nodes.first();
                const $lastElement = $nodes.last();
                const lastX = $lastElement.offset().left + $lastElement.outerWidth() / 2 - wrapperOffset.left;
                const lastY = $lastElement.offset().top - wrapperOffset.top - 10;
                const firstX = $firstElement.offset().left + $firstElement.outerWidth() / 2 - wrapperOffset.left;
                const firstY = $firstElement.offset().top - wrapperOffset.top - 10;
                const verticalUp = 40;
                const topY = Math.min(lastY, firstY) - verticalUp;
                const pathD = `
                    M ${lastX}, ${lastY}
                    L ${lastX}, ${topY}
                    L ${firstX}, ${topY}
                    L ${firstX}, ${firstY}
                `;

                const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                path.setAttribute("d", pathD.trim());
                path.setAttribute("stroke", "white");
                path.setAttribute("stroke-width", "3");
                path.setAttribute("fill", "transparent");
                path.setAttribute("stroke-linecap", "round");
                path.setAttribute("stroke-linejoin", "round");

                const startMarker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
                startMarker.setAttribute("id", "start-arrowhead");
                startMarker.setAttribute("markerWidth", "5");
                startMarker.setAttribute("markerHeight", "5");
                startMarker.setAttribute("refX", ".9");
                startMarker.setAttribute("refY", "2.5");
                startMarker.setAttribute("orient", "auto");
                startMarker.setAttribute("markerUnits", "strokeWidth");

                const startArrow = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
                startArrow.setAttribute("points", "4,0 0,2.5 4,5");
                startArrow.setAttribute("fill", "white");

                startMarker.appendChild(startArrow);
                $svg[0].appendChild(startMarker);

                const endMarker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
                endMarker.setAttribute("id", "end-arrowhead");
                endMarker.setAttribute("markerWidth", "5");
                endMarker.setAttribute("markerHeight", "5");
                endMarker.setAttribute("refX", "3.1");
                endMarker.setAttribute("refY", "2.5");
                endMarker.setAttribute("orient", "auto");
                endMarker.setAttribute("markerUnits", "strokeWidth");

                const endArrow = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
                endArrow.setAttribute("points", "0, 0 4, 2.5 0, 5");
                endArrow.setAttribute("fill", "white");

                endMarker.appendChild(endArrow);
                $svg[0].appendChild(endMarker);

                if (listType === "CSLL") {
                    path.setAttribute("marker-end", "url(#end-arrowhead)");
                } else if (listType === "CDLL") {
                    path.setAttribute("marker-end", "url(#end-arrowhead)");
                    path.setAttribute("marker-start", "url(#start-arrowhead)");
                }

                $svg[0].appendChild(path);
            }


            /**
             * Update Arrows For Different List Types
             * 
             * @param {"SLL"|"DLL"|"CSLL"|"CDLL"} listType 
             * @returns {void}
             */
            function updateArrows(listType) {
                const $arrows = $(".list-wrapper i");
                if (!$arrows.length) {
                    $(".links").empty();
                    return;
                };

                $arrows.each(function () {
                    if (["SLL", "CSLL"].includes(listType)) {
                        $(this).attr("class", "fa fa-long-arrow-right");
                    } else if (["DLL", "CDLL"].includes(listType)) {
                        $(this).attr("class", "fa fa-arrows-h");
                    }
                });

                drawLoopArrow();
            }


            /**
             * Linked List Validator
             * 
             * @param {string|undefined} element 
             * @param {string|undefined} index 
             * @param {"insert"|"delete"} func_type 
             * @returns {boolean|undefined}
             */
            function linkedListValidator(element, index, func_type) {
                if (func_type === "delete" && list.length <= 0) {
                    showPopUp(
                        "error",
                        "Empty",
                        "Array is already empty"
                    );
                    return;
                }

                if (!list.length) {
                    showPopUp(
                        "error",
                        "No List",
                        "Create a list first"
                    );
                    return;
                }

                if (element !== undefined && !element) {
                    showPopUp(
                        "error",
                        "No Element",
                        `Enter an element to ${func_type}`
                    );
                    return;
                }

                if (index !== undefined) {
                    if (index === "") {
                        showPopUp(
                            "error",
                            "No Index",
                            `Enter an index to ${func_type}`
                        );
                        return;
                    }
                    if (index > list.length) {
                        showPopUp(
                            "error",
                            "Invalid Index",
                            "Index out of range"
                        );
                        return;
                    }
                }

                if (func_type === "insert" && list.length >= 10) {
                    showPopUp(
                        "error",
                        "Too Many Items",
                        "Please limit the array to a maximum of 10 elements for visualisation purposes"
                    );
                    return;
                }

                return true;
            }


            /**
             * Linked List Insert Element Helper Function
             * 
             * @param {string} index 
             * @returns {void}
             */
            function insertElement(index) {
                const element = $("#array-element").val().trim();
                if (isBusy || !linkedListValidator(
                    element,
                    index,
                    "insert"
                )) return;

                const $wrapper = $(".array-wrapper");
                const $newNode = $(`<div class="array-item list-node"><span>${element}</span></div>`);
                const $newArrow = $(`<i class="fa"></i>`);

                if (index == 0) {
                    $wrapper.prepend($newArrow).prepend($newNode);
                    list.unshift(element);
                } else if (index >= list.length) {
                    $wrapper.append($newArrow).append($newNode);
                    list.push(element);
                } else {
                    const $targetNode = $wrapper.find(".list-node").eq(index);
                    $newNode.insertBefore($targetNode);
                    $newArrow.insertBefore($targetNode);
                    list.splice(index, 0, element);
                }

                $wrapper.find(".list-node").removeClass("active");
                $newNode.addClass("active");

                updateArrows(listType);
                $("#array-element").val("");
                $("#array-index").val("");
            }


            /**
             * Linked List Delete Element Helper Function
             * 
             * @param {string} index 
             * @returns {void}
             */
            function deleteElement(index) {
                if (isBusy || !linkedListValidator(
                    undefined,
                    index,
                    "delete"
                )) return;

                const $wrapper = $(".array-wrapper");
                const $targetNode = $wrapper.find(".list-node").eq(index);
                const $targetArrow = index == 0 ?
                    $targetNode.next("i") :
                    $targetNode.prev("i");

                list.splice(index, 1);

                $wrapper.find(".list-node").removeClass("active");
                $targetNode.remove();
                $targetArrow.remove();

                updateArrows(listType);
                $("#array-element").val("");
                $("#array-index").val("");
            }

            // Linked Lists - Choose List Type
            $listTypes.on("click", function () {
                listType = $(this).data("list-type");
                updateArrows(listType);
                $listTypes.removeClass("active");
                $(this).addClass("active");
            });

            // Build Linked List
            $("#build-list").on("click", () => {
                softReset();
                var $arrayWrapper = $(".array-wrapper");
                var $input = $("#array-input");
                var arrayInput = $input.val().trim();

                list = arrayInput
                    .split(/[ \s]+/)
                    .filter(v => v.length)
                    .map(Number);

                if (!list.length) {
                    $(".array-wrapper").html(defaultList);
                    return;
                };

                if (!listType) {
                    showPopUp(
                        "error",
                        "List Type Not Specified",
                        "Select a list type."
                    );
                    return;
                }

                if (list.length > 10) {
                    showPopUp(
                        "error",
                        "Too Many Items!",
                        "Please limit the array to a maximum of 10 elements for visualization purposes"
                    );
                    return;
                }

                let html = "";
                list.forEach((number, index) => {
                    html += `
                        <div class="array-item list-node"><span>${number}</span></div>
                    `;
                    if (index < list.length - 1) {
                        html += `<i class="fa"></i>`;
                    }
                });
                html += `<svg class="links"></svg>`;

                $input.val("");
                $arrayWrapper.html(html);
                updateArrows(listType);
            });

            // Linked List Traversal
            $("#traverse-list").on("click", () => {
                if (isBusy || !linkedListValidator()) return;
                softReset();
                isBusy = true;

                const $nodes = $('.list-node');
                let traversalNodes = $nodes.toArray();

                if (listType === "DLL") {
                    const reversedNodes = [...traversalNodes].reverse();
                    traversalNodes = [...traversalNodes, ...reversedNodes];
                }

                if (["CSLL", "CDLL"].includes(listType)) {
                    traversalNodes.push(traversalNodes[0]);
                }

                traversalNodes.forEach((node, index) => {
                    const timer = setTimeout(() => {
                        $nodes.removeClass("active");
                        $(node).addClass("active");

                        if (index === traversalNodes.length - 1) {
                            const finalTimer = setTimeout(() => {
                                $nodes.removeClass("active");
                                showPopUp(
                                    "success",
                                    "Traversal Complete",
                                    "All list elements visited successfully"
                                );
                                isBusy = false;
                            }, 500);
                            timers.push(finalTimer);
                        }
                    }, index * 500);
                    timers.push(timer);
                });
            });

            // Push An Element At The Begining
            $("#push-front").on("click", insertElement.bind(null, 0));

            // Push An Element At The End
            $("#push-back").on("click", () => insertElement(list.length));

            // Insert Element At An Index
            $("#insert").on("click", () => {
                const index = $("#array-index").val().trim();
                insertElement(index);
            });

            // Pop An Element From The Begining
            $("#pop-front").on("click", deleteElement.bind(null, 0));

            // Pop An Element From The End
            $("#pop-back").on("click", () => deleteElement(list.length - 1));

            // Pop An Element From The Begining
            $("#erase").on("click", () => {
                const index = $("#array-index").val().trim();
                deleteElement(index);
            });
        }


        // Stacks
        else if ($(".stacks-wrapper").length) {
            let stack = [];
            let isBusy = false;
            let timers = [];

            // Build Stack
            $("#build-stack").on("click", () => {
                stack = buildArray("stack", false, 7) || [];
                if (!stack.length) $(".array-wrapper").html(defaultArray);
                isBusy = false;
                timers.forEach(timer => clearTimeout(timer));
            });

            // Stack Reset
            $("#reset-stack").on("click", () => {
                $(".array-wrapper").html(defaultArray);
                $("#array-input").val("");
                $("#array-element").val("");
                isBusy = false;
                timers.forEach(timer => clearTimeout(timer));
            });

            // Stack Push
            $("#push").on("click", () => {
                const element = $("#array-element").val();

                if (!stack.length) {
                    showPopUp(
                        "error",
                        "No Stack",
                        "Build a stack first"
                    );
                    return;
                }

                if (!element) {
                    showPopUp(
                        "error",
                        "No Element",
                        "Specify an element to push"
                    );
                    return;
                }

                if (stack.length >= 7) {
                    showPopUp(
                        "error",
                        "Too Many Items",
                        "Please limit the stack to a maximum of 7 for visualization."
                    );
                    return;
                }

                stack.push(element);
                $(".array-item").removeClass("active");

                const $arrayItem = $(
                    `<div class="array-item"><span>${element}</span></div>`
                );

                $arrayItem.addClass("hidden active");
                $(".array-wrapper").append($arrayItem);
                $arrayItem[0].offsetHeight;
                $arrayItem.removeClass("hidden");
                $("#array-element").val("");
            });

            // Stack Pop
            $("#pop").on("click", () => {
                if (isBusy) return;
                isBusy = true;

                if (!stack.length) {
                    showPopUp(
                        "error",
                        "Empty Stack",
                        "Build an stack first"
                    );
                    isBusy = false;
                    return;
                }

                stack.pop();

                const $arrayItem = $(".array-wrapper").find(".array-item:last");
                $arrayItem.addClass("remove");

                const timer = setTimeout(() => {
                    $arrayItem.remove();
                    isBusy = false;
                }, 600);

                timers.push(timer);
            });
        }


        // Queues
        else if ($(".queues-wrapper").length) {
            let queue = [];
            let isBusy = false;
            let timers = [];

            // Build Queue
            $("#build-queue").on("click", () => {
                queue = buildArray("queue", false, 10) || [];
                if (!queue.length) $(".array-wrapper").html(defaultArray);
                isBusy = false;
                timers.forEach(timer => clearTimeout(timer));
            });

            // Queue Reset
            $("#reset-queue").on("click", () => {
                $(".array-wrapper").html(defaultArray);
                $("#array-input").val("");
                $("#array-element").val("");
                isBusy = false;
                timers.forEach(timer => clearTimeout(timer));
            });

            // Queue Insert Element
            $("#insert").on("click", () => {
                const element = $("#array-element").val();

                if (!queue.length) {
                    showPopUp(
                        "error",
                        "No Queue",
                        "Build a queue first"
                    );
                    return;
                }

                if (!element) {
                    showPopUp(
                        "error",
                        "No Element",
                        "Specify an element to insert"
                    );
                    return;
                }

                if (queue.length >= 10) {
                    showPopUp(
                        "error",
                        "Too Many Items",
                        "Please limit the queue items to a maximum of 10 for visualization"
                    );
                    return;
                }

                queue.push(element);
                $(".array-item").removeClass("active");

                const $arrayItem = $(
                    `<div class="array-item"><span>${element}</span></div>`
                );

                $arrayItem.addClass("hidden active");
                $(".array-wrapper").append($arrayItem);
                $arrayItem[0].offsetWidth;
                $arrayItem.removeClass("hidden");
                $("#array-element").val("");
            });

            // Queue Delete Element
            $("#delete").on("click", () => {
                if (isBusy) return;
                isBusy = true;

                if (!queue.length) {
                    showPopUp(
                        "error",
                        "Empty Queue",
                        "Build a queue first"
                    );
                    return;
                }

                queue.shift();
                $(".array-item").removeClass("active");

                const $arrayItem = $(".array-wrapper").find(".array-item:first");
                $arrayItem.addClass("remove");

                const timer = setTimeout(() => {
                    $arrayItem.remove();
                    isBusy = false;
                }, 600);

                timers.push(timer);
            });
        }


        // Trees
        else if ($(".trees-wrapper").length) {
            let isBusy = false;
            let timers = [];

            const tree = {
                node: 0,
                left: {
                    node: 1,
                    left: { node: 3, left: { node: 7 }, right: { node: 8 } },
                    right: { node: 4, left: { node: 9 }, right: { node: 10 } }
                },
                right: {
                    node: 2,
                    left: { node: 5, left: { node: 11 }, right: { node: 12 } },
                    right: { node: 6, left: { node: 13 }, right: { node: 14 } }
                }
            };


            /**
             * Inorder Traversal Helper Function
             * 
             * @param {{node: number, left?: number, right?:number} | null} node 
             * @param {number[]} [order=[]] 
             * @returns {number[]}
             */
            function inorder(node, order = []) {
                if (!node) return order;
                if (node.left) inorder(node.left, order);
                order.push(node.node);
                if (node.right) inorder(node.right, order);
                return order;
            }


            /**
             * Preorder Traversal Helper Function
             * 
             * @param {{node: number, left?: number, right?:number} | null} node 
             * @param {number[]} [order=[]] 
             * @returns {number[]}
             */
            function preorder(node, order = []) {
                if (!node) return order;
                order.push(node.node);
                if (node.left) preorder(node.left, order);
                if (node.right) preorder(node.right, order);
                return order;
            }


            /**
             * Postorder Traversal Helper Function
             * 
             * @param {{node: number, left?: number, right?:number} | null} node 
             * @param {number[]} [order=[]] 
             * @returns {number[]}
             */
            function postorder(node, order = []) {
                if (!node) return order;
                if (node.left) postorder(node.left, order);
                if (node.right) postorder(node.right, order);
                order.push(node.node);
                return order;
            }


            /**
             * Traverse Nodes Helper Function
             * 
             * @param {number[]} order 
             * @returns {void}
             */
            function traverseNodes(order) {
                if (isBusy) return;
                isBusy = true;

                timers.forEach(timer => clearTimeout(timer));
                timers = [];

                let delay = 0;
                $(".tree-node").removeClass("active");

                order.forEach(index => {
                    const timer = setTimeout(() => {
                        $(".tree-node").removeClass("active");
                        $(".tree-node").eq(index).addClass("active");
                    }, delay);

                    delay += 600;
                    timers.push(timer);
                });

                const finalTimer = setTimeout(() => {
                    $(".tree-node").removeClass("active");
                    showPopUp(
                        "success",
                        "Traversal Complete",
                        "All tree nodes visited successfully"
                    );
                    isBusy = false;
                }, delay);

                timers.push(finalTimer);
            }

            // Trees Inorder
            $("#inorder").on("click", () => traverseNodes(inorder(tree)));

            // Trees Preorder
            $("#preorder").on("click", () => traverseNodes(preorder(tree)));

            // Trees Postorder
            $("#postorder").on("click", () => traverseNodes(postorder(tree)));
        }
    });


    // Exam
    if ($("#exam-wrapper").length) {
        const $questionElement = $("#question");
        const $optionElements = $(".option");
        const $questionNumbers = $(".question-no");
        const $countdown = $(".countdown");

        const marks = [];
        const selectedOptions = {};
        let submit = true;
        let interval = null;

        /**
         * Render A Single Question
         * 
         * @param {{question: string, answer: string, options: string[]}} questionObject 
         * @param {number} index 
         * @returns {void}
         */
        function loadQuestion(questionObject, index) {
            const question = questionObject.question;
            const answer = questionObject.answer;
            const options = questionObject.options;

            $questionElement.text(`${index + 1}. ${question}`);

            $optionElements.each((idx, option) => {
                var $option = $(option);
                $option.text(options[idx]);

                if (selectedOptions.hasOwnProperty(index)) {
                    $optionElements.eq(selectedOptions[index]).addClass("chosen");
                }

                $option.off("click").on("click", () => {
                    selectedOptions[index] = idx;
                    $optionElements.each(
                        (idx, option) => $(option).removeClass("chosen")
                    );

                    $option.addClass("chosen");
                    $questionNumbers.eq(index).addClass("answered");

                    if ($option.text() == answer) marks[index] = 1;
                    else marks[index] = 0;
                });
            });
        }

        /**
         * Submit Exam Helper Function
         * 
         * @returns {void}
         */
        function submitExam() {
            const score = marks.reduce((a, b) => a + b, 0);

            if (submit) {
                $.ajax({
                    url: "../../Templates/Ajax/SubmitExam.php",
                    method: "POST",
                    data: { score: score },
                    dataType: "json",
                    success: (response) => {
                        if (response.status === "success") {
                            showPopUp(
                                "success",
                                response.message,
                                `Your score is ${score}`,
                            );

                            $(".question-wrap").html("");
                            $questionNumbers.each((idx, question) => {
                                $(question).off("click");
                                $(question).removeClass("active answered");
                            });
                            submit = false;
                            $countdown.removeClass("low").html("00:00");
                            if (interval) clearInterval(interval);
                        }
                    },
                    error: () => {
                        showPopUp(
                            "error",
                            "OOPS!",
                            "Server Error. Try Again"
                        );
                    }
                });
            } else {
                showPopUp(
                    "error",
                    "No Questions Loaded",
                    "Reload page to load new exam"
                );
            }
        }

        
        // Get The Exam Questions 
        $.getJSON("../../Templates/Ajax/GetQuestions.php")
            .done((questions) => {
                if (questions.length < 20) {
                    $(".card-body").html("");
                    showPopUp(
                        "error",
                        "Not Enough Questions!",
                        "At least 20 questions should be added for a test"
                    );
                    return;
                }

                questions.forEach(question => {
                    question.options = Object.values(question)
                        .slice(2, 6)
                        .sort(() => Math.random() - 0.5);
                });
                loadQuestion(questions[0], 0);
                $(".question-no:first").addClass("active");

                $questionNumbers.on("click", (event) => {
                    var index = $questionNumbers.index(event.currentTarget);

                    $questionNumbers.removeClass("active");
                    $optionElements.removeClass("chosen");
                    $(event.currentTarget).addClass("active");

                    loadQuestion(questions[index], index);
                });

                let timeLeft = 120;

                interval = setInterval(() => {
                    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, "0");
                    const seconds = (timeLeft % 60).toString().padStart(2, "0");

                    $countdown.text(`${minutes}:${seconds}`);

                    if (timeLeft <= 10) {
                        $countdown.addClass("low");

                        if (timeLeft <= 0) {
                            clearInterval(interval);

                            showPopUp(
                                "error",
                                "Time's Up!",
                                "Time is over. Submit Exam.",
                                null,
                                false
                            )
                                .then((result) => {
                                    if (
                                        result.isDismissed &&
                                        result.dismiss === Swal.DismissReason.cancel
                                    ) submitExam();
                                });
                        }
                    }

                    timeLeft--;
                }, 1000);
            })
            .fail(() => console.error("Failed to load questions"));

        // Submit Exam
        $("#submit-exam").on("click", submitExam);
    }


    // Chat
    if ($(".chat-container").length) {
        const $contacts = $(".contact");
        const $sendMessage = $("#send-message");
        const $chat = $("#chat");
        var receiver = null;

        // Select Receiver 
        $contacts.each((index, contact) => {
            var $contact = $(contact);

            $contact.on("click", () => {
                $contacts.each((idx, item) => {
                    $(item).removeClass("active");
                });

                $contact.addClass("active");
                receiver = $contact.data("receiver");

                // Get Messsages
                $.ajax({
                    url: "../../Templates/Ajax/GetMessages.php",
                    method: "POST",
                    data: { contact: receiver },
                    dataType: "json",
                    success: (response) => {
                        if (response.status === "success") {
                            $chat.html("");
                            let messages = response.messages;

                            messages.forEach(message => {
                                var $message = $("<p></p>");
                                var messageClass = receiver == message.receiver
                                    ? "send"
                                    : "received";

                                $message.text(message.message);
                                $message.addClass(messageClass);

                                $chat.append($message);
                                $(".chat-wrap").scrollTop($chat.prop("scrollHeight"));
                            });
                        }
                    },
                    error: () => {
                        showPopUp(
                            "error",
                            "Something Went Wrong",
                            "Couldn't load messages"
                        );
                    }
                });
            });
        });

        // Send Message
        $sendMessage.on("click", () => {
            var message = $("#message").val();

            if (!receiver) {
                showPopUp(
                    "error",
                    "No Recipient",
                    "Select a recipient to send message"
                );
                return;
            }

            if (!message) return;

            $.ajax({
                url: "../../Templates/Ajax/SendMessage.php",
                method: "POST",
                data: {
                    receiver: receiver,
                    message: message
                },
                dataType: "json",
                success: (response) => {
                    if (response.status === "success") {
                        let $message = $("<p></p>").addClass("send").text(message);
                        $chat.append($message);
                        $(".chat-wrap").scrollTop($chat.prop("scrollHeight"));
                        $("#message").val("");
                    }
                },
                error: () => {
                    showPopUp(
                        "error",
                        "OOPS!",
                        "Server Error. Try Again"
                    );
                }
            });
        });
    }
});