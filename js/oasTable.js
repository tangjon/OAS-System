var data = (function () {
    var memberList;
    var sortedmemberList;
    var fixedHeaders = ['Actions', 'Level', 'Last', 'First', 'Section'];

    // Subscribe to changes on memberlist
    events.on('memberPull', updateMemberList);

    // Fetch member objects
    function updateMemberList(value) {
        memberList = value;
    }

    function getMemberList() {
        return memberList;
    }

    function getFixedHeaders() {
        return fixedHeaders;
    }
    // Support only last name
    function getSortedKeys() {
        var sortKey = [];
        for (var key in memberList) {
            sortKey.push([key, memberList[key].lname]);
        }
        sortKey.sort(function (a, b) {
            var x = a[1].toLowerCase();
            var y = b[1].toLowerCase();
            return x < y ? -1 : x > y ? 1 : 0;
        });

        // Filter out the keys
        var result = [];
        sortKey.forEach(function (element) {
            result.push(element[0]);
        }, this);
        return result;
    }


    return {
        getMemberList: getMemberList,
        getFixedHeaders: getFixedHeaders,
        getSortedKeys: getSortedKeys
    }

})();




var oasTable = (function () {

    // Cache dom
    var tbl = $("table#my-badge-table");
    var table = doc.getElementById("my-badge-table");
    var view = "all"
    var initailized = false;


    // Subscribe to changes on memberlist
    events.on('updateView', updateView);
    events.on('memberPull', render);

    function generateHeader() {
        // TODO : Currently only reading from scout badges...
        var thead = tbl.find('thead');
        var tr = $('<tr></tr>');
        db.ref('badge_info/scout_badges').once("value", function (snapshot) {
            var fixedHeaders = data.getFixedHeaders();
            fixedHeaders.forEach(function (element) {
                tr.append($('<th>' + element + '</th>').attr('class', 'mdl-data-table__cell sort').attr('data-sort', element.toLowerCase()));
            }, this);
            var object = snapshot.val();
            for (var key in object) {
                if (object.hasOwnProperty(key)) {
                    var element = object[key].name;
                    tr.append($('<th>' + element + '</th>'));
                }
            }
            thead.append(tr);
            // tbl.append(thead);
        });
        initailized = true;
    }

    function updateView(newView) {
        if (view !== newView) {
            view = newView;
            initailized = false;
            destroyTable();
            render();
        }

    }

    function generateBody() {
        var members = data.getMemberList();
        var tbody = tbl.children('tbody');
        var sKey = data.getSortedKeys();
        sKey.forEach(function (key) {
            if (members.hasOwnProperty(key)) {
                var member = members[key];
                // console.log(members[key].key)
                generateRow(member, key);
            }
        }, this);


    }

    function generateRow(member, key) {
        if (view == member.section || view == 'all') {
            // Insert Rows with id
            var tr = $('<tr></tr>').attr('id', key);
            // ACTIONS
            tr.append(generateEditTools());
            // OAS LEVEL
            tr.append($('<td></td>').attr('class', 'mdl-data-table__cell level').attr('data-sort', 'level').append(calculateOASLevel(member)));
            // MEMBER LAST 
            tr.append($('<td></td>').attr('class', 'last').append(member.lname));
            // MEMBER FIRST
            tr.append($('<td></td>').attr('class', 'first').append(member.fname));
            // MEMBER SECION
            var sectionBadge = $('<div></div>').attr('class', 'section-banner ' + 'section-banner--' + member.section)
                .append(member.section.toUpperCase());
            tr.append($('<td></td>').attr('class', 'section').append(sectionBadge));

            // Decide which badges to show
            var badge_catalogue;
            switch (member.section) {
                case 'beaver':
                    badge_catalogue = member.beaver_badges;
                    break;
                case 'cub':
                    badge_catalogue = member.cub_badges;
                    break;
                case 'scout':
                    badge_catalogue = member.scout_badges;
                    break;
            }
            for (var badgekey in badge_catalogue) {
                if (badge_catalogue.hasOwnProperty(badgekey)) {
                    var badge = badge_catalogue[badgekey];
                    // Setup SELECT
                    var select = $('<select></select>').attr({
                        class: 'mdl-selectfield__select',
                        id: key + ' ' + badgekey,
                        onchange: 'handleSelectBox(this)'
                    });
                    // Spinner Values
                    if (member.section != "beaver") {
                        for (var i = 0; i <= 9; i++) {
                            var opt = $('<option></option>');
                            opt.val(i);
                            opt.append(i);
                            select.append(opt);
                        }
                    } else {
                        for (var i = 0; i <= 3; i++) {
                            var opt = $('<option></option>');
                            opt.val(i);
                            opt.append(i);
                            select.append(opt);
                        }
                    }
                    // Set Spinner value to current member level
                    select.val(badge.level);
                    tr.append($('<td></td>').attr('class', badgekey).append(select));
                }
            }
            tbl.children('tbody').append(tr);
        }


    }

    function calculateOASLevel(member) {

        var oas_level = 0;
        var member_badge_catalogue;
        var list = [];
        if (member.beaver_badges) {
            list.push(member.beaver_badges);
        }
        if (member.cub_badges) {
            list.push(member.cub_badges);
        }
        if (member.scout_badges) {
            list.push(member.scout_badges);
        }

        list.forEach(function (element) {
            for (var badge in element) {
                oas_level += parseInt(element[badge].level);
            }
        }, this);

        return oas_level;
    }

    function destroyTable() {
        tbl.children('tbody').children().remove();
        tbl.children('thead').children().remove();
    }



    function generateEditTools() {
        var element = $("<td></td>", {
            id: "edit-tools"
        });

        // Delete button
        var dBtn = $('<button></button>', {
            text: 'X',
            id: 'deleteMemberBtn',
            click: function () {
                handleRemovalButton(this);
            }
        })

        var editBtn = $('<button></button>', {
            text: 'Edit',
            id: 'editMemberBtn',
            click: function () {
                handleEditBtn(this);
            }
        })

        var migrateBtn = $('<button></button>', {
            text: 'Migrate',
            id: 'migrateMemberBtn'
        })
        element[0].append(dBtn[0]);
        element[0].append(editBtn[0]);
        element[0].append(migrateBtn[0]);


        // Edit Button
        return element[0];
    }




    function render() {

        if (!initailized) {
            generateHeader();
            generateBody();
        }

        setTimeout(function () {
            console.log('loaded!')
            var lowHeaders = lowerArr(data.getFixedHeaders());
            var boptions = {
                valueNames: lowHeaders
            }, documentTable = new List('my-badge-table', boptions);

            function lowerArr(arr) {
                var lower = [];
                arr.forEach(function (element) {
                    lower.push(element.toLowerCase());
                }, this);
                return lower;
            }

        }, 100);

    }



    return {
        generateRow: generateRow
    }
})();



var options = {
    valueNames: ['material', 'quantity', 'price']
}
    , documentTable = new List('mdl-table', options)
    ;