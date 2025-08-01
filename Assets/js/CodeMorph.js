$(document).ready(() => {
    // Show Password
    $("#show-password").on("change", (event) => {
        $("#password-input").attr(
            "type",
            event.target.checked ? "text" : "password"
        );
    });

    //Flash Error
    const $flashMessage = $("#flash-message");

    if ($flashMessage.length) {
        const message = $flashMessage.data("message");

        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: message
        });
    }

    // Confirmbox
    const confirmDelete = (itemName) => {
        return Swal.fire({
            title: `Delete ${itemName.replace(/_/g, " ")}`,
            text: "This action can't be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085D6",
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
});