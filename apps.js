var picker;

$(function () {
    var isSingleDatePicker = false;
    var start = moment().subtract(29, "days");
    var end = moment();
    var deniedDates = [];

    function cb(start, end) {
        $("input[name='datefilter']").val(
            start.format("DD/MM/YYYY") + " - " + end.format("DD/MM/YYYY")
        );
    }

    var options = {
        startDate: start,
        endDate: end,
        autoUpdateInput: false,
        isInvalidDate: function (date) {
            // Check if any date within the range is denied
            for (
                var m = moment(start);
                m.isSameOrBefore(end);
                m.add(1, "days")
            ) {
                if (
                    deniedDates.some((deniedDate) =>
                        m.isSame(deniedDate, "day")
                    )
                ) {
                    return true;
                }
            }
            return false;
        },
        locale: {
            cancelLabel: "Clear",
            format: "DD/MM/YYYY",
        },
        showDropdowns: true,
        minYear: 1900, // Set the minimum selectable year
    };

    picker = $("input[name='datefilter']").daterangepicker(options, cb);

    $("#switchPicker").on("click", function () {
        isSingleDatePicker = !isSingleDatePicker;
        options.singleDatePicker = isSingleDatePicker;
        picker = $("input[name='datefilter']").daterangepicker(
            options,
            cb
        );
        cb.call(
            $("input[name='datefilter']").data("daterangepicker"),
            start,
            end
        );
    });

    $("input[name='datefilter']").on(
        "apply.daterangepicker",
        function (ev, picker) {
            $(this).val(
                picker.startDate.format("DD/MM/YYYY") +
                " - " +
                picker.endDate.format("DD/MM/YYYY")
            );
            filterTable(picker.startDate, picker.endDate);
        }
    );


    $("input[name='datefilter']").on(
        "cancel.daterangepicker",

        function (ev, picker) {
            $(this).val("");
            filterTable(null, null);
        }
    );

    function filterTable() {
        var startDate = $("#startDate").val();
        var endDate = $("#endDate").val();


        // Convert the selected start and end dates to moment objects
        startDate = startDate ? moment(startDate, "DD/MM/YYYY") : null;
        endDate = endDate ? moment(endDate, "DD/MM/YYYY") : null;

        // Loop through each table row and hide/show based on the date range
        $("tbody tr").each(function () {
            var rowDate = moment($(this).find("td:first-child").text(), "DD/MM/YYYY");
            if (
                (!startDate || rowDate.isSameOrAfter(startDate)) &&
                (!endDate || rowDate.isSameOrBefore(endDate))
            ) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }

    $("#filterButton").click(filterTable);


    // Single Date Picker
    $("input[name='singleDate']").daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        autoUpdateInput: true,
        isInvalidDate: function (date) {
            // Check if the date is denied
            return deniedDates.some((deniedDate) =>
                date.isSame(deniedDate, "day")
            );
        },
        locale: {
            format: "DD/MM/YYYY",
        },
    });

    $("input[name='singleDate']").on(
        "apply.daterangepicker",
        function (ev, picker) {
            $(this).val(picker.startDate.format("DD/MM/YYYY"));
        }
    );

    $("input[name='singleDate']").on(
        "cancel.daterangepicker",
        function (ev, picker) {
            $(this).val("");
        }
    );

    $("#manualDateEntry").on("click", function (e) {
        e.stopPropagation();
        $(this).toggleClass("show");
    });

    $("#manualDate").on("input", function () {
        updateCalendar();
    });

    $(document).on("click", function (e) {
        if (
            !$("#manualDateEntry").is(e.target) &&
            $("#manualDateEntry").has(e.target).length === 0
        ) {
            $("#manualDateEntry").removeClass("show");
        }
    });

    // Custom Dropdown Actions
    $("#last3Days").on("click", function (e) {
        e.preventDefault();
        var startDate = moment().subtract(3, "days").startOf("day");
        var endDate = moment().endOf("day");
        picker.data("daterangepicker").setStartDate(startDate);
        picker.data("daterangepicker").setEndDate(endDate);
        picker.data("daterangepicker").hide();
        cb.call(
            $("input[name='datefilter']").data("daterangepicker"),
            startDate,
            endDate
        );
        filterTable(startDate, endDate);
    });

    $("#next3Days").on("click", function (e) {
        e.preventDefault();
        var startDate = moment().startOf("day");
        var endDate = moment().add(3, "days").endOf("day");
        picker.data("daterangepicker").setStartDate(startDate);
        picker.data("daterangepicker").setEndDate(endDate);
        picker.data("daterangepicker").hide();
        cb.call(
            $("input[name='datefilter']").data("daterangepicker"),
            startDate,
            endDate
        );
        filterTable(startDate, endDate);
    });

    // Other Dropdown Actions
    $("#today").on("click", function (e) {
        e.preventDefault();
        var startDate = moment().startOf("day");
        var endDate = moment().endOf("day");
        picker.data("daterangepicker").setStartDate(startDate);
        picker.data("daterangepicker").setEndDate(endDate);
        picker.data("daterangepicker").hide();
        cb.call(
            $("input[name='datefilter']").data("daterangepicker"),
            startDate,
            endDate
        );
        filterTable(startDate, endDate);
    });

    $("#yesterday").on("click", function (e) {
        e.preventDefault();
        var startDate = moment()
            .subtract(1, "days")
            .startOf("day");
        var endDate = moment().subtract(1, "days").endOf("day");
        picker.data("daterangepicker").setStartDate(startDate);
        picker.data("daterangepicker").setEndDate(endDate);
        picker.data("daterangepicker").hide();
        cb.call(
            $("input[name='datefilter']").data("daterangepicker"),
            startDate,
            endDate
        );
        filterTable(startDate, endDate);
    });

    $("#lastWeek").on("click", function (e) {
        e.preventDefault();
        var startDate = moment()
            .subtract(1, "weeks")
            .startOf("week")
            .startOf("day");
        var endDate = moment().subtract(1, "weeks").endOf("week").endOf("day");
        picker.data("daterangepicker").setStartDate(startDate);
        picker.data("daterangepicker").setEndDate(endDate);
        picker.data("daterangepicker").hide();
        cb.call(
            $("input[name='datefilter']").data("daterangepicker"),
            startDate,
            endDate
        );
        filterTable(startDate, endDate);
    });

    function updateCalendar() {
        var dateInputValue = $("#manualDate").val();
        var dateRange = dateInputValue.split("-").map((date) => date.trim());
        var startDate = moment(dateRange[0], "DD/MM/YYYY");
        var endDate = moment(dateRange[1], "DD/MM/YYYY");
        picker.data("daterangepicker").setStartDate(startDate);
        picker.data("daterangepicker").setEndDate(endDate);
        picker.data("daterangepicker").hide();
        cb.call(
            $("input[name='datefilter']").data("daterangepicker"),
            startDate,
            endDate
        );
        filterTable(startDate, endDate);
    }

    function handleDateInput(event) {
        if (event.key === "Enter") {
            const input = event.target.value.trim();

            if (input.includes("-")) {
                // Handle date range input
                const dates = input.split("-").map((date) => date.trim());
                const isValidRange =
                    dates.length === 2 &&
                    isValidDate(dates[0]) &&
                    isValidDate(dates[1]);

                if (isValidRange) {
                    event.target.value = input;
                    filterTable(dates[0], dates[1]);
                } else {
                    // Invalid date range, clear the input field
                    event.target.value = "";
                    filterTable(null, null);
                }
            } else {
                // Handle single date input
                if (isValidDate(input)) {
                    const formattedDate = input + " - " + input;
                    event.target.value = formattedDate;
                    filterTable(input, input);
                } else {
                    // Invalid date, clear the input field
                    event.target.value = "";
                    filterTable(null, null);
                }

                event.preventDefault();
            }
        }
    }

    function isValidDate(date) {
        // Regular expression pattern to validate date format (DD/MM/YYYY)
        const datePattern = /^\d{2}\/\d{2}\/\d{4}$/;
        return datePattern.test(date);
    }

    function denyDate(date) {
        // Add the denied date to the array
        deniedDates.push(moment(date, "DD/MM/YYYY"));
    }

    function removeDeniedDate(date) {
        // Remove the denied date from the array
        deniedDates = deniedDates.filter(
            (deniedDate) =>
                !deniedDate.isSame(moment(date, "DD/MM/YYYY"), "day")
        );
    }

    $("input[name='manualDate']").on("keydown", handleDateInput);
});
$(function() {
    function sortTable(columnIndex, sortOrder) {
        var tbody = $("#data-table tbody");
        var rows = tbody.find("tr").get();

        rows.sort(function(a, b) {
            var aValue = $(a).find("td").eq(columnIndex).text();
            var bValue = $(b).find("td").eq(columnIndex).text();

            if (sortOrder === "asc") {
                return new Date(aValue.split('/').reverse().join('/')) - new Date(bValue.split('/').reverse().join('/'));
            } else {
                return new Date(bValue.split('/').reverse().join('/')) - new Date(aValue.split('/').reverse().join('/'));
            }
        });

        tbody.empty();
        $.each(rows, function(index, row) {
            tbody.append(row);
        });
    }

    $("th.sortable").on("click", function() {
        var sortOrder = $(this).data("sort");
        var columnIndex = $(this).index();

        if (sortOrder === "asc") {
            $(this).data("sort", "desc");
            $(this).text("Date ▼");
        } else {
            $(this).data("sort", "asc");
            $(this).text("Date ▲");
        }

        sortTable(columnIndex, sortOrder);
    });
});